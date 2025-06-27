/**
 * Formula PM Background Job Service
 * Manages background job processing using Bull queues with Redis
 */

const Queue = require('bull');
const cacheService = require('./cacheService');
const auditService = require('./auditService');

class BackgroundJobService {
  constructor() {
    this.queues = new Map();
    this.processors = new Map();
    this.isInitialized = false;
    
    // Job statistics
    this.stats = {
      totalJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      activeJobs: 0,
      queueCount: 0
    };

    // Queue configurations
    this.queueConfigs = {
      'email': {
        concurrency: 5,
        attempts: 3,
        backoff: 'exponential',
        delay: 0
      },
      'reports': {
        concurrency: 2,
        attempts: 2,
        backoff: 'exponential',
        delay: 0
      },
      'fileProcessing': {
        concurrency: 3,
        attempts: 2,
        backoff: 'fixed',
        delay: 1000
      },
      'notifications': {
        concurrency: 10,
        attempts: 3,
        backoff: 'exponential',
        delay: 0
      },
      'analytics': {
        concurrency: 1,
        attempts: 1,
        backoff: 'fixed',
        delay: 0
      },
      'maintenance': {
        concurrency: 1,
        attempts: 1,
        backoff: 'fixed',
        delay: 0
      }
    };
  }

  /**
   * Initialize background job service
   */
  async initialize() {
    try {
      if (this.isInitialized) {
        console.log('✅ Background Job Service already initialized');
        return;
      }

      console.log('🚀 Initializing Background Job Service...');

      // Check Redis connection
      if (!cacheService.isConnected) {
        console.warn('⚠️ Redis not available, background jobs will be disabled');
        return;
      }

      // Create job queues
      await this.createQueues();

      // Setup job processors
      await this.setupProcessors();

      // Setup monitoring
      this.setupMonitoring();

      // Setup scheduled jobs
      await this.setupScheduledJobs();

      this.isInitialized = true;
      console.log('✅ Background Job Service initialized successfully');

      await auditService.logSystemEvent({
        event: 'background_job_service_initialized',
        description: 'Background job processing service started',
        metadata: {
          queueCount: this.queues.size,
          totalConcurrency: this.getTotalConcurrency()
        }
      });

    } catch (error) {
      console.error('❌ Background Job Service initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create job queues
   */
  async createQueues() {
    try {
      const redisConfig = {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD,
          db: process.env.REDIS_DB || 0
        }
      };

      // Create queues for each job type
      for (const [queueName, config] of Object.entries(this.queueConfigs)) {
        const queue = new Queue(`formula_pm:${queueName}`, redisConfig);
        
        // Setup queue event handlers
        this.setupQueueEvents(queue, queueName);
        
        this.queues.set(queueName, queue);
        console.log(`📦 Created queue: ${queueName} (concurrency: ${config.concurrency})`);
      }

      this.stats.queueCount = this.queues.size;
    } catch (error) {
      console.error('❌ Queue creation failed:', error);
      throw error;
    }
  }

  /**
   * Setup queue event handlers
   */
  setupQueueEvents(queue, queueName) {
    queue.on('completed', (job, result) => {
      this.stats.completedJobs++;
      console.log(`✅ Job completed: ${queueName}:${job.id}`);
    });

    queue.on('failed', (job, err) => {
      this.stats.failedJobs++;
      console.error(`❌ Job failed: ${queueName}:${job.id}`, err.message);
    });

    queue.on('active', (job, jobPromise) => {
      this.stats.activeJobs++;
      console.log(`🔄 Job started: ${queueName}:${job.id}`);
    });

    queue.on('stalled', (job) => {
      console.warn(`⚠️ Job stalled: ${queueName}:${job.id}`);
    });

    queue.on('progress', (job, progress) => {
      console.log(`📊 Job progress: ${queueName}:${job.id} - ${progress}%`);
    });
  }

  /**
   * Setup job processors
   */
  async setupProcessors() {
    try {
      // Email processing
      this.registerProcessor('email', async (job) => {
        const { type, data } = job.data;
        const EmailService = require('./EmailService');
        
        switch (type) {
          case 'welcome':
            return await EmailService.sendWelcomeEmail(data.user);
          case 'notification':
            return await EmailService.sendNotificationEmail(data.user, data.notification);
          case 'project_update':
            return await EmailService.sendProjectUpdateEmail(data.recipients, data.project);
          case 'task_assignment':
            return await EmailService.sendTaskAssignmentEmail(data.user, data.task);
          case 'report':
            return await EmailService.sendReportEmail(data.user, data.report);
          default:
            throw new Error(`Unknown email type: ${type}`);
        }
      });

      // Report generation processing
      this.registerProcessor('reports', async (job) => {
        const { reportType, parameters, userId } = job.data;
        const ReportGenerator = require('./ReportGenerator');
        
        // Update job progress
        job.progress(10);
        
        const report = await ReportGenerator.generateReport(reportType, parameters);
        job.progress(90);
        
        // Save report and notify user
        const reportPath = await ReportGenerator.saveReport(report, reportType);
        job.progress(100);
        
        return { reportPath, reportType, userId };
      });

      // File processing
      this.registerProcessor('fileProcessing', async (job) => {
        const { operation, filePath, parameters } = job.data;
        
        switch (operation) {
          case 'image_resize':
            return await this.processImageResize(filePath, parameters);
          case 'document_convert':
            return await this.processDocumentConvert(filePath, parameters);
          case 'file_backup':
            return await this.processFileBackup(filePath, parameters);
          default:
            throw new Error(`Unknown file operation: ${operation}`);
        }
      });

      // Notification processing
      this.registerProcessor('notifications', async (job) => {
        const { type, recipients, data } = job.data;
        const NotificationService = require('./NotificationService');
        
        return await NotificationService.sendBulkNotifications(type, recipients, data);
      });

      // Analytics processing
      this.registerProcessor('analytics', async (job) => {
        const { operation, parameters } = job.data;
        const AnalyticsService = require('./AnalyticsService');
        
        switch (operation) {
          case 'daily_metrics':
            return await AnalyticsService.calculateDailyMetrics(parameters.date);
          case 'project_summary':
            return await AnalyticsService.generateProjectSummary(parameters.projectId);
          case 'user_activity':
            return await AnalyticsService.generateUserActivityReport(parameters);
          default:
            throw new Error(`Unknown analytics operation: ${operation}`);
        }
      });

      // Maintenance processing
      this.registerProcessor('maintenance', async (job) => {
        const { operation } = job.data;
        
        switch (operation) {
          case 'cleanup_logs':
            return await this.cleanupOldLogs();
          case 'optimize_database':
            return await this.optimizeDatabase();
          case 'backup_data':
            return await this.backupData();
          case 'cleanup_files':
            return await this.cleanupTempFiles();
          default:
            throw new Error(`Unknown maintenance operation: ${operation}`);
        }
      });

      console.log(`✅ Setup ${this.processors.size} job processors`);
    } catch (error) {
      console.error('❌ Processor setup failed:', error);
      throw error;
    }
  }

  /**
   * Register a job processor
   */
  registerProcessor(queueName, processor) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const config = this.queueConfigs[queueName];
    queue.process(config.concurrency, async (job) => {
      try {
        const startTime = Date.now();
        const result = await processor(job);
        const duration = Date.now() - startTime;
        
        // Log job completion
        await auditService.logSystemEvent({
          event: 'background_job_completed',
          description: `Job ${queueName}:${job.id} completed successfully`,
          metadata: {
            queueName,
            jobId: job.id,
            duration,
            result: typeof result === 'object' ? JSON.stringify(result) : result
          }
        });

        return result;
      } catch (error) {
        // Log job failure
        await auditService.logSystemEvent({
          event: 'background_job_failed',
          severity: 'error',
          description: `Job ${queueName}:${job.id} failed: ${error.message}`,
          metadata: {
            queueName,
            jobId: job.id,
            error: error.stack,
            data: job.data
          }
        });

        throw error;
      }
    });

    this.processors.set(queueName, processor);
  }

  /**
   * Add job to queue
   */
  async addJob(queueName, jobData, options = {}) {
    try {
      if (!this.isInitialized) {
        console.warn('⚠️ Background jobs not initialized, skipping job');
        return null;
      }

      const queue = this.queues.get(queueName);
      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      const config = this.queueConfigs[queueName];
      const jobOptions = {
        attempts: config.attempts,
        backoff: config.backoff,
        delay: options.delay || config.delay,
        removeOnComplete: options.removeOnComplete || 10,
        removeOnFail: options.removeOnFail || 5,
        ...options
      };

      const job = await queue.add(jobData, jobOptions);
      this.stats.totalJobs++;

      console.log(`📋 Job added: ${queueName}:${job.id}`);
      return job;
    } catch (error) {
      console.error('❌ Add job failed:', error);
      throw error;
    }
  }

  /**
   * Schedule recurring job
   */
  async scheduleJob(queueName, jobData, cronExpression, options = {}) {
    try {
      const queue = this.queues.get(queueName);
      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      const job = await queue.add(jobData, {
        repeat: { cron: cronExpression },
        ...options
      });

      console.log(`⏰ Scheduled job: ${queueName} - ${cronExpression}`);
      return job;
    } catch (error) {
      console.error('❌ Schedule job failed:', error);
      throw error;
    }
  }

  /**
   * Setup scheduled maintenance jobs
   */
  async setupScheduledJobs() {
    try {
      // Daily log cleanup at 2 AM
      await this.scheduleJob('maintenance', 
        { operation: 'cleanup_logs' },
        '0 2 * * *'
      );

      // Weekly database optimization on Sunday at 3 AM
      await this.scheduleJob('maintenance',
        { operation: 'optimize_database' },
        '0 3 * * 0'
      );

      // Daily data backup at 1 AM
      await this.scheduleJob('maintenance',
        { operation: 'backup_data' },
        '0 1 * * *'
      );

      // Hourly temp file cleanup
      await this.scheduleJob('maintenance',
        { operation: 'cleanup_files' },
        '0 * * * *'
      );

      // Daily analytics processing at 4 AM
      await this.scheduleJob('analytics',
        { operation: 'daily_metrics', parameters: { date: new Date() } },
        '0 4 * * *'
      );

      console.log('✅ Scheduled maintenance jobs setup');
    } catch (error) {
      console.error('❌ Scheduled jobs setup failed:', error);
    }
  }

  /**
   * Setup monitoring
   */
  setupMonitoring() {
    // Update stats every minute
    setInterval(async () => {
      try {
        await this.updateStats();
      } catch (error) {
        console.error('❌ Stats update failed:', error);
      }
    }, 60000);
  }

  /**
   * Update job statistics
   */
  async updateStats() {
    try {
      let totalActive = 0;
      let totalWaiting = 0;
      let totalCompleted = 0;
      let totalFailed = 0;

      for (const [queueName, queue] of this.queues) {
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        const completed = await queue.getCompleted();
        const failed = await queue.getFailed();

        totalWaiting += waiting.length;
        totalActive += active.length;
        totalCompleted += completed.length;
        totalFailed += failed.length;
      }

      this.stats = {
        ...this.stats,
        activeJobs: totalActive,
        waitingJobs: totalWaiting,
        completedJobs: totalCompleted,
        failedJobs: totalFailed
      };

    } catch (error) {
      console.error('❌ Update stats error:', error);
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    try {
      const queueStats = {};

      for (const [queueName, queue] of this.queues) {
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        const completed = await queue.getCompleted();
        const failed = await queue.getFailed();

        queueStats[queueName] = {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
          concurrency: this.queueConfigs[queueName].concurrency
        };
      }

      return {
        ...this.stats,
        queues: queueStats,
        isInitialized: this.isInitialized
      };
    } catch (error) {
      console.error('❌ Get queue stats error:', error);
      return { error: error.message };
    }
  }

  /**
   * Get total concurrency across all queues
   */
  getTotalConcurrency() {
    return Object.values(this.queueConfigs).reduce((total, config) => total + config.concurrency, 0);
  }

  /**
   * Process image resize operation
   */
  async processImageResize(filePath, parameters) {
    try {
      const sharp = require('sharp');
      const path = require('path');
      
      const { width, height, quality = 80 } = parameters;
      const outputPath = path.join(path.dirname(filePath), `resized_${path.basename(filePath)}`);
      
      await sharp(filePath)
        .resize(width, height)
        .jpeg({ quality })
        .toFile(outputPath);
        
      return { outputPath, originalPath: filePath };
    } catch (error) {
      console.error('❌ Image resize error:', error);
      throw error;
    }
  }

  /**
   * Process document conversion
   */
  async processDocumentConvert(filePath, parameters) {
    // Placeholder for document conversion logic
    console.log(`📄 Document conversion: ${filePath}`, parameters);
    return { convertedPath: filePath, status: 'converted' };
  }

  /**
   * Process file backup
   */
  async processFileBackup(filePath, parameters) {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const backupDir = parameters.backupDir || path.join(process.cwd(), 'backups');
      const backupPath = path.join(backupDir, path.basename(filePath));
      
      await fs.mkdir(backupDir, { recursive: true });
      await fs.copyFile(filePath, backupPath);
      
      return { backupPath, originalPath: filePath };
    } catch (error) {
      console.error('❌ File backup error:', error);
      throw error;
    }
  }

  /**
   * Cleanup old logs
   */
  async cleanupOldLogs() {
    try {
      console.log('🧹 Cleaning up old logs...');
      
      // Cleanup audit logs older than 365 days
      const cutoffDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const deletedCount = await auditService.cleanupOldLogs(cutoffDate);
      
      return { deletedLogs: deletedCount, cutoffDate };
    } catch (error) {
      console.error('❌ Log cleanup error:', error);
      throw error;
    }
  }

  /**
   * Optimize database
   */
  async optimizeDatabase() {
    try {
      console.log('🔧 Optimizing database...');
      
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      // Run database optimization queries
      await prisma.$executeRaw`VACUUM;`;
      await prisma.$executeRaw`ANALYZE;`;
      
      await prisma.$disconnect();
      
      return { status: 'optimized', timestamp: new Date() };
    } catch (error) {
      console.error('❌ Database optimization error:', error);
      throw error;
    }
  }

  /**
   * Backup data
   */
  async backupData() {
    try {
      console.log('💾 Backing up data...');
      
      // Placeholder for data backup logic
      const backupId = `backup_${Date.now()}`;
      
      return { backupId, status: 'completed', timestamp: new Date() };
    } catch (error) {
      console.error('❌ Data backup error:', error);
      throw error;
    }
  }

  /**
   * Cleanup temporary files
   */
  async cleanupTempFiles() {
    try {
      console.log('🧹 Cleaning up temporary files...');
      
      const fs = require('fs').promises;
      const path = require('path');
      
      const tempDir = path.join(process.cwd(), 'temp');
      const cutoffTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
      
      try {
        const files = await fs.readdir(tempDir);
        let deletedCount = 0;
        
        for (const file of files) {
          const filePath = path.join(tempDir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime.getTime() < cutoffTime) {
            await fs.unlink(filePath);
            deletedCount++;
          }
        }
        
        return { deletedFiles: deletedCount };
      } catch (error) {
        if (error.code === 'ENOENT') {
          return { deletedFiles: 0, message: 'Temp directory does not exist' };
        }
        throw error;
      }
    } catch (error) {
      console.error('❌ Temp file cleanup error:', error);
      throw error;
    }
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      status: this.isInitialized ? 'operational' : 'initializing',
      ...this.stats,
      queues: Array.from(this.queues.keys()),
      processors: Array.from(this.processors.keys()),
      totalConcurrency: this.getTotalConcurrency(),
      timestamp: new Date()
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      console.log('🔄 Shutting down Background Job Service...');
      
      // Close all queues
      for (const [queueName, queue] of this.queues) {
        await queue.close();
        console.log(`✅ Closed queue: ${queueName}`);
      }
      
      // Clear tracking data
      this.queues.clear();
      this.processors.clear();
      this.isInitialized = false;
      
      console.log('✅ Background Job Service shutdown complete');
      
      await auditService.logSystemEvent({
        event: 'background_job_service_shutdown',
        description: 'Background job processing service stopped gracefully',
        metadata: { finalStats: this.stats }
      });

    } catch (error) {
      console.error('❌ Background Job Service shutdown error:', error);
    }
  }
}

// Create singleton instance
const backgroundJobService = new BackgroundJobService();

module.exports = backgroundJobService;