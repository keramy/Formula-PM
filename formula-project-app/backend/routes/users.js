/**
 * Users Routes
 * CRUD operations for user management with role-based access control
 */

const express = require('express');
const { body, param, query } = require('express-validator');

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

// Apply authentication to all user routes (bypass in development)
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
 * GET /api/v1/users
 * Get list of users with pagination and filtering
 */
router.get('/', requirePermission('view_all'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['admin', 'project_manager', 'designer', 'coordinator', 'craftsman', 'client']),
  query('status').optional().isIn(['active', 'inactive', 'pending']),
  handleValidationErrors
], asyncHandler(async (req, res) => {
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
    prisma.user.findMany({
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
        skills: true,
        certifications: true,
        lastLoginAt: true,
        createdAt: true
      },
      skip,
      take,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.user.count({ where })
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
router.get('/:id', [
  param('id').isUUID(),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prisma } = req.app.locals;

  const user = await prisma.user.findUnique({
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
      skills: true,
      certifications: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  successResponse(res, user, 'User retrieved successfully');
}));

/**
 * POST /api/v1/users
 * Create new user
 */
router.post('/', requireRole('admin'), [
  body('email').isEmail().normalizeEmail(),
  body('firstName').trim().isLength({ min: 1, max: 50 }),
  body('lastName').trim().isLength({ min: 1, max: 50 }),
  body('role').isIn(['admin', 'project_manager', 'designer', 'coordinator', 'craftsman', 'client']),
  body('position').optional().trim().isLength({ max: 100 }),
  body('department').optional().trim().isLength({ max: 100 }),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('password').isLength({ min: 8 }),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { prisma } = req.app.locals;
  const {
    email,
    firstName,
    lastName,
    role,
    position,
    department,
    phone,
    password,
    skills = [],
    certifications = []
  } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      role,
      position,
      department,
      phone,
      password: hashedPassword,
      skills,
      certifications,
      status: 'active',
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
      status: true,
      createdAt: true
    }
  });

  successResponse(res, user, 'User created successfully', 201);
}));

/**
 * PUT /api/v1/users/:id
 * Update user
 */
router.put('/:id', [
  param('id').isUUID(),
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('position').optional().trim().isLength({ max: 100 }),
  body('department').optional().trim().isLength({ max: 100 }),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('skills').optional().isArray(),
  body('certifications').optional().isArray(),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prisma } = req.app.locals;
  const updateData = req.body;

  // Remove fields that shouldn't be updated
  delete updateData.email;
  delete updateData.password;
  delete updateData.role;
  delete updateData.status;

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
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
      updatedAt: true
    }
  });

  successResponse(res, user, 'User updated successfully');
}));

/**
 * DELETE /api/v1/users/:id
 * Delete user (soft delete)
 */
router.delete('/:id', requireRole('admin'), [
  param('id').isUUID(),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prisma } = req.app.locals;

  // Soft delete by setting status to inactive
  await prisma.user.update({
    where: { id },
    data: { 
      status: 'inactive',
      deletedAt: new Date()
    }
  });

  successResponse(res, null, 'User deleted successfully');
}));

/**
 * GET /api/v1/users/meta/roles
 * Get available user roles
 */
router.get('/meta/roles', asyncHandler(async (req, res) => {
  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'project_manager', label: 'Project Manager' },
    { value: 'designer', label: 'Designer' },
    { value: 'coordinator', label: 'Coordinator' },
    { value: 'craftsman', label: 'Craftsman' },
    { value: 'client', label: 'Client' }
  ];

  successResponse(res, roles, 'User roles retrieved successfully');
}));

module.exports = router;