import { PerformanceMonitor } from '../../utils/performance';
import { demoProjects, demoTasks, demoTeamMembers, demoClients, demoShopDrawings, demoMaterialSpecs } from '../demoDataService';

// Configure API base URL for different environments
const API_BASE_URL = (() => {
  // Force demo mode if environment variable is set
  if (import.meta.env.VITE_FORCE_DEMO_MODE === 'true') {
    return null; // This will force all requests to use demo data
  }
  
  // In development mode, use empty string to leverage Vite proxy
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5014/api/v1';
  }
  
  // In production, use full URL
  return import.meta.env.VITE_API_URL || 'http://localhost:5014/api/v1';
})();

// Check if we should force demo mode (from env variable or localStorage)
const FORCE_DEMO_MODE = (() => {
  const envDemoMode = import.meta.env.VITE_FORCE_DEMO_MODE === 'true';
  const localStorageDemoMode = localStorage.getItem('vite_force_demo_mode') === 'true';
  const noApiUrl = API_BASE_URL === null;
  
  return envDemoMode || localStorageDemoMode || noApiUrl;
})();

class ApiService {
  constructor() {
    this.authToken = null;
    this.refreshPromise = null;
    this.pendingRequests = new Map(); // For request deduplication
    this.requestRetryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      retryableStatuses: [408, 429, 500, 502, 503, 504]
    };
    
    // Circuit breaker configuration
    this.circuitBreaker = {
      failures: 0,
      successThreshold: 3,
      failureThreshold: 5,
      timeout: 60000, // 1 minute
      state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
      nextAttempt: null,
      lastFailureTime: null
    };
    
    // Request queue for offline support
    this.offlineQueue = [];
    this.isOnline = navigator.onLine;
    
