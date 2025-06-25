import React, { useState, Suspense, useCallback } from 'react';
import { generateProjectId, generateTaskId, generateMemberId } from '../utils/generators/idGenerator';
import apiService from '../services/api/apiService';
import { notificationService } from '../services/notifications/notificationService';
import { useFilteredData, useActiveFilters } from '../hooks/useFormula';
import { useEnhancedSearch } from '../hooks/useEnhancedSearch';
import { useNavigation } from '../context/NavigationContext';
import { useDialogManager } from '../hooks/useDialogManager';
import { useNotification } from '../context/NotificationContext';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Dialog,
  DialogContent,
  Button
} from '@mui/material';
import { Add } from '@mui/icons-material';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import NotificationContainer from '../components/ui/NotificationContainer';
import ModernDashboardLayout from '../components/layout/ModernDashboardLayout';
import ModernStatsCards from '../components/charts/ModernStatsCards';
import EnhancedTabSystem from '../components/layout/EnhancedTabSystem';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { exportProjectsToExcel } from '../services/export/excelExport';

// Import centralized lazy components for better performance and maintainability
import {
  ModernProjectOverview,
  ProjectsList,
  EnhancedTasksView,
  GanttChart,
  TeamMembersList,
  ClientsList,
  ProjectFormPage,
  TaskFormPage,
  TeamMemberFormPage,
  ProjectsTableView,
  ProjectsFilters,
  MyProjectsList,
  EnhancedProjectScope,
  TeamMemberDetail,
  BoardView,
  ShopDrawingsList,
  MaterialSpecificationsList,
  ProjectPage,
  DialogContainer,
  LoadingFallback,
  ListSkeleton,
  ProjectCardSkeleton,
  TaskRowSkeleton,
  TeamMemberSkeleton,
  FormSkeleton,
  FeedTab
} from '../components/lazy';

/**
 * AppContent component containing all the business logic and UI management
 * Separated from App.js to keep the main component clean and focused
 */
