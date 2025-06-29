import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Button,
  Chip,
  Avatar,
  Paper,
  Alert
} from '@mui/material';
import {
  Bell as NotificationsIcon,
  Check as TaskIcon,
  Folder as ProjectIcon,
  Calendar as DueDateIcon,
  WarningTriangle as OverdueIcon,
  CheckCircle as CompletedIcon,
  User as PersonIcon,
  Xmark as CloseIcon,
  Settings as SettingsIcon
} from 'iconoir-react';
import { format, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';

// Notification Types
const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  TASK_REASSIGNED: 'TASK_REASSIGNED',
  PROJECT_ASSIGNED: 'PROJECT_ASSIGNED',
  PROJECT_STATUS_CHANGED: 'PROJECT_STATUS_CHANGED',
  DUE_DATE_REMINDER: 'DUE_DATE_REMINDER',
  OVERDUE_ALERT: 'OVERDUE_ALERT',
  SCOPE_ITEM_UPDATED: 'SCOPE_ITEM_UPDATED',
  SHOP_DRAWING_APPROVED: 'SHOP_DRAWING_APPROVED',
  MATERIAL_SPEC_APPROVED: 'MATERIAL_SPEC_APPROVED',
  PRODUCTION_READY: 'PRODUCTION_READY',
  TEST: 'TEST'
};

