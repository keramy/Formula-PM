/**
 * Logger utility for Formula PM
 * Provides controlled logging with different levels
 * Replaces console.log statements for better production control
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    // Set log level based on environment
    this.logLevel = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  error(message, ...args) {
    if (this.logLevel >= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  warn(message, ...args) {
    if (this.logLevel >= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message, ...args) {
    if (this.logLevel >= LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  debug(message, ...args) {
    if (this.logLevel >= LOG_LEVELS.DEBUG && this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  // Development-only logging
  dev(message, ...args) {
    if (this.isDevelopment) {
      console.log(`[DEV] ${message}`, ...args);
    }
  }

  // Performance timing
  time(label) {
    if (this.isDevelopment) {
      console.time(`[TIMER] ${label}`);
    }
  }

  timeEnd(label) {
    if (this.isDevelopment) {
      console.timeEnd(`[TIMER] ${label}`);
    }
  }

  // Group logging
  group(label, collapsed = false) {
    if (this.isDevelopment) {
      if (collapsed) {
        console.groupCollapsed(`[GROUP] ${label}`);
      } else {
        console.group(`[GROUP] ${label}`);
      }
    }
  }

  groupEnd() {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  // API call logging
  api(method, url, data = null) {
    if (this.isDevelopment) {
      console.log(`[API] ${method.toUpperCase()} ${url}`, data ? { data } : '');
    }
  }

  // Component lifecycle logging
  component(name, action, data = null) {
    if (this.isDevelopment) {
      console.log(`[COMPONENT] ${name}: ${action}`, data || '');
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;