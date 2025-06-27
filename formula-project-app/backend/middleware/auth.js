/**
 * Authentication and Authorization Middleware
 * Handles JWT token validation and role-based access control
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Role hierarchy for permission checking
 */
const roleHierarchy = {
  admin: 5,
  project_manager: 4,
  designer: 3,
  coordinator: 2,
  craftsman: 1,
  client: 0
};

/**
 * Permission definitions for each role
 */
const permissions = {
  admin: [
    'view_all', 'edit_all', 'delete_all', 'manage_users', 
    'manage_projects', 'manage_system', 'view_audit_logs'
  ],
  project_manager: [
    'view_assigned', 'edit_assigned', 'manage_scope', 
    'approve_drawings', 'manage_materials', 'view_reports'
  ],
  designer: [
    'view_assigned', 'edit_drawings', 'create_drawings', 
    'view_materials', 'comment_on_projects'
  ],
  coordinator: [
    'view_assigned', 'update_tasks', 'manage_workflow', 
    'view_materials', 'comment_on_projects'
  ],
  craftsman: [
    'view_assigned', 'update_task_progress', 'view_drawings', 
    'comment_on_tasks'
  ],
  client: [
    'view_own_projects', 'comment_on_own_projects', 'view_reports'
  ]
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'formula-pm-api',
    audience: 'formula-pm-app'
  });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    userId: user.id,
    tokenType: 'refresh'
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: 'formula-pm-api',
    audience: 'formula-pm-app'
  });
};

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Verify JWT token middleware
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'MISSING_TOKEN',
        timestamp: new Date().toISOString()
      });
    }

    const token = authHeader.substring(7);
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'formula-pm-api',
      audience: 'formula-pm-app'
    });

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString()
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        error: 'Account is not active',
        code: 'ACCOUNT_INACTIVE',
        timestamp: new Date().toISOString()
      });
    }

    // Add user info to request
    req.user = user;
    req.token = token;

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
        timestamp: new Date().toISOString()
      });
    }

    console.error('Token verification error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_ERROR',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Check if user has required role
 */
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
        timestamp: new Date().toISOString()
      });
    }

    const userRoleLevel = roleHierarchy[req.user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: requiredRole,
        current: req.user.role,
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

/**
 * Check if user has specific permission
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
        timestamp: new Date().toISOString()
      });
    }

    const userPermissions = permissions[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: 'Permission denied',
        code: 'PERMISSION_DENIED',
        required: permission,
        userRole: req.user.role,
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

/**
 * Check if user can access specific project
 */
const requireProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!projectId) {
      return res.status(400).json({
        error: 'Project ID required',
        code: 'PROJECT_ID_REQUIRED',
        timestamp: new Date().toISOString()
      });
    }

    // Admin and project managers can access all projects
    if (userRole === 'admin') {
      return next();
    }

    // Check if user is the project manager
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        teamMembers: {
          select: { userId: true, role: true }
        },
        client: {
          select: { id: true }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND',
        timestamp: new Date().toISOString()
      });
    }

    // Check if user is project manager
    if (project.projectManagerId === userId) {
      return next();
    }

    // Check if user is a team member
    const isTeamMember = project.teamMembers.some(member => member.userId === userId);
    if (isTeamMember) {
      return next();
    }

    // For clients, check if they own the project
    if (userRole === 'client') {
      const clientUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true }
      });
      
      // Note: This assumes a direct relationship. You might need to adjust
      // based on your actual client-user relationship model
      if (project.clientId === userId) {
        return next();
      }
    }

    return res.status(403).json({
      error: 'Project access denied',
      code: 'PROJECT_ACCESS_DENIED',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Project access check error:', error);
    return res.status(500).json({
      error: 'Access check failed',
      code: 'ACCESS_CHECK_ERROR',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token provided, continue without authentication
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true
      }
    });

    if (user && user.status === 'active') {
      req.user = user;
      req.token = token;
    }

    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    next();
  }
};

/**
 * Rate limiting for authentication endpoints
 */
const authRateLimit = (req, res, next) => {
  // This will be enhanced with Redis-based rate limiting
  // For now, basic implementation
  next();
};

module.exports = {
  generateToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  verifyToken,
  requireRole,
  requirePermission,
  requireProjectAccess,
  optionalAuth,
  authRateLimit,
  permissions,
  roleHierarchy
};