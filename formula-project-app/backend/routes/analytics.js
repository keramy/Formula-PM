/**
 * Formula PM Analytics API Routes
 * RESTful endpoints for business intelligence and analytics
 */

const express = require('express');
const router = express.Router();
const AnalyticsService = require('../services/AnalyticsService');
const { verifyToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { query, body, param } = require('express-validator');

// All analytics routes require authentication
router.use(verifyToken);

/**
 * GET /api/analytics/dashboard
 * Get comprehensive dashboard analytics
 */
router.get('/dashboard', [
  query('dateRange').optional().isIn([
    'today', 'yesterday', 'last_7_days', 'last_30_days', 'last_90_days',
    'this_month', 'last_month', 'this_quarter', 'last_quarter', 'this_year', 'last_year'
  ]).withMessage('Invalid date range'),
  query('projectIds').optional().isArray().withMessage('Project IDs must be an array'),
  query('includeForecasts').optional().isBoolean().withMessage('Include forecasts must be boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const {
      dateRange = 'last_30_days',
      projectIds,
      includeForecasts = true
    } = req.query;

    // Check permissions for specific projects
    let filteredProjectIds = null;
    if (projectIds && req.user.role !== 'admin') {
      // For non-admin users, filter to only projects they have access to
      // This would be implemented based on your access control logic
      filteredProjectIds = projectIds;
    } else if (projectIds) {
      filteredProjectIds = projectIds;
    }

    const analytics = await AnalyticsService.getDashboardAnalytics({
      dateRange,
      userId: req.user.id,
      projectIds: filteredProjectIds,
      includeForecasts
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('❌ Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard analytics',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/kpis
 * Get Key Performance Indicators
 */
router.get('/kpis', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date'),
  query('projectIds').optional().isArray().withMessage('Project IDs must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { startDate, endDate, projectIds } = req.query;

    // Default to last 30 days if no dates provided
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const kpis = await AnalyticsService.getKPIs(start, end, projectIds);

    res.json({
      success: true,
      data: kpis,
      dateRange: { startDate: start, endDate: end }
    });
  } catch (error) {
    console.error('❌ KPIs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get KPIs',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/trends
 * Get trend analysis
 */
router.get('/trends', [
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly']).withMessage('Invalid period'),
  query('projectIds').optional().isArray().withMessage('Project IDs must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { period = 'daily', projectIds } = req.query;

    const trends = await AnalyticsService.getTrendAnalysis(period, projectIds);

    res.json({
      success: true,
      data: trends,
      period
    });
  } catch (error) {
    console.error('❌ Trends analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trend analysis',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/performance
 * Get performance metrics
 */
router.get('/performance', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date'),
  query('projectIds').optional().isArray().withMessage('Project IDs must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { startDate, endDate, projectIds } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const performance = await AnalyticsService.getPerformanceMetrics(start, end, projectIds);

    res.json({
      success: true,
      data: performance,
      dateRange: { startDate: start, endDate: end }
    });
  } catch (error) {
    console.error('❌ Performance metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get performance metrics',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/projects
 * Get project-specific analytics
 */
router.get('/projects', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date'),
  query('projectIds').optional().isArray().withMessage('Project IDs must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { startDate, endDate, projectIds } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const analytics = await AnalyticsService.getProjectAnalytics(start, end, projectIds);

    res.json({
      success: true,
      data: analytics,
      dateRange: { startDate: start, endDate: end }
    });
  } catch (error) {
    console.error('❌ Project analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get project analytics',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/team
 * Get team analytics
 */
router.get('/team', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date')
], handleValidationErrors, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const analytics = await AnalyticsService.getTeamAnalytics(start, end);

    res.json({
      success: true,
      data: analytics,
      dateRange: { startDate: start, endDate: end }
    });
  } catch (error) {
    console.error('❌ Team analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get team analytics',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/financial
 * Get financial analytics
 */
router.get('/financial', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date'),
  query('projectIds').optional().isArray().withMessage('Project IDs must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    // Check permissions for financial data
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for financial analytics'
      });
    }

    const { startDate, endDate, projectIds } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const analytics = await AnalyticsService.getFinancialAnalytics(start, end, projectIds);

    res.json({
      success: true,
      data: analytics,
      dateRange: { startDate: start, endDate: end }
    });
  } catch (error) {
    console.error('❌ Financial analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get financial analytics',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/clients
 * Get client analytics
 */
router.get('/clients', [
  query('dateRange').optional().isIn([
    'last_30_days', 'last_90_days', 'last_year', 'this_year'
  ]).withMessage('Invalid date range'),
  query('clientId').optional().isUUID().withMessage('Client ID must be a valid UUID')
], handleValidationErrors, async (req, res) => {
  try {
    const { dateRange = 'last_year', clientId } = req.query;

    const analytics = await AnalyticsService.getClientAnalytics({
      dateRange,
      clientId
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('❌ Client analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get client analytics',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/forecasts
 * Get predictive forecasts
 */
router.get('/forecasts', [
  query('projectIds').optional().isArray().withMessage('Project IDs must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    // Check permissions for forecasts
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for forecasts'
      });
    }

    const { projectIds } = req.query;

    const forecasts = await AnalyticsService.getForecasts(projectIds);

    res.json({
      success: true,
      data: forecasts
    });
  } catch (error) {
    console.error('❌ Forecasts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get forecasts',
      error: error.message
    });
  }
});

/**
 * POST /api/analytics/custom
 * Generate custom analytics report
 */
router.post('/custom', [
  body('metrics').isArray().withMessage('Metrics must be an array'),
  body('filters').optional().isObject().withMessage('Filters must be an object'),
  body('groupBy').optional().isString().withMessage('Group by must be a string'),
  body('dateRange').optional().isString().withMessage('Date range must be a string'),
  body('includeCharts').optional().isBoolean().withMessage('Include charts must be boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const config = req.body;

    const analytics = await AnalyticsService.generateCustomAnalytics(config);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('❌ Custom analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate custom analytics',
      error: error.message
    });
  }
});

/**
 * DELETE /api/analytics/cache
 * Clear analytics cache (admin only)
 */
router.delete('/cache', async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    await AnalyticsService.clearAnalyticsCache();

    res.json({
      success: true,
      message: 'Analytics cache cleared successfully'
    });
  } catch (error) {
    console.error('❌ Clear analytics cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear analytics cache',
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/status
 * Get analytics service status
 */
router.get('/status', async (req, res) => {
  try {
    const status = AnalyticsService.getServiceStatus();

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('❌ Analytics status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics status',
      error: error.message
    });
  }
});

module.exports = router;