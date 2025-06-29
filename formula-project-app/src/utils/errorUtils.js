/**
 * Standardized Error Handling Utilities
 * Provides consistent error handling patterns across the application
 */

// Error types for classification
export const ERROR_TYPES = {
  NETWORK: 'network',
  API: 'api',
  AUTH: 'auth',
  VALIDATION: 'validation',
  TIMEOUT: 'timeout',
  CHUNK: 'chunk',
  DATA: 'data',
  COMPONENT: 'component',
  APPLICATION: 'application',
  PERMISSION: 'permission'
};

// Error severities
export const ERROR_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error categories
export const ERROR_CATEGORIES = {
  CONNECTIVITY: 'connectivity',
  DATA: 'data',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  LOADING: 'loading',
  UI: 'ui',
  UNKNOWN: 'unknown'
};

/**
 * Standardized error class with enhanced properties
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.APPLICATION, severity = ERROR_SEVERITIES.MEDIUM, options = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.category = this.getCategoryFromType(type);
    this.isRecoverable = options.isRecoverable !== false;
    this.isTemporary = options.isTemporary || false;
    this.context = options.context || {};
    this.timestamp = new Date().toISOString();
    this.errorId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.userMessage = options.userMessage || this.getDefaultUserMessage();
    
    // Preserve stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  getCategoryFromType(type) {
    const typeToCategory = {
      [ERROR_TYPES.NETWORK]: ERROR_CATEGORIES.CONNECTIVITY,
      [ERROR_TYPES.API]: ERROR_CATEGORIES.DATA,
      [ERROR_TYPES.AUTH]: ERROR_CATEGORIES.SECURITY,
      [ERROR_TYPES.PERMISSION]: ERROR_CATEGORIES.SECURITY,
      [ERROR_TYPES.TIMEOUT]: ERROR_CATEGORIES.PERFORMANCE,
      [ERROR_TYPES.CHUNK]: ERROR_CATEGORIES.LOADING,
      [ERROR_TYPES.DATA]: ERROR_CATEGORIES.DATA,
      [ERROR_TYPES.COMPONENT]: ERROR_CATEGORIES.UI,
      [ERROR_TYPES.VALIDATION]: ERROR_CATEGORIES.DATA
    };
    
    return typeToCategory[type] || ERROR_CATEGORIES.UNKNOWN;
  }

  getDefaultUserMessage() {
    const userMessages = {
      [ERROR_TYPES.NETWORK]: 'Unable to connect to the server. Please check your internet connection.',
      [ERROR_TYPES.API]: 'Server is experiencing issues. Please try again in a moment.',
      [ERROR_TYPES.AUTH]: 'Authentication required. Please log in to continue.',
      [ERROR_TYPES.PERMISSION]: 'You do not have permission to perform this action.',
      [ERROR_TYPES.TIMEOUT]: 'The request timed out. Please try again.',
      [ERROR_TYPES.CHUNK]: 'Failed to load application resources. Please refresh the page.',
      [ERROR_TYPES.DATA]: 'There was an issue processing the data. Please try again.',
      [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
      [ERROR_TYPES.COMPONENT]: 'User interface error. Please refresh the page.'
    };
    
    return userMessages[this.type] || 'An unexpected error occurred. Please try again.';
  }

  toJSON() {
    return {
      errorId: this.errorId,
      message: this.message,
      type: this.type,
      severity: this.severity,
      category: this.category,
      isRecoverable: this.isRecoverable,
      isTemporary: this.isTemporary,
      userMessage: this.userMessage,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Analyzes and classifies errors
 */
export const analyzeError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  const errorMessage = error?.message?.toLowerCase() || '';
  const errorName = error?.name?.toLowerCase() || '';
  
  // Network errors
  if (errorName === 'typeerror' && errorMessage.includes('fetch')) {
    return new AppError(
      error.message,
      ERROR_TYPES.NETWORK,
      ERROR_SEVERITIES.MEDIUM,
      { isTemporary: true, isRecoverable: true }
    );
  }

  // API errors
  if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
    return new AppError(
      error.message,
      ERROR_TYPES.API,
      ERROR_SEVERITIES.HIGH,
      { isTemporary: true, isRecoverable: true }
    );
  }

  // Authentication errors
  if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
    return new AppError(
      error.message,
      ERROR_TYPES.AUTH,
      ERROR_SEVERITIES.HIGH,
      { isTemporary: false, isRecoverable: false }
    );
  }

  // Permission errors
  if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
    return new AppError(
      error.message,
      ERROR_TYPES.PERMISSION,
      ERROR_SEVERITIES.HIGH,
      { isTemporary: false, isRecoverable: false }
    );
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || errorName === 'aborterror') {
    return new AppError(
      error.message,
      ERROR_TYPES.TIMEOUT,
      ERROR_SEVERITIES.LOW,
      { isTemporary: true, isRecoverable: true }
    );
  }

  // Chunk loading errors
  if (errorName === 'chunkloaderror' || errorMessage.includes('loading chunk')) {
    return new AppError(
      error.message,
      ERROR_TYPES.CHUNK,
      ERROR_SEVERITIES.MEDIUM,
      { isTemporary: true, isRecoverable: true }
    );
  }

  // Data/JSON parsing errors
  if (errorMessage.includes('json') || errorMessage.includes('parse')) {
    return new AppError(
      error.message,
      ERROR_TYPES.DATA,
      ERROR_SEVERITIES.MEDIUM,
      { isTemporary: true, isRecoverable: true }
    );
  }

  // Default classification
  return new AppError(
    error.message || 'Unknown error',
    ERROR_TYPES.APPLICATION,
    ERROR_SEVERITIES.HIGH,
    { isTemporary: false, isRecoverable: true }
  );
};

