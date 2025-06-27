/**
 * Projects Routes
 * Full project management with CRUD operations, team management, and project analytics
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const { 
  verifyToken, 
  requireRole, 
  requirePermission,
  requireProjectAccess 
} = require('../middleware/auth');

const { 
  validateCreateProject, 
  validateUpdateProject, 
  validateUUIDParam,
  validatePagination 
} = require('../middleware/validation');

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

const router = express.Router();

// Apply authentication to all project routes
router.use(verifyToken);

/**
 * GET /api/v1/projects
 * Get list of projects with pagination, filtering, and access control
 */
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sortBy = 'updatedAt',
    sortOrder = 'desc',
    status,
    type,
    priority,
    clientId,
    search
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  const currentUser = req.user;

  // Build where clause based on user role and permissions
  let where = {};
  
  // Apply role-based filtering
  if (currentUser.role === 'client') {
    // Clients can only see their own projects
    where.clientId = currentUser.id;
  } else if (currentUser.role === 'project_manager') {
    // Project managers see projects they manage or are team members of
    where.OR = [
      { projectManagerId: currentUser.id },
      { teamMembers: { some: { userId: currentUser.id } } }
    ];
  } else if (currentUser.role !== 'admin') {
    // Other roles see projects they're team members of
    where.teamMembers = { some: { userId: currentUser.id } };
  }

  // Apply filters
  if (status) {
    where.status = status;
  }
  
  if (type) {
    where.type = type;
  }
  
  if (priority) {
    where.priority = priority;
  }
  
  if (clientId) {
    where.clientId = clientId;
  }
  
  if (search) {
    where.OR = [
      ...(where.OR || []),
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Get projects and total count
  const { prisma } = req.app.locals;
  const [projects, total] = await Promise.all([
    dbOperation(async () => {
      return await prisma.project.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          status: true,
          priority: true,
          budget: true,
          startDate: true,
          endDate: true,
          progress: true,
          location: true,
          createdAt: true,
          updatedAt: true,
          client: {
            select: {
              id: true,
              name: true,
              companyName: true
            }
          },
          projectManager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            tasks: true,
            teamMembers: true,
            scopeItems: true,
            shopDrawings: true,
            materialSpecs: true
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take
      });
    }),
    dbOperation(async () => {
      return await prisma.project.count({ where });
    })
  ]);

  paginatedResponse(res, projects, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Projects retrieved successfully');
}));

/**
 * GET /api/v1/projects/:id
 * Get project by ID with detailed information
 */
router.get('/:id', validateUUIDParam('id'), requireProjectAccess, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  const { prisma } = req.app.locals;

  const project = await dbOperation(async () => {
    return await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        status: true,
        priority: true,
        budget: true,
        startDate: true,
        endDate: true,
        progress: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        client: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            phone: true,
            contactPerson: true
          }
        },
        projectManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            position: true
          }
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        teamMembers: {
          select: {
            role: true,
            assignedAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                position: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { assignedAt: 'asc' }
        },
        _count: {
          tasks: true,
          scopeGroups: true,
          scopeItems: true,
          shopDrawings: true,
          materialSpecs: true,
          comments: true
        }
      }
    });
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  // Get additional statistics
  const [taskStats, scopeProgress, recentActivity] = await Promise.all([
    // Task statistics
    dbOperation(async () => {
      return await prisma.task.groupBy({
        by: ['status'],
        where: { projectId: id },
        _count: { id: true }
      });
    }),
    // Scope progress
    dbOperation(async () => {
      return await prisma.scopeItem.aggregate({
        where: { projectId: id },
        _avg: { completionPercentage: true },
        _sum: { estimatedCost: true, actualCost: true }
      });
    }),
    // Recent activity (last 10 activities)
    dbOperation(async () => {
      const [recentTasks, recentComments] = await Promise.all([
        prisma.task.findMany({
          where: { projectId: id },
          select: {
            id: true,
            name: true,
            status: true,
            updatedAt: true,
            assignee: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { updatedAt: 'desc' },
          take: 5
        }),
        prisma.comment.findMany({
          where: { entityId: id, entityType: 'project' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        })
      ]);

      return [...recentTasks, ...recentComments]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 10);
    })
  ]);

  // Format task statistics
  const taskStatistics = {
    total: taskStats.reduce((sum, stat) => sum + stat._count.id, 0),
    by_status: taskStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {})
  };

  // Add computed fields
  project.statistics = {
    tasks: taskStatistics,
    scope: {
      averageCompletion: scopeProgress._avg.completionPercentage || 0,
      estimatedCost: scopeProgress._sum.estimatedCost || 0,
      actualCost: scopeProgress._sum.actualCost || 0
    },
    teamSize: project.teamMembers.length,
    recentActivity
  };

  successResponse(res, project, 'Project retrieved successfully');
}));

