/**
 * Formula PM Search API Routes
 * RESTful endpoints for global search functionality
 */

const express = require('express');
const router = express.Router();
const SearchService = require('../services/SearchService');
const auth = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { query, body } = require('express-validator');

// All search routes require authentication
router.use(auth);

/**
 * GET /api/search/global
 * Perform global search across all entities
 */
router.get('/global', [
  query('q').notEmpty().isLength({ min: 2 }).withMessage('Query must be at least 2 characters'),
  query('types').optional().isArray().withMessage('Types must be an array'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['relevance', 'date', 'name']).withMessage('Invalid sort option'),
  query('projectContext').optional().isUUID().withMessage('Project context must be a valid UUID')
], validateRequest, async (req, res) => {
  try {
    const { 
      q: query, 
      types, 
      limit = 20, 
      sortBy = 'relevance',
      projectContext,
      includeHighlights = 'true'
    } = req.query;

    // Parse filters from query params
    const filters = {};
    Object.keys(req.query).forEach(key => {
      if (key.startsWith('filter_')) {
        const filterType = key.replace('filter_', '');
        filters[filterType] = req.query[key];
      }
    });

    const results = await SearchService.globalSearch(query, {
      types: types || ['projects', 'tasks', 'users', 'scopeItems', 'drawings', 'materials', 'clients'],
      limit: parseInt(limit),
      filters,
      userId: req.user.id,
      projectContext,
      sortBy,
      includeHighlights: includeHighlights === 'true'
    });

    res.json({
      success: true,
      ...results
    });
  } catch (error) {
    console.error('❌ Global search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

/**
 * GET /api/search/projects
 * Advanced project search with filters
 */
router.get('/projects', [
  query('q').optional().isLength({ min: 0 }).withMessage('Invalid query'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
  query('sortBy').optional().isIn(['relevance', 'name', 'created', 'updated', 'budget']).withMessage('Invalid sort option')
], validateRequest, async (req, res) => {
  try {
    const {
      q: query = '',
      status,
      type,
      priority,
      clientId,
      projectManagerId,
      teamMemberId,
      limit = 20,
      offset = 0,
      sortBy = 'relevance'
    } = req.query;

    // Parse date range
    let dateRange = null;
    if (req.query.startDate || req.query.endDate) {
      dateRange = {
        start: req.query.startDate,
        end: req.query.endDate
      };
    }

    // Parse budget range
    let budgetRange = null;
    if (req.query.minBudget || req.query.maxBudget) {
      budgetRange = {
        min: req.query.minBudget ? parseFloat(req.query.minBudget) : null,
        max: req.query.maxBudget ? parseFloat(req.query.maxBudget) : null
      };
    }

    const results = await SearchService.searchProjects({
      query,
      status: status ? (Array.isArray(status) ? status : [status]) : null,
      type,
      priority,
      clientId,
      projectManagerId,
      teamMemberId,
      dateRange,
      budgetRange,
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy
    });

    res.json({
      success: true,
      ...results
    });
  } catch (error) {
    console.error('❌ Project search error:', error);
    res.status(500).json({
      success: false,
      message: 'Project search failed',
      error: error.message
    });
  }
});

/**
 * GET /api/search/smart
 * Smart search with auto-complete and suggestions
 */
router.get('/smart', [
  query('q').optional().isLength({ min: 0 }).withMessage('Invalid query'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('projectContext').optional().isUUID().withMessage('Project context must be a valid UUID'),
  query('includeHistory').optional().isBoolean().withMessage('Include history must be boolean')
], validateRequest, async (req, res) => {
  try {
    const {
      q: query = '',
      limit = 10,
      projectContext,
      includeHistory = true
    } = req.query;

    const results = await SearchService.smartSearch(query, {
      limit: parseInt(limit),
      userId: req.user.id,
      projectContext,
      includeHistory
    });

    res.json({
      success: true,
      ...results
    });
  } catch (error) {
    console.error('❌ Smart search error:', error);
    res.status(500).json({
      success: false,
      message: 'Smart search failed',
      error: error.message
    });
  }
});

/**
 * GET /api/search/history
 * Get user's search history
 */
router.get('/history', [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], validateRequest, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;

    const history = await SearchService.getSearchHistory(userId, parseInt(limit));

    res.json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (error) {
    console.error('❌ Get search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search history',
      error: error.message
    });
  }
});

/**
 * GET /api/search/analytics
 * Get search analytics
 */
router.get('/analytics', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.role === 'admin' ? null : req.user.id;

    const analytics = await SearchService.getSearchAnalytics({
      startDate,
      endDate,
      userId
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('❌ Get search analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search analytics',
      error: error.message
    });
  }
});

/**
 * POST /api/search/entities/:type
 * Search within a specific entity type
 */
router.post('/entities/:type', [
  query('q').notEmpty().isLength({ min: 1 }).withMessage('Query is required'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  body('filters').optional().isObject().withMessage('Filters must be an object')
], validateRequest, async (req, res) => {
  try {
    const { type } = req.params;
    const { q: query, limit = 20 } = req.query;
    const { filters = {} } = req.body;

    const results = await SearchService.searchEntityType(type, query, filters, parseInt(limit));

    res.json({
      success: true,
      data: results,
      count: results.length,
      type
    });
  } catch (error) {
    console.error(`❌ Search ${req.params.type} error:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to search ${req.params.type}`,
      error: error.message
    });
  }
});

/**
 * DELETE /api/search/cache
 * Clear search cache (admin only)
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

    await SearchService.clearSearchCache();

    res.json({
      success: true,
      message: 'Search cache cleared successfully'
    });
  } catch (error) {
    console.error('❌ Clear search cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear search cache',
      error: error.message
    });
  }
});

module.exports = router;