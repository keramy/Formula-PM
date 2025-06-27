/**
 * Formula PM Backend Server
 * Enterprise-grade API server with PostgreSQL, Redis, and comprehensive logging
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const cacheService = require('./services/cacheService');
const auditService = require('./services/auditService');
const ServiceRegistry = require('./services/ServiceRegistry');

// Import middleware and routes
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5014;

// Initialize Prisma client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty'
});

// Middleware setup
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API server
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3003',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Make services available to routes
app.locals.prisma = prisma;
app.locals.cacheService = cacheService;
app.locals.auditService = auditService;

// Health check endpoints
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Test cache connection
    const cacheHealth = await cacheService.healthCheck();
    
    // Get basic stats
    const stats = {
      database: 'healthy',
      cache: cacheHealth,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      database: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/health/detailed', async (req, res) => {
  try {
    // Database stats
    const [userCount, projectCount, taskCount] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.task.count()
    ]);
    
    // Cache stats
    const cacheStats = await cacheService.getStats();
    
    // Audit stats
    const auditStats = await auditService.getAuditStats();
    
    // Realtime service stats
    let realtimeStats = null;
    try {
      const realtimeService = ServiceRegistry.getService('RealtimeService');
      realtimeStats = realtimeService.getServiceStatus();
    } catch (error) {
      realtimeStats = { status: 'error', message: 'Service not available' };
    }
    
    res.json({
      status: 'healthy',
      database: {
        status: 'connected',
        counts: { users: userCount, projects: projectCount, tasks: taskCount }
      },
      cache: cacheStats,
      audit: auditStats,
      realtime: realtimeStats,
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Detailed health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API v1 routes
app.use('/api/v1', apiRoutes);

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Formula PM API Server',
    version: '1.0.0',
    status: 'operational',
    documentation: '/api/v1/docs',
    health: '/health',
    baseUrl: '/api/v1',
    endpoints: {
      authentication: '/api/v1/auth',
      users: '/api/v1/users',
      projects: '/api/v1/projects',
      scope: '/api/v1/projects/:id/scope',
      tasks: '/api/v1/tasks',
      drawings: '/api/v1/projects/:id/drawings',
      materials: '/api/v1/projects/:id/materials',
      workflow: '/api/v1/projects/:id/workflow',
      reports: '/api/v1/reports',
      notifications: '/api/v1/notifications',
      search: '/api/v1/search'
    },
    features: [
      'JWT Authentication & Authorization',
      'Role-based Access Control',
      'PostgreSQL database with Prisma ORM',
      'Redis caching for performance',
      'Comprehensive audit logging',
      'Input validation & security',
      'Error handling & monitoring',
      'Rate limiting protection'
    ],
    authentication: 'JWT Bearer tokens',
    rateLimit: '100 requests per 15 minutes',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Formula PM API Documentation',
    version: '1.0.0',
    description: 'Enterprise project management API for custom millwork projects',
    baseUrl: req.protocol + '://' + req.get('host') + '/api',
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      endpoints: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        refresh: 'POST /api/auth/refresh'
      }
    },
    endpoints: {
      users: {
        list: 'GET /api/users',
        get: 'GET /api/users/:id',
        create: 'POST /api/users',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      },
      projects: {
        list: 'GET /api/projects',
        get: 'GET /api/projects/:id',
        create: 'POST /api/projects',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id',
        tasks: 'GET /api/projects/:id/tasks',
        'scope-items': 'GET /api/projects/:id/scope-items',
        'shop-drawings': 'GET /api/projects/:id/shop-drawings',
        'material-specifications': 'GET /api/projects/:id/material-specifications'
      },
      tasks: {
        list: 'GET /api/tasks',
        get: 'GET /api/tasks/:id',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id'
      },
      clients: {
        list: 'GET /api/clients',
        get: 'GET /api/clients/:id',
        create: 'POST /api/clients',
        update: 'PUT /api/clients/:id',
        delete: 'DELETE /api/clients/:id',
        projects: 'GET /api/clients/:id/projects'
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
        clientId: 'UUID (foreign key)',
        projectManagerId: 'UUID (foreign key)'
      },
      task: {
        id: 'UUID',
        projectId: 'UUID (foreign key)',
        name: 'string',
        description: 'string',
        status: 'enum (pending, in_progress, review, completed, cancelled)',
        priority: 'enum (low, medium, high, urgent)',
        assignedTo: 'UUID (foreign key)',
        dueDate: 'date',
        estimatedHours: 'decimal',
        actualHours: 'decimal',
        progress: 'integer (0-100)'
      },
      client: {
        id: 'UUID',
        name: 'string',
        companyName: 'string',
        contactPerson: 'string',
        email: 'string',
        phone: 'string',
        address: 'string',
        type: 'enum (commercial, residential, retail, hospitality, industrial, healthcare)',
        industry: 'string',
        status: 'enum (active, inactive, archived)',
        totalProjectValue: 'decimal'
      }
    },
    caching: {
      description: 'Redis-based caching for performance optimization',
      ttl: '3600 seconds (1 hour) for most data',
      patterns: {
        user: 'formula_pm:user:{id}',
        project: 'formula_pm:project:{id}',
        'project-list': 'formula_pm:project:list:{filters_hash}',
        search: 'formula_pm:search:{query_hash}'
      }
    },
    auditLogging: {
      description: 'Comprehensive audit trail for all data changes',
      automatic: ['create', 'update', 'delete operations'],
      manual: ['user actions', 'system events'],
      retention: '365 days',
      endpoints: {
        'record-history': 'GET /api/audit/history/:table/:id',
        'user-actions': 'GET /api/audit/user/:userId',
        stats: 'GET /api/audit/stats',
        export: 'GET /api/audit/export'
      }
    },
    errorHandling: {
      format: {
        error: 'string (error message)',
        code: 'string (error code)',
        details: 'object (additional error details)',
        timestamp: 'string (ISO date)'
      },
      httpCodes: {
        200: 'Success',
        201: 'Created',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        422: 'Validation Error',
        429: 'Rate Limited',
        500: 'Internal Server Error'
      }
    }
  });
});

// Apply error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  
  // Stop accepting new requests
  server.close(async () => {
    console.log('🔄 HTTP server closed');
    
    try {
      // Shutdown all services
      await ServiceRegistry.shutdown();
      console.log('✅ All services shutdown');
      
      // Flush audit logs
      await auditService.shutdown();
      
      // Disconnect from database
      await prisma.$disconnect();
      console.log('✅ Database connection closed');
      
      // Disconnect from Redis
      await cacheService.disconnect();
      console.log('✅ Cache connection closed');
      
      console.log('✅ Graceful shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting Formula PM Backend Server...');
    
    // Initialize database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Initialize cache connection
    await cacheService.connect();
    console.log('✅ Cache service initialized');
    
    // Initialize all services through ServiceRegistry
    console.log('🔧 Initializing advanced services...');
    await ServiceRegistry.initializeServices();
    console.log('✅ All services initialized successfully');
    
    // Initialize Socket.IO realtime service
    console.log('🔧 Initializing realtime service...');
    const realtimeService = ServiceRegistry.getService('RealtimeService');
    await realtimeService.initialize(server);
    console.log('✅ Realtime service initialized successfully');
    
    // Log system startup
    await auditService.logSystemEvent({
      event: 'server_startup',
      severity: 'info',
      description: 'Formula PM backend server started successfully',
      metadata: {
        port: PORT,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform,
        servicesInitialized: ServiceRegistry.getServiceNames().length
      }
    });
    
    // Start HTTP server with Socket.IO
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API documentation: http://localhost:${PORT}/api/docs`);
      console.log(`❤️ Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 Search API: http://localhost:${PORT}/api/v1/search/global`);
      console.log(`📊 Analytics: http://localhost:${PORT}/api/v1/analytics/dashboard`);
      console.log(`📧 Notifications: http://localhost:${PORT}/api/v1/notifications`);
      console.log(`📋 Reports: http://localhost:${PORT}/api/v1/reports/types`);
      console.log(`💬 Mentions: http://localhost:${PORT}/api/v1/mentions/search`);
      console.log(`⚙️ System: http://localhost:${PORT}/api/v1/system/health`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT} (Socket.IO)`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
    
    return server;
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    
    // Log startup failure
    await auditService.logSystemEvent({
      event: 'server_startup_failed',
      severity: 'critical',
      description: `Server startup failed: ${error.message}`,
      metadata: { error: error.stack }
    });
    
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const server = startServer();
  module.exports = server;
} else {
  module.exports = app;
}