/**
 * POST /api/v1/projects
 * Create a new project
 */
router.post('/', requirePermission('manage_projects'), validateCreateProject, asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    type, 
    priority = 'medium',
    budget,
    startDate,
    endDate,
    location,
    clientId,
    projectManagerId,
    teamMembers = []
  } = req.body;

  const currentUser = req.user;
  const { prisma } = req.app.locals;

  // Validate client exists
  const client = await dbOperation(async () => {
    return await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, name: true }
    });
  });

  if (!client) {
    throw new NotFoundError('Client');
  }

  // Validate project manager if specified
  if (projectManagerId) {
    const projectManager = await dbOperation(async () => {
      return await prisma.user.findUnique({
        where: { id: projectManagerId },
        select: { id: true, role: true, status: true }
      });
    });

    if (!projectManager) {
      throw new NotFoundError('Project manager');
    }

    if (projectManager.role !== 'project_manager' && projectManager.role !== 'admin') {
      throw new ValidationError('Selected user is not a project manager');
    }

    if (projectManager.status !== 'active') {
      throw new ValidationError('Project manager account is not active');
    }
  }

  // Validate date range
  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    throw new ValidationError('Start date must be before end date');
  }

  // Create project with transaction
  const project = await dbOperation(async () => {
    return await prisma.$transaction(async (tx) => {
      // Create project
      const newProject = await tx.project.create({
        data: {
          name: name.trim(),
          description: description?.trim(),
          type,
          priority,
          budget: budget ? parseFloat(budget) : null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          location: location?.trim(),
          clientId,
          projectManagerId,
          createdBy: currentUser.id,
          status: 'draft'
        },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          status: true,
          priority: true,
          budget: true,
          startDate: true,
          endDate: true,
          location: true,
          createdAt: true,
          client: {
            select: { id: true, name: true, companyName: true }
          },
          projectManager: {
            select: { id: true, firstName: true, lastName: true, email: true }
          },
          creator: {
            select: { id: true, firstName: true, lastName: true }
          }
        }
      });

      // Add team members if specified
      if (teamMembers.length > 0) {
        const teamMemberData = teamMembers.map(member => ({
          projectId: newProject.id,
          userId: member.userId,
          role: member.role || 'team_member'
        }));

        await tx.projectTeamMember.createMany({
          data: teamMemberData
        });
      }

      // Add project manager to team if not already included
      if (projectManagerId && !teamMembers.some(tm => tm.userId === projectManagerId)) {
        await tx.projectTeamMember.create({
          data: {
            projectId: newProject.id,
            userId: projectManagerId,
            role: 'project_manager'
          }
        });
      }

      return newProject;
    });
  });

  // Log project creation
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'create_project',
        details: {
          projectId: project.id,
          projectName: project.name,
          clientId,
          projectManagerId,
          teamMemberCount: teamMembers.length,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log project creation:', auditError);
    }
  }

  successResponse(res, project, 'Project created successfully', 201);
}));

/**
 * PUT /api/v1/projects/:id
 * Update project by ID
 */
