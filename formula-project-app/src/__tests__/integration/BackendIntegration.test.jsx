/**
 * Backend Integration Tests
 * Tests the complete frontend-backend integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import apiService from '../../services/api/apiService';
import socketService from '../../services/realtime/socketService';
import authService from '../../services/auth/authService';

// Mock components for testing
const MockApp = ({ children }) => {
  const theme = createTheme();
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Mock API responses
const mockProjects = [
  {
    id: '1',
    name: 'Test Project 1',
    description: 'Test description',
    status: 'active',
    priority: 'high',
    progress: 75
  },
  {
    id: '2',
    name: 'Test Project 2',
    description: 'Another test description',
    status: 'on_hold',
    priority: 'medium',
    progress: 50
  }
];

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'project_manager'
  }
];

const mockAuthResponse = {
  success: true,
  token: 'mock-jwt-token',
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin'
  }
};

describe('Backend Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock fetch globally
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('API Service Integration', () => {
    it('should handle successful API requests', async () => {
      // Mock successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects })
      });

      const projects = await apiService.getProjects();
      
      expect(projects).toEqual(mockProjects);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5014/api/v1/projects',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should handle authentication token in requests', async () => {
      // Set auth token
      apiService.setAuthToken('test-token');

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects })
      });

      await apiService.getProjects();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5014/api/v1/projects',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });

    it('should handle 401 unauthorized and refresh token', async () => {
      // Set initial token
      apiService.setAuthToken('expired-token');

      // Mock 401 response then success
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ error: 'Unauthorized' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: 'new-token' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects })
        });

      const projects = await apiService.getProjects();

      expect(projects).toEqual(mockProjects);
      expect(global.fetch).toHaveBeenCalledTimes(3); // Original, refresh, retry
    });

    it('should handle network errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.getProjects()).rejects.toThrow('Network error');
    });

    it('should handle demo mode fallback', async () => {
      // Force demo mode
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      global.fetch.mockRejectedValueOnce(new Error('Backend unavailable'));

      const projects = await apiService.getProjects();
      
      // Should fallback to demo data
      expect(Array.isArray(projects)).toBe(true);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Backend unavailable'),
        expect.any(String)
      );
    });
  });

  describe('Authentication Service Integration', () => {
    it('should handle successful login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuthResponse
      });

      const result = await authService.login('test@example.com', 'password');

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockAuthResponse.user);
      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
    });

    it('should handle login failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid credentials' })
      });

      const result = await authService.login('test@example.com', 'wrong-password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should handle token verification', async () => {
      localStorage.setItem('auth_token', 'test-token');

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockAuthResponse.user })
      });

      const result = await authService.verifyToken();

      expect(result.valid).toBe(true);
      expect(result.user).toEqual(mockAuthResponse.user);
    });

    it('should handle logout', async () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user_data', JSON.stringify(mockAuthResponse.user));

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await authService.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();
    });
  });

  describe('Socket Service Integration', () => {
    let mockSocket;

    beforeEach(() => {
      mockSocket = {
        connected: false,
        connect: vi.fn(),
        disconnect: vi.fn(),
        emit: vi.fn(),
        on: vi.fn(),
        once: vi.fn(),
        off: vi.fn(),
        id: 'mock-socket-id'
      };

      // Mock socket.io
      vi.doMock('socket.io-client', () => ({
        io: vi.fn(() => mockSocket)
      }));
    });

    it('should initialize socket connection', async () => {
      localStorage.setItem('auth_token', 'test-token');
      
      // Simulate successful connection
      mockSocket.connected = true;
      
      // Mock the connect event
      setTimeout(() => {
        const connectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'connect')?.[1];
        if (connectHandler) connectHandler();
      }, 0);

      const socket = await socketService.initialize();
      
      expect(socket).toBeDefined();
    });

    it('should handle connection errors', async () => {
      localStorage.setItem('auth_token', 'test-token');
      
      // Simulate connection error
      setTimeout(() => {
        const errorHandler = mockSocket.once.mock.calls.find(call => call[0] === 'connect_error')?.[1];
        if (errorHandler) errorHandler(new Error('Connection failed'));
      }, 0);

      await expect(socketService.initialize()).rejects.toThrow('Connection failed');
    });

    it('should join project rooms', async () => {
      socketService.socket = mockSocket;
      mockSocket.connected = true;

      // Mock successful room join
      mockSocket.emit.mockImplementation((event, data, callback) => {
        if (event === 'project:join' && callback) {
          callback({ success: true });
        }
      });

      const result = await socketService.joinProject('project-1');
      
      expect(result).toBe(true);
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'project:join',
        { projectId: 'project-1' },
        expect.any(Function)
      );
    });

    it('should handle real-time events', () => {
      const eventHandler = vi.fn();
      
      socketService.on('project:updated', eventHandler);
      
      // Simulate receiving event
      socketService.emit('project:updated', { projectId: '1', changes: ['name'] });
      
      expect(eventHandler).toHaveBeenCalledWith({
        projectId: '1',
        changes: ['name']
      });
    });
  });

  describe('Search Integration', () => {
    it('should perform global search', async () => {
      const mockSearchResults = {
        results: [
          {
            id: '1',
            type: 'project',
            title: 'Test Project',
            description: 'A test project'
          },
          {
            id: '2',
            type: 'task',
            title: 'Test Task',
            description: 'A test task'
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResults
      });

      const results = await apiService.globalSearch('test', { limit: 10 });
      
      expect(results).toEqual(mockSearchResults);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/global?q=test&limit=10'),
        expect.any(Object)
      );
    });
  });

  describe('Notifications Integration', () => {
    it('should fetch notifications', async () => {
      const mockNotifications = {
        notifications: [
          {
            id: '1',
            type: 'task_assigned',
            message: 'You have been assigned a new task',
            read: false,
            createdAt: new Date().toISOString()
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNotifications
      });

      const notifications = await apiService.getNotifications();
      
      expect(notifications).toEqual(mockNotifications);
    });

    it('should mark notifications as read', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const result = await apiService.markNotificationRead('notification-1');
      
      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/notification-1/read'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  describe('Analytics Integration', () => {
    it('should fetch dashboard analytics', async () => {
      const mockAnalytics = {
        projectCount: 5,
        taskCount: 25,
        completedTasks: 15,
        teamMembers: 8
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAnalytics })
      });

      const analytics = await apiService.getDashboardAnalytics();
      
      expect(analytics).toEqual(mockAnalytics);
    });

    it('should fetch project-specific analytics', async () => {
      const mockProjectAnalytics = {
        taskCount: 10,
        completedTasks: 6,
        progressPercentage: 60
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjectAnalytics })
      });

      const analytics = await apiService.getProjectAnalytics('project-1');
      
      expect(analytics).toEqual(mockProjectAnalytics);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      });

      await expect(apiService.getProjects()).rejects.toThrow('Internal server error');
    });

    it('should handle network timeouts', async () => {
      // Mock a slow response
      global.fetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 15000))
      );

      await expect(apiService.getProjects()).rejects.toThrow();
    });
  });

  describe('Full Integration Flow', () => {
    it('should handle complete user flow: login -> load data -> real-time updates', async () => {
      // 1. Login
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuthResponse
      });

      const loginResult = await authService.login('test@example.com', 'password');
      expect(loginResult.success).toBe(true);

      // 2. Load initial data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects })
      });

      const projects = await apiService.getProjects();
      expect(projects).toEqual(mockProjects);

      // 3. Initialize real-time connection
      socketService.socket = mockSocket;
      mockSocket.connected = true;

      // 4. Join project room
      mockSocket.emit.mockImplementation((event, data, callback) => {
        if (event === 'project:join' && callback) {
          callback({ success: true });
        }
      });

      const joinResult = await socketService.joinProject('project-1');
      expect(joinResult).toBe(true);

      // 5. Receive real-time update
      const updateHandler = vi.fn();
      socketService.on('project:updated', updateHandler);
      
      socketService.emit('project:updated', {
        projectId: 'project-1',
        changes: ['status']
      });

      expect(updateHandler).toHaveBeenCalled();
    });
  });
});