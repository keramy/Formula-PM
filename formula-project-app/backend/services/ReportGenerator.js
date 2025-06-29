/**
 * Formula PM Report Generator Service
 * Advanced PDF generation with analytics, charts, and export capabilities
 */

const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');
const moment = require('moment');
const cacheService = require('./cacheService');
const auditService = require('./auditService');
const ProjectService = require('./ProjectService');
const WorkflowEngine = require('./WorkflowEngine');

// Optional chart functionality - graceful fallback if not available
let ChartJSNodeCanvas;
try {
  const chartjs = require('chartjs-node-canvas');
  ChartJSNodeCanvas = chartjs.ChartJSNodeCanvas;
} catch (error) {
  console.log('⚠️  Chart generation not available - install chartjs-node-canvas for full functionality');
  ChartJSNodeCanvas = null;
}

// Will be initialized with shared database service
let prisma = null;
class ReportGenerator {
  constructor() {
    this.config = {
      outputDir: path.join(__dirname, '../generated-reports'),
      templatesDir: path.join(__dirname, '../templates/reports'),
      chartConfig: {
        width: 800,
        height: 400,
        backgroundColour: 'white',
        plugins: {
          requireLegacy: ['chartjs-adapter-moment']
        }
      },
      pdfOptions: {
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      },
      reportTypes: {
        project_summary: {
          name: 'Project Summary Report',
          description: 'Comprehensive project overview with metrics and progress',
          template: 'project-summary'
        },
        workflow_analysis: {
          name: 'Workflow Analysis Report',
          description: 'Detailed workflow connections and production readiness',
          template: 'workflow-analysis'
        },
        financial_summary: {
          name: 'Financial Summary Report',
          description: 'Budget tracking, costs, and financial projections',
          template: 'financial-summary'
        },
        team_performance: {
          name: 'Team Performance Report',
          description: 'Team productivity, task completion, and resource utilization',
          template: 'team-performance'
        },
        executive_dashboard: {
          name: 'Executive Dashboard',
          description: 'High-level overview for management and stakeholders',
          template: 'executive-dashboard'
        },
        client_report: {
          name: 'Client Progress Report',
          description: 'Client-facing progress report with key milestones',
          template: 'client-report'
        }
      },
      cacheSettings: {
        reportDataTTL: 300, // 5 minutes
        chartTTL: 600 // 10 minutes
      }
    };

    // Initialize chart renderer only if available
    this.chartRenderer = ChartJSNodeCanvas ? new ChartJSNodeCanvas(this.config.chartConfig) : null;
    this.ensureDirectories();
  }

  /**
   * Set the shared Prisma client
   */
  setPrismaClient(prismaClient) {
    prisma = prismaClient;
  }

  /**
   * Ensure required directories exist
   */
  async ensureDirectories() {
    try {
      await fs.mkdir(this.config.outputDir, { recursive: true });
      await fs.mkdir(this.config.templatesDir, { recursive: true });
    } catch (error) {
      console.error('❌ Create directories error:', error);
    }
  }

  /**
   * Generate project summary report
   */
  async generateProjectSummaryReport(projectId, options = {}) {
    try {
      const {
        includeCharts = true,
        includeWorkflow = true,
        includeFinancials = true,
        format = 'pdf'
      } = options;

      console.log(`📊 Generating project summary report for project ${projectId}`);

      // Get comprehensive project data
      const projectData = await this.getProjectReportData(projectId);
      
      if (!projectData.project) {
        throw new Error('Project not found');
      }

      // Generate charts if requested
      let charts = {};
      if (includeCharts) {
        charts = await this.generateProjectCharts(projectData);
      }

      // Create PDF report
      const reportBuffer = await this.createProjectSummaryPDF(projectData, charts, {
        includeWorkflow,
        includeFinancials
      });

      // Save report file
      const fileName = `project-summary-${projectId}-${Date.now()}.pdf`;
      const filePath = path.join(this.config.outputDir, fileName);
      await fs.writeFile(filePath, reportBuffer);

      // Log report generation
      await auditService.logSystemEvent({
        event: 'report_generated',
        description: `Project summary report generated for ${projectData.project.name}`,
        metadata: {
          projectId,
          reportType: 'project_summary',
          fileName,
          fileSize: reportBuffer.length,
          includeCharts,
          includeWorkflow,
          includeFinancials
        }
      });

      return {
        success: true,
        fileName,
        filePath,
        fileSize: reportBuffer.length,
        reportData: projectData
      };
    } catch (error) {
      console.error('❌ Generate project summary report error:', error);
      throw error;
    }
  }

