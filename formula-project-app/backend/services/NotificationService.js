/**
 * Formula PM Notification Service
 * Real-time notification system with email integration and activity feeds
 */

const cacheService = require('./cacheService');
const auditService = require('./auditService');
const Queue = require('bull');
const _ = require('lodash');

// Will be initialized with shared database service
let prisma = null;
class NotificationService {
  constructor() {
    this.config = {
      cacheTTL: 300, // 5 minutes
      batchSize: 50,
      maxRetries: 3,
      notificationTypes: {
        task_assigned: {
          priority: 'medium',
          template: 'task-assigned',
          emailEnabled: true
        },
        task_completed: {
          priority: 'low',
          template: 'task-completed',
          emailEnabled: false
        },
        project_update: {
          priority: 'medium',
          template: 'project-update',
          emailEnabled: true
        },
        deadline_reminder: {
          priority: 'high',
          template: 'deadline-reminder',
          emailEnabled: true
        },
        drawing_approved: {
          priority: 'medium',
          template: 'drawing-approved',
          emailEnabled: false
        },
        material_delivered: {
          priority: 'medium',
          template: 'material-delivered',
          emailEnabled: false
        },
        system_alert: {
          priority: 'high',
          template: 'system-alert',
          emailEnabled: true
        }
      },
      userPreferences: {
        email: true,
        push: true,
        sms: false
      }
    };

    // Initialize notification queue
    this.notificationQueue = new Queue('notification processing', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
      }
    });

    this.setupQueueProcessors();
  }

  /**
   * Set the shared Prisma client
   */
  setPrismaClient(prismaClient) {
    prisma = prismaClient;
  }

  /**
   * Set up queue processors for different notification types
   */
  setupQueueProcessors() {
    // Process notification creation
    this.notificationQueue.process('create-notification', this.config.batchSize, async (job) => {
      const { notifications } = job.data;
      return await this.processBatchNotifications(notifications);
    });

    // Process email notifications
    this.notificationQueue.process('send-email', 10, async (job) => {
      const { notification, user } = job.data;
      return await this.processEmailNotification(notification, user);
    });

    // Process digest notifications
    this.notificationQueue.process('send-digest', 5, async (job) => {
      const { userId, period } = job.data;
      return await this.sendNotificationDigest(userId, period);
    });
  }

  /**
   * Create a new notification
   */
  async createNotification(notificationData) {
    try {
      const {
        userId,
        type,
        title,
        message,
        data = {},
        expiresAt = null,
        sendEmail = null
      } = notificationData;

      // Validate notification type
      if (!this.config.notificationTypes[type]) {
        throw new Error(`Invalid notification type: ${type}`);
      }

      // Validate user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new Error('User not found');
      }

      // Create notification
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data,
          expiresAt: expiresAt ? new Date(expiresAt) : null
        }
      });

      // Add to processing queue
      await this.notificationQueue.add('create-notification', {
        notifications: [{ notification, user, sendEmail }]
      }, {
        priority: this.getNotificationPriority(type),
        removeOnComplete: 100,
        removeOnFail: 50
      });

      return notification;
    } catch (error) {
      console.error('❌ Create notification error:', error);
      throw error;
    }
  }

  /**
   * Create multiple notifications
   */
  async createBulkNotifications(notificationsData) {
    try {
      const notifications = [];
      
      for (const notificationData of notificationsData) {
        const {
          userId,
          type,
          title,
          message,
          data = {},
          expiresAt = null
        } = notificationData;

        // Validate user exists
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, firstName: true, lastName: true }
        });
        
        if (user) {
          const notification = await prisma.notification.create({
            data: {
              userId,
              type,
              title,
              message,
              data,
              expiresAt: expiresAt ? new Date(expiresAt) : null
            }
          });
          
          notifications.push({ notification, user });
        }
      }

      // Add batch to processing queue
      if (notifications.length > 0) {
        await this.notificationQueue.add('create-notification', {
          notifications
        }, {
          priority: 5,
          removeOnComplete: 100,
          removeOnFail: 50
        });
      }

      return notifications.map(n => n.notification);
    } catch (error) {
      console.error('❌ Create bulk notifications error:', error);
      throw error;
    }
  }

  /**
   * Process batch of notifications
   */
  async processBatchNotifications(notifications) {
    const results = [];
    
    for (const { notification, user, sendEmail } of notifications) {
      try {
        // Check if email should be sent
        const shouldSendEmail = sendEmail !== null 
          ? sendEmail 
          : this.config.notificationTypes[notification.type]?.emailEnabled;

        if (shouldSendEmail) {
          // Add email to queue
          await this.notificationQueue.add('send-email', {
            notification,
            user
          }, {
            delay: 1000, // 1 second delay
            removeOnComplete: 50,
            removeOnFail: 25
          });
        }

        // Update cache for user's unread notifications
        await this.updateUserNotificationCache(user.id);
        
        results.push({ success: true, notificationId: notification.id });
      } catch (error) {
        console.error(`❌ Process notification ${notification.id} error:`, error);
        results.push({ success: false, notificationId: notification.id, error: error.message });
      }
    }
    
    return results;
  }

  /**
   * Get notifications for user
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const {
        unreadOnly = false,
        type = null,
        limit = 50,
        offset = 0,
        includeExpired = false
      } = options;

      const cacheKey = cacheService.generateKey('notification', userId, 
        `list_${unreadOnly}_${type}_${limit}_${offset}_${includeExpired}`);
      
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const where = { userId };
      
      if (unreadOnly) {
        where.readStatus = false;
      }
      
      if (type) {
        where.type = type;
      }
      
      if (!includeExpired) {
        where.OR = [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ];
      }

      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({
          where: {
            userId,
            readStatus: false,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          }
        })
      ]);

      const result = {
        notifications,
        total,
        unreadCount,
        hasMore: offset + limit < total
      };

      await cacheService.set(cacheKey, result, this.config.cacheTTL);
      return result;
    } catch (error) {
      console.error('❌ Get user notifications error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId
        }
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (notification.readStatus) {
        return notification; // Already read
      }

      const updatedNotification = await prisma.notification.update({
        where: { id: notificationId },
        data: { readStatus: true }
      });

      // Update cache
      await this.updateUserNotificationCache(userId);
      
      // Log read action
      await auditService.logUserAction({
        action: 'view',
        entityType: 'notification',
        entityId: notificationId,
        userId
      });

      return updatedNotification;
    } catch (error) {
      console.error('❌ Mark notification as read error:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId) {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          readStatus: false
        },
        data: { readStatus: true }
      });

      // Update cache
      await this.updateUserNotificationCache(userId);

      return result;
    } catch (error) {
      console.error('❌ Mark all as read error:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId
        }
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      await prisma.notification.delete({
        where: { id: notificationId }
      });

      // Update cache
      await this.updateUserNotificationCache(userId);

      return true;
    } catch (error) {
      console.error('❌ Delete notification error:', error);
      throw error;
    }
  }

  /**
   * Create task assignment notification
   */
  async notifyTaskAssignment(taskId, assigneeId, assignedBy) {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          project: {
            select: { id: true, name: true }
          },
          creator: {
            select: { firstName: true, lastName: true }
          }
        }
      });

      if (!task) {
        throw new Error('Task not found');
      }

      const assignerName = task.creator ? 
        `${task.creator.firstName} ${task.creator.lastName}` : 'System';

      await this.createNotification({
        userId: assigneeId,
        type: 'task_assigned',
        title: 'New Task Assignment',
        message: `You have been assigned to task "${task.name}" in project "${task.project.name}" by ${assignerName}`,
        data: {
          taskId: task.id,
          taskName: task.name,
          projectId: task.project.id,
          projectName: task.project.name,
          assignedBy,
          assignerName,
          dueDate: task.dueDate,
          priority: task.priority
        }
      });

      return true;
    } catch (error) {
      console.error('❌ Task assignment notification error:', error);
      throw error;
    }
  }

  /**
   * Create project update notification
   */
  async notifyProjectUpdate(projectId, updateData, updatedBy, teamMemberIds = []) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          teamMembers: {
            select: { userId: true }
          }
        }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Get all team members if not specified
      const notifyUserIds = teamMemberIds.length > 0 
        ? teamMemberIds 
        : project.teamMembers.map(member => member.userId);

      // Don't notify the person who made the update
      const filteredUserIds = notifyUserIds.filter(id => id !== updatedBy);

      const notifications = filteredUserIds.map(userId => ({
        userId,
        type: 'project_update',
        title: 'Project Update',
        message: `Project "${project.name}" has been updated`,
        data: {
          projectId: project.id,
          projectName: project.name,
          updateData,
          updatedBy
        }
      }));

      if (notifications.length > 0) {
        await this.createBulkNotifications(notifications);
      }

      return true;
    } catch (error) {
      console.error('❌ Project update notification error:', error);
      throw error;
    }
  }

  /**
   * Create deadline reminder notifications
   */
  async notifyUpcomingDeadlines() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      // Get tasks due tomorrow
      const tasksDueTomorrow = await prisma.task.findMany({
        where: {
          dueDate: {
            gte: new Date(tomorrow.toDateString()),
            lte: tomorrow
          },
          status: {
            not: 'completed'
          },
          assignedTo: {
            not: null
          }
        },
        include: {
          project: {
            select: { name: true }
          },
          assignee: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      });

      // Get tasks due next week
      const tasksDueNextWeek = await prisma.task.findMany({
        where: {
          dueDate: {
            gte: tomorrow,
            lte: nextWeek
          },
          status: {
            not: 'completed'
          },
          assignedTo: {
            not: null
          }
        },
        include: {
          project: {
            select: { name: true }
          },
          assignee: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      });

      // Create notifications for tomorrow's deadlines
      const tomorrowNotifications = tasksDueTomorrow.map(task => ({
        userId: task.assignee.id,
        type: 'deadline_reminder',
        title: 'Task Due Tomorrow',
        message: `Task "${task.name}" in project "${task.project.name}" is due tomorrow`,
        data: {
          taskId: task.id,
          taskName: task.name,
          projectName: task.project.name,
          dueDate: task.dueDate,
          urgency: 'high'
        }
      }));

      // Create notifications for next week's deadlines
      const nextWeekNotifications = tasksDueNextWeek.map(task => ({
        userId: task.assignee.id,
        type: 'deadline_reminder',
        title: 'Upcoming Task Deadline',
        message: `Task "${task.name}" in project "${task.project.name}" is due next week`,
        data: {
          taskId: task.id,
          taskName: task.name,
          projectName: task.project.name,
          dueDate: task.dueDate,
          urgency: 'medium'
        }
      }));

      const allNotifications = [...tomorrowNotifications, ...nextWeekNotifications];
      
      if (allNotifications.length > 0) {
        await this.createBulkNotifications(allNotifications);
      }

      console.log(`✅ Created ${allNotifications.length} deadline reminder notifications`);
      return allNotifications.length;
    } catch (error) {
      console.error('❌ Deadline reminder notifications error:', error);
      throw error;
    }
  }

  /**
   * Create material delivery notification
   */
  async notifyMaterialDelivery(materialId, deliveredTo) {
    try {
      const material = await prisma.materialSpecification.findUnique({
        where: { id: materialId },
        include: {
          project: {
            select: { id: true, name: true }
          }
        }
      });

      if (!material) {
        throw new Error('Material specification not found');
      }

      await this.createNotification({
        userId: deliveredTo,
        type: 'material_delivered',
        title: 'Material Delivered',
        message: `Material "${material.description}" for project "${material.project.name}" has been delivered`,
        data: {
          materialId: material.id,
          materialDescription: material.description,
          projectId: material.project.id,
          projectName: material.project.name,
          quantity: material.quantity,
          supplier: material.supplier
        }
      });

      return true;
    } catch (error) {
      console.error('❌ Material delivery notification error:', error);
      throw error;
    }
  }

  /**
   * Create drawing approval notification
   */
  async notifyDrawingApproval(drawingId, approvedBy, notifyUserIds = []) {
    try {
      const drawing = await prisma.shopDrawing.findUnique({
        where: { id: drawingId },
        include: {
          project: {
            select: { id: true, name: true }
          },
          creator: {
            select: { id: true, firstName: true, lastName: true }
          }
        }
      });

      if (!drawing) {
        throw new Error('Shop drawing not found');
      }

      // Notify drawing creator and specified users
      const userIdsToNotify = [...new Set([drawing.creator.id, ...notifyUserIds])];
      
      const notifications = userIdsToNotify
        .filter(userId => userId !== approvedBy) // Don't notify approver
        .map(userId => ({
          userId,
          type: 'drawing_approved',
          title: 'Drawing Approved',
          message: `Shop drawing "${drawing.fileName}" for project "${drawing.project.name}" has been approved`,
          data: {
            drawingId: drawing.id,
            drawingFileName: drawing.fileName,
            projectId: drawing.project.id,
            projectName: drawing.project.name,
            approvedBy,
            version: drawing.version
          }
        }));

      if (notifications.length > 0) {
        await this.createBulkNotifications(notifications);
      }

      return true;
    } catch (error) {
      console.error('❌ Drawing approval notification error:', error);
      throw error;
    }
  }

  /**
   * Update user notification cache
   */
  async updateUserNotificationCache(userId) {
    try {
      // Clear all notification caches for user
      const patterns = [
        cacheService.generateKey('notification', userId, '*')
      ];

      for (const pattern of patterns) {
        await cacheService.deletePattern(pattern);
      }

      // Update unread count cache
      const unreadCount = await prisma.notification.count({
        where: {
          userId,
          readStatus: false,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      });

      const unreadCacheKey = cacheService.generateKey('notification', userId, 'unread_count');
      await cacheService.set(unreadCacheKey, unreadCount, 600); // 10 minutes

      return unreadCount;
    } catch (error) {
      console.error('❌ Update notification cache error:', error);
      throw error;
    }
  }

  /**
   * Get notification priority for queue processing
   */
  getNotificationPriority(type) {
    const priorities = {
      system_alert: 10,
      deadline_reminder: 8,
      task_assigned: 6,
      project_update: 5,
      drawing_approved: 4,
      material_delivered: 3,
      task_completed: 2
    };
    
    return priorities[type] || 1;
  }

  /**
   * Process email notification with EmailService integration
   */
  async processEmailNotification(notification, user) {
    try {
      const EmailService = require('./EmailService');
      
      // Map notification type to email template and send
      switch (notification.type) {
        case 'task_assigned':
          if (notification.data?.taskId) {
            const task = await prisma.task.findUnique({
              where: { id: notification.data.taskId },
              include: {
                project: { select: { name: true } },
                creator: { select: { firstName: true, lastName: true } }
              }
            });
            
            if (task) {
              await EmailService.sendTaskAssignmentEmail(
                {
                  id: task.id,
                  name: task.name,
                  description: task.description,
                  dueDate: task.dueDate,
                  priority: task.priority,
                  projectName: task.project.name
                },
                user,
                task.creator
              );
            }
          }
          break;

        case 'project_update':
          if (notification.data?.projectId) {
            const project = await prisma.project.findUnique({
              where: { id: notification.data.projectId },
              select: { id: true, name: true }
            });
            
            if (project) {
              await EmailService.sendProjectUpdateEmail(
                project,
                user,
                {
                  message: notification.message,
                  updatedByName: notification.data?.mentionerName || 'System'
                }
              );
            }
          }
          break;

        case 'deadline_reminder':
          if (notification.data?.taskId) {
            const task = await prisma.task.findUnique({
              where: { id: notification.data.taskId },
              include: {
                project: { select: { name: true } }
              }
            });
            
            if (task) {
              await EmailService.sendDeadlineReminderEmail(
                {
                  id: task.id,
                  name: task.name,
                  description: task.description,
                  dueDate: task.dueDate,
                  priority: task.priority,
                  projectName: task.project.name
                },
                user,
                notification.data?.urgency || 'medium'
              );
            }
          }
          break;

        case 'system_alert':
          await EmailService.sendSystemAlertEmail(user, {
            type: 'System Notification',
            severity: 'info',
            message: notification.message,
            actionRequired: notification.data?.actionRequired
          });
          break;

        default:
          console.log(`📧 Email notification queued for ${user.email}: ${notification.title}`);
      }

      return { success: true, notificationId: notification.id };
    } catch (error) {
      console.error('❌ Process email notification error:', error);
      throw error;
    }
  }

  /**
   * Send notification digest
   */
  async sendNotificationDigest(userId, period = 'daily') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, firstName: true, lastName: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get date range based on period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'daily':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'weekly':
          startDate.setDate(startDate.getDate() - 7);
          break;
        default:
          startDate.setDate(startDate.getDate() - 1);
      }

      // Get notifications for period
      const notifications = await prisma.notification.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (notifications.length === 0) {
        return { success: true, message: 'No notifications to digest' };
      }

      // Group notifications by type
      const groupedNotifications = _.groupBy(notifications, 'type');
      
      const digestData = {
        user,
        period,
        totalNotifications: notifications.length,
        unreadCount: notifications.filter(n => !n.readStatus).length,
        groupedNotifications,
        startDate,
        endDate
      };

      // Send digest email using EmailService
      const EmailService = require('./EmailService');
      const emailResult = await EmailService.sendNotificationDigest(user, digestData);
      
      console.log(`📊 Digest sent to ${user.email} - ${notifications.length} notifications`);
      
      return { success: emailResult.success, digestData, emailSent: emailResult.success };
    } catch (error) {
      console.error('❌ Send notification digest error:', error);
      throw error;
    }
  }

  /**
   * Clean up expired notifications
   */
  async cleanupExpiredNotifications() {
    try {
      const result = await prisma.notification.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });

      console.log(`✅ Cleaned up ${result.count} expired notifications`);
      return result.count;
    } catch (error) {
      console.error('❌ Cleanup expired notifications error:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(options = {}) {
    try {
      const {
        startDate = null,
        endDate = null,
        userId = null
      } = options;

      const where = {};
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }
      
      if (userId) where.userId = userId;

      const [
        total,
        unread,
        typeStats,
        dailyStats
      ] = await Promise.all([
        prisma.notification.count({ where }),
        prisma.notification.count({ 
          where: { ...where, readStatus: false } 
        }),
        prisma.notification.groupBy({
          by: ['type'],
          where,
          _count: { type: true }
        }),
        prisma.notification.groupBy({
          by: ['createdAt'],
          where,
          _count: { createdAt: true }
        })
      ]);

      return {
        total,
        unread,
        readRate: total > 0 ? Math.round(((total - unread) / total) * 100) : 0,
        typeBreakdown: typeStats.reduce((acc, stat) => {
          acc[stat.type] = stat._count.type;
          return acc;
        }, {}),
        queueStats: await this.getQueueStats()
      };
    } catch (error) {
      console.error('❌ Get notification stats error:', error);
      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    try {
      const [waiting, active, completed, failed] = await Promise.all([
        this.notificationQueue.getWaiting(),
        this.notificationQueue.getActive(),
        this.notificationQueue.getCompleted(),
        this.notificationQueue.getFailed()
      ]);

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length
      };
    } catch (error) {
      console.error('❌ Get queue stats error:', error);
      return {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0
      };
    }
  }
}

module.exports = new NotificationService();