    // Performance metrics
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      slowRequestThreshold: 5000
    };
    
    this.setupEventListeners();
  }

  // Get auth token from localStorage
  getAuthToken() {
    if (!this.authToken) {
      this.authToken = localStorage.getItem('auth_token');
    }
    return this.authToken;
  }

  // Set auth token and store in localStorage
  setAuthToken(token) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Clear auth token
  clearAuthToken() {
    this.authToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Setup event listeners for online/offline detection
  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Circuit breaker pattern implementation
  shouldAllowRequest() {
    const now = Date.now();
    
    switch (this.circuitBreaker.state) {
      case 'CLOSED':
        return true;
        
      case 'OPEN':
        if (now >= this.circuitBreaker.nextAttempt) {
          this.circuitBreaker.state = 'HALF_OPEN';
          return true;
        }
        return false;
        
      case 'HALF_OPEN':
        return true;
        
      default:
        return true;
    }
  }

  recordSuccess() {
    if (this.circuitBreaker.state === 'HALF_OPEN') {
      this.circuitBreaker.failures = 0;
      this.circuitBreaker.state = 'CLOSED';
    } else if (this.circuitBreaker.state === 'CLOSED') {
      this.circuitBreaker.failures = Math.max(0, this.circuitBreaker.failures - 1);
    }
  }

  recordFailure() {
    this.circuitBreaker.failures++;
    this.circuitBreaker.lastFailureTime = Date.now();
    
    if (this.circuitBreaker.failures >= this.circuitBreaker.failureThreshold) {
      this.circuitBreaker.state = 'OPEN';
      this.circuitBreaker.nextAttempt = Date.now() + this.circuitBreaker.timeout;
    }
  }

  // Offline queue processing
  queueRequest(endpoint, options) {
    const request = {
      endpoint,
      options,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    };
    
    this.offlineQueue.push(request);
    
    // Limit queue size
    if (this.offlineQueue.length > 50) {
      this.offlineQueue.shift();
    }
    
    return Promise.reject(new Error('Request queued for when connection is restored'));
  }

  async processOfflineQueue() {
    if (!this.isOnline || this.offlineQueue.length === 0) return;
    
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    
    console.log(`Processing ${queue.length} queued requests...`);
    
    for (const request of queue) {
      try {
        await this.request(request.endpoint, request.options);
      } catch (error) {
        console.warn('Failed to process queued request:', error);
        // Re-queue if still failing
        if (this.offlineQueue.length < 50) {
          this.offlineQueue.push(request);
        }
      }
    }
  }

  // Performance metrics tracking
  updateMetrics(success, responseTime) {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }
    
    // Update average response time
    const totalResponseTime = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime;
    this.metrics.averageResponseTime = totalResponseTime / this.metrics.totalRequests;
  }

  getHealthMetrics() {
    const successRate = this.metrics.totalRequests > 0 
      ? (this.metrics.successfulRequests / this.metrics.totalRequests) * 100 
      : 100;
    
    return {
      ...this.metrics,
      successRate: Math.round(successRate * 100) / 100,
      circuitBreakerState: this.circuitBreaker.state,
      isOnline: this.isOnline,
      queuedRequests: this.offlineQueue.length
    };
  }

  // Generate request key for deduplication
  generateRequestKey(endpoint, options = {}) {
    const method = options.method || 'GET';
    const body = options.body || '';
    return `${method}:${endpoint}:${body}`;
  }

  // Sleep function for retry delays
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Calculate exponential backoff delay
  calculateRetryDelay(attempt, baseDelay = 1000) {
    const exponentialDelay = Math.min(
      baseDelay * Math.pow(2, attempt),
      this.requestRetryConfig.maxDelay
    );
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return exponentialDelay + jitter;
  }

  // Check if error is retryable
  isRetryableError(error) {
    if (!error) return false;
    
    // Network errors are retryable
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true;
    }
    
    // Check HTTP status codes
    if (error.status) {
      return this.requestRetryConfig.retryableStatuses.includes(error.status);
    }
    
    return false;
  }

  // Enhanced error message formatting
  formatErrorMessage(error, context = '') {
    if (!error) return 'Unknown error occurred';
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Network connection failed. Please check your internet connection and try again.';
    }
    
    // Handle timeout errors
    if (error.name === 'AbortError') {
      return 'Request timed out. Please try again.';
    }
    
    // Handle HTTP errors with user-friendly messages
    if (error.status) {
      switch (error.status) {
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Authentication required. Please log in again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 408:
          return 'Request timed out. Please try again.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Server error occurred. Please try again later.';
        case 502:
        case 503:
        case 504:
          return 'Service temporarily unavailable. Please try again in a few moments.';
        default:
          return `Service error (${error.status}). Please try again or contact support.`;
      }
    }
    
    // Fallback to original error message but make it more user-friendly
    const message = error.message || error.toString();
    return message.charAt(0).toUpperCase() + message.slice(1);
  }

  async request(endpoint, options = {}) {
    const requestKey = this.generateRequestKey(endpoint, options);
    
    // Check for pending identical request (deduplication)
    if (this.pendingRequests.has(requestKey)) {
      console.log(`🔄 Deduplicating request: ${requestKey}`);
      return this.pendingRequests.get(requestKey);
    }

    // Check circuit breaker state
    if (!this.shouldAllowRequest()) {
      const error = new Error('Service temporarily unavailable (Circuit breaker is OPEN)');
      error.status = 503;
      error.circuitBreakerOpen = true;
      throw error;
    }

    // Handle offline requests
    if (!this.isOnline && !options.allowOffline) {
      return this.queueRequest(endpoint, options);
    }

    // Create the request promise with retry logic
    const requestPromise = this._executeRequestWithRetry(endpoint, options);
    
    // Store pending request for deduplication
    this.pendingRequests.set(requestKey, requestPromise);
    
    try {
      const result = await requestPromise;
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(requestKey);
    }
  }

  async _executeRequestWithRetry(endpoint, options = {}) {
    const { skipRetry = false, ...requestOptions } = options;
    let lastError = null;
    
    for (let attempt = 0; attempt <= this.requestRetryConfig.maxRetries; attempt++) {
      try {
        return await this._executeSingleRequest(endpoint, requestOptions, attempt);
      } catch (error) {
        lastError = error;
        
        // Don't retry if explicitly disabled or if not a retryable error
        if (skipRetry || !this.isRetryableError(error)) {
          throw error;
        }
        
        // Don't retry on the last attempt
        if (attempt === this.requestRetryConfig.maxRetries) {
          throw error;
        }
        
        // Calculate and apply retry delay
        const delay = this.calculateRetryDelay(attempt, this.requestRetryConfig.baseDelay);
        console.warn(`🔁 Request failed (attempt ${attempt + 1}), retrying in ${Math.round(delay)}ms:`, error.message);
        
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }

  async _executeSingleRequest(endpoint, options = {}, attempt = 0) {
    const url = `${API_BASE_URL}${endpoint}`;
    const startTime = performance.now();
    const method = options.method || 'GET';
    
    // Get auth token
    const token = this.getAuthToken();
    
    // Set up request timeout (increase with retries)
    const timeoutMs = Math.min(30000, 10000 + (attempt * 5000));
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Merge abort signals
    const signal = options.signal ? 
      this._mergeAbortSignals([options.signal, controller.signal]) : 
      controller.signal;
    
    // API Request configuration
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      signal,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      const duration = performance.now() - startTime;
      
      // Check if request was aborted
      if (signal?.aborted) {
        const error = new Error('Request was aborted');
        error.name = 'AbortError';
        throw error;
      }
      
      if (!response.ok) {
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401 && token) {
          this.clearAuthToken();
          
          // Try to refresh token if this isn't already an auth request
          if (!endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
            const refreshResult = await this.refreshAuthToken();
            if (refreshResult.success) {
              // Retry original request with new token (no retry limit for auth refresh)
              return this._executeSingleRequest(endpoint, options, attempt);
            }
          }
        }
        
        // Track failed API requests
        PerformanceMonitor.trackApiRequest(endpoint, duration, false, method);
        
        const errorData = await response.json().catch(() => ({ 
          error: 'Server error occurred' 
        }));
        
        const error = new Error(this.formatErrorMessage({
          status: response.status,
          message: errorData.error || `HTTP ${response.status}`
        }, endpoint));
        
        error.status = response.status;
        error.data = errorData;
        error.originalMessage = errorData.error;
        throw error;
      }
      
      const data = await response.json();
      
      // Track successful API requests
      PerformanceMonitor.trackApiRequest(endpoint, duration, true, method);
      this.updateMetrics(true, duration);
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      const duration = performance.now() - startTime;
      
      // Don't log aborted requests as errors (unless it was our timeout)
      if (error.name !== 'AbortError' || controller.signal.aborted) {
        PerformanceMonitor.trackApiRequest(endpoint, duration, false, method);
        this.updateMetrics(false, duration);
        
        // Enhanced error logging
        if (import.meta.env.MODE === 'development') {
          console.group(`🚨 API Request Failed: ${method} ${endpoint}`);
          console.error('URL:', url);
          console.error('Attempt:', attempt + 1);
          console.error('Duration:', Math.round(duration) + 'ms');
          console.error('Circuit Breaker State:', this.circuitBreaker.state);
          console.error('Error:', error);
          console.groupEnd();
        }
      }
      
      // Wrap unknown errors with user-friendly messages
      if (!error.status && error.name !== 'AbortError') {
        const wrappedError = new Error(this.formatErrorMessage(error, endpoint));
        wrappedError.originalError = error;
        throw wrappedError;
      }
      
      throw error;
    }
  }

  // Helper to merge abort signals
  _mergeAbortSignals(signals) {
    const controller = new AbortController();
    
    signals.forEach(signal => {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener('abort', () => controller.abort());
      }
    });
    
    return controller.signal;
  }

  // Refresh authentication token
  async refreshAuthToken() {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._doRefreshToken();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    return result;
  }

  async _doRefreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.setAuthToken(data.token);
        return { success: true, token: data.token };
      } else {
        this.clearAuthToken();
        return { success: false, error: 'Token refresh failed' };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthToken();
      return { success: false, error: error.message };
    }
  }

  // Team Members API (now using /users endpoint)
  async getTeamMembers(signal) {
    // Force demo mode if configured
    if (FORCE_DEMO_MODE) {
      console.info('🎭 Demo mode enabled - using demo team members');
      return demoTeamMembers;
    }
    
    try {
      const response = await this.request('/users', { signal });
      return response.data || response;
    } catch (error) {
      // Handle both network errors and HTTP errors (like 500) as backend unavailable
      if (error.name === 'AbortError') {
        throw error; // Re-throw abort errors
      }
      console.warn('Backend unavailable (network or server error), using demo data:', error.message);
      return demoTeamMembers;
    }
  }

  async createTeamMember(memberData) {
    const response = await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
    return response.data || response;
  }

  async updateTeamMember(id, memberData) {
    const response = await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
    return response.data || response;
  }

  async deleteTeamMember(id) {
    await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
    return true;
  }

  // Projects API
  async getProjects(signal) {
    // Force demo mode if configured
    if (FORCE_DEMO_MODE) {
      console.info('🎭 Demo mode enabled - using demo projects');
      return demoProjects;
    }
    
    try {
      const response = await this.request('/projects', { signal });
      return response.data || response;
    } catch (error) {
      // Handle both network errors and HTTP errors (like 500) as backend unavailable
      if (error.name === 'AbortError') {
        throw error; // Re-throw abort errors
      }
      console.warn('Backend unavailable (network or server error), using demo data:', error.message);
      return demoProjects;
    }
  }

  async createProject(projectData) {
    const response = await this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return response.data || response;
  }

  async updateProject(id, projectData) {
    const response = await this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
    return response.data || response;
  }

  async deleteProject(id) {
    await this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
    return true;
  }

  // Clients API
  async getClients(signal) {
    // Force demo mode if configured
    if (FORCE_DEMO_MODE) {
      console.info('🎭 Demo mode enabled - using demo clients');
      return demoClients;
    }
    
    try {
      return await this.request('/clients', { signal });
    } catch (error) {
      // Handle both network errors and HTTP errors (like 500) as backend unavailable
      if (error.name === 'AbortError') {
        throw error; // Re-throw abort errors
      }
      console.warn('Backend unavailable (network or server error), using demo data:', error.message);
      return demoClients;
    }
  }

  async createClient(clientData) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(id, clientData) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(id) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks API
  async getTasks(signal) {
    // Force demo mode if configured
    if (FORCE_DEMO_MODE) {
      console.info('🎭 Demo mode enabled - using demo tasks');
      return demoTasks;
    }
    
    try {
      return await this.request('/tasks', { signal });
    } catch (error) {
      // Handle both network errors and HTTP errors (like 500) as backend unavailable
      if (error.name === 'AbortError') {
        throw error; // Re-throw abort errors
      }
      console.warn('Backend unavailable (network or server error), using demo data:', error.message);
      return demoTasks;
    }
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Email notifications
  async sendNotification(notificationData) {
    return this.request('/send-notification', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // Scope Items API methods
  async getScopeItems(projectId) {
    try {
      const response = await this.request(`/projects/${projectId}/scope/items`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching scope items:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(`scope_items_${projectId}`);
      return stored ? JSON.parse(stored) : [];
    }
  }

  async createScopeItem(scopeItem) {
    try {
      const response = await this.request(`/projects/${scopeItem.projectId}/scope/items`, {
        method: 'POST',
        body: JSON.stringify(scopeItem)
      });
      
      const newItem = response.data || response;
      
      // Also save to localStorage as backup
      const projectId = scopeItem.projectId;
      const existing = await this.getScopeItems(projectId);
      const updated = [...existing, newItem];
      localStorage.setItem(`scope_items_${projectId}`, JSON.stringify(updated));
      
      return newItem;
    } catch (error) {
      console.error('Error creating scope item:', error);
      
      // Fallback to localStorage
      const projectId = scopeItem.projectId;
      const existing = await this.getScopeItems(projectId);
      const newItem = { ...scopeItem, id: Date.now() };
      const updated = [...existing, newItem];
      localStorage.setItem(`scope_items_${projectId}`, JSON.stringify(updated));
      
      return newItem;
    }
  }

  async updateScopeItem(scopeItemId, updates) {
    try {
      const response = await this.request(`/projects/${updates.projectId}/scope/items/${scopeItemId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response.data || response;
    } catch (error) {
      console.error('Error updating scope item:', error);
      
      // Fallback to localStorage
      const projectId = updates.projectId;
      if (projectId) {
        const existing = await this.getScopeItems(projectId);
        const updated = existing.map(item => 
          item.id === scopeItemId ? { ...item, ...updates } : item
        );
        localStorage.setItem(`scope_items_${projectId}`, JSON.stringify(updated));
        return { ...updates, id: scopeItemId };
      }
      
      throw error;
    }
  }

  async deleteScopeItem(scopeItemId, projectId) {
    try {
      await this.request(`/projects/${projectId}/scope/items/${scopeItemId}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting scope item:', error);
      
      // Fallback to localStorage
      if (projectId) {
        const items = await this.getScopeItems(projectId);
        const filtered = items.filter(item => item.id !== scopeItemId);
        localStorage.setItem(`scope_items_${projectId}`, JSON.stringify(filtered));
        return true;
      }
      
      throw error;
    }
  }

  // Material Specifications API
  async getMaterialSpecifications(params = {}) {
    // Force demo mode if configured
    if (FORCE_DEMO_MODE) {
      console.info('🎭 Demo mode enabled - using demo material specifications');
      return demoMaterialSpecs;
    }
    
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/specifications${queryParams ? `?${queryParams}` : ''}`;
      const response = await this.request(endpoint);
      const specifications = response.data || response;
      
      // Format the specifications to match frontend expectations
      return specifications.map(spec => ({
        ...spec,
        unitCost: typeof spec.unitPrice === 'number' ? `$${spec.unitPrice.toFixed(2)}` : 
                  typeof spec.unitCost === 'number' ? `$${spec.unitCost.toFixed(2)}` : 
                  spec.unitCost || '$0.00',
        totalCost: typeof spec.totalCost === 'number' ? `$${spec.totalCost.toFixed(2)}` : 
                   spec.totalCost || '$0.00',
        quantity: spec.quantity?.toString() || '1',
        leadTime: spec.leadTime?.toString() || '',
        supplier: spec.supplierName || spec.supplier || '',
        projectName: spec.projectName || 'Unknown Project',
        linkedDrawings: spec.shopDrawingIds || spec.linkedDrawings || []
      }));
    } catch (error) {
      // Handle both network errors and HTTP errors (like 500) as backend unavailable
      if (error.name === 'AbortError') {
        throw error; // Re-throw abort errors
      }
      console.warn('Backend unavailable (network or server error), using demo data for specifications:', error.message);
      return demoMaterialSpecs;
    }
  }

  async getMaterialSpecificationById(id) {
    try {
      const response = await this.request(`/specifications/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching specification:', error);
      throw error;
    }
  }

  async getMaterialSpecificationsByProject(projectId) {
    try {
      const response = await this.request(`/specifications/project/${projectId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching project specifications:', error);
      return [];
    }
  }

  async createMaterialSpecification(specData) {
    try {
      const response = await this.request('/specifications', {
        method: 'POST',
        body: JSON.stringify(specData)
      });
      const spec = response.data || response;
      
      // Format the response to match frontend expectations
      return {
        ...spec,
        unitCost: typeof spec.unitPrice === 'number' ? `$${spec.unitPrice.toFixed(2)}` : 
                  typeof spec.unitCost === 'number' ? `$${spec.unitCost.toFixed(2)}` : 
                  spec.unitCost || '$0.00',
        totalCost: typeof spec.totalCost === 'number' ? `$${spec.totalCost.toFixed(2)}` : 
                   spec.totalCost || '$0.00',
        quantity: spec.quantity?.toString() || '1',
        leadTime: spec.leadTime?.toString() || '',
        supplier: spec.supplierName || spec.supplier || '',
        projectName: spec.projectName || 'Unknown Project',
        linkedDrawings: spec.shopDrawingIds || spec.linkedDrawings || []
      };
    } catch (error) {
      console.error('Error creating specification:', error);
      throw error;
    }
  }

  async updateMaterialSpecification(id, specData) {
    try {
      const response = await this.request(`/specifications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(specData)
      });
      return response.data || response;
    } catch (error) {
      console.error('Error updating specification:', error);
      throw error;
    }
  }

  async updateMaterialSpecificationStatus(id, status, notes) {
    try {
      const response = await this.request(`/specifications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes })
      });
      return response.data || response;
    } catch (error) {
      console.error('Error updating specification status:', error);
      throw error;
    }
  }

  async updateMaterialSpecificationLinks(id, linkedDrawings, linkedTasks) {
    try {
      const response = await this.request(`/specifications/${id}/links`, {
        method: 'PATCH',
        body: JSON.stringify({ linkedDrawings, linkedTasks })
      });
      return response.data || response;
    } catch (error) {
      console.error('Error updating specification links:', error);
      throw error;
    }
  }

  async deleteMaterialSpecification(id) {
    try {
      await this.request(`/specifications/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting specification:', error);
      throw error;
    }
  }

  async getMaterialSpecificationStats() {
    try {
      const response = await this.request('/specifications/stats');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching specification stats:', error);
      return {
        total: 0,
        byStatus: {
          pending: 0,
          approved: 0,
          revision_required: 0,
          rejected: 0
        },
        byCategory: {},
        totalCost: 0,
        approvedCost: 0,
        avgCostPerItem: 0
      };
    }
  }

  // Shop Drawings API (for linking)
  async getShopDrawings(projectId) {
    // Force demo mode if configured
    if (FORCE_DEMO_MODE) {
      console.info('🎭 Demo mode enabled - using demo shop drawings');
      return demoShopDrawings.filter(drawing => drawing.projectId === projectId);
    }
    
    try {
      const response = await this.request(`/projects/${projectId}/drawings`);
      return response.data || response;
    } catch (error) {
      // Handle both network errors and HTTP errors (like 500) as backend unavailable
      if (error.name === 'AbortError') {
        throw error; // Re-throw abort errors
      }
      console.warn('Backend unavailable (network or server error), using demo data for shop drawings:', error.message);
      return demoShopDrawings.filter(drawing => drawing.projectId === projectId);
    }
  }

  // Authentication API
  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      const data = response.data || response;
      if (data.token) {
        this.setAuthToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthToken();
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.request('/auth/me');
      return response.data || response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Search API
  async globalSearch(query, filters = {}) {
    try {
      const params = new URLSearchParams({ 
        q: query,
        ...filters 
      });
      const response = await this.request(`/search/global?${params}`);
      return response.data || response;
    } catch (error) {
      console.error('Global search error:', error);
      throw error;
    }
  }

  // Mention API
  async searchMentions(query, type = 'all') {
    try {
      const params = new URLSearchParams({ q: query, type });
      const response = await this.request(`/mentions/search?${params}`);
      return response.data || response;
    } catch (error) {
      console.error('Mention search error:', error);
      return [];
    }
  }

  // Analytics API
  async getDashboardAnalytics() {
    try {
      const response = await this.request('/analytics/dashboard');
      return response.data || response;
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      throw error;
    }
  }

  async getProjectAnalytics(projectId) {
    try {
      const response = await this.request(`/analytics/projects/${projectId}`);
      return response.data || response;
    } catch (error) {
      console.error('Project analytics error:', error);
      throw error;
    }
  }

  // Notifications API
  async getNotifications(limit = 20, offset = 0) {
    try {
      const params = new URLSearchParams({ limit, offset });
      const response = await this.request(`/notifications?${params}`);
      return response.data || response;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  async markNotificationRead(notificationId) {
    try {
      const response = await this.request(`/notifications/${notificationId}/read`, {
        method: 'POST'
      });
      return response.data || response;
    } catch (error) {
      console.error('Mark notification read error:', error);
      throw error;
    }
  }

  // Reports API
  async generateReport(reportConfig) {
    try {
      const response = await this.request('/reports/generate', {
        method: 'POST',
        body: JSON.stringify(reportConfig)
      });
      return response.data || response;
    } catch (error) {
      console.error('Generate report error:', error);
      throw error;
    }
  }

  async getReportTypes() {
    try {
      const response = await this.request('/reports/types');
      return response.data || response;
    } catch (error) {
      console.error('Get report types error:', error);
      throw error;
    }
  }

  async downloadReport(reportId) {
    try {
      const response = await this.request(`/reports/${reportId}/download`);
      return response;
    } catch (error) {
      console.error('Download report error:', error);
      throw error;
    }
  }

  // System health API
  async getSystemHealth() {
    try {
      const response = await this.request('/system/health');
      return response.data || response;
    } catch (error) {
      console.error('System health error:', error);
      throw error;
    }
  }
}

export default new ApiService();