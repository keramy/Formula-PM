# Formula PM Backend API Contracts

## Overview

This document defines the API contracts and integration patterns for other subagents working on the Formula PM project. The database layer provides a robust foundation with PostgreSQL, Redis caching, and comprehensive audit logging.

## Database Integration Patterns

### Prisma Client Usage

All subagents should use the Prisma client instance available in Express app locals:

```javascript
// In route handlers
const prisma = req.app.locals.prisma;

// Query examples
const projects = await prisma.project.findMany({
  include: {
    client: true,
    projectManager: true,
    tasks: true
  }
});
```

### Standard Query Patterns

#### 1. List with Pagination and Filtering
```javascript
async function getProjectsList(filters = {}, pagination = {}) {
  const {
    status = null,
    clientId = null,
    projectManagerId = null,
    search = null
  } = filters;
  
  const {
    page = 1,
    limit = 20,
    orderBy = 'createdAt',
    orderDirection = 'desc'
  } = pagination;
  
  const where = {};
  if (status) where.status = status;
  if (clientId) where.clientId = clientId;
  if (projectManagerId) where.projectManagerId = projectManagerId;
  
  // Full-text search
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { client: { name: { contains: search, mode: 'insensitive' } } }
    ];
  }
  
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        client: { select: { id: true, name: true } },
        projectManager: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { tasks: true } }
      },
      orderBy: { [orderBy]: orderDirection },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.project.count({ where })
  ]);
  
  return {
    data: projects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  };
}
```

#### 2. Single Record with Relations
```javascript
async function getProjectById(id, includeRelations = true) {
  const include = includeRelations ? {
    client: true,
    projectManager: { select: { id: true, firstName: true, lastName: true, email: true } },
    teamMembers: {
      include: {
        user: { select: { id: true, firstName: true, lastName: true, role: true } }
      }
    },
    tasks: {
      orderBy: { createdAt: 'desc' },
      take: 10
    },
    scopeGroups: {
      include: {
        scopeItems: { orderBy: { orderIndex: 'asc' } }
      },
      orderBy: { orderIndex: 'asc' }
    },
    shopDrawings: {
      orderBy: { uploadDate: 'desc' },
      take: 5
    },
    materialSpecs: {
      orderBy: { createdAt: 'desc' },
      take: 10
    }
  } : undefined;
  
  return await prisma.project.findUnique({
    where: { id },
    include
  });
}
```

#### 3. Create with Relations
```javascript
async function createProject(projectData, userId) {
  return await prisma.$transaction(async (tx) => {
    // Create the project
    const project = await tx.project.create({
      data: {
        ...projectData,
        createdBy: userId
      }
    });
    
    // Add team members if provided
    if (projectData.teamMembers && projectData.teamMembers.length > 0) {
      await tx.projectTeamMember.createMany({
        data: projectData.teamMembers.map(memberId => ({
          projectId: project.id,
          userId: memberId,
          role: 'team_member'
        }))
      });
    }
    
    // Create default scope groups
    const defaultGroups = [
      { name: 'Design Phase', orderIndex: 1 },
      { name: 'Fabrication', orderIndex: 2 },
      { name: 'Installation', orderIndex: 3 }
    ];
    
    await tx.scopeGroup.createMany({
      data: defaultGroups.map(group => ({
        ...group,
        projectId: project.id
      }))
    });
    
    return project;
  });
}
```

### Caching Integration

#### Cache Service Usage
```javascript
const cacheService = req.app.locals.cacheService;

// Generate cache keys
const projectListKey = cacheService.generateKey('project', 'list', JSON.stringify(filters));
const projectKey = cacheService.generateKey('project', projectId);

// Get from cache
let projects = await cacheService.get(projectListKey);
if (!projects) {
  projects = await getProjectsList(filters);
  await cacheService.set(projectListKey, projects, 1800); // 30 minutes
}

// Cache invalidation patterns
async function invalidateProjectCache(projectId) {
  await cacheService.delete(cacheService.generateKey('project', projectId));
  await cacheService.deletePattern('formula_pm:project:list:*');
  await cacheService.deletePattern(`formula_pm:search:*`);
}
```

