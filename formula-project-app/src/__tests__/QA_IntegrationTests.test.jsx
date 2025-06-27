/**
 * QA Integration Testing Suite
 * Tests complete integration across all system components
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../../app/App';
import apiService from '../../services/api/apiService';
import authService from '../../services/auth/authService';
import socketService from '../../services/realtime/socketService';
import { optimisticUpdates } from '../../utils/optimisticUpdates';

// Test setup
const theme = createTheme();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>
);

// Mock data generators
const createMockUser = (id = '1') => ({
  id,
  email: `user${id}@formulapm.com`,
  firstName: `User`,
  lastName: `${id}`,
  role: 'admin',
  status: 'active'
});

const createMockProject = (id = '1') => ({
  id,
  name: `Project ${id}`,
  description: `Description for project ${id}`,
  status: 'active',
  priority: 'high',
  progress: 65,
  budget: 5000000,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  client: { id: '1', name: 'Test Client' },
  projectManager: { id: '1', name: 'John Doe' },
  teamMembers: [
    { id: '1', name: 'John Doe', role: 'project_manager' },
    { id: '2', name: 'Jane Smith', role: 'engineer' }
  ]
});

describe('QA Integration Testing Suite', () => {
  let mockSocket;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
    
    // Setup mock socket
    mockSocket = {
      connected: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      once: vi.fn(),
      id: 'mock-socket-id'
    };
    
    socketService.socket = mockSocket;
    socketService.initialize = vi.fn().mockResolvedValue(mockSocket);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Authentication + API + Socket Integration', () => {
    it('should complete full authentication flow with socket connection', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();
      
      // Mock login response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-jwt-token',
          user: mockUser
        })
      });

      render(<App />, { wrapper: TestWrapper });

      // Login
      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);
      const loginButton = await screen.findByRole('button', { name: /sign in/i });

      await user.type(emailInput, mockUser.email);
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      // Verify auth token is set
      await waitFor(() => {
        expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
      });

      // Verify socket initialization with auth
      await waitFor(() => {
        expect(socketService.initialize).toHaveBeenCalledWith(
          expect.objectContaining({
            auth: { token: 'mock-jwt-token' }
          })
        );
      });

      // Verify API service has auth token
      expect(apiService.getAuthToken()).toBe('mock-jwt-token');
    });

    it('should handle token refresh across API and socket connections', async () => {
      // Set expired token
      localStorage.setItem('auth_token', 'expired-token');
      localStorage.setItem('user_data', JSON.stringify(createMockUser()));

      // Mock 401 then refresh
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ error: 'Token expired' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            token: 'new-token',
            user: createMockUser()
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [createMockProject()] })
        });

      // Make API call
      const projects = await apiService.getProjects();

      // Verify token was refreshed
      expect(localStorage.getItem('auth_token')).toBe('new-token');
      expect(projects.data).toHaveLength(1);

      // Verify socket reconnects with new token
      await waitFor(() => {
        expect(socketService.initialize).toHaveBeenCalledWith(
          expect.objectContaining({
            auth: { token: 'new-token' }
          })
        );
      });
    });
  });

  describe('2. Project CRUD + Real-time Updates', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(createMockUser()));
    });

    it('should create project and receive real-time updates', async () => {
      const user = userEvent.setup();
      const newProject = createMockProject('new-1');

      // Mock project list
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to projects
      const projectsTab = await screen.findByText(/projects/i);
      await user.click(projectsTab);

      // Mock create project response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newProject
      });

      // Mock socket room join
      mockSocket.emit.mockImplementation((event, data, callback) => {
        if (event === 'project:join' && callback) {
          callback({ success: true });
        }
      });

      // Create project
      const newProjectButton = await screen.findByRole('button', { name: /new project/i });
      await user.click(newProjectButton);

      const nameInput = await screen.findByLabelText(/project name/i);
      await user.type(nameInput, newProject.name);

      const saveButton = await screen.findByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Verify project created
      await waitFor(() => {
        expect(screen.getByText('Project created successfully')).toBeInTheDocument();
      });

      // Simulate real-time update
      const updatedProject = { ...newProject, progress: 75 };
      
      act(() => {
        const projectUpdateHandler = mockSocket.on.mock.calls
          .find(call => call[0] === 'project:updated')?.[1];
        
        if (projectUpdateHandler) {
          projectUpdateHandler({
            projectId: newProject.id,
            changes: updatedProject
          });
        }
      });

      // Verify UI updated
      await waitFor(() => {
        expect(screen.getByText('75%')).toBeInTheDocument();
      });
    });

    it('should handle optimistic updates with rollback on failure', async () => {
      const user = userEvent.setup();
      const project = createMockProject();

      // Mock initial project
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => project
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to project
      const projectCard = await screen.findByText(project.name);
      await user.click(projectCard);

      // Start optimistic update
      const updateData = { status: 'completed' };
      
      // Mock failed update
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      // Trigger update
      const editButton = await screen.findByRole('button', { name: /edit/i });
      await user.click(editButton);

      const statusSelect = await screen.findByLabelText(/status/i);
      await user.selectOptions(statusSelect, 'completed');

      const saveButton = await screen.findByRole('button', { name: /save/i });
      await user.click(saveButton);

      // UI should update optimistically
      expect(screen.getByText(/completed/i)).toBeInTheDocument();

      // Wait for rollback
      await waitFor(() => {
        expect(screen.getByText(/active/i)).toBeInTheDocument();
        expect(screen.getByText(/update failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('3. File Upload + Real-time Notifications', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(createMockUser()));
      mockSocket.connected = true;
    });

    it('should upload file and notify team members', async () => {
      const user = userEvent.setup();
      const project = createMockProject();

      // Mock project load
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => project
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to project
      const projectCard = await screen.findByText(project.name);
      await user.click(projectCard);

      // Go to files tab
      const filesTab = await screen.findByText(/files/i);
      await user.click(filesTab);

      // Create file
      const file = new File(['test content'], 'test-document.pdf', {
        type: 'application/pdf'
      });

      // Mock upload response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'file-1',
          fileName: 'test-document.pdf',
          fileSize: file.size,
          uploadedBy: createMockUser(),
          uploadDate: new Date().toISOString()
        })
      });

      // Upload file
      const uploadInput = await screen.findByTestId('file-upload-input');
      await user.upload(uploadInput, file);

      // Verify upload success
      await waitFor(() => {
        expect(screen.getByText('File uploaded successfully')).toBeInTheDocument();
      });

      // Verify socket notification sent
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'file:uploaded',
        expect.objectContaining({
          projectId: project.id,
          fileName: 'test-document.pdf'
        })
      );

      // Simulate receiving notification
      const notification = {
        id: 'notif-1',
        type: 'file_uploaded',
        message: 'User 1 uploaded test-document.pdf',
        projectId: project.id,
        createdAt: new Date().toISOString()
      };

      act(() => {
        const notificationHandler = mockSocket.on.mock.calls
          .find(call => call[0] === 'notification:new')?.[1];
        
        if (notificationHandler) {
          notificationHandler(notification);
        }
      });

      // Verify notification appears
      await waitFor(() => {
        expect(screen.getByText(notification.message)).toBeInTheDocument();
      });
    });
  });

  describe('4. Search + Navigation + Data Loading', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(createMockUser()));
    });

    it('should search globally and navigate to results', async () => {
      const user = userEvent.setup();
      const searchTerm = 'construction';
      
      render(<App />, { wrapper: TestWrapper });

      // Mock search results
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              id: '1',
              type: 'project',
              title: 'Construction Project Alpha',
              description: 'Major construction initiative',
              url: '/projects/1'
            },
            {
              id: 'task-1',
              type: 'task',
              title: 'Construction permits',
              description: 'Obtain construction permits',
              url: '/tasks/task-1'
            }
          ]
        })
      });

      // Search
      const searchInput = await screen.findByPlaceholderText(/search/i);
      await user.type(searchInput, searchTerm);

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText('Construction Project Alpha')).toBeInTheDocument();
        expect(screen.getByText('Construction permits')).toBeInTheDocument();
      });

      // Mock project details
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockProject('1')
      });

      // Click project result
      const projectResult = screen.getByText('Construction Project Alpha');
      await user.click(projectResult);

      // Verify navigation and data load
      await waitFor(() => {
        expect(window.location.pathname).toBe('/projects/1');
        expect(screen.getByText('Project 1')).toBeInTheDocument();
      });

      // Verify socket room join for project
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'project:join',
        { projectId: '1' },
        expect.any(Function)
      );
    });
  });

  describe('5. Background Jobs + Email + Notifications', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(createMockUser()));
    });

    it('should generate report and receive completion notification', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Navigate to reports
      const reportsTab = await screen.findByText(/reports/i);
      await user.click(reportsTab);

      // Mock report generation start
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jobId: 'job-123',
          status: 'processing',
          estimatedTime: 30
        })
      });

      // Generate report
      const reportTypeSelect = await screen.findByLabelText(/report type/i);
      await user.selectOptions(reportTypeSelect, 'monthly_summary');

      const generateButton = await screen.findByRole('button', { name: /generate/i });
      await user.click(generateButton);

      // Verify processing message
      await waitFor(() => {
        expect(screen.getByText(/generating report/i)).toBeInTheDocument();
      });

      // Simulate job completion notification via socket
      const completionNotification = {
        id: 'notif-2',
        type: 'report_complete',
        message: 'Your monthly summary report is ready',
        data: {
          jobId: 'job-123',
          reportUrl: '/api/v1/reports/download/report-123.pdf'
        }
      };

      act(() => {
        const notificationHandler = mockSocket.on.mock.calls
          .find(call => call[0] === 'notification:new')?.[1];
        
        if (notificationHandler) {
          notificationHandler(completionNotification);
        }
      });

      // Verify completion notification
      await waitFor(() => {
        expect(screen.getByText('Your monthly summary report is ready')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
      });

      // Mock email sent notification
      const emailNotification = {
        id: 'notif-3',
        type: 'email_sent',
        message: 'Report has been emailed to you'
      };

      act(() => {
        const notificationHandler = mockSocket.on.mock.calls
          .find(call => call[0] === 'notification:new')?.[1];
        
        if (notificationHandler) {
          notificationHandler(emailNotification);
        }
      });

      // Verify email notification
      await waitFor(() => {
        expect(screen.getByText('Report has been emailed to you')).toBeInTheDocument();
      });
    });
  });

  describe('6. Collaboration Features Integration', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(createMockUser()));
      mockSocket.connected = true;
    });

    it('should show live collaboration with presence and mentions', async () => {
      const user = userEvent.setup();
      const project = createMockProject();
      const currentUser = createMockUser('1');
      const otherUser = createMockUser('2');

      // Mock project with task
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...project,
          tasks: [{
            id: 'task-1',
            name: 'Review designs',
            description: 'Review architectural designs',
            assignedTo: currentUser
          }]
        })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to project
      const projectCard = await screen.findByText(project.name);
      await user.click(projectCard);

      // Simulate other user joining
      act(() => {
        const presenceHandler = mockSocket.on.mock.calls
          .find(call => call[0] === 'presence:update')?.[1];
        
        if (presenceHandler) {
          presenceHandler({
            projectId: project.id,
            users: [
              { ...currentUser, status: 'online' },
              { ...otherUser, status: 'online' }
            ]
          });
        }
      });

      // Verify presence indicators
      await waitFor(() => {
        expect(screen.getByText('2 users online')).toBeInTheDocument();
        expect(screen.getByText('User 2')).toBeInTheDocument();
      });

      // Add comment with mention
      const commentInput = await screen.findByPlaceholderText(/add a comment/i);
      await user.type(commentInput, '@User 2 please review this task');

      // Mock comment creation
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'comment-1',
          text: '@User 2 please review this task',
          author: currentUser,
          mentions: [{ userId: '2', userName: 'User 2' }],
          createdAt: new Date().toISOString()
        })
      });

      const postButton = await screen.findByRole('button', { name: /post/i });
      await user.click(postButton);

      // Verify mention notification sent
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'mention:created',
        expect.objectContaining({
          mentionedUserId: '2',
          projectId: project.id,
          context: 'comment'
        })
      );

      // Simulate typing indicator
      act(() => {
        const typingHandler = mockSocket.on.mock.calls
          .find(call => call[0] === 'user:typing')?.[1];
        
        if (typingHandler) {
          typingHandler({
            userId: '2',
            userName: 'User 2',
            isTyping: true
          });
        }
      });

      // Verify typing indicator
      await waitFor(() => {
        expect(screen.getByText('User 2 is typing...')).toBeInTheDocument();
      });
    });
  });

  describe('7. Analytics + Dashboard Integration', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(createMockUser()));
    });

    it('should load dashboard with real-time metric updates', async () => {
      const user = userEvent.setup();
      
      // Mock analytics data
      const analyticsData = {
        projects: {
          total: 15,
          active: 8,
          completed: 5,
          onHold: 2
        },
        tasks: {
          total: 145,
          completed: 89,
          inProgress: 34,
          pending: 22
        },
        team: {
          totalMembers: 25,
          activeToday: 18
        },
        performance: {
          onTimeDelivery: 92,
          budgetAdherence: 87
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: analyticsData })
      });

      render(<App />, { wrapper: TestWrapper });

      // Verify dashboard loads
      await waitFor(() => {
        expect(screen.getByText('15')).toBeInTheDocument(); // total projects
        expect(screen.getByText('8 Active')).toBeInTheDocument();
        expect(screen.getByText('145')).toBeInTheDocument(); // total tasks
        expect(screen.getByText('92%')).toBeInTheDocument(); // on-time delivery
      });

      // Simulate real-time metric update
      act(() => {
        const metricsHandler = mockSocket.on.mock.calls
          .find(call => call[0] === 'metrics:updated')?.[1];
        
        if (metricsHandler) {
          metricsHandler({
            type: 'task_completed',
            updates: {
              'tasks.completed': 90,
              'tasks.inProgress': 33
            }
          });
        }
      });

      // Verify metrics updated
      await waitFor(() => {
        expect(screen.getByText('90')).toBeInTheDocument(); // updated completed tasks
        expect(screen.getByText('33')).toBeInTheDocument(); // updated in-progress
      });
    });
  });

  describe('8. Error Recovery + Offline Support', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(createMockUser()));
    });

    it('should handle network disconnection and recovery', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Simulate network offline
      act(() => {
        window.dispatchEvent(new Event('offline'));
      });

      // Verify offline indicator
      await waitFor(() => {
        expect(screen.getByText(/offline mode/i)).toBeInTheDocument();
      });

      // Try to create project while offline
      const newProjectButton = await screen.findByRole('button', { name: /new project/i });
      await user.click(newProjectButton);

      const nameInput = await screen.findByLabelText(/project name/i);
      await user.type(nameInput, 'Offline Project');

      const saveButton = await screen.findByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Verify queued message
      await waitFor(() => {
        expect(screen.getByText(/saved locally/i)).toBeInTheDocument();
      });

      // Simulate network recovery
      act(() => {
        window.dispatchEvent(new Event('online'));
      });

      // Mock sync response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          synced: 1,
          failed: 0,
          projects: [createMockProject('offline-1')]
        })
      });

      // Verify sync occurs
      await waitFor(() => {
        expect(screen.getByText(/synced successfully/i)).toBeInTheDocument();
      });

      // Verify socket reconnects
      expect(socketService.initialize).toHaveBeenCalled();
    });

    it('should handle API errors with retry mechanism', async () => {
      const user = userEvent.setup();
      
      // Mock failing then succeeding requests
      global.fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [createMockProject()] })
        });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to projects
      const projectsTab = await screen.findByText(/projects/i);
      await user.click(projectsTab);

      // Verify error state
      await waitFor(() => {
        expect(screen.getByText(/unable to load/i)).toBeInTheDocument();
      });

      // Click retry
      const retryButton = await screen.findByRole('button', { name: /retry/i });
      await user.click(retryButton);

      // Verify eventual success
      await waitFor(() => {
        expect(screen.getByText('Project 1')).toBeInTheDocument();
      });
    });
  });

  describe('9. Permissions + Role-based Access', () => {
    it('should enforce role-based permissions across features', async () => {
      const user = userEvent.setup();
      const viewerUser = createMockUser('3');
      viewerUser.role = 'viewer';

      // Login as viewer
      localStorage.setItem('auth_token', 'viewer-token');
      localStorage.setItem('user_data', JSON.stringify(viewerUser));

      // Mock projects with limited permissions
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [createMockProject()],
          permissions: {
            canCreate: false,
            canEdit: false,
            canDelete: false,
            canApprove: false
          }
        })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to projects
      const projectsTab = await screen.findByText(/projects/i);
      await user.click(projectsTab);

      // Verify create button is disabled/hidden
      await waitFor(() => {
        const createButton = screen.queryByRole('button', { name: /new project/i });
        expect(createButton).toBeNull();
      });

      // Navigate to project details
      const projectCard = await screen.findByText('Project 1');
      await user.click(projectCard);

      // Verify edit/delete buttons are disabled
      await waitFor(() => {
        const editButton = screen.queryByRole('button', { name: /edit/i });
        const deleteButton = screen.queryByRole('button', { name: /delete/i });
        
        expect(editButton).toBeNull();
        expect(deleteButton).toBeNull();
      });

      // Verify read-only indicators
      expect(screen.getByText(/view only/i)).toBeInTheDocument();
    });
  });

  describe('10. Complete User Journey Integration', () => {
    it('should complete full project lifecycle workflow', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();

      // Step 1: Login
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-jwt-token',
          user: mockUser
        })
      });

      render(<App />, { wrapper: TestWrapper });

      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);
      const loginButton = await screen.findByRole('button', { name: /sign in/i });

      await user.type(emailInput, mockUser.email);
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      // Step 2: Create Project
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      const projectsTab = await screen.findByText(/projects/i);
      await user.click(projectsTab);

      const newProject = createMockProject('journey-1');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newProject
      });

      const newProjectButton = await screen.findByRole('button', { name: /new project/i });
      await user.click(newProjectButton);

      const nameInput = await screen.findByLabelText(/project name/i);
      await user.type(nameInput, newProject.name);

      const createButton = await screen.findByRole('button', { name: /create/i });
      await user.click(createButton);

      // Step 3: Add Team Members
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...newProject,
          teamMembers: [
            createMockUser('1'),
            createMockUser('2'),
            createMockUser('3')
          ]
        })
      });

      const addMembersButton = await screen.findByRole('button', { name: /add team members/i });
      await user.click(addMembersButton);

      // Step 4: Create Tasks
      const newTask = {
        id: 'task-journey-1',
        name: 'Initial Planning',
        projectId: newProject.id
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newTask
      });

      const addTaskButton = await screen.findByRole('button', { name: /add task/i });
      await user.click(addTaskButton);

      const taskNameInput = await screen.findByLabelText(/task name/i);
      await user.type(taskNameInput, newTask.name);

      const saveTaskButton = await screen.findByRole('button', { name: /save/i });
      await user.click(saveTaskButton);

      // Step 5: Upload Document
      const file = new File(['content'], 'project-plan.pdf', { type: 'application/pdf' });
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'file-1',
          fileName: 'project-plan.pdf'
        })
      });

      const uploadInput = await screen.findByTestId('file-upload-input');
      await user.upload(uploadInput, file);

      // Step 6: Generate Report
      global.fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(['report'], { type: 'application/pdf' })
      });

      const generateReportButton = await screen.findByRole('button', { name: /generate report/i });
      await user.click(generateReportButton);

      // Verify complete journey
      await waitFor(() => {
        expect(screen.getByText('Project journey-1')).toBeInTheDocument();
        expect(screen.getByText('3 team members')).toBeInTheDocument();
        expect(screen.getByText('Initial Planning')).toBeInTheDocument();
        expect(screen.getByText('project-plan.pdf')).toBeInTheDocument();
        expect(screen.getByText(/report generated/i)).toBeInTheDocument();
      });

      // Verify all integrations worked
      expect(mockSocket.emit).toHaveBeenCalledWith('project:join', expect.any(Object), expect.any(Function));
      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
    });
  });
});