export const AppContent = ({
  // Data props
  projects,
  tasks,
  teamMembers,
  clients,
  loading,
  error,
  // CRUD operations
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
  deleteClient,
  setTasks,
  setError
}) => {
  // Navigation context
  const { 
    currentProjectId, 
    isInProjectContext, 
    navigateToProject
  } = useNavigation();

  // Notification hook
  const { showSuccess, showError, showWarning } = useNotification();

  // Dialog management
  const {
    dialogState,
    currentTab,
    globalSearch,
    // Project dialogs
    openEditProjectDialog,
    closeEditProjectDialog,
    openScopeDialog,
    closeScopeDialog,
    // Task dialogs
    closeEditTaskDialog,
    openViewTaskDialog,
    // Team member dialogs
    openAddClientDialog,
    closeAddClientDialog,
    openTeamMemberDetail,
    closeTeamMemberDetail,
    // Tab and search
    setCurrentTab,
    setGlobalSearch
  } = useDialogManager();

  // Enhanced search with debouncing
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    quickFilters,
    isSearching,
  } = useEnhancedSearch(projects, tasks, teamMembers, clients);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Full-page navigation state
  const [currentPage, setCurrentPage] = useState('main');
  const [currentFormData, setCurrentFormData] = useState(null);
  
  // Navigation helpers
  const navigateToMain = useCallback(() => {
    setCurrentPage('main');
    setCurrentFormData(null);
  }, []);
  
  // New state for enhanced projects view
  const [projectsViewMode, setProjectsViewMode] = useState(
    localStorage.getItem('projectsViewMode') || 'board'
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
      
      // Show success notification
      showSuccess(`Project "${project.name}" created successfully`, { action: 'save' });
      
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
      showError('Failed to create project. Please try again.');
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
      closeEditProjectDialog();
      
      // Show success notification
      showSuccess(`Project "${project.name}" updated successfully`, { action: 'save' });
      
      // Add notification for project status change
      if (oldProject && project.status !== oldProject.status) {
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        notificationService.notifyProjectStatusChange(updatedProject, oldProject.status, project.status, currentUser);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
      showError('Failed to update project. Please try again.');
    }
  }, [updateProject, setError, projects, teamMembers, closeEditProjectDialog]);

  const handleDeleteProject = useCallback(async (projectId) => {
    try {
      const project = projects.find(p => p.id === projectId);
      await deleteProject(projectId);
      showSuccess(`Project "${project?.name || 'Unknown'}" deleted successfully`, { action: 'delete' });
    } catch (error) {
      console.error('Error deleting project:', error);
      showError('Failed to delete project. Please try again.');
    }
  }, [deleteProject, projects, showSuccess, showError]);

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
      
      // Show success notification
      showSuccess(`Task "${task.name}" created successfully`, { action: 'save' });
      
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
      showError('Failed to create task. Please try again.');
    }
  }, [addTask, navigateToMain, teamMembers, projects, setError]);

  const updateTaskWithForm = useCallback(async (task) => {
    try {
      const updatedTask = await apiService.updateTask(task.id, task);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      closeEditTaskDialog();
      showSuccess(`Task "${task.name}" updated successfully`, { action: 'save' });
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
      showError('Failed to update task. Please try again.');
    }
  }, [tasks, setTasks, setError, closeEditTaskDialog, showSuccess, showError]);

  const updateTaskStatus = useCallback(async (taskId, updates) => {
    try {
      const oldTask = tasks.find(t => t.id === taskId);
      const updatedTask = await apiService.updateTask(taskId, updates);
      
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));

      // Show success notification for status update
      if (updates.status) {
        showSuccess(`Task status updated to "${updates.status}"`, { action: 'save' });
      }

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

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await deleteTask(taskId);
      showSuccess(`Task "${task?.name || 'Unknown'}" deleted successfully`, { action: 'delete' });
    } catch (error) {
      console.error('Error deleting task:', error);
      showError('Failed to delete task. Please try again.');
    }
  }, [deleteTask, tasks, showSuccess, showError]);

  const handleViewTask = useCallback((task) => {
    openViewTaskDialog(task);
  }, [openViewTaskDialog]);

  const handleEditTask = useCallback((task) => {
    setCurrentPage('edit-task');
    setCurrentFormData(task);
  }, []);

  // Client functions
  const handleAddClientForm = async (client) => {
    try {
      const newClient = {
        ...client,
        id: Date.now(), // Simple ID generation
        createdAt: new Date().toISOString()
      };
      
      await addClient(newClient);
      closeAddClientDialog();
    } catch (error) {
      console.error('Error creating client:', error);
      setError('Failed to create client');
    }
  };

  const handleAddClient = () => {
    openAddClientDialog();
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
    openTeamMemberDetail(member);
  }, [openTeamMemberDetail]);

  const handleCloseTeamMemberDetail = useCallback(() => {
    closeTeamMemberDetail();
  }, [closeTeamMemberDetail]);

  // Optimized global search functionality
  const handleGlobalSearchChange = useCallback((value) => {
    setGlobalSearch(value);
    setSearchTerm(value); // Update debounced search term
    if (value.trim().length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [setGlobalSearch, setSearchTerm]);

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
    setGlobalSearch('');
    
    // Enhanced navigation based on result type
    switch (result.type) {
      case 'project':
        // Navigate to specific project using project navigation
        handleNavigateToProject(result.id, 'overview');
        break;
      case 'task':
        setCurrentTab(3); // Switch to Tasks tab
        openViewTaskDialog(result);
        break;
      case 'team-member':
        setCurrentTab(4); // Switch to Team tab
        openTeamMemberDetail(result);
        break;
      case 'client':
        setCurrentTab(5); // Switch to Clients tab
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
  }, [setGlobalSearch, setCurrentTab, openViewTaskDialog, openTeamMemberDetail]);

  // Get search results (now using debounced search)
  const getSearchResults = () => {
    return {
      projects: searchResults.projects,
      tasks: searchResults.tasks,
      teamMembers: searchResults.teamMembers
    };
  };

  const handleTabChange = useCallback((_, newValue) => {
    setCurrentTab(newValue);
  }, [setCurrentTab]);

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
  const handleNavigateToProject = useCallback((projectId, section = 'overview') => {
    const project = projects.find(p => p.id === projectId);
    const projectName = project?.name || `Project ${projectId}`;
    
    // We need to update NavigationContext to accept project name
    navigateToProject(projectId, section, projectName);
  }, [navigateToProject, projects]);

  const handleViewProject = (project) => {
    handleNavigateToProject(project.id, 'overview');
  };

  const handleEditProject = useCallback((project) => {
    openEditProjectDialog(project);
  }, [openEditProjectDialog]);

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

  const handleManageScope = useCallback((project) => {
    openScopeDialog(project);
  }, [openScopeDialog]);

  const handleCloseScopeDialog = useCallback(() => {
    closeScopeDialog();
  }, [closeScopeDialog]);

  // Use custom filtering hook for better performance
  const filteredProjects = useFilteredData(projects, projectsFilters, projectsSearchTerm);
  const activeFilters = useActiveFilters(projectsFilters, projectsSearchTerm, clients, teamMembers);

  const renderFullPageContent = () => {
    console.log('🎯 Rendering content - currentPage:', currentPage, 'currentTab:', currentTab, 'isInProject:', isInProjectContext());
    
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
              onNavigateToProject={handleNavigateToProject}
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
    console.log('📊 Rendering tab content for tab:', currentTab);
    switch (currentTab) {
      case 0: // Dashboard
        console.log('📈 Rendering dashboard with data:', { 
          projects: projects.length, 
          tasks: tasks.length, 
          teamMembers: teamMembers.length 
        });
        return (
          <ErrorBoundary fallbackMessage="Failed to load dashboard">
            <>
              <ModernStatsCards projects={projects} tasks={tasks} teamMembers={teamMembers} />
              <Suspense fallback={<LoadingFallback message="Loading project overview..." />}>
                <ModernProjectOverview projects={projects} tasks={tasks} teamMembers={teamMembers} clients={clients} onViewProject={handleViewProject} />
              </Suspense>
            </>
          </ErrorBoundary>
        );

      case 1: // Projects
        return (
          <Box>
            {/* Simple Header with Add Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {`${filteredProjects.length} active projects`}
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => {
                  setCurrentPage('add-project');
                  setCurrentFormData(null);
                }}
                sx={{ 
                  backgroundColor: '#E3AF64',
                  '&:hover': { backgroundColor: '#d19a4d' }
                }}
              >
                Add Project
              </Button>
            </Box>

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
                    onDeleteProject={handleDeleteProject}
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
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 3
                }}
              >
                <ErrorBoundary fallbackMessage="Failed to load projects list">
                  <Suspense fallback={<ListSkeleton SkeletonComponent={ProjectCardSkeleton} count={4} />}>
                    <ProjectsList 
                      projects={filteredProjects}
                      tasks={tasks}
                      clients={clients}
                      onDeleteProject={handleDeleteProject}
                      onManageScope={handleManageScope}
                      onViewProject={handleViewProject}
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
                  border: (theme) => `1px solid ${theme.palette.divider}`,
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
                onDeleteProject={handleDeleteProject}
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
                onDeleteTask={handleDeleteTask}
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
                projects={projects}
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
                  border: (theme) => `1px solid ${theme.palette.divider}`,
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
              border: (theme) => `1px solid ${theme.palette.divider}`,
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

      case 10: // Activity Feed
        return (
          <ErrorBoundary fallbackMessage="Failed to load activity feed">
            <Suspense fallback={<LoadingFallback message="Loading activity feed..." />}>
              <FeedTab 
                onTabChange={setCurrentTab}
                projects={projects}
                onNavigateToProject={handleNavigateToProject}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 'reports': // Reports
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Construction Reports
            </Typography>
            <Typography variant="body1" color="textSecondary">
              📝 Advanced reporting system for construction projects, including progress reports, quality inspections, and issue tracking.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              Reports functionality is available and ready for integration.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <ModernDashboardLayout 
        currentTab={currentTab} 
        onTabChange={handleTabChange}
        projects={projects}
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
              <Paper sx={{ p: 2, backgroundColor: (theme) => theme.palette.warning.light, border: (theme) => `1px solid ${theme.palette.warning.main}` }}>
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

      {/* Dialog Container - All dialogs are now managed centrally */}
      <Suspense fallback={<FormSkeleton />}>
        <DialogContainer
          // Data props
          projects={projects}
          tasks={tasks}
          teamMembers={teamMembers}
          clients={clients}
          
          // Event handlers
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
          onAddTask={handleAddTask}
          onUpdateTask={updateTaskWithForm}
          onAddTeamMember={handleAddTeamMemberForm}
          onAddClient={handleAddClientForm}
          
          // Search props
          searchTerm={searchTerm}
          searchResults={getSearchResults()}
          isSearching={isSearching}
          suggestions={suggestions}
          quickFilters={quickFilters}
          showSearchResults={showSearchResults}
          onSearchChange={handleGlobalSearchChange}
          onCloseSearch={() => setShowSearchResults(false)}
          onSearchResultSelect={handleSearchResultSelect}
        />
      </Suspense>

      {/* Project Scope Dialog - Keeping this separate as it's complex */}
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
    </ProtectedRoute>
  );
};