/**
 * Safe execution wrapper with error handling
 */
export const safeExecute = async (fn, fallback = null, context = {}) => {
  try {
    return await fn();
  } catch (error) {
    const analyzedError = analyzeError(error);
    analyzedError.context = { ...analyzedError.context, ...context };
    
    console.error('SafeExecute caught error:', analyzedError);
    
    if (fallback !== null) {
      return typeof fallback === 'function' ? fallback(analyzedError) : fallback;
    }
    
    throw analyzedError;
  }
};

/**
 * Retry wrapper with exponential backoff
 */
export const withRetry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    retryCondition = (error) => analyzeError(error).isRecoverable,
    onRetry = () => {}
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = analyzeError(error);
      
      if (attempt === maxRetries || !retryCondition(lastError)) {
        throw lastError;
      }
      
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      onRetry(lastError, attempt + 1, delay);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * API error handler with standardized responses
 */
export const handleApiError = (error, context = {}) => {
  const analyzedError = analyzeError(error);
  analyzedError.context = { ...analyzedError.context, ...context };
  
  // Log error for debugging
  console.error('API Error:', {
    errorId: analyzedError.errorId,
    type: analyzedError.type,
    message: analyzedError.message,
    context: analyzedError.context
  });
  
  // Store error for reporting
  storeErrorLocally(analyzedError);
  
  return analyzedError;
};

/**
 * Validation error handler
 */
export const createValidationError = (message, field = null, value = null) => {
  return new AppError(
    message,
    ERROR_TYPES.VALIDATION,
    ERROR_SEVERITIES.LOW,
    {
      context: { field, value },
      userMessage: message,
      isTemporary: false,
      isRecoverable: true
    }
  );
};

/**
 * Network error handler
 */
export const createNetworkError = (message = 'Network connection failed') => {
  return new AppError(
    message,
    ERROR_TYPES.NETWORK,
    ERROR_SEVERITIES.MEDIUM,
    {
      isTemporary: true,
      isRecoverable: true,
      userMessage: 'Please check your internet connection and try again.'
    }
  );
};

/**
 * Error reporting utilities
 */
export const storeErrorLocally = (error) => {
  try {
    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    errors.push({
      ...error.toJSON(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
    
    // Keep only last 100 errors
    if (errors.length > 100) {
      errors.splice(0, errors.length - 100);
    }
    
    localStorage.setItem('app_errors', JSON.stringify(errors));
  } catch (storageError) {
    console.warn('Failed to store error locally:', storageError);
  }
};

export const getStoredErrors = () => {
  try {
    return JSON.parse(localStorage.getItem('app_errors') || '[]');
  } catch (error) {
    console.warn('Failed to retrieve stored errors:', error);
    return [];
  }
};

export const clearStoredErrors = () => {
  try {
    localStorage.removeItem('app_errors');
  } catch (error) {
    console.warn('Failed to clear stored errors:', error);
  }
};

/**
 * Error boundary helpers
 */
export const createErrorBoundaryConfig = (feature, options = {}) => {
  return {
    feature,
    context: options.context || feature,
    maxRetries: options.maxRetries || 3,
    enableAutoRetry: options.enableAutoRetry !== false,
    onError: options.onError || ((error) => {
      console.error(`Error in ${feature}:`, error);
      storeErrorLocally(analyzeError(error));
    }),
    onBeforeRefresh: options.onBeforeRefresh,
    homeUrl: options.homeUrl || '/dashboard',
    supportUrl: options.supportUrl
  };
};

/**
 * Form error handling utilities
 */
export const handleFormError = (error, setError, field = null) => {
  const analyzedError = analyzeError(error);
  
  if (field && analyzedError.type === ERROR_TYPES.VALIDATION) {
    setError(field, {
      type: 'manual',
      message: analyzedError.userMessage
    });
  } else {
    // Handle general form error
    setError('root', {
      type: 'manual',
      message: analyzedError.userMessage
    });
  }
  
  return analyzedError;
};

/**
 * Async data loading with error handling
 */
export const loadDataSafely = async (loadFn, options = {}) => {
  const {
    fallbackData = null,
    retryOptions = { maxRetries: 2 },
    context = {}
  } = options;

  try {
    return await withRetry(loadFn, retryOptions);
  } catch (error) {
    const analyzedError = handleApiError(error, context);
    
    if (fallbackData !== null) {
      console.warn('Using fallback data due to error:', analyzedError.errorId);
      return fallbackData;
    }
    
    throw analyzedError;
  }
};

/**
 * Promise-based error handling utility
 */
export const handlePromiseError = (promise, fallback = null) => {
  return promise.catch(error => {
    const analyzedError = analyzeError(error);
    console.error('Promise error:', analyzedError);
    storeErrorLocally(analyzedError);
    
    if (fallback !== null) {
      return typeof fallback === 'function' ? fallback(analyzedError) : fallback;
    }
    
    throw analyzedError;
  });
};

// Export for backwards compatibility
export default {
  AppError,
  ERROR_TYPES,
  ERROR_SEVERITIES,
  ERROR_CATEGORIES,
  analyzeError,
  safeExecute,
  withRetry,
  handleApiError,
  createValidationError,
  createNetworkError,
  storeErrorLocally,
  getStoredErrors,
  clearStoredErrors,
  createErrorBoundaryConfig,
  handleFormError,
  loadDataSafely,
  handlePromiseError
};