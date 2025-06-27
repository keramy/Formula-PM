/**
 * Formula PM Reports API Routes
 * RESTful endpoints for report generation and management
 */

const express = require('express');
const router = express.Router();
const ReportGenerator = require('../services/ReportGenerator');
const { verifyToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { query, body, param } = require('express-validator');
const path = require('path');
const fs = require('fs').promises;

// All report routes require authentication
router.use(verifyToken);

/**
 * GET /api/reports/types
 * Get available report types
 */
router.get('/types', async (req, res) => {
  try {
    const reportTypes = ReportGenerator.getAvailableReportTypes();

    res.json({
      success: true,
      data: reportTypes
    });
  } catch (error) {
    console.error('❌ Get report types error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report types',
      error: error.message
    });
  }
});

/**
 * POST /api/reports/project-summary/:projectId
 * Generate project summary report
 */
router.post('/project-summary/:projectId', [
  param('projectId').isUUID().withMessage('Project ID must be a valid UUID'),
  body('includeCharts').optional().isBoolean().withMessage('Include charts must be boolean'),
  body('includeWorkflow').optional().isBoolean().withMessage('Include workflow must be boolean'),
  body('includeFinancials').optional().isBoolean().withMessage('Include financials must be boolean'),
  body('format').optional().isIn(['pdf', 'html']).withMessage('Format must be pdf or html')
], handleValidationErrors, async (req, res) => {
  try {
    const { projectId } = req.params;
    const options = req.body;

    // Check user has access to project
    // This would be implemented based on your access control logic

    console.log(`📊 Generating project summary report for project ${projectId}`);

    const result = await ReportGenerator.generateProjectSummaryReport(projectId, options);

    res.json({
      success: true,
      data: {
        fileName: result.fileName,
        fileSize: result.fileSize,
        downloadUrl: `/api/reports/download/${result.fileName}`,
        generatedAt: new Date()
      },
      message: 'Project summary report generated successfully'
    });
  } catch (error) {
    console.error('❌ Generate project summary report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate project summary report',
      error: error.message
    });
  }
});

/**
 * POST /api/reports/workflow-analysis/:projectId
 * Generate workflow analysis report
 */
router.post('/workflow-analysis/:projectId', [
  param('projectId').isUUID().withMessage('Project ID must be a valid UUID'),
  body('includeRecommendations').optional().isBoolean().withMessage('Include recommendations must be boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const { projectId } = req.params;
    const options = req.body;

    console.log(`🔄 Generating workflow analysis report for project ${projectId}`);

    const result = await ReportGenerator.generateWorkflowAnalysisReport(projectId, options);

    res.json({
      success: true,
      data: {
        fileName: result.fileName,
        fileSize: result.fileSize,
        downloadUrl: `/api/reports/download/${result.fileName}`,
        generatedAt: new Date(),
        workflowSummary: {
          connections: result.workflowData.overview.connectedItems,
          readinessRate: result.workflowData.readiness.readinessRate,
          blockers: result.workflowData.blockers.total
        }
      },
      message: 'Workflow analysis report generated successfully'
    });
  } catch (error) {
    console.error('❌ Generate workflow analysis report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate workflow analysis report',
      error: error.message
    });
  }
});

/**
 * POST /api/reports/executive-dashboard
 * Generate executive dashboard report
 */