  /**
   * Generate workflow analysis report
   */
  async generateWorkflowAnalysisReport(projectId, options = {}) {
    try {
      const { includeRecommendations = true } = options;

      console.log(`🔄 Generating workflow analysis report for project ${projectId}`);

      // Get workflow analysis data
      const workflowData = await WorkflowEngine.analyzeWorkflow(projectId);
      const projectData = await ProjectService.getProjectDetails(projectId);

      // Generate workflow charts
      const charts = await this.generateWorkflowCharts(workflowData);

      // Create PDF report
      const reportBuffer = await this.createWorkflowAnalysisPDF(
        projectData, 
        workflowData, 
        charts, 
        { includeRecommendations }
      );

      // Save report file
      const fileName = `workflow-analysis-${projectId}-${Date.now()}.pdf`;
      const filePath = path.join(this.config.outputDir, fileName);
      await fs.writeFile(filePath, reportBuffer);

      await auditService.logSystemEvent({
        event: 'report_generated',
        description: `Workflow analysis report generated for ${projectData.name}`,
        metadata: {
          projectId,
          reportType: 'workflow_analysis',
          fileName,
          fileSize: reportBuffer.length,
          workflowConnections: workflowData.overview.connectedItems,
          readinessRate: workflowData.readiness.readinessRate
        }
      });

      return {
        success: true,
        fileName,
        filePath,
        fileSize: reportBuffer.length,
        workflowData
      };
    } catch (error) {
      console.error('❌ Generate workflow analysis report error:', error);
      throw error;
    }
  }

