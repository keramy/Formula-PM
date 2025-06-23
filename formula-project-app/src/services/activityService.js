/**
 * Activity Service - Handles logging and retrieval of user activities
 * Integrates with the activity feed system for real-time updates
 */

import { generateUniqueId } from '../utils/generators/idGenerator';

class ActivityService {
  constructor() {
    this.activities = [];
    this.storageKey = 'formula_pm_activities';
    this.loadActivities();
  }

  /**
   * Load activities from localStorage
   */
  loadActivities() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.activities = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading activities from localStorage:', error);
      this.activities = [];
    }
  }

  /**
   * Save activities to localStorage
   */
  saveActivities() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.activities));
    } catch (error) {
      console.error('Error saving activities to localStorage:', error);
    }
  }

  /**
   * Log a new activity
   */
  async logActivity({
    type,
    action,
    description,
    userName,
    metadata = {}
  }) {
    const activity = {
      id: generateUniqueId('ACT'),
      type,
      action,
      description,
      userName,
      timestamp: new Date().toISOString(),
      metadata
    };

    // Add to the beginning of the array for most recent first
    this.activities.unshift(activity);

    // Keep only the most recent 500 activities to prevent storage bloat
    if (this.activities.length > 500) {
      this.activities = this.activities.slice(0, 500);
    }

    // Save to localStorage
    this.saveActivities();

    // In a real application, this would also send to the backend API
    // For now, we'll trigger a custom event for real-time updates
    this.broadcastActivity(activity);

    return activity;
  }

  /**
   * Broadcast activity for real-time updates
   */
  broadcastActivity(activity) {
    // Dispatch custom event for components listening to activity updates
    window.dispatchEvent(new CustomEvent('newActivity', {
      detail: activity
    }));
  }

  /**
   * Get all activities
   */
  getActivities(limit = 50) {
    return this.activities.slice(0, limit);
  }

  /**
   * Get activities for a specific project
   */
  getProjectActivities(projectId, limit = 50) {
    return this.activities
      .filter(activity => activity.metadata?.projectId === projectId)
      .slice(0, limit);
  }

  /**
   * Get activities by type
   */
  getActivitiesByType(type, limit = 50) {
    return this.activities
      .filter(activity => activity.type === type)
      .slice(0, limit);
  }

  /**
   * Log report creation activity
   */
  async logReportCreated({
    reportId,
    reportTitle,
    reportNumber,
    projectId,
    projectName,
    userName
  }) {
    const description = projectName 
      ? `Report "${reportTitle}" created in project "${projectName}"`
      : `Report "${reportTitle}" created`;

    return this.logActivity({
      type: 'report',
      action: 'created',
      description,
      userName,
      metadata: {
        projectId,
        reportId,
        reportTitle,
        reportNumber,
        projectName,
        targetTab: 'reports'
      }
    });
  }

  /**
   * Log report export activity
   */
  async logReportExported({
    reportId,
    reportTitle,
    projectId,
    projectName,
    userName,
    exportFormat = 'PDF',
    pageSize,
    filename
  }) {
    const description = projectName
      ? `Report "${reportTitle}" exported as ${exportFormat} from project "${projectName}"`
      : `Report "${reportTitle}" exported as ${exportFormat}`;

    return this.logActivity({
      type: 'report',
      action: 'exported',
      description,
      userName,
      metadata: {
        projectId,
        reportId,
        reportTitle,
        projectName,
        exportFormat,
        pageSize,
        filename,
        targetTab: 'reports'
      }
    });
  }

  /**
   * Log report publishing activity
   */
  async logReportPublished({
    reportId,
    reportTitle,
    projectId,
    projectName,
    userName,
    visibility,
    publishOptions
  }) {
    const visibilityText = visibility === 'public' ? 'public' : 
                          visibility === 'private' ? 'private' : 'team';
    
    const description = projectName
      ? `Report "${reportTitle}" published with ${visibilityText} visibility in project "${projectName}"`
      : `Report "${reportTitle}" published with ${visibilityText} visibility`;

    return this.logActivity({
      type: 'report',
      action: 'published',
      description,
      userName,
      metadata: {
        projectId,
        reportId,
        reportTitle,
        projectName,
        visibility,
        publishOptions,
        publishedAt: new Date().toISOString(),
        targetTab: 'reports'
      }
    });
  }

  /**
   * Clear all activities (for testing/reset purposes)
   */
  clearActivities() {
    this.activities = [];
    this.saveActivities();
  }
}

// Create and export singleton instance
const activityService = new ActivityService();
export default activityService;