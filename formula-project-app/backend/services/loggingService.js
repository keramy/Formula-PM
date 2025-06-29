/**
 * Structured Logging Service
 * Provides consistent, structured logging across the backend application
 * with correlation IDs, log levels, and proper formatting
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Log levels
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace'
};

// Log level priority for filtering
const LOG_LEVEL_PRIORITY = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

class LoggingService {
  constructor(options = {}) {
    this.serviceName = options.serviceName || 'formula-pm-backend';
    this.environment = options.environment || process.env.NODE_ENV || 'development';
    this.logLevel = options.logLevel || (this.environment === 'production' ? 'info' : 'debug');
    this.enableConsole = options.enableConsole !== false;
    this.enableFile = options.enableFile || false;
    this.logDirectory = options.logDirectory || path.join(__dirname, '../logs');
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB
    this.maxFiles = options.maxFiles || 5;
    
    // Ensure log directory exists if file logging is enabled
    if (this.enableFile && !fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
    
    // Current log file path
    this.currentLogFile = this.enableFile ? 
      path.join(this.logDirectory, `app-${new Date().toISOString().split('T')[0]}.log`) : null;
  }

  /**
   * Creates a structured log entry
   */
  createLogEntry(level, message, data = {}, metadata = {}) {
    const timestamp = new Date().toISOString();
    const correlationId = metadata.correlationId || this.generateCorrelationId();
    
    return {
      timestamp,
      level,
      service: this.serviceName,
      environment: this.environment,
      correlationId,
      message,
      data: this.sanitizeData(data),
      metadata: {
        pid: process.pid,
        hostname: require('os').hostname(),
        ...metadata
      }
    };
  }

  /**
   * Sanitizes sensitive data from log entries
   */
  sanitizeData(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveFields = [
      'password', 'token', 'apiKey', 'secret', 'authorization',
      'cookie', 'sessionId', 'refreshToken', 'accessToken'
    ];

    const sanitized = JSON.parse(JSON.stringify(data));
    
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else if (sensitiveFields.some(field => 
          key.toLowerCase().includes(field.toLowerCase())
        )) {
          obj[key] = '[REDACTED]';
        }
      }
    };

    sanitizeObject(sanitized);
    return sanitized;
  }

  /**
   * Generates a correlation ID for request tracking
   */
  generateCorrelationId() {
    return uuidv4().substring(0, 8);
  }

  /**
   * Checks if the log should be output based on current log level
   */
  shouldLog(level) {
    return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[this.logLevel];
  }

  /**
   * Formats log entry for console output
   */
  formatForConsole(logEntry) {
    const { timestamp, level, correlationId, message, data, metadata } = logEntry;
    const colors = {
      error: '\x1b[31m',   // Red
      warn: '\x1b[33m',    // Yellow
      info: '\x1b[36m',    // Cyan
      debug: '\x1b[37m',   // White
      trace: '\x1b[90m'    // Gray
    };
    const reset = '\x1b[0m';
    
    const levelColor = colors[level] || colors.info;
    const timeStr = new Date(timestamp).toLocaleTimeString();
    
    let output = `${levelColor}[${timeStr}] ${level.toUpperCase()}${reset} `;
    output += `[${correlationId}] ${message}`;
    
    if (data && Object.keys(data).length > 0) {
      output += `\n  Data: ${JSON.stringify(data, null, 2)}`;
    }
    
    if (metadata.userId) {
      output += ` (User: ${metadata.userId})`;
    }
    
    if (metadata.requestId) {
      output += ` (Request: ${metadata.requestId})`;
    }
    
    return output;
  }

  /**
   * Formats log entry for file output
   */
  formatForFile(logEntry) {
    return JSON.stringify(logEntry) + '\n';
  }

  /**
   * Writes log entry to file
   */
  async writeToFile(logEntry) {
    if (!this.enableFile || !this.currentLogFile) {
      return;
    }

    try {
      const logLine = this.formatForFile(logEntry);
      
      // Check file size and rotate if necessary
      if (fs.existsSync(this.currentLogFile)) {
        const stats = fs.statSync(this.currentLogFile);
        if (stats.size >= this.maxFileSize) {
          await this.rotateLogFile();
        }
      }
      
      fs.appendFileSync(this.currentLogFile, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Rotates log files when they exceed maximum size
   */
  async rotateLogFile() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedFile = path.join(
        this.logDirectory, 
        `app-${timestamp}.log`
      );
      
      fs.renameSync(this.currentLogFile, rotatedFile);
      
      // Clean up old log files
      this.cleanupOldLogFiles();
      
      // Update current log file
      this.currentLogFile = path.join(
        this.logDirectory, 
        `app-${new Date().toISOString().split('T')[0]}.log`
      );
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  /**
   * Removes old log files beyond the maximum count
   */
  cleanupOldLogFiles() {
    try {
      const files = fs.readdirSync(this.logDirectory)
        .filter(file => file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.logDirectory, file),
          stats: fs.statSync(path.join(this.logDirectory, file))
        }))
        .sort((a, b) => b.stats.mtime - a.stats.mtime);

      // Remove files beyond maxFiles limit
      if (files.length > this.maxFiles) {
        files.slice(this.maxFiles).forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
    } catch (error) {
      console.error('Failed to cleanup old log files:', error);
    }
  }

  /**
   * Core logging method
   */
  log(level, message, data = {}, metadata = {}) {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = this.createLogEntry(level, message, data, metadata);

    // Console output
    if (this.enableConsole) {
      const consoleOutput = this.formatForConsole(logEntry);
      console.log(consoleOutput);
    }

    // File output
    if (this.enableFile) {
      this.writeToFile(logEntry);
    }

    return logEntry;
  }

  /**
   * Error logging
   */
  error(message, data = {}, metadata = {}) {
    return this.log(LOG_LEVELS.ERROR, message, data, metadata);
  }

  /**
   * Warning logging
   */
  warn(message, data = {}, metadata = {}) {
    return this.log(LOG_LEVELS.WARN, message, data, metadata);
  }

  /**
   * Info logging
   */
  info(message, data = {}, metadata = {}) {
    return this.log(LOG_LEVELS.INFO, message, data, metadata);
  }

  /**
   * Debug logging
   */
  debug(message, data = {}, metadata = {}) {
    return this.log(LOG_LEVELS.DEBUG, message, data, metadata);
  }

  /**
   * Trace logging
   */
  trace(message, data = {}, metadata = {}) {
    return this.log(LOG_LEVELS.TRACE, message, data, metadata);
  }

  /**
   * Request logging middleware
   */
  requestLogger() {
    return (req, res, next) => {
      const correlationId = req.headers['x-correlation-id'] || this.generateCorrelationId();
      const requestId = this.generateCorrelationId();
      
      // Add correlation ID to request
      req.correlationId = correlationId;
      req.requestId = requestId;
      
      // Add correlation ID to response headers
      res.setHeader('X-Correlation-ID', correlationId);
      res.setHeader('X-Request-ID', requestId);
      
      // Log request start
      this.info('Request started', {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id
      }, {
        correlationId,
        requestId,
        userId: req.user?.id,
        type: 'request_start'
      });

      // Capture response details
      const originalSend = res.send;
      const startTime = Date.now();
      
      res.send = function(data) {
        const duration = Date.now() - startTime;
        const responseSize = Buffer.byteLength(data, 'utf8');
        
        // Log request completion
        const logger = req.app.locals.logger || new LoggingService();
        const level = res.statusCode >= 400 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
        
        logger.log(level, 'Request completed', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
          responseSize,
          userId: req.user?.id
        }, {
          correlationId,
          requestId,
          userId: req.user?.id,
          type: 'request_end'
        });

        return originalSend.call(this, data);
      };

      next();
    };
  }

  /**
   * Error logging middleware
   */
  errorLogger() {
    return (error, req, res, next) => {
      this.error('Request error', {
        message: error.message,
        stack: error.stack,
        method: req.method,
        url: req.url,
        userId: req.user?.id,
        statusCode: error.statusCode || 500
      }, {
        correlationId: req.correlationId,
        requestId: req.requestId,
        userId: req.user?.id,
        type: 'request_error'
      });

      next(error);
    };
  }

  /**
   * Database operation logging
   */
  logDatabaseOperation(operation, table, data = {}, metadata = {}) {
    this.debug('Database operation', {
      operation,
      table,
      ...data
    }, {
      ...metadata,
      type: 'database_operation'
    });
  }

  /**
   * API response logging
   */
  logApiResponse(endpoint, statusCode, responseTime, data = {}, metadata = {}) {
    const level = statusCode >= 400 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
    
    this.log(level, 'API response', {
      endpoint,
      statusCode,
      responseTime,
      ...data
    }, {
      ...metadata,
      type: 'api_response'
    });
  }

  /**
   * Security event logging
   */
  logSecurityEvent(event, details = {}, metadata = {}) {
    this.warn('Security event', {
      event,
      ...details
    }, {
      ...metadata,
      type: 'security_event'
    });
  }

  /**
   * Performance monitoring
   */
  logPerformance(operation, duration, details = {}, metadata = {}) {
    const level = duration > 5000 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
    
    this.log(level, 'Performance metric', {
      operation,
      duration,
      ...details
    }, {
      ...metadata,
      type: 'performance'
    });
  }

  /**
   * Business logic logging
   */
  logBusinessEvent(event, details = {}, metadata = {}) {
    this.info('Business event', {
      event,
      ...details
    }, {
      ...metadata,
      type: 'business_event'
    });
  }

  /**
   * System health logging
   */
  logSystemHealth(metrics = {}, metadata = {}) {
    this.info('System health', {
      ...metrics,
      timestamp: new Date().toISOString()
    }, {
      ...metadata,
      type: 'system_health'
    });
  }

  /**
   * Get recent logs (for debugging)
   */
  getRecentLogs(count = 100) {
    if (!this.enableFile || !this.currentLogFile || !fs.existsSync(this.currentLogFile)) {
      return [];
    }

    try {
      const content = fs.readFileSync(this.currentLogFile, 'utf8');
      const lines = content.trim().split('\n');
      
      return lines
        .slice(-count)
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    } catch (error) {
      this.error('Failed to read recent logs', { error: error.message });
      return [];
    }
  }

  /**
   * Configure log level at runtime
   */
  setLogLevel(level) {
    if (Object.values(LOG_LEVELS).includes(level)) {
      this.logLevel = level;
      this.info('Log level changed', { newLevel: level });
    } else {
      this.warn('Invalid log level', { attemptedLevel: level });
    }
  }

  /**
   * Health check for logging service
   */
  healthCheck() {
    const health = {
      status: 'healthy',
      service: this.serviceName,
      environment: this.environment,
      logLevel: this.logLevel,
      enableConsole: this.enableConsole,
      enableFile: this.enableFile
    };

    if (this.enableFile) {
      health.logDirectory = this.logDirectory;
      health.currentLogFile = this.currentLogFile;
      
      try {
        const stats = fs.statSync(this.currentLogFile);
        health.currentFileSize = stats.size;
        health.lastModified = stats.mtime;
      } catch (error) {
        health.status = 'degraded';
        health.fileError = error.message;
      }
    }

    return health;
  }
}

// Create singleton instance
const logger = new LoggingService({
  serviceName: 'formula-pm-backend',
  environment: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,
  enableFile: process.env.ENABLE_FILE_LOGGING === 'true',
  logDirectory: process.env.LOG_DIRECTORY
});

module.exports = {
  LoggingService,
  logger,
  LOG_LEVELS
};