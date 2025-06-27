/**
 * Formula PM System API Routes
 * System health, service management, and administrative endpoints
 */

const express = require('express');
const router = express.Router();
const ServiceRegistry = require('../services/ServiceRegistry');
const EmailService = require('../services/EmailService');
const { verifyToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { body } = require('express-validator');

// All system routes require authentication
router.use(verifyToken);

/**
 * GET /api/system/health
 * Get system health status
 */
router.get('/health', async (req, res) => {
  try {
    const health = await ServiceRegistry.performHealthCheck();

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('❌ System health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

/**
 * GET /api/system/services
 * Get service registry information
 */
router.get('/services', async (req, res) => {
  try {
    // Check admin permissions for detailed service info
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const serviceInfo = ServiceRegistry.getServiceInfo();
    const serviceMetrics = await ServiceRegistry.getServiceMetrics();

    res.json({
      success: true,
      data: {
        ...serviceInfo,
        metrics: serviceMetrics
      }
    });
  } catch (error) {
    console.error('❌ Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service information',
      error: error.message
    });
  }
});

/**
 * POST /api/system/services/restart
 * Restart all services
 */
router.post('/services/restart', async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    await ServiceRegistry.restart();

    res.json({
      success: true,
      message: 'Services restarted successfully'
    });
  } catch (error) {
    console.error('❌ Restart services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restart services',
      error: error.message
    });
  }
});

/**
 * GET /api/system/email/status
 * Get email service status
 */
router.get('/email/status', async (req, res) => {
  try {
    const emailStats = EmailService.getEmailStats();

    res.json({
      success: true,
      data: emailStats
    });
  } catch (error) {
    console.error('❌ Email status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email status',
      error: error.message
    });
  }
});

/**
 * POST /api/system/email/test
 * Test email configuration
 */
router.post('/email/test', async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const testResult = await EmailService.testEmailConfiguration();

    res.json({
      success: testResult.success,
      data: testResult,
      message: testResult.message
    });
  } catch (error) {
    console.error('❌ Email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * POST /api/system/email/reset-stats
 * Reset email statistics
 */
router.post('/email/reset-stats', async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    EmailService.resetStats();

    res.json({
      success: true,
      message: 'Email statistics reset successfully'
    });
  } catch (error) {
    console.error('❌ Reset email stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset email statistics',
      error: error.message
    });
  }
});

/**
 * GET /api/system/info
 * Get system information
 */
router.get('/info', async (req, res) => {
  try {
    const systemInfo = {
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        provider: 'postgresql',
        connected: true // This would be checked dynamically
      },
      cache: {
        provider: 'redis',
        connected: true // This would be checked dynamically
      }
    };

    res.json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    console.error('❌ System info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system information',
      error: error.message
    });
  }
});

/**
 * POST /api/system/backup
 * Trigger system backup (placeholder)
 */
router.post('/backup', [
  body('type').optional().isIn(['full', 'incremental']).withMessage('Invalid backup type')
], handleValidationErrors, async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { type = 'incremental' } = req.body;

    // This is a placeholder - actual backup implementation would go here
    console.log(`🔄 ${type} backup triggered by ${req.user.email}`);

    res.json({
      success: true,
      data: {
        type,
        status: 'initiated',
        estimatedDuration: '5-10 minutes'
      },
      message: `${type} backup initiated successfully`
    });
  } catch (error) {
    console.error('❌ Backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate backup',
      error: error.message
    });
  }
});

/**
 * GET /api/system/logs
 * Get system logs (placeholder)
 */
router.get('/logs', async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // This is a placeholder - actual log retrieval would go here
    const logs = [
      {
        timestamp: new Date(),
        level: 'info',
        message: 'Services initialized successfully',
        service: 'system'
      },
      {
        timestamp: new Date(Date.now() - 60000),
        level: 'info',
        message: 'Health check completed',
        service: 'health'
      }
    ];

    res.json({
      success: true,
      data: logs,
      total: logs.length
    });
  } catch (error) {
    console.error('❌ Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system logs',
      error: error.message
    });
  }
});

/**
 * POST /api/system/maintenance
 * Enable/disable maintenance mode
 */
router.post('/maintenance', [
  body('enabled').isBoolean().withMessage('Enabled must be boolean'),
  body('message').optional().isString().withMessage('Message must be string'),
  body('estimatedDuration').optional().isString().withMessage('Duration must be string')
], handleValidationErrors, async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { enabled, message = 'System maintenance in progress', estimatedDuration = 'Unknown' } = req.body;

    // This would set a maintenance flag in cache/database
    console.log(`🔧 Maintenance mode ${enabled ? 'enabled' : 'disabled'} by ${req.user.email}`);

    res.json({
      success: true,
      data: {
        maintenanceMode: enabled,
        message,
        estimatedDuration,
        enabledBy: req.user.email,
        enabledAt: new Date()
      },
      message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('❌ Maintenance mode error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance mode',
      error: error.message
    });
  }
});

/**
 * GET /api/system/version
 * Get system version information
 */
router.get('/version', async (req, res) => {
  try {
    const version = {
      application: process.env.npm_package_version || '1.0.0',
      api: '1.0.0',
      database: 'PostgreSQL 15+',
      cache: 'Redis 6+',
      buildDate: process.env.BUILD_DATE || new Date().toISOString(),
      gitCommit: process.env.GIT_COMMIT || 'unknown'
    };

    res.json({
      success: true,
      data: version
    });
  } catch (error) {
    console.error('❌ Version info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get version information',
      error: error.message
    });
  }
});

/**
 * POST /api/system/cache/clear
 * Clear system caches
 */
router.post('/cache/clear', [
  body('cacheType').optional().isIn(['all', 'analytics', 'search', 'project', 'notification']).withMessage('Invalid cache type')
], handleValidationErrors, async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { cacheType = 'all' } = req.body;

    // Clear specific cache types
    switch (cacheType) {
      case 'analytics':
        const AnalyticsService = require('../services/AnalyticsService');
        await AnalyticsService.clearAnalyticsCache();
        break;
      case 'search':
        const SearchService = require('../services/SearchService');
        await SearchService.clearSearchCache();
        break;
      case 'all':
        // Clear all caches
        const cacheService = require('../services/cacheService');
        await cacheService.flushAll();
        break;
      default:
        throw new Error(`Unsupported cache type: ${cacheType}`);
    }

    res.json({
      success: true,
      data: { cacheType },
      message: `${cacheType} cache cleared successfully`
    });
  } catch (error) {
    console.error('❌ Clear cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
});

module.exports = router;