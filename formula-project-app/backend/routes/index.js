/**
 * API Routes Index
 * Main router organizing all API v1 routes
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const projectRoutes = require('./projects');
const scopeRoutes = require('./scope');
const drawingsRoutes = require('./drawings');
const tasksRoutes = require('./tasks');
const clientsRoutes = require('./clients');

// Import new advanced service routes
const mentionsRoutes = require('./mentions');
const searchRoutes = require('./search');
const analyticsRoutes = require('./analytics');
const reportsRoutes = require('./reports');
const notificationsRoutes = require('./notifications');
const systemRoutes = require('./system');
const realtimeRoutes = require('./realtime');

/**
 * API v1 Routes Structure
 */

// Authentication routes
router.use('/auth', authRoutes);

// User management routes
router.use('/users', userRoutes);

// Project management routes
router.use('/projects', projectRoutes);

// Project scope routes (nested under projects)
router.use('/projects/:projectId/scope', scopeRoutes);

// Shop drawings routes (nested under projects)
router.use('/projects/:projectId/drawings', drawingsRoutes);

// Task management routes
router.use('/tasks', tasksRoutes);

// Client management routes
router.use('/clients', clientsRoutes);

// Advanced service routes - Phase 6 Implementation
router.use('/mentions', mentionsRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/system', systemRoutes);

// Real-time and performance routes - Phase 7 Implementation
router.use('/realtime', realtimeRoutes);

// Placeholder routes for remaining implementations

// Material specifications routes (will be implemented)
router.use('/projects/:projectId/materials', (req, res) => {
  res.status(501).json({
    error: 'Material specifications API not yet implemented',
    message: 'This endpoint is under development',
    expectedCompletion: 'Coming soon',
    timestamp: new Date().toISOString()
  });
});

// Workflow routes (will be implemented)
router.use('/projects/:projectId/workflow', (req, res) => {
  res.status(501).json({
    error: 'Workflow API not yet implemented',
    message: 'This endpoint is under development',
    expectedCompletion: 'Coming soon',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    title: 'Formula PM API v1 Documentation',
    version: '1.0.0',
    description: 'RESTful API for Formula PM project management system',
    baseUrl: `${req.protocol}://${req.get('host')}/api/v1`,
    
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      obtain: 'POST /api/v1/auth/login',
      refresh: 'POST /api/v1/auth/refresh'
    },
    
    endpoints: {
      authentication: {
        login: 'POST /auth/login',
        register: 'POST /auth/register',
        refresh: 'POST /auth/refresh',
        logout: 'POST /auth/logout',
        profile: 'GET /auth/me',
        updateProfile: 'PUT /auth/me',
        changePassword: 'POST /auth/change-password'
      },
      
      users: {
        list: 'GET /users',
        get: 'GET /users/:id',
        create: 'POST /users',
        update: 'PUT /users/:id',
        delete: 'DELETE /users/:id',
        projects: 'GET /users/:id/projects',
        tasks: 'GET /users/:id/tasks',
        roles: 'GET /users/meta/roles'
      },
      
      projects: {
        list: 'GET /projects',
        get: 'GET /projects/:id',
        create: 'POST /projects',
        update: 'PUT /projects/:id',
        delete: 'DELETE /projects/:id',
        team: 'GET /projects/:id/team',
        addTeamMember: 'POST /projects/:id/team',
        removeTeamMember: 'DELETE /projects/:id/team/:userId'
      },
      
      scope: {
        overview: 'GET /projects/:projectId/scope',
        groups: 'GET /projects/:projectId/scope/groups',
        createGroup: 'POST /projects/:projectId/scope/groups',
        updateGroup: 'PUT /projects/:projectId/scope/groups/:groupId',
        deleteGroup: 'DELETE /projects/:projectId/scope/groups/:groupId',
        items: 'GET /projects/:projectId/scope/items',
        createItem: 'POST /projects/:projectId/scope/items',
        updateItem: 'PUT /projects/:projectId/scope/items/:itemId',
        deleteItem: 'DELETE /projects/:projectId/scope/items/:itemId'
      },
      
      tasks: {
        list: 'GET /tasks',
        get: 'GET /tasks/:id',
        create: 'POST /tasks',
        update: 'PUT /tasks/:id',
        delete: 'DELETE /tasks/:id',
        myTasks: 'GET /tasks/my-tasks'
      },
      
      upcoming: {
        drawings: 'GET /projects/:id/drawings - Under development',
        materials: 'GET /projects/:id/materials - Under development',
        workflow: 'GET /projects/:id/workflow - Under development',
        reports: 'GET /reports - Under development',
        notifications: 'GET /notifications - Under development',
        search: 'GET /search - Under development'
      }
    },
    
    dataModels: {
      user: {
        id: 'UUID',
        email: 'string (unique)',
        firstName: 'string',
        lastName: 'string',
        role: 'enum (admin, project_manager, designer, craftsman, coordinator, client)',
        position: 'string',
        department: 'string',
        phone: 'string',
        status: 'string',
        skills: 'string[]',
        certifications: 'string[]'
      },
      
      project: {
        id: 'UUID',
        name: 'string',
        description: 'string',
        type: 'enum (commercial, residential, retail, hospitality, industrial, healthcare)',
        status: 'enum (draft, active, on_tender, on_hold, completed, cancelled)',
        priority: 'enum (low, medium, high, urgent)',
        budget: 'decimal',
        startDate: 'date',
        endDate: 'date',
        progress: 'integer (0-100)',
        location: 'string',
        clientId: 'UUID',
        projectManagerId: 'UUID'
      },
      
      scopeGroup: {
        id: 'UUID',
        projectId: 'UUID',
        name: 'string',
        description: 'string',
        orderIndex: 'integer'
      },
      
      scopeItem: {
        id: 'UUID',
        scopeGroupId: 'UUID',
        projectId: 'UUID',
        name: 'string',
        description: 'string',
        status: 'enum (pending, in_progress, review, completed, cancelled)',
        completionPercentage: 'integer (0-100)',
        estimatedCost: 'decimal',
        actualCost: 'decimal',
        orderIndex: 'integer'
      }
    },
    
    security: {
      authentication: 'JWT tokens required for most endpoints',
      authorization: 'Role-based access control',
      rateLimit: '100 requests per 15 minutes',
      validation: 'Input validation on all endpoints',
      audit: 'All actions are logged for audit purposes'
    },
    
    responseFormat: {
      success: {
        success: true,
        message: 'Success message',
        data: 'Response data',
        timestamp: 'ISO date string'
      },
      
      paginated: {
        success: true,
        message: 'Success message',
        data: 'Array of items',
        pagination: {
          page: 'Current page number',
          limit: 'Items per page',
          total: 'Total items',
          pages: 'Total pages',
          hasNext: 'Boolean',
          hasPrev: 'Boolean'
        },
        timestamp: 'ISO date string'
      },
      
      error: {
        error: 'Error message',
        code: 'Error code',
        timestamp: 'ISO date string',
        details: 'Additional error details (optional)'
      }
    },
    
    status: {
      implemented: [
        'Authentication system',
        'User management',
        'Project management',
        'Project scope management',
        'Task management',
        'Mention system with @references',
        'Global search and filtering',
        'Business intelligence analytics',
        'Report generation with PDF export',
        'Real-time notification system',
        'Email integration and templates',
        'Service registry and health monitoring'
      ],
      
      inProgress: [
        'Shop drawings',
        'Material specifications',
        'Workflow connections'
      ],

      phase6_completed: [
        'Advanced mention system',
        'Comprehensive search functionality',
        'Business analytics dashboard',
        'PDF report generation',
        'Email notification service',
        'Service management system'
      ],

      phase7_completed: [
        'Socket.IO real-time communication',
        'WebSocket authentication and authorization',
        'Live presence indicators',
        'Real-time collaboration features',
        'Project-based room system',
        'Background job processing with Bull queues',
        'Performance monitoring and alerting',
        'Cloud storage with AWS S3 integration',
        'Database performance optimization',
        'Comprehensive benchmarking suite'
      ]
    },
    
    timestamp: new Date().toISOString()
  });
});

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: {
      authentication: 'operational',
      userManagement: 'operational',
      projectManagement: 'operational',
      scopeManagement: 'operational',
      mentionSystem: 'operational',
      globalSearch: 'operational',
      analytics: 'operational',
      reportGeneration: 'operational',
      notifications: 'operational',
      emailService: 'operational',
      serviceRegistry: 'operational',
      realtimeCollaboration: 'operational',
      websocketSupport: 'operational',
      backgroundJobs: 'operational',
      performanceMonitoring: 'operational',
      cloudStorage: 'operational',
      taskManagement: 'operational',
      shopDrawings: 'under_development',
      materialSpecs: 'under_development',
      workflowConnections: 'under_development'
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;