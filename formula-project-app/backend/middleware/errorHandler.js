/**
 * Error Handling Middleware and Utilities
 * Comprehensive error handling for the Formula PM API
 */

const { PrismaClientKnownRequestError, PrismaClientValidationError } = require('@prisma/client/runtime/library');

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.name = 'APIError';
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Predefined error types
 */
class ValidationError extends APIError {
  constructor(message, details = null) {
    super(message, 422, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends APIError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends APIError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

class ConflictError extends APIError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

class RateLimitError extends APIError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

class DatabaseError extends APIError {
  constructor(message = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

/**
 * Handle Prisma errors
 */
const handlePrismaError = (error) => {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint failed
        const target = error.meta?.target || ['field'];
        return new ConflictError(`${target.join(', ')} already exists`);
      
      case 'P2025':
        // Record not found
        return new NotFoundError('Record');
      
      case 'P2003':
        // Foreign key constraint failed
        return new ValidationError('Invalid reference to related record');
      
      case 'P2004':
        // Constraint failed
        return new ValidationError('Data constraint violation');
      
      case 'P2014':
        // Invalid ID
        return new ValidationError('Invalid ID provided');
      
      case 'P2021':
        // Table doesn't exist
        return new DatabaseError('Database table not found');
      
      case 'P2022':
        // Column doesn't exist
        return new DatabaseError('Database column not found');
      
      default:
        return new DatabaseError(`Database operation failed: ${error.message}`);
    }
  }
  
  if (error instanceof PrismaClientValidationError) {
    return new ValidationError('Invalid data provided');
  }
  
  return null;
};

/**
 * Async error handler wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.method} ${req.path}`);
  next(error);
};

/**
 * Main error handler middleware
 */
const errorHandler = async (err, req, res, next) => {
  let error = err;
  
  // Handle Prisma errors
  const prismaError = handlePrismaError(err);
  if (prismaError) {
    error = prismaError;
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  } else if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }
  
  // Handle validation errors from express-validator
  if (err.type === 'entity.parse.failed') {
    error = new ValidationError('Invalid JSON format');
  }
  
  // Handle multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ValidationError('File size too large');
  } else if (err.code === 'LIMIT_FILE_COUNT') {
    error = new ValidationError('Too many files');
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new ValidationError('Unexpected file field');
  }
  
  // Ensure error is an APIError instance
  if (!(error instanceof APIError)) {
    error = new APIError(
      process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      500,
      'INTERNAL_ERROR'
    );
  }
  
  // Log error (exclude validation and auth errors from error logs)
  if (error.statusCode >= 500) {
    console.error('Server Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
      timestamp: error.timestamp
    });
    
    // Log to audit service if available
    if (req.app.locals.auditService) {
      try {
        await req.app.locals.auditService.logSystemEvent({
          event: 'api_error',
          severity: 'error',
          description: `API error: ${error.message}`,
          metadata: {
            errorCode: error.code,
            statusCode: error.statusCode,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            userId: req.user?.id,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          }
        });
      } catch (auditError) {
        console.error('Failed to log error to audit service:', auditError);
      }
    }
  }
  
  // Prepare error response
  const errorResponse = {
    error: error.message,
    code: error.code,
    timestamp: error.timestamp
  };
  
  // Add details for validation errors
  if (error.details) {
    errorResponse.details = error.details;
  }
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && error.statusCode >= 500) {
    errorResponse.stack = error.stack;
  }
  
  // Add request info for debugging
  if (process.env.NODE_ENV === 'development') {
    errorResponse.request = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    };
  }
  
  res.status(error.statusCode).json(errorResponse);
};

/**
 * Success response helper
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  
  res.status(statusCode).json(response);
};

/**
 * Paginated response helper
 */
const paginatedResponse = (res, data, pagination, message = 'Success') => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1
    },
    timestamp: new Date().toISOString()
  };
  
  res.json(response);
};

/**
 * Error response helper
 */
const errorResponse = (res, message, statusCode = 500, code = 'ERROR', details = null) => {
  const response = {
    error: message,
    code,
    timestamp: new Date().toISOString()
  };
  
  if (details) {
    response.details = details;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Try-catch wrapper for database operations
 */
const dbOperation = async (operation, errorMessage = 'Database operation failed') => {
  try {
    return await operation();
  } catch (error) {
    const prismaError = handlePrismaError(error);
    if (prismaError) {
      throw prismaError;
    }
    throw new DatabaseError(errorMessage);
  }
};

/**
 * Validate resource ownership
 */
const validateOwnership = (resource, userId, field = 'createdBy') => {
  if (!resource) {
    throw new NotFoundError('Resource');
  }
  
  if (resource[field] !== userId) {
    throw new AuthorizationError('Access denied to this resource');
  }
};

/**
 * Handle concurrent request conflicts
 */
const handleConcurrency = (resource, clientVersion, field = 'updatedAt') => {
  if (!resource) {
    throw new NotFoundError('Resource');
  }
  
  if (clientVersion && resource[field] && new Date(resource[field]) > new Date(clientVersion)) {
    throw new ConflictError('Resource has been modified by another user');
  }
};

module.exports = {
  // Error classes
  APIError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  
  // Middleware
  asyncHandler,
  errorHandler,
  notFoundHandler,
  
  // Response helpers
  successResponse,
  paginatedResponse,
  errorResponse,
  
  // Utility functions
  handlePrismaError,
  dbOperation,
  validateOwnership,
  handleConcurrency
};