router.post('/executive-dashboard', [
  body('dateRange').optional().isIn([
    'last_7_days', 'last_30_days', 'last_90_days', 'this_quarter', 'last_quarter'
  ]).withMessage('Invalid date range'),
  body('includeProjectList').optional().isBoolean().withMessage('Include project list must be boolean'),
  body('includeMetrics').optional().isBoolean().withMessage('Include metrics must be boolean')
], handleValidationErrors, async (req, res) => {
  try {
    // Check user has executive permissions
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for executive dashboard'
      });
    }

    const options = req.body;

    console.log('📈 Generating executive dashboard report');

    const result = await ReportGenerator.generateExecutiveDashboard(options);

    res.json({
      success: true,
      data: {
        fileName: result.fileName,
        fileSize: result.fileSize,
        downloadUrl: `/api/reports/download/${result.fileName}`,
        generatedAt: new Date(),
        dashboardSummary: {
          totalProjects: result.dashboardData.overview.totalProjects,
          activeProjects: result.dashboardData.overview.activeProjects,
          completedProjects: result.dashboardData.overview.completedProjects
        }
      },
      message: 'Executive dashboard report generated successfully'
    });
  } catch (error) {
    console.error('❌ Generate executive dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate executive dashboard',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/download/:fileName
 * Download a generated report
 */
router.get('/download/:fileName', [
  param('fileName').notEmpty().withMessage('File name is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { fileName } = req.params;

    // Security: Only allow downloading files with expected patterns
    if (!fileName.match(/^[a-zA-Z0-9\-_]+\.pdf$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file name'
      });
    }

    const filePath = path.join(__dirname, '../generated-reports', fileName);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'Report file not found'
      });
    }

    // Get file stats
    const stats = await fs.stat(filePath);
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', stats.size);

    // Stream the file
    const fileStream = require('fs').createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('❌ File download error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error downloading file'
        });
      }
    });

  } catch (error) {
    console.error('❌ Download report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/status/:fileName
 * Get report generation status
 */
router.get('/status/:fileName', [
  param('fileName').notEmpty().withMessage('File name is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { fileName } = req.params;

    const status = await ReportGenerator.getReportStatus(fileName);

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('❌ Get report status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report status',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/list
 * Get list of generated reports
 */
router.get('/list', [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isString().withMessage('Type must be a string')
], handleValidationErrors, async (req, res) => {
  try {
    const { limit = 20, type } = req.query;

    // This would typically be stored in database with metadata
    // For now, just list files in the generated-reports directory
    const reportsDir = path.join(__dirname, '../generated-reports');
    
    try {
      const files = await fs.readdir(reportsDir);
      const reportFiles = files.filter(file => file.endsWith('.pdf'));

      const reports = await Promise.all(
        reportFiles.slice(0, parseInt(limit)).map(async (fileName) => {
          const filePath = path.join(reportsDir, fileName);
          const stats = await fs.stat(filePath);
          
          return {
            fileName,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            downloadUrl: `/api/reports/download/${fileName}`
          };
        })
      );

      // Sort by creation date (newest first)
      reports.sort((a, b) => new Date(b.created) - new Date(a.created));

      res.json({
        success: true,
        data: reports,
        total: reportFiles.length,
        hasMore: reportFiles.length > parseInt(limit)
      });
    } catch (error) {
      // Directory doesn't exist or is empty
      res.json({
        success: true,
        data: [],
        total: 0,
        hasMore: false
      });
    }
  } catch (error) {
    console.error('❌ List reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list reports',
      error: error.message
    });
  }
});

/**
 * DELETE /api/reports/:fileName
 * Delete a generated report
 */
router.delete('/:fileName', [
  param('fileName').notEmpty().withMessage('File name is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { fileName } = req.params;

    // Security: Only allow deleting files with expected patterns
    if (!fileName.match(/^[a-zA-Z0-9\-_]+\.pdf$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file name'
      });
    }

    // Check permissions (only admin or file creator)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete reports'
      });
    }

    const filePath = path.join(__dirname, '../generated-reports', fileName);

    try {
      await fs.unlink(filePath);
      
      res.json({
        success: true,
        message: 'Report deleted successfully'
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({
          success: false,
          message: 'Report file not found'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
});

/**
 * POST /api/reports/cleanup
 * Clean up old reports (admin only)
 */
router.post('/cleanup', [
  body('daysOld').optional().isInt({ min: 1, max: 365 }).withMessage('Days old must be between 1 and 365')
], handleValidationErrors, async (req, res) => {
  try {
    // Check admin permissions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { daysOld = 30 } = req.body;

    const deletedCount = await ReportGenerator.cleanupOldReports(parseInt(daysOld));

    res.json({
      success: true,
      data: {
        deletedCount,
        daysOld: parseInt(daysOld)
      },
      message: `Cleaned up ${deletedCount} old reports`
    });
  } catch (error) {
    console.error('❌ Cleanup reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup old reports',
      error: error.message
    });
  }
});

module.exports = router;