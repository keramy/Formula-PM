/**
 * Formula PM Service Registry
 * Central registry for all services with dependency management and health monitoring
 */

const auditService = require('./auditService');
const cacheService = require('./cacheService');

class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this.dependencies = new Map();
    this.healthChecks = new Map();
    this.initialized = false;
    this.failedServices = new Set();
    this.initializationStartTime = null;
    this.httpServer = null; // Will be set by server.js
    this.prismaClient = null; // Will be set by server.js
    
    // Critical services that must start successfully
    this.CRITICAL_SERVICES = ['auditService', 'cacheService', 'ProjectService'];
    
    // Optional services that can fail without stopping initialization
    this.OPTIONAL_SERVICES = ['EmailService', 'BackgroundJobService', 'CloudStorageService', 'RealtimeService'];
    
    this.serviceOrder = [
      'auditService',
      'cacheService',
      'EmailService',
      'ProjectService',
      'WorkflowEngine',
      'NotificationService',
      'MentionService',
      'SearchService',
      'AnalyticsService',
      'ReportGenerator',
      'RealtimeService',
      'BackgroundJobService',
      'PerformanceMonitoringService',
      'CloudStorageService'
    ];

    // Environment-based service configuration
    this.serviceConfigs = {
      'EmailService': { 
        enabled: process.env.ENABLE_EMAIL_SERVICE !== 'false',
        required: false 
      },
      'BackgroundJobService': { 
        enabled: process.env.ENABLE_BACKGROUND_JOBS !== 'false',
        required: false 
      },
      'CloudStorageService': { 
        enabled: process.env.ENABLE_CLOUD_STORAGE !== 'false',
        required: false 
      },
      'RealtimeService': { 
        enabled: process.env.ENABLE_REALTIME !== 'false',
        required: false 
      }
    };
  }

  /**
   * Set the shared Prisma client for all services
   */
  setPrismaClient(prismaClient) {
    this.prismaClient = prismaClient;
  }

  /**
   * Initialize all services in correct order
   */
  async initializeServices() {
    try {
      if (this.initialized) {
        console.log('✅ Services already initialized');
        return;
      }

      console.log('🚀 Initializing Formula PM services...');
      this.initializationStartTime = Date.now();

      // Register all services
      await this.registerServices();

      // Initialize services in dependency order with overall timeout
      const overallTimeout = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Service initialization timed out after 60 seconds'));
        }, 60000); // 60 second overall timeout
      });
      
      await Promise.race([
        this.initializeInOrder(),
        overallTimeout
      ]);

      // Set up health checks
      this.setupHealthChecks();

      this.initialized = true;
      const totalTime = Date.now() - this.initializationStartTime;
      
      if (this.failedServices.size > 0) {
        console.warn(`⚠️  Services initialized with ${this.failedServices.size} failures:`, Array.from(this.failedServices));
        console.log(`✅ ${this.services.size - this.failedServices.size} services initialized successfully in ${totalTime}ms`);
      } else {
        console.log(`✅ All services initialized successfully in ${totalTime}ms`);
      }

      // Log service initialization
      await auditService.logSystemEvent({
        event: 'services_initialized',
        description: 'All backend services initialized successfully',
        metadata: {
          serviceCount: this.services.size,
          services: Array.from(this.services.keys())
        }
      });

    } catch (error) {
      console.error('❌ Service initialization failed:', error);
      throw error;
    }
  }

  /**
   * Register all services
   */
  async registerServices() {
    try {
      // Core infrastructure services
      this.registerService('auditService', auditService, []);
      this.registerService('cacheService', cacheService, []);

      // Email service
      const EmailService = require('./EmailService');
      this.registerService('EmailService', EmailService, ['auditService']);

      // Project management services
      const ProjectService = require('./ProjectService');
      this.registerService('ProjectService', ProjectService, ['auditService', 'cacheService']);

      const WorkflowEngine = require('./WorkflowEngine');
      this.registerService('WorkflowEngine', WorkflowEngine, ['auditService', 'cacheService']);

      // Communication services
      const NotificationService = require('./NotificationService');
      this.registerService('NotificationService', NotificationService, ['auditService', 'cacheService', 'EmailService']);

      const MentionService = require('./MentionService');
      this.registerService('MentionService', MentionService, ['auditService', 'cacheService', 'NotificationService']);

      // Search and analytics services
      const SearchService = require('./SearchService');
      this.registerService('SearchService', SearchService, ['auditService', 'cacheService', 'MentionService']);

      const AnalyticsService = require('./AnalyticsService');
      this.registerService('AnalyticsService', AnalyticsService, ['auditService', 'cacheService']);

      const ReportGenerator = require('./ReportGenerator');
      this.registerService('ReportGenerator', ReportGenerator, ['auditService', 'ProjectService', 'WorkflowEngine', 'AnalyticsService']);

      // Realtime service (special handling)
      const RealtimeService = require('./RealtimeService');
      this.registerService('RealtimeService', RealtimeService, ['auditService', 'cacheService']);

      // Background job service
      const BackgroundJobService = require('./BackgroundJobService');
      this.registerService('BackgroundJobService', BackgroundJobService, ['auditService', 'cacheService']);

      // Performance monitoring service
      const PerformanceMonitoringService = require('./PerformanceMonitoringService');
      this.registerService('PerformanceMonitoringService', PerformanceMonitoringService, ['auditService', 'cacheService']);

      // Cloud storage service
      const CloudStorageService = require('./CloudStorageService');
      this.registerService('CloudStorageService', CloudStorageService, ['auditService', 'cacheService']);

      console.log(`📦 Registered ${this.services.size} services`);
    } catch (error) {
      console.error('❌ Service registration failed:', error);
      throw error;
    }
  }

  /**
   * Register a single service
   */
  registerService(name, serviceInstance, dependencies = []) {
    this.services.set(name, serviceInstance);
    this.dependencies.set(name, dependencies);
    
    console.log(`📦 Registered service: ${name} (dependencies: ${dependencies.join(', ') || 'none'})`);
  }

  /**
   * Initialize services in dependency order
   */
  async initializeInOrder() {
    const initialized = new Set();
    
    for (const serviceName of this.serviceOrder) {
      if (!this.services.has(serviceName)) {
        console.warn(`⚠️ Service ${serviceName} not found in registry`);
        continue;
      }

      await this.initializeService(serviceName, initialized);
    }
  }

  /**
   * Initialize a single service with timeout and detailed logging
   */
  async initializeService(serviceName, initialized) {
    if (initialized.has(serviceName)) {
      return;
    }

    // Check if service is disabled by environment configuration
    const config = this.serviceConfigs[serviceName];
    if (config && !config.enabled) {
      console.log(`⏭️  [SKIP] Service ${serviceName} disabled by environment configuration`);
      initialized.add(serviceName);
      return;
    }

    console.log(`🔍 [DEBUG] Starting ${serviceName} initialization...`);
    console.log(`🔍 [DEBUG] Dependencies for ${serviceName}:`, this.dependencies.get(serviceName) || []);

    // Initialize dependencies first
    const dependencies = this.dependencies.get(serviceName) || [];
    for (const dep of dependencies) {
      console.log(`🔍 [DEBUG] Initializing dependency ${dep} for ${serviceName}...`);
      await this.initializeService(dep, initialized);
      console.log(`🔍 [DEBUG] Dependency ${dep} completed for ${serviceName}`);
    }

    // Initialize the service with timeout
    const service = this.services.get(serviceName);
    if (service && typeof service.initialize === 'function') {
      try {
        const startTime = Date.now();
        console.log(`🔄 [DEBUG] Starting ${serviceName} initialize() method...`);
        
        // Set Prisma client if service supports it
        if (this.prismaClient && typeof service.setPrismaClient === 'function') {
          console.log(`🔍 [DEBUG] Setting Prisma client for ${serviceName}...`);
          service.setPrismaClient(this.prismaClient);
        }
        
        // Create a timeout promise with detailed logging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            console.error(`❌ [TIMEOUT] Service ${serviceName} timed out after 30 seconds`);
            reject(new Error(`Service ${serviceName} initialization timed out after 30 seconds`));
          }, 30000); // 30 second timeout
        });
        
        // Special handling for RealtimeService - pass HTTP server
        let initPromise;
        if (serviceName === 'RealtimeService' && this.httpServer) {
          initPromise = service.initialize(this.httpServer);
        } else {
          initPromise = service.initialize();
        }
        
        // Race between initialization and timeout
        await Promise.race([
          initPromise,
          timeoutPromise
        ]);
        
        const duration = Date.now() - startTime;
        console.log(`✅ [SUCCESS] Initialized service: ${serviceName} (${duration}ms)`);
        
        // Warn if initialization took too long
        if (duration > 10000) {
          console.warn(`⚠️  Service ${serviceName} took ${duration}ms to initialize`);
        }
      } catch (error) {
        const isCritical = this.CRITICAL_SERVICES.includes(serviceName);
        
        console.error(`❌ [ERROR] Service ${serviceName} failed:`, error.message);
        console.error(`❌ [STACK] ${serviceName}:`, error.stack);
        
        if (isCritical) {
          console.error(`❌ CRITICAL service ${serviceName} failed - stopping initialization`);
          throw error; // Stop initialization for critical services
        } else {
          console.warn(`⚠️  Optional service ${serviceName} failed, continuing:`, error.message);
          this.failedServices = this.failedServices || new Set();
          this.failedServices.add(serviceName);
          // Continue initialization for optional services
        }
      }
    }

    console.log(`✅ [DEBUG] Completed ${serviceName} initialization`);
    initialized.add(serviceName);
  }

  /**
   * Setup health checks for all services
   */
  setupHealthChecks() {
    this.services.forEach((service, name) => {
      if (typeof service.getServiceStatus === 'function') {
        this.healthChecks.set(name, () => service.getServiceStatus());
      } else if (typeof service.checkHealth === 'function') {
        this.healthChecks.set(name, () => service.checkHealth());
      } else {
        this.healthChecks.set(name, () => ({ status: 'operational', service: name }));
      }
    });

    console.log(`🏥 Setup health checks for ${this.healthChecks.size} services`);
  }

  /**
   * Get service by name
   */
  getService(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }

  /**
   * Check if service exists
   */
  hasService(name) {
    return this.services.has(name);
  }

  /**
   * Get all service names
   */
  getServiceNames() {
    return Array.from(this.services.keys());
  }

  /**
   * Get service dependencies
   */
  getServiceDependencies(name) {
    return this.dependencies.get(name) || [];
  }

  /**
   * Perform health check on all services
   */
  async performHealthCheck() {
    try {
      const healthResults = {};
      const startTime = Date.now();

      for (const [serviceName, healthCheckFn] of this.healthChecks) {
        try {
          const serviceStartTime = Date.now();
          const result = await healthCheckFn();
          const responseTime = Date.now() - serviceStartTime;

          healthResults[serviceName] = {
            status: result.status || 'operational',
            responseTime,
            details: result,
            lastCheck: new Date()
          };
        } catch (error) {
          healthResults[serviceName] = {
            status: 'error',
            responseTime: null,
            error: error.message,
            lastCheck: new Date()
          };
        }
      }

      const totalTime = Date.now() - startTime;
      const healthyServices = Object.values(healthResults).filter(r => r.status === 'operational').length;
      const totalServices = Object.keys(healthResults).length;

      const overallHealth = {
        status: healthyServices === totalServices ? 'healthy' : 'degraded',
        totalServices,
        healthyServices,
        unhealthyServices: totalServices - healthyServices,
        responseTime: totalTime,
        lastCheck: new Date(),
        services: healthResults
      };

      // Log health check results
      if (overallHealth.status === 'degraded') {
        await auditService.logSystemEvent({
          event: 'health_check_warning',
          description: `${overallHealth.unhealthyServices} services are unhealthy`,
          metadata: overallHealth
        });
      }

      return overallHealth;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        status: 'error',
        error: error.message,
        lastCheck: new Date()
      };
    }
  }

  /**
   * Get service metrics
   */
  async getServiceMetrics() {
    try {
      const metrics = {
        registeredServices: this.services.size,
        initializedServices: this.initialized ? this.services.size : 0,
        healthChecksEnabled: this.healthChecks.size,
        dependencies: {},
        uptime: this.initialized ? process.uptime() : 0
      };

      // Calculate dependency graph metrics
      this.dependencies.forEach((deps, service) => {
        metrics.dependencies[service] = deps.length;
      });

      return metrics;
    } catch (error) {
      console.error('❌ Get service metrics error:', error);
      throw error;
    }
  }

  /**
   * Shutdown all services gracefully
   */
  async shutdown() {
    try {
      console.log('🔄 Shutting down services...');

      // Shutdown in reverse order
      const shutdownOrder = [...this.serviceOrder].reverse();
      
      for (const serviceName of shutdownOrder) {
        const service = this.services.get(serviceName);
        if (service && typeof service.shutdown === 'function') {
          try {
            await service.shutdown();
            console.log(`✅ Shutdown service: ${serviceName}`);
          } catch (error) {
            console.error(`❌ Failed to shutdown service ${serviceName}:`, error);
          }
        }
      }

      // Log shutdown
      await auditService.logSystemEvent({
        event: 'services_shutdown',
        description: 'All backend services shutdown gracefully',
        metadata: {
          serviceCount: this.services.size
        }
      });

      this.initialized = false;
      console.log('✅ All services shutdown complete');
    } catch (error) {
      console.error('❌ Service shutdown failed:', error);
      throw error;
    }
  }

  /**
   * Restart all services
   */
  async restart() {
    try {
      console.log('🔄 Restarting services...');
      await this.shutdown();
      await this.initializeServices();
      console.log('✅ Services restarted successfully');
    } catch (error) {
      console.error('❌ Service restart failed:', error);
      throw error;
    }
  }

  /**
   * Get service information
   */
  getServiceInfo() {
    const info = {
      initialized: this.initialized,
      services: {},
      dependencyGraph: {},
      failedServices: Array.from(this.failedServices || []),
      initializationTime: this.initializationStartTime ? Date.now() - this.initializationStartTime : null
    };

    this.services.forEach((service, name) => {
      info.services[name] = {
        name,
        dependencies: this.dependencies.get(name) || [],
        hasHealthCheck: this.healthChecks.has(name),
        hasInitialize: typeof service.initialize === 'function',
        hasShutdown: typeof service.shutdown === 'function',
        failed: this.failedServices ? this.failedServices.has(name) : false
      };
    });

    this.dependencies.forEach((deps, service) => {
      info.dependencyGraph[service] = deps;
    });

    return info;
  }
}

// Create singleton instance
const serviceRegistry = new ServiceRegistry();

module.exports = serviceRegistry;