#### Common Cache Patterns
```javascript
// Cache configuration per data type
const CACHE_CONFIG = {
  users: { ttl: 3600, pattern: 'user' },           // 1 hour
  projects: { ttl: 1800, pattern: 'project' },     // 30 minutes
  tasks: { ttl: 900, pattern: 'task' },            // 15 minutes
  clients: { ttl: 7200, pattern: 'client' },       // 2 hours
  search: { ttl: 600, pattern: 'search' },         // 10 minutes
  stats: { ttl: 300, pattern: 'stats' }            // 5 minutes
};

// Cache wrapper function
async function withCache(key, fetchFunction, ttl = 3600) {
  let data = await cacheService.get(key);
  if (!data) {
    data = await fetchFunction();
    if (data) {
      await cacheService.set(key, data, ttl);
    }
  }
  return data;
}
```

### Audit Logging Integration

#### Automatic Audit Logging
```javascript
const auditService = req.app.locals.auditService;

// Log data changes
async function updateProject(id, updateData, userId) {
  const oldProject = await prisma.project.findUnique({ where: { id } });
  
  const updatedProject = await prisma.project.update({
    where: { id },
    data: updateData
  });
  
  // Log the change
  await auditService.logDataChange({
    tableName: 'projects',
    recordId: id,
    action: 'update',
    oldValues: oldProject,
    newValues: updatedProject,
    userId,
    userEmail: req.user?.email,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  return updatedProject;
}
```

#### User Action Logging
```javascript
// Log user actions
await auditService.logUserAction({
  action: 'project_export',
  entityType: 'project',
  entityId: projectId,
  userId: req.user.id,
  userEmail: req.user.email,
  ipAddress: req.ip,
  userAgent: req.get('User-Agent'),
  details: {
    format: 'pdf',
    includeDrawings: true,
    filters: exportFilters
  }
});
```

## Subagent-Specific Contracts

### For Subagent D (API Engineer)

#### Required Middleware Setup
```javascript
// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    });
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Audit logging middleware
const auditMiddleware = (action) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode < 400) {
      await auditService.logUserAction({
        action,
        entityType: req.route?.path?.split('/')[1] || 'unknown',
        entityId: req.params.id || null,
        userId: req.user?.id,
        userEmail: req.user?.email,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode
        }
      });
    }
  });
  next();
};
```

#### Standard Route Structure
```javascript
// GET /api/projects
router.get('/', 
  authenticateToken,
  auditMiddleware('projects_list'),
  async (req, res) => {
    try {
      const filters = {
        status: req.query.status,
        clientId: req.query.client,
        search: req.query.search
      };
      
      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        orderBy: req.query.sortBy || 'createdAt',
        orderDirection: req.query.sortOrder || 'desc'
      };
      
      const cacheKey = cacheService.generateKey('project', 'list', JSON.stringify({ filters, pagination }));
      const projects = await withCache(cacheKey, () => getProjectsList(filters, pagination), 1800);
      
      res.json(projects);
    } catch (error) {
      console.error('Projects list error:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }
);

// POST /api/projects
router.post('/',
  authenticateToken,
  validateProjectData,
  auditMiddleware('project_create'),
  async (req, res) => {
    try {
      const project = await createProject(req.body, req.user.id);
      
      // Invalidate related caches
      await cacheService.deletePattern('formula_pm:project:list:*');
      
      res.status(201).json(project);
    } catch (error) {
      console.error('Project creation error:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }
);
```

