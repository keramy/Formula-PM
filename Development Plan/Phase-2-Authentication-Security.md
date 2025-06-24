# Formula PM - Phase 2: Authentication & Security Systems

**Duration**: 6-8 weeks  
**Priority**: High  
**Objective**: Implement enterprise-grade authentication, authorization, and security infrastructure

---

## 📋 **PHASE 2 OVERVIEW**

This phase builds upon the PostgreSQL foundation from Phase 1 to implement a complete authentication and security system. We'll transform the current demo authentication into a production-ready system with JWT tokens, role-based access control, and enterprise security features.

### **Success Criteria**
- ✅ JWT-based authentication system operational
- ✅ Role-based access control (RBAC) implemented
- ✅ Password security with bcrypt hashing
- ✅ Input validation and sanitization
- ✅ Security middleware and rate limiting
- ✅ Audit logging system functional
- ✅ All existing Formula PM features secured

---

## 🗓️ **MONTH 1: AUTHENTICATION FOUNDATION**

### **Week 1-2: JWT Authentication System**

#### **Authentication Service Implementation**
```javascript
// src/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');
const logger = require('../utils/logger');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
  }

  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ 
        where: { email: userData.email } 
      });
      
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = await User.create({
        ...userData,
        password_hash: passwordHash,
        email_verified_at: new Date(), // Auto-verify for internal team
      });

      // Generate tokens
      const tokens = this.generateTokens(user);
      
      // Log registration
      logger.info('User registered successfully', { 
        userId: user.id, 
        email: user.email 
      });

      return {
        user: this.sanitizeUser(user),
        ...tokens
      };
    } catch (error) {
      logger.error('User registration failed', { 
        email: userData.email, 
        error: error.message 
      });
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Find user with company information
      const user = await User.findOne({
        where: { email, is_active: true },
        include: [{
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await user.update({ last_login_at: new Date() });

      // Generate tokens
      const tokens = this.generateTokens(user);
      
      // Log successful login
      logger.info('User logged in successfully', { 
        userId: user.id, 
        email: user.email 
      });

      return {
        user: this.sanitizeUser(user),
        ...tokens
      };
    } catch (error) {
      logger.error('Login failed', { email, error: error.message });
      throw error;
    }
  }

  generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.company_id
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'formula-pm',
      subject: user.id
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      this.jwtRefreshSecret,
      {
        expiresIn: this.jwtRefreshExpiresIn,
        issuer: 'formula-pm',
        subject: user.id
      }
    );

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret);
      const user = await User.findByPk(decoded.userId, {
        include: [{ model: Company, as: 'company' }]
      });

      if (!user || !user.is_active) {
        throw new Error('Invalid refresh token');
      }

      const tokens = this.generateTokens(user);
      return {
        user: this.sanitizeUser(user),
        ...tokens
      };
    } catch (error) {
      logger.error('Token refresh failed', { error: error.message });
      throw new Error('Invalid refresh token');
    }
  }

  sanitizeUser(user) {
    const userObj = user.toJSON ? user.toJSON() : user;
    delete userObj.password_hash;
    return userObj;
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword, 
        user.password_hash
      );
      
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await user.update({ password_hash: newPasswordHash });

      logger.info('Password changed successfully', { userId });
      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Password change failed', { userId, error: error.message });
      throw error;
    }
  }
}

module.exports = AuthService;
```

#### **Authentication Middleware**
```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');
const logger = require('../utils/logger');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'MISSING_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user with current data
    const user = await User.findByPk(decoded.userId, {
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ 
        error: 'User not found or inactive',
        code: 'INVALID_USER'
      });
    }

    // Add user to request object
    req.user = user;
    req.token = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    logger.error('Authentication middleware error', { error: error.message });
    return res.status(500).json({ 
      error: 'Authentication service error' 
    });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    const userRole = req.user.role;
    const hasPermission = allowedRoles.includes(userRole) || 
                         userRole === 'admin'; // Admin always has access

    if (!hasPermission) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        userRole,
        requiredRoles: allowedRoles
      });
      
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

// Project-specific authorization
const requireProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const user = req.user;

    // Admin and co-founders have access to all projects
    if (['admin', 'co_founder'].includes(user.role)) {
      return next();
    }

    // Project managers only see assigned projects
    if (user.role === 'project_manager') {
      const { Project } = require('../models');
      const project = await Project.findOne({
        where: { 
          id: projectId,
          project_manager_id: user.id 
        }
      });

      if (!project) {
        return res.status(403).json({ 
          error: 'Access denied to this project' 
        });
      }
    }

    next();
  } catch (error) {
    logger.error('Project access check failed', { 
      projectId: req.params.projectId,
      userId: req.user.id,
      error: error.message 
    });
    
    return res.status(500).json({ 
      error: 'Project access verification failed' 
    });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireProjectAccess
};
```

