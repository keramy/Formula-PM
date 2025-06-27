/**
 * Formula PM Real-time API Routes
 * Endpoints for real-time features, performance monitoring, and file uploads
 */

const express = require('express');
const multer = require('multer');
const { body, param, query, validationResult } = require('express-validator');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv', 'application/zip'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }
});

/**
 * Get real-time service status and metrics
 */
router.get('/status', verifyToken, async (req, res) => {
  try {
    const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
    
    const status = {
      timestamp: new Date(),
      services: {}
    };

    // Get realtime service status
    try {
      const realtimeService = ServiceRegistry.getService('RealtimeService');
      status.services.realtime = realtimeService.getServiceStatus();
    } catch (error) {
      status.services.realtime = { status: 'error', message: error.message };
    }

    // Get background job service status
    try {
      const backgroundJobService = ServiceRegistry.getService('BackgroundJobService');
      status.services.backgroundJobs = await backgroundJobService.getQueueStats();
    } catch (error) {
      status.services.backgroundJobs = { status: 'error', message: error.message };
    }

    // Get performance monitoring status
    try {
      const performanceService = ServiceRegistry.getService('PerformanceMonitoringService');
      status.services.performance = performanceService.getServiceStatus();
    } catch (error) {
      status.services.performance = { status: 'error', message: error.message };
    }

    // Get cloud storage status
    try {
      const cloudStorageService = ServiceRegistry.getService('CloudStorageService');
      status.services.cloudStorage = cloudStorageService.getServiceStatus();
    } catch (error) {
      status.services.cloudStorage = { status: 'error', message: error.message };
    }

    res.json(status);
  } catch (error) {
    console.error('Get realtime status error:', error);
    res.status(500).json({
      error: 'Failed to get realtime status',
      message: error.message
    });
  }
});

/**
 * Get performance metrics
 */
router.get('/performance/metrics', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
    const performanceService = ServiceRegistry.getService('PerformanceMonitoringService');
    
    const metrics = performanceService.getCurrentMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({
      error: 'Failed to get performance metrics',
      message: error.message
    });
  }
});

/**
 * Get performance trends
 */
router.get('/performance/trends', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
    const performanceService = ServiceRegistry.getService('PerformanceMonitoringService');
    
    const trends = performanceService.getPerformanceTrends();
    res.json(trends);
  } catch (error) {
    console.error('Get performance trends error:', error);
    res.status(500).json({
      error: 'Failed to get performance trends',
      message: error.message
    });
  }
});

/**
 * Get online users
 */
