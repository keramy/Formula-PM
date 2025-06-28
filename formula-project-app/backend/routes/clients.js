/**
 * Clients Routes
 * CRUD operations for client management
 */

const express = require('express');
const { body, param, query } = require('express-validator');

const { 
  verifyToken, 
  requireRole, 
  requirePermission
} = require('../middleware/auth');

const { 
  handleValidationErrors
} = require('../middleware/validation');

const { 
  asyncHandler, 
  successResponse, 
  paginatedResponse,
  NotFoundError,
  ConflictError
} = require('../middleware/errorHandler');

const router = express.Router();

// Apply authentication to all client routes
// Apply authentication to all client routes (bypass in development)
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
 * GET /api/v1/clients
 * Get list of clients with pagination and filtering
 */
router.get('/', requirePermission('view_all'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isIn(['commercial', 'residential', 'retail', 'hospitality', 'industrial', 'healthcare']),
  query('status').optional().isIn(['active', 'inactive', 'archived']),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    type,
    status,
    search
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = {};
  
  if (type) {
    where.type = type;
  }
  
  if (status) {
    where.status = status;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
      { contactPerson: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  const { prisma } = req.app.locals;
  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      select: {
        id: true,
        name: true,
        companyName: true,
        contactPerson: true,
        email: true,
        phone: true,
        address: true,
        type: true,
        industry: true,
        status: true,
        totalProjectValue: true,
        createdAt: true,
        _count: {
          projects: true
        }
      },
      skip,
      take,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.client.count({ where })
  ]);

  paginatedResponse(res, clients, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Clients retrieved successfully');
}));

/**
 * GET /api/v1/clients/:id
 * Get client by ID
 */
router.get('/:id', [
  param('id').isUUID(),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prisma } = req.app.locals;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: {
        select: {
          id: true,
          name: true,
          status: true,
          type: true,
          startDate: true,
          endDate: true,
          budget: true,
          progress: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!client) {
    throw new NotFoundError('Client');
  }

  successResponse(res, client, 'Client retrieved successfully');
}));

/**
 * POST /api/v1/clients
 * Create new client
 */
router.post('/', requireRole('admin'), [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('companyName').optional().trim().isLength({ max: 100 }),
  body('contactPerson').trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('address').optional().trim().isLength({ max: 500 }),
  body('type').isIn(['commercial', 'residential', 'retail', 'hospitality', 'industrial', 'healthcare']),
  body('industry').optional().trim().isLength({ max: 100 }),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { prisma } = req.app.locals;
  const {
    name,
    companyName,
    contactPerson,
    email,
    phone,
    address,
    type,
    industry
  } = req.body;

  // Check if client already exists
  const existingClient = await prisma.client.findFirst({
    where: {
      OR: [
        { email },
        { name }
      ]
    }
  });

  if (existingClient) {
    throw new ConflictError('Client with this email or name already exists');
  }

  const client = await prisma.client.create({
    data: {
      name,
      companyName,
      contactPerson,
      email,
      phone,
      address,
      type,
      industry,
      status: 'active',
      totalProjectValue: 0
    },
    select: {
      id: true,
      name: true,
      companyName: true,
      contactPerson: true,
      email: true,
      phone: true,
      address: true,
      type: true,
      industry: true,
      status: true,
      createdAt: true
    }
  });

  successResponse(res, client, 'Client created successfully', 201);
}));

/**
 * PUT /api/v1/clients/:id
 * Update client
 */
router.put('/:id', [
  param('id').isUUID(),
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('companyName').optional().trim().isLength({ max: 100 }),
  body('contactPerson').optional().trim().isLength({ min: 1, max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('address').optional().trim().isLength({ max: 500 }),
  body('type').optional().isIn(['commercial', 'residential', 'retail', 'hospitality', 'industrial', 'healthcare']),
  body('industry').optional().trim().isLength({ max: 100 }),
  body('status').optional().isIn(['active', 'inactive', 'archived']),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prisma } = req.app.locals;
  const updateData = req.body;

  const client = await prisma.client.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      companyName: true,
      contactPerson: true,
      email: true,
      phone: true,
      address: true,
      type: true,
      industry: true,
      status: true,
      totalProjectValue: true,
      updatedAt: true
    }
  });

  successResponse(res, client, 'Client updated successfully');
}));

/**
 * DELETE /api/v1/clients/:id
 * Delete client (soft delete)
 */
router.delete('/:id', requireRole('admin'), [
  param('id').isUUID(),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prisma } = req.app.locals;

  // Soft delete by setting status to archived
  await prisma.client.update({
    where: { id },
    data: { 
      status: 'archived',
      deletedAt: new Date()
    }
  });

  successResponse(res, null, 'Client deleted successfully');
}));

/**
 * GET /api/v1/clients/:id/projects
 * Get projects for a specific client
 */
router.get('/:id/projects', [
  param('id').isUUID(),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prisma } = req.app.locals;

  const projects = await prisma.project.findMany({
    where: { clientId: id },
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
      projectManager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  successResponse(res, projects, 'Client projects retrieved successfully');
}));

module.exports = router;