router.put('/:id', validateUUIDParam('id'), requireProjectAccess, validateUpdateProject, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  const { prisma } = req.app.locals;

  // Check if user can edit this project
  if (currentUser.role !== 'admin') {
    const project = await dbOperation(async () => {
      return await prisma.project.findUnique({
        where: { id },
        select: { projectManagerId: true, createdBy: true }
      });
    });

    if (!project) {
      throw new NotFoundError('Project');
    }

    if (project.projectManagerId !== currentUser.id && 
        project.createdBy !== currentUser.id && 
        currentUser.role !== 'project_manager') {
      throw new AuthorizationError('Insufficient permissions to edit this project');
    }
  }

  const allowedFields = [
    'name', 'description', 'type', 'status', 'priority', 
    'budget', 'startDate', 'endDate', 'progress', 'location', 
    'projectManagerId'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key) && req.body[key] !== undefined) {
      if (key === 'budget') {
        updates[key] = req.body[key] ? parseFloat(req.body[key]) : null;
      } else if (key === 'startDate' || key === 'endDate') {
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

  // Validate date range if both dates are provided
  if (updates.startDate && updates.endDate && updates.startDate >= updates.endDate) {
    throw new ValidationError('Start date must be before end date');
  }

  // Validate project manager if being updated
  if (updates.projectManagerId) {
    const projectManager = await dbOperation(async () => {
      return await prisma.user.findUnique({
        where: { id: updates.projectManagerId },
        select: { id: true, role: true, status: true }
      });
    });

    if (!projectManager) {
      throw new NotFoundError('Project manager');
    }

    if (projectManager.role !== 'project_manager' && projectManager.role !== 'admin') {
      throw new ValidationError('Selected user is not a project manager');
    }

    if (projectManager.status !== 'active') {
      throw new ValidationError('Project manager account is not active');
    }
  }

  const project = await dbOperation(async () => {
    return await prisma.project.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        status: true,
        priority: true,
        budget: true,
        startDate: true,
        endDate: true,
        progress: true,
        location: true,
        updatedAt: true,
        client: {
          select: { id: true, name: true, companyName: true }
        },
        projectManager: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });
  });

  // Log project update
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'update_project',
        details: {
          projectId: id,
          projectName: project.name,
          updatedFields: Object.keys(updates),
          changes: updates,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log project update:', auditError);
    }
  }

  successResponse(res, project, 'Project updated successfully');
}));

/**
 * DELETE /api/v1/projects/:id
 * Delete project by ID (admin only)
 */
router.delete('/:id', requireRole('admin'), validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  const { prisma } = req.app.locals;

  const project = await dbOperation(async () => {
    return await prisma.project.findUnique({
      where: { id },
      select: { 
        id: true, 
        name: true,
        status: true,
        _count: {
          tasks: true,
          scopeItems: true,
          shopDrawings: true,
          materialSpecs: true
        }
      }
    });
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  // Check if project has active items
  const hasActiveItems = project._count.tasks > 0 || 
                        project._count.scopeItems > 0 || 
                        project._count.shopDrawings > 0 || 
                        project._count.materialSpecs > 0;

  if (hasActiveItems && project.status !== 'cancelled') {
    throw new ValidationError('Cannot delete project with active items. Cancel the project first.');
  }

  // Soft delete by setting status to cancelled
  if (hasActiveItems) {
    const cancelledProject = await dbOperation(async () => {
      return await prisma.project.update({
        where: { id },
        data: { status: 'cancelled' },
        select: {
          id: true,
          name: true,
          status: true
        }
      });
    });

    successResponse(res, cancelledProject, 'Project cancelled successfully');
  } else {
    // Hard delete if no active items
    await dbOperation(async () => {
      return await prisma.project.delete({
        where: { id }
      });
    });

    // Log project deletion
    if (req.app.locals.auditService) {
      try {
        await req.app.locals.auditService.logUserAction({
          userId: currentUser.id,
          action: 'delete_project',
          details: {
            projectId: id,
            projectName: project.name,
            ip: req.ip,
            userAgent: req.get('User-Agent')
          }
        });
      } catch (auditError) {
        console.error('Failed to log project deletion:', auditError);
      }
    }

    successResponse(res, null, 'Project deleted successfully');
  }
}));

/**
 * GET /api/v1/projects/:id/team
 * Get project team members
 */