  /**
   * Generate executive dashboard report
   */
  async generateExecutiveDashboard(options = {}) {
    try {
      const {
        dateRange = 'last_30_days',
        includeProjectList = true,
        includeMetrics = true
      } = options;

      console.log('📈 Generating executive dashboard report');

      // Get executive-level data
      const dashboardData = await this.getExecutiveDashboardData(dateRange);

      // Generate executive charts
      const charts = await this.generateExecutiveCharts(dashboardData);

      // Create PDF report
      const reportBuffer = await this.createExecutiveDashboardPDF(
        dashboardData, 
        charts, 
        { includeProjectList, includeMetrics }
      );

      // Save report file
      const fileName = `executive-dashboard-${Date.now()}.pdf`;
      const filePath = path.join(this.config.outputDir, fileName);
      await fs.writeFile(filePath, reportBuffer);

      await auditService.logSystemEvent({
        event: 'report_generated',
        description: 'Executive dashboard report generated',
        metadata: {
          reportType: 'executive_dashboard',
          fileName,
          fileSize: reportBuffer.length,
          dateRange,
          totalProjects: dashboardData.overview.totalProjects,
          activeProjects: dashboardData.overview.activeProjects
        }
      });

      return {
        success: true,
        fileName,
        filePath,
        fileSize: reportBuffer.length,
        dashboardData
      };
    } catch (error) {
      console.error('❌ Generate executive dashboard error:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive project data for reporting
   */
  async getProjectReportData(projectId) {
    try {
      const cacheKey = cacheService.generateKey('report', 'project_data', projectId);
      
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const [project, workflowAnalysis, teamData] = await Promise.all([
        ProjectService.getProjectDetails(projectId),
        WorkflowEngine.analyzeWorkflow(projectId),
        ProjectService.getProjectTeam(projectId)
      ]);

      // Get additional analytics
      const analytics = await this.calculateProjectAnalytics(projectId);

      const reportData = {
        project,
        workflow: workflowAnalysis,
        team: teamData,
        analytics,
        generatedAt: new Date(),
        generatedBy: 'system'
      };

      await cacheService.set(cacheKey, reportData, this.config.cacheSettings.reportDataTTL);
      return reportData;
    } catch (error) {
      console.error('❌ Get project report data error:', error);
      throw error;
    }
  }

  /**
   * Get executive dashboard data
   */
  async getExecutiveDashboardData(dateRange) {
    try {
      const { startDate, endDate } = this.parseDateRange(dateRange);

      const [projectsOverview, financialSummary, teamMetrics, recentActivity] = await Promise.all([
        this.getProjectsOverview(startDate, endDate),
        this.getFinancialSummary(startDate, endDate),
        this.getTeamMetrics(startDate, endDate),
        this.getRecentActivity(startDate, endDate)
      ]);

      return {
        overview: projectsOverview,
        financial: financialSummary,
        team: teamMetrics,
        activity: recentActivity,
        dateRange: { startDate, endDate },
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('❌ Get executive dashboard data error:', error);
      throw error;
    }
  }

  /**
   * Calculate project analytics
   */
  async calculateProjectAnalytics(projectId) {
    try {
      // Get tasks and timeline data
      const tasks = await prisma.task.findMany({
        where: { projectId },
        include: {
          assignee: {
            select: { firstName: true, lastName: true }
          }
        }
      });

      // Calculate completion trends
      const completionTrends = await this.calculateCompletionTrends(projectId);
      
      // Calculate resource utilization
      const resourceUtilization = await this.calculateResourceUtilization(projectId);

      // Calculate milestone progress
      const milestoneProgress = await this.calculateMilestoneProgress(projectId);

      return {
        taskStats: {
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'completed').length,
          inProgress: tasks.filter(t => t.status === 'in_progress').length,
          overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
        },
        completionTrends,
        resourceUtilization,
        milestoneProgress,
        averageTaskDuration: this.calculateAverageTaskDuration(tasks),
        productivityScore: this.calculateProductivityScore(tasks)
      };
    } catch (error) {
      console.error('❌ Calculate project analytics error:', error);
      return {};
    }
  }

  /**
   * Generate project charts
   */
  async generateProjectCharts(projectData) {
    try {
      const charts = {};

      // Progress chart
      charts.progressChart = await this.createProgressChart(projectData.project.metrics);

      // Budget chart
      if (projectData.project.metrics.budget) {
        charts.budgetChart = await this.createBudgetChart(projectData.project.metrics.budget);
      }

      // Task status distribution
      if (projectData.project.metrics.statusBreakdown.tasks) {
        charts.taskStatusChart = await this.createStatusDistributionChart(
          projectData.project.metrics.statusBreakdown.tasks,
          'Task Status Distribution'
        );
      }

      // Team skills chart
      if (projectData.team.skillsMatrix) {
        charts.skillsChart = await this.createSkillsChart(projectData.team.skillsMatrix);
      }

      return charts;
    } catch (error) {
      console.error('❌ Generate project charts error:', error);
      return {};
    }
  }

  /**
   * Generate workflow charts
   */
  async generateWorkflowCharts(workflowData) {
    try {
      const charts = {};

      // Readiness chart
      charts.readinessChart = await this.createReadinessChart(workflowData.readiness);

      // Blockers chart
      if (workflowData.blockers.total > 0) {
        charts.blockersChart = await this.createBlockersChart(workflowData.blockers);
      }

      // Timeline chart
      if (workflowData.timeline.hasTimeline) {
        charts.timelineChart = await this.createTimelineChart(workflowData.timeline);
      }

      return charts;
    } catch (error) {
      console.error('❌ Generate workflow charts error:', error);
      return {};
    }
  }

  /**
   * Generate executive charts
   */
  async generateExecutiveCharts(dashboardData) {
    try {
      const charts = {};

      // Projects overview chart
      charts.projectsOverviewChart = await this.createProjectsOverviewChart(dashboardData.overview);

      // Financial trends chart
      if (dashboardData.financial.trends) {
        charts.financialTrendsChart = await this.createFinancialTrendsChart(dashboardData.financial.trends);
      }

      // Team utilization chart
      charts.teamUtilizationChart = await this.createTeamUtilizationChart(dashboardData.team);

      return charts;
    } catch (error) {
      console.error('❌ Generate executive charts error:', error);
      return {};
    }
  }

  /**
   * Create progress chart
   */
  async createProgressChart(metrics) {
    try {
      const configuration = {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Remaining'],
          datasets: [{
            data: [metrics.progress.overall, 100 - metrics.progress.overall],
            backgroundColor: ['#10B981', '#E5E7EB'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Project Progress'
            }
          }
        }
      };

      return await this.chartRenderer.renderToBuffer(configuration);
    } catch (error) {
      console.error('❌ Create progress chart error:', error);
      return null;
    }
  }

  /**
   * Create budget chart
   */
  async createBudgetChart(budgetData) {
    try {
      const configuration = {
        type: 'bar',
        data: {
          labels: ['Allocated', 'Estimated', 'Actual', 'Remaining'],
          datasets: [{
            label: 'Amount ($)',
            data: [
              budgetData.allocated,
              budgetData.estimated,
              budgetData.actual,
              budgetData.remaining
            ],
            backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444', '#10B981']
          }]
        },
        options: {
          responsive: false,
          plugins: {
            title: {
              display: true,
              text: 'Budget Analysis'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      };

      return await this.chartRenderer.renderToBuffer(configuration);
    } catch (error) {
      console.error('❌ Create budget chart error:', error);
      return null;
    }
  }

  /**
   * Create status distribution chart
   */
  async createStatusDistributionChart(statusData, title) {
    try {
      const labels = Object.keys(statusData);
      const data = Object.values(statusData);
      const colors = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

      const configuration = {
        type: 'pie',
        data: {
          labels: labels.map(label => label.replace('_', ' ').toUpperCase()),
          datasets: [{
            data,
            backgroundColor: colors.slice(0, labels.length)
          }]
        },
        options: {
          responsive: false,
          plugins: {
            title: {
              display: true,
              text: title
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      };

      return await this.chartRenderer.renderToBuffer(configuration);
    } catch (error) {
      console.error('❌ Create status distribution chart error:', error);
      return null;
    }
  }

  /**
   * Create project summary PDF
   */
  async createProjectSummaryPDF(projectData, charts, options) {
    try {
      const doc = new PDFDocument(this.config.pdfOptions);
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));

      // Add header
      this.addPDFHeader(doc, 'Project Summary Report', projectData.project.name);

      // Add project overview
      this.addProjectOverview(doc, projectData.project);

      // Add charts
      if (charts.progressChart) {
        doc.addPage();
        doc.fontSize(16).text('Project Progress', 50, 50);
        doc.image(charts.progressChart, 50, 80, { width: 400 });
      }

      if (charts.budgetChart && options.includeFinancials) {
        doc.addPage();
        doc.fontSize(16).text('Budget Analysis', 50, 50);
        doc.image(charts.budgetChart, 50, 80, { width: 500 });
      }

      // Add workflow section
      if (options.includeWorkflow && projectData.workflow) {
        doc.addPage();
        this.addWorkflowSection(doc, projectData.workflow);
      }

      // Add team section
      doc.addPage();
      this.addTeamSection(doc, projectData.team);

      // Add footer
      this.addPDFFooter(doc);

      doc.end();

      return new Promise((resolve) => {
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });
      });
    } catch (error) {
      console.error('❌ Create project summary PDF error:', error);
      throw error;
    }
  }

  /**
   * Create workflow analysis PDF
   */
  async createWorkflowAnalysisPDF(projectData, workflowData, charts, options) {
    try {
      const doc = new PDFDocument(this.config.pdfOptions);
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));

      // Add header
      this.addPDFHeader(doc, 'Workflow Analysis Report', projectData.name);

      // Add workflow overview
      this.addWorkflowOverview(doc, workflowData);

      // Add readiness analysis
      doc.addPage();
      this.addReadinessAnalysis(doc, workflowData.readiness);

      // Add blockers section
      if (workflowData.blockers.total > 0) {
        doc.addPage();
        this.addBlockersSection(doc, workflowData.blockers);
      }

      // Add recommendations
      if (options.includeRecommendations && workflowData.recommendations.length > 0) {
        doc.addPage();
        this.addRecommendationsSection(doc, workflowData.recommendations);
      }

      // Add charts
      if (charts.readinessChart) {
        doc.addPage();
        doc.fontSize(16).text('Production Readiness', 50, 50);
        doc.image(charts.readinessChart, 50, 80, { width: 400 });
      }

      this.addPDFFooter(doc);
      doc.end();

      return new Promise((resolve) => {
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });
      });
    } catch (error) {
      console.error('❌ Create workflow analysis PDF error:', error);
      throw error;
    }
  }

  /**
   * Create executive dashboard PDF
   */
  async createExecutiveDashboardPDF(dashboardData, charts, options) {
    try {
      const doc = new PDFDocument(this.config.pdfOptions);
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));

      // Add header
      this.addPDFHeader(doc, 'Executive Dashboard', 'Company Overview');

      // Add executive summary
      this.addExecutiveSummary(doc, dashboardData.overview);

      // Add financial overview
      if (options.includeMetrics) {
        doc.addPage();
        this.addFinancialOverview(doc, dashboardData.financial);
      }

      // Add team metrics
      doc.addPage();
      this.addTeamMetrics(doc, dashboardData.team);

      // Add charts
      if (charts.projectsOverviewChart) {
        doc.addPage();
        doc.fontSize(16).text('Projects Overview', 50, 50);
        doc.image(charts.projectsOverviewChart, 50, 80, { width: 400 });
      }

      // Add project list
      if (options.includeProjectList && dashboardData.overview.projectsList) {
        doc.addPage();
        this.addProjectsList(doc, dashboardData.overview.projectsList);
      }

      this.addPDFFooter(doc);
      doc.end();

      return new Promise((resolve) => {
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });
      });
    } catch (error) {
      console.error('❌ Create executive dashboard PDF error:', error);
      throw error;
    }
  }

  /**
   * Add PDF header
   */
  addPDFHeader(doc, title, subtitle) {
    doc.fontSize(24).text(title, 50, 50);
    if (subtitle) {
      doc.fontSize(14).text(subtitle, 50, 80);
    }
    doc.fontSize(10).text(`Generated on ${moment().format('MMMM DD, YYYY [at] HH:mm')}`, 50, 105);
    doc.moveTo(50, 130).lineTo(550, 130).stroke();
  }

  /**
   * Add PDF footer
   */
  addPDFFooter(doc) {
    const bottom = 750;
    doc.fontSize(8)
       .text('Formula PM - Project Management System', 50, bottom)
       .text(`Page ${doc.bufferedPageRange().count}`, 500, bottom);
  }

  /**
   * Add project overview section
   */
  addProjectOverview(doc, project) {
    let y = 150;
    
    doc.fontSize(18).text('Project Overview', 50, y);
    y += 30;

    doc.fontSize(12)
       .text(`Status: ${project.status.toUpperCase()}`, 50, y)
       .text(`Priority: ${project.priority.toUpperCase()}`, 300, y);
    y += 20;

    doc.text(`Type: ${project.type}`, 50, y)
       .text(`Progress: ${project.progress}%`, 300, y);
    y += 20;

    if (project.budget) {
      doc.text(`Budget: $${project.budget.toLocaleString()}`, 50, y);
      y += 20;
    }

    if (project.startDate && project.endDate) {
      doc.text(`Timeline: ${moment(project.startDate).format('MMM DD, YYYY')} - ${moment(project.endDate).format('MMM DD, YYYY')}`, 50, y);
      y += 20;
    }

    if (project.description) {
      y += 10;
      doc.fontSize(14).text('Description:', 50, y);
      y += 20;
      doc.fontSize(11).text(project.description, 50, y, { width: 500 });
    }
  }

  /**
   * Add workflow section
   */
  addWorkflowSection(doc, workflowData) {
    let y = 50;
    
    doc.fontSize(18).text('Workflow Analysis', 50, y);
    y += 30;

    doc.fontSize(12)
       .text(`Total Scope Items: ${workflowData.overview.totalScopeItems}`, 50, y)
       .text(`Connected Items: ${workflowData.overview.connectedItems}`, 300, y);
    y += 20;

    doc.text(`Connection Rate: ${workflowData.overview.connectionRate}%`, 50, y)
       .text(`Ready for Production: ${workflowData.readiness.readyForProduction}`, 300, y);
    y += 30;

    if (workflowData.blockers.total > 0) {
      doc.fontSize(14).text('Active Blockers:', 50, y);
      y += 20;
      doc.fontSize(12).text(`Critical: ${workflowData.blockers.critical}`, 50, y)
         .text(`Warning: ${workflowData.blockers.warning}`, 200, y);
    }
  }

  /**
   * Add team section
   */
  addTeamSection(doc, teamData) {
    let y = 50;
    
    doc.fontSize(18).text('Team Information', 50, y);
    y += 30;

    doc.fontSize(12).text(`Total Members: ${teamData.totalMembers}`, 50, y);
    y += 30;

    if (teamData.roleDistribution) {
      doc.fontSize(14).text('Role Distribution:', 50, y);
      y += 20;
      Object.entries(teamData.roleDistribution).forEach(([role, count]) => {
        doc.fontSize(11).text(`${role}: ${count}`, 70, y);
        y += 15;
      });
    }
  }

  /**
   * Helper methods for data processing
   */
  parseDateRange(dateRange) {
    const endDate = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case 'last_7_days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'last_30_days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'last_90_days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case 'last_year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    return { startDate, endDate };
  }

  async getProjectsOverview(startDate, endDate) {
    const projects = await prisma.project.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        client: { select: { name: true } }
      }
    });

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      onHoldProjects: projects.filter(p => p.status === 'on_hold').length,
      projectsList: projects.slice(0, 10) // Top 10 for reports
    };
  }

  async getFinancialSummary(startDate, endDate) {
    const projects = await prisma.project.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        budget: true,
        status: true
      }
    });

    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
    const activeBudget = projects
      .filter(p => p.status === 'active')
      .reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);

    return {
      totalBudget,
      activeBudget,
      averageProjectBudget: projects.length > 0 ? totalBudget / projects.length : 0
    };
  }

  async getTeamMetrics(startDate, endDate) {
    const totalUsers = await prisma.user.count({
      where: { status: 'active' }
    });

    const projectManagers = await prisma.user.count({
      where: { 
        role: 'project_manager',
        status: 'active'
      }
    });

    return {
      totalUsers,
      projectManagers,
      utilization: 85 // This would be calculated based on actual workload
    };
  }

  async getRecentActivity(startDate, endDate) {
    // Get recent audit logs for activity summary
    const recentLogs = await prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    return {
      totalActivities: recentLogs.length,
      recentActions: recentLogs.slice(0, 10)
    };
  }

  // Additional helper methods would be implemented for:
  // - calculateCompletionTrends
  // - calculateResourceUtilization
  // - calculateMilestoneProgress
  // - calculateAverageTaskDuration
  // - calculateProductivityScore
  // - Additional chart creation methods
  // - More PDF section methods

  /**
   * Get available report types
   */
  getAvailableReportTypes() {
    return this.config.reportTypes;
  }

  /**
   * Get report generation status
   */
  async getReportStatus(fileName) {
    try {
      const filePath = path.join(this.config.outputDir, fileName);
      const stats = await fs.stat(filePath);
      return {
        exists: true,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message
      };
    }
  }

  /**
   * Clean up old reports
   */
  async cleanupOldReports(daysOld = 30) {
    try {
      const files = await fs.readdir(this.config.outputDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      let deletedCount = 0;
      for (const file of files) {
        const filePath = path.join(this.config.outputDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.birthtime < cutoffDate) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      console.log(`🧹 Cleaned up ${deletedCount} old report files`);
      return deletedCount;
    } catch (error) {
      console.error('❌ Cleanup old reports error:', error);
      throw error;
    }
  }
}

module.exports = new ReportGenerator();