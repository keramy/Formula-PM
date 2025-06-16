import React, { useState, Suspense, useMemo, useCallback, useEffect } from 'react';
import { generateProjectId, generateTaskId, generateMemberId } from '../utils/generators/idGenerator';
import apiService from '../services/api/apiService';
import { notificationService } from '../services/notifications/notificationService';
import PerformanceMonitor from '../utils/performance';
import { useFormulaData, useFilteredData, useActiveFilters } from '../hooks/useFormula';
import { useAuthenticatedData } from '../hooks/useAuthenticatedData';
import { useEnhancedSearch } from '../hooks/useEnhancedSearch';
import { useNavigation } from '../context/NavigationContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { NotificationProvider, NavigationProvider } from '../context';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import NotificationContainer from '../components/ui/NotificationContainer';

// React Query imports
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import queryClient from '../services/queryClient';
import ModernDashboardLayout from '../components/layout/ModernDashboardLayout';
import ModernStatsCards from '../components/charts/ModernStatsCards';
// import UnifiedHeader from '../components/ui/UnifiedHeader';
// Import lightweight components directly
import EnhancedTabSystem from '../components/layout/EnhancedTabSystem';
import EnhancedHeader from '../components/layout/EnhancedHeader';
// Import performance and error handling components
import ErrorBoundary from '../components/common/ErrorBoundary';
import './App.css';
import '../styles/globals.css';
import '../styles/modern-dashboard.css';
import { exportProjectsToExcel } from '../services/export/excelExport';
import { formulaTheme } from '../theme';

// Import centralized lazy components for better performance and maintainability
import {
  ModernProjectOverview,
  ProjectForm,
  TaskForm,
  ProjectsList,
  EnhancedTasksView,
  GanttChart,
  TeamMemberForm,
  TeamMembersList,
  ClientForm,
  ClientsList,
  ProjectFormPage,
  TaskFormPage,
  TeamMemberFormPage,
  ProjectsTableView,
  ProjectsFilters,
  MyProjectsList,
  EnhancedProjectScope,
  TeamMemberDetail,
  GlobalSearchResults,
  BoardView,
  ShopDrawingsList,
  MaterialSpecificationsList,
  ProjectPage,
  LoadingFallback,
  ListSkeleton,
  ProjectCardSkeleton,
  TaskRowSkeleton,
  TeamMemberSkeleton,
  FormSkeleton
} from '../components/LazyComponents';