### **Week 3-4: Security Middleware & Validation**

#### **Security Middleware**
```javascript
// src/middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
const logger = require('../utils/logger');

// Rate limiting configuration
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP',
      retryAfter: Math.ceil(options.windowMs / 1000) || 900
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path
      });
      
      res.status(429).json({
        error: 'Too many requests from this IP',
        retryAfter: Math.ceil((options.windowMs || 900000) / 1000)
      });
    }
  });
};

// Specific rate limiters
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 API requests per 15 minutes
});

const uploadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
});

// XSS Protection
const xssProtection = (req, res, next) => {
  try {
    // Clean request body
    if (req.body && typeof req.body === 'object') {
      req.body = cleanObject(req.body);
    }

    // Clean query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = cleanObject(req.query);
    }

    next();
  } catch (error) {
    logger.error('XSS protection error', { error: error.message });
    return res.status(400).json({ 
      error: 'Invalid request data' 
    });
  }
};

const cleanObject = (obj) => {
  const cleaned = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      cleaned[key] = xss(value);
    } else if (Array.isArray(value)) {
      cleaned[key] = value.map(item => 
        typeof item === 'string' ? xss(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
};

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3003',
      'http://localhost:3000',
      'https://keramy.github.io'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request from unauthorized origin', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = {
  authLimiter,
  apiLimiter,
  uploadLimiter,
  xssProtection,
  securityHeaders,
  corsOptions,
  createRateLimiter
};
```

#### **Input Validation System**
```javascript
// src/validators/authValidators.js
const joi = require('joi');

const registerValidation = joi.object({
  email: joi.string()
    .email()
    .required()
    .max(255)
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.max': 'Email must not exceed 255 characters'
    }),
    
  password: joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
    
  firstName: joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name cannot be empty',
      'string.max': 'First name must not exceed 50 characters',
      'any.required': 'First name is required'
    }),
    
  lastName: joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name cannot be empty',
      'string.max': 'Last name must not exceed 50 characters',
      'any.required': 'Last name is required'
    }),
    
  role: joi.string()
    .valid('admin', 'co_founder', 'project_manager', 'user')
    .default('user'),
    
  phone: joi.string()
    .pattern(new RegExp('^[\+]?[1-9][\d]{0,15}$'))
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
    
  companyId: joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Invalid company ID format',
      'any.required': 'Company ID is required'
    })
});

const loginValidation = joi.object({
  email: joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    
  password: joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

const changePasswordValidation = joi.object({
  currentPassword: joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
    
  newPassword: joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.max': 'New password must not exceed 128 characters',
      'string.pattern.base': 'New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'any.required': 'New password is required'
    }),
    
  confirmPassword: joi.string()
    .valid(joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Password confirmation does not match new password',
      'any.required': 'Password confirmation is required'
    })
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  validate
};
```

---

## 🗓️ **MONTH 2: ADVANCED SECURITY & AUDIT**

### **Week 5-6: Audit Logging System**