class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = new Set();
    this.settings = this.loadSettings();
    this.checkInterval = null;
    this.teamMembers = [];
    this.projects = [];
    this.tasks = [];
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('notificationSettings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
    
    return {
      taskChecks: true,
      projectChecks: true,
      dueDateReminders: true,
      overdueAlerts: true,
      taskCompletions: true,
      projectStatusChanges: true,
      browserNotifications: true,
      emailNotifications: false,
      scopeUpdates: true,
      approvalNotifications: true,
      productionAlerts: true
    };
  }

  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
  }

  init(teamMembers = [], projects = [], tasks = []) {
    this.teamMembers = teamMembers;
    this.projects = projects;
    this.tasks = tasks;
    
    // Request browser notification permission
    if (this.settings.browserNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    // Start periodic checks for due dates and overdue items
    this.startPeriodicChecks();
    
    // Notification service initialized
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.listeners.clear();
    // Notification service destroyed
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener([...this.notifications]);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  createNotification(type, data) {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      ...data,
      timestamp: new Date().toISOString(),
      read: false,
      dismissed: false
    };

    this.notifications.unshift(notification);
    this.notifyListeners();

    // Show browser notification if enabled
    if (this.settings.browserNotifications) {
      this.showBrowserNotification(notification);
    }

    // Auto-cleanup old notifications (keep last 50)
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    return notification;
  }

  showBrowserNotification(notification) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const { title, message, icon } = this.formatNotificationForBrowser(notification);
    
    try {
      const browserNotification = new Notification(title, {
        body: message,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: notification.priority === 'high'
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        // Could add navigation logic here
      };

      // Auto-close after 5 seconds for non-critical notifications
      if (notification.priority !== 'high') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  }

  formatNotificationForBrowser(notification) {
    switch (notification.type) {
      case NOTIFICATION_TYPES.TASK_ASSIGNED:
        return {
          title: '📋 New Task Check',
          message: `"${notification.taskName}" assigned to ${notification.assigneeName}`,
          icon: '📋'
        };
      case NOTIFICATION_TYPES.TASK_COMPLETED:
        return {
          title: '✅ Task Completed',
          message: `"${notification.taskName}" has been completed`,
          icon: '✅'
        };
      case NOTIFICATION_TYPES.PROJECT_ASSIGNED:
        return {
          title: '📁 New Project Check',
          message: `Project "${notification.projectName}" assigned to ${notification.assigneeName}`,
          icon: '📁'
        };
      case NOTIFICATION_TYPES.DUE_DATE_REMINDER:
        return {
          title: '⏰ Due Date Reminder',
          message: `"${notification.taskName}" is due in ${notification.daysUntilDue} day(s)`,
          icon: '⏰'
        };
      case NOTIFICATION_TYPES.OVERDUE_ALERT:
        return {
          title: '🚨 Overdue Alert',
          message: `"${notification.taskName}" is ${notification.daysOverdue} day(s) overdue`,
          icon: '🚨'
        };
      default:
        return {
          title: 'Formula PM Notification',
          message: notification.message || 'You have a new notification',
          icon: '🔔'
        };
    }
  }

  // Notification Methods
  notifyTaskCheck(task, project, assignee, assignedBy) {
    if (!this.settings.taskChecks) return;

    return this.createNotification(NOTIFICATION_TYPES.TASK_ASSIGNED, {
      title: 'New Task Check',
      message: `New task "${task.name}" has been assigned to ${assignee.fullName}`,
      taskId: task.id,
      taskName: task.name,
      projectId: project.id,
      projectName: project.name,
      assigneeId: assignee.id,
      assigneeName: assignee.fullName,
      assignedById: assignedBy?.id,
      assignedByName: assignedBy?.fullName,
      priority: task.priority === 'urgent' ? 'high' : 'medium',
      actions: [
        { label: 'View Task', action: 'VIEW_TASK', taskId: task.id },
        { label: 'View Project', action: 'VIEW_PROJECT', projectId: project.id }
      ]
    });
  }

  notifyTaskCompleted(task, project, assignee) {
    if (!this.settings.taskCompletions) return;

    return this.createNotification(NOTIFICATION_TYPES.TASK_COMPLETED, {
      title: 'Task Completed',
      message: `Task "${task.name}" has been completed by ${assignee.fullName}`,
      taskId: task.id,
      taskName: task.name,
      projectId: project.id,
      projectName: project.name,
      assigneeId: assignee.id,
      assigneeName: assignee.fullName,
      priority: 'medium',
      actions: [
        { label: 'View Task', action: 'VIEW_TASK', taskId: task.id },
        { label: 'View Project', action: 'VIEW_PROJECT', projectId: project.id }
      ]
    });
  }

  notifyProjectCheck(project, assignee, assignedBy) {
    if (!this.settings.projectChecks) return;

    return this.createNotification(NOTIFICATION_TYPES.PROJECT_ASSIGNED, {
      title: 'New Project Check',
      message: `Project "${project.name}" has been assigned to ${assignee.fullName}`,
      projectId: project.id,
      projectName: project.name,
      assigneeId: assignee.id,
      assigneeName: assignee.fullName,
      assignedById: assignedBy?.id,
      assignedByName: assignedBy?.fullName,
      priority: 'high',
      actions: [
        { label: 'View Project', action: 'VIEW_PROJECT', projectId: project.id }
      ]
    });
  }

  notifyProjectStatusChange(project, oldStatus, newStatus, changedBy) {
    if (!this.settings.projectStatusChanges) return;

    return this.createNotification(NOTIFICATION_TYPES.PROJECT_STATUS_CHANGED, {
      title: 'Project Status Changed',
      message: `Project "${project.name}" status changed from ${oldStatus} to ${newStatus}`,
      projectId: project.id,
      projectName: project.name,
      oldStatus,
      newStatus,
      changedById: changedBy?.id,
      changedByName: changedBy?.fullName,
      priority: newStatus === 'completed' ? 'high' : 'medium',
      actions: [
        { label: 'View Project', action: 'VIEW_PROJECT', projectId: project.id }
      ]
    });
  }

  notifyDueDateReminder(task, daysUntilDue) {
    if (!this.settings.dueDateReminders) return;

    return this.createNotification(NOTIFICATION_TYPES.DUE_DATE_REMINDER, {
      title: 'Due Date Reminder',
      message: `Task "${task.name}" is due in ${daysUntilDue} day(s)`,
      taskId: task.id,
      taskName: task.name,
      daysUntilDue,
      dueDate: task.dueDate,
      priority: daysUntilDue <= 1 ? 'high' : 'medium',
      actions: [
        { label: 'View Task', action: 'VIEW_TASK', taskId: task.id }
      ]
    });
  }

  notifyOverdueAlert(task, daysOverdue) {
    if (!this.settings.overdueAlerts) return;

    return this.createNotification(NOTIFICATION_TYPES.OVERDUE_ALERT, {
      title: 'Overdue Alert',
      message: `Task "${task.name}" is ${daysOverdue} day(s) overdue`,
      taskId: task.id,
      taskName: task.name,
      daysOverdue,
      dueDate: task.dueDate,
      priority: 'high',
      actions: [
        { label: 'View Task', action: 'VIEW_TASK', taskId: task.id },
        { label: 'Update Due Date', action: 'UPDATE_DUE_DATE', taskId: task.id }
      ]
    });
  }

  notifyScopeItemUpdated(scopeItem, project, updatedBy) {
    if (!this.settings.scopeUpdates) return;

    return this.createNotification(NOTIFICATION_TYPES.SCOPE_ITEM_UPDATED, {
      title: 'Scope Item Updated',
      message: `Scope item "${scopeItem.description}" has been updated in project "${project.name}"`,
      scopeItemId: scopeItem.id,
      projectId: project.id,
      projectName: project.name,
      updatedById: updatedBy?.id,
      updatedByName: updatedBy?.fullName,
      priority: 'medium',
      actions: [
        { label: 'View Scope', action: 'VIEW_SCOPE', projectId: project.id }
      ]
    });
  }

  notifyShopDrawingApproved(drawing, project) {
    if (!this.settings.approvalNotifications) return;

    return this.createNotification(NOTIFICATION_TYPES.SHOP_DRAWING_APPROVED, {
      title: 'Shop Drawing Approved',
      message: `Shop drawing "${drawing.fileName}" has been approved for project "${project.name}"`,
      drawingId: drawing.id,
      projectId: project.id,
      projectName: project.name,
      priority: 'medium',
      actions: [
        { label: 'View Drawings', action: 'VIEW_DRAWINGS', projectId: project.id }
      ]
    });
  }

  notifyMaterialSpecApproved(spec, project) {
    if (!this.settings.approvalNotifications) return;

    return this.createNotification(NOTIFICATION_TYPES.MATERIAL_SPEC_APPROVED, {
      title: 'Material Specification Approved',
      message: `Material specification "${spec.description}" has been approved for project "${project.name}"`,
      specId: spec.id,
      projectId: project.id,
      projectName: project.name,
      priority: 'medium',
      actions: [
        { label: 'View Specifications', action: 'VIEW_SPECIFICATIONS', projectId: project.id }
      ]
    });
  }

  notifyProductionReady(scopeItems, project) {
    if (!this.settings.productionAlerts) return;

    return this.createNotification(NOTIFICATION_TYPES.PRODUCTION_READY, {
      title: 'Production Ready',
      message: `${scopeItems.length} scope items are now ready for production in project "${project.name}"`,
      projectId: project.id,
      projectName: project.name,
      readyItemsCount: scopeItems.length,
      priority: 'high',
      actions: [
        { label: 'View Timeline', action: 'VIEW_TIMELINE', projectId: project.id },
        { label: 'View Scope', action: 'VIEW_SCOPE', projectId: project.id }
      ]
    });
  }

  // Periodic checks for due dates and overdue items
  startPeriodicChecks() {
    // Check every hour
    this.checkInterval = setInterval(() => {
      this.checkDueDatesAndOverdue();
    }, 60 * 60 * 1000);

    // Also check immediately
    this.checkDueDatesAndOverdue();
  }

  checkDueDatesAndOverdue() {
    const today = startOfDay(new Date());
    
    this.tasks.forEach(task => {
      if (!task.dueDate || task.status === 'completed') return;
      
      const dueDate = startOfDay(new Date(task.dueDate));
      const daysDiff = differenceInDays(dueDate, today);
      
      // Due date reminders (1 day and 3 days before)
      if (daysDiff === 1 || daysDiff === 3) {
        // Check if we already sent this reminder today
        const existingReminder = this.notifications.find(n => 
          n.type === NOTIFICATION_TYPES.DUE_DATE_REMINDER &&
          n.taskId === task.id &&
          n.daysUntilDue === daysDiff &&
          format(new Date(n.timestamp), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        );
        
        if (!existingReminder) {
          this.notifyDueDateReminder(task, daysDiff);
        }
      }
      
      // Overdue alerts
      if (daysDiff < 0) {
        const daysOverdue = Math.abs(daysDiff);
        
        // Send overdue alert daily
        const existingAlert = this.notifications.find(n => 
          n.type === NOTIFICATION_TYPES.OVERDUE_ALERT &&
          n.taskId === task.id &&
          format(new Date(n.timestamp), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        );
        
        if (!existingAlert) {
          this.notifyOverdueAlert(task, daysOverdue);
        }
      }
    });
  }

  // Notification management
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  dismiss(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.notifyListeners();
    }
  }

  dismissAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Custom hook for using notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    setNotifications([...notificationService.notifications]);
    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount: notificationService.getUnreadCount(),
    markAsRead: (id) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(),
    dismiss: (id) => notificationService.dismiss(id),
    dismissAll: () => notificationService.dismissAll(),
    settings: notificationService.settings,
    updateSettings: (settings) => notificationService.saveSettings(settings)
  };
};

// Notification Panel Component
export const NotificationPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadCount, markAsRead, dismiss, markAllAsRead, dismissAll } = useNotifications();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Handle navigation based on notification type and actions
    // This would integrate with your app's navigation system
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.TASK_ASSIGNED:
      case NOTIFICATION_TYPES.TASK_COMPLETED:
      case NOTIFICATION_TYPES.TASK_REASSIGNED:
        return <TaskIcon color="primary" />;
      case NOTIFICATION_TYPES.PROJECT_ASSIGNED:
      case NOTIFICATION_TYPES.PROJECT_STATUS_CHANGED:
        return <ProjectIcon color="primary" />;
      case NOTIFICATION_TYPES.DUE_DATE_REMINDER:
        return <DueDateIcon color="warning" />;
      case NOTIFICATION_TYPES.OVERDUE_ALERT:
        return <OverdueIcon color="error" />;
      case NOTIFICATION_TYPES.SCOPE_ITEM_UPDATED:
      case NOTIFICATION_TYPES.PRODUCTION_READY:
        return <CompletedIcon color="success" />;
      default:
        return <NotificationsIcon color="action" />;
    }
  };

  const getPriorityPalette = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          backgroundPalette: '#F8F9FA',
          border: '1px solid #E9ECEF',
          borderRadius: 2,
          p: 1.5,
          '&:hover': {
            backgroundPalette: '#E9ECEF'
          }
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon sx={{ color: '#7F8C8D' }} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 600 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Notifications
            </Typography>
            {notifications.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" onClick={markAllAsRead}>
                  Mark all read
                </Button>
                <Button size="small" onClick={dismissAll}>
                  Clear all
                </Button>
              </Box>
            )}
          </Box>
          {unreadCount > 0 && (
            <Typography variant="body2" color="textSecondary">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  borderBottom: '1px solid #f0f0f0',
                  backgroundPalette: notification.read ? 'transparent' : '#f8f9fa',
                  '&:hover': {
                    backgroundPalette: '#e3f2fd'
                  }
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                        {notification.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {notification.priority && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundPalette: getPriorityPalette(notification.priority)
                            }}
                          />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismiss(notification.id);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.85rem' }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatTimestamp(notification.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default notificationService;