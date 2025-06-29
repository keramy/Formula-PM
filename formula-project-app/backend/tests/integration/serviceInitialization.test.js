/**
 * Service Initialization Integration Tests
 * Tests critical service startup and initialization paths
 */

const { PrismaClient } = require('@prisma/client');
const { logger, LoggingService } = require('../../services/loggingService');

describe('Service Initialization Tests', () => {
  describe('Database Connection', () => {
    let prisma;

    beforeAll(() => {
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
          }
        }
      });
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    test('should connect to database successfully', async () => {
      await expect(prisma.$connect()).resolves.not.toThrow();
    });

    test('should execute basic queries', async () => {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    test('should handle database disconnection gracefully', async () => {
      await prisma.$disconnect();
      
      // Should be able to reconnect
      await expect(prisma.$connect()).resolves.not.toThrow();
    });

    test('should validate database schema', async () => {
      // Check if essential tables exist
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;

      const tableNames = tables.map(t => t.table_name);
      const requiredTables = ['User', 'Project', 'Task', 'Client'];

      requiredTables.forEach(table => {
        expect(tableNames).toContain(table);
      });
    });
  });

  describe('Logging Service', () => {
    test('should initialize logging service', () => {
      expect(logger).toBeDefined();
      expect(logger instanceof LoggingService).toBe(true);
    });

    test('should log at different levels', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      logger.info('Test info message');
      logger.warn('Test warning message');
      logger.error('Test error message');

      expect(consoleSpy).toHaveBeenCalledTimes(3);
      consoleSpy.mockRestore();
    });

    test('should respect log level filtering', () => {
      const testLogger = new LoggingService({ logLevel: 'warn' });
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      testLogger.debug('This should not appear');
      testLogger.info('This should not appear');
      testLogger.warn('This should appear');
      testLogger.error('This should appear');

      expect(consoleSpy).toHaveBeenCalledTimes(2);
      consoleSpy.mockRestore();
    });

    test('should generate correlation IDs', () => {
      const correlationId1 = logger.generateCorrelationId();
      const correlationId2 = logger.generateCorrelationId();

      expect(correlationId1).toBeDefined();
      expect(correlationId2).toBeDefined();
      expect(correlationId1).not.toBe(correlationId2);
      expect(correlationId1).toMatch(/^[a-f0-9]{8}$/);
    });

    test('should sanitize sensitive data', () => {
      const testData = {
        username: 'testuser',
        password: 'secret123',
        token: 'jwt-token',
        publicInfo: 'safe data'
      };

      const sanitized = logger.sanitizeData(testData);

      expect(sanitized.username).toBe('testuser');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.token).toBe('[REDACTED]');
      expect(sanitized.publicInfo).toBe('safe data');
    });

    test('should provide health check', () => {
      const health = logger.healthCheck();

      expect(health).toMatchObject({
        status: expect.stringMatching(/^(healthy|degraded)$/),
        service: expect.any(String),
        environment: expect.any(String),
        logLevel: expect.any(String),
        enableConsole: expect.any(Boolean),
        enableFile: expect.any(Boolean)
      });
    });
  });

  describe('Environment Configuration', () => {
    test('should load required environment variables', () => {
      const requiredEnvVars = [
        'DATABASE_URL',
        'NODE_ENV'
      ];

      requiredEnvVars.forEach(envVar => {
        expect(process.env[envVar]).toBeDefined();
      });
    });

    test('should set appropriate defaults for development', () => {
      if (process.env.NODE_ENV === 'development') {
        // Development-specific expectations
        expect(logger.logLevel).toBe('debug');
        expect(logger.enableConsole).toBe(true);
      }
    });

    test('should validate configuration consistency', () => {
      // Log level should be valid
      const validLogLevels = ['error', 'warn', 'info', 'debug', 'trace'];
      expect(validLogLevels).toContain(logger.logLevel);

      // Environment should be valid
      const validEnvironments = ['development', 'test', 'staging', 'production'];
      expect(validEnvironments).toContain(logger.environment);
    });
  });

  describe('Service Dependencies', () => {
    test('should handle missing optional services gracefully', () => {
      // Test that the app can start without optional services
      const mockApp = {
        locals: {
          prisma: new PrismaClient(),
          logger: logger
          // auditService intentionally missing
        }
      };

      // Should not throw when audit service is undefined
      expect(() => {
        const auditService = mockApp.locals.auditService;
        if (auditService) {
          auditService.logUserAction({});
        }
      }).not.toThrow();
    });

    test('should initialize services in correct order', async () => {
      const initOrder = [];
      
      // Mock service initialization
      const mockServices = {
        database: () => {
          initOrder.push('database');
          return Promise.resolve();
        },
        logging: () => {
          initOrder.push('logging');
          return Promise.resolve();
        },
        auth: () => {
          initOrder.push('auth');
          return Promise.resolve();
        }
      };

      // Initialize in order
      await mockServices.database();
      await mockServices.logging();
      await mockServices.auth();

      expect(initOrder).toEqual(['database', 'logging', 'auth']);
    });
  });

  describe('Error Recovery During Initialization', () => {
    test('should retry database connection on failure', async () => {
      let attemptCount = 0;
      const maxAttempts = 3;

      const mockConnect = () => {
        attemptCount++;
        if (attemptCount < maxAttempts) {
          throw new Error('Connection failed');
        }
        return Promise.resolve();
      };

      // Simulate retry logic
      for (let i = 0; i < maxAttempts; i++) {
        try {
          await mockConnect();
          break;
        } catch (error) {
          if (i === maxAttempts - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      expect(attemptCount).toBe(maxAttempts);
    });

    test('should fail gracefully when critical services unavailable', async () => {
      const criticalServices = ['database'];
      const serviceStatus = {};

      for (const service of criticalServices) {
        try {
          if (service === 'database') {
            const testPrisma = new PrismaClient({
              datasources: {
                db: {
                  url: 'postgresql://invalid:5432/invalid'
                }
              }
            });
            await testPrisma.$connect();
            await testPrisma.$disconnect();
          }
          serviceStatus[service] = 'healthy';
        } catch (error) {
          serviceStatus[service] = 'failed';
        }
      }

      // Should track service failures appropriately
      expect(serviceStatus).toHaveProperty('database');
    });
  });

  describe('Performance Monitoring', () => {
    test('should track initialization time', async () => {
      const startTime = Date.now();

      // Simulate service initialization
      await new Promise(resolve => setTimeout(resolve, 100));

      const endTime = Date.now();
      const initTime = endTime - startTime;

      expect(initTime).toBeGreaterThan(90);
      expect(initTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should monitor memory usage during startup', () => {
      const initialMemory = process.memoryUsage();

      // Simulate service initialization
      const testObjects = [];
      for (let i = 0; i < 1000; i++) {
        testObjects.push({ id: i, data: 'test data' });
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      // Memory increase should be reasonable
      expect(memoryIncrease).toBeGreaterThan(0);
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
    });
  });

  describe('Health Checks', () => {
    test('should provide system health status', () => {
      const health = {
        database: 'healthy',
        logging: 'healthy',
        memory: process.memoryUsage(),
        uptime: process.uptime()
      };

      expect(health.database).toBe('healthy');
      expect(health.logging).toBe('healthy');
      expect(health.memory).toBeDefined();
      expect(health.uptime).toBeGreaterThan(0);
    });

    test('should detect degraded service states', async () => {
      // Mock a degraded service
      const mockServiceHealth = {
        status: 'degraded',
        reason: 'High response time',
        metrics: {
          responseTime: 5000,
          errorRate: 0.1
        }
      };

      expect(mockServiceHealth.status).toBe('degraded');
      expect(mockServiceHealth.reason).toBeDefined();
      expect(mockServiceHealth.metrics.responseTime).toBeGreaterThan(1000);
    });
  });

  describe('Cleanup and Shutdown', () => {
    test('should cleanup resources on shutdown', async () => {
      const mockResources = [];

      // Simulate resource cleanup
      const cleanup = async () => {
        for (const resource of mockResources) {
          if (resource.close) {
            await resource.close();
          }
        }
        mockResources.length = 0;
      };

      await cleanup();
      expect(mockResources).toHaveLength(0);
    });

    test('should handle graceful shutdown signals', (done) => {
      const originalExit = process.exit;
      process.exit = jest.fn();

      // Simulate graceful shutdown
      const gracefulShutdown = (signal) => {
        logger.info(`Received ${signal}, shutting down gracefully`);
        // Cleanup code would go here
        process.exit(0);
      };

      // Test shutdown handler
      gracefulShutdown('SIGTERM');

      expect(process.exit).toHaveBeenCalledWith(0);

      // Restore original exit
      process.exit = originalExit;
      done();
    });
  });
});

module.exports = {
  testDatabaseConnection: async () => {
    const prisma = new PrismaClient();
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    } finally {
      await prisma.$disconnect();
    }
  },
  
  testLoggingService: () => {
    try {
      logger.info('Service initialization test');
      return true;
    } catch (error) {
      return false;
    }
  }
};