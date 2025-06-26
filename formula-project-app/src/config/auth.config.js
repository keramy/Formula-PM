// Authentication configuration
// This file contains authentication settings without hardcoded credentials

export const AUTH_CONFIG = {
  // Storage keys
  TOKEN_KEY: 'formulapm_token',
  USER_KEY: 'formulapm_user',
  
  // Token expiry
  TOKEN_EXPIRY_HOURS: 24,
  
  // API endpoints
  AUTH_ENDPOINTS: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VERIFY: '/api/auth/verify'
  },
  
  // User roles
  USER_ROLES: {
    ADMIN: 'admin',
    CO_FOUNDER: 'co_founder',
    PROJECT_MANAGER: 'project_manager',
    TEAM_MEMBER: 'team_member'
  },
  
  // Role permissions
  ROLE_PERMISSIONS: {
    admin: [
      'view_all_projects',
      'edit_all_projects',
      'delete_all_projects',
      'manage_users',
      'view_admin_dashboard',
      'export_data'
    ],
    co_founder: [
      'view_all_projects',
      'view_executive_dashboard'
    ],
    project_manager: [
      'view_assigned_projects',
      'edit_assigned_projects',
      'create_projects',
      'manage_scope',
      'manage_drawings',
      'manage_specifications',
      'view_pm_dashboard'
    ],
    team_member: [
      'view_assigned_tasks',
      'update_assigned_tasks'
    ]
  }
};

// Development mode configuration
// Demo users should be configured via environment variables or backend API
export const getDemoUsers = () => {
  if (import.meta.env.MODE !== 'development') {
    return [];
  }
  
  // In development, demo users should come from backend API
  // This is just a placeholder structure
  return [];
};

// Secure token validation
export const isTokenExpired = (token) => {
  try {
    // This should validate against backend, not decode client-side
    // Placeholder for now - actual implementation should call API
    return false;
  } catch {
    return true;
  }
};