function App() {
  // Use authenticated data hook for role-based data access
  const {
    projects,
    tasks,
    teamMembers,
    clients,
    loading,
    error,
    stats,
    setProjects,
    setTasks,
    setTeamMembers,
    setClients,
    setError,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addClient,
    updateClient,
    deleteClient
  } = useAuthenticatedData();

  // Navigation context
  const { 
    currentProjectId, 
    isInProjectContext, 
    navigateToProject,
    exitProjectContext 
  } = useNavigation();

  // Initialize notification service and performance monitoring
  useEffect(() => {
    // Initialize performance monitoring
    PerformanceMonitor.init();
    
    if (teamMembers.length > 0 && projects.length > 0 && tasks.length > 0) {
      notificationService.init(teamMembers, projects, tasks);
      
      return () => {
        notificationService.destroy();
      };
    }
  }, [teamMembers, projects, tasks]);

  // Consolidated dialog state for better performance
  const [dialogState, setDialogState] = useState({
    currentTab: 0,
    createProjectDialogOpen: false,
    editProjectDialogOpen: false,
    viewProjectDialogOpen: false,
    selectedProjectForEdit: null,
    selectedProjectForView: null,
    scopeDialogOpen: false,
    selectedProjectForScope: null,
    addTeamMemberDialogOpen: false,
    addClientDialogOpen: false,
    addTaskDialogOpen: false,
    editTaskDialogOpen: false,
    viewTaskDialogOpen: false,
    selectedTaskForEdit: null,
    selectedTaskForView: null,
    teamMemberDetailOpen: false,
    selectedMemberForDetail: null,
    globalSearch: ''
  });

  // Helper function to update dialog state
  const updateDialogState = useCallback((updates) => {
    setDialogState(prev => ({ ...prev, ...updates }));
  }, []);

  // Extract commonly used values for readability
  const currentTab = dialogState.currentTab;
  const globalSearch = dialogState.globalSearch;

  // Enhanced search with debouncing
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    quickFilters,
    // clearSearch,
    isSearching,
    // hasResults
  } = useEnhancedSearch(projects, tasks, teamMembers, clients);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Full-page navigation state
  const [currentPage, setCurrentPage] = useState('main');
  const [currentFormData, setCurrentFormData] = useState(null);
  
  // Navigation helpers
  const navigateToMain = () => {
    setCurrentPage('main');
    setCurrentFormData(null);
  };
  
  // New state for enhanced projects view
  const [projectsViewMode, setProjectsViewMode] = useState(
    localStorage.getItem('projectsViewMode') || 'board'
  );
  const [tasksViewMode, setTasksViewMode] = useState(
    localStorage.getItem('tasksViewMode') || 'table'
  );
  const [teamViewMode, setTeamViewMode] = useState(
    localStorage.getItem('teamViewMode') || 'card'
  );
  const [clientsViewMode, setClientsViewMode] = useState(
    localStorage.getItem('clientsViewMode') || 'card'
  );
  const [projectsSearchTerm, setProjectsSearchTerm] = useState('');
  const [showProjectsFilters, setShowProjectsFilters] = useState(false);
  const [projectsFilters, setProjectsFilters] = useState({
    status: '',
    type: '',
    client: '',
    manager: '',
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null,
    budgetFrom: '',
    budgetTo: ''
  });


  // Memoized callbacks to prevent unnecessary re-renders
  const handleAddProject = useCallback(async (project) => {
    try {
      const newProject = {
        ...project,
        id: generateProjectId(),
        createdAt: new Date().toISOString()
      };
      
      const createdProject = await addProject(newProject);
      navigateToMain();
      
      // Add notification for project assignment
      if (project.managerId) {
        const manager = teamMembers.find(m => m.id === project.managerId);
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        
        if (manager) {
          notificationService.notifyProjectAssignment(createdProject, manager, currentUser);
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  }, [addProject, navigateToMain, setError, teamMembers]);

  const handleUpdateProject = useCallback(async (project) => {
    try {
      const oldProject = projects.find(p => p.id === project.id);
      
      // Automatically set progress to 100% if project is marked as completed
      if (project.status === 'completed' && project.progress !== 100) {
        project.progress = 100;
      }
      
      const updatedProject = await updateProject(project.id, project);
      updateDialogState({ 
        editProjectDialogOpen: false, 
        selectedProjectForEdit: null 
      });
      
      // Add notification for project status change
      if (oldProject && project.status !== oldProject.status) {
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        notificationService.notifyProjectStatusChange(updatedProject, oldProject.status, project.status, currentUser);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  }, [updateProject, setError, projects, teamMembers]);

  const handleAddTask = useCallback(async (task) => {
    try {
      const newTask = {
        ...task,
        id: generateTaskId(),
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString()
      };
      
      const createdTask = await addTask(newTask);
      navigateToMain();
      
      // Add notification for task assignment
      if (task.assignedTo) {
        const assignee = teamMembers.find(m => m.id === task.assignedTo);
        const project = projects.find(p => p.id === task.projectId);
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        
        if (assignee && project) {
          notificationService.notifyTaskAssignment(createdTask, project, assignee, currentUser);
          
          console.log('📧 Task assigned notification sent:', {
            taskName: createdTask.name,
            assigneeName: assignee.fullName,
            assigneeEmail: assignee.email,
            projectName: project.name
          });
        }
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
    }
  }, [addTask, navigateToMain, teamMembers, projects, setError]);

  const updateTaskWithForm = useCallback(async (task) => {
    try {
      const updatedTask = await apiService.updateTask(task.id, task);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      updateDialogState({ 
        editTaskDialogOpen: false, 
        selectedTaskForEdit: null 
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  }, [tasks, setTasks, setError, updateDialogState]);

  const updateTaskStatus = useCallback(async (taskId, updates) => {
    try {
      const oldTask = tasks.find(t => t.id === taskId);
      const updatedTask = await apiService.updateTask(taskId, updates);
      
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));

      // Add notifications for task changes
      if (updates.status === 'completed' && oldTask.status !== 'completed') {
        const assignee = teamMembers.find(m => m.id === updatedTask.assignedTo);
        const project = projects.find(p => p.id === updatedTask.projectId);
        
        if (assignee && project) {
          notificationService.notifyTaskCompleted(updatedTask, project, assignee);
          
          console.log('📧 Task completion notification sent:', {
            taskName: updatedTask.name,
            assigneeName: assignee.fullName,
            projectName: project.name,
            completedAt: new Date().toISOString()
          });
        }
      }
      
      // Task reassignment notification
      if (updates.assignedTo && updates.assignedTo !== oldTask.assignedTo) {
        const newAssignee = teamMembers.find(m => m.id === updates.assignedTo);
        const project = projects.find(p => p.id === updatedTask.projectId);
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        
        if (newAssignee && project) {
          notificationService.notifyTaskAssignment(updatedTask, project, newAssignee, currentUser);
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  }, [tasks, setTasks, teamMembers, projects, setError]);


  const handleViewTask = useCallback((task) => {
    updateDialogState({
      selectedTaskForView: task,
      viewTaskDialogOpen: true
    });
  }, [updateDialogState]);

  const handleEditTask = useCallback((task) => {
    setCurrentPage('edit-task');
    setCurrentFormData(task);
  }, []);

  const handleCloseEditTaskDialog = useCallback(() => {
    updateDialogState({
      editTaskDialogOpen: false,
      selectedTaskForEdit: null
    });
  }, [updateDialogState]);

  const handleCloseViewTaskDialog = useCallback(() => {
    updateDialogState({
      viewTaskDialogOpen: false,
      selectedTaskForView: null
    });
  }, [updateDialogState]);


  // Client functions
  const handleAddClientForm = async (client) => {
    try {
      const newClient = {
        ...client,
        id: Date.now(), // Simple ID generation
        createdAt: new Date().toISOString()
      };
      
      await addClient(newClient);
      updateDialogState({ addClientDialogOpen: false });
    } catch (error) {
      console.error('Error creating client:', error);
      setError('Failed to create client');
    }
  };

  const handleAddClient = () => {
    updateDialogState({ addClientDialogOpen: true });
  };

  // Team Members functions
  const handleAddTeamMemberForm = async (member) => {
    try {
      const newMember = {
        ...member,
        id: generateMemberId()
      };
      
      await addTeamMember(newMember);
      navigateToMain();
    } catch (error) {
      console.error('Error creating team member:', error);
      setError('Failed to create team member');
    }
  };

  const handleAddTeamMember = () => {
    setCurrentPage('add-team-member');
    setCurrentFormData(null);
  };

  const handleNavigateToAddTask = () => {
    setCurrentPage('add-task');
    setCurrentFormData(null);
  };

  const handleViewTeamMemberDetail = useCallback((member) => {
    updateDialogState({
      selectedMemberForDetail: member,
      teamMemberDetailOpen: true
    });
  }, [updateDialogState]);

  const handleCloseTeamMemberDetail = useCallback(() => {
    updateDialogState({
      teamMemberDetailOpen: false,
      selectedMemberForDetail: null
    });
  }, [updateDialogState]);

  // Optimized global search functionality
  const handleGlobalSearchChange = useCallback((value) => {
    updateDialogState({ globalSearch: value });
    setSearchTerm(value); // Update debounced search term
    if (value.trim().length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [updateDialogState, setSearchTerm]);

  const handleSearchSubmit = () => {
    if (searchTerm.trim().length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleShowFullSearch = useCallback(() => {
    setShowSearchResults(true);
  }, []);

  const handleSearchResultSelect = useCallback((result) => {
    setShowSearchResults(false);
    updateDialogState({ globalSearch: '' });
    
    // Enhanced navigation based on result type
    switch (result.type) {
      case 'project':
        // Navigate to specific project using project navigation
        handleNavigateToProject(result.id, 'overview');
        break;
      case 'task':
        updateDialogState({ 
          currentTab: 3, // Switch to Tasks tab
          selectedTaskForView: result,
          viewTaskDialogOpen: true
        });
        break;
      case 'team-member':
        updateDialogState({ 
          currentTab: 4, // Switch to Team tab
          selectedMemberForDetail: result,
          teamMemberDetailOpen: true
        });
        break;
      case 'client':
        updateDialogState({ currentTab: 5 }); // Switch to Clients tab
        break;
      case 'shop-drawing':
        // Navigate to project's shop drawings section
        if (result.projectId) {
          handleNavigateToProject(result.projectId, 'shop-drawings');
        }
        break;
      case 'specification':
        // Navigate to project's specifications section
        if (result.projectId) {
          handleNavigateToProject(result.projectId, 'specifications');
        }
        break;
      case 'compliance':
        // Navigate to project's compliance section
        if (result.projectId) {
          handleNavigateToProject(result.projectId, 'compliance');
        }
        break;
      default:
        break;
    }
  }, [updateDialogState, handleNavigateToProject]);

  // Get search results (now using debounced search)
  const getSearchResults = () => {
    return {
      projects: searchResults.projects,
      tasks: searchResults.tasks,
      teamMembers: searchResults.teamMembers
    };
  };

  // updateTeamMember is provided by useAuthenticatedData hook

  // deleteTeamMember is provided by useAuthenticatedData hook

  const handleTabChange = useCallback((_, newValue) => {
    updateDialogState({ currentTab: newValue });
  }, [updateDialogState]);

  // Enhanced Projects Handlers

  const handleToggleProjectsFilters = () => {
    setShowProjectsFilters(!showProjectsFilters);
  };

  const handleProjectsExport = async () => {
    try {
      const result = await exportProjectsToExcel(filteredProjects, clients, teamMembers);
      if (result.success) {
        console.log(`Exported ${result.filename} successfully`);
      } else {
        setError(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export projects');
    }
  };

  const handleViewModeChange = (mode) => {
    setProjectsViewMode(mode);
    localStorage.setItem('projectsViewMode', mode);
  };

  const handleTasksViewModeChange = (mode) => {
    setTasksViewMode(mode);
    localStorage.setItem('tasksViewMode', mode);
  };

  const handleTeamViewModeChange = (mode) => {
    setTeamViewMode(mode);
    localStorage.setItem('teamViewMode', mode);
  };

  const handleClientsViewModeChange = (mode) => {
    setClientsViewMode(mode);
    localStorage.setItem('clientsViewMode', mode);
  };

  const handleFiltersChange = (newFilters) => {
    setProjectsFilters(newFilters);
  };

  // Project Navigation Handlers
  const handleNavigateToProject = (projectId, section = 'overview') => {
    navigateToProject(projectId, section);
  };

  const handleViewProject = (project) => {
    handleNavigateToProject(project.id, 'overview');
  };

  const handleEditProject = useCallback((project) => {
    updateDialogState({
      selectedProjectForEdit: project,
      editProjectDialogOpen: true
    });
  }, [updateDialogState]);

  const handleProjectNameClick = (project) => {
    // This is used when clicking project names from other tabs
    handleNavigateToProject(project.id, 'overview');
  };

  const handleClearFilters = () => {
    setProjectsFilters({
      status: '',
      type: '',
      client: '',
      manager: '',
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null,
      budgetFrom: '',
      budgetTo: ''
    });
    setProjectsSearchTerm('');
  };

  const handleClearFilter = (filterKey) => {
    if (filterKey === 'all') {
      handleClearFilters();
    } else if (filterKey === 'search') {
      setProjectsSearchTerm('');
    } else {
      const newFilters = { ...projectsFilters };
      if (filterKey.includes('Date')) {
        newFilters[filterKey] = null;
      } else {
        newFilters[filterKey] = '';
      }
      setProjectsFilters(newFilters);
    }
  };

  const handleManageScope = useCallback((project) => {
    updateDialogState({
      selectedProjectForScope: project,
      scopeDialogOpen: true
    });
  }, [updateDialogState]);

  // Remove duplicate functions - using the ones above that implement navigation

  const handleCloseEditDialog = useCallback(() => {
    updateDialogState({
      editProjectDialogOpen: false,
      selectedProjectForEdit: null
    });
  }, [updateDialogState]);

  const handleCloseViewDialog = useCallback(() => {
    updateDialogState({
      viewProjectDialogOpen: false,
      selectedProjectForView: null
    });
  }, [updateDialogState]);

  const handleCloseScopeDialog = useCallback(() => {
    updateDialogState({
      scopeDialogOpen: false,
      selectedProjectForScope: null
    });
  }, [updateDialogState]);

  // Use custom filtering hook for better performance
  const filteredProjects = useFilteredData(projects, projectsFilters, projectsSearchTerm);
  const activeFilters = useActiveFilters(projectsFilters, projectsSearchTerm, clients, teamMembers);

  if (loading) {
    return (
      <NotificationProvider>
        <NavigationProvider>
          <ThemeProvider theme={formulaTheme}>
            <CssBaseline />
            <ModernDashboardLayout 
              currentTab={currentTab} 
              onTabChange={handleTabChange}
              globalSearch={globalSearch}
              onGlobalSearchChange={handleGlobalSearchChange}
              onSearchSubmit={handleSearchSubmit}
              onSearchResultSelect={handleSearchResultSelect}
              onShowFullSearch={handleShowFullSearch}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                  <Typography variant="h6">Loading Formula Project Management...</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Fetching team members and project data
                  </Typography>
                </div>
              </Box>
            </ModernDashboardLayout>
          </ThemeProvider>
        </NavigationProvider>
      </NotificationProvider>
    );
  }


  const renderFullPageContent = () => {
    // Check if we're in project context and render ProjectPage
    if (isInProjectContext() && currentProjectId) {
      return (
        <ErrorBoundary fallbackMessage="Failed to load project page">
          <Suspense fallback={<LoadingFallback message="Loading project..." />}>
            <ProjectPage
              projectId={currentProjectId}
              projects={projects}
              tasks={tasks}
              teamMembers={teamMembers}
              onEditProject={handleEditProject}
              onUpdateTask={updateTask}
            />
          </Suspense>
        </ErrorBoundary>
      );
    }

    switch (currentPage) {
      case 'add-task':
        return (
          <ErrorBoundary fallbackMessage="Failed to load task form">
            <Suspense fallback={<FormSkeleton />}>
              <TaskFormPage
                projects={projects}
                teamMembers={teamMembers}
                onSubmit={handleAddTask}
                onCancel={navigateToMain}
                isEdit={false}
              />
            </Suspense>
          </ErrorBoundary>
        );
        
      case 'edit-task':
        return (
          <ErrorBoundary fallbackMessage="Failed to load task form">
            <Suspense fallback={<FormSkeleton />}>
              <TaskFormPage
                task={currentFormData}
                projects={projects}
                teamMembers={teamMembers}
                onSubmit={updateTaskWithForm}
                onCancel={navigateToMain}
                isEdit={true}
              />
            </Suspense>
          </ErrorBoundary>
        );
        
      case 'add-project':
        return (
          <ErrorBoundary fallbackMessage="Failed to load project form">
            <Suspense fallback={<FormSkeleton />}>
              <ProjectFormPage
                clients={clients}
                onSubmit={handleAddProject}
                onCancel={navigateToMain}
                isEdit={false}
              />
            </Suspense>
          </ErrorBoundary>
        );
        
      case 'add-team-member':
        return (
          <ErrorBoundary fallbackMessage="Failed to load team member form">
            <Suspense fallback={<FormSkeleton />}>
              <TeamMemberFormPage
                teamMembers={teamMembers}
                onSubmit={handleAddTeamMemberForm}
                onCancel={navigateToMain}
                isEdit={false}
              />
            </Suspense>
          </ErrorBoundary>
        );
        
      case 'main':
      default:
        return renderTabContent();
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Dashboard
        return (
          <ErrorBoundary fallbackMessage="Failed to load dashboard">
            <>
              <ModernStatsCards projects={projects} tasks={tasks} teamMembers={teamMembers} />
              <Suspense fallback={<LoadingFallback message="Loading project overview..." />}>
                <ModernProjectOverview projects={projects} tasks={tasks} teamMembers={teamMembers} />
              </Suspense>
            </>
          </ErrorBoundary>
        );

      case 1: // Projects
        return (
          <Box>
            <EnhancedHeader
              title="All Projects"
              breadcrumbs={[
                { label: 'Projects', href: '/projects' }
              ]}
              searchValue={projectsSearchTerm}
              onSearchChange={setProjectsSearchTerm}
              onAdd={() => {
                setCurrentPage('add-project');
                setCurrentFormData(null);
              }}
              isStarred={false}
              onToggleStar={() => {}}
              teamMembers={teamMembers.slice(0, 5)}
              subtitle={`${filteredProjects.length} active projects`}
            />

            {/* Enhanced Tab System */}
            <EnhancedTabSystem
              currentView={projectsViewMode}
              onViewChange={handleViewModeChange}
              onFilterToggle={handleToggleProjectsFilters}
              onExport={handleProjectsExport}
              hasActiveFilters={activeFilters.length > 0}
              activeFiltersCount={activeFilters.length}
              title="Projects"
            />

            <Suspense fallback={<LoadingFallback message="Loading filters..." />}>
              <ProjectsFilters
                open={showProjectsFilters}
                filters={projectsFilters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                clients={clients}
                teamMembers={teamMembers}
                projects={projects}
              />
            </Suspense>
            
            {/* Conditional View Rendering */}
            {projectsViewMode === 'board' && (
              <ErrorBoundary fallbackMessage="Failed to load board view">
                <Suspense fallback={<LoadingFallback message="Loading board view..." />}>
                  <BoardView
                    tasks={tasks}
                    onTaskUpdate={updateTaskStatus}
                    teamMembers={teamMembers}
                    projects={projects}
                  />
                </Suspense>
              </ErrorBoundary>
            )}

            {projectsViewMode === 'table' && (
              <ErrorBoundary fallbackMessage="Failed to load table view">
                <Suspense fallback={<ListSkeleton SkeletonComponent={ProjectCardSkeleton} count={4} />}>
                  <ProjectsTableView
                    projects={filteredProjects}
                    clients={clients}
                    teamMembers={teamMembers}
                    onEditProject={handleEditProject}
                    onDeleteProject={deleteProject}
                    onViewProject={handleViewProject}
                    onManageScope={handleManageScope}
                  />
                </Suspense>
              </ErrorBoundary>
            )}

            {projectsViewMode === 'list' && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  backgroundColor: 'white',
                  border: '1px solid #E9ECEF',
                  borderRadius: 3
                }}
              >
                <ErrorBoundary fallbackMessage="Failed to load projects list">
                  <Suspense fallback={<ListSkeleton SkeletonComponent={ProjectCardSkeleton} count={4} />}>
                    <ProjectsList 
                      projects={filteredProjects}
                      tasks={tasks}
                      clients={clients}
                      onDeleteProject={deleteProject}
                      onManageScope={handleManageScope}
                    />
                  </Suspense>
                </ErrorBoundary>
              </Paper>
            )}

            {projectsViewMode === 'gantt' && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  backgroundColor: 'white',
                  border: '1px solid #E9ECEF',
                  borderRadius: 3
                }}
              >
                <ErrorBoundary fallbackMessage="Failed to load Gantt chart">
                  <Suspense fallback={<LoadingFallback message="Loading Gantt chart..." />}>
                    <GanttChart 
                      tasks={tasks}
                      projects={projects}
                      teamMembers={teamMembers}
                    />
                  </Suspense>
                </ErrorBoundary>
              </Paper>
            )}

            {projectsViewMode === 'calendar' && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  📅 Calendar View Coming Soon
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  We're working on an amazing calendar interface for your projects.
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 2: // My Projects
        return (
          <ErrorBoundary fallbackMessage="Failed to load your projects">
            <Suspense fallback={<ListSkeleton SkeletonComponent={ProjectCardSkeleton} count={3} />}>
              <MyProjectsList 
                projects={projects}
                tasks={tasks}
                clients={clients}
                teamMembers={teamMembers}
                onDeleteProject={deleteProject}
                onEditProject={handleEditProject}
                onViewProject={handleViewProject}
                onManageScope={handleManageScope}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
                onUpdateTask={updateTask}
                currentUserId={1008} // This would come from authentication in a real app
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 3: // Tasks
        return (
          <ErrorBoundary fallbackMessage="Failed to load tasks">
            <Suspense fallback={<ListSkeleton SkeletonComponent={TaskRowSkeleton} count={5} />}>
              <EnhancedTasksView 
                tasks={tasks}
                projects={projects}
                teamMembers={teamMembers}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onAddTask={handleNavigateToAddTask}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 4: // Team
        return dialogState.teamMemberDetailOpen ? (
          <ErrorBoundary fallbackMessage="Failed to load team member details">
            <Suspense fallback={<LoadingFallback message="Loading member details..." />}>
              <TeamMemberDetail
                member={dialogState.selectedMemberForDetail}
                tasks={tasks}
                projects={projects}
                teamMembers={teamMembers}
                onClose={handleCloseTeamMemberDetail}
              />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <ErrorBoundary fallbackMessage="Failed to load team members">
            <Suspense fallback={<ListSkeleton SkeletonComponent={TeamMemberSkeleton} count={4} />}>
              <TeamMembersList 
                teamMembers={teamMembers}
                tasks={tasks}
                onUpdateMember={updateTeamMember}
                onDeleteMember={deleteTeamMember}
                onAddMember={handleAddTeamMember}
                onViewMemberDetail={handleViewTeamMemberDetail}
                viewMode={teamViewMode}
                onViewModeChange={handleTeamViewModeChange}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 5: // Clients
        return (
          <ErrorBoundary fallbackMessage="Failed to load clients">
            <Suspense fallback={<ListSkeleton SkeletonComponent={ProjectCardSkeleton} count={4} />}>
              <ClientsList 
                clients={clients}
                onUpdateClient={updateClient}
                onDeleteClient={deleteClient}
                onAddClient={handleAddClient}
                viewMode={clientsViewMode}
                onViewModeChange={handleClientsViewModeChange}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 6: // Procurement
        return (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  backgroundColor: 'white',
                  border: '1px solid #E9ECEF',
                  borderRadius: 3
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2C3E50' }}>
                  Procurement Management
                </Typography>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    🛒 Procurement Module
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Procurement management features will be available here.
                    Track orders, manage suppliers, and handle procurement workflows.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );

      case 7: // Timeline & Gantt
        return (
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              backgroundColor: 'white',
              border: '1px solid #E9ECEF',
              borderRadius: 3
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2C3E50' }}>
              Project Timeline & Gantt Chart
            </Typography>
            <ErrorBoundary fallbackMessage="Failed to load timeline chart">
              <Suspense fallback={<LoadingFallback message="Loading timeline chart..." />}>
                <GanttChart 
                  tasks={tasks}
                  projects={projects}
                  teamMembers={teamMembers}
                />
              </Suspense>
            </ErrorBoundary>
          </Paper>
        );

      case 8: // Shop Drawings
        return (
          <ErrorBoundary fallbackMessage="Failed to load shop drawings">
            <Suspense fallback={<LoadingFallback message="Loading shop drawings..." />}>
              <ShopDrawingsList 
                projects={projects}
                teamMembers={teamMembers}
                onDrawingUpload={(drawing) => {
                  // This will be implemented with API integration
                  console.log('Drawing uploaded:', drawing);
                }}
                onDrawingUpdate={(drawingId, updates) => {
                  // This will be implemented with API integration
                  console.log('Drawing updated:', drawingId, updates);
                }}
                onDrawingDelete={(drawingId) => {
                  // This will be implemented with API integration
                  console.log('Drawing deleted:', drawingId);
                }}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 9: // Material Specifications
        return (
          <ErrorBoundary fallbackMessage="Failed to load material specifications">
            <Suspense fallback={<LoadingFallback message="Loading material specifications..." />}>
              <MaterialSpecificationsList 
                projects={projects}
                teamMembers={teamMembers}
                shopDrawings={[]} // This will be connected to shop drawings data later
              />
            </Suspense>
          </ErrorBoundary>
        );

      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <NavigationProvider>
            <ThemeProvider theme={formulaTheme}>
              <CssBaseline />
              <ProtectedRoute>
                <ModernDashboardLayout 
                  currentTab={currentTab} 
                  onTabChange={handleTabChange}
                  globalSearch={globalSearch}
                  onGlobalSearchChange={handleGlobalSearchChange}
                  onSearchSubmit={handleSearchSubmit}
                  onSearchResultSelect={handleSearchResultSelect}
                  onShowFullSearch={handleShowFullSearch}
                >
          <div style={{ padding: '0' }}>
            {/* Error Alert */}
            {error && (
              <Box sx={{ mb: 3 }}>
                <Paper sx={{ p: 2, backgroundColor: '#fff3e0', border: '1px solid #ff9800' }}>
                  <Typography variant="body2" color="error">
                    ⚠️ {error}
                  </Typography>
                </Paper>
              </Box>
            )}
            
            {/* Tab Content */}
            {renderFullPageContent()}
          </div>

          {/* Notification Container */}
          <NotificationContainer />
        </ModernDashboardLayout>

        {/* Create Project Dialog */}
        <Dialog 
          open={dialogState.createProjectDialogOpen} 
          onClose={() => updateDialogState({ createProjectDialogOpen: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create New Project</DialogTitle>
          <DialogContent>
            <Suspense fallback={<FormSkeleton />}>
              <ProjectForm onSubmit={handleAddProject} clients={clients} />
            </Suspense>
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog 
          open={dialogState.editProjectDialogOpen} 
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Project</DialogTitle>
          <DialogContent>
            {dialogState.selectedProjectForEdit && (
              <Suspense fallback={<FormSkeleton />}>
                <ProjectForm 
                  onSubmit={handleUpdateProject} 
                  clients={clients} 
                  initialProject={dialogState.selectedProjectForEdit}
                />
              </Suspense>
            )}
          </DialogContent>
        </Dialog>

        {/* View Project Dialog */}
        <Dialog 
          open={dialogState.viewProjectDialogOpen} 
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Project Details</DialogTitle>
          <DialogContent>
            {dialogState.selectedProjectForView && (
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {dialogState.selectedProjectForView.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {dialogState.selectedProjectForView.description || 'No description provided'}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Type:</strong> {dialogState.selectedProjectForView.type}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Status:</strong> {dialogState.selectedProjectForView.status}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Start Date:</strong> {new Date(dialogState.selectedProjectForView.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>End Date:</strong> {new Date(dialogState.selectedProjectForView.endDate).toLocaleDateString()}
                </Typography>
                {dialogState.selectedProjectForView.clientId && (
                  <Typography variant="body2" paragraph>
                    <strong>Client:</strong> {clients.find(c => c.id === dialogState.selectedProjectForView.clientId)?.companyName || 'Unknown'}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Project Scope Dialog */}
        <Dialog 
          open={dialogState.scopeDialogOpen} 
          onClose={handleCloseScopeDialog}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { height: '90vh' }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            {dialogState.selectedProjectForScope && (
              <Suspense fallback={<LoadingFallback message="Loading project scope..." />}>
                <EnhancedProjectScope 
                  project={dialogState.selectedProjectForScope} 
                  onClose={handleCloseScopeDialog}
                />
              </Suspense>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Team Member Dialog */}
        <Dialog 
          open={dialogState.addTeamMemberDialogOpen} 
          onClose={() => updateDialogState({ addTeamMemberDialogOpen: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogContent>
            <Suspense fallback={<FormSkeleton />}>
              <TeamMemberForm 
                teamMembers={teamMembers}
                onSubmit={handleAddTeamMemberForm} 
              />
            </Suspense>
          </DialogContent>
        </Dialog>

        {/* Add Client Dialog */}
        <Dialog 
          open={dialogState.addClientDialogOpen} 
          onClose={() => updateDialogState({ addClientDialogOpen: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Client</DialogTitle>
          <DialogContent>
            <Suspense fallback={<FormSkeleton />}>
              <ClientForm onSubmit={handleAddClientForm} />
            </Suspense>
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog 
          open={dialogState.editTaskDialogOpen} 
          onClose={handleCloseEditTaskDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            {dialogState.selectedTaskForEdit && (
              <Suspense fallback={<FormSkeleton />}>
                <TaskForm 
                  projects={projects}
                  teamMembers={teamMembers}
                  onSubmit={updateTaskWithForm}
                  initialTask={dialogState.selectedTaskForEdit}
                />
              </Suspense>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Task Dialog */}
        <Dialog 
          open={dialogState.addTaskDialogOpen} 
          onClose={() => updateDialogState({ addTaskDialogOpen: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <Suspense fallback={<FormSkeleton />}>
              <TaskForm 
                projects={projects}
                teamMembers={teamMembers}
                onSubmit={handleAddTask}
                onCancel={() => updateDialogState({ addTaskDialogOpen: false })}
              />
            </Suspense>
          </DialogContent>
        </Dialog>

        {/* View Task Dialog */}
        <Dialog 
          open={dialogState.viewTaskDialogOpen} 
          onClose={handleCloseViewTaskDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            {dialogState.selectedTaskForView && (
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {dialogState.selectedTaskForView.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {dialogState.selectedTaskForView.description || 'No description provided'}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Project:</strong> {projects.find(p => p.id === dialogState.selectedTaskForView.projectId)?.name || 'Unknown'}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Assigned To:</strong> {teamMembers.find(tm => tm.id === dialogState.selectedTaskForView.assignedTo)?.fullName || 'Unassigned'}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Priority:</strong> {dialogState.selectedTaskForView.priority}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Status:</strong> {dialogState.selectedTaskForView.status}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Due Date:</strong> {new Date(dialogState.selectedTaskForView.dueDate).toLocaleDateString()}
                </Typography>
                {dialogState.selectedTaskForView.progress !== undefined && (
                  <Typography variant="body2" paragraph>
                    <strong>Progress:</strong> {dialogState.selectedTaskForView.progress}%
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Global Search Results */}
        <Suspense fallback={null}>
          <GlobalSearchResults
            open={showSearchResults}
            searchTerm={searchTerm}
            onSearchChange={handleGlobalSearchChange}
            onClose={() => setShowSearchResults(false)}
            onSelectResult={handleSearchResultSelect}
            results={getSearchResults()}
            isSearching={isSearching}
            suggestions={suggestions}
            quickFilters={quickFilters}
          />
        </Suspense>
        
        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
              </ProtectedRoute>
            </ThemeProvider>
          </NavigationProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;