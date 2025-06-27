/**
 * Tasks Routes
 * Handles task-related API endpoints
 */

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const { verifyToken, requireRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * Get all tasks with optional filtering
 * GET /api/v1/tasks
 */
router.get('/', verifyToken, [
  query('status').optional().isIn(['pending', 'in_progress', 'review', 'completed', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('assignedTo').optional().isUUID(),
  query('projectId').optional().isUUID(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  handleValidationErrors
], async (req, res) => {
  try {
    const { prisma } = req.app.locals;
    const { 
      status, 
      priority, 
      assignedTo, 
      projectId, 
      page = 1, 
      limit = 20,
      search
    } = req.query;

    // Build filter conditions
    const where = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (projectId) where.projectId = projectId;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get tasks with related data
    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        include: {
          project: {
            select: { id: true, name: true, status: true }
          },
          assignedUser: {
            select: { id: true, firstName: true, lastName: true, email: true }
          },
          createdBy: {
            select: { id: true, firstName: true, lastName: true }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.task.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        pages: totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      error: 'Failed to fetch tasks',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get single task by ID
 * GET /api/v1/tasks/:id
 */
router.get('/:id', verifyToken, [
  param('id').isUUID(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { prisma } = req.app.locals;
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, status: true, type: true }
        },
        assignedUser: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        attachments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
        message: `Task with ID ${id} does not exist`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: task,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      error: 'Failed to fetch task',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Create new task
 * POST /api/v1/tasks
 */
router.post('/', verifyToken, requireRole(['admin', 'project_manager', 'designer']), [
  body('name').isLength({ min: 1, max: 200 }).trim(),
  body('description').optional().isLength({ max: 2000 }).trim(),
  body('projectId').isUUID(),
  body('assignedTo').optional().isUUID(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601(),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  handleValidationErrors
], async (req, res) => {
  try {
    const { prisma, auditService } = req.app.locals;
    const { 
      name, 
      description, 
      projectId, 
      assignedTo, 
      priority = 'medium',
      dueDate,
      estimatedHours 
    } = req.body;

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: `Project with ID ${projectId} does not exist`,
        timestamp: new Date().toISOString()
      });
    }

    // Verify assigned user exists if provided
    if (assignedTo) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedTo }
      });

      if (!assignedUser) {
        return res.status(404).json({
          error: 'Assigned user not found',
          message: `User with ID ${assignedTo} does not exist`,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        name,
        description,
        projectId,
        assignedTo,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours,
        status: 'pending',
        progress: 0,
        createdById: req.user.id
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        assignedUser: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    // Log audit event
    await auditService.logDataChange({
      userId: req.user.id,
      action: 'create',
      tableName: 'task',
      recordId: task.id,
      newData: task,
      description: `Created task: ${task.name}`
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      error: 'Failed to create task',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Update task
 * PUT /api/v1/tasks/:id
 */
router.put('/:id', verifyToken, [
  param('id').isUUID(),
  body('name').optional().isLength({ min: 1, max: 200 }).trim(),
  body('description').optional().isLength({ max: 2000 }).trim(),
  body('assignedTo').optional().isUUID(),
  body('status').optional().isIn(['pending', 'in_progress', 'review', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601().toDate(),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  body('actualHours').optional().isFloat({ min: 0 }),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  handleValidationErrors
], async (req, res) => {
  try {
    const { prisma, auditService } = req.app.locals;
    const { id } = req.params;
    const updateData = req.body;

    // Get existing task
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return res.status(404).json({
        error: 'Task not found',
        message: `Task with ID ${id} does not exist`,
        timestamp: new Date().toISOString()
      });
    }

    // Verify assigned user exists if provided
    if (updateData.assignedTo) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: updateData.assignedTo }
      });

      if (!assignedUser) {
        return res.status(404).json({
          error: 'Assigned user not found',
          message: `User with ID ${updateData.assignedTo} does not exist`,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: { id: true, name: true }
        },
        assignedUser: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    // Log audit event
    await auditService.logDataChange({
      userId: req.user.id,
      action: 'update',
      tableName: 'task',
      recordId: id,
      oldData: existingTask,
      newData: updatedTask,
      description: `Updated task: ${updatedTask.name}`
    });

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      error: 'Failed to update task',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Delete task
 * DELETE /api/v1/tasks/:id
 */
router.delete('/:id', verifyToken, requireRole(['admin', 'project_manager']), [
  param('id').isUUID(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { prisma, auditService } = req.app.locals;
    const { id } = req.params;

    // Get existing task
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return res.status(404).json({
        error: 'Task not found',
        message: `Task with ID ${id} does not exist`,
        timestamp: new Date().toISOString()
      });
    }

    // Delete task
    await prisma.task.delete({
      where: { id }
    });

    // Log audit event
    await auditService.logDataChange({
      userId: req.user.id,
      action: 'delete',
      tableName: 'task',
      recordId: id,
      oldData: existingTask,
      description: `Deleted task: ${existingTask.name}`
    });

    res.json({
      success: true,
      message: 'Task deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      error: 'Failed to delete task',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get tasks for current user
 * GET /api/v1/tasks/my-tasks
 */
router.get('/my-tasks', verifyToken, async (req, res) => {
  try {
    const { prisma } = req.app.locals;
    const userId = req.user.id;

    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: userId
      },
      include: {
        project: {
          select: { id: true, name: true, status: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Group tasks by status
    const tasksByStatus = {
      pending: tasks.filter(t => t.status === 'pending'),
      in_progress: tasks.filter(t => t.status === 'in_progress'),
      review: tasks.filter(t => t.status === 'review'),
      completed: tasks.filter(t => t.status === 'completed')
    };

    res.json({
      success: true,
      data: {
        tasks,
        tasksByStatus,
        summary: {
          total: tasks.length,
          pending: tasksByStatus.pending.length,
          in_progress: tasksByStatus.in_progress.length,
          review: tasksByStatus.review.length,
          completed: tasksByStatus.completed.length
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({
      error: 'Failed to fetch user tasks',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;