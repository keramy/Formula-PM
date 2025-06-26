import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth/authService';
import { AUTH_CONFIG } from '../config/auth.config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export user roles from config
export const USER_ROLES = AUTH_CONFIG.USER_ROLES;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First check if we have stored credentials
      const storedUser = authService.getCurrentUser();
      
      if (storedUser) {
        // Try to verify token with backend
        try {
          const { valid, user: verifiedUser } = await authService.verifyToken();
          
          if (valid && verifiedUser) {
            setUser(verifiedUser);
          } else {
            // Token invalid, clear storage
            await authService.logout();
            setUser(null);
          }
        } catch (apiError) {
          // If API is not available, handle based on environment
          if (import.meta.env.MODE === 'development') {
            // In development, create a demo user if none exists
            const demoUser = {
              id: 'demo-user',
              name: 'Demo User',
              email: 'demo@formulapm.com',
              role: 'admin'
            };
            console.warn('Auth API not available in development, using demo user');
            setUser(storedUser || demoUser);
          } else {
            console.warn('Auth API not available, using stored user:', apiError.message);
            setUser(storedUser);
          }
        }
      } else {
        // No stored user - in development, provide demo user
        if (import.meta.env.MODE === 'development') {
          const demoUser = {
            id: 'demo-user',
            name: 'Demo User',
            email: 'demo@formulapm.com',
            role: 'admin'
          };
          console.log('No stored user in development, using demo user');
          setUser(demoUser);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null); // Ensure user is null on error
      setError('Failed to verify authentication');
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const result = await authService.login(email, password);

      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setError(null);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const result = await authService.refreshToken();
      
      if (!result.success) {
        // Token refresh failed, logout user
        await logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  }, [logout]);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    
    const permissions = AUTH_CONFIG.ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  }, [user]);

  const canAccessProject = useCallback((projectId) => {
    if (!user) return false;

    // Admin can access all projects
    if (user.role === USER_ROLES.ADMIN) return true;

    // Co-founders can view all projects (read-only)
    if (user.role === USER_ROLES.CO_FOUNDER) return true;

    // Project managers can only access assigned projects
    if (user.role === USER_ROLES.PROJECT_MANAGER) {
      return user.assignedProjects?.includes(projectId) || false;
    }

    return false;
  }, [user]);

  const canEditProject = useCallback((projectId) => {
    if (!user) return false;

    // Admin can edit all projects
    if (user.role === USER_ROLES.ADMIN) return true;

    // Co-founders cannot edit projects
    if (user.role === USER_ROLES.CO_FOUNDER) return false;

    // Project managers can edit assigned projects
    if (user.role === USER_ROLES.PROJECT_MANAGER) {
      return user.assignedProjects?.includes(projectId) || false;
    }

    return false;
  }, [user]);

  const getAccessibleProjects = useCallback((allProjects) => {
    if (!user || !allProjects) return [];

    // Admin and co-founders see all projects
    if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.CO_FOUNDER) {
      return allProjects;
    }

    // Project managers see only assigned projects
    if (user.role === USER_ROLES.PROJECT_MANAGER && user.assignedProjects) {
      return allProjects.filter(project => user.assignedProjects.includes(project.id));
    }

    return [];
  }, [user]);

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
    hasPermission,
    canAccessProject,
    canEditProject,
    getAccessibleProjects,
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};