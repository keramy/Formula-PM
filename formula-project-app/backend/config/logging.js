/**
 * Formula PM - Production Logging Configuration
 * Comprehensive logging setup with Winston for production environments
 */

const winston = require('winston');
const path = require('path');

// Custom log format for production
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
);

// Development format (more readable)
const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
require('fs').mkdirSync(logsDir, { recursive: true });

// Configure log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: process.env.NODE_ENV === 'production' ? logFormat : developmentFormat,
  defaultMeta: {
    service: 'formula-pm-backend'
  },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' 
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : developmentFormat
    }),

    // File transports for production
    ...(process.env.NODE_ENV === 'production' ? [
      // Error logs
      new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: logFormat
      }),

      // Combined logs
      new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: logFormat
      }),

      // HTTP access logs
      new winston.transports.File({
        filename: path.join(logsDir, 'access.log'),
        level: 'http',
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        format: logFormat
      }),

      // Application logs
      new winston.transports.File({
        filename: path.join(logsDir, 'app.log'),
        level: 'info',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: logFormat
      })
    ] : [])
  ],

  // Handle uncaught exceptions
  exceptionHandlers: process.env.NODE_ENV === 'production' ? [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      format: logFormat
    })
  ] : [],

  // Handle unhandled promise rejections
  rejectionHandlers: process.env.NODE_ENV === 'production' ? [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      format: logFormat
    })
  ] : []
});

// Create specific loggers for different components
const createComponentLogger = (component) => {
  return logger.child({ component });
};

// Export loggers
module.exports = {
  logger,
  createComponentLogger,
  
  // Specific component loggers
  authLogger: createComponentLogger('auth'),
  apiLogger: createComponentLogger('api'),
  dbLogger: createComponentLogger('database'),
  cacheLogger: createComponentLogger('cache'),
  emailLogger: createComponentLogger('email'),
  realtimeLogger: createComponentLogger('realtime'),
  analyticsLogger: createComponentLogger('analytics'),
  securityLogger: createComponentLogger('security'),
  performanceLogger: createComponentLogger('performance'),

  // Log levels
  levels,

  // Utility functions
  logRequest: (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logData = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || 'anonymous'
      };

      if (res.statusCode >= 400) {
        logger.error('HTTP Request Error', logData);
      } else {
        logger.http('HTTP Request', logData);
      }
    });

    next();
  },

  logError: (error, req = null, additionalData = {}) => {
    const logData = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      ...additionalData
    };

    if (req) {
      logData.request = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || 'anonymous'
      };
    }

    logger.error('Application Error', logData);
  },

  logSecurity: (event, req = null, additionalData = {}) => {
    const logData = {
      securityEvent: event,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    if (req) {
      logData.request = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || 'anonymous'
      };
    }

    logger.warn('Security Event', logData);
  },

  logPerformance: (operation, duration, additionalData = {}) => {
    const logData = {
      operation,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    if (duration > 1000) {
      logger.warn('Slow Operation', logData);
    } else {
      logger.info('Performance Metric', logData);
    }
  },

  logDatabase: (query, duration, additionalData = {}) => {
    const logData = {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    if (duration > 500) {
      dbLogger.warn('Slow Database Query', logData);
    } else {
      dbLogger.debug('Database Query', logData);
    }
  }
};

// If we're not in production, add colors to console
if (process.env.NODE_ENV !== 'production') {
  winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
  });
}