router.get('/users/online', verifyToken, async (req, res) => {
  try {
    const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
    const realtimeService = ServiceRegistry.getService('RealtimeService');
    
    const onlineUsers = await realtimeService.getOnlineUsers();
    res.json({
      users: onlineUsers,
      count: onlineUsers.length,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({
      error: 'Failed to get online users',
      message: error.message
    });
  }
});

/**
 * Get active collaborations
 */
router.get('/collaborations/active', verifyToken, async (req, res) => {
  try {
    const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
    const realtimeService = ServiceRegistry.getService('RealtimeService');
    
    const collaborations = Array.from(realtimeService.activeCollaborations.entries()).map(([resourceId, data]) => ({
      resourceId,
      ...data,
      participants: Array.from(data.participants)
    }));
    
    res.json({
      collaborations,
      count: collaborations.length,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get active collaborations error:', error);
    res.status(500).json({
      error: 'Failed to get active collaborations',
      message: error.message
    });
  }
});

/**
 * Send system notification
 */
router.post('/notifications/system', 
  verifyToken, 
  requireRole('admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('severity').optional().isIn(['info', 'warning', 'error', 'critical']).withMessage('Invalid severity level')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, message, severity = 'info' } = req.body;
      
      const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
      const realtimeService = ServiceRegistry.getService('RealtimeService');
      
      const notification = {
        id: `sys_${Date.now()}`,
        title,
        message,
        severity,
        timestamp: new Date(),
        sender: req.user
      };
      
      realtimeService.broadcastSystemNotification(notification);
      
      res.json({
        message: 'System notification sent',
        notification
      });
    } catch (error) {
      console.error('Send system notification error:', error);
      res.status(500).json({
        error: 'Failed to send system notification',
        message: error.message
      });
    }
  }
);

/**
 * Upload file
 */
router.post('/files/upload',
  verifyToken,
  upload.single('file'),
  [
    body('prefix').optional().isString().withMessage('Prefix must be a string'),
    body('projectId').optional().isUUID().withMessage('Project ID must be a valid UUID'),
    body('resize').optional().isObject().withMessage('Resize options must be an object')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { prefix, projectId, resize } = req.body;
      
      const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
      const cloudStorageService = ServiceRegistry.getService('CloudStorageService');
      
      const uploadOptions = {
        prefix: prefix || 'general',
        userId: req.user.id,
        projectId
      };

      if (resize && req.file.mimetype.startsWith('image/')) {
        uploadOptions.resize = JSON.parse(resize);
      }

      const result = await cloudStorageService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        uploadOptions
      );

      // Log upload activity
      await req.app.locals.auditService.logUserAction({
        userId: req.user.id,
        action: 'file_upload',
        description: `Uploaded file: ${req.file.originalname}`,
        metadata: {
          fileKey: result.fileKey,
          size: result.size,
          mimeType: req.file.mimetype
        }
      });

      res.json({
        message: 'File uploaded successfully',
        file: result
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({
        error: 'File upload failed',
        message: error.message
      });
    }
  }
);

/**
 * Get file signed URL
 */
router.get('/files/:fileKey/url',
  verifyToken,
  [
    param('fileKey').notEmpty().withMessage('File key is required'),
    query('expiresIn').optional().isInt({ min: 300, max: 86400 }).withMessage('Expires in must be between 300 and 86400 seconds')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { fileKey } = req.params;
      const expiresIn = parseInt(req.query.expiresIn) || 3600;
      
      const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
      const cloudStorageService = ServiceRegistry.getService('CloudStorageService');
      
      const signedUrl = await cloudStorageService.generateSignedUrl(fileKey, expiresIn);
      
      res.json({
        url: signedUrl,
        expiresIn,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Get file URL error:', error);
      res.status(500).json({
        error: 'Failed to generate file URL',
        message: error.message
      });
    }
  }
);

/**
 * Get file metadata
 */
router.get('/files/:fileKey/metadata',
  verifyToken,
  [
    param('fileKey').notEmpty().withMessage('File key is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { fileKey } = req.params;
      
      const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
      const cloudStorageService = ServiceRegistry.getService('CloudStorageService');
      
      const metadata = await cloudStorageService.getFileMetadata(fileKey);
      
      res.json(metadata);
    } catch (error) {
      console.error('Get file metadata error:', error);
      res.status(500).json({
        error: 'Failed to get file metadata',
        message: error.message
      });
    }
  }
);

/**
 * Delete file
 */
router.delete('/files/:fileKey',
  verifyToken,
  requireRole('admin'), // Only admins can delete files
  [
    param('fileKey').notEmpty().withMessage('File key is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { fileKey } = req.params;
      
      const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
      const cloudStorageService = ServiceRegistry.getService('CloudStorageService');
      
      await cloudStorageService.deleteFile(fileKey);
      
      // Log deletion activity
      await req.app.locals.auditService.logUserAction({
        userId: req.user.id,
        action: 'file_delete',
        description: `Deleted file: ${fileKey}`,
        metadata: { fileKey }
      });
      
      res.json({
        message: 'File deleted successfully',
        fileKey
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        error: 'Failed to delete file',
        message: error.message
      });
    }
  }
);

/**
 * Add background job
 */
router.post('/jobs',
  verifyToken,
  requireRole('admin'),
  [
    body('queueName').notEmpty().withMessage('Queue name is required'),
    body('jobData').isObject().withMessage('Job data must be an object'),
    body('options').optional().isObject().withMessage('Options must be an object')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { queueName, jobData, options = {} } = req.body;
      
      const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
      const backgroundJobService = ServiceRegistry.getService('BackgroundJobService');
      
      const job = await backgroundJobService.addJob(queueName, jobData, options);
      
      res.json({
        message: 'Job added successfully',
        jobId: job.id,
        queueName,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Add job error:', error);
      res.status(500).json({
        error: 'Failed to add job',
        message: error.message
      });
    }
  }
);

/**
 * Get job queue statistics
 */
router.get('/jobs/stats', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
    const backgroundJobService = ServiceRegistry.getService('BackgroundJobService');
    
    const stats = await backgroundJobService.getQueueStats();
    res.json(stats);
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      error: 'Failed to get job statistics',
      message: error.message
    });
  }
});

/**
 * Run performance benchmark
 */
router.post('/benchmark/run',
  verifyToken,
  requireRole('admin'),
  [
    body('concurrentUsers').optional().isInt({ min: 1, max: 50 }).withMessage('Concurrent users must be between 1 and 50'),
    body('testDuration').optional().isInt({ min: 10000, max: 300000 }).withMessage('Test duration must be between 10 and 300 seconds'),
    body('endpoints').optional().isArray().withMessage('Endpoints must be an array')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { concurrentUsers = 5, testDuration = 30000, endpoints = [] } = req.body;
      
      // Queue benchmark job
      const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
      const backgroundJobService = ServiceRegistry.getService('BackgroundJobService');
      
      const jobData = {
        operation: 'performance_benchmark',
        parameters: {
          concurrentUsers,
          testDuration,
          endpoints,
          initiatedBy: req.user.id
        }
      };
      
      const job = await backgroundJobService.addJob('analytics', jobData);
      
      res.json({
        message: 'Performance benchmark queued',
        jobId: job.id,
        estimatedDuration: testDuration + 10000, // Add 10s for setup
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Run benchmark error:', error);
      res.status(500).json({
        error: 'Failed to run benchmark',
        message: error.message
      });
    }
  }
);

/**
 * Get system health summary
 */
router.get('/health/summary', verifyToken, async (req, res) => {
  try {
    const ServiceRegistry = req.app.locals.ServiceRegistry || require('../services/ServiceRegistry');
    
    // Get overall system health
    const systemHealth = await ServiceRegistry.performHealthCheck();
    
    // Get performance metrics summary
    let performanceSummary = null;
    try {
      const performanceService = ServiceRegistry.getService('PerformanceMonitoringService');
      const metrics = performanceService.getCurrentMetrics();
      
      performanceSummary = {
        cpu: metrics.system.cpuUsage,
        memory: metrics.system.memoryUsage,
        responseTime: metrics.requests.avgResponseTime,
        errorRate: metrics.requests.errorRate,
        activeConnections: metrics.realtime.activeConnections
      };
    } catch (error) {
      performanceSummary = { error: 'Performance monitoring unavailable' };
    }
    
    // Get storage stats
    let storageStats = null;
    try {
      const cloudStorageService = ServiceRegistry.getService('CloudStorageService');
      storageStats = cloudStorageService.getServiceStats();
    } catch (error) {
      storageStats = { error: 'Storage service unavailable' };
    }
    
    res.json({
      timestamp: new Date(),
      overall: systemHealth.status,
      services: {
        count: systemHealth.totalServices,
        healthy: systemHealth.healthyServices,
        unhealthy: systemHealth.unhealthyServices
      },
      performance: performanceSummary,
      storage: storageStats,
      alerts: systemHealth.services ? 
        Object.values(systemHealth.services).filter(s => s.status === 'error').length : 0
    });
  } catch (error) {
    console.error('Get health summary error:', error);
    res.status(500).json({
      error: 'Failed to get health summary',
      message: error.message
    });
  }
});

module.exports = router;