router.get('/:id/team', validateUUIDParam('id'), requireProjectAccess, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prisma } = req.app.locals;

  const teamMembers = await dbOperation(async () => {
    return await prisma.projectTeamMember.findMany({
      where: { projectId: id },
      select: {
        role: true,
        assignedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            position: true,
            department: true,
            avatarUrl: true,
            phone: true,
            skills: true,
            _count: {
              assignedTasks: {
                where: { projectId: id }
              }
            }
          }
        }
      },
      orderBy: { assignedAt: 'asc' }
    });
  });

  successResponse(res, teamMembers, 'Project team retrieved successfully');
}));

/**
 * POST /api/v1/projects/:id/team
 * Add team member to project
 */
router.post('/:id/team', validateUUIDParam('id'), requireProjectAccess, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, role = 'team_member' } = req.body;
  const currentUser = req.user;
  const { prisma } = req.app.locals;

  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  // Check if user can manage this project's team
  if (currentUser.role !== 'admin') {
    const project = await dbOperation(async () => {
      return await prisma.project.findUnique({
        where: { id },
        select: { projectManagerId: true, createdBy: true }
      });
    });

    if (!project) {
      throw new NotFoundError('Project');
    }

    if (project.projectManagerId !== currentUser.id && 
        project.createdBy !== currentUser.id) {
      throw new AuthorizationError('Insufficient permissions to manage project team');
    }
  }

  // Check if user exists and is active
  const user = await dbOperation(async () => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true }
    });
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  if (user.status !== 'active') {
    throw new ValidationError('User account is not active');
  }

  // Check if user is already a team member
  const existingMember = await dbOperation(async () => {
    return await prisma.projectTeamMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId
        }
      }
    });
  });

  if (existingMember) {
    throw new ConflictError('User is already a team member of this project');
  }

  // Add team member
  const teamMember = await dbOperation(async () => {
    return await prisma.projectTeamMember.create({
      data: {
        projectId: id,
        userId,
        role
      },
      select: {
        role: true,
        assignedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            position: true,
            avatarUrl: true
          }
        }
      }
    });
  });

  // Log team member addition
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'add_team_member',
        details: {
          projectId: id,
          addedUserId: userId,
          role,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log team member addition:', auditError);
    }
  }

  successResponse(res, teamMember, 'Team member added successfully', 201);
}));

/**
 * DELETE /api/v1/projects/:id/team/:userId
 * Remove team member from project
 */
router.delete('/:id/team/:userId', validateUUIDParam('id'), validateUUIDParam('userId'), requireProjectAccess, asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const currentUser = req.user;
  const { prisma } = req.app.locals;

  // Check permissions
  if (currentUser.role !== 'admin') {
    const project = await dbOperation(async () => {
      return await prisma.project.findUnique({
        where: { id },
        select: { projectManagerId: true, createdBy: true }
      });
    });

    if (!project) {
      throw new NotFoundError('Project');
    }

    if (project.projectManagerId !== currentUser.id && 
        project.createdBy !== currentUser.id) {
      throw new AuthorizationError('Insufficient permissions to manage project team');
    }
  }

  // Check if team member exists
  const teamMember = await dbOperation(async () => {
    return await prisma.projectTeamMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId
        }
      },
      select: {
        user: {
          select: { firstName: true, lastName: true }
        }
      }
    });
  });

  if (!teamMember) {
    throw new NotFoundError('Team member not found in this project');
  }

  // Check if user has active tasks
  const activeTasks = await dbOperation(async () => {
    return await prisma.task.count({
      where: {
        projectId: id,
        assignedTo: userId,
        status: { in: ['pending', 'in_progress', 'review'] }
      }
    });
  });

  if (activeTasks > 0) {
    throw new ValidationError(`Cannot remove team member with ${activeTasks} active tasks. Please reassign tasks first.`);
  }

  // Remove team member
  await dbOperation(async () => {
    return await prisma.projectTeamMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId
        }
      }
    });
  });

  // Log team member removal
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'remove_team_member',
        details: {
          projectId: id,
          removedUserId: userId,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log team member removal:', auditError);
    }
  }

  successResponse(res, null, 'Team member removed successfully');
}));

module.exports = router;