#### **Audit Service Implementation**
```javascript
// src/services/auditService.js
const { AuditLog } = require('../models');
const logger = require('../utils/logger');

class AuditService {
  static ACTIONS = {
    // Authentication
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    PASSWORD_CHANGE: 'PASSWORD_CHANGE',
    
    // Data Operations
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    
    // Project Operations
    PROJECT_ACCESS: 'PROJECT_ACCESS',
    PROJECT_ASSIGN: 'PROJECT_ASSIGN',
    
    // Security Events
    FAILED_LOGIN: 'FAILED_LOGIN',
    TOKEN_REFRESH: 'TOKEN_REFRESH',
    PERMISSION_DENIED: 'PERMISSION_DENIED'
  };

  static async logAction(actionData) {
    try {
      const auditEntry = await AuditLog.create({
        user_id: actionData.userId,
        action: actionData.action,
        resource_type: actionData.resourceType,
        resource_id: actionData.resourceId,
        details: actionData.details || {},
        ip_address: actionData.ipAddress,
        user_agent: actionData.userAgent,
        timestamp: new Date()
      });

      logger.info('Audit log created', {
        auditId: auditEntry.id,
        action: actionData.action,
        userId: actionData.userId
      });

      return auditEntry;
    } catch (error) {
      logger.error('Failed to create audit log', {
        error: error.message,
        actionData
      });
      // Don't throw error to avoid breaking main functionality
    }
  }

  static async getUserAuditTrail(userId, options = {}) {
    try {
      const {
        limit = 100,
        offset = 0,
        startDate,
        endDate,
        actions
      } = options;

      const whereClause = { user_id: userId };
      
      if (startDate && endDate) {
        whereClause.timestamp = {
          [Op.between]: [startDate, endDate]
        };
      }
      
      if (actions && actions.length > 0) {
        whereClause.action = {
          [Op.in]: actions
        };
      }

      const auditLogs = await AuditLog.findAndCountAll({
        where: whereClause,
        order: [['timestamp', 'DESC']],
        limit,
        offset
      });

      return auditLogs;
    } catch (error) {
      logger.error('Failed to retrieve audit trail', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  static async getResourceAuditTrail(resourceType, resourceId, options = {}) {
    try {
      const {
        limit = 100,
        offset = 0,
        startDate,
        endDate
      } = options;

      const whereClause = {
        resource_type: resourceType,
        resource_id: resourceId
      };
      
      if (startDate && endDate) {
        whereClause.timestamp = {
          [Op.between]: [startDate, endDate]
        };
      }

      const auditLogs = await AuditLog.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'first_name', 'last_name']
        }],
        order: [['timestamp', 'DESC']],
        limit,
        offset
      });

      return auditLogs;
    } catch (error) {
      logger.error('Failed to retrieve resource audit trail', {
        resourceType,
        resourceId,
        error: error.message
      });
      throw error;
    }
  }

  static async getSecurityEvents(options = {}) {
    try {
      const {
        limit = 100,
        offset = 0,
        startDate,
        endDate
      } = options;

      const securityActions = [
        this.ACTIONS.FAILED_LOGIN,
        this.ACTIONS.PERMISSION_DENIED,
        this.ACTIONS.LOGIN,
        this.ACTIONS.LOGOUT
      ];

      const whereClause = {
        action: {
          [Op.in]: securityActions
        }
      };
      
      if (startDate && endDate) {
        whereClause.timestamp = {
          [Op.between]: [startDate, endDate]
        };
      }

      const auditLogs = await AuditLog.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'first_name', 'last_name'],
          required: false
        }],
        order: [['timestamp', 'DESC']],
        limit,
        offset
      });

      return auditLogs;
    } catch (error) {
      logger.error('Failed to retrieve security events', {
        error: error.message
      });
      throw error;
    }
  }
}

// Audit middleware
const auditMiddleware = (action, resourceType = null) => {
  return (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json;
    
    res.json = function(body) {
      // Log audit after successful response
      if (res.statusCode < 400) {
        AuditService.logAction({
          userId: req.user?.id,
          action,
          resourceType,
          resourceId: req.params.id || req.params.projectId,
          details: {
            method: req.method,
            url: req.originalUrl,
            body: req.method !== 'GET' ? req.body : undefined
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
      }
      
      // Call original json method
      return originalJson.call(this, body);
    };
    
    next();
  };
};

module.exports = { AuditService, auditMiddleware };
```

### **Week 7-8: Security Hardening & Testing**

