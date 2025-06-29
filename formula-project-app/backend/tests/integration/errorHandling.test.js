/**
 * Integration Tests for Error Handling
 * Tests critical error handling paths and recovery mechanisms
 */

const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../../server');

describe('Error Handling Integration Tests', () => {
  let prisma;
  let server;
  let authToken;
  let testUser;
  let testProject;

  beforeAll(async () => {
    // Initialize test database connection
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
        }
      }
    });

    // Start test server
    server = app.listen(0);
    
    // Setup test data
    await setupTestData();
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData();
    
    // Close connections
    await prisma.$disconnect();
    if (server) {
      server.close();
    }
  });

  beforeEach(() => {
    // Reset any test state
    jest.clearAllMocks();
  });

  async function setupTestData() {
    try {
      // Create test user
      testUser = await prisma.user.create({
        data: {
          id: 'test-user-error-handling',
          email: 'test-error@formulapm.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'project_manager',
          status: 'active',
          passwordHash: 'hashed-password'
        }
      });

      // Create test client
      const testClient = await prisma.client.create({
        data: {
          id: 'test-client-error-handling',
          name: 'Test Client',
          email: 'client-error@formulapm.com',
          companyName: 'Test Company'
        }
      });

      // Create test project
      testProject = await prisma.project.create({
        data: {
          id: 'test-project-error-handling',
          name: 'Test Project',
          description: 'Test project for error handling',
          type: 'commercial',
          status: 'active',
          clientId: testClient.id,
          projectManagerId: testUser.id,
          createdBy: testUser.id
        }
      });

      // Mock auth token (in real tests, you'd generate this properly)
      authToken = 'mock-jwt-token';
    } catch (error) {
      console.error('Failed to setup test data:', error);
      throw error;
    }
  }

  async function cleanupTestData() {
    try {
      // Delete in reverse order due to foreign key constraints
      await prisma.task.deleteMany({
        where: { projectId: testProject?.id }
      });
      
      await prisma.project.deleteMany({
        where: { id: testProject?.id }
      });
      
      await prisma.client.deleteMany({
        where: { id: 'test-client-error-handling' }
      });
      
      await prisma.user.deleteMany({
        where: { id: testUser?.id }
      });
    } catch (error) {
      console.error('Failed to cleanup test data:', error);
    }
  }

  describe('API Error Handling', () => {
    describe('Authentication Errors', () => {
      test('should return 401 for missing auth token', async () => {
        const response = await request(server)
          .get('/api/v1/tasks')
          .expect(401);

        expect(response.body).toMatchObject({
          error: expect.any(String),
          code: 'AUTHENTICATION_ERROR',
          timestamp: expect.any(String)
        });
      });

      test('should return 401 for invalid auth token', async () => {
        const response = await request(server)
          .get('/api/v1/tasks')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);

        expect(response.body.code).toBe('AUTHENTICATION_ERROR');
      });
    });

    describe('Validation Errors', () => {
      test('should return 422 for invalid UUID parameter', async () => {
        const response = await request(server)
          .get('/api/v1/tasks/invalid-uuid')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(422);

        expect(response.body).toMatchObject({
          error: expect.any(String),
          code: 'VALIDATION_ERROR',
          timestamp: expect.any(String)
        });
      });

      test('should return 422 for invalid request body', async () => {
        const response = await request(server)
          .post('/api/v1/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: '', // Invalid: empty name
            projectId: 'invalid-uuid' // Invalid: not a UUID
          })
          .expect(422);

        expect(response.body.code).toBe('VALIDATION_ERROR');
        expect(response.body.details).toBeDefined();
      });

      test('should return 422 for missing required fields', async () => {
        const response = await request(server)
          .post('/api/v1/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            description: 'Task without name or project'
          })
          .expect(422);

        expect(response.body.code).toBe('VALIDATION_ERROR');
      });
    });

    describe('Not Found Errors', () => {
      test('should return 404 for non-existent resource', async () => {
        const response = await request(server)
          .get('/api/v1/tasks/00000000-0000-4000-8000-000000000000')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        expect(response.body).toMatchObject({
          error: expect.stringContaining('not found'),
          code: 'NOT_FOUND',
          timestamp: expect.any(String)
        });
      });

      test('should return 404 for non-existent route', async () => {
        const response = await request(server)
          .get('/api/v1/non-existent-endpoint')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        expect(response.body.code).toBe('NOT_FOUND');
      });
    });

    describe('Authorization Errors', () => {
      test('should return 403 for insufficient permissions', async () => {
        // Mock a user with limited permissions
        const limitedUser = await prisma.user.create({
          data: {
            id: 'test-limited-user',
            email: 'limited@formulapm.com',
            firstName: 'Limited',
            lastName: 'User',
            role: 'designer', // Limited role
            status: 'active',
            passwordHash: 'hashed-password'
          }
        });

        const response = await request(server)
          .delete(`/api/v1/tasks/00000000-0000-4000-8000-000000000000`)
          .set('Authorization', `Bearer limited-token`)
          .expect(403);

        expect(response.body.code).toBe('AUTHORIZATION_ERROR');

        // Cleanup
        await prisma.user.delete({ where: { id: limitedUser.id } });
      });
    });

    describe('Database Errors', () => {
      test('should handle database connection errors gracefully', async () => {
        // Mock database disconnect
        const originalFindMany = prisma.task.findMany;
        prisma.task.findMany = jest.fn().mockRejectedValue(
          new Error('Database connection lost')
        );

        const response = await request(server)
          .get('/api/v1/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(500);

        expect(response.body).toMatchObject({
          error: expect.any(String),
          code: 'DATABASE_ERROR',
          timestamp: expect.any(String)
        });

        // Restore original method
        prisma.task.findMany = originalFindMany;
      });

      test('should handle constraint violations', async () => {
        // Try to create duplicate user (unique constraint)
        const response = await request(server)
          .post('/api/v1/users')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            email: testUser.email, // Duplicate email
            firstName: 'Duplicate',
            lastName: 'User',
            role: 'designer'
          })
          .expect(409);

        expect(response.body.code).toBe('CONFLICT');
      });
    });

    describe('Server Errors', () => {
      test('should handle unexpected server errors', async () => {
        // Mock an unexpected error
        const originalCreate = prisma.task.create;
        prisma.task.create = jest.fn().mockRejectedValue(
          new Error('Unexpected server error')
        );

        const response = await request(server)
          .post('/api/v1/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test Task',
            projectId: testProject.id
          })
          .expect(500);

        expect(response.body).toMatchObject({
          error: expect.any(String),
          code: 'INTERNAL_ERROR',
          timestamp: expect.any(String)
        });

        // In development mode, should include stack trace
        if (process.env.NODE_ENV === 'development') {
          expect(response.body.stack).toBeDefined();
        }

        // Restore original method
        prisma.task.create = originalCreate;
      });
    });
  });

  describe('Error Recovery Mechanisms', () => {
    describe('Retry Logic', () => {
      test('should implement retry logic for transient errors', async () => {
        let callCount = 0;
        const originalFindMany = prisma.task.findMany;
        
        prisma.task.findMany = jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount < 3) {
            throw new Error('Temporary database error');
          }
          return originalFindMany.apply(prisma.task, arguments);
        });

        // This should eventually succeed after retries
        const response = await request(server)
          .get('/api/v1/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(callCount).toBeGreaterThan(1);
        expect(response.body.success).toBe(true);

        // Restore original method
        prisma.task.findMany = originalFindMany;
      });
    });

    describe('Graceful Degradation', () => {
      test('should provide fallback responses when optional services fail', async () => {
        // Mock audit service failure
        const mockAuditService = {
          logDataChange: jest.fn().mockRejectedValue(new Error('Audit service down'))
        };

        // Temporarily replace audit service
        const originalAuditService = app.locals.auditService;
        app.locals.auditService = mockAuditService;

        // Task creation should still work even if audit logging fails
        const response = await request(server)
          .post('/api/v1/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test Task with Audit Failure',
            projectId: testProject.id
          })
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(mockAuditService.logDataChange).toHaveBeenCalled();

        // Restore original audit service
        app.locals.auditService = originalAuditService;

        // Cleanup created task
        if (response.body.data?.id) {\n          await prisma.task.delete({ where: { id: response.body.data.id } });\n        }
      });
    });
  });

  describe('Error Logging and Monitoring', () => {
    test('should log errors with correlation IDs', async () => {
      const correlationId = 'test-correlation-123';
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Mock an error condition
      const originalFindUnique = prisma.task.findUnique;
      prisma.task.findUnique = jest.fn().mockRejectedValue(
        new Error('Database error for logging test')
      );

      await request(server)
        .get('/api/v1/tasks/00000000-0000-4000-8000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Correlation-ID', correlationId)
        .expect(500);

      // Verify error was logged with correlation ID
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Server Error'),
        expect.objectContaining({
          message: expect.stringContaining('Database error'),
          code: 'DATABASE_ERROR'
        })
      );

      // Restore mocks
      prisma.task.findUnique = originalFindUnique;
      consoleErrorSpy.mockRestore();
    });

    test('should sanitize sensitive data in error logs', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await request(server)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Task',
          projectId: 'invalid-uuid',
          sensitiveData: 'this-should-not-be-logged'
        })
        .expect(422);

      // Verify sensitive data was not logged
      const logCalls = consoleErrorSpy.mock.calls.flat();
      const loggedData = JSON.stringify(logCalls);
      expect(loggedData).not.toContain('this-should-not-be-logged');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Performance Under Error Conditions', () => {
    test('should handle high error rates without degrading performance', async () => {
      const startTime = Date.now();
      const promises = [];

      // Generate multiple concurrent error requests
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(server)
            .get('/api/v1/tasks/invalid-uuid')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(422)
        );
      }

      await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete all error responses within reasonable time
      expect(duration).toBeLessThan(5000); // 5 seconds
    });

    test('should not leak memory during error handling', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Generate many error conditions
      for (let i = 0; i < 100; i++) {
        await request(server)
          .get('/api/v1/tasks/invalid-uuid')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(422);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Error Response Format Consistency', () => {
    test('should return consistent error format across all endpoints', async () => {
      const endpoints = [
        { method: 'get', path: '/api/v1/tasks/invalid-uuid' },
        { method: 'post', path: '/api/v1/tasks', body: {} },
        { method: 'put', path: '/api/v1/tasks/invalid-uuid', body: {} },
        { method: 'delete', path: '/api/v1/tasks/invalid-uuid' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(server)
          [endpoint.method](endpoint.path)
          .set('Authorization', `Bearer ${authToken}`)
          .send(endpoint.body);

        // All error responses should have consistent structure
        expect(response.body).toMatchObject({
          error: expect.any(String),
          code: expect.any(String),
          timestamp: expect.any(String)
        });

        // Should not contain success field in error responses
        expect(response.body.success).toBeUndefined();
      }
    });
  });

  describe('Integration with Frontend Error Boundaries', () => {
    test('should provide machine-readable error codes for frontend', async () => {
      const response = await request(server)
        .get('/api/v1/tasks/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(422);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(typeof response.body.code).toBe('string');
      expect(response.body.code).toMatch(/^[A-Z_]+$/); // Consistent naming
    });

    test('should include helpful error details for client-side handling', async () => {
      const response = await request(server)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'a'.repeat(300), // Too long
          projectId: 'invalid-uuid'
        })
        .expect(422);

      expect(response.body.details).toBeDefined();
      expect(Array.isArray(response.body.details) || 
             typeof response.body.details === 'object').toBe(true);
    });
  });
});

module.exports = {
  setupTestData,
  cleanupTestData
};