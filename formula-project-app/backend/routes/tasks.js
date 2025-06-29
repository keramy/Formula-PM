/**
 * Tasks Routes
 * Handles task-related API endpoints with comprehensive error handling
 */

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const { verifyToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { 
  asyncHandler, 
  successResponse, 
  paginatedResponse,
  NotFoundError,
  ConflictError,
  AuthorizationError,
  ValidationError,
  dbOperation
} = require('../middleware/errorHandler');

// Apply authentication to all task routes (bypass in development)
if (process.env.NODE_ENV !== 'development') {
  router.use(verifyToken);
} else {
  // Development bypass - add mock user to req
  router.use((req, res, next) => {
    req.user = {
      id: 'demo-user',
      email: 'demo@formulapm.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin'
    };
    next();
  });
}

/**
 * Get all tasks with optional filtering
 * GET /api/v1/tasks
 */
router.get('/', [
  query('status').optional().isIn(['pending', 'in_progress', 'review', 'completed', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('assignedTo').optional().isUUID(),
  query('projectId').optional().isUUID(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { 
    status, 
    priority, 
    assignedTo, 
    projectId, 
    page = 1, 
    limit = 20,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  const { prisma } = req.app.locals;
  const currentUser = req.user;

  // Build filter conditions with role-based access control
  const where = {};
  
  // Apply role-based filtering
  if (currentUser.role === 'client') {
    // Clients can only see tasks from their projects
    where.project = { clientId: currentUser.id };
  } else if (currentUser.role === 'designer' || currentUser.role === 'engineer') {
    // Designers/Engineers see tasks assigned to them or in their projects
    where.OR = [
      { assignedTo: currentUser.id },
      { project: { teamMembers: { some: { userId: currentUser.id } } } }
    ];
  } else if (currentUser.role === 'project_manager') {
    // Project managers see tasks from their managed projects
    where.OR = [
      { assignedTo: currentUser.id },
      { project: { projectManagerId: currentUser.id } },
      { project: { teamMembers: { some: { userId: currentUser.id } } } }
    ];
  }
  // Admins see all tasks (no additional filtering)
  
  // Apply additional filters
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (assignedTo) where.assignedTo = assignedTo;
  if (projectId) where.projectId = projectId;
  
  if (search) {
    where.OR = [
      ...(where.OR || []),
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Get tasks with related data
  const [tasks, totalCount] = await Promise.all([
    dbOperation(async () => {
      return await prisma.task.findMany({
        where,
        skip,
        take,
        include: {
          project: {
            select: { id: true, name: true, status: true, type: true }
          },
          assignedUser: {
            select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true }
          },
          createdBy: {
            select: { id: true, firstName: true, lastName: true }
          },
          _count: {
            comments: true,
            attachments: true
          }
        },
        orderBy: { [sortBy]: sortOrder }
      });
    }),
    dbOperation(async () => {
      return await prisma.task.count({ where });
    })
  ]);

  paginatedResponse(res, tasks, {
    page: parseInt(page),
    limit: parseInt(limit),
    total: totalCount
  }, 'Tasks retrieved successfully');
}));

/**
 * Get single task by ID
 * GET /api/v1/tasks/:id
 */
router.get('/:id', [
  param('id').isUUID(),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prisma } = req.app.locals;
  const currentUser = req.user;

  const task = await dbOperation(async () => {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { 
            id: true, 
            name: true, 
            status: true, 
            type: true,
            clientId: true,
            projectManagerId: true,
            teamMembers: {
              select: { userId: true }
            }
          }
        },
        assignedUser: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true, avatarUrl: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        attachments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  });

  if (!task) {
    throw new NotFoundError('Task');
  }

  // Check access permissions
  const hasAccess = currentUser.role === 'admin' ||
                   task.assignedTo === currentUser.id ||
                   task.createdById === currentUser.id ||
                   task.project?.clientId === currentUser.id ||
                   task.project?.projectManagerId === currentUser.id ||
                   task.project?.teamMembers?.some(tm => tm.userId === currentUser.id);

  if (!hasAccess) {
    throw new AuthorizationError('Access denied to this task');
  }

  successResponse(res, task, 'Task retrieved successfully');
}));

/**
 * Create new task
 * POST /api/v1/tasks
 */
router.post('/', requireRole(['admin', 'project_manager', 'designer']), [
  body('name').isLength({ min: 1, max: 200 }).trim(),
  body('description').optional().isLength({ max: 2000 }).trim(),
  body('projectId').isUUID(),
  body('assignedTo').optional().isUUID(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601(),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    projectId, 
    assignedTo, 
    priority = 'medium',
    dueDate,
    estimatedHours 
  } = req.body;

  const currentUser = req.user;
  const { prisma } = req.app.locals;

  // Verify project exists and user has access
  const project = await dbOperation(async () => {
    return await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        status: true,
        clientId: true,
        projectManagerId: true,
        teamMembers: {
          select: { userId: true }
        }
      }
    });
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  // Check if user can create tasks for this project
  const canCreateTask = currentUser.role === 'admin' ||
                       project.projectManagerId === currentUser.id ||
                       project.teamMembers.some(tm => tm.userId === currentUser.id);

  if (!canCreateTask) {
    throw new AuthorizationError('Insufficient permissions to create tasks for this project');
  }

  // Verify assigned user exists and has access to project if provided
  if (assignedTo) {
    const assignedUser = await dbOperation(async () => {
      return await prisma.user.findUnique({
        where: { id: assignedTo },
        select: { id: true, firstName: true, lastName: true, status: true, role: true }
      });
    });

    if (!assignedUser) {
      throw new NotFoundError('Assigned user');
    }

    if (assignedUser.status !== 'active') {
      throw new ValidationError('Assigned user account is not active');
    }

    // Check if assigned user has access to the project
    const userHasProjectAccess = currentUser.role === 'admin' ||
                                assignedTo === project.projectManagerId ||
                                project.teamMembers.some(tm => tm.userId === assignedTo);

    if (!userHasProjectAccess) {
      throw new ValidationError('Assigned user does not have access to this project');
    }
  }

  // Create task
  const task = await dbOperation(async () => {
    return await prisma.task.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        projectId,
        assignedTo,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        status: 'pending',
        progress: 0,
        createdById: currentUser.id
      },
      include: {
        project: {
          select: { id: true, name: true, status: true }
        },
        assignedUser: {
          select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  // Log audit event
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logDataChange({
        userId: currentUser.id,
        action: 'create',
        tableName: 'task',
        recordId: task.id,
        newData: task,
        description: `Created task: ${task.name}`,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (auditError) {
      console.error('Failed to log task creation:', auditError);
    }
  }

  successResponse(res, task, 'Task created successfully', 201);
}));

/**
 * Update task
 * PUT /api/v1/tasks/:id
 */
router.put('/:id', [
  param('id').isUUID(),
  body('name').optional().isLength({ min: 1, max: 200 }).trim(),
  body('description').optional().isLength({ max: 2000 }).trim(),
  body('assignedTo').optional().isUUID(),
  body('status').optional().isIn(['pending', 'in_progress', 'review', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601(),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  body('actualHours').optional().isFloat({ min: 0 }),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  const { prisma } = req.app.locals;

  // Get existing task with access control data
  const existingTask = await dbOperation(async () => {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            clientId: true,
            projectManagerId: true,
            teamMembers: {
              select: { userId: true }
            }
          }
        }
      }
    });
  });

  if (!existingTask) {
    throw new NotFoundError('Task');
  }

  // Check update permissions
  const canUpdate = currentUser.role === 'admin' ||
                   existingTask.assignedTo === currentUser.id ||
                   existingTask.createdById === currentUser.id ||
                   existingTask.project?.projectManagerId === currentUser.id ||
                   existingTask.project?.teamMembers?.some(tm => tm.userId === currentUser.id);

  if (!canUpdate) {
    throw new AuthorizationError('Insufficient permissions to update this task');
  }

  // Prepare update data
  const allowedFields = [
    'name', 'description', 'assignedTo', 'status', 'priority', 
    'dueDate', 'estimatedHours', 'actualHours', 'progress'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key) && req.body[key] !== undefined) {
      if (key === 'estimatedHours' || key === 'actualHours') {
        updates[key] = req.body[key] ? parseFloat(req.body[key]) : null;
      } else if (key === 'dueDate') {
        updates[key] = req.body[key] ? new Date(req.body[key]) : null;
      } else if (typeof req.body[key] === 'string') {
        updates[key] = req.body[key].trim();
      } else {
        updates[key] = req.body[key];
      }
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('No valid updates provided');
  }

  // Verify assigned user exists if being updated
  if (updates.assignedTo) {
    const assignedUser = await dbOperation(async () => {
      return await prisma.user.findUnique({
        where: { id: updates.assignedTo },
        select: { id: true, status: true }
      });
    });

    if (!assignedUser) {
      throw new NotFoundError('Assigned user');
    }

    if (assignedUser.status !== 'active') {
      throw new ValidationError('Assigned user account is not active');
    }
  }

  // Auto-update progress based on status
  if (updates.status) {
    const statusProgressMap = {
      'pending': 0,
      'in_progress': updates.progress || existingTask.progress || 25,
      'review': 90,
      'completed': 100,
      'cancelled': existingTask.progress
    };
    
    if (!updates.progress) {
      updates.progress = statusProgressMap[updates.status];
    }
  }

  // Update task
  const updatedTask = await dbOperation(async () => {
    return await prisma.task.update({
      where: { id },
      data: updates,
      include: {
        project: {
          select: { id: true, name: true, status: true }
        },
        assignedUser: {
          select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  // Log audit event
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logDataChange({
        userId: currentUser.id,
        action: 'update',
        tableName: 'task',
        recordId: id,
        oldData: existingTask,
        newData: updatedTask,
        description: `Updated task: ${updatedTask.name}`,
        changes: updates,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (auditError) {
      console.error('Failed to log task update:', auditError);
    }
  }

  successResponse(res, updatedTask, 'Task updated successfully');
}));

/**
 * Delete task
 * DELETE /api/v1/tasks/:id
 */
router.delete('/:id', requireRole(['admin', 'project_manager']), [
  param('id').isUUID(),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  const { prisma } = req.app.locals;

  // Get existing task with project information
  const existingTask = await dbOperation(async () => {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            projectManagerId: true,
            createdBy: true
          }
        }
      }
    });
  });

  if (!existingTask) {
    throw new NotFoundError('Task');
  }

  // Check delete permissions (stricter than update)
  const canDelete = currentUser.role === 'admin' ||
                   (currentUser.role === 'project_manager' && 
                    (existingTask.project?.projectManagerId === currentUser.id ||
                     existingTask.createdById === currentUser.id));

  if (!canDelete) {
    throw new AuthorizationError('Insufficient permissions to delete this task');
  }

  // Check if task can be safely deleted
  if (existingTask.status === 'in_progress') {
    throw new ValidationError('Cannot delete task that is currently in progress. Please change status first.');
  }

  // Delete task
  await dbOperation(async () => {
    return await prisma.task.delete({
      where: { id }
    });
  });

  // Log audit event
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logDataChange({
        userId: currentUser.id,
        action: 'delete',
        tableName: 'task',
        recordId: id,
        oldData: existingTask,
        description: `Deleted task: ${existingTask.name}`,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (auditError) {
      console.error('Failed to log task deletion:', auditError);
    }
  }

  successResponse(res, null, 'Task deleted successfully');
}));

/**
 * Get tasks for current user
 * GET /api/v1/tasks/my-tasks
 */
router.get('/my-tasks', asyncHandler(async (req, res) => {
  const { prisma } = req.app.locals;
  const userId = req.user.id;
  const { status, priority, overdue } = req.query;

  // Build where clause
  const where = {
    assignedTo: userId
  };

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (overdue === 'true') {
    where.dueDate = {
      lt: new Date()
    };
    where.status = {
      notIn: ['completed', 'cancelled']
    };
  }

  const tasks = await dbOperation(async () => {
    return await prisma.task.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true, status: true, type: true }
        },
        _count: {
          comments: true,
          attachments: true
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  });

  // Group tasks by status
  const tasksByStatus = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed'),
    cancelled: tasks.filter(t => t.status === 'cancelled')
  };

  // Calculate additional metrics
  const now = new Date();
  const overdueTasks = tasks.filter(t => 
    t.dueDate && 
    new Date(t.dueDate) < now && 
    !['completed', 'cancelled'].includes(t.status)
  );
  
  const dueSoon = tasks.filter(t => {
    if (!t.dueDate || ['completed', 'cancelled'].includes(t.status)) return false;
    const dueDate = new Date(t.dueDate);
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    return dueDate <= threeDaysFromNow && dueDate >= now;
  });

  const responseData = {
    tasks,
    tasksByStatus,
    summary: {
      total: tasks.length,
      pending: tasksByStatus.pending.length,
      in_progress: tasksByStatus.in_progress.length,
      review: tasksByStatus.review.length,
      completed: tasksByStatus.completed.length,
      cancelled: tasksByStatus.cancelled.length,
      overdue: overdueTasks.length,
      dueSoon: dueSoon.length
    },
    overdueTasks: overdueTasks.slice(0, 5), // First 5 overdue tasks
    dueSoonTasks: dueSoon.slice(0, 5) // Next 5 tasks due soon
  };

  successResponse(res, responseData, 'User tasks retrieved successfully');
}));

module.exports = router;