#### **Security Configuration**
```javascript
// src/config/security.js
const crypto = require('crypto');

class SecurityConfig {
  static generateSecureKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  static hashPassword(password, salt = null) {
    if (!salt) {
      salt = crypto.generateSalt(16);
    }
    
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
    return {
      hash: hash.toString('hex'),
      salt: salt.toString('hex')
    };
  }

  static verifyPassword(password, hash, salt) {
    const hashToVerify = crypto.pbkdf2Sync(
      password, 
      Buffer.from(salt, 'hex'), 
      10000, 
      64, 
      'sha512'
    );
    
    return hashToVerify.toString('hex') === hash;
  }

  static encryptSensitiveData(data, key = null) {
    if (!key) {
      key = process.env.ENCRYPTION_KEY;
    }
    
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  static decryptSensitiveData(encryptedData, key = null) {
    if (!key) {
      key = process.env.ENCRYPTION_KEY;
    }
    
    const algorithm = 'aes-256-gcm';
    const decipher = crypto.createDecipher(
      algorithm, 
      key, 
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  static validateFileUpload(file) {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const errors = [];
    
    if (!allowedTypes.includes(file.mimetype)) {
      errors.push('File type not allowed');
    }
    
    if (file.size > maxSize) {
      errors.push('File size exceeds maximum limit (10MB)');
    }
    
    // Check for executable extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif'];
    const fileExtension = file.originalname.toLowerCase().slice(-4);
    
    if (dangerousExtensions.some(ext => fileExtension.endsWith(ext))) {
      errors.push('Executable files are not allowed');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = SecurityConfig;
```

---

## 🧪 **TESTING & VALIDATION**

### **Authentication Testing Suite**
```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');
const { User, Company } = require('../../src/models');
const bcrypt = require('bcrypt');

describe('Authentication Integration Tests', () => {
  let testCompany;
  let testUser;
  
  beforeAll(async () => {
    // Create test company
    testCompany = await Company.create({
      name: 'Test Company',
      email: 'test@company.com'
    });
    
    // Create test user
    const passwordHash = await bcrypt.hash('TestPass123!', 12);
    testUser = await User.create({
      company_id: testCompany.id,
      email: 'test@example.com',
      password_hash: passwordHash,
      first_name: 'Test',
      last_name: 'User',
      role: 'user',
      is_active: true
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should validate input format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'short'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;
    
    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123!'
        });
      
      refreshToken = loginResponse.body.refreshToken;
    });

    test('should refresh token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    test('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authentication Middleware', () => {
    let accessToken;
    
    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123!'
        });
      
      accessToken = loginResponse.body.accessToken;
    });

    test('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });

    test('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/user/profile');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('MISSING_TOKEN');
    });

    test('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_TOKEN');
    });
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
    await Company.destroy({ where: {} });
  });
});
```

---

## 🎯 **PHASE 2 COMPLETION CRITERIA**

### **Security Features Implemented**
- ✅ JWT-based authentication with access/refresh tokens
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Role-based access control (admin, co_founder, project_manager, user)
- ✅ Input validation and sanitization
- ✅ Rate limiting (auth, API, uploads)
- ✅ XSS protection
- ✅ Security headers (helmet)
- ✅ CORS configuration
- ✅ Audit logging system
- ✅ File upload security

### **Integration Requirements**
- ✅ All existing Formula PM features secured
- ✅ Frontend authentication flow updated
- ✅ Project-specific access control
- ✅ Real-time authentication for Socket.IO
- ✅ API endpoint security implemented

### **Testing & Documentation**
- ✅ Authentication test suite (>80% coverage)
- ✅ Security integration tests
- ✅ API security documentation
- ✅ Security configuration guide

---

## 🚀 **NEXT STEPS: PHASE 3 PREPARATION**

With Phase 2 complete, Formula PM will have:
- Enterprise-grade authentication system
- Comprehensive security infrastructure
- Role-based access control
- Complete audit trail capabilities

**Phase 3 will focus on:**
- Complete data migration from JSON to PostgreSQL
- Data integrity validation
- Performance optimization
- Migration rollback procedures

The security foundation established in Phase 2 ensures all data migration activities in Phase 3 will be conducted with full audit trails and secure access controls.