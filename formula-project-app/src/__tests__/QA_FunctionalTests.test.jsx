/**
 * QA Functional Testing Suite
 * Comprehensive functional testing for all user workflows
 * Tests all CRUD operations, authentication, and real-time features
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import apiService from '../../services/api/apiService';
import authService from '../../services/auth/authService';
import socketService from '../../services/realtime/socketService';
import App from '../../app/App';

// Test utilities
const theme = createTheme();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: 0 },
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

// Mock data
const mockUser = {
  id: '1',
  email: 'test@formulapm.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'admin',
  status: 'active'
};

const mockProjects = [
  {
    id: '1',
    name: 'Dubai Mall Expansion',
    description: 'Large retail expansion project',
    status: 'active',
    priority: 'high',
    progress: 65,
    budget: 5000000,
    client: { id: '1', name: 'Emaar Properties' },
    projectManager: { id: '1', name: 'John Doe' }
  },
  {
    id: '2',
    name: 'Burj Vista Tower',
    description: 'Residential tower project',
    status: 'on_tender',
    priority: 'medium',
    progress: 25,
    budget: 3000000,
    client: { id: '2', name: 'DAMAC Properties' },
    projectManager: { id: '2', name: 'Jane Smith' }
  }
];

const mockTasks = [
  {
    id: '1',
    name: 'Complete architectural drawings',
    description: 'Finalize all architectural plans',
    status: 'in_progress',
    priority: 'high',
    assignedTo: { id: '1', name: 'John Doe' },
    projectId: '1',
    dueDate: '2024-03-15'
  },
  {
    id: '2',
    name: 'Material procurement',
    description: 'Order steel and concrete',
    status: 'pending',
    priority: 'medium',
    assignedTo: { id: '2', name: 'Jane Smith' },
    projectId: '1',
    dueDate: '2024-03-20'
  }
];

describe('QA Functional Testing Suite', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock fetch
    global.fetch = vi.fn();
    
    // Mock socket service
    socketService.initialize = vi.fn().mockResolvedValue({});
    socketService.joinProject = vi.fn().mockResolvedValue(true);
    socketService.on = vi.fn();
    socketService.emit = vi.fn();
    socketService.disconnect = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Authentication Workflows', () => {
    it('should handle complete login workflow', async () => {
      const user = userEvent.setup();
      
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

      // Find login form
      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);
      const loginButton = await screen.findByRole('button', { name: /sign in/i });

      // Fill form
      await user.type(emailInput, 'test@formulapm.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      // Verify login success
      await waitFor(() => {
        expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
        expect(screen.queryByText(/dashboard/i)).toBeInTheDocument();
      });
    });

    it('should handle logout workflow', async () => {
      const user = userEvent.setup();
      
      // Set initial auth state
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));

      // Mock logout response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(<App />, { wrapper: TestWrapper });

      // Find and click user menu
      const userMenu = await screen.findByTestId('user-menu-button');
      await user.click(userMenu);

      // Click logout
      const logoutButton = await screen.findByText(/logout/i);
      await user.click(logoutButton);

      // Verify logout
      await waitFor(() => {
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(screen.queryByText(/sign in/i)).toBeInTheDocument();
      });
    });

    it('should handle invalid login credentials', async () => {
      const user = userEvent.setup();
      
      // Mock failed login
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid credentials' })
      });

      render(<App />, { wrapper: TestWrapper });

      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);
      const loginButton = await screen.findByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'wrong@email.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(loginButton);

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('should persist authentication across page reloads', async () => {
      // Set auth data
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));

      // Mock token verification
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: true, user: mockUser })
      });

      render(<App />, { wrapper: TestWrapper });

      // Should bypass login and show dashboard
      await waitFor(() => {
        expect(screen.queryByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('2. Project Management Workflows', () => {
    beforeEach(() => {
      // Set auth state
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should list all projects with filtering', async () => {
      const user = userEvent.setup();
      
      // Mock projects response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects, total: 2 })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to projects
      const projectsTab = await screen.findByText(/projects/i);
      await user.click(projectsTab);

      // Verify projects are displayed
      await waitFor(() => {
        expect(screen.getByText('Dubai Mall Expansion')).toBeInTheDocument();
        expect(screen.getByText('Burj Vista Tower')).toBeInTheDocument();
      });

      // Test filtering by status
      const statusFilter = await screen.findByLabelText(/status/i);
      await user.selectOptions(statusFilter, 'active');

      // Mock filtered response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          data: mockProjects.filter(p => p.status === 'active'),
          total: 1 
        })
      });

      await waitFor(() => {
        expect(screen.getByText('Dubai Mall Expansion')).toBeInTheDocument();
        expect(screen.queryByText('Burj Vista Tower')).not.toBeInTheDocument();
      });
    });

    it('should create a new project', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Navigate to projects
      const projectsTab = await screen.findByText(/projects/i);
      await user.click(projectsTab);

      // Click new project button
      const newProjectButton = await screen.findByRole('button', { name: /new project/i });
      await user.click(newProjectButton);

      // Fill project form
      const nameInput = await screen.findByLabelText(/project name/i);
      const descriptionInput = await screen.findByLabelText(/description/i);
      const clientSelect = await screen.findByLabelText(/client/i);
      const prioritySelect = await screen.findByLabelText(/priority/i);

      await user.type(nameInput, 'New Test Project');
      await user.type(descriptionInput, 'Test project description');
      await user.selectOptions(clientSelect, '1');
      await user.selectOptions(prioritySelect, 'high');

      // Mock create response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '3',
          name: 'New Test Project',
          description: 'Test project description',
          status: 'planning',
          priority: 'high',
          client: { id: '1', name: 'Emaar Properties' }
        })
      });

      // Submit form
      const saveButton = await screen.findByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Verify success
      await waitFor(() => {
        expect(screen.getByText('Project created successfully')).toBeInTheDocument();
      });
    });

    it('should update project details', async () => {
      const user = userEvent.setup();
      
      // Mock initial project load
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to project details
      const projectsTab = await screen.findByText(/projects/i);
      await user.click(projectsTab);

      const projectCard = await screen.findByText('Dubai Mall Expansion');
      await user.click(projectCard);

      // Mock project details response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjects[0]
      });

      // Click edit button
      const editButton = await screen.findByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Update fields
      const statusSelect = await screen.findByLabelText(/status/i);
      await user.selectOptions(statusSelect, 'completed');

      // Mock update response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockProjects[0],
          status: 'completed'
        })
      });

      // Save changes
      const saveButton = await screen.findByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Verify update
      await waitFor(() => {
        expect(screen.getByText('Project updated successfully')).toBeInTheDocument();
      });
    });

    it('should delete a project with confirmation', async () => {
      const user = userEvent.setup();
      
      // Mock projects load
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to projects
      const projectsTab = await screen.findByText(/projects/i);
      await user.click(projectsTab);

      // Open project actions menu
      const moreButton = await screen.findByTestId('project-menu-1');
      await user.click(moreButton);

      // Click delete
      const deleteButton = await screen.findByText(/delete/i);
      await user.click(deleteButton);

      // Confirm deletion
      const confirmButton = await screen.findByRole('button', { name: /confirm/i });
      
      // Mock delete response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await user.click(confirmButton);

      // Verify deletion
      await waitFor(() => {
        expect(screen.getByText('Project deleted successfully')).toBeInTheDocument();
      });
    });
  });

  describe('3. Task Management Workflows', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should create and assign tasks', async () => {
      const user = userEvent.setup();
      
      // Mock project details with tasks
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockProjects[0],
          tasks: mockTasks
        })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to project
      const projectCard = await screen.findByText('Dubai Mall Expansion');
      await user.click(projectCard);

      // Click add task
      const addTaskButton = await screen.findByRole('button', { name: /add task/i });
      await user.click(addTaskButton);

      // Fill task form
      const taskNameInput = await screen.findByLabelText(/task name/i);
      const assigneeSelect = await screen.findByLabelText(/assign to/i);
      const dueDateInput = await screen.findByLabelText(/due date/i);

      await user.type(taskNameInput, 'Review shop drawings');
      await user.selectOptions(assigneeSelect, '1');
      await user.type(dueDateInput, '2024-03-25');

      // Mock create task response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '3',
          name: 'Review shop drawings',
          status: 'pending',
          assignedTo: { id: '1', name: 'John Doe' },
          dueDate: '2024-03-25'
        })
      });

      // Submit
      const saveButton = await screen.findByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Verify task created
      await waitFor(() => {
        expect(screen.getByText('Task created successfully')).toBeInTheDocument();
      });
    });

    it('should update task status with drag and drop', async () => {
      const user = userEvent.setup();
      
      // Mock tasks response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTasks })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to tasks
      const tasksTab = await screen.findByText(/tasks/i);
      await user.click(tasksTab);

      // Find task card
      const taskCard = await screen.findByText('Complete architectural drawings');

      // Mock drag and drop
      fireEvent.dragStart(taskCard);
      
      const completedColumn = await screen.findByTestId('status-column-completed');
      fireEvent.drop(completedColumn);

      // Mock update response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockTasks[0],
          status: 'completed'
        })
      });

      // Verify status update
      await waitFor(() => {
        expect(screen.getByText('Task status updated')).toBeInTheDocument();
      });
    });

    it('should handle bulk task operations', async () => {
      const user = userEvent.setup();
      
      // Mock tasks response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTasks })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to tasks
      const tasksTab = await screen.findByText(/tasks/i);
      await user.click(tasksTab);

      // Select multiple tasks
      const checkboxes = await screen.findAllByRole('checkbox');
      await user.click(checkboxes[1]); // Select first task
      await user.click(checkboxes[2]); // Select second task

      // Click bulk actions
      const bulkActionsButton = await screen.findByRole('button', { name: /bulk actions/i });
      await user.click(bulkActionsButton);

      // Select mark complete
      const markCompleteOption = await screen.findByText(/mark as complete/i);
      await user.click(markCompleteOption);

      // Mock bulk update response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ updated: 2 })
      });

      // Verify bulk update
      await waitFor(() => {
        expect(screen.getByText('2 tasks updated successfully')).toBeInTheDocument();
      });
    });
  });

  describe('4. File Management Workflows', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should upload shop drawings', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Navigate to project
      const projectCard = await screen.findByText('Dubai Mall Expansion');
      await user.click(projectCard);

      // Go to drawings tab
      const drawingsTab = await screen.findByText(/drawings/i);
      await user.click(drawingsTab);

      // Create file
      const file = new File(['drawing content'], 'floor-plan.pdf', { type: 'application/pdf' });

      // Find upload area
      const uploadInput = await screen.findByTestId('file-upload-input');
      
      // Mock upload response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '1',
          fileName: 'floor-plan.pdf',
          fileSize: 1024,
          uploadDate: new Date().toISOString(),
          status: 'pending_review'
        })
      });

      // Upload file
      await user.upload(uploadInput, file);

      // Verify upload
      await waitFor(() => {
        expect(screen.getByText('File uploaded successfully')).toBeInTheDocument();
        expect(screen.getByText('floor-plan.pdf')).toBeInTheDocument();
      });
    });

    it('should approve/reject shop drawings', async () => {
      const user = userEvent.setup();
      
      const mockDrawings = [{
        id: '1',
        fileName: 'floor-plan.pdf',
        status: 'pending_review',
        uploadDate: new Date().toISOString()
      }];

      // Mock drawings response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockDrawings })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to drawings
      const drawingsTab = await screen.findByText(/drawings/i);
      await user.click(drawingsTab);

      // Find drawing
      const drawing = await screen.findByText('floor-plan.pdf');
      await user.click(drawing);

      // Click approve button
      const approveButton = await screen.findByRole('button', { name: /approve/i });
      
      // Mock approve response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockDrawings[0],
          status: 'approved',
          approvedBy: mockUser,
          approvalDate: new Date().toISOString()
        })
      });

      await user.click(approveButton);

      // Verify approval
      await waitFor(() => {
        expect(screen.getByText('Drawing approved successfully')).toBeInTheDocument();
        expect(screen.getByText(/approved/i)).toBeInTheDocument();
      });
    });

    it('should download files', async () => {
      const user = userEvent.setup();
      
      // Mock file download
      global.fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(['file content'], { type: 'application/pdf' })
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to drawings
      const drawingsTab = await screen.findByText(/drawings/i);
      await user.click(drawingsTab);

      // Find download button
      const downloadButton = await screen.findByTestId('download-drawing-1');
      await user.click(downloadButton);

      // Verify download initiated
      await waitFor(() => {
        expect(screen.getByText('Download started')).toBeInTheDocument();
      });
    });
  });

  describe('5. Real-time Collaboration Workflows', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should show real-time user presence', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Navigate to project
      const projectCard = await screen.findByText('Dubai Mall Expansion');
      await fireEvent.click(projectCard);

      // Mock presence data
      const presenceData = [
        { userId: '2', user: { name: 'Jane Smith' }, status: 'online' },
        { userId: '3', user: { name: 'Bob Johnson' }, status: 'online' }
      ];

      // Simulate real-time presence update
      act(() => {
        socketService.on.mock.calls
          .find(call => call[0] === 'presence:update')?.[1](presenceData);
      });

      // Verify presence indicators
      await waitFor(() => {
        expect(screen.getByText('2 users viewing')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should receive real-time notifications', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Simulate new notification
      const notification = {
        id: '1',
        type: 'task_assigned',
        message: 'You have been assigned a new task',
        createdAt: new Date().toISOString()
      };

      act(() => {
        socketService.on.mock.calls
          .find(call => call[0] === 'notification:new')?.[1](notification);
      });

      // Verify notification appears
      await waitFor(() => {
        expect(screen.getByText('You have been assigned a new task')).toBeInTheDocument();
      });
    });

    it('should update data in real-time', async () => {
      // Mock initial project data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjects[0]
      });

      render(<App />, { wrapper: TestWrapper });

      // Navigate to project
      const projectCard = await screen.findByText('Dubai Mall Expansion');
      await fireEvent.click(projectCard);

      // Verify initial progress
      expect(screen.getByText('65%')).toBeInTheDocument();

      // Simulate real-time update
      const updateData = {
        projectId: '1',
        changes: { progress: 75 }
      };

      act(() => {
        socketService.on.mock.calls
          .find(call => call[0] === 'project:updated')?.[1](updateData);
      });

      // Verify updated progress
      await waitFor(() => {
        expect(screen.getByText('75%')).toBeInTheDocument();
      });
    });
  });

  describe('6. Search and Navigation Workflows', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should perform global search', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Find search input
      const searchInput = await screen.findByPlaceholderText(/search/i);
      await user.type(searchInput, 'Dubai');

      // Mock search response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              id: '1',
              type: 'project',
              title: 'Dubai Mall Expansion',
              description: 'Large retail expansion project'
            },
            {
              id: '2',
              type: 'task',
              title: 'Dubai permits submission',
              description: 'Submit building permits'
            }
          ]
        })
      });

      // Wait for search results
      await waitFor(() => {
        expect(screen.getByText('Dubai Mall Expansion')).toBeInTheDocument();
        expect(screen.getByText('Dubai permits submission')).toBeInTheDocument();
      });

      // Click on result
      const projectResult = screen.getByText('Dubai Mall Expansion');
      await user.click(projectResult);

      // Verify navigation
      await waitFor(() => {
        expect(window.location.pathname).toContain('/project/1');
      });
    });

    it('should navigate using breadcrumbs', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Navigate to project details
      const projectCard = await screen.findByText('Dubai Mall Expansion');
      await user.click(projectCard);

      // Navigate to tasks
      const tasksTab = await screen.findByText(/tasks/i);
      await user.click(tasksTab);

      // Use breadcrumbs to go back
      const projectBreadcrumb = await screen.findByRole('link', { name: /Dubai Mall Expansion/i });
      await user.click(projectBreadcrumb);

      // Verify navigation
      await waitFor(() => {
        expect(screen.getByText('Project Overview')).toBeInTheDocument();
      });
    });
  });

  describe('7. Report Generation Workflows', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should generate project reports', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Navigate to reports
      const reportsTab = await screen.findByText(/reports/i);
      await user.click(reportsTab);

      // Select report type
      const reportTypeSelect = await screen.findByLabelText(/report type/i);
      await user.selectOptions(reportTypeSelect, 'project_status');

      // Select project
      const projectSelect = await screen.findByLabelText(/select project/i);
      await user.selectOptions(projectSelect, '1');

      // Mock report generation
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          reportId: 'report-123',
          status: 'generating'
        })
      });

      // Generate report
      const generateButton = await screen.findByRole('button', { name: /generate report/i });
      await user.click(generateButton);

      // Mock report ready
      global.fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(['report content'], { type: 'application/pdf' })
      });

      // Verify report generation
      await waitFor(() => {
        expect(screen.getByText('Report generated successfully')).toBeInTheDocument();
      });
    });

    it('should export data to Excel', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Navigate to projects
      const projectsTab = await screen.findByText(/projects/i);
      await user.click(projectsTab);

      // Click export button
      const exportButton = await screen.findByRole('button', { name: /export/i });
      await user.click(exportButton);

      // Select Excel format
      const excelOption = await screen.findByText(/export to excel/i);
      
      // Mock export response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(['excel data'], { type: 'application/vnd.ms-excel' })
      });

      await user.click(excelOption);

      // Verify export
      await waitFor(() => {
        expect(screen.getByText('Export completed')).toBeInTheDocument();
      });
    });
  });

  describe('8. Settings and Preferences Workflows', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should update user profile', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Navigate to settings
      const userMenu = await screen.findByTestId('user-menu-button');
      await user.click(userMenu);

      const settingsOption = await screen.findByText(/settings/i);
      await user.click(settingsOption);

      // Update profile
      const phoneInput = await screen.findByLabelText(/phone/i);
      await user.clear(phoneInput);
      await user.type(phoneInput, '+971501234567');

      // Mock update response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockUser,
          phone: '+971501234567'
        })
      });

      // Save changes
      const saveButton = await screen.findByRole('button', { name: /save changes/i });
      await user.click(saveButton);

      // Verify update
      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
      });
    });

    it('should change notification preferences', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Navigate to settings
      const settingsButton = await screen.findByTestId('settings-button');
      await user.click(settingsButton);

      // Go to notifications tab
      const notificationsTab = await screen.findByText(/notifications/i);
      await user.click(notificationsTab);

      // Toggle email notifications
      const emailToggle = await screen.findByLabelText(/email notifications/i);
      await user.click(emailToggle);

      // Mock update response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      // Verify update
      await waitFor(() => {
        expect(screen.getByText('Preferences updated')).toBeInTheDocument();
      });
    });
  });

  describe('9. Error Handling Workflows', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should handle network errors gracefully', async () => {
      // Mock network error
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<App />, { wrapper: TestWrapper });

      // Try to load projects
      const projectsTab = await screen.findByText(/projects/i);
      await fireEvent.click(projectsTab);

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/unable to load projects/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('should handle validation errors', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Try to create project with invalid data
      const newProjectButton = await screen.findByRole('button', { name: /new project/i });
      await user.click(newProjectButton);

      // Submit empty form
      const saveButton = await screen.findByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Verify validation errors
      await waitFor(() => {
        expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/client is required/i)).toBeInTheDocument();
      });
    });

    it('should handle session expiration', async () => {
      // Mock 401 response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Session expired' })
      });

      render(<App />, { wrapper: TestWrapper });

      // Try to load data
      await waitFor(() => {
        expect(screen.getByText(/session expired/i)).toBeInTheDocument();
        expect(screen.getByText(/please log in again/i)).toBeInTheDocument();
      });
    });
  });

  describe('10. Accessibility Workflows', () => {
    beforeEach(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    });

    it('should support keyboard navigation', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Tab through main navigation
      await userEvent.tab();
      expect(screen.getByText(/dashboard/i)).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByText(/projects/i)).toHaveFocus();

      // Use arrow keys in dropdown
      const userMenu = screen.getByTestId('user-menu-button');
      userMenu.focus();
      await userEvent.keyboard('{Enter}');

      await userEvent.keyboard('{ArrowDown}');
      expect(screen.getByText(/profile/i)).toHaveFocus();
    });

    it('should announce dynamic content changes', async () => {
      render(<App />, { wrapper: TestWrapper });

      // Mock task creation
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '3',
          name: 'New Task',
          status: 'pending'
        })
      });

      // Create task
      const addTaskButton = await screen.findByRole('button', { name: /add task/i });
      await userEvent.click(addTaskButton);

      // Verify aria-live announcement
      await waitFor(() => {
        const liveRegion = screen.getByRole('status');
        expect(liveRegion).toHaveTextContent('Task created successfully');
      });
    });

    it('should maintain focus management', async () => {
      const user = userEvent.setup();
      
      render(<App />, { wrapper: TestWrapper });

      // Open modal
      const newProjectButton = await screen.findByRole('button', { name: /new project/i });
      await user.click(newProjectButton);

      // Focus should move to modal
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
        expect(within(modal).getByLabelText(/project name/i)).toHaveFocus();
      });

      // Close modal
      await user.keyboard('{Escape}');

      // Focus should return to trigger button
      await waitFor(() => {
        expect(newProjectButton).toHaveFocus();
      });
    });
  });
});