/**
 * Formula PM Analytics Service
 * Advanced business intelligence with KPIs, trends, and predictive analytics
 */

const cacheService = require('./cacheService');
const auditService = require('./auditService');
const moment = require('moment');
const _ = require('lodash');

// Will be initialized with shared database service
let prisma = null;
class AnalyticsService {
  constructor() {
    this.config = {
      cacheTTL: 900, // 15 minutes
      kpiRefreshInterval: 3600000, // 1 hour in milliseconds
      trendAnalysisPeriods: {
        daily: 30,    // Last 30 days
        weekly: 12,   // Last 12 weeks
        monthly: 12,  // Last 12 months
        quarterly: 8  // Last 8 quarters
      },
      performanceThresholds: {
        projectCompletion: {
          excellent: 95,
          good: 85,
          fair: 70,
          poor: 50
        },
        budgetVariance: {
          excellent: 5,   // Within 5%
          good: 10,       // Within 10%
          fair: 20,       // Within 20%
          poor: 30        // Within 30%
        },
        timelineAdherence: {
          excellent: 95,
          good: 85,
          fair: 70,
          poor: 50
        }
      },
      predictiveModels: {
        projectSuccessProbability: {
          factors: ['teamSize', 'budget', 'complexity', 'clientType', 'timeline'],
          weights: [0.2, 0.25, 0.3, 0.1, 0.15]
        },
        resourceDemand: {
          lookAheadDays: 90,
          confidenceInterval: 0.8
        }
      }
    };

    this.kpiCache = new Map();
    this.lastKpiRefresh = 0;
  }

  /**
   * Set the shared Prisma client
   */
  setPrismaClient(prismaClient) {
    prisma = prismaClient;
  }

  /**
   * Get comprehensive dashboard analytics
   */
  async getDashboardAnalytics(options = {}) {
    try {
      const {
        dateRange = 'last_30_days',
        userId = null,
        projectIds = null,
        includeForecasts = true
      } = options;

      console.log(`📊 Generating dashboard analytics for ${dateRange}`);

      const { startDate, endDate } = this.parseDateRange(dateRange);

      const [
        kpis,
        trends,
        performance,
        projectAnalytics,
        teamAnalytics,
        financialAnalytics,
        forecasts
      ] = await Promise.all([
        this.getKPIs(startDate, endDate, projectIds),
        this.getTrendAnalysis(dateRange, projectIds),
        this.getPerformanceMetrics(startDate, endDate, projectIds),
        this.getProjectAnalytics(startDate, endDate, projectIds),
        this.getTeamAnalytics(startDate, endDate),
        this.getFinancialAnalytics(startDate, endDate, projectIds),
        includeForecasts ? this.getForecasts(projectIds) : null
      ]);

      const analytics = {
        kpis,
        trends,
        performance,
        projects: projectAnalytics,
        team: teamAnalytics,
        financial: financialAnalytics,
        forecasts,
        generatedAt: new Date(),
        dateRange: { startDate, endDate }
      };

      // Log analytics access
      await auditService.logSystemEvent({
        event: 'analytics_accessed',
        description: 'Dashboard analytics generated',
        metadata: {
          dateRange,
          userId,
          projectIds: projectIds?.length || 'all',
          includeForecasts
        }
      });

      return analytics;
    } catch (error) {
      console.error('❌ Get dashboard analytics error:', error);
      throw error;
    }
  }

