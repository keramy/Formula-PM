/**
 * Enhanced Formula PM Backend Server
 * Full Prisma-enabled server with complete CRUD operations
 * Maintains demo mode fallback for development
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { Server } = require('socket.io');
require('dotenv').config();

// Initialize Prisma client
const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
  errorFormat: 'pretty'
});

// Demo mode user for testing - using first user from DB as demo
const demoUser = {
  id: '21318ce4-7eaa-4630-9093-bdd68cce8cee', // Using Jennifer Martinez's ID from seed data
  email: 'demo@formulapm.com',
  firstName: 'Demo',
  lastName: 'User',
  role: 'admin'
};

// Demo data for fallback mode
const demoData = {
  users: [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@formulapm.com', role: 'project_manager', status: 'active' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@formulapm.com', role: 'designer', status: 'active' }
  ],
  projects: [
    { id: '1', name: 'Demo Project 1', type: 'commercial', status: 'active', priority: 'high', clientId: '1' },
    { id: '2', name: 'Demo Project 2', type: 'residential', status: 'completed', priority: 'medium', clientId: '2' }
  ],
  tasks: [
    { id: '1', name: 'Design Review', projectId: '1', status: 'in_progress', assignedTo: '1', priority: 'high' },
    { id: '2', name: 'Material Selection', projectId: '1', status: 'pending', assignedTo: '2', priority: 'medium' }
  ],
  clients: [
    { id: '1', name: 'ABC Corporation', email: 'contact@abc.com', status: 'active', type: 'commercial' },
    { id: '2', name: 'Smith Residence', email: 'smith@email.com', status: 'active', type: 'residential' }
  ],
  teamMembers: [
    { projectId: '1', userId: '1', role: 'project_manager' },
    { projectId: '1', userId: '2', role: 'designer' }
  ],
  notifications: [
    { id: '1', userId: '1', type: 'task_assigned', title: 'New Task Assigned', message: 'You have been assigned a new task' },
    { id: '2', userId: '2', type: 'project_update', title: 'Project Updated', message: 'Project details have been updated' }
  ],
  shopDrawings: [
    { id: '1', projectId: '1', fileName: 'Kitchen_Cabinet_Rev_A.pdf', status: 'approved', version: 'Rev A' },
    { id: '2', projectId: '2', fileName: 'Bathroom_Vanity_Rev_B.pdf', status: 'pending', version: 'Rev B' }
  ],
  materialSpecs: [
    { id: '1', projectId: '1', description: 'Oak Wood Panels', category: 'Wood', quantity: 50, unit: 'sqft', status: 'ordered' },
    { id: '2', projectId: '2', description: 'Marble Countertop', category: 'Stone', quantity: 25, unit: 'sqft', status: 'pending' }
  ]
};

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5015;

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3003",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.IO connection handling
const connectedUsers = new Map(); // socketId -> user data
const userSockets = new Map(); // userId -> Set of socket IDs

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);
  
  // Store socket connection
  socket.on('authenticate', (data) => {
    try {
      const { userId, userData } = data;
      
      // Store user connection
      connectedUsers.set(socket.id, { userId, userData, connectedAt: new Date() });
      
      // Track user sockets
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);
      
      socket.userId = userId;
      socket.userData = userData;
      
      // Join user to their personal room
      socket.join(`user:${userId}`);
      
      console.log(`👤 User authenticated: ${userData.firstName} ${userData.lastName} (${socket.id})`);
      
      // Send authentication success
      socket.emit('authenticated', { success: true, userId });
      
      // Broadcast user online status
      socket.broadcast.emit('user_presence', {
        userId,
        status: 'online',
        user: userData,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('❌ Authentication error:', error);
      socket.emit('authentication_error', { error: error.message });
    }
  });
  
  // Handle project room joining
  socket.on('join_project', (data) => {
    try {
      const { projectId } = data;
      if (projectId && socket.userId) {
        socket.join(`project:${projectId}`);
        console.log(`📂 User ${socket.userData?.firstName} joined project room: ${projectId}`);
        
        // Notify other project members
        socket.to(`project:${projectId}`).emit('user_joined_project', {
          projectId,
          userId: socket.userId,
          user: socket.userData,
          timestamp: new Date()
        });
        
        socket.emit('joined_project', { success: true, projectId });
      }
    } catch (error) {
      console.error('❌ Join project error:', error);
      socket.emit('error', { message: 'Failed to join project' });
    }
  });
  
  // Handle project room leaving
  socket.on('leave_project', (data) => {
    try {
      const { projectId } = data;
      if (projectId && socket.userId) {
        socket.leave(`project:${projectId}`);
        console.log(`📂 User ${socket.userData?.firstName} left project room: ${projectId}`);
        
        // Notify other project members
        socket.to(`project:${projectId}`).emit('user_left_project', {
          projectId,
          userId: socket.userId,
          timestamp: new Date()
        });
        
        socket.emit('left_project', { success: true, projectId });
      }
    } catch (error) {
      console.error('❌ Leave project error:', error);
    }
  });
  
  // Handle real-time updates
  socket.on('update_data', (data) => {
    try {
      const { type, resourceId, projectId, updates } = data;
      
      // Broadcast to project room
      if (projectId) {
        socket.to(`project:${projectId}`).emit(`${type}_updated`, {
          resourceId,
          updates,
          updatedBy: socket.userData,
          timestamp: new Date()
        });
      }
      
      // Broadcast global activity
      io.emit('activity_update', {
        type,
        action: 'updated',
        resourceId,
        projectId,
        user: socket.userData,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('❌ Update data error:', error);
    }
  });
  
  // Handle notifications
  socket.on('send_notification', (data) => {
    try {
      const { targetUserId, notification } = data;
      
      // Send to specific user
      if (targetUserId) {
        io.to(`user:${targetUserId}`).emit('notification_received', {
          ...notification,
          fromUser: socket.userData,
          timestamp: new Date()
        });
      }
      
    } catch (error) {
      console.error('❌ Send notification error:', error);
    }
  });
  
  // Handle typing indicators
  socket.on('typing_start', (data) => {
    try {
      const { projectId, location } = data;
      if (projectId) {
        socket.to(`project:${projectId}`).emit('user_typing', {
          userId: socket.userId,
          user: socket.userData,
          location,
          action: 'start',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('❌ Typing start error:', error);
    }
  });
  
  socket.on('typing_stop', (data) => {
    try {
      const { projectId, location } = data;
      if (projectId) {
        socket.to(`project:${projectId}`).emit('user_typing', {
          userId: socket.userId,
          user: socket.userData,
          location,
          action: 'stop',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('❌ Typing stop error:', error);
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    try {
      const connectionData = connectedUsers.get(socket.id);
      
      if (connectionData) {
        const { userId, userData } = connectionData;
        
        // Remove socket from user's socket set
        if (userSockets.has(userId)) {
          userSockets.get(userId).delete(socket.id);
          
          // If no more sockets for this user, mark as offline
          if (userSockets.get(userId).size === 0) {
            userSockets.delete(userId);
            
            // Broadcast user offline status
            socket.broadcast.emit('user_presence', {
              userId,
              status: 'offline',
              user: userData,
              timestamp: new Date()
            });
          }
        }
        
        connectedUsers.delete(socket.id);
        console.log(`👋 User disconnected: ${userData?.firstName} ${userData?.lastName} (${socket.id})`);
      } else {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      }
    } catch (error) {
      console.error('❌ Disconnect error:', error);
    }
  });
});

// Broadcast notification function
const broadcastNotification = (notification, targetUserId = null) => {
  if (targetUserId) {
    io.to(`user:${targetUserId}`).emit('notification_received', notification);
  } else {
    io.emit('notification_received', notification);
  }
};

// Broadcast activity update function
const broadcastActivity = (activity) => {
  if (activity.projectId) {
    io.to(`project:${activity.projectId}`).emit('activity_update', activity);
  }
  io.emit('global_activity_update', activity);
};

// Broadcast project update function
const broadcastProjectUpdate = (projectId, updateType, data) => {
  io.to(`project:${projectId}`).emit('project_updated', {
    type: updateType,
    data,
    timestamp: new Date()
  });
};

// Database connection status
let isDatabaseConnected = false;
let isDemoMode = false;

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    isDatabaseConnected = true;
    return true;
  } catch (error) {
    console.warn('⚠️ Database connection failed, using demo mode:', error.message);
    isDemoMode = true;
    return false;
  }
}

// Middleware setup
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3003',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Demo mode middleware
app.use((req, res, next) => {
  req.user = demoUser;
  req.isDemoMode = isDemoMode;
  next();
});

// Store Prisma client in app locals
app.locals.prisma = prisma;

// Utility functions
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const errorResponse = (res, message, statusCode = 500, details = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    details,
    timestamp: new Date().toISOString()
  });
};

const paginatedResponse = (res, data, pagination, message = 'Success') => {
  res.json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit)
    },
    timestamp: new Date().toISOString()
  });
};

// Validation helpers
const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id) || id.match(/^\d+$/); // Accept numeric IDs for demo mode
};

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: isDemoMode ? 'demo' : 'production',
    database: isDatabaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version
    }
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Formula PM API Server (Enhanced)',
    version: '2.0.0',
    status: 'operational',
    mode: isDemoMode ? 'demo' : 'production',
    database: isDatabaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// USER ROUTES - Full CRUD Operations
// GET /api/v1/users/me
app.get('/api/v1/users/me', asyncHandler(async (req, res) => {
  successResponse(res, req.user, 'User profile retrieved successfully');
}));

// GET /api/v1/users - List all users
app.get('/api/v1/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', role = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  if (isDemoMode) {
    let filteredUsers = [...demoData.users];
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    const paginatedUsers = filteredUsers.slice(skip, skip + take);
    paginatedResponse(res, paginatedUsers, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUsers.length
    }, 'Users retrieved successfully');
    return;
  }

  const where = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (role) {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        position: true,
        department: true,
        status: true,
        joinDate: true,
        avatarUrl: true,
        phone: true
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  paginatedResponse(res, users, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Users retrieved successfully');
}));

// GET /api/v1/users/:id - Get user by ID
app.get('/api/v1/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid user ID format', 400);
  }

  if (isDemoMode) {
    const user = demoData.users.find(u => u.id === id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, user, 'User retrieved successfully');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      position: true,
      department: true,
      phone: true,
      avatarUrl: true,
      status: true,
      joinDate: true,
      skills: true,
      certifications: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  successResponse(res, user, 'User retrieved successfully');
}));

// POST /api/v1/users - Create new user
app.post('/api/v1/users', asyncHandler(async (req, res) => {
  const { firstName, lastName, email, role = 'craftsman', position, department, phone } = req.body;

  if (!firstName || !lastName || !email) {
    return errorResponse(res, 'First name, last name, and email are required', 400);
  }

  if (isDemoMode) {
    const newUser = {
      id: String(demoData.users.length + 1),
      firstName,
      lastName,
      email,
      role,
      position,
      department,
      phone,
      status: 'active'
    };
    demoData.users.push(newUser);
    return successResponse(res, newUser, 'User created successfully', 201);
  }

  try {
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: 'temp-hash', // In real app, hash the password
        role,
        position: position?.trim(),
        department: department?.trim(),
        phone: phone?.trim(),
        status: 'active'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        position: true,
        department: true,
        phone: true,
        status: true,
        createdAt: true
      }
    });

    successResponse(res, user, 'User created successfully', 201);
  } catch (error) {
    if (error.code === 'P2002') {
      return errorResponse(res, 'Email already exists', 409);
    }
    throw error;
  }
}));

// PUT /api/v1/users/:id - Update user
app.put('/api/v1/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, role, position, department, phone, status } = req.body;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid user ID format', 400);
  }

  if (isDemoMode) {
    const userIndex = demoData.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return errorResponse(res, 'User not found', 404);
    }
    
    const updates = { firstName, lastName, email, role, position, department, phone, status };
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        demoData.users[userIndex][key] = updates[key];
      }
    });
    
    return successResponse(res, demoData.users[userIndex], 'User updated successfully');
  }

  const updates = {};
  if (firstName) updates.firstName = firstName.trim();
  if (lastName) updates.lastName = lastName.trim();
  if (email) updates.email = email.trim().toLowerCase();
  if (role) updates.role = role;
  if (position !== undefined) updates.position = position?.trim();
  if (department !== undefined) updates.department = department?.trim();
  if (phone !== undefined) updates.phone = phone?.trim();
  if (status) updates.status = status;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        position: true,
        department: true,
        phone: true,
        status: true,
        updatedAt: true
      }
    });

    successResponse(res, user, 'User updated successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'User not found', 404);
    }
    if (error.code === 'P2002') {
      return errorResponse(res, 'Email already exists', 409);
    }
    throw error;
  }
}));

// DELETE /api/v1/users/:id - Delete user
app.delete('/api/v1/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid user ID format', 400);
  }

  if (isDemoMode) {
    const userIndex = demoData.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return errorResponse(res, 'User not found', 404);
    }
    demoData.users.splice(userIndex, 1);
    return successResponse(res, null, 'User deleted successfully');
  }

  try {
    await prisma.user.delete({
      where: { id }
    });

    successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'User not found', 404);
    }
    throw error;
  }
}));

// PROJECT ROUTES - Full CRUD Operations
// GET /api/v1/projects - List all projects
app.get('/api/v1/projects', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', status = '', type = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  if (isDemoMode) {
    let filteredProjects = [...demoData.projects];
    if (search) {
      filteredProjects = filteredProjects.filter(project => 
        project.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status) {
      filteredProjects = filteredProjects.filter(project => project.status === status);
    }
    if (type) {
      filteredProjects = filteredProjects.filter(project => project.type === type);
    }
    
    const paginatedProjects = filteredProjects.slice(skip, skip + take);
    paginatedResponse(res, paginatedProjects, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProjects.length
    }, 'Projects retrieved successfully');
    return;
  }

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (status) where.status = status;
  if (type) where.type = type;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
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
        client: {
          select: { id: true, name: true, companyName: true }
        },
        projectManager: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      skip,
      take,
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.project.count({ where })
  ]);

  paginatedResponse(res, projects, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Projects retrieved successfully');
}));

// GET /api/v1/projects/:id - Get project by ID
app.get('/api/v1/projects/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid project ID format', 400);
  }

  if (isDemoMode) {
    const project = demoData.projects.find(p => p.id === id);
    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }
    return successResponse(res, project, 'Project retrieved successfully');
  }

  const project = await prisma.project.findUnique({
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
        select: { id: true, name: true, companyName: true, email: true }
      },
      projectManager: {
        select: { id: true, firstName: true, lastName: true, email: true }
      },
      creator: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  });

  if (!project) {
    return errorResponse(res, 'Project not found', 404);
  }

  successResponse(res, project, 'Project retrieved successfully');
}));

// POST /api/v1/projects - Create new project
app.post('/api/v1/projects', asyncHandler(async (req, res) => {
  const { name, description, type, priority = 'medium', budget, startDate, endDate, location, clientId } = req.body;

  if (!name || !type || !clientId) {
    return errorResponse(res, 'Name, type, and client ID are required', 400);
  }

  if (isDemoMode) {
    const newProject = {
      id: String(demoData.projects.length + 1),
      name,
      description,
      type,
      priority,
      budget,
      startDate,
      endDate,
      location,
      clientId,
      status: 'draft'
    };
    demoData.projects.push(newProject);
    return successResponse(res, newProject, 'Project created successfully', 201);
  }

  try {
    const project = await prisma.project.create({
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
        createdBy: req.user.id,
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
        }
      }
    });

    // Broadcast project creation
    broadcastActivity({
      id: `activity-${Date.now()}`,
      type: 'project',
      action: 'created',
      resourceId: project.id,
      projectId: project.id,
      user: { id: req.user.id, firstName: req.user.firstName, lastName: req.user.lastName },
      data: { name: project.name, type: project.type },
      timestamp: new Date().toISOString()
    });

    // Send notification to team members
    broadcastNotification({
      id: `notification-${Date.now()}`,
      type: 'project_created',
      title: 'New Project Created',
      message: `${req.user.firstName} ${req.user.lastName} created a new project: ${project.name}`,
      data: { projectId: project.id, projectName: project.name },
      fromUser: { id: req.user.id, firstName: req.user.firstName, lastName: req.user.lastName },
      timestamp: new Date().toISOString()
    });

    successResponse(res, project, 'Project created successfully', 201);
  } catch (error) {
    if (error.code === 'P2003') {
      return errorResponse(res, 'Invalid client ID', 400);
    }
    throw error;
  }
}));

// PUT /api/v1/projects/:id - Update project
app.put('/api/v1/projects/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, type, status, priority, budget, startDate, endDate, progress, location } = req.body;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid project ID format', 400);
  }

  if (isDemoMode) {
    const projectIndex = demoData.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return errorResponse(res, 'Project not found', 404);
    }
    
    const updates = { name, description, type, status, priority, budget, startDate, endDate, progress, location };
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        demoData.projects[projectIndex][key] = updates[key];
      }
    });
    
    return successResponse(res, demoData.projects[projectIndex], 'Project updated successfully');
  }

  const updates = {};
  if (name) updates.name = name.trim();
  if (description !== undefined) updates.description = description?.trim();
  if (type) updates.type = type;
  if (status) updates.status = status;
  if (priority) updates.priority = priority;
  if (budget !== undefined) updates.budget = budget ? parseFloat(budget) : null;
  if (startDate !== undefined) updates.startDate = startDate ? new Date(startDate) : null;
  if (endDate !== undefined) updates.endDate = endDate ? new Date(endDate) : null;
  if (progress !== undefined) updates.progress = parseInt(progress);
  if (location !== undefined) updates.location = location?.trim();

  try {
    const project = await prisma.project.update({
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
        }
      }
    });

    // Broadcast project update
    broadcastActivity({
      id: `activity-${Date.now()}`,
      type: 'project',
      action: 'updated',
      resourceId: project.id,
      projectId: project.id,
      user: { id: req.user.id, firstName: req.user.firstName, lastName: req.user.lastName },
      data: { name: project.name, updates: Object.keys(updates) },
      timestamp: new Date().toISOString()
    });

    // Broadcast project update to project room
    broadcastProjectUpdate(project.id, 'updated', project);

    successResponse(res, project, 'Project updated successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Project not found', 404);
    }
    throw error;
  }
}));

// DELETE /api/v1/projects/:id - Delete project
app.delete('/api/v1/projects/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid project ID format', 400);
  }

  if (isDemoMode) {
    const projectIndex = demoData.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return errorResponse(res, 'Project not found', 404);
    }
    demoData.projects.splice(projectIndex, 1);
    return successResponse(res, null, 'Project deleted successfully');
  }

  try {
    await prisma.project.delete({
      where: { id }
    });

    successResponse(res, null, 'Project deleted successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Project not found', 404);
    }
    throw error;
  }
}));

// TASK ROUTES - Full CRUD Operations
// GET /api/v1/tasks - List all tasks
app.get('/api/v1/tasks', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, projectId = '', status = '', assignedTo = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  if (isDemoMode) {
    let filteredTasks = [...demoData.tasks];
    if (projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === projectId);
    }
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    if (assignedTo) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === assignedTo);
    }
    
    const paginatedTasks = filteredTasks.slice(skip, skip + take);
    paginatedResponse(res, paginatedTasks, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredTasks.length
    }, 'Tasks retrieved successfully');
    return;
  }

  const where = {};
  if (projectId) where.projectId = projectId;
  if (status) where.status = status;
  if (assignedTo) where.assignedTo = assignedTo;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        progress: true,
        createdAt: true,
        project: {
          select: { id: true, name: true }
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true }
        },
        creator: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.task.count({ where })
  ]);

  paginatedResponse(res, tasks, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Tasks retrieved successfully');
}));

// GET /api/v1/tasks/:id - Get task by ID
app.get('/api/v1/tasks/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid task ID format', 400);
  }

  if (isDemoMode) {
    const task = demoData.tasks.find(t => t.id === id);
    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }
    return successResponse(res, task, 'Task retrieved successfully');
  }

  const task = await prisma.task.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      estimatedHours: true,
      actualHours: true,
      progress: true,
      createdAt: true,
      updatedAt: true,
      completedAt: true,
      project: {
        select: { id: true, name: true }
      },
      assignee: {
        select: { id: true, firstName: true, lastName: true, email: true }
      },
      creator: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  });

  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  successResponse(res, task, 'Task retrieved successfully');
}));

// POST /api/v1/tasks - Create new task
app.post('/api/v1/tasks', asyncHandler(async (req, res) => {
  const { projectId, name, description, priority = 'medium', assignedTo, dueDate, estimatedHours } = req.body;

  if (!projectId || !name) {
    return errorResponse(res, 'Project ID and name are required', 400);
  }

  if (isDemoMode) {
    const newTask = {
      id: String(demoData.tasks.length + 1),
      projectId,
      name,
      description,
      priority,
      assignedTo,
      dueDate,
      estimatedHours,
      status: 'pending',
      progress: 0
    };
    demoData.tasks.push(newTask);
    return successResponse(res, newTask, 'Task created successfully', 201);
  }

  try {
    const task = await prisma.task.create({
      data: {
        projectId,
        name: name.trim(),
        description: description?.trim(),
        priority,
        assignedTo,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        createdBy: req.user.id,
        status: 'pending',
        progress: 0
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        estimatedHours: true,
        progress: true,
        createdAt: true,
        project: {
          select: { id: true, name: true }
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    successResponse(res, task, 'Task created successfully', 201);
  } catch (error) {
    if (error.code === 'P2003') {
      return errorResponse(res, 'Invalid project ID or assignee ID', 400);
    }
    throw error;
  }
}));

// PUT /api/v1/tasks/:id - Update task
app.put('/api/v1/tasks/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, status, priority, assignedTo, dueDate, estimatedHours, actualHours, progress } = req.body;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid task ID format', 400);
  }

  if (isDemoMode) {
    const taskIndex = demoData.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return errorResponse(res, 'Task not found', 404);
    }
    
    const updates = { name, description, status, priority, assignedTo, dueDate, estimatedHours, actualHours, progress };
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        demoData.tasks[taskIndex][key] = updates[key];
      }
    });
    
    return successResponse(res, demoData.tasks[taskIndex], 'Task updated successfully');
  }

  const updates = {};
  if (name) updates.name = name.trim();
  if (description !== undefined) updates.description = description?.trim();
  if (status) {
    updates.status = status;
    if (status === 'completed') {
      updates.completedAt = new Date();
      updates.progress = 100;
    }
  }
  if (priority) updates.priority = priority;
  if (assignedTo !== undefined) updates.assignedTo = assignedTo;
  if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null;
  if (estimatedHours !== undefined) updates.estimatedHours = estimatedHours ? parseFloat(estimatedHours) : null;
  if (actualHours !== undefined) updates.actualHours = actualHours ? parseFloat(actualHours) : null;
  if (progress !== undefined) updates.progress = parseInt(progress);

  try {
    const task = await prisma.task.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        estimatedHours: true,
        actualHours: true,
        progress: true,
        completedAt: true,
        updatedAt: true,
        project: {
          select: { id: true, name: true }
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    successResponse(res, task, 'Task updated successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Task not found', 404);
    }
    if (error.code === 'P2003') {
      return errorResponse(res, 'Invalid assignee ID', 400);
    }
    throw error;
  }
}));

// DELETE /api/v1/tasks/:id - Delete task
app.delete('/api/v1/tasks/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid task ID format', 400);
  }

  if (isDemoMode) {
    const taskIndex = demoData.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return errorResponse(res, 'Task not found', 404);
    }
    demoData.tasks.splice(taskIndex, 1);
    return successResponse(res, null, 'Task deleted successfully');
  }

  try {
    await prisma.task.delete({
      where: { id }
    });

    successResponse(res, null, 'Task deleted successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Task not found', 404);
    }
    throw error;
  }
}));

// CLIENT ROUTES - Full CRUD Operations
// GET /api/v1/clients - List all clients
app.get('/api/v1/clients', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', status = '', type = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  if (isDemoMode) {
    let filteredClients = [...demoData.clients];
    if (search) {
      filteredClients = filteredClients.filter(client => 
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status) {
      filteredClients = filteredClients.filter(client => client.status === status);
    }
    if (type) {
      filteredClients = filteredClients.filter(client => client.type === type);
    }
    
    const paginatedClients = filteredClients.slice(skip, skip + take);
    paginatedResponse(res, paginatedClients, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredClients.length
    }, 'Clients retrieved successfully');
    return;
  }

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (status) where.status = status;
  if (type) where.type = type;

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
        type: true,
        status: true,
        totalProjectValue: true,
        createdAt: true
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.client.count({ where })
  ]);

  paginatedResponse(res, clients, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Clients retrieved successfully');
}));

// GET /api/v1/clients/:id - Get client by ID
app.get('/api/v1/clients/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid client ID format', 400);
  }

  if (isDemoMode) {
    const client = demoData.clients.find(c => c.id === id);
    if (!client) {
      return errorResponse(res, 'Client not found', 404);
    }
    return successResponse(res, client, 'Client retrieved successfully');
  }

  const client = await prisma.client.findUnique({
    where: { id },
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
      notes: true,
      createdAt: true,
      updatedAt: true,
      projects: {
        select: {
          id: true,
          name: true,
          status: true,
          budget: true,
          startDate: true,
          endDate: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!client) {
    return errorResponse(res, 'Client not found', 404);
  }

  successResponse(res, client, 'Client retrieved successfully');
}));

// POST /api/v1/clients - Create new client
app.post('/api/v1/clients', asyncHandler(async (req, res) => {
  const { name, companyName, contactPerson, email, phone, address, type, industry, notes } = req.body;

  if (!name || !contactPerson || !email) {
    return errorResponse(res, 'Name, contact person, and email are required', 400);
  }

  if (isDemoMode) {
    const newClient = {
      id: String(demoData.clients.length + 1),
      name,
      companyName,
      contactPerson,
      email,
      phone,
      address,
      type,
      industry,
      notes,
      status: 'active',
      totalProjectValue: 0
    };
    demoData.clients.push(newClient);
    return successResponse(res, newClient, 'Client created successfully', 201);
  }

  try {
    const client = await prisma.client.create({
      data: {
        name: name.trim(),
        companyName: companyName?.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim(),
        address: address?.trim(),
        type,
        industry: industry?.trim(),
        notes: notes?.trim(),
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
  } catch (error) {
    if (error.code === 'P2002') {
      return errorResponse(res, 'Email already exists', 409);
    }
    throw error;
  }
}));

// PUT /api/v1/clients/:id - Update client
app.put('/api/v1/clients/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, companyName, contactPerson, email, phone, address, type, industry, status, notes } = req.body;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid client ID format', 400);
  }

  if (isDemoMode) {
    const clientIndex = demoData.clients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      return errorResponse(res, 'Client not found', 404);
    }
    
    const updates = { name, companyName, contactPerson, email, phone, address, type, industry, status, notes };
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        demoData.clients[clientIndex][key] = updates[key];
      }
    });
    
    return successResponse(res, demoData.clients[clientIndex], 'Client updated successfully');
  }

  const updates = {};
  if (name) updates.name = name.trim();
  if (companyName !== undefined) updates.companyName = companyName?.trim();
  if (contactPerson) updates.contactPerson = contactPerson.trim();
  if (email) updates.email = email.trim().toLowerCase();
  if (phone !== undefined) updates.phone = phone?.trim();
  if (address !== undefined) updates.address = address?.trim();
  if (type) updates.type = type;
  if (industry !== undefined) updates.industry = industry?.trim();
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes?.trim();

  try {
    const client = await prisma.client.update({
      where: { id },
      data: updates,
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
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Client not found', 404);
    }
    if (error.code === 'P2002') {
      return errorResponse(res, 'Email already exists', 409);
    }
    throw error;
  }
}));

// DELETE /api/v1/clients/:id - Delete client
app.delete('/api/v1/clients/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid client ID format', 400);
  }

  if (isDemoMode) {
    const clientIndex = demoData.clients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      return errorResponse(res, 'Client not found', 404);
    }
    demoData.clients.splice(clientIndex, 1);
    return successResponse(res, null, 'Client deleted successfully');
  }

  try {
    // Check if client has active projects
    const projectCount = await prisma.project.count({
      where: { clientId: id, status: { not: 'cancelled' } }
    });

    if (projectCount > 0) {
      return errorResponse(res, 'Cannot delete client with active projects', 400);
    }

    await prisma.client.delete({
      where: { id }
    });

    successResponse(res, null, 'Client deleted successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Client not found', 404);
    }
    throw error;
  }
}));

// TEAM MEMBER ROUTES - Full CRUD Operations
// GET /api/v1/team-members - List all team members (project assignments)
app.get('/api/v1/team-members', asyncHandler(async (req, res) => {
  const { projectId = '', userId = '' } = req.query;

  if (isDemoMode) {
    let filteredMembers = [...demoData.teamMembers];
    if (projectId) {
      filteredMembers = filteredMembers.filter(member => member.projectId === projectId);
    }
    if (userId) {
      filteredMembers = filteredMembers.filter(member => member.userId === userId);
    }
    
    return successResponse(res, filteredMembers, 'Team members retrieved successfully');
  }

  const where = {};
  if (projectId) where.projectId = projectId;
  if (userId) where.userId = userId;

  const teamMembers = await prisma.projectTeamMember.findMany({
    where,
    select: {
      projectId: true,
      userId: true,
      role: true,
      assignedAt: true,
      project: {
        select: { id: true, name: true, status: true }
      },
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
    orderBy: { assignedAt: 'desc' }
  });

  successResponse(res, teamMembers, 'Team members retrieved successfully');
}));

// POST /api/v1/team-members - Add team member to project
app.post('/api/v1/team-members', asyncHandler(async (req, res) => {
  const { projectId, userId, role = 'team_member' } = req.body;

  if (!projectId || !userId) {
    return errorResponse(res, 'Project ID and user ID are required', 400);
  }

  if (isDemoMode) {
    const existingMember = demoData.teamMembers.find(
      member => member.projectId === projectId && member.userId === userId
    );
    
    if (existingMember) {
      return errorResponse(res, 'User is already a team member of this project', 409);
    }

    const newMember = { projectId, userId, role };
    demoData.teamMembers.push(newMember);
    return successResponse(res, newMember, 'Team member added successfully', 201);
  }

  try {
    const teamMember = await prisma.projectTeamMember.create({
      data: { projectId, userId, role },
      select: {
        projectId: true,
        userId: true,
        role: true,
        assignedAt: true,
        project: {
          select: { id: true, name: true }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            position: true
          }
        }
      }
    });

    successResponse(res, teamMember, 'Team member added successfully', 201);
  } catch (error) {
    if (error.code === 'P2002') {
      return errorResponse(res, 'User is already a team member of this project', 409);
    }
    if (error.code === 'P2003') {
      return errorResponse(res, 'Invalid project ID or user ID', 400);
    }
    throw error;
  }
}));

// DELETE /api/v1/team-members - Remove team member from project
app.delete('/api/v1/team-members', asyncHandler(async (req, res) => {
  const { projectId, userId } = req.body;

  if (!projectId || !userId) {
    return errorResponse(res, 'Project ID and user ID are required', 400);
  }

  if (isDemoMode) {
    const memberIndex = demoData.teamMembers.findIndex(
      member => member.projectId === projectId && member.userId === userId
    );
    
    if (memberIndex === -1) {
      return errorResponse(res, 'Team member not found', 404);
    }

    demoData.teamMembers.splice(memberIndex, 1);
    return successResponse(res, null, 'Team member removed successfully');
  }

  try {
    await prisma.projectTeamMember.delete({
      where: {
        projectId_userId: { projectId, userId }
      }
    });

    successResponse(res, null, 'Team member removed successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Team member not found', 404);
    }
    throw error;
  }
}));

// NOTIFICATION ROUTES - Full CRUD Operations
// GET /api/v1/notifications - List notifications
app.get('/api/v1/notifications', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, userId = req.user.id, readStatus = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  if (isDemoMode) {
    let filteredNotifications = demoData.notifications.filter(n => n.userId === userId);
    if (readStatus !== '') {
      filteredNotifications = filteredNotifications.filter(n => 
        n.readStatus === (readStatus === 'true')
      );
    }
    
    const paginatedNotifications = filteredNotifications.slice(skip, skip + take);
    paginatedResponse(res, paginatedNotifications, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredNotifications.length
    }, 'Notifications retrieved successfully');
    return;
  }

  const where = { userId };
  if (readStatus !== '') {
    where.readStatus = readStatus === 'true';
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        readStatus: true,
        data: true,
        createdAt: true,
        expiresAt: true
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where })
  ]);

  paginatedResponse(res, notifications, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Notifications retrieved successfully');
}));

// GET /api/v1/notifications/:id - Get notification by ID
app.get('/api/v1/notifications/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid notification ID format', 400);
  }

  if (isDemoMode) {
    const notification = demoData.notifications.find(n => n.id === id);
    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }
    return successResponse(res, notification, 'Notification retrieved successfully');
  }

  const notification = await prisma.notification.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      readStatus: true,
      data: true,
      createdAt: true,
      expiresAt: true,
      user: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  });

  if (!notification) {
    return errorResponse(res, 'Notification not found', 404);
  }

  successResponse(res, notification, 'Notification retrieved successfully');
}));

// POST /api/v1/notifications - Create new notification
app.post('/api/v1/notifications', asyncHandler(async (req, res) => {
  const { userId, type, title, message, data, expiresAt } = req.body;

  if (!userId || !type || !title || !message) {
    return errorResponse(res, 'User ID, type, title, and message are required', 400);
  }

  if (isDemoMode) {
    const newNotification = {
      id: String(demoData.notifications.length + 1),
      userId,
      type,
      title,
      message,
      data,
      expiresAt,
      readStatus: false
    };
    demoData.notifications.push(newNotification);
    return successResponse(res, newNotification, 'Notification created successfully', 201);
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title: title.trim(),
        message: message.trim(),
        data,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        readStatus: false
      },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        readStatus: true,
        data: true,
        createdAt: true,
        expiresAt: true
      }
    });

    successResponse(res, notification, 'Notification created successfully', 201);
  } catch (error) {
    if (error.code === 'P2003') {
      return errorResponse(res, 'Invalid user ID', 400);
    }
    throw error;
  }
}));

// PUT /api/v1/notifications/:id - Update notification (mainly for marking as read)
app.put('/api/v1/notifications/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { readStatus } = req.body;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid notification ID format', 400);
  }

  if (isDemoMode) {
    const notificationIndex = demoData.notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      return errorResponse(res, 'Notification not found', 404);
    }
    
    if (readStatus !== undefined) {
      demoData.notifications[notificationIndex].readStatus = readStatus;
    }
    
    return successResponse(res, demoData.notifications[notificationIndex], 'Notification updated successfully');
  }

  const updates = {};
  if (readStatus !== undefined) updates.readStatus = readStatus;

  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        readStatus: true,
        data: true,
        createdAt: true,
        expiresAt: true
      }
    });

    successResponse(res, notification, 'Notification updated successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Notification not found', 404);
    }
    throw error;
  }
}));

// DELETE /api/v1/notifications/:id - Delete notification
app.delete('/api/v1/notifications/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid notification ID format', 400);
  }

  if (isDemoMode) {
    const notificationIndex = demoData.notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      return errorResponse(res, 'Notification not found', 404);
    }
    demoData.notifications.splice(notificationIndex, 1);
    return successResponse(res, null, 'Notification deleted successfully');
  }

  try {
    await prisma.notification.delete({
      where: { id }
    });

    successResponse(res, null, 'Notification deleted successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Notification not found', 404);
    }
    throw error;
  }
}));

// SHOP DRAWING ROUTES - Full CRUD Operations
// GET /api/v1/shop-drawings - List shop drawings
app.get('/api/v1/shop-drawings', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, projectId = '', status = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  if (isDemoMode) {
    let filteredDrawings = [...demoData.shopDrawings];
    if (projectId) {
      filteredDrawings = filteredDrawings.filter(drawing => drawing.projectId === projectId);
    }
    if (status) {
      filteredDrawings = filteredDrawings.filter(drawing => drawing.status === status);
    }
    
    const paginatedDrawings = filteredDrawings.slice(skip, skip + take);
    paginatedResponse(res, paginatedDrawings, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredDrawings.length
    }, 'Shop drawings retrieved successfully');
    return;
  }

  const where = {};
  if (projectId) where.projectId = projectId;
  if (status) where.status = status;

  const [drawings, total] = await Promise.all([
    prisma.shopDrawing.findMany({
      where,
      select: {
        id: true,
        fileName: true,
        drawingType: true,
        room: true,
        status: true,
        version: true,
        uploadDate: true,
        approvedDate: true,
        comments: true,
        project: {
          select: { id: true, name: true }
        },
        approver: {
          select: { id: true, firstName: true, lastName: true }
        },
        creator: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      skip,
      take,
      orderBy: { uploadDate: 'desc' }
    }),
    prisma.shopDrawing.count({ where })
  ]);

  paginatedResponse(res, drawings, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Shop drawings retrieved successfully');
}));

// GET /api/v1/shop-drawings/:id - Get shop drawing by ID
app.get('/api/v1/shop-drawings/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid shop drawing ID format', 400);
  }

  if (isDemoMode) {
    const drawing = demoData.shopDrawings.find(d => d.id === id);
    if (!drawing) {
      return errorResponse(res, 'Shop drawing not found', 404);
    }
    return successResponse(res, drawing, 'Shop drawing retrieved successfully');
  }

  const drawing = await prisma.shopDrawing.findUnique({
    where: { id },
    select: {
      id: true,
      fileName: true,
      drawingType: true,
      room: true,
      status: true,
      version: true,
      filePath: true,
      fileSize: true,
      uploadDate: true,
      approvedDate: true,
      comments: true,
      createdAt: true,
      updatedAt: true,
      project: {
        select: { id: true, name: true }
      },
      scopeItem: {
        select: { id: true, name: true }
      },
      approver: {
        select: { id: true, firstName: true, lastName: true }
      },
      creator: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  });

  if (!drawing) {
    return errorResponse(res, 'Shop drawing not found', 404);
  }

  successResponse(res, drawing, 'Shop drawing retrieved successfully');
}));

// POST /api/v1/shop-drawings - Create new shop drawing
app.post('/api/v1/shop-drawings', asyncHandler(async (req, res) => {
  const { projectId, scopeItemId, fileName, drawingType, room, version = 'Rev A', comments } = req.body;

  if (!projectId || !fileName) {
    return errorResponse(res, 'Project ID and file name are required', 400);
  }

  if (isDemoMode) {
    const newDrawing = {
      id: String(demoData.shopDrawings.length + 1),
      projectId,
      scopeItemId,
      fileName,
      drawingType,
      room,
      version,
      comments,
      status: 'draft'
    };
    demoData.shopDrawings.push(newDrawing);
    return successResponse(res, newDrawing, 'Shop drawing created successfully', 201);
  }

  try {
    const drawing = await prisma.shopDrawing.create({
      data: {
        projectId,
        scopeItemId,
        fileName: fileName.trim(),
        drawingType: drawingType?.trim(),
        room: room?.trim(),
        version,
        comments: comments?.trim(),
        createdBy: req.user.id,
        status: 'draft'
      },
      select: {
        id: true,
        fileName: true,
        drawingType: true,
        room: true,
        status: true,
        version: true,
        uploadDate: true,
        comments: true,
        project: {
          select: { id: true, name: true }
        },
        creator: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    successResponse(res, drawing, 'Shop drawing created successfully', 201);
  } catch (error) {
    if (error.code === 'P2003') {
      return errorResponse(res, 'Invalid project ID or scope item ID', 400);
    }
    throw error;
  }
}));

// PUT /api/v1/shop-drawings/:id - Update shop drawing
app.put('/api/v1/shop-drawings/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fileName, drawingType, room, status, version, comments, approvedBy } = req.body;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid shop drawing ID format', 400);
  }

  if (isDemoMode) {
    const drawingIndex = demoData.shopDrawings.findIndex(d => d.id === id);
    if (drawingIndex === -1) {
      return errorResponse(res, 'Shop drawing not found', 404);
    }
    
    const updates = { fileName, drawingType, room, status, version, comments, approvedBy };
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        demoData.shopDrawings[drawingIndex][key] = updates[key];
      }
    });
    
    return successResponse(res, demoData.shopDrawings[drawingIndex], 'Shop drawing updated successfully');
  }

  const updates = {};
  if (fileName) updates.fileName = fileName.trim();
  if (drawingType !== undefined) updates.drawingType = drawingType?.trim();
  if (room !== undefined) updates.room = room?.trim();
  if (status) {
    updates.status = status;
    if (status === 'approved') {
      updates.approvedDate = new Date();
      if (approvedBy) updates.approvedBy = approvedBy;
    }
  }
  if (version) updates.version = version;
  if (comments !== undefined) updates.comments = comments?.trim();

  try {
    const drawing = await prisma.shopDrawing.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        fileName: true,
        drawingType: true,
        room: true,
        status: true,
        version: true,
        uploadDate: true,
        approvedDate: true,
        comments: true,
        updatedAt: true,
        project: {
          select: { id: true, name: true }
        },
        approver: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    successResponse(res, drawing, 'Shop drawing updated successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Shop drawing not found', 404);
    }
    throw error;
  }
}));

// DELETE /api/v1/shop-drawings/:id - Delete shop drawing
app.delete('/api/v1/shop-drawings/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid shop drawing ID format', 400);
  }

  if (isDemoMode) {
    const drawingIndex = demoData.shopDrawings.findIndex(d => d.id === id);
    if (drawingIndex === -1) {
      return errorResponse(res, 'Shop drawing not found', 404);
    }
    demoData.shopDrawings.splice(drawingIndex, 1);
    return successResponse(res, null, 'Shop drawing deleted successfully');
  }

  try {
    await prisma.shopDrawing.delete({
      where: { id }
    });

    successResponse(res, null, 'Shop drawing deleted successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Shop drawing not found', 404);
    }
    throw error;
  }
}));

// ACTIVITY ROUTES (AuditLog) - Full CRUD Operations
// GET /api/v1/activities - List activities (audit logs)
app.get('/api/v1/activities', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, userId = '', action = '', tableName = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Demo data for activities
  const demoActivities = [
    { id: '1', action: 'create', tableName: 'project', recordId: '1', userId: '1', timestamp: new Date().toISOString() },
    { id: '2', action: 'update', tableName: 'task', recordId: '1', userId: '2', timestamp: new Date().toISOString() }
  ];

  if (isDemoMode) {
    let filteredActivities = [...demoActivities];
    if (userId) {
      filteredActivities = filteredActivities.filter(activity => activity.userId === userId);
    }
    if (action) {
      filteredActivities = filteredActivities.filter(activity => activity.action === action);
    }
    if (tableName) {
      filteredActivities = filteredActivities.filter(activity => activity.tableName === tableName);
    }
    
    const paginatedActivities = filteredActivities.slice(skip, skip + take);
    paginatedResponse(res, paginatedActivities, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredActivities.length
    }, 'Activities retrieved successfully');
    return;
  }

  const where = {};
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (tableName) where.tableName = tableName;

  const [activities, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      select: {
        id: true,
        tableName: true,
        recordId: true,
        action: true,
        oldValues: true,
        newValues: true,
        changedFields: true,
        userEmail: true,
        ipAddress: true,
        timestamp: true,
        user: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      skip,
      take,
      orderBy: { timestamp: 'desc' }
    }),
    prisma.auditLog.count({ where })
  ]);

  paginatedResponse(res, activities, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Activities retrieved successfully');
}));

// GET /api/v1/activities/:id - Get activity by ID
app.get('/api/v1/activities/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid activity ID format', 400);
  }

  if (isDemoMode) {
    const activity = { id, action: 'view', tableName: 'demo', recordId: '1', userId: '1', timestamp: new Date().toISOString() };
    return successResponse(res, activity, 'Activity retrieved successfully');
  }

  const activity = await prisma.auditLog.findUnique({
    where: { id },
    select: {
      id: true,
      tableName: true,
      recordId: true,
      action: true,
      oldValues: true,
      newValues: true,
      changedFields: true,
      userEmail: true,
      ipAddress: true,
      userAgent: true,
      timestamp: true,
      user: {
        select: { id: true, firstName: true, lastName: true, email: true }
      }
    }
  });

  if (!activity) {
    return errorResponse(res, 'Activity not found', 404);
  }

  successResponse(res, activity, 'Activity retrieved successfully');
}));

// POST /api/v1/activities - Create new activity (audit log)
app.post('/api/v1/activities', asyncHandler(async (req, res) => {
  const { tableName, recordId, action, oldValues, newValues, changedFields } = req.body;

  if (!tableName || !recordId || !action) {
    return errorResponse(res, 'Table name, record ID, and action are required', 400);
  }

  if (isDemoMode) {
    const newActivity = {
      id: String(Date.now()),
      tableName,
      recordId,
      action,
      oldValues,
      newValues,
      changedFields,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    };
    return successResponse(res, newActivity, 'Activity logged successfully', 201);
  }

  try {
    const activity = await prisma.auditLog.create({
      data: {
        tableName,
        recordId,
        action,
        oldValues,
        newValues,
        changedFields: changedFields || [],
        userId: req.user.id,
        userEmail: req.user.email,
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent')
      },
      select: {
        id: true,
        tableName: true,
        recordId: true,
        action: true,
        oldValues: true,
        newValues: true,
        changedFields: true,
        timestamp: true,
        user: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    successResponse(res, activity, 'Activity logged successfully', 201);
  } catch (error) {
    throw error;
  }
}));

// UPDATE ROUTES - Full CRUD Operations for general updates/announcements
// GET /api/v1/updates - List updates/announcements
app.get('/api/v1/updates', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type = '', priority = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Demo data for updates
  const demoUpdates = [
    { id: '1', title: 'System Maintenance', content: 'Scheduled maintenance this weekend', type: 'system', priority: 'medium', createdAt: new Date().toISOString() },
    { id: '2', title: 'New Feature Release', content: 'Exciting new features available', type: 'feature', priority: 'high', createdAt: new Date().toISOString() }
  ];

  if (isDemoMode) {
    let filteredUpdates = [...demoUpdates];
    if (type) {
      filteredUpdates = filteredUpdates.filter(update => update.type === type);
    }
    if (priority) {
      filteredUpdates = filteredUpdates.filter(update => update.priority === priority);
    }
    
    const paginatedUpdates = filteredUpdates.slice(skip, skip + take);
    paginatedResponse(res, paginatedUpdates, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUpdates.length
    }, 'Updates retrieved successfully');
    return;
  }

  // Since there's no dedicated updates table, we'll use notifications with specific types
  const where = {
    type: { in: ['project_update', 'system_alert'] }
  };
  if (type === 'project') where.type = 'project_update';
  if (type === 'system') where.type = 'system_alert';

  const [updates, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        data: true,
        createdAt: true,
        user: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where })
  ]);

  paginatedResponse(res, updates, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Updates retrieved successfully');
}));

// GET /api/v1/updates/:id - Get update by ID
app.get('/api/v1/updates/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid update ID format', 400);
  }

  if (isDemoMode) {
    const update = { id, title: 'Demo Update', content: 'Demo update content', type: 'system', priority: 'medium' };
    return successResponse(res, update, 'Update retrieved successfully');
  }

  const update = await prisma.notification.findUnique({
    where: { id, type: { in: ['project_update', 'system_alert'] } },
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      data: true,
      createdAt: true,
      user: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  });

  if (!update) {
    return errorResponse(res, 'Update not found', 404);
  }

  successResponse(res, update, 'Update retrieved successfully');
}));

// POST /api/v1/updates - Create new update/announcement
app.post('/api/v1/updates', asyncHandler(async (req, res) => {
  const { title, content, type = 'system', priority = 'medium', targetUsers = [] } = req.body;

  if (!title || !content) {
    return errorResponse(res, 'Title and content are required', 400);
  }

  if (isDemoMode) {
    const newUpdate = {
      id: String(Date.now()),
      title,
      content,
      type,
      priority,
      createdAt: new Date().toISOString()
    };
    return successResponse(res, newUpdate, 'Update created successfully', 201);
  }

  try {
    // Create notifications for target users or all users if none specified
    const users = targetUsers.length > 0 
      ? await prisma.user.findMany({ where: { id: { in: targetUsers } } })
      : await prisma.user.findMany({ where: { status: 'active' } });

    const notifications = await Promise.all(
      users.map(user => 
        prisma.notification.create({
          data: {
            userId: user.id,
            type: type === 'project' ? 'project_update' : 'system_alert',
            title,
            message: content,
            data: { priority, updateType: type },
            readStatus: false
          }
        })
      )
    );

    successResponse(res, {
      title,
      content,
      type,
      priority,
      notificationsSent: notifications.length
    }, 'Update created and notifications sent successfully', 201);
  } catch (error) {
    throw error;
  }
}));

// PROCUREMENT ROUTES - Full CRUD Operations (using MaterialSpecification with procurement focus)
// GET /api/v1/procurement-items - List procurement items
app.get('/api/v1/procurement-items', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status = '', supplier = '', projectId = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Demo data for procurement
  const demoProcurement = [
    { id: '1', description: 'Oak Wood Panels', supplier: 'WoodCorp', status: 'ordered', quantity: 50, unitCost: 25.50, projectId: '1' },
    { id: '2', description: 'Steel Brackets', supplier: 'MetalWorks', status: 'pending', quantity: 100, unitCost: 5.75, projectId: '1' }
  ];

  if (isDemoMode) {
    let filteredItems = [...demoProcurement];
    if (status) {
      filteredItems = filteredItems.filter(item => item.status === status);
    }
    if (supplier) {
      filteredItems = filteredItems.filter(item => 
        item.supplier?.toLowerCase().includes(supplier.toLowerCase())
      );
    }
    if (projectId) {
      filteredItems = filteredItems.filter(item => item.projectId === projectId);
    }
    
    const paginatedItems = filteredItems.slice(skip, skip + take);
    paginatedResponse(res, paginatedItems, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredItems.length
    }, 'Procurement items retrieved successfully');
    return;
  }

  // Use MaterialSpecification for procurement with specific statuses
  const where = {
    status: { in: ['pending', 'pending_approval', 'approved', 'ordered', 'delivered'] }
  };
  if (status) where.status = status;
  if (supplier) {
    where.supplier = { contains: supplier, mode: 'insensitive' };
  }
  if (projectId) where.projectId = projectId;

  const [items, total] = await Promise.all([
    prisma.materialSpecification.findMany({
      where,
      select: {
        id: true,
        itemId: true,
        description: true,
        category: true,
        quantity: true,
        unit: true,
        unitCost: true,
        supplier: true,
        leadTime: true,
        status: true,
        notes: true,
        createdAt: true,
        project: {
          select: { id: true, name: true }
        },
        creator: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.materialSpecification.count({ where })
  ]);

  paginatedResponse(res, items, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Procurement items retrieved successfully');
}));

// GET /api/v1/procurement-items/:id - Get procurement item by ID
app.get('/api/v1/procurement-items/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid procurement item ID format', 400);
  }

  if (isDemoMode) {
    const item = { id, description: 'Demo Item', supplier: 'Demo Supplier', status: 'pending', quantity: 10, unitCost: 15.00 };
    return successResponse(res, item, 'Procurement item retrieved successfully');
  }

  const item = await prisma.materialSpecification.findUnique({
    where: { 
      id,
      status: { in: ['pending', 'pending_approval', 'approved', 'ordered', 'delivered'] }
    },
    select: {
      id: true,
      itemId: true,
      description: true,
      category: true,
      material: true,
      finish: true,
      quantity: true,
      unit: true,
      unitCost: true,
      supplier: true,
      leadTime: true,
      status: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      project: {
        select: { id: true, name: true }
      },
      scopeItem: {
        select: { id: true, name: true }
      },
      creator: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  });

  if (!item) {
    return errorResponse(res, 'Procurement item not found', 404);
  }

  successResponse(res, item, 'Procurement item retrieved successfully');
}));

// POST /api/v1/procurement-items - Create new procurement item
app.post('/api/v1/procurement-items', asyncHandler(async (req, res) => {
  const { 
    projectId, 
    description, 
    category, 
    quantity, 
    unit, 
    unitCost, 
    supplier, 
    leadTime, 
    notes,
    itemId
  } = req.body;

  if (!projectId || !description || !quantity || !unit || !unitCost) {
    return errorResponse(res, 'Project ID, description, quantity, unit, and unit cost are required', 400);
  }

  if (isDemoMode) {
    const newItem = {
      id: String(Date.now()),
      projectId,
      description,
      category,
      quantity: parseFloat(quantity),
      unit,
      unitCost: parseFloat(unitCost),
      supplier,
      leadTime,
      notes,
      itemId,
      status: 'pending'
    };
    return successResponse(res, newItem, 'Procurement item created successfully', 201);
  }

  try {
    const item = await prisma.materialSpecification.create({
      data: {
        projectId,
        itemId: itemId?.trim(),
        description: description.trim(),
        category: category?.trim() || 'Procurement',
        quantity: parseFloat(quantity),
        unit: unit.trim(),
        unitCost: parseFloat(unitCost),
        supplier: supplier?.trim(),
        leadTime: leadTime?.trim(),
        notes: notes?.trim(),
        createdBy: req.user.id,
        status: 'pending'
      },
      select: {
        id: true,
        itemId: true,
        description: true,
        category: true,
        quantity: true,
        unit: true,
        unitCost: true,
        supplier: true,
        leadTime: true,
        status: true,
        notes: true,
        createdAt: true,
        project: {
          select: { id: true, name: true }
        }
      }
    });

    successResponse(res, item, 'Procurement item created successfully', 201);
  } catch (error) {
    if (error.code === 'P2003') {
      return errorResponse(res, 'Invalid project ID', 400);
    }
    throw error;
  }
}));

// PUT /api/v1/procurement-items/:id - Update procurement item
app.put('/api/v1/procurement-items/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description, category, quantity, unit, unitCost, supplier, leadTime, status, notes } = req.body;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid procurement item ID format', 400);
  }

  if (isDemoMode) {
    const updates = { description, category, quantity, unit, unitCost, supplier, leadTime, status, notes };
    const item = { id, ...updates };
    return successResponse(res, item, 'Procurement item updated successfully');
  }

  const updates = {};
  if (description) updates.description = description.trim();
  if (category !== undefined) updates.category = category?.trim();
  if (quantity !== undefined) updates.quantity = parseFloat(quantity);
  if (unit) updates.unit = unit.trim();
  if (unitCost !== undefined) updates.unitCost = parseFloat(unitCost);
  if (supplier !== undefined) updates.supplier = supplier?.trim();
  if (leadTime !== undefined) updates.leadTime = leadTime?.trim();
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes?.trim();

  try {
    const item = await prisma.materialSpecification.update({
      where: { 
        id,
        status: { in: ['pending', 'pending_approval', 'approved', 'ordered', 'delivered'] }
      },
      data: updates,
      select: {
        id: true,
        itemId: true,
        description: true,
        category: true,
        quantity: true,
        unit: true,
        unitCost: true,
        supplier: true,
        leadTime: true,
        status: true,
        notes: true,
        updatedAt: true,
        project: {
          select: { id: true, name: true }
        }
      }
    });

    successResponse(res, item, 'Procurement item updated successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Procurement item not found', 404);
    }
    throw error;
  }
}));

// DELETE /api/v1/procurement-items/:id - Delete procurement item
app.delete('/api/v1/procurement-items/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid procurement item ID format', 400);
  }

  if (isDemoMode) {
    return successResponse(res, null, 'Procurement item deleted successfully');
  }

  try {
    await prisma.materialSpecification.delete({
      where: { 
        id,
        status: { in: ['pending', 'pending_approval', 'approved', 'ordered', 'delivered'] }
      }
    });

    successResponse(res, null, 'Procurement item deleted successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Procurement item not found', 404);
    }
    throw error;
  }
}));

// MATERIAL SPECIFICATION ROUTES - Full CRUD Operations
// GET /api/v1/material-specs - List material specifications
app.get('/api/v1/material-specs', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, projectId = '', status = '', category = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  if (isDemoMode) {
    let filteredSpecs = [...demoData.materialSpecs];
    if (projectId) {
      filteredSpecs = filteredSpecs.filter(spec => spec.projectId === projectId);
    }
    if (status) {
      filteredSpecs = filteredSpecs.filter(spec => spec.status === status);
    }
    if (category) {
      filteredSpecs = filteredSpecs.filter(spec => spec.category === category);
    }
    
    const paginatedSpecs = filteredSpecs.slice(skip, skip + take);
    paginatedResponse(res, paginatedSpecs, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredSpecs.length
    }, 'Material specifications retrieved successfully');
    return;
  }

  const where = {};
  if (projectId) where.projectId = projectId;
  if (status) where.status = status;
  if (category) where.category = category;

  const [specs, total] = await Promise.all([
    prisma.materialSpecification.findMany({
      where,
      select: {
        id: true,
        itemId: true,
        description: true,
        category: true,
        material: true,
        finish: true,
        quantity: true,
        unit: true,
        unitCost: true,
        supplier: true,
        leadTime: true,
        status: true,
        notes: true,
        createdAt: true,
        project: {
          select: { id: true, name: true }
        },
        scopeItem: {
          select: { id: true, name: true }
        },
        creator: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.materialSpecification.count({ where })
  ]);

  paginatedResponse(res, specs, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Material specifications retrieved successfully');
}));

// GET /api/v1/material-specs/:id - Get material specification by ID
app.get('/api/v1/material-specs/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid material specification ID format', 400);
  }

  if (isDemoMode) {
    const spec = demoData.materialSpecs.find(s => s.id === id);
    if (!spec) {
      return errorResponse(res, 'Material specification not found', 404);
    }
    return successResponse(res, spec, 'Material specification retrieved successfully');
  }

  const spec = await prisma.materialSpecification.findUnique({
    where: { id },
    select: {
      id: true,
      itemId: true,
      description: true,
      category: true,
      material: true,
      finish: true,
      quantity: true,
      unit: true,
      unitCost: true,
      supplier: true,
      leadTime: true,
      status: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      project: {
        select: { id: true, name: true }
      },
      scopeItem: {
        select: { id: true, name: true }
      },
      creator: {
        select: { id: true, firstName: true, lastName: true }
      }
    }
  });

  if (!spec) {
    return errorResponse(res, 'Material specification not found', 404);
  }

  successResponse(res, spec, 'Material specification retrieved successfully');
}));

// POST /api/v1/material-specs - Create new material specification
app.post('/api/v1/material-specs', asyncHandler(async (req, res) => {
  const { 
    projectId, 
    scopeItemId, 
    itemId, 
    description, 
    category, 
    material, 
    finish, 
    quantity, 
    unit, 
    unitCost, 
    supplier, 
    leadTime, 
    notes 
  } = req.body;

  if (!projectId || !description || !quantity || !unit || !unitCost) {
    return errorResponse(res, 'Project ID, description, quantity, unit, and unit cost are required', 400);
  }

  if (isDemoMode) {
    const newSpec = {
      id: String(demoData.materialSpecs.length + 1),
      projectId,
      scopeItemId,
      itemId,
      description,
      category,
      material,
      finish,
      quantity: parseFloat(quantity),
      unit,
      unitCost: parseFloat(unitCost),
      supplier,
      leadTime,
      notes,
      status: 'pending'
    };
    demoData.materialSpecs.push(newSpec);
    return successResponse(res, newSpec, 'Material specification created successfully', 201);
  }

  try {
    const spec = await prisma.materialSpecification.create({
      data: {
        projectId,
        scopeItemId,
        itemId: itemId?.trim(),
        description: description.trim(),
        category: category?.trim(),
        material: material?.trim(),
        finish: finish?.trim(),
        quantity: parseFloat(quantity),
        unit: unit.trim(),
        unitCost: parseFloat(unitCost),
        supplier: supplier?.trim(),
        leadTime: leadTime?.trim(),
        notes: notes?.trim(),
        createdBy: req.user.id,
        status: 'pending'
      },
      select: {
        id: true,
        itemId: true,
        description: true,
        category: true,
        material: true,
        finish: true,
        quantity: true,
        unit: true,
        unitCost: true,
        supplier: true,
        leadTime: true,
        status: true,
        notes: true,
        createdAt: true,
        project: {
          select: { id: true, name: true }
        },
        creator: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    successResponse(res, spec, 'Material specification created successfully', 201);
  } catch (error) {
    if (error.code === 'P2003') {
      return errorResponse(res, 'Invalid project ID or scope item ID', 400);
    }
    throw error;
  }
}));

// PUT /api/v1/material-specs/:id - Update material specification
app.put('/api/v1/material-specs/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    itemId, 
    description, 
    category, 
    material, 
    finish, 
    quantity, 
    unit, 
    unitCost, 
    supplier, 
    leadTime, 
    status, 
    notes 
  } = req.body;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid material specification ID format', 400);
  }

  if (isDemoMode) {
    const specIndex = demoData.materialSpecs.findIndex(s => s.id === id);
    if (specIndex === -1) {
      return errorResponse(res, 'Material specification not found', 404);
    }
    
    const updates = { itemId, description, category, material, finish, quantity, unit, unitCost, supplier, leadTime, status, notes };
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'quantity' || key === 'unitCost') {
          demoData.materialSpecs[specIndex][key] = parseFloat(updates[key]);
        } else {
          demoData.materialSpecs[specIndex][key] = updates[key];
        }
      }
    });
    
    return successResponse(res, demoData.materialSpecs[specIndex], 'Material specification updated successfully');
  }

  const updates = {};
  if (itemId !== undefined) updates.itemId = itemId?.trim();
  if (description) updates.description = description.trim();
  if (category !== undefined) updates.category = category?.trim();
  if (material !== undefined) updates.material = material?.trim();
  if (finish !== undefined) updates.finish = finish?.trim();
  if (quantity !== undefined) updates.quantity = parseFloat(quantity);
  if (unit) updates.unit = unit.trim();
  if (unitCost !== undefined) updates.unitCost = parseFloat(unitCost);
  if (supplier !== undefined) updates.supplier = supplier?.trim();
  if (leadTime !== undefined) updates.leadTime = leadTime?.trim();
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes?.trim();

  try {
    const spec = await prisma.materialSpecification.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        itemId: true,
        description: true,
        category: true,
        material: true,
        finish: true,
        quantity: true,
        unit: true,
        unitCost: true,
        supplier: true,
        leadTime: true,
        status: true,
        notes: true,
        updatedAt: true,
        project: {
          select: { id: true, name: true }
        }
      }
    });

    successResponse(res, spec, 'Material specification updated successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Material specification not found', 404);
    }
    throw error;
  }
}));

// DELETE /api/v1/material-specs/:id - Delete material specification
app.delete('/api/v1/material-specs/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateUUID(id)) {
    return errorResponse(res, 'Invalid material specification ID format', 400);
  }

  if (isDemoMode) {
    const specIndex = demoData.materialSpecs.findIndex(s => s.id === id);
    if (specIndex === -1) {
      return errorResponse(res, 'Material specification not found', 404);
    }
    demoData.materialSpecs.splice(specIndex, 1);
    return successResponse(res, null, 'Material specification deleted successfully');
  }

  try {
    await prisma.materialSpecification.delete({
      where: { id }
    });

    successResponse(res, null, 'Material specification deleted successfully');
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Material specification not found', 404);
    }
    throw error;
  }
}));

// Catch all other API routes
app.use('/api', (req, res) => {
  res.json({
    message: `${isDemoMode ? 'Demo mode' : 'Production'} endpoint`,
    path: req.path,
    method: req.method,
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Prisma errors
  if (err.code?.startsWith('P')) {
    const prismaErrors = {
      'P2002': { status: 409, message: 'Unique constraint violation' },
      'P2003': { status: 400, message: 'Foreign key constraint violation' },
      'P2025': { status: 404, message: 'Record not found' }
    };
    
    const errorInfo = prismaErrors[err.code] || { status: 500, message: 'Database error' };
    return errorResponse(res, errorInfo.message, errorInfo.status, err.meta);
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, err.message, 400);
  }
  
  // Generic error
  errorResponse(res, 'Internal server error', 500, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  errorResponse(res, `Route ${req.originalUrl} not found`, 404);
});

// Start server
console.log('🚀 Starting Enhanced Formula PM Backend Server...');

testDatabaseConnection().then(() => {
  server.listen(PORT, () => {
    console.log(`✅ Enhanced server running on port ${PORT}`);
    console.log(`🔌 Socket.IO enabled for real-time features`);
    console.log(`❤️ Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 API root: http://localhost:${PORT}/api`);
    console.log(`👤 User profile: http://localhost:${PORT}/api/v1/users/me`);
    console.log(`📊 Mode: ${isDemoMode ? 'DEMO (no database required)' : 'PRODUCTION (database connected)'}`);
    console.log(`🔧 Database: ${isDatabaseConnected ? 'Connected' : 'Disconnected'}`);
    
    // Show available endpoints
    console.log('\n📋 Available CRUD Endpoints:');
    console.log('   Users: GET/POST/PUT/DELETE /api/v1/users');
    console.log('   Projects: GET/POST/PUT/DELETE /api/v1/projects');
    console.log('   Tasks: GET/POST/PUT/DELETE /api/v1/tasks');
    console.log('   Clients: GET/POST/PUT/DELETE /api/v1/clients');
    console.log('   Team Members: GET/POST/DELETE /api/v1/team-members');
    console.log('   Activities: GET/POST /api/v1/activities');
    console.log('   Notifications: GET/POST/PUT/DELETE /api/v1/notifications');
    console.log('   Updates: GET/POST /api/v1/updates');
    console.log('   Shop Drawings: GET/POST/PUT/DELETE /api/v1/shop-drawings');
    console.log('   Material Specs: GET/POST/PUT/DELETE /api/v1/material-specs');
    console.log('   Procurement Items: GET/POST/PUT/DELETE /api/v1/procurement-items');
  });
}).catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server gracefully...');
  
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = server;