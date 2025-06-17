/**
 * Application constants for Formula PM
 * Centralized location for all app-wide constants
 */

// Project status constants
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in-progress', 
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Task priority constants
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CO_FOUNDER: 'co-founder',
  PROJECT_MANAGER: 'project-manager',
  TEAM_MEMBER: 'team-member'
};

// Project types
export const PROJECT_TYPES = {
  RESIDENTIAL: 'residential',
  COMMERCIAL: 'commercial',
  INDUSTRIAL: 'industrial'
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// API endpoints
export const API_ENDPOINTS = {
  PROJECTS: '/api/projects',
  TASKS: '/api/tasks',
  TEAM_MEMBERS: '/api/team-members',
  CLIENTS: '/api/clients'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'formula_pm_auth_token',
  USER_PREFERENCES: 'formula_pm_user_preferences',
  VIEW_MODES: 'formula_pm_view_modes'
};