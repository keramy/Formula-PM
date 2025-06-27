/**
 * Formula PM Performance Monitoring Service
 * Tracks system performance, metrics, and provides alerts
 */

const os = require('os');
const { performance } = require('perf_hooks');
const cacheService = require('./cacheService');
const auditService = require('./auditService');

class PerformanceMonitoringService {
  constructor() {
    this.isInitialized = false;
    this.metrics = new Map();
    this.alerts = new Map();
    this.thresholds = this.getDefaultThresholds();
    
    // Performance tracking
    this.requestMetrics = {
      totalRequests: 0,
      avgResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestsPerMinute: 0,
      errorRate: 0
    };
    
    this.systemMetrics = {
      cpuUsage: 0,
      memoryUsage: 0,
      freeMemory: 0,
      uptime: 0,
      loadAverage: []
    };
    
    this.databaseMetrics = {
      queryCount: 0,
      avgQueryTime: 0,
      slowQueries: 0,
      connectionPool: 0
    };
    
    this.realtimeMetrics = {
      activeConnections: 0,
      messagesPerSecond: 0,
      averageLatency: 0
    };
    
    // Time-series data for trends
    this.historicalData = {
      cpu: [],
      memory: [],
      requests: [],
      database: []
    };
    
    // Alert configuration
    this.alertRules = [];
    this.alertHistory = [];
    
    // Monitoring intervals
    this.intervals = [];
  }

  /**
   * Get default performance thresholds
   */
  getDefaultThresholds() {
    return {
      cpu: {
        warning: 70,
        critical: 85
      },
      memory: {
        warning: 75,
        critical: 90
      },
      responseTime: {
        warning: 200,
        critical: 500
      },
      errorRate: {
        warning: 5,
        critical: 10
      },
      diskSpace: {
        warning: 80,
        critical: 95
      },
      connections: {
        warning: 80,
        critical: 95
      }
    };
  }

  /**
   * Initialize performance monitoring
   */
  async initialize() {
    try {
      if (this.isInitialized) {
        console.log('✅ Performance Monitoring already initialized');
        return;
      }

      console.log('🚀 Initializing Performance Monitoring Service...');

      // Setup alert rules
      this.setupDefaultAlertRules();

      // Start monitoring intervals
      this.startSystemMonitoring();
      this.startMetricsCollection();
      this.startHealthChecks();

      // Setup data retention cleanup
      this.setupDataRetention();

      this.isInitialized = true;
      console.log('✅ Performance Monitoring Service initialized successfully');

      await auditService.logSystemEvent({
        event: 'performance_monitoring_initialized',
        description: 'Performance monitoring service started',
        metadata: {
          thresholds: this.thresholds,
          alertRules: this.alertRules.length
        }
      });

    } catch (error) {
      console.error('❌ Performance Monitoring initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup default alert rules
   */
  setupDefaultAlertRules() {
    this.alertRules = [
      {
        id: 'high_cpu',
        name: 'High CPU Usage',
        condition: (metrics) => metrics.cpu > this.thresholds.cpu.warning,
        severity: 'warning',
        message: 'CPU usage is above normal levels'
      },
      {
        id: 'critical_cpu',
        name: 'Critical CPU Usage',
        condition: (metrics) => metrics.cpu > this.thresholds.cpu.critical,
        severity: 'critical',
        message: 'CPU usage is critically high'
      },
      {
        id: 'high_memory',
        name: 'High Memory Usage',
        condition: (metrics) => metrics.memory > this.thresholds.memory.warning,
        severity: 'warning',
        message: 'Memory usage is above normal levels'
      },
      {
        id: 'critical_memory',
        name: 'Critical Memory Usage',
        condition: (metrics) => metrics.memory > this.thresholds.memory.critical,
        severity: 'critical',
        message: 'Memory usage is critically high'
      },
      {
        id: 'slow_response',
        name: 'Slow Response Times',
        condition: (metrics) => metrics.avgResponseTime > this.thresholds.responseTime.warning,
        severity: 'warning',
        message: 'API response times are slower than normal'
      },
      {
        id: 'high_error_rate',
        name: 'High Error Rate',
        condition: (metrics) => metrics.errorRate > this.thresholds.errorRate.warning,
        severity: 'warning',
        message: 'Error rate is above normal levels'
      }
    ];
  }

  /**
   * Start system monitoring
   */
  startSystemMonitoring() {
    // Monitor system metrics every 30 seconds
    const systemInterval = setInterval(async () => {
      try {
        await this.collectSystemMetrics();
        await this.checkAlerts();
      } catch (error) {
        console.error('❌ System monitoring error:', error);
      }
    }, 30000);

    this.intervals.push(systemInterval);
  }

  /**
   * Start metrics collection
   */
  startMetricsCollection() {
    // Collect performance metrics every minute
    const metricsInterval = setInterval(async () => {
      try {
        await this.aggregateMetrics();
        await this.saveMetricsToCache();
      } catch (error) {
        console.error('❌ Metrics collection error:', error);
      }
    }, 60000);

    this.intervals.push(metricsInterval);
  }

  /**
   * Start health checks
   */
  startHealthChecks() {
    // Perform comprehensive health check every 5 minutes
    const healthInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('❌ Health check error:', error);
      }
    }, 300000);

    this.intervals.push(healthInterval);
  }

