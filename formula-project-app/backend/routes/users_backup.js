/**
 * Users Routes
 * CRUD operations for user management with role-based access control
 */

const express = require('express');

const { 
  verifyToken, 
  requireRole, 
  requirePermission,
  hashPassword 
} = require('../middleware/auth');

const { 
  handleValidationErrors
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

// Apply authentication to all user routes
router.use(verifyToken);

/**
 * GET /api/v1/users
 * Get list of users with pagination and filtering
 */
router.get('/', requirePermission('view_all'), asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    role,
    status,
    department,
    search
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = {};
  
  if (role) {
    where.role = role;
  }
  
  if (status) {
    where.status = status;
  }
  
  if (department) {
    where.department = { contains: department, mode: 'insensitive' };
  }
  
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { position: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Get users and total count
  const { prisma } = req.app.locals;
  const [users, total] = await Promise.all([
    dbOperation(async () => {
      return await prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          position: true,
          department: true,
          phone: true,
          avatarUrl: true,
          status: true,
          joinDate: true,
          skills: true,
          certifications: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            assignedTasks: true,
            managedProjects: true
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take
      });
    }),
    dbOperation(async () => {
      return await prisma.user.count({ where });
    })
  ]);

  paginatedResponse(res, users, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Users retrieved successfully');
}));

/**
 * GET /api/v1/users/:id
 * Get user by ID
 */
router.get('/:id', validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;

  // Check if user can view this profile
  if (currentUser.role !== 'admin' && currentUser.id !== id) {
    // Project managers can view their team members
    if (currentUser.role === 'project_manager') {
      const hasAccess = await dbOperation(async () => {
        const sharedProjects = await prisma.project.findFirst({
          where: {
            AND: [
              { projectManagerId: currentUser.id },
              {
                OR: [
                  { createdBy: id },
                  { teamMembers: { some: { userId: id } } }
                ]
              }
            ]
          }
        });
        return !!sharedProjects;
      });
      
      if (!hasAccess) {
        throw new AuthorizationError('Access denied to this user profile');
      }
    } else {
      throw new AuthorizationError('Access denied to this user profile');
    }
  }

  const user = await dbOperation(async () => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        position: true,
        department: true,
        phone: true,
        avatarUrl: true,
        status: true,
        joinDate: true,
        skills: true,
        certifications: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          assignedTasks: true,
          createdTasks: true,
          managedProjects: true,
          createdProjects: true,
          teamMemberships: true
        }
      }
    });
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  // Get recent activity for admin/self view
  if (currentUser.role === 'admin' || currentUser.id === id) {
    const recentTasks = await dbOperation(async () => {
      return await prisma.task.findMany({
        where: { assignedTo: id },
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          dueDate: true,
          project: {
            select: { id: true, name: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 5
      });
    });

    user.recentTasks = recentTasks;
  }

  successResponse(res, user, 'User retrieved successfully');
}));

/**
 * POST /api/v1/users
 * Create a new user (admin only)
 */
router.post('/', requireRole('admin'), validateCreateUser, asyncHandler(async (req, res) => {
  const { 
    email, 
    firstName, 
    lastName, 
    role, 
    position,
    department,
    phone,
    skills = [],
    certifications = [],
    status = 'active'
  } = req.body;

  // Check if user already exists
  const existingUser = await dbOperation(async () => {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Generate temporary password (in production, send via email)
  const tempPassword = Math.random().toString(36).slice(-12);
  const passwordHash = await hashPassword(tempPassword);

  const user = await dbOperation(async () => {
    return await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
        position: position?.trim(),
        department: department?.trim(),
        phone: phone?.trim(),
        skills,
        certifications,
        status,
        emailVerified: false
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        position: true,
        department: true,
        phone: true,
        skills: true,
        certifications: true,
        status: true,
        createdAt: true
      }
    });
  });

  // Log user creation
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: req.user.id,
        action: 'create_user',
        targetUserId: user.id,
        details: {
          role: user.role,
          email: user.email,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log user creation:', auditError);
    }
  }

  successResponse(res, {
    user,
    temporaryPassword: tempPassword // In production, don't return this
  }, 'User created successfully', 201);
}));

/**
 * PUT /api/v1/users/:id
 * Update user by ID
 */
router.put('/:id', validateUUIDParam('id'), validateUpdateUser, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;

  // Check permissions
  if (currentUser.role !== 'admin' && currentUser.id !== id) {
    throw new AuthorizationError('Access denied to modify this user');
  }

  // Restrict what non-admin users can update
  let allowedFields = ['firstName', 'lastName', 'position', 'phone', 'avatarUrl', 'skills', 'certifications'];
  
  if (currentUser.role === 'admin') {
    allowedFields = [...allowedFields, 'role', 'department', 'status'];
  }

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key) && req.body[key] !== undefined) {
      updates[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('No valid updates provided');
  }

  // Check if user exists
  const existingUser = await dbOperation(async () => {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true }
    });
  });

  if (!existingUser) {
    throw new NotFoundError('User');
  }

  // Prevent admin from demoting themselves
  if (currentUser.id === id && updates.role && updates.role !== 'admin' && existingUser.role === 'admin') {
    throw new ValidationError('Cannot change your own admin role');
  }

  const user = await dbOperation(async () => {
    return await prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        position: true,
        department: true,
        phone: true,
        avatarUrl: true,
        skills: true,
        certifications: true,
        status: true,
        updatedAt: true
      }
    });
  });

  // Log user update
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: req.user.id,
        action: 'update_user',
        targetUserId: id,
        details: {
          updatedFields: Object.keys(updates),
          changes: updates,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log user update:', auditError);
    }
  }

  successResponse(res, user, 'User updated successfully');
}));

