/**
 * Formula PM Notifications API Routes
 * RESTful endpoints for notification management
 */

const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');
const { verifyToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { query, body, param } = require('express-validator');

// All notification routes require authentication
router.use(verifyToken);

/**
 * GET /api/notifications
 * Get user's notifications
 */
router.get('/', [
  query('unreadOnly').optional().isBoolean().withMessage('Unread only must be boolean'),
  query('type').optional().isString().withMessage('Type must be a string'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
  query('includeExpired').optional().isBoolean().withMessage('Include expired must be boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      unreadOnly = false,
      type = null,
      limit = 50,
      offset = 0,
      includeExpired = false
    } = req.query;

    const userId = req.user.id;

    const result = await NotificationService.getUserNotifications(userId, {
      unreadOnly,
      type,
      limit: parseInt(limit),
      offset: parseInt(offset),
      includeExpired
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('❌ Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications
 * Create a new notification
 */
router.post('/', [
  body('userId').isUUID().withMessage('User ID must be a valid UUID'),
  body('type').isIn([
    'task_assigned', 'task_completed', 'project_update', 'deadline_reminder',
    'drawing_approved', 'material_delivered', 'system_alert'
  ]).withMessage('Invalid notification type'),
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('data').optional().isObject().withMessage('Data must be an object'),
  body('expiresAt').optional().isISO8601().withMessage('Expires at must be valid ISO date'),
  body('sendEmail').optional().isBoolean().withMessage('Send email must be boolean')
], handleValidationErrors, async (req, res) => {
  try {
    // Check permissions - only admins and project managers can create notifications for other users
    if (req.body.userId !== req.user.id && !['admin', 'project_manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create notifications for other users'
      });
    }

    const notificationData = req.body;
    const notification = await NotificationService.createNotification(notificationData);

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('❌ Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/bulk
 * Create multiple notifications
 */
router.post('/bulk', [
  body('notifications').isArray().withMessage('Notifications must be an array'),
  body('notifications.*.userId').isUUID().withMessage('Each notification must have a valid user ID'),
  body('notifications.*.type').isIn([
    'task_assigned', 'task_completed', 'project_update', 'deadline_reminder',
    'drawing_approved', 'material_delivered', 'system_alert'
  ]).withMessage('Each notification must have a valid type'),
  body('notifications.*.title').notEmpty().withMessage('Each notification must have a title'),
  body('notifications.*.message').notEmpty().withMessage('Each notification must have a message')
], handleValidationErrors, async (req, res) => {
  try {
    // Check permissions
    if (!['admin', 'project_manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create bulk notifications'
      });
    }

    const { notifications } = req.body;
    const createdNotifications = await NotificationService.createBulkNotifications(notifications);

    res.status(201).json({
      success: true,
      data: createdNotifications,
      count: createdNotifications.length,
      message: `Created ${createdNotifications.length} notifications successfully`
    });
  } catch (error) {
    console.error('❌ Create bulk notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bulk notifications',
      error: error.message
    });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put('/:id/read', [
  param('id').isUUID().withMessage('Notification ID must be a valid UUID')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await NotificationService.markAsRead(id, userId);

    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('❌ Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for user
 */
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await NotificationService.markAllAsRead(userId);

    res.json({
      success: true,
      data: result,
      message: `Marked ${result.count} notifications as read`
    });
  } catch (error) {
    console.error('❌ Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', [
  param('id').isUUID().withMessage('Notification ID must be a valid UUID')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await NotificationService.deleteNotification(id, userId);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/task-assignment
 * Send task assignment notification
 */
router.post('/task-assignment', [
  body('taskId').isUUID().withMessage('Task ID must be a valid UUID'),
  body('assigneeId').isUUID().withMessage('Assignee ID must be a valid UUID')
], handleValidationErrors, async (req, res) => {
  try {
    const { taskId, assigneeId } = req.body;
    const assignedBy = req.user.id;

    await NotificationService.notifyTaskAssignment(taskId, assigneeId, assignedBy);

    res.json({
      success: true,
      message: 'Task assignment notification sent'
    });
  } catch (error) {
    console.error('❌ Task assignment notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send task assignment notification',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/project-update
 * Send project update notification
 */
router.post('/project-update', [
  body('projectId').isUUID().withMessage('Project ID must be a valid UUID'),
  body('updateData').isObject().withMessage('Update data must be an object'),
  body('teamMemberIds').optional().isArray().withMessage('Team member IDs must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { projectId, updateData, teamMemberIds = [] } = req.body;
    const updatedBy = req.user.id;

    await NotificationService.notifyProjectUpdate(projectId, updateData, updatedBy, teamMemberIds);

    res.json({
      success: true,
      message: 'Project update notifications sent'
    });
  } catch (error) {
    console.error('❌ Project update notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send project update notifications',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/deadline-reminders
 * Send deadline reminder notifications (typically called by cron job)
 */
router.post('/deadline-reminders', async (req, res) => {
  try {
    // Check permissions - only admins or system can trigger this
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const count = await NotificationService.notifyUpcomingDeadlines();

    res.json({
      success: true,
      data: { count },
      message: `Sent ${count} deadline reminder notifications`
    });
  } catch (error) {
    console.error('❌ Deadline reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send deadline reminders',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/material-delivery
 * Send material delivery notification
 */
router.post('/material-delivery', [
  body('materialId').isUUID().withMessage('Material ID must be a valid UUID'),
  body('deliveredTo').isUUID().withMessage('Delivered to must be a valid UUID')
], handleValidationErrors, async (req, res) => {
  try {
    const { materialId, deliveredTo } = req.body;

    await NotificationService.notifyMaterialDelivery(materialId, deliveredTo);

    res.json({
      success: true,
      message: 'Material delivery notification sent'
    });
  } catch (error) {
    console.error('❌ Material delivery notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send material delivery notification',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/drawing-approval
 * Send drawing approval notification
 */
router.post('/drawing-approval', [
  body('drawingId').isUUID().withMessage('Drawing ID must be a valid UUID'),
  body('notifyUserIds').optional().isArray().withMessage('Notify user IDs must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { drawingId, notifyUserIds = [] } = req.body;
    const approvedBy = req.user.id;

    await NotificationService.notifyDrawingApproval(drawingId, approvedBy, notifyUserIds);

    res.json({
      success: true,
      message: 'Drawing approval notifications sent'
    });
  } catch (error) {
    console.error('❌ Drawing approval notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send drawing approval notifications',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/digest/:userId
 * Send notification digest to user
 */
router.post('/digest/:userId', [
  param('userId').isUUID().withMessage('User ID must be a valid UUID'),
  body('period').optional().isIn(['daily', 'weekly']).withMessage('Period must be daily or weekly')
], handleValidationErrors, async (req, res) => {
  try {
    // Check permissions
    if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const { userId } = req.params;
    const { period = 'daily' } = req.body;

    const result = await NotificationService.sendNotificationDigest(userId, period);

    res.json({
      success: true,
      data: result,
      message: 'Notification digest sent successfully'
    });
  } catch (error) {
    console.error('❌ Send digest error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification digest',
      error: error.message
    });
  }
});

/**
 * GET /api/notifications/stats
 * Get notification statistics
 */
router.get('/stats', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date')
], handleValidationErrors, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.role === 'admin' ? null : req.user.id;

    const stats = await NotificationService.getNotificationStats({
      startDate,
      endDate,
      userId
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification statistics',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/cleanup
 * Clean up expired notifications
 */
router.post('/cleanup', async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const count = await NotificationService.cleanupExpiredNotifications();

    res.json({
      success: true,
      data: { count },
      message: `Cleaned up ${count} expired notifications`
    });
  } catch (error) {
    console.error('❌ Cleanup notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup expired notifications',
      error: error.message
    });
  }
});

module.exports = router;