#### Error Handling Standards
```javascript
// Standard error response format
const sendError = (res, statusCode, error, code = null) => {
  res.status(statusCode).json({
    error: error.message || error,
    code: code || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

// Validation error handler
const handleValidationError = (error, res) => {
  if (error.name === 'ValidationError') {
    return sendError(res, 422, 'Validation failed', 'VALIDATION_ERROR');
  }
  if (error.code === 'P2002') { // Prisma unique constraint
    return sendError(res, 409, 'Resource already exists', 'DUPLICATE_ERROR');
  }
  return sendError(res, 500, error, 'INTERNAL_ERROR');
};
```

### For Subagent E (Authentication)

#### Authentication Database Schema
```javascript
// User authentication fields (already in schema)
{
  email: 'unique identifier',
  passwordHash: 'bcrypt hashed password',
  emailVerified: 'boolean flag',
  lastLoginAt: 'timestamp'
}

// Session management
{
  tokenHash: 'hashed JWT token',
  expiresAt: 'expiration timestamp',
  lastUsedAt: 'last activity timestamp'
}
```

#### Required Functions
```javascript
// User registration
async function registerUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const user = await prisma.user.create({
    data: {
      ...userData,
      passwordHash: hashedPassword,
      emailVerified: false
    }
  });
  
  await auditService.logUserAction({
    action: 'user_register',
    entityType: 'user',
    entityId: user.id,
    userId: user.id,
    userEmail: user.email,
    details: { registrationMethod: 'email' }
  });
  
  return user;
}

// User login
async function authenticateUser(email, password, ipAddress, userAgent) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true, role: true, status: true }
  });
  
  if (!user || user.status !== 'active') {
    throw new Error('Invalid credentials');
  }
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
  
  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });
  
  // Create session
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  const tokenHash = await bcrypt.hash(token, 8);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await prisma.userSession.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt
    }
  });
  
  await auditService.logUserAction({
    action: 'user_login',
    entityType: 'user',
    entityId: user.id,
    userId: user.id,
    userEmail: user.email,
    ipAddress,
    userAgent,
    details: { loginMethod: 'password' }
  });
  
  return { user, token };
}
```

### For Subagent F (Real-time Features)

#### Database Change Notifications
```javascript
// Set up PostgreSQL LISTEN/NOTIFY for real-time updates
const { Client } = require('pg');

const notificationClient = new Client({
  connectionString: process.env.DATABASE_URL
});

await notificationClient.connect();

// Listen for specific table changes
await notificationClient.query('LISTEN project_changes');
await notificationClient.query('LISTEN task_changes');
await notificationClient.query('LISTEN notification_changes');

notificationClient.on('notification', (msg) => {
  const { channel, payload } = msg;
  const data = JSON.parse(payload);
  
  // Emit to WebSocket clients
  io.to(`project_${data.projectId}`).emit('data_change', {
    type: channel,
    action: data.action,
    data: data.record
  });
  
  // Invalidate relevant caches
  if (channel === 'project_changes') {
    cacheService.deletePattern(`formula_pm:project:${data.recordId}*`);
    cacheService.deletePattern('formula_pm:project:list:*');
  }
});
```

#### Real-time Cache Invalidation
```javascript
// Cache invalidation for real-time updates
const invalidateRealTimeCache = async (entityType, entityId, projectId = null) => {
  const patterns = [
    `formula_pm:${entityType}:${entityId}*`,
    `formula_pm:${entityType}:list:*`
  ];
  
  if (projectId) {
    patterns.push(`formula_pm:project:${projectId}*`);
  }
  
  for (const pattern of patterns) {
    await cacheService.deletePattern(pattern);
  }
};

// WebSocket room management
const joinProjectRoom = (socket, projectId) => {
  socket.join(`project_${projectId}`);
  
  // Log user presence
  auditService.logUserAction({
    action: 'realtime_join',
    entityType: 'project',
    entityId: projectId,
    userId: socket.user.id,
    userEmail: socket.user.email,
    details: { socketId: socket.id }
  });
};
```

