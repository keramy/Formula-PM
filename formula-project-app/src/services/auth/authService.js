import { AUTH_CONFIG } from '../../config/auth.config';

class AuthService {
  constructor() {
    // In development, use empty baseUrl since Vite proxy handles /api routing
    // In production, use the full API URL
    this.baseUrl = import.meta.env.MODE === 'development' 
      ? '' 
      : (import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:5014');
  }

  /**
   * Login with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, user?: object, token?: string, error?: string}>}
   */
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}${AUTH_CONFIG.AUTH_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token and user data securely
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, data.token);
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(data.user));
        
        return {
          success: true,
          user: data.user,
          token: data.token
        };
      }

      return {
        success: false,
        error: data.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      
      // Call logout endpoint to invalidate token on server
      await fetch(`${this.baseUrl}${AUTH_CONFIG.AUTH_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    }
  }

  /**
   * Verify current token
   * @returns {Promise<{valid: boolean, user?: object}>}
   */
  async verifyToken() {
    try {
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      
      if (!token) {
        return { valid: false };
      }

      const response = await fetch(`${this.baseUrl}${AUTH_CONFIG.AUTH_ENDPOINTS.VERIFY}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          valid: true,
          user: data.user
        };
      }

      return { valid: false };
    } catch (error) {
      console.error('Token verification error:', error);
      return { valid: false };
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<{success: boolean, token?: string}>}
   */
  async refreshToken() {
    try {
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      
      if (!token) {
        return { success: false };
      }

      const response = await fetch(`${this.baseUrl}${AUTH_CONFIG.AUTH_ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, data.token);
        return {
          success: true,
          token: data.token
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false };
    }
  }

  /**
   * Get current user from storage
   * @returns {object|null}
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get current token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  /**
   * Check if user has permission
   * @param {string} permission 
   * @returns {boolean}
   */
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;

    const permissions = AUTH_CONFIG.ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  }

  /**
   * Check if user can access project
   * @param {string} projectId 
   * @returns {boolean}
   */
  canAccessProject(projectId) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin and Co-founder can access all projects
    if (user.role === AUTH_CONFIG.USER_ROLES.ADMIN || 
        user.role === AUTH_CONFIG.USER_ROLES.CO_FOUNDER) {
      return true;
    }

    // Project managers can access assigned projects
    if (user.role === AUTH_CONFIG.USER_ROLES.PROJECT_MANAGER) {
      return user.assignedProjects?.includes(projectId) || false;
    }

    return false;
  }
}

export default new AuthService();