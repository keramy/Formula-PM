# Formula PM - Phase 4: Frontend Integration & Real-time Features

**Duration**: 2-4 weeks  
**Priority**: High - Critical for user experience  
**Objective**: Integrate React frontend with PostgreSQL backend and implement real-time collaborative features

---

## 📋 **PHASE 4 OVERVIEW**

This phase connects the Formula PM React frontend with the new PostgreSQL backend, ensuring all 88+ existing features work seamlessly with the enterprise database. We'll also implement real-time collaborative features using Socket.IO for enhanced user experience.

### **Success Criteria**
- ✅ Frontend fully integrated with PostgreSQL backend
- ✅ All 88+ Formula PM features operational
- ✅ Real-time collaboration features implemented
- ✅ User authentication flow updated
- ✅ Performance optimizations applied
- ✅ Error handling and user feedback enhanced
- ✅ Socket.IO real-time updates operational

---

## 🗓️ **WEEK 1: API SERVICE INTEGRATION**

### **Day 1-3: API Service Refactoring**

#### **Enhanced API Service**
```javascript
// src/services/api/apiService.js
import axios from 'axios';
import { 
  getStoredToken, 
  setStoredToken, 
  removeStoredToken,
  getRefreshToken,
  setRefreshToken 
} from '../auth/tokenStorage';

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5014';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for token refresh and error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshAuthToken(refreshToken);
              setStoredToken(response.data.accessToken);
              setRefreshToken(response.data.refreshToken);
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async refreshAuthToken(refreshToken) {
    return axios.post(`${this.baseURL}/api/auth/refresh`, {
      refreshToken
    });
  }

  handleAuthFailure() {
    removeStoredToken();
    setRefreshToken(null);
    window.location.href = '/login';
  }

  // Authentication endpoints
  async login(credentials) {
    try {
      const response = await this.client.post('/api/auth/login', credentials);
      
      if (response.data.accessToken) {
        setStoredToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async logout() {
    try {
      await this.client.post('/api/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed', error);
    } finally {
      removeStoredToken();
      setRefreshToken(null);
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.client.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Project endpoints
  async getProjects(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await this.client.get(`/api/projects?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async getProject(projectId) {
    try {
      const response = await this.client.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createProject(projectData) {
    try {
      const response = await this.client.post('/api/projects', projectData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateProject(projectId, updateData) {
    try {
      const response = await this.client.put(`/api/projects/${projectId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async deleteProject(projectId) {
    try {
      const response = await this.client.delete(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Scope items endpoints
  async getScopeItems(projectId, filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await this.client.get(`/api/projects/${projectId}/scope?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createScopeItem(projectId, scopeData) {
    try {
      const response = await this.client.post(`/api/projects/${projectId}/scope`, scopeData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateScopeItem(projectId, scopeId, updateData) {
    try {
      const response = await this.client.put(`/api/projects/${projectId}/scope/${scopeId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Tasks endpoints
  async getTasks(projectId = null, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await this.client.get(`/api/tasks?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createTask(taskData) {
    try {
      const response = await this.client.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateTask(taskId, updateData) {
    try {
      const response = await this.client.put(`/api/tasks/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Team/Users endpoints
  async getTeamMembers() {
    try {
      const response = await this.client.get('/api/users');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateUser(userId, updateData) {
    try {
      const response = await this.client.put(`/api/users/${userId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Clients endpoints
  async getClients(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await this.client.get(`/api/clients?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createClient(clientData) {
    try {
      const response = await this.client.post('/api/clients', clientData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Reports endpoints
  async getReports(projectId = null, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await this.client.get(`/api/reports?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createReport(reportData) {
    try {
      const response = await this.client.post('/api/reports', reportData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateReport(reportId, updateData) {
    try {
      const response = await this.client.put(`/api/reports/${reportId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Shop Drawings endpoints
  async getShopDrawings(projectId, filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await this.client.get(`/api/projects/${projectId}/drawings?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createShopDrawing(projectId, drawingData) {
    try {
      const response = await this.client.post(`/api/projects/${projectId}/drawings`, drawingData);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Material Specifications endpoints
  async getMaterialSpecifications(projectId, filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await this.client.get(`/api/projects/${projectId}/materials?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // File upload endpoint
  async uploadFile(file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.client.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        }
      });

      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Smart mentions endpoints
  async searchEntities(query, projectId = null, entityTypes = []) {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (projectId) params.append('projectId', projectId);
      if (entityTypes.length > 0) {
        params.append('types', entityTypes.join(','));
      }

      const response = await this.client.get(`/api/mentions/search?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Dashboard analytics
  async getDashboardStats() {
    try {
      const response = await this.client.get('/api/dashboard/stats');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Error handling
  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      return {
        message: data.error || data.message || 'An error occurred',
        status,
        details: data.details || null,
        code: data.code || null
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error - please check your connection',
        status: 0,
        details: null,
        code: 'NETWORK_ERROR'
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 500,
        details: null,
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/api/health');
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;
```

#### **Token Storage Service**
```javascript
// src/services/auth/tokenStorage.js
const TOKEN_KEY = 'formula_pm_token';
const REFRESH_TOKEN_KEY = 'formula_pm_refresh_token';
const USER_KEY = 'formula_pm_user';

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to get stored token', error);
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.warn('Failed to store token', error);
  }
};

export const removeStoredToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to remove token', error);
  }
};

export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to get refresh token', error);
    return null;
  }
};

export const setRefreshToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.warn('Failed to store refresh token', error);
  }
};

export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.warn('Failed to get stored user', error);
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.warn('Failed to store user', error);
  }
};

export const clearAllStoredData = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.warn('Failed to clear stored data', error);
  }
};
```

### **Day 4-7: Context API Updates**

#### **Enhanced Auth Context**
```javascript
// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api/apiService';
import { 
  getStoredToken, 
  getStoredUser, 
  setStoredUser, 
  clearAllStoredData 
} from '../services/auth/tokenStorage';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null
      };
      
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
      
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
      
    case 'UPDATE_USER':
      const updatedUser = { ...state.user, ...action.payload };
      setStoredUser(updatedUser);
      return {
        ...state,
        user: updatedUser
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getStoredToken();
        const storedUser = getStoredUser();
        
        if (token && storedUser) {
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await apiService.getCurrentUser();
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { user: currentUser } 
            });
          } catch (error) {
            // Token invalid, clear stored data
            clearAllStoredData();
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization failed', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await apiService.login(credentials);
      
      setStoredUser(response.user);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: response 
      });
      
      return response;
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.message || 'Login failed' 
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.warn('Logout API call failed', error);
    } finally {
      clearAllStoredData();
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!state.user) return false;
    if (state.user.role === 'admin') return true; // Admin has all roles
    return state.user.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!state.user) return false;
    if (state.user.role === 'admin') return true;
    return roles.includes(state.user.role);
  };

  // Check if user can access specific project
  const canAccessProject = (projectId) => {
    if (!state.user) return false;
    
    // Admin and co-founders can access all projects
    if (['admin', 'co_founder'].includes(state.user.role)) {
      return true;
    }
    
    // Project managers can only access assigned projects
    // This would need project data to verify
    return true; // Simplified for now
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    hasRole,
    hasAnyRole,
    canAccessProject
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
```

#### **Enhanced Data Context**
```javascript
// src/context/DataContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import apiService from '../services/api/apiService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

// Data reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
      
    case 'SET_DATA':
      return {
        ...state,
        [action.payload.key]: action.payload.data,
        loading: {
          ...state.loading,
          [action.payload.key]: false
        },
        errors: {
          ...state.errors,
          [action.payload.key]: null
        }
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: false
        },
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error
        }
      };
      
    case 'ADD_ITEM':
      return {
        ...state,
        [action.payload.key]: [
          ...state[action.payload.key],
          action.payload.item
        ]
      };
      
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.payload.key]: state[action.payload.key].map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        )
      };
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        [action.payload.key]: state[action.payload.key].filter(
          item => item.id !== action.payload.id
        )
      };
      
    case 'CLEAR_DATA':
      return {
        ...state,
        [action.payload.key]: [],
        loading: {
          ...state.loading,
          [action.payload.key]: false
        },
        errors: {
          ...state.errors,
          [action.payload.key]: null
        }
      };
      
    default:
      return state;
  }
};

// Initial state
const initialState = {
  projects: [],
  tasks: [],
  teamMembers: [],
  clients: [],
  currentProject: null,
  scopeItems: [],
  shopDrawings: [],
  materialSpecifications: [],
  reports: [],
  dashboardStats: null,
  loading: {
    projects: false,
    tasks: false,
    teamMembers: false,
    clients: false,
    currentProject: false,
    scopeItems: false,
    shopDrawings: false,
    materialSpecifications: false,
    reports: false,
    dashboardStats: false
  },
  errors: {
    projects: null,
    tasks: null,
    teamMembers: null,
    clients: null,
    currentProject: null,
    scopeItems: null,
    shopDrawings: null,
    materialSpecifications: null,
    reports: null,
    dashboardStats: null
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Generic fetch function
  const fetchData = useCallback(async (key, apiCall, params = {}) => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: { key, value: true } });
      const data = await apiCall(params);
      dispatch({ type: 'SET_DATA', payload: { key, data } });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { key, error: error.message } });
      throw error;
    }
  }, [isAuthenticated]);

  // Projects
  const fetchProjects = useCallback((filters = {}) => {
    return fetchData('projects', () => apiService.getProjects(filters));
  }, [fetchData]);

  const fetchProject = useCallback((projectId) => {
    return fetchData('currentProject', () => apiService.getProject(projectId));
  }, [fetchData]);

  const createProject = useCallback(async (projectData) => {
    try {
      const newProject = await apiService.createProject(projectData);
      dispatch({ type: 'ADD_ITEM', payload: { key: 'projects', item: newProject } });
      return newProject;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateProject = useCallback(async (projectId, updateData) => {
    try {
      const updatedProject = await apiService.updateProject(projectId, updateData);
      dispatch({ 
        type: 'UPDATE_ITEM', 
        payload: { key: 'projects', id: projectId, updates: updatedProject } 
      });
      
      // Update current project if it's the same
      if (state.currentProject?.id === projectId) {
        dispatch({ 
          type: 'SET_DATA', 
          payload: { key: 'currentProject', data: updatedProject } 
        });
      }
      
      return updatedProject;
    } catch (error) {
      throw error;
    }
  }, [state.currentProject]);

  // Tasks
  const fetchTasks = useCallback((projectId = null, filters = {}) => {
    return fetchData('tasks', () => apiService.getTasks(projectId, filters));
  }, [fetchData]);

  const createTask = useCallback(async (taskData) => {
    try {
      const newTask = await apiService.createTask(taskData);
      dispatch({ type: 'ADD_ITEM', payload: { key: 'tasks', item: newTask } });
      return newTask;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      const updatedTask = await apiService.updateTask(taskId, updateData);
      dispatch({ 
        type: 'UPDATE_ITEM', 
        payload: { key: 'tasks', id: taskId, updates: updatedTask } 
      });
      return updatedTask;
    } catch (error) {
      throw error;
    }
  }, []);

  // Team Members
  const fetchTeamMembers = useCallback(() => {
    return fetchData('teamMembers', () => apiService.getTeamMembers());
  }, [fetchData]);

  // Clients
  const fetchClients = useCallback((filters = {}) => {
    return fetchData('clients', () => apiService.getClients(filters));
  }, [fetchData]);

  const createClient = useCallback(async (clientData) => {
    try {
      const newClient = await apiService.createClient(clientData);
      dispatch({ type: 'ADD_ITEM', payload: { key: 'clients', item: newClient } });
      return newClient;
    } catch (error) {
      throw error;
    }
  }, []);

  // Scope Items
  const fetchScopeItems = useCallback((projectId, filters = {}) => {
    return fetchData('scopeItems', () => apiService.getScopeItems(projectId, filters));
  }, [fetchData]);

  const createScopeItem = useCallback(async (projectId, scopeData) => {
    try {
      const newScopeItem = await apiService.createScopeItem(projectId, scopeData);
      dispatch({ type: 'ADD_ITEM', payload: { key: 'scopeItems', item: newScopeItem } });
      return newScopeItem;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateScopeItem = useCallback(async (projectId, scopeId, updateData) => {
    try {
      const updatedScopeItem = await apiService.updateScopeItem(projectId, scopeId, updateData);
      dispatch({ 
        type: 'UPDATE_ITEM', 
        payload: { key: 'scopeItems', id: scopeId, updates: updatedScopeItem } 
      });
      return updatedScopeItem;
    } catch (error) {
      throw error;
    }
  }, []);

  // Shop Drawings
  const fetchShopDrawings = useCallback((projectId, filters = {}) => {
    return fetchData('shopDrawings', () => apiService.getShopDrawings(projectId, filters));
  }, [fetchData]);

  // Material Specifications
  const fetchMaterialSpecifications = useCallback((projectId, filters = {}) => {
    return fetchData('materialSpecifications', () => apiService.getMaterialSpecifications(projectId, filters));
  }, [fetchData]);

  // Reports
  const fetchReports = useCallback((projectId = null, filters = {}) => {
    return fetchData('reports', () => apiService.getReports(projectId, filters));
  }, [fetchData]);

  const createReport = useCallback(async (reportData) => {
    try {
      const newReport = await apiService.createReport(reportData);
      dispatch({ type: 'ADD_ITEM', payload: { key: 'reports', item: newReport } });
      return newReport;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateReport = useCallback(async (reportId, updateData) => {
    try {
      const updatedReport = await apiService.updateReport(reportId, updateData);
      dispatch({ 
        type: 'UPDATE_ITEM', 
        payload: { key: 'reports', id: reportId, updates: updatedReport } 
      });
      return updatedReport;
    } catch (error) {
      throw error;
    }
  }, []);

  // Dashboard
  const fetchDashboardStats = useCallback(() => {
    return fetchData('dashboardStats', () => apiService.getDashboardStats());
  }, [fetchData]);

  // Clear data function
  const clearData = useCallback((key) => {
    dispatch({ type: 'CLEAR_DATA', payload: { key } });
  }, []);

  const value = {
    ...state,
    // Projects
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    // Tasks
    fetchTasks,
    createTask,
    updateTask,
    // Team
    fetchTeamMembers,
    // Clients
    fetchClients,
    createClient,
    // Scope
    fetchScopeItems,
    createScopeItem,
    updateScopeItem,
    // Shop Drawings
    fetchShopDrawings,
    // Materials
    fetchMaterialSpecifications,
    // Reports
    fetchReports,
    createReport,
    updateReport,
    // Dashboard
    fetchDashboardStats,
    // Utility
    clearData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
```

---

## 🗓️ **WEEK 2: REAL-TIME FEATURES IMPLEMENTATION**

### **Day 1-4: Socket.IO Integration**

#### **Socket Service**
```javascript
// src/services/realtime/socketService.js
import io from 'socket.io-client';
import { getStoredToken } from '../auth/tokenStorage';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.eventHandlers = new Map();
  }

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const token = getStoredToken();
    if (!token) {
      console.warn('No auth token available for socket connection');
      return null;
    }

    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5014', {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventHandlers();
    return this.socket;
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to Formula PM real-time server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('user:online');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from real-time server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('auth_error', (error) => {
      console.error('❌ Socket authentication error:', error);
      this.disconnect();
      // Trigger re-authentication flow
      window.location.href = '/login';
    });

    // Formula PM specific events
    this.socket.on('project:updated', (data) => {
      this.handleEvent('project:updated', data);
    });

    this.socket.on('task:created', (data) => {
      this.handleEvent('task:created', data);
    });

    this.socket.on('task:updated', (data) => {
      this.handleEvent('task:updated', data);
    });

    this.socket.on('scope:updated', (data) => {
      this.handleEvent('scope:updated', data);
    });

    this.socket.on('user:joined_project', (data) => {
      this.handleEvent('user:joined_project', data);
    });

    this.socket.on('user:left_project', (data) => {
      this.handleEvent('user:left_project', data);
    });

    this.socket.on('notification:new', (data) => {
      this.handleEvent('notification:new', data);
    });

    this.socket.on('report:updated', (data) => {
      this.handleEvent('report:updated', data);
    });
  }

  handleEvent(eventType, data) {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    });
  }

  // Event subscription
  on(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType).push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  // Event emission
  emit(eventType, data = {}) {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventType, data);
    } else {
      console.warn(`Cannot emit ${eventType}: Socket not connected`);
    }
  }

  // Project-specific methods
  joinProject(projectId) {
    this.emit('project:join', { projectId });
  }

  leaveProject(projectId) {
    this.emit('project:leave', { projectId });
  }

  // Task real-time updates
  notifyTaskUpdate(taskId, updates) {
    this.emit('task:update', { taskId, updates });
  }

  notifyTaskCreated(task) {
    this.emit('task:created', { task });
  }

  // Scope real-time updates
  notifyScopeUpdate(scopeId, updates) {
    this.emit('scope:update', { scopeId, updates });
  }

  // User presence
  setUserStatus(status) {
    this.emit('user:status', { status });
  }

  // Typing indicators (for future chat features)
  startTyping(context) {
    this.emit('typing:start', context);
  }

  stopTyping(context) {
    this.emit('typing:stop', context);
  }

  disconnect() {
    if (this.socket) {
      this.emit('user:offline');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventHandlers.clear();
    }
  }

  // Connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id
    };
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;
```

#### **Real-time Context Provider**
```javascript
// src/context/RealtimeContext.js
import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import socketService from '../services/realtime/socketService';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { NotificationService } from '../services/notifications/notificationService';

const RealtimeContext = createContext();

export const RealtimeProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { updateTask, updateProject, updateScopeItem } = useData();
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    reconnectAttempts: 0
  });
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = socketService.connect();
      
      if (socket) {
        // Update connection status
        const updateStatus = () => {
          setConnectionStatus(socketService.getConnectionStatus());
        };

        socket.on('connect', updateStatus);
        socket.on('disconnect', updateStatus);
        socket.on('connect_error', updateStatus);

        updateStatus();
      }

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Set up event handlers
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribers = [];

    // Project updates
    unsubscribers.push(
      socketService.on('project:updated', (data) => {
        console.log('📊 Project updated via real-time:', data);
        updateProject(data.projectId, data.updates);
        
        NotificationService.showNotification({
          type: 'info',
          title: 'Project Updated',
          message: `${data.updates.name || 'Project'} has been updated`,
          duration: 3000
        });
      })
    );

    // Task updates
    unsubscribers.push(
      socketService.on('task:created', (data) => {
        console.log('✅ Task created via real-time:', data);
        // The DataContext will handle adding the new task
        
        NotificationService.showNotification({
          type: 'success',
          title: 'New Task',
          message: `New task "${data.task.title}" was created`,
          duration: 3000
        });
      })
    );

    unsubscribers.push(
      socketService.on('task:updated', (data) => {
        console.log('📝 Task updated via real-time:', data);
        updateTask(data.taskId, data.updates);
        
        if (data.updates.status === 'completed') {
          NotificationService.showNotification({
            type: 'success',
            title: 'Task Completed',
            message: `Task "${data.updates.title || 'Task'}" was completed`,
            duration: 4000
          });
        }
      })
    );

    // Scope updates
    unsubscribers.push(
      socketService.on('scope:updated', (data) => {
        console.log('🔧 Scope updated via real-time:', data);
        updateScopeItem(currentProject, data.scopeId, data.updates);
      })
    );

    // User presence
    unsubscribers.push(
      socketService.on('user:joined_project', (data) => {
        console.log('👋 User joined project:', data);
        setActiveUsers(prev => {
          const exists = prev.find(u => u.id === data.user.id);
          if (exists) return prev;
          return [...prev, data.user];
        });
      })
    );

    unsubscribers.push(
      socketService.on('user:left_project', (data) => {
        console.log('👋 User left project:', data);
        setActiveUsers(prev => prev.filter(u => u.id !== data.userId));
      })
    );

    // Notifications
    unsubscribers.push(
      socketService.on('notification:new', (data) => {
        console.log('🔔 New notification:', data);
        NotificationService.showNotification({
          type: data.type || 'info',
          title: data.title,
          message: data.message,
          duration: data.duration || 5000
        });
      })
    );

    // Report updates
    unsubscribers.push(
      socketService.on('report:updated', (data) => {
        console.log('📋 Report updated via real-time:', data);
        // Handle report updates if needed
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [isAuthenticated, updateTask, updateProject, updateScopeItem, currentProject]);

  // Join project room
  const joinProject = useCallback((projectId) => {
    if (currentProject !== projectId) {
      if (currentProject) {
        socketService.leaveProject(currentProject);
      }
      
      socketService.joinProject(projectId);
      setCurrentProject(projectId);
      setActiveUsers([]); // Reset active users for new project
    }
  }, [currentProject]);

  // Leave project room
  const leaveProject = useCallback(() => {
    if (currentProject) {
      socketService.leaveProject(currentProject);
      setCurrentProject(null);
      setActiveUsers([]);
    }
  }, [currentProject]);

  // Emit task update
  const notifyTaskUpdate = useCallback((taskId, updates) => {
    socketService.notifyTaskUpdate(taskId, updates);
  }, []);

  // Emit scope update
  const notifyScopeUpdate = useCallback((scopeId, updates) => {
    socketService.notifyScopeUpdate(scopeId, updates);
  }, []);

  // Set user status
  const setUserStatus = useCallback((status) => {
    socketService.setUserStatus(status);
  }, []);

  const value = {
    connectionStatus,
    activeUsers,
    currentProject,
    joinProject,
    leaveProject,
    notifyTaskUpdate,
    notifyScopeUpdate,
    setUserStatus
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export default RealtimeContext;
```

### **Day 5-7: Component Integration**

#### **Enhanced Task Form with Real-time**
```javascript
// src/features/tasks/components/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

import { useData } from '../../../context/DataContext';
import { useRealtime } from '../../../context/RealtimeContext';
import SmartTextEditor from '../../../components/editors/SmartTextEditor';

const TaskForm = ({ 
  open, 
  onClose, 
  projectId, 
  task = null, 
  onSuccess 
}) => {
  const { 
    createTask, 
    updateTask, 
    teamMembers, 
    fetchTeamMembers,
    loading 
  } = useData();
  
  const { notifyTaskUpdate } = useRealtime();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status: 'todo',
    priority: 'medium',
    type: 'general',
    due_date: null,
    estimated_hours: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assigned_to: task.assigned_to || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        type: task.type || 'general',
        due_date: task.due_date ? new Date(task.due_date) : null,
        estimated_hours: task.estimated_hours || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        status: 'todo',
        priority: 'medium',
        type: 'general',
        due_date: null,
        estimated_hours: ''
      });
    }
  }, [task, open]);

  // Fetch team members if not loaded
  useEffect(() => {
    if (open && teamMembers.length === 0) {
      fetchTeamMembers();
    }
  }, [open, teamMembers.length, fetchTeamMembers]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!projectId) {
      newErrors.project = 'Project is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...formData,
        project_id: projectId,
        due_date: formData.due_date ? 
          format(formData.due_date, 'yyyy-MM-dd') : null,
        estimated_hours: formData.estimated_hours ? 
          parseInt(formData.estimated_hours) : null
      };
      
      let result;
      if (task) {
        // Update existing task
        result = await updateTask(task.id, taskData);
        
        // Notify real-time update
        notifyTaskUpdate(task.id, result);
      } else {
        // Create new task
        result = await createTask(taskData);
      }
      
      onSuccess?.(result);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        status: 'todo',
        priority: 'medium',
        type: 'general',
        due_date: null,
        estimated_hours: ''
      });
      
    } catch (error) {
      console.error('Task submission failed:', error);
      setErrors({ 
        submit: error.message || 'Failed to save task' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: '#666' },
    { value: 'in_progress', label: 'In Progress', color: '#1976d2' },
    { value: 'review', label: 'Review', color: '#f57c00' },
    { value: 'completed', label: 'Completed', color: '#388e3c' },
    { value: 'cancelled', label: 'Cancelled', color: '#d32f2f' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#4caf50' },
    { value: 'medium', label: 'Medium', color: '#ff9800' },
    { value: 'high', label: 'High', color: '#f44336' },
    { value: 'urgent', label: 'Urgent', color: '#9c27b0' }
  ];

  const typeOptions = [
    { value: 'general', label: 'General' },
    { value: 'design', label: 'Design' },
    { value: 'construction', label: 'Construction' },
    { value: 'approval', label: 'Approval' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'meeting', label: 'Meeting' }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {task ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Title */}
            <TextField
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
              autoFocus
            />
            
            {/* Description with Smart Text Editor */}
            <Box>
              <InputLabel sx={{ mb: 1, fontSize: 14, color: 'text.secondary' }}>
                Description
              </InputLabel>
              <SmartTextEditor
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                placeholder="Enter task description... Use @ to mention team members, projects, or other entities"
                projectId={projectId}
                style={{
                  minHeight: 120,
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  padding: 12
                }}
              />
            </Box>
            
            {/* Assignment and Status Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={formData.assigned_to}
                  onChange={(e) => handleChange('assigned_to', e.target.value)}
                  label="Assigned To"
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {teamMembers.map(member => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.first_name} {member.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  label="Status"
                  renderValue={(value) => {
                    const option = statusOptions.find(opt => opt.value === value);
                    return (
                      <Chip
                        label={option?.label}
                        size="small"
                        sx={{ 
                          backgroundColor: option?.color + '20',
                          color: option?.color,
                          fontWeight: 500
                        }}
                      />
                    );
                  }}
                >
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip
                        label={option.label}
                        size="small"
                        sx={{ 
                          backgroundColor: option.color + '20',
                          color: option.color,
                          fontWeight: 500
                        }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Priority and Type Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  label="Priority"
                  renderValue={(value) => {
                    const option = priorityOptions.find(opt => opt.value === value);
                    return (
                      <Chip
                        label={option?.label}
                        size="small"
                        sx={{ 
                          backgroundColor: option?.color + '20',
                          color: option?.color,
                          fontWeight: 500
                        }}
                      />
                    );
                  }}
                >
                  {priorityOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip
                        label={option.label}
                        size="small"
                        sx={{ 
                          backgroundColor: option.color + '20',
                          color: option.color,
                          fontWeight: 500
                        }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  label="Type"
                >
                  {typeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Due Date and Estimated Hours Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={formData.due_date}
                  onChange={(date) => handleChange('due_date', date)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                />
              </LocalizationProvider>
              
              <TextField
                label="Estimated Hours"
                type="number"
                value={formData.estimated_hours}
                onChange={(e) => handleChange('estimated_hours', e.target.value)}
                fullWidth
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || loading.tasks}
            startIcon={isSubmitting && <CircularProgress size={16} />}
          >
            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
```

---

## 🗓️ **WEEK 3-4: PERFORMANCE & USER EXPERIENCE**

### **Error Handling & Loading States**
```javascript
// src/components/common/ErrorBoundary.jsx
import React from 'react';
import { Alert, Button, Box, Typography } from '@mui/material';
import { RefreshRounded as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Add error logging service here
      console.error('Production error:', { error, errorInfo });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          p: 3, 
          textAlign: 'center',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Alert 
            severity="error" 
            sx={{ mb: 3, maxWidth: 600 }}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  size="small"
                  onClick={this.handleReset}
                >
                  Try Again
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  onClick={this.handleReload}
                  startIcon={<RefreshIcon />}
                >
                  Reload Page
                </Button>
              </Box>
            }
          >
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2">
              An unexpected error occurred. Please try again or reload the page.
            </Typography>
            {process.env.NODE_ENV === 'development' && (
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1, 
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}
              >
                {this.state.error?.message}
              </Typography>
            )}
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### **Performance Monitoring Hook**
```javascript
// src/hooks/usePerformanceMonitor.js
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName) => {
  const startTime = useRef(Date.now());
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const mountTime = Date.now() - startTime.current;
      
      // Log slow components in development
      if (process.env.NODE_ENV === 'development' && mountTime > 100) {
        console.warn(`🐌 Slow component mount: ${componentName} took ${mountTime}ms`);
      }
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production' && mountTime > 500) {
        // Add analytics tracking here
        console.log(`Performance: ${componentName} mount time: ${mountTime}ms`);
      }
    }

    return () => {
      if (mounted.current) {
        const unmountTime = Date.now();
        // Track component lifecycle if needed
      }
    };
  }, [componentName]);

  const measureOperation = (operationName, operation) => {
    return async (...args) => {
      const start = Date.now();
      try {
        const result = await operation(...args);
        const duration = Date.now() - start;
        
        if (duration > 1000) {
          console.warn(`🐌 Slow operation: ${operationName} took ${duration}ms`);
        }
        
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        console.error(`❌ Operation failed: ${operationName} after ${duration}ms:`, error);
        throw error;
      }
    };
  };

  return { measureOperation };
};
```

---

## 🎯 **PHASE 4 COMPLETION CRITERIA**

### **Frontend Integration Success**
- ✅ **API Integration**: All endpoints working with PostgreSQL backend
- ✅ **Authentication Flow**: JWT-based login/logout operational
- ✅ **Data Synchronization**: Real-time updates via Socket.IO
- ✅ **Error Handling**: Comprehensive error boundaries and user feedback
- ✅ **Performance**: Page load times < 3 seconds
- ✅ **User Experience**: Smooth transitions and loading states

### **Real-time Features Implemented**
- ✅ **Task Updates**: Real-time task creation and status changes
- ✅ **Project Collaboration**: Live project updates
- ✅ **User Presence**: Active user indicators
- ✅ **Notifications**: Real-time notification system
- ✅ **Scope Updates**: Live scope item progress tracking

### **Feature Validation**
- ✅ **All 88+ Features**: Complete feature compatibility verified
- ✅ **Smart @ Mentions**: Entity autocomplete with database
- ✅ **Reports Module**: Line-by-line editing with PostgreSQL
- ✅ **Dashboard Analytics**: Real-time metrics and statistics
- ✅ **User Management**: Role-based access control operational

### **Technical Quality**
- ✅ **Code Splitting**: Optimized bundle loading
- ✅ **Error Recovery**: Graceful error handling and recovery
- ✅ **Performance Monitoring**: Real-time performance tracking
- ✅ **Browser Compatibility**: Cross-browser functionality

---

## 🚀 **NEXT STEPS: PHASE 5 PREPARATION**

With Phase 4 complete, Formula PM will have:
- Frontend fully integrated with PostgreSQL backend
- Real-time collaborative features operational
- All existing features working with enterprise database
- Enhanced user experience with performance optimizations

**Phase 5 will focus on:**
- Comprehensive testing and quality assurance
- Performance benchmarking and optimization
- Security testing and validation
- Production deployment preparation

The seamless frontend integration completed in Phase 4 ensures Phase 5 testing can validate the complete end-to-end user experience with confidence in both functionality and performance.