#### Presence Tracking
```javascript
// Store user presence in Redis
const trackUserPresence = async (userId, projectId, socketId) => {
  const presenceKey = cacheService.generateKey('presence', `${projectId}:${userId}`);
  await cacheService.set(presenceKey, {
    userId,
    projectId,
    socketId,
    lastSeen: new Date().toISOString()
  }, 300); // 5 minutes TTL
};

// Get active users for a project
const getProjectPresence = async (projectId) => {
  const pattern = cacheService.generateKey('presence', `${projectId}:*`);
  const keys = await cacheService.client.keys(pattern);
  const presence = await cacheService.mget(keys);
  return presence.filter(p => p !== null);
};
```

## Performance Optimization Guidelines

### Database Query Optimization
```javascript
// Use appropriate indexes
const optimizedProjectQuery = await prisma.project.findMany({
  where: {
    status: 'active',           // Uses idx_projects_status
    clientId: clientId,         // Uses idx_projects_client_id
    startDate: { gte: startDate } // Uses idx_projects_start_date
  },
  select: {
    id: true,
    name: true,
    status: true,
    progress: true,
    client: { select: { name: true } } // Only select needed fields
  }
});

// Use database-level aggregations
const projectStats = await prisma.project.aggregate({
  where: { status: 'active' },
  _count: { id: true },
  _avg: { progress: true },
  _sum: { budget: true }
});
```

### Caching Strategy
```javascript
// Layer caching by data volatility
const CACHE_LAYERS = {
  static: 86400,      // 24 hours (users, clients)
  slow: 7200,         // 2 hours (projects, materials)
  medium: 1800,       // 30 minutes (tasks, drawings)
  fast: 300,          // 5 minutes (notifications, stats)
  realtime: 60        // 1 minute (presence, live data)
};

// Implement cache warming
const warmCache = async () => {
  const activeProjects = await prisma.project.findMany({
    where: { status: { in: ['active', 'on_tender'] } }
  });
  
  for (const project of activeProjects) {
    const cacheKey = cacheService.generateKey('project', project.id);
    await cacheService.set(cacheKey, project, CACHE_LAYERS.slow);
  }
};
```

## Security Guidelines

### Data Validation
```javascript
const Joi = require('joi');

const projectValidationSchema = Joi.object({
  name: Joi.string().required().max(200),
  description: Joi.string().optional().max(1000),
  type: Joi.string().valid('commercial', 'residential', 'retail', 'hospitality', 'industrial', 'healthcare'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  budget: Joi.number().positive().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional(),
  clientId: Joi.string().uuid().required()
});
```

### Row-Level Security
```javascript
// Set user context for RLS
const setUserContext = async (userId) => {
  await prisma.$executeRaw`SET app.current_user_id = ${userId}`;
};

// Use in authenticated routes
app.use('/api', authenticateToken, async (req, res, next) => {
  if (req.user) {
    await setUserContext(req.user.id);
  }
  next();
});
```

### Audit Trail Requirements
```javascript
// Required audit logging for sensitive operations
const AUDIT_REQUIRED_ACTIONS = [
  'user_create', 'user_update', 'user_delete',
  'project_create', 'project_update', 'project_delete',
  'client_create', 'client_update', 'client_delete',
  'drawing_approve', 'drawing_reject',
  'material_approve', 'data_export'
];

const requireAudit = (action) => async (req, res, next) => {
  if (AUDIT_REQUIRED_ACTIONS.includes(action)) {
    req.auditRequired = action;
  }
  next();
};
```

## Testing Integration

### Database Testing
```javascript
// Test database setup
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prismaTest = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_TEST } }
});

beforeEach(async () => {
  // Reset test database
  execSync('npx prisma migrate reset --force', { 
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST }
  });
  
  // Seed with test data
  await seedTestData();
});
```

### Cache Testing
```javascript
// Mock cache service for testing
const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  deletePattern: jest.fn()
};

beforeEach(() => {
  app.locals.cacheService = mockCacheService;
});
```

This completes the comprehensive API contracts and integration documentation for all subagents. The database foundation is now fully implemented and ready for the next phases of development.