  /**
   * Get Key Performance Indicators (KPIs)
   */
  async getKPIs(startDate, endDate, projectIds = null) {
    try {
      const cacheKey = cacheService.generateKey('analytics', 'kpis', 
        `${startDate.toISOString()}_${endDate.toISOString()}_${projectIds ? projectIds.join('_') : 'all'}`);

      const cached = await cacheService.get(cacheKey);
      if (cached && Date.now() - this.lastKpiRefresh < this.config.kpiRefreshInterval) {
        return cached;
      }

      const whereClause = {
        createdAt: { gte: startDate, lte: endDate },
        ...(projectIds && { id: { in: projectIds } })
      };

      const [
        totalProjects,
        activeProjects,
        completedProjects,
        onTimeProjects,
        budgetCompliantProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        totalBudget,
        spentBudget,
        teamUtilization
      ] = await Promise.all([
        prisma.project.count({ where: whereClause }),
        prisma.project.count({ where: { ...whereClause, status: 'active' } }),
        prisma.project.count({ where: { ...whereClause, status: 'completed' } }),
        this.getOnTimeProjectsCount(startDate, endDate, projectIds),
        this.getBudgetCompliantProjectsCount(startDate, endDate, projectIds),
        this.getTotalTasksCount(startDate, endDate, projectIds),
        this.getCompletedTasksCount(startDate, endDate, projectIds),
        this.getOverdueTasksCount(projectIds),
        this.getTotalBudget(startDate, endDate, projectIds),
        this.getSpentBudget(startDate, endDate, projectIds),
        this.getTeamUtilizationRate()
      ]);

      const kpis = {
        projects: {
          total: totalProjects,
          active: activeProjects,
          completed: completedProjects,
          completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
          onTimeRate: totalProjects > 0 ? Math.round((onTimeProjects / totalProjects) * 100) : 0
        },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          overdue: overdueTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        },
        financial: {
          totalBudget,
          spentBudget,
          remainingBudget: totalBudget - spentBudget,
          spendingRate: totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0,
          budgetCompliance: totalProjects > 0 ? Math.round((budgetCompliantProjects / totalProjects) * 100) : 0
        },
        team: {
          utilization: teamUtilization,
          efficiency: await this.calculateTeamEfficiency(startDate, endDate),
          productivity: await this.calculateTeamProductivity(startDate, endDate)
        }
      };

      // Cache KPIs
      await cacheService.set(cacheKey, kpis, this.config.cacheTTL);
      this.lastKpiRefresh = Date.now();

      return kpis;
    } catch (error) {
      console.error('❌ Get KPIs error:', error);
      throw error;
    }
  }

  /**
   * Get trend analysis for various metrics
   */
  async getTrendAnalysis(period, projectIds = null) {
    try {
      const trends = {
        projectCreation: await this.getProjectCreationTrend(period, projectIds),
        taskCompletion: await this.getTaskCompletionTrend(period, projectIds),
        budgetSpending: await this.getBudgetSpendingTrend(period, projectIds),
        teamProductivity: await this.getTeamProductivityTrend(period),
        clientSatisfaction: await this.getClientSatisfactionTrend(period, projectIds)
      };

      // Calculate trend directions
      Object.keys(trends).forEach(trendKey => {
        if (trends[trendKey] && trends[trendKey].length > 1) {
          trends[trendKey] = this.addTrendDirection(trends[trendKey]);
        }
      });

      return trends;
    } catch (error) {
      console.error('❌ Get trend analysis error:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(startDate, endDate, projectIds = null) {
    try {
      const [
        projectPerformance,
        teamPerformance,
        workflowEfficiency,
        qualityMetrics
      ] = await Promise.all([
        this.getProjectPerformanceMetrics(startDate, endDate, projectIds),
        this.getTeamPerformanceMetrics(startDate, endDate),
        this.getWorkflowEfficiencyMetrics(startDate, endDate, projectIds),
        this.getQualityMetrics(startDate, endDate, projectIds)
      ]);

      return {
        projects: projectPerformance,
        team: teamPerformance,
        workflow: workflowEfficiency,
        quality: qualityMetrics,
        overallScore: this.calculateOverallPerformanceScore([
          projectPerformance,
          teamPerformance,
          workflowEfficiency,
          qualityMetrics
        ])
      };
    } catch (error) {
      console.error('❌ Get performance metrics error:', error);
      throw error;
    }
  }

  /**
   * Get project-specific analytics
   */
  async getProjectAnalytics(startDate, endDate, projectIds = null) {
    try {
      const whereClause = {
        createdAt: { gte: startDate, lte: endDate },
        ...(projectIds && { id: { in: projectIds } })
      };

      const projects = await prisma.project.findMany({
        where: whereClause,
        include: {
          client: { select: { id: true, name: true, type: true } },
          teamMembers: { include: { user: { select: { role: true } } } },
          tasks: { select: { status: true, priority: true, estimatedHours: true, actualHours: true } },
          scopeItems: { select: { status: true, completionPercentage: true } },
          _count: {
            select: {
              tasks: true,
              scopeItems: true,
              shopDrawings: true,
              materialSpecs: true
            }
          }
        }
      });

      const analytics = {
        byStatus: _.countBy(projects, 'status'),
        byType: _.countBy(projects, 'type'),
        byPriority: _.countBy(projects, 'priority'),
        byClient: this.groupProjectsByClient(projects),
        averageTeamSize: projects.length > 0 ? 
          Math.round(projects.reduce((sum, p) => sum + p.teamMembers.length, 0) / projects.length) : 0,
        averageTaskCount: projects.length > 0 ?
          Math.round(projects.reduce((sum, p) => sum + p._count.tasks, 0) / projects.length) : 0,
        topPerformers: await this.getTopPerformingProjects(projects),
        riskAnalysis: await this.analyzeProjectRisks(projects)
      };

      return analytics;
    } catch (error) {
      console.error('❌ Get project analytics error:', error);
      throw error;
    }
  }

  /**
   * Get team analytics
   */
  async getTeamAnalytics(startDate, endDate) {
    try {
      const users = await prisma.user.findMany({
        where: { status: 'active' },
        include: {
          assignedTasks: {
            where: {
              createdAt: { gte: startDate, lte: endDate }
            }
          },
          teamMemberships: {
            include: {
              project: {
                select: { status: true, priority: true }
              }
            }
          }
        }
      });

      const analytics = {
        totalMembers: users.length,
        byRole: _.countBy(users, 'role'),
        byDepartment: _.countBy(users, 'department'),
        utilization: this.calculateTeamUtilization(users),
        productivity: this.calculateTeamProductivityMetrics(users),
        workloadDistribution: this.analyzeWorkloadDistribution(users),
        topPerformers: this.identifyTopPerformers(users),
        skillsAnalysis: this.analyzeTeamSkills(users)
      };

      return analytics;
    } catch (error) {
      console.error('❌ Get team analytics error:', error);
      throw error;
    }
  }

  /**
   * Get financial analytics
   */
  async getFinancialAnalytics(startDate, endDate, projectIds = null) {
    try {
      const whereClause = {
        createdAt: { gte: startDate, lte: endDate },
        ...(projectIds && { id: { in: projectIds } })
      };

      const projects = await prisma.project.findMany({
        where: whereClause,
        include: {
          client: { select: { id: true, name: true } },
          scopeItems: {
            select: { estimatedCost: true, actualCost: true }
          },
          tasks: {
            select: { estimatedHours: true, actualHours: true }
          }
        }
      });

      const analytics = {
        revenue: {
          total: this.calculateTotalRevenue(projects),
          byProject: this.calculateRevenueByProject(projects),
          byClient: this.calculateRevenueByClient(projects),
          forecast: await this.forecastRevenue(projects)
        },
        costs: {
          total: this.calculateTotalCosts(projects),
          byCategory: this.calculateCostsByCategory(projects),
          variance: this.calculateCostVariance(projects)
        },
        profitability: {
          margin: this.calculateProfitMargin(projects),
          byProject: this.calculateProfitabilityByProject(projects),
          trends: await this.getProfitabilityTrends(startDate, endDate)
        },
        budgetAnalysis: {
          utilization: this.calculateBudgetUtilization(projects),
          overruns: this.identifyBudgetOverruns(projects),
          savings: this.identifyBudgetSavings(projects)
        }
      };

      return analytics;
    } catch (error) {
      console.error('❌ Get financial analytics error:', error);
      throw error;
    }
  }

  /**
   * Get predictive forecasts
   */
  async getForecasts(projectIds = null) {
    try {
      const forecasts = {
        projectCompletion: await this.forecastProjectCompletions(projectIds),
        resourceDemand: await this.forecastResourceDemand(),
        budgetSpending: await this.forecastBudgetSpending(projectIds),
        teamCapacity: await this.forecastTeamCapacity(),
        riskAssessment: await this.assessProjectRisks(projectIds)
      };

      return forecasts;
    } catch (error) {
      console.error('❌ Get forecasts error:', error);
      return null;
    }
  }

  /**
   * Get client analytics
   */
  async getClientAnalytics(options = {}) {
    try {
      const {
        dateRange = 'last_year',
        clientId = null
      } = options;

      const { startDate, endDate } = this.parseDateRange(dateRange);

      const whereClause = {
        projects: {
          some: {
            createdAt: { gte: startDate, lte: endDate }
          }
        },
        ...(clientId && { id: clientId })
      };

      const clients = await prisma.client.findMany({
        where: whereClause,
        include: {
          projects: {
            where: {
              createdAt: { gte: startDate, lte: endDate }
            },
            include: {
              scopeItems: {
                select: { estimatedCost: true, actualCost: true }
              }
            }
          }
        }
      });

      const analytics = {
        totalClients: clients.length,
        byIndustry: _.countBy(clients, 'industry'),
        byType: _.countBy(clients, 'type'),
        projectVolume: this.analyzeClientProjectVolume(clients),
        revenue: this.analyzeClientRevenue(clients),
        satisfaction: await this.analyzeClientSatisfaction(clients),
        retention: this.analyzeClientRetention(clients),
        growth: this.analyzeClientGrowth(clients)
      };

      return analytics;
    } catch (error) {
      console.error('❌ Get client analytics error:', error);
      throw error;
    }
  }

  /**
   * Generate custom analytics report
   */
  async generateCustomAnalytics(config) {
    try {
      const {
        metrics = [],
        filters = {},
        groupBy = null,
        dateRange = 'last_30_days',
        includeCharts = false
      } = config;

      const { startDate, endDate } = this.parseDateRange(dateRange);

      const analytics = {};

      // Process each requested metric
      for (const metric of metrics) {
        switch (metric) {
          case 'project_status':
            analytics.projectStatus = await this.getProjectStatusAnalytics(startDate, endDate, filters);
            break;
          case 'task_completion':
            analytics.taskCompletion = await this.getTaskCompletionAnalytics(startDate, endDate, filters);
            break;
          case 'budget_performance':
            analytics.budgetPerformance = await this.getBudgetPerformanceAnalytics(startDate, endDate, filters);
            break;
          case 'team_productivity':
            analytics.teamProductivity = await this.getTeamProductivityAnalytics(startDate, endDate, filters);
            break;
          case 'workflow_efficiency':
            analytics.workflowEfficiency = await this.getWorkflowEfficiencyAnalytics(startDate, endDate, filters);
            break;
          default:
            console.warn(`Unknown metric requested: ${metric}`);
        }
      }

      // Group results if requested
      if (groupBy) {
        analytics.groupedResults = await this.groupAnalyticsByDimension(analytics, groupBy);
      }

      return {
        analytics,
        config,
        generatedAt: new Date(),
        dateRange: { startDate, endDate }
      };
    } catch (error) {
      console.error('❌ Generate custom analytics error:', error);
      throw error;
    }
  }

  /**
   * Helper method to parse date ranges
   */
  parseDateRange(dateRange) {
    const endDate = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case 'today':
        startDate = new Date(endDate);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'last_7_days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'last_30_days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'last_90_days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case 'this_month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'last_month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        break;
      case 'this_quarter':
        const quarter = Math.floor(endDate.getMonth() / 3);
        startDate = new Date(endDate.getFullYear(), quarter * 3, 1);
        break;
      case 'last_quarter':
        const lastQuarter = Math.floor(endDate.getMonth() / 3) - 1;
        startDate = new Date(endDate.getFullYear(), lastQuarter * 3, 1);
        endDate = new Date(endDate.getFullYear(), (lastQuarter + 1) * 3, 0);
        break;
      case 'this_year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      case 'last_year':
        startDate = new Date(endDate.getFullYear() - 1, 0, 1);
        endDate = new Date(endDate.getFullYear() - 1, 11, 31);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    return { startDate, endDate };
  }

  // Additional helper methods would be implemented for:
  // - getOnTimeProjectsCount
  // - getBudgetCompliantProjectsCount
  // - getTotalTasksCount
  // - getCompletedTasksCount
  // - getOverdueTasksCount
  // - getTotalBudget
  // - getSpentBudget
  // - getTeamUtilizationRate
  // - calculateTeamEfficiency
  // - calculateTeamProductivity
  // - Various trend analysis methods
  // - Performance calculation methods
  // - Forecasting algorithms
  // - Risk assessment methods

  /**
   * Cache analytics data
   */
  async cacheAnalyticsData(key, data, ttl = null) {
    try {
      const cacheTTL = ttl || this.config.cacheTTL;
      await cacheService.set(key, data, cacheTTL);
    } catch (error) {
      console.error('❌ Cache analytics data error:', error);
    }
  }

  /**
   * Get cached analytics data
   */
  async getCachedAnalyticsData(key) {
    try {
      return await cacheService.get(key);
    } catch (error) {
      console.error('❌ Get cached analytics data error:', error);
      return null;
    }
  }

  /**
   * Clear analytics cache
   */
  async clearAnalyticsCache() {
    try {
      const patterns = [
        cacheService.generateKey('analytics', '*'),
        cacheService.generateKey('kpi', '*'),
        cacheService.generateKey('trend', '*')
      ];

      for (const pattern of patterns) {
        await cacheService.deletePattern(pattern);
      }

      this.kpiCache.clear();
      this.lastKpiRefresh = 0;

      console.log('✅ Analytics cache cleared');
    } catch (error) {
      console.error('❌ Clear analytics cache error:', error);
      throw error;
    }
  }

  /**
   * Get analytics service status
   */
  getServiceStatus() {
    return {
      status: 'operational',
      cacheSize: this.kpiCache.size,
      lastKpiRefresh: new Date(this.lastKpiRefresh),
      nextRefresh: new Date(this.lastKpiRefresh + this.config.kpiRefreshInterval),
      performanceThresholds: this.config.performanceThresholds
    };
  }
}

module.exports = new AnalyticsService();