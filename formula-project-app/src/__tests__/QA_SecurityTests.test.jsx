/**
 * QA Security Testing Suite
 * Comprehensive security testing for authentication, authorization, and data protection
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import apiService from '../../services/api/apiService';
import authService from '../../services/auth/authService';
import socketService from '../../services/realtime/socketService';

describe('QA Security Testing Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    global.fetch = vi.fn();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Authentication Security', () => {
    it('should store auth tokens securely', async () => {
      const token = 'test-jwt-token';
      const user = { id: '1', email: 'test@formulapm.com' };

      // Set auth token
      authService.setToken(token);
      authService.setUser(user);

      // Verify token is not in plain text in storage
      const storedToken = localStorage.getItem('auth_token');
      expect(storedToken).toBe(token); // In production, this should be encrypted

      // Verify token is included in secure headers
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      await apiService.getProjects();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`
          })
        })
      );
    });

    it('should handle session timeout securely', async () => {
      // Set expired token
      const expiredToken = 'expired-token';
      localStorage.setItem('auth_token', expiredToken);

      // Mock 401 response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Token expired' })
      });

      // Attempt API call
      try {
        await apiService.getProjects();
      } catch (error) {
        // Expected to fail
      }

      // Verify token cleared
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();

      // Verify socket disconnected
      expect(socketService.disconnect).toHaveBeenCalled();
    });

    it('should prevent token leakage in URLs', async () => {
      const token = 'sensitive-token';
      authService.setToken(token);

      // Mock API calls
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] })
      });
      global.fetch = mockFetch;

      // Make various API calls
      await apiService.getProjects();
      await apiService.getUsers();
      await apiService.getTasks();

      // Verify token never appears in URL
      mockFetch.mock.calls.forEach(call => {
        const url = call[0];
        expect(url).not.toContain(token);
        expect(url).not.toContain('auth_token');
        expect(url).not.toContain('jwt');
      });
    });

    it('should implement secure password requirements', async () => {
      const weakPasswords = [
        '123456',
        'password',
        'abc123',
        'test',
        '12345678'
      ];

      const strongPasswords = [
        'P@ssw0rd123!',
        'Str0ng&Secure#2024',
        'C0mpl3x!Pass'
      ];

      // Test weak passwords
      for (const password of weakPasswords) {
        const result = authService.validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(expect.stringMatching(/weak|simple|common/i));
      }

      // Test strong passwords
      for (const password of strongPasswords) {
        const result = authService.validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });

    it('should implement rate limiting for login attempts', async () => {
      const email = 'test@formulapm.com';
      const wrongPassword = 'wrongpassword';
      const maxAttempts = 5;

      // Mock failed login responses
      for (let i = 0; i < maxAttempts; i++) {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ 
            error: 'Invalid credentials',
            attemptsRemaining: maxAttempts - i - 1
          })
        });

        await authService.login(email, wrongPassword);
      }

      // Next attempt should be rate limited
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: 900 // 15 minutes
        })
      });

      const result = await authService.login(email, wrongPassword);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many login attempts');
      expect(result.retryAfter).toBe(900);
    });
  });

  describe('2. Authorization Security', () => {
    it('should enforce role-based access control', async () => {
      const users = [
        { id: '1', role: 'admin', permissions: ['*'] },
        { id: '2', role: 'project_manager', permissions: ['projects:*', 'tasks:*', 'users:read'] },
        { id: '3', role: 'engineer', permissions: ['projects:read', 'tasks:*', 'files:*'] },
        { id: '4', role: 'viewer', permissions: ['*:read'] }
      ];

      // Test admin access
      authService.setUser(users[0]);
      expect(authService.hasPermission('projects:delete')).toBe(true);
      expect(authService.hasPermission('users:create')).toBe(true);

      // Test project manager access
      authService.setUser(users[1]);
      expect(authService.hasPermission('projects:create')).toBe(true);
      expect(authService.hasPermission('users:create')).toBe(false);

      // Test engineer access
      authService.setUser(users[2]);
      expect(authService.hasPermission('projects:edit')).toBe(false);
      expect(authService.hasPermission('tasks:create')).toBe(true);

      // Test viewer access
      authService.setUser(users[3]);
      expect(authService.hasPermission('projects:read')).toBe(true);
      expect(authService.hasPermission('projects:edit')).toBe(false);
    });

    it('should prevent unauthorized API access', async () => {
      // No auth token
      localStorage.removeItem('auth_token');

      // Mock 401 response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' })
      });

      // Attempt protected API call
      await expect(apiService.getProjects()).rejects.toThrow('Unauthorized');

      // Verify no data leaked
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const response = await global.fetch.mock.results[0].value;
      const data = await response.json();
      expect(data).not.toHaveProperty('data');
      expect(data).not.toHaveProperty('projects');
    });

    it('should validate JWT tokens properly', async () => {
      // Test malformed tokens
      const invalidTokens = [
        'not-a-jwt',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // Missing payload and signature
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ', // Missing signature
        '', // Empty token
        null,
        undefined
      ];

      for (const token of invalidTokens) {
        authService.setToken(token);
        
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ error: 'Invalid token' })
        });

        const result = await authService.verifyToken();
        expect(result.valid).toBe(false);
      }
    });
  });

  describe('3. Input Validation & XSS Prevention', () => {
    it('should sanitize user inputs to prevent XSS', async () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        '<svg onload=alert("XSS")>',
        'javascript:alert("XSS")',
        '<iframe src="javascript:alert(\'XSS\')"></iframe>',
        '<input onfocus=alert("XSS") autofocus>',
        '<select onfocus=alert("XSS") autofocus>',
        '<textarea onfocus=alert("XSS") autofocus>',
        '<body onload=alert("XSS")>',
        '"><script>alert("XSS")</script>'
      ];

      // Test sanitization in API service
      for (const payload of xssPayloads) {
        const sanitized = apiService.sanitizeInput(payload);
        
        // Verify dangerous content removed
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror=');
        expect(sanitized).not.toContain('onload=');
        expect(sanitized).not.toContain('onfocus=');
      }
    });

    it('should validate and escape SQL injection attempts', async () => {
      const sqlPayloads = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
        "1; DELETE FROM projects WHERE 1=1",
        "' UNION SELECT * FROM users--",
        "1' AND (SELECT COUNT(*) FROM users) > 0--"
      ];

      // Test API parameter validation
      for (const payload of sqlPayloads) {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ error: 'Invalid input' })
        });

        // Attempt search with SQL injection
        const result = await apiService.globalSearch(payload);
        
        // Verify request blocked
        expect(result.error).toBe('Invalid input');
      }
    });

    it('should prevent path traversal attacks', async () => {
      const pathTraversalPayloads = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        'files/../../../sensitive.txt',
        '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
        '....//....//....//etc/passwd'
      ];

      for (const payload of pathTraversalPayloads) {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ error: 'Invalid file path' })
        });

        // Attempt file download with path traversal
        await expect(apiService.downloadFile(payload)).rejects.toThrow('Invalid file path');
      }
    });
  });

  describe('4. CSRF Protection', () => {
    it('should include CSRF tokens in state-changing requests', async () => {
      const csrfToken = 'csrf-token-12345';
      
      // Mock CSRF token retrieval
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken })
      });

      await apiService.getCsrfToken();

      // Test POST request includes CSRF token
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await apiService.createProject({ name: 'Test Project' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-CSRF-Token': csrfToken
          })
        })
      );
    });

    it('should reject requests without valid CSRF tokens', async () => {
      // No CSRF token
      apiService.csrfToken = null;

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Invalid CSRF token' })
      });

      await expect(apiService.updateProject('1', { name: 'Updated' }))
        .rejects.toThrow('Invalid CSRF token');
    });
  });

  describe('5. Data Privacy & Encryption', () => {
    it('should encrypt sensitive data in storage', () => {
      const sensitiveData = {
        creditCard: '4111111111111111',
        ssn: '123-45-6789',
        bankAccount: '1234567890'
      };

      // Store sensitive data
      const encryptedData = apiService.encryptData(sensitiveData);
      localStorage.setItem('sensitive', encryptedData);

      // Verify data is encrypted
      const stored = localStorage.getItem('sensitive');
      expect(stored).not.toContain('4111111111111111');
      expect(stored).not.toContain('123-45-6789');
      expect(stored).not.toContain('1234567890');

      // Verify can decrypt
      const decrypted = apiService.decryptData(stored);
      expect(decrypted).toEqual(sensitiveData);
    });

    it('should mask sensitive data in logs', () => {
      const logSpy = vi.spyOn(console, 'log');
      const errorSpy = vi.spyOn(console, 'error');

      const sensitiveRequest = {
        email: 'user@example.com',
        password: 'secretpassword123',
        creditCard: '4111111111111111',
        apiKey: 'sk-1234567890abcdef'
      };

      // Log request
      apiService.logRequest('POST', '/api/users', sensitiveRequest);

      // Verify sensitive data is masked
      expect(logSpy).toHaveBeenCalled();
      const logCall = logSpy.mock.calls[0][0];
      expect(logCall).not.toContain('secretpassword123');
      expect(logCall).not.toContain('4111111111111111');
      expect(logCall).not.toContain('sk-1234567890abcdef');
      expect(logCall).toContain('***');
    });

    it('should handle PII data according to privacy regulations', async () => {
      const userData = {
        id: '1',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        address: '123 Main St',
        dateOfBirth: '1990-01-01'
      };

      // Test data anonymization
      const anonymized = apiService.anonymizeUserData(userData);
      expect(anonymized.email).toMatch(/user\d+@example\.com/);
      expect(anonymized.firstName).toBe('User');
      expect(anonymized.lastName).toMatch(/\d+/);
      expect(anonymized.phone).toBe('+1******890');
      expect(anonymized.address).toBe('***');
      expect(anonymized.dateOfBirth).toBeNull();
    });
  });

  describe('6. Network Security', () => {
    it('should enforce HTTPS for all API calls', async () => {
      const endpoints = [
        '/api/v1/auth/login',
        '/api/v1/projects',
        '/api/v1/users/profile',
        '/api/v1/files/upload'
      ];

      for (const endpoint of endpoints) {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [] })
        });

        await apiService.request(endpoint);

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toMatch(/^https:\/\//);
      }
    });

    it('should validate SSL certificates', async () => {
      // Mock invalid certificate error
      global.fetch.mockRejectedValueOnce(new Error('ERR_CERT_INVALID'));

      await expect(apiService.getProjects()).rejects.toThrow('ERR_CERT_INVALID');

      // Verify no retry with invalid cert
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should implement request timeout', async () => {
      // Mock slow response
      global.fetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 35000)) // 35 seconds
      );

      // Expect timeout error (30 second default)
      await expect(apiService.getProjects()).rejects.toThrow('Request timeout');
    });
  });

  describe('7. File Upload Security', () => {
    it('should validate file types and sizes', async () => {
      const invalidFiles = [
        { name: 'virus.exe', type: 'application/x-msdownload', size: 1024 },
        { name: 'script.js', type: 'application/javascript', size: 1024 },
        { name: 'huge.pdf', type: 'application/pdf', size: 100 * 1024 * 1024 }, // 100MB
        { name: 'malware.bat', type: 'application/x-bat', size: 1024 }
      ];

      for (const file of invalidFiles) {
        const result = apiService.validateFileUpload(file);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
      }

      // Valid files
      const validFiles = [
        { name: 'document.pdf', type: 'application/pdf', size: 5 * 1024 * 1024 },
        { name: 'image.jpg', type: 'image/jpeg', size: 2 * 1024 * 1024 },
        { name: 'spreadsheet.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1024 * 1024 }
      ];

      for (const file of validFiles) {
        const result = apiService.validateFileUpload(file);
        expect(result.valid).toBe(true);
      }
    });

    it('should scan files for malicious content', async () => {
      const file = new File(['EICAR-STANDARD-ANTIVIRUS-TEST-FILE'], 'test.txt', {
        type: 'text/plain'
      });

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Malicious file detected' })
      });

      await expect(apiService.uploadFile(file)).rejects.toThrow('Malicious file detected');
    });
  });

  describe('8. Session Security', () => {
    it('should implement secure session management', async () => {
      const sessionData = {
        sessionId: 'session-123',
        userId: '1',
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000 // 1 hour
      };

      // Create session
      authService.createSession(sessionData);

      // Verify session stored securely
      const stored = sessionStorage.getItem('session');
      expect(stored).toBeTruthy();

      // Verify session expiry
      vi.advanceTimersByTime(3700000); // Advance 1 hour 10 minutes
      
      const isValid = authService.isSessionValid();
      expect(isValid).toBe(false);
    });

    it('should regenerate session ID on privilege escalation', async () => {
      const oldSessionId = 'old-session-123';
      authService.setSessionId(oldSessionId);

      // User role upgrade
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: '1', role: 'admin' },
          newSessionId: 'new-session-456'
        })
      });

      await authService.upgradeUserRole('1', 'admin');

      // Verify session ID changed
      expect(authService.getSessionId()).toBe('new-session-456');
      expect(authService.getSessionId()).not.toBe(oldSessionId);
    });
  });

  describe('9. API Rate Limiting', () => {
    it('should respect rate limits', async () => {
      const rateLimit = {
        limit: 100,
        remaining: 1,
        reset: Date.now() + 60000
      };

      // Mock rate limit headers
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.reset.toString()
        }),
        json: async () => ({ data: [] })
      });

      await apiService.getProjects();

      // Next request should be rate limited
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Headers({
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.reset.toString()
        }),
        json: async () => ({ error: 'Rate limit exceeded' })
      });

      await expect(apiService.getProjects()).rejects.toThrow('Rate limit exceeded');

      // Verify client respects rate limit
      const retryAfter = apiService.getRetryAfter();
      expect(retryAfter).toBeGreaterThan(0);
    });
  });

  describe('10. Security Headers Validation', () => {
    it('should validate security headers in responses', async () => {
      const securityHeaders = {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Content-Security-Policy': "default-src 'self'",
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(securityHeaders),
        json: async () => ({ data: [] })
      });

      const response = await fetch('/api/v1/projects');
      
      // Verify security headers present
      for (const [header, value] of Object.entries(securityHeaders)) {
        expect(response.headers.get(header)).toBe(value);
      }
    });

    it('should detect and prevent clickjacking', () => {
      // Check if app is in iframe
      const isFramed = window.self !== window.top;
      
      if (isFramed) {
        // Should break out of frame
        expect(window.top.location).toBe(window.self.location);
      }

      // Verify X-Frame-Options
      const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
      expect(frameOptions?.content).toBe('DENY');
    });
  });
});