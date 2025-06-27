/**
 * Formula PM Mentions API Routes
 * RESTful endpoints for mention functionality
 */

const express = require('express');
const router = express.Router();
const MentionService = require('../services/MentionService');
const { verifyToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { body, query, param } = require('express-validator');

// All mention routes require authentication
router.use(verifyToken);

/**
 * GET /api/mentions/search
 * Search for mentionable entities
 */
router.get('/search', [
  query('q').notEmpty().isLength({ min: 1 }).withMessage('Query is required'),
  query('types').optional().isArray().withMessage('Types must be an array'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('projectId').optional().isUUID().withMessage('Project ID must be a valid UUID')
], handleValidationErrors, async (req, res) => {
  try {
    const { q: query, types, limit = 10, projectId } = req.query;

    const results = await MentionService.searchMentionableEntities(query, {
      types: types || ['user', 'project', 'scopeItem', 'task'],
      projectId,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: results,
      query,
      count: results.length
    });
  } catch (error) {
    console.error('❌ Mention search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search mentions',
      error: error.message
    });
  }
});

/**
 * POST /api/mentions/parse
 * Parse mentions from content
 */
router.post('/parse', [
  body('content').notEmpty().withMessage('Content is required'),
  body('projectId').optional().isUUID().withMessage('Project ID must be a valid UUID')
], handleValidationErrors, async (req, res) => {
  try {
    const { content, projectId } = req.body;

    const mentions = await MentionService.parseMentions(content, projectId);

    res.json({
      success: true,
      data: mentions,
      summary: {
        users: mentions.users.length,
        projects: mentions.projects.length,
        scopeItems: mentions.scopeItems.length,
        tasks: mentions.tasks.length,
        total: mentions.rawMentions.length
      }
    });
  } catch (error) {
    console.error('❌ Parse mentions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to parse mentions',
      error: error.message
    });
  }
});

/**
 * POST /api/mentions/process
 * Process mentions and send notifications
 */
router.post('/process', [
  body('content').notEmpty().withMessage('Content is required'),
  body('entityType').isIn(['project', 'task', 'scope_item', 'comment']).withMessage('Invalid entity type'),
  body('entityId').isUUID().withMessage('Entity ID must be a valid UUID'),
  body('projectId').optional().isUUID().withMessage('Project ID must be a valid UUID'),
  body('sendNotifications').optional().isBoolean().withMessage('Send notifications must be boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const { content, entityType, entityId, projectId, sendNotifications = true } = req.body;
    const userId = req.user.id;

    const mentions = await MentionService.processMentions(content, entityType, entityId, userId, {
      projectId,
      sendNotifications
    });

    res.json({
      success: true,
      data: mentions,
      notificationsSent: sendNotifications ? mentions.users.length : 0,
      message: `Processed ${mentions.rawMentions.length} mentions`
    });
  } catch (error) {
    console.error('❌ Process mentions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process mentions',
      error: error.message
    });
  }
});

/**
 * GET /api/mentions/suggestions
 * Get mention suggestions for user
 */
router.get('/suggestions', [
  query('projectId').optional().isUUID().withMessage('Project ID must be a valid UUID')
], handleValidationErrors, async (req, res) => {
  try {
    const { projectId } = req.query;
    const userId = req.user.id;

    const suggestions = await MentionService.getMentionSuggestions(userId, projectId);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('❌ Get mention suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mention suggestions',
      error: error.message
    });
  }
});

/**
 * GET /api/mentions/analytics/:projectId
 * Get mention analytics for project
 */
router.get('/analytics/:projectId', [
  param('projectId').isUUID().withMessage('Project ID must be a valid UUID'),
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date')
], handleValidationErrors, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { startDate, endDate } = req.query;

    const analytics = await MentionService.getMentionAnalytics(projectId, {
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('❌ Get mention analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mention analytics',
      error: error.message
    });
  }
});

/**
 * POST /api/mentions/format
 * Format mentions in content
 */
router.post('/format', [
  body('content').notEmpty().withMessage('Content is required'),
  body('mentions').isObject().withMessage('Mentions object is required'),
  body('projectId').optional().isUUID().withMessage('Project ID must be a valid UUID')
], handleValidationErrors, async (req, res) => {
  try {
    const { content, mentions } = req.body;

    const formattedContent = MentionService.formatMentions(content, mentions);

    res.json({
      success: true,
      data: {
        original: content,
        formatted: formattedContent
      }
    });
  } catch (error) {
    console.error('❌ Format mentions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to format mentions',
      error: error.message
    });
  }
});

module.exports = router;