/**
 * DELETE /api/v1/users/:id
 * Delete/deactivate user by ID
 */
router.delete('/:id', requireRole('admin'), validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;

  if (currentUser.id === id) {
    throw new ValidationError('Cannot delete your own account');
  }

  const user = await dbOperation(async () => {
    return await prisma.user.findUnique({
      where: { id },
      select: { 
        id: true, 
        email: true, 
        firstName: true, 
        lastName: true,
        _count: {
          assignedTasks: true,
          managedProjects: true,
          createdProjects: true
        }
      }
    });
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  // Check if user has active assignments
  if (user._count.assignedTasks > 0 || user._count.managedProjects > 0) {
    // Soft delete - deactivate instead of hard delete
    const deactivatedUser = await dbOperation(async () => {
      return await prisma.user.update({
        where: { id },
        data: { 
          status: 'inactive',
          email: `deleted_${Date.now()}_${user.email}` // Prevent email conflicts
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true
        }
      });
    });

    // Invalidate all sessions
    await dbOperation(async () => {
      return await prisma.userSession.deleteMany({
        where: { userId: id }
      });
    });

    // Log user deactivation
    if (req.app.locals.auditService) {
      try {
        await req.app.locals.auditService.logUserAction({
          userId: req.user.id,
          action: 'deactivate_user',
          targetUserId: id,
          details: {
            reason: 'User has active assignments',
            activeAssignments: user._count,
            ip: req.ip,
            userAgent: req.get('User-Agent')
          }
        });
      } catch (auditError) {
        console.error('Failed to log user deactivation:', auditError);
      }
    }

    successResponse(res, deactivatedUser, 'User deactivated successfully (had active assignments)');
  } else {
    // Hard delete if no active assignments
    await dbOperation(async () => {
      return await prisma.user.delete({
        where: { id }
      });
    });

    // Log user deletion
    if (req.app.locals.auditService) {
      try {
        await req.app.locals.auditService.logUserAction({
          userId: req.user.id,
          action: 'delete_user',
          targetUserId: id,
          details: {
            deletedUser: {
              email: user.email,
              name: `${user.firstName} ${user.lastName}`
            },
            ip: req.ip,
            userAgent: req.get('User-Agent')
          }
        });
      } catch (auditError) {
        console.error('Failed to log user deletion:', auditError);
      }
    }

    successResponse(res, null, 'User deleted successfully');
  }
}));

/**
 * GET /api/v1/users/:id/projects
 * Get projects for a specific user
 */
router.get('/:id/projects', validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;

  // Check permissions
  if (currentUser.role !== 'admin' && currentUser.id !== id) {
    throw new AuthorizationError('Access denied to view user projects');
  }

  const projects = await dbOperation(async () => {
    return await prisma.project.findMany({
      where: {
        OR: [
          { projectManagerId: id },
          { createdBy: id },
          { teamMembers: { some: { userId: id } } }
        ]
      },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        priority: true,
        progress: true,
        startDate: true,
        endDate: true,
        client: {
          select: { id: true, name: true }
        },
        _count: {
          tasks: true,
          teamMembers: true
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  });

  successResponse(res, projects, 'User projects retrieved successfully');
}));

/**
 * GET /api/v1/users/:id/tasks
 * Get tasks assigned to a specific user
 */
router.get('/:id/tasks', validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  const { status, priority, limit = 20 } = req.query;

  // Check permissions
  if (currentUser.role !== 'admin' && currentUser.id !== id) {
    throw new AuthorizationError('Access denied to view user tasks');
  }

  const where = { assignedTo: id };
  
  if (status) {
    where.status = status;
  }
  
  if (priority) {
    where.priority = priority;
  }

  const tasks = await dbOperation(async () => {
    return await prisma.task.findMany({
      where,
      select: {
        id: true,
        name: true,
        status: true,
        priority: true,
        progress: true,
        dueDate: true,
        estimatedHours: true,
        actualHours: true,
        project: {
          select: { id: true, name: true, client: { select: { name: true } } }
        },
        creator: {
          select: { id: true, firstName: true, lastName: true }
        },
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' },
      take: parseInt(limit)
    });
  });

  successResponse(res, tasks, 'User tasks retrieved successfully');
}));

/**
 * GET /api/v1/users/roles
 * Get available user roles (for dropdowns)
 */
router.get('/meta/roles', requirePermission('manage_users'), asyncHandler(async (req, res) => {
  const roles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'project_manager', label: 'Project Manager', description: 'Manage assigned projects and teams' },
    { value: 'designer', label: 'Designer', description: 'Create and manage drawings' },
    { value: 'coordinator', label: 'Coordinator', description: 'Coordinate workflows and materials' },
    { value: 'craftsman', label: 'Craftsman', description: 'Execute assigned tasks' },
    { value: 'client', label: 'Client', description: 'View own projects and reports' }
  ];

  successResponse(res, roles, 'User roles retrieved successfully');
}));

module.exports = router;