  /**
   * Setup data retention cleanup
   */
  setupDataRetention() {
    // Clean up old metrics every hour
    const cleanupInterval = setInterval(() => {
      try {
        this.cleanupOldMetrics();
      } catch (error) {
        console.error('❌ Metrics cleanup error:', error);
      }
    }, 3600000);

    this.intervals.push(cleanupInterval);
  }

  /**
   * Collect system metrics
   */
  async collectSystemMetrics() {
    try {
      // CPU usage
      const cpuUsage = await this.getCpuUsage();
      
      // Memory usage
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;
      
      // Load average
      const loadAverage = os.loadavg();
      
      // Update system metrics
      this.systemMetrics = {
        cpuUsage: cpuUsage,
        memoryUsage: memoryUsagePercent,
        freeMemory: freeMemory,
        totalMemory: totalMemory,
        uptime: process.uptime(),
        loadAverage: loadAverage,
        platform: os.platform(),
        nodeVersion: process.version,
        timestamp: new Date()
      };

      // Add to historical data
      this.addToHistoricalData('cpu', cpuUsage);
      this.addToHistoricalData('memory', memoryUsagePercent);

    } catch (error) {
      console.error('❌ Collect system metrics error:', error);
    }
  }

  /**
   * Get CPU usage percentage
   */
  async getCpuUsage() {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      const startTime = process.hrtime();

      setTimeout(() => {
        const endUsage = process.cpuUsage(startUsage);
        const endTime = process.hrtime(startTime);
        
        const totalTime = endTime[0] * 1000000 + endTime[1] / 1000; // microseconds
        const totalUsage = endUsage.user + endUsage.system;
        const cpuPercent = (totalUsage / totalTime) * 100;
        
        resolve(Math.min(100, Math.max(0, cpuPercent)));
      }, 100);
    });
  }

  /**
   * Track API request performance
   */
  trackRequest(responseTime, isError = false) {
    try {
      this.requestMetrics.totalRequests++;
      
      // Update response time metrics
      if (responseTime < this.requestMetrics.minResponseTime) {
        this.requestMetrics.minResponseTime = responseTime;
      }
      if (responseTime > this.requestMetrics.maxResponseTime) {
        this.requestMetrics.maxResponseTime = responseTime;
      }
      
      // Calculate rolling average
      const alpha = 0.1; // Exponential smoothing factor
      this.requestMetrics.avgResponseTime = 
        (this.requestMetrics.avgResponseTime * (1 - alpha)) + (responseTime * alpha);
      
      // Track errors
      if (isError) {
        this.requestMetrics.errors = (this.requestMetrics.errors || 0) + 1;
      }
      
      // Calculate error rate
      this.requestMetrics.errorRate = 
        ((this.requestMetrics.errors || 0) / this.requestMetrics.totalRequests) * 100;

    } catch (error) {
      console.error('❌ Track request error:', error);
    }
  }

  /**
   * Track database query performance
   */
  trackDatabaseQuery(queryTime, isSlowQuery = false) {
    try {
      this.databaseMetrics.queryCount++;
      
      // Calculate rolling average query time
      const alpha = 0.1;
      this.databaseMetrics.avgQueryTime = 
        (this.databaseMetrics.avgQueryTime * (1 - alpha)) + (queryTime * alpha);
      
      if (isSlowQuery) {
        this.databaseMetrics.slowQueries++;
      }

    } catch (error) {
      console.error('❌ Track database query error:', error);
    }
  }

  /**
   * Track realtime metrics
   */
  updateRealtimeMetrics(connections, messagesPerSecond, latency) {
    try {
      this.realtimeMetrics = {
        activeConnections: connections,
        messagesPerSecond: messagesPerSecond,
        averageLatency: latency,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Update realtime metrics error:', error);
    }
  }

  /**
   * Add data to historical tracking
   */
  addToHistoricalData(metric, value) {
    try {
      if (!this.historicalData[metric]) {
        this.historicalData[metric] = [];
      }
      
      this.historicalData[metric].push({
        value: value,
        timestamp: new Date()
      });
      
      // Keep only last 100 data points
      if (this.historicalData[metric].length > 100) {
        this.historicalData[metric].shift();
      }
    } catch (error) {
      console.error('❌ Add historical data error:', error);
    }
  }

  /**
   * Aggregate all metrics
   */
  async aggregateMetrics() {
    try {
      const aggregatedMetrics = {
        system: this.systemMetrics,
        requests: this.requestMetrics,
        database: this.databaseMetrics,
        realtime: this.realtimeMetrics,
        timestamp: new Date()
      };
      
      // Add to metrics collection
      this.metrics.set('current', aggregatedMetrics);
      
      return aggregatedMetrics;
    } catch (error) {
      console.error('❌ Aggregate metrics error:', error);
      return null;
    }
  }

  /**
   * Save metrics to cache for persistence
   */
  async saveMetricsToCache() {
    try {
      if (!cacheService.isConnected) {
        return;
      }

      const currentMetrics = this.metrics.get('current');
      if (currentMetrics) {
        const cacheKey = cacheService.generateKey('metrics', 'current');
        await cacheService.set(cacheKey, currentMetrics, 3600); // 1 hour TTL
        
        // Also save historical data
        const historyKey = cacheService.generateKey('metrics', 'history');
        await cacheService.set(historyKey, this.historicalData, 86400); // 24 hour TTL
      }
    } catch (error) {
      console.error('❌ Save metrics to cache error:', error);
    }
  }

  /**
   * Check alert conditions
   */
  async checkAlerts() {
    try {
      const currentMetrics = {
        cpu: this.systemMetrics.cpuUsage,
        memory: this.systemMetrics.memoryUsage,
        avgResponseTime: this.requestMetrics.avgResponseTime,
        errorRate: this.requestMetrics.errorRate,
        connections: this.realtimeMetrics.activeConnections
      };

      for (const rule of this.alertRules) {
        try {
          if (rule.condition(currentMetrics)) {
            await this.triggerAlert(rule, currentMetrics);
          } else {
            // Clear alert if condition is no longer met
            await this.clearAlert(rule.id);
          }
        } catch (error) {
          console.error(`❌ Alert rule evaluation error (${rule.id}):`, error);
        }
      }
    } catch (error) {
      console.error('❌ Check alerts error:', error);
    }
  }

  /**
   * Trigger an alert
   */
  async triggerAlert(rule, metrics) {
    try {
      const alertId = rule.id;
      const existingAlert = this.alerts.get(alertId);
      
      // Don't trigger if alert is already active and recent
      if (existingAlert && (Date.now() - existingAlert.timestamp) < 300000) { // 5 minutes
        return;
      }

      const alert = {
        id: alertId,
        name: rule.name,
        severity: rule.severity,
        message: rule.message,
        metrics: metrics,
        timestamp: Date.now(),
        acknowledged: false
      };

      this.alerts.set(alertId, alert);
      this.alertHistory.push(alert);

      // Log alert
      await auditService.logSystemEvent({
        event: 'performance_alert_triggered',
        severity: rule.severity,
        description: `Performance alert: ${rule.name} - ${rule.message}`,
        metadata: {
          alertId: alertId,
          metrics: metrics,
          rule: rule
        }
      });

      console.warn(`🚨 ALERT [${rule.severity.toUpperCase()}]: ${rule.name} - ${rule.message}`);

      // Send notification if critical
      if (rule.severity === 'critical') {
        await this.sendCriticalAlert(alert);
      }

    } catch (error) {
      console.error('❌ Trigger alert error:', error);
    }
  }

  /**
   * Clear an alert
   */
  async clearAlert(alertId) {
    try {
      const alert = this.alerts.get(alertId);
      if (alert && !alert.cleared) {
        alert.cleared = true;
        alert.clearedAt = Date.now();
        
        console.log(`✅ Alert cleared: ${alert.name}`);
        
        await auditService.logSystemEvent({
          event: 'performance_alert_cleared',
          description: `Performance alert cleared: ${alert.name}`,
          metadata: { alertId: alertId }
        });
      }
    } catch (error) {
      console.error('❌ Clear alert error:', error);
    }
  }

  /**
   * Send critical alert notification
   */
  async sendCriticalAlert(alert) {
    try {
      // Notify through realtime service if available
      const ServiceRegistry = require('./ServiceRegistry');
      
      if (ServiceRegistry.hasService('RealtimeService')) {
        const realtimeService = ServiceRegistry.getService('RealtimeService');
        realtimeService.broadcastSystemNotification({
          type: 'critical_alert',
          title: 'Critical System Alert',
          message: alert.message,
          severity: alert.severity,
          timestamp: alert.timestamp
        });
      }

      // Queue email notification
      if (ServiceRegistry.hasService('BackgroundJobService')) {
        const backgroundJobService = ServiceRegistry.getService('BackgroundJobService');
        await backgroundJobService.addJob('notifications', {
          type: 'critical_alert',
          recipients: ['admin@company.com'], // Configure as needed
          data: alert
        });
      }

    } catch (error) {
      console.error('❌ Send critical alert error:', error);
    }
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck() {
    try {
      const healthStatus = {
        timestamp: new Date(),
        overall: 'healthy',
        services: {},
        metrics: await this.aggregateMetrics(),
        alerts: Array.from(this.alerts.values()).filter(a => !a.cleared)
      };

      // Check service registry health
      try {
        const ServiceRegistry = require('./ServiceRegistry');
        const serviceHealth = await ServiceRegistry.performHealthCheck();
        healthStatus.services = serviceHealth.services;
        
        if (serviceHealth.status === 'degraded') {
          healthStatus.overall = 'degraded';
        }
      } catch (error) {
        healthStatus.services.registry = { status: 'error', error: error.message };
        healthStatus.overall = 'degraded';
      }

      // Check for critical alerts
      const criticalAlerts = healthStatus.alerts.filter(a => a.severity === 'critical');
      if (criticalAlerts.length > 0) {
        healthStatus.overall = 'critical';
      }

      // Save health status
      this.metrics.set('health', healthStatus);

      return healthStatus;
    } catch (error) {
      console.error('❌ Health check error:', error);
      return {
        timestamp: new Date(),
        overall: 'error',
        error: error.message
      };
    }
  }

  /**
   * Clean up old metrics data
   */
  cleanupOldMetrics() {
    try {
      const cutoffTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

      // Clean up alert history
      this.alertHistory = this.alertHistory.filter(alert => alert.timestamp > cutoffTime);

      // Clean up metrics history
      for (const [metric, data] of Object.entries(this.historicalData)) {
        this.historicalData[metric] = data.filter(point => 
          new Date(point.timestamp).getTime() > cutoffTime
        );
      }

      console.log('🧹 Cleaned up old performance metrics');
    } catch (error) {
      console.error('❌ Metrics cleanup error:', error);
    }
  }

  /**
   * Get current performance metrics
   */
  getCurrentMetrics() {
    return {
      system: this.systemMetrics,
      requests: this.requestMetrics,
      database: this.databaseMetrics,
      realtime: this.realtimeMetrics,
      alerts: Array.from(this.alerts.values()),
      timestamp: new Date()
    };
  }

  /**
   * Get performance trends
   */
  getPerformanceTrends() {
    return {
      historical: this.historicalData,
      alerts: this.alertHistory,
      thresholds: this.thresholds,
      timestamp: new Date()
    };
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      status: this.isInitialized ? 'operational' : 'initializing',
      metricsCollected: this.metrics.size,
      activeAlerts: Array.from(this.alerts.values()).filter(a => !a.cleared).length,
      totalAlerts: this.alertHistory.length,
      monitoringIntervals: this.intervals.length,
      uptime: process.uptime(),
      timestamp: new Date()
    };
  }

  /**
   * Create performance middleware for Express
   */
  createMiddleware() {
    return (req, res, next) => {
      const startTime = performance.now();
      
      // Override res.end to capture response time
      const originalEnd = res.end;
      res.end = function(...args) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        const isError = res.statusCode >= 400;
        
        // Track the request
        this.trackRequest(responseTime, isError);
        
        // Call original end method
        originalEnd.apply(res, args);
      }.bind(this);
      
      next();
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      console.log('🔄 Shutting down Performance Monitoring Service...');
      
      // Clear all intervals
      this.intervals.forEach(interval => clearInterval(interval));
      this.intervals = [];
      
      // Save final metrics
      await this.saveMetricsToCache();
      
      // Clear data
      this.metrics.clear();
      this.alerts.clear();
      this.isInitialized = false;
      
      console.log('✅ Performance Monitoring Service shutdown complete');
      
      await auditService.logSystemEvent({
        event: 'performance_monitoring_shutdown',
        description: 'Performance monitoring service stopped gracefully',
        metadata: {
          totalAlerts: this.alertHistory.length,
          finalMetrics: this.getCurrentMetrics()
        }
      });

    } catch (error) {
      console.error('❌ Performance Monitoring Service shutdown error:', error);
    }
  }
}

// Create singleton instance
const performanceMonitoringService = new PerformanceMonitoringService();

module.exports = performanceMonitoringService;