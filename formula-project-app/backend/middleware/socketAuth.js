/**
 * Socket.IO Authentication Middleware
 * Validates JWT tokens for WebSocket connections
 */

const jwt = require('jsonwebtoken');
const securityConfig = require('../config/security');

/**
 * Create Socket.IO authentication middleware with Prisma instance
 * @param {PrismaClient} prisma - Shared Prisma instance
 * @returns {Function} Socket middleware function
 */
const createSocketAuth = (prisma) => {
  return async (socket, next) => {
    try {
      // Extract token from auth header or query parameter
      const token = socket.handshake.auth?.token || 
                    socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
                    socket.handshake.query?.token;

      if (!token) {
        console.log('🔐 Socket connection denied: No token provided');
        return next(new Error('Authentication token required'));
      }

      // Verify JWT token using secure config
      const decoded = securityConfig.verifyToken(token);
      
      if (!decoded.userId) {
        console.log('🔐 Socket connection denied: Invalid token payload');
        return next(new Error('Invalid token payload'));
      }

      // Fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          department: true,
          status: true,
          avatar: true
        }
      });

      if (!user) {
        console.log('🔐 Socket connection denied: User not found');
        return next(new Error('User not found'));
      }

      if (user.status !== 'active') {
        console.log('🔐 Socket connection denied: User inactive');
        return next(new Error('User account is inactive'));
      }

      // Attach user data to socket
      socket.userId = user.id;
      socket.user = user;
      socket.userRole = user.role;
      socket.department = user.department;

      // Log successful authentication
      console.log(`✅ Socket authenticated: ${user.firstName} ${user.lastName} (${user.email})`);
      
      next();
    } catch (error) {
      console.error('❌ Socket authentication error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return next(new Error('Invalid authentication token'));
      } else if (error.name === 'TokenExpiredError') {
        return next(new Error('Authentication token expired'));
      } else {
        return next(new Error('Authentication failed'));
      }
    }
  };
};

/**
 * Authorization middleware for specific socket events
 * Checks if user has permission for specific actions
 */
const socketAuthorize = (requiredRole = null, requiredPermissions = []) => {
  return (socket, next) => {
    try {
      // Check role requirements
      if (requiredRole) {
        const roleHierarchy = {
          'admin': 5,
          'project_manager': 4,
          'coordinator': 3,
          'designer': 2,
          'craftsman': 2,
          'client': 1
        };

        const userRoleLevel = roleHierarchy[socket.userRole] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

        if (userRoleLevel < requiredRoleLevel) {
          console.log(`🔐 Socket authorization denied: Insufficient role (${socket.userRole} < ${requiredRole})`);
          return next(new Error('Insufficient permissions'));
        }
      }

      // Check specific permissions (if implemented)
      if (requiredPermissions.length > 0) {
        // TODO: Implement granular permissions check
        console.log(`🔍 Permission check needed for: ${requiredPermissions.join(', ')}`);
      }

      next();
    } catch (error) {
      console.error('❌ Socket authorization error:', error);
      return next(new Error('Authorization failed'));
    }
  };
};

/**
 * Rate limiting middleware for socket events
 * Prevents abuse of real-time features
 */
const socketRateLimit = (maxEvents = 100, windowMs = 60000) => {
  const clients = new Map();

  return (socket, next) => {
    const clientId = socket.userId || socket.id;
    const now = Date.now();

    if (!clients.has(clientId)) {
      clients.set(clientId, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    const client = clients.get(clientId);

    if (now > client.resetTime) {
      // Reset the counter
      client.count = 1;
      client.resetTime = now + windowMs;
      return next();
    }

    if (client.count >= maxEvents) {
      console.log(`🚫 Rate limit exceeded for user ${clientId}`);
      return next(new Error('Rate limit exceeded'));
    }

    client.count++;
    next();
  };
};

/**
 * Create project access validation middleware
 * @param {PrismaClient} prisma - Shared Prisma instance
 */
const createValidateProjectAccess = (prisma) => {
  return async (socket, projectId) => {
    try {
      // Check if user has access to project
      const projectAccess = await prisma.projectMember.findFirst({
        where: {
          projectId: projectId,
          userId: socket.userId
        }
      });

    // Allow access if user is project member, project manager, or admin
    if (projectAccess || 
        socket.userRole === 'admin' || 
        socket.userRole === 'project_manager') {
      return true;
    }

    // Check if user is project owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { projectManagerId: true }
    });

    if (project && project.projectManagerId === socket.userId) {
      return true;
    }

    return false;
    } catch (error) {
      console.error('❌ Project access validation error:', error);
      return false;
    }
  };
};

/**
 * Create task access validation middleware
 * @param {PrismaClient} prisma - Shared Prisma instance
 * @param {Function} validateProjectAccess - Project access function
 */
const createValidateTaskAccess = (prisma, validateProjectAccess) => {
  return async (socket, taskId) => {
    try {
      const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            id: true,
            projectManagerId: true
          }
        }
      }
    });

    if (!task) {
      return false;
    }

    // Check project access first
    const hasProjectAccess = await validateProjectAccess(socket, task.project.id);
    if (hasProjectAccess) {
      return true;
    }

    // Check if user is assigned to the task
    if (task.assignedTo === socket.userId) {
      return true;
    }

    return false;
    } catch (error) {
      console.error('❌ Task access validation error:', error);
      return false;
    }
  };
};

module.exports = {
  createSocketAuth,
  socketAuthorize,
  socketRateLimit,
  createValidateProjectAccess,
  createValidateTaskAccess,
  // Backward compatibility - deprecated
  socketAuth: createSocketAuth,
  validateProjectAccess: createValidateProjectAccess,
  validateTaskAccess: createValidateTaskAccess
};