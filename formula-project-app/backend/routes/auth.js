/**
 * Authentication Routes
 * Handles user authentication, registration, token refresh, and user profile
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

const { 
  generateToken, 
  generateRefreshToken, 
  hashPassword, 
  comparePassword, 
  verifyToken 
} = require('../middleware/auth');

const { 
  validateLogin, 
  validateRegister, 
  validateRefreshToken 
} = require('../middleware/validation');

const { 
  asyncHandler, 
  successResponse, 
  errorResponse,
  AuthenticationError,
  ConflictError,
  ValidationError,
  NotFoundError,
  dbOperation
} = require('../middleware/errorHandler');

const router = express.Router();
const prisma = new PrismaClient();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    error: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registrations per hour per IP
  message: {
    error: 'Too many registration attempts, please try again later',
    code: 'REGISTER_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT tokens
 */
router.post('/login', authLimiter, validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = await dbOperation(async () => {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true,
        position: true,
        department: true,
        avatarUrl: true,
        lastLoginAt: true
      }
    });
  });
  
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  // Check if account is active
  if (user.status !== 'active') {
    throw new AuthenticationError('Account is not active');
  }
  
  // Verify password
  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  // Generate tokens
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Store refresh token in database
  await dbOperation(async () => {
    return await prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash: require('crypto').createHash('sha256').update(refreshToken).digest('hex'),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        lastUsedAt: new Date()
      }
    });
  });
  
  // Update last login time
  await dbOperation(async () => {
    return await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
  });
  
  // Log successful login
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: user.id,
        action: 'login',
        details: {
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log login:', auditError);
    }
  }
  
  // Remove sensitive data
  const { passwordHash, ...userResponse } = user;
  
  successResponse(res, {
    user: userResponse,
    tokens: {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  }, 'Login successful');
}));

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', registerLimiter, validateRegister, asyncHandler(async (req, res) => {
  const { 
    email, 
    password, 
    firstName, 
    lastName, 
    role = 'craftsman',
    position,
    department,
    phone,
    skills = [],
    certifications = []
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
  
  // Hash password
  const passwordHash = await hashPassword(password);
  
  // Create user
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
        status: 'active',
        emailVerified: false // In production, would require email verification
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        position: true,
        department: true,
        phone: true,
        skills: true,
        certifications: true,
        createdAt: true
      }
    });
  });
  
  // Generate tokens
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Store refresh token
  await dbOperation(async () => {
    return await prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash: require('crypto').createHash('sha256').update(refreshToken).digest('hex'),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lastUsedAt: new Date()
      }
    });
  });
  
  // Log successful registration
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: user.id,
        action: 'register',
        details: {
          role: user.role,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log registration:', auditError);
    }
  }
  
  successResponse(res, {
    user,
    tokens: {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  }, 'Registration successful', 201);
}));

/**
 * POST /api/v1/auth/refresh
 * Refresh JWT token using refresh token
 */
router.post('/refresh', validateRefreshToken, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    // Verify refresh token
    const decoded = require('jsonwebtoken').verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET,
      {
        issuer: 'formula-pm-api',
        audience: 'formula-pm-app'
      }
    );
    
    // Check if token exists in database
    const tokenHash = require('crypto').createHash('sha256').update(refreshToken).digest('hex');
    const session = await dbOperation(async () => {
      return await prisma.userSession.findUnique({
        where: { tokenHash },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              status: true
            }
          }
        }
      });
    });
    
    if (!session || session.expiresAt < new Date()) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
    
    if (session.user.status !== 'active') {
      throw new AuthenticationError('Account is not active');
    }
    
    // Generate new access token
    const accessToken = generateToken(session.user);
    
    // Update session last used time
    await dbOperation(async () => {
      return await prisma.userSession.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() }
      });
    });
    
    successResponse(res, {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }, 'Token refreshed successfully');
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
    throw error;
  }
}));

/**
 * POST /api/v1/auth/logout
 * Logout user and invalidate refresh token
 */
router.post('/logout', verifyToken, asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    // Find and delete the session
    try {
      // For simplicity, we'll delete all sessions for this user
      // In production, you might want to track specific tokens
      await dbOperation(async () => {
        return await prisma.userSession.deleteMany({
          where: { userId: req.user.id }
        });
      });
      
      // Log logout
      if (req.app.locals.auditService) {
        try {
          await req.app.locals.auditService.logUserAction({
            userId: req.user.id,
            action: 'logout',
            details: {
              ip: req.ip,
              userAgent: req.get('User-Agent')
            }
          });
        } catch (auditError) {
          console.error('Failed to log logout:', auditError);
        }
      }
    } catch (error) {
      // Continue with logout even if session deletion fails
      console.error('Failed to delete session:', error);
    }
  }
  
  successResponse(res, null, 'Logout successful');
}));

/**
 * GET /api/v1/auth/me
 * Get current user profile
 */
router.get('/me', verifyToken, asyncHandler(async (req, res) => {
  // Get full user profile
  const user = await dbOperation(async () => {
    return await prisma.user.findUnique({
      where: { id: req.user.id },
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
        // Include related counts
        _count: {
          assignedTasks: true,
          createdTasks: true,
          managedProjects: true,
          createdProjects: true
        }
      }
    });
  });
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  successResponse(res, user, 'User profile retrieved successfully');
}));

/**
 * PUT /api/v1/auth/me
 * Update current user profile
 */
router.put('/me', verifyToken, asyncHandler(async (req, res) => {
  const allowedUpdates = [
    'firstName', 'lastName', 'position', 'department', 
    'phone', 'avatarUrl', 'skills', 'certifications'
  ];
  
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
      updates[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
    }
  });
  
  if (Object.keys(updates).length === 0) {
    throw new ValidationError('No valid updates provided');
  }
  
  // Update user
  const user = await dbOperation(async () => {
    return await prisma.user.update({
      where: { id: req.user.id },
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
        updatedAt: true
      }
    });
  });
  
  // Log profile update
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: req.user.id,
        action: 'profile_update',
        details: {
          updatedFields: Object.keys(updates),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log profile update:', auditError);
    }
  }
  
  successResponse(res, user, 'Profile updated successfully');
}));

/**
 * POST /api/v1/auth/change-password
 * Change user password
 */
router.post('/change-password', verifyToken, authLimiter, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new ValidationError('Current password and new password are required');
  }
  
  if (newPassword.length < 8) {
    throw new ValidationError('New password must be at least 8 characters long');
  }
  
  // Get current user with password hash
  const user = await dbOperation(async () => {
    return await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, passwordHash: true }
    });
  });
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  // Verify current password
  const isValidPassword = await comparePassword(currentPassword, user.passwordHash);
  if (!isValidPassword) {
    throw new AuthenticationError('Current password is incorrect');
  }
  
  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);
  
  // Update password
  await dbOperation(async () => {
    return await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: newPasswordHash }
    });
  });
  
  // Invalidate all sessions (force re-login)
  await dbOperation(async () => {
    return await prisma.userSession.deleteMany({
      where: { userId: req.user.id }
    });
  });
  
  // Log password change
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: req.user.id,
        action: 'password_change',
        details: {
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log password change:', auditError);
    }
  }
  
  successResponse(res, null, 'Password changed successfully. Please login again.');
}));

module.exports = router;