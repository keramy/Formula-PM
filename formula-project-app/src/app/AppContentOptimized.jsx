import React, { useState, Suspense, useCallback, useMemo } from 'react';
import { Box, Dialog, DialogContent } from '@mui/material';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import NotificationContainer from '../components/ui/NotificationContainer';
import ModernDashboardLayout from '../components/layout/ModernDashboardLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Hooks
import { useFilteredData, useActiveFilters } from '../hooks/useFormula';
import { useEnhancedSearch } from '../hooks/useEnhancedSearch';
import { useNavigation } from '../context/NavigationContext';
import { useDialogManager } from '../hooks/useDialogManager';
import { useNotification } from '../context/NotificationContext';
import { useProjectHandlers } from './hooks/useProjectHandlers';
import { useTaskHandlers } from './hooks/useTaskHandlers';
import logger from '../utils/logger';

// Tab Components
import DashboardTab from './components/tabs/DashboardTab';
import ProjectsTab from './components/tabs/ProjectsTab';

// Lazy imports
import {
  MyProjectsList,
  TasksView,
  TeamMembersList,
  ClientsList,
  ProjectFormPage,
  TaskFormPage,
  TeamMemberFormPage,
  ProjectPage,
  DialogContainer,
  ProjectScope,
  TeamMemberDetail,
  ShopDrawingsList,
  MaterialSpecificationsList,
  FeedTab,
  LoadingFallback,
  FormSkeleton,
  ListSkeleton,
  TaskRowSkeleton,
  TeamMemberSkeleton,
  ProjectCardSkeleton
} from '../components/lazy';

// Services
import { exportProjectsToExcel } from '../services/export/excelExport';
import { generateMemberId } from '../utils/generators/idGenerator';

/**
 * Optimized AppContent component with better performance and maintainability
 */
export const AppContentOptimized = ({
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
  // Navigation and UI state
  const { currentProjectId, isInProjectContext, navigateToProject } = useNavigation();
  const { showSuccess, showError, showWarning } = useNotification();
  
  // Dialog management
  const {
    dialogState,
    currentTab,
    globalSearch,
    openEditProjectDialog,
    closeEditProjectDialog,
    openScopeDialog,
    closeScopeDialog,
    closeEditTaskDialog,
    openViewTaskDialog,
    openAddClientDialog,
    closeAddClientDialog,
    openTeamMemberDetail,
    closeTeamMemberDetail,
    setCurrentTab,
    setGlobalSearch
  } = useDialogManager();

  // Search functionality
  const { searchTerm, setSearchTerm, searchResults, suggestions, quickFilters, isSearching } = 
    useEnhancedSearch(projects, tasks, teamMembers, clients);
  
  // Page navigation state
  const [currentPage, setCurrentPage] = useState('main');
  const [currentFormData, setCurrentFormData] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // View modes
  const [projectsViewMode, setProjectsViewMode] = useState(
    localStorage.getItem('projectsViewMode') || 'board'
  );
  const [teamViewMode, setTeamViewMode] = useState(
    localStorage.getItem('teamViewMode') || 'card'
  );
  const [clientsViewMode, setClientsViewMode] = useState(
    localStorage.getItem('clientsViewMode') || 'card'
  );
  
  // Filters
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

  // Navigation helpers
  const navigateToMain = useCallback(() => {
    setCurrentPage('main');
    setCurrentFormData(null);
  }, []);

  // Use custom hooks for handlers
  const projectHandlers = useProjectHandlers({
    projects,
    teamMembers,
    addProject,
    updateProject,
    deleteProject,
    navigateToMain,
    showSuccess,
    showError,
    setError,
    closeEditProjectDialog,
    openEditProjectDialog,
    openScopeDialog,
    closeScopeDialog
  });

  const taskHandlers = useTaskHandlers({
    tasks,
    projects,
    teamMembers,
    addTask,
    deleteTask,
    setTasks,
    setError,
    navigateToMain,
    showSuccess,
    showError,
    closeEditTaskDialog,
    openViewTaskDialog
  });

  // Memoized filtered data
  const filteredProjects = useFilteredData(projects, projectsFilters, projectsSearchTerm);
  const activeFilters = useActiveFilters(projectsFilters, projectsSearchTerm, clients, teamMembers);

  // Handler functions
  const handleNavigateToProject = useCallback((projectId, section = 'overview') => {
    const project = projects.find(p => p.id === projectId);
    const projectName = project?.name || `Project ${projectId}`;
    navigateToProject(projectId, section, projectName);
  }, [navigateToProject, projects]);

  const handleViewProject = useCallback((project) => {
    handleNavigateToProject(project.id, 'overview');
  }, [handleNavigateToProject]);

  const handleProjectsExport = useCallback(async () => {
    try {
      const result = await exportProjectsToExcel(filteredProjects, clients, teamMembers);
      if (result.success) {
        showSuccess(`Exported ${result.filename} successfully`);
      } else {
        setError(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export projects');
    }
  }, [filteredProjects, clients, teamMembers, showSuccess, setError]);

  // Client handlers
  const handleAddClientForm = useCallback(async (client) => {
    try {
      const newClient = {
        ...client,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      await addClient(newClient);
      closeAddClientDialog();
      showSuccess('Client added successfully');
    } catch (error) {
      console.error('Error creating client:', error);
      setError('Failed to create client');
    }
  }, [addClient, closeAddClientDialog, showSuccess, setError]);

  // Team member handlers
  const handleAddTeamMemberForm = useCallback(async (member) => {
    try {
      const newMember = {
        ...member,
        id: generateMemberId()
      };
      
      await addTeamMember(newMember);
      navigateToMain();
      showSuccess('Team member added successfully');
    } catch (error) {
      console.error('Error creating team member:', error);
      setError('Failed to create team member');
    }
  }, [addTeamMember, navigateToMain, showSuccess, setError]);

  // Render tab content based on current tab
  const renderTabContent = useMemo(() => {
    logger.debug('📊 Rendering tab content for tab:', currentTab);
    
    switch (currentTab) {
      case 0: // Dashboard
        return (
          <DashboardTab
            projects={projects}
            tasks={tasks}
            teamMembers={teamMembers}
            clients={clients}
            onViewProject={handleViewProject}
          />
        );

      case 1: // Projects
        return (
          <ProjectsTab
            projectsViewMode={projectsViewMode}
            filteredProjects={filteredProjects}
            projects={projects}
            tasks={tasks}
            clients={clients}
            teamMembers={teamMembers}
            showProjectsFilters={showProjectsFilters}
            projectsFilters={projectsFilters}
            activeFilters={activeFilters}
            onViewModeChange={(mode) => {
              setProjectsViewMode(mode);
              localStorage.setItem('projectsViewMode', mode);
            }}
            onToggleFilters={() => setShowProjectsFilters(!showProjectsFilters)}
            onExport={handleProjectsExport}
            onFiltersChange={setProjectsFilters}
            onClearFilters={() => {
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
            }}
            onAddProject={() => {
              setCurrentPage('add-project');
              setCurrentFormData(null);
            }}
            onEditProject={projectHandlers.handleEditProject}
            onDeleteProject={projectHandlers.handleDeleteProject}
            onViewProject={handleViewProject}
            onManageScope={projectHandlers.handleManageScope}
            onTaskUpdate={taskHandlers.updateTaskStatus}
          />
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
                onDeleteProject={projectHandlers.handleDeleteProject}
                onEditProject={projectHandlers.handleEditProject}
                onViewProject={handleViewProject}
                onManageScope={projectHandlers.handleManageScope}
                onViewTask={taskHandlers.handleViewTask}
                onEditTask={(task) => {
                  setCurrentPage('edit-task');
                  setCurrentFormData(task);
                }}
                onUpdateTask={updateTask}
                currentUserId={1008}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 3: // Tasks
        return (
          <ErrorBoundary fallbackMessage="Failed to load tasks">
            <Suspense fallback={<ListSkeleton SkeletonComponent={TaskRowSkeleton} count={5} />}>
              <TasksView 
                tasks={tasks}
                projects={projects}
                teamMembers={teamMembers}
                onUpdateTask={updateTask}
                onDeleteTask={taskHandlers.handleDeleteTask}
                onAddTask={() => {
                  setCurrentPage('add-task');
                  setCurrentFormData(null);
                }}
                onViewTask={taskHandlers.handleViewTask}
                onEditTask={(task) => {
                  setCurrentPage('edit-task');
                  setCurrentFormData(task);
                }}
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
                onClose={closeTeamMemberDetail}
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
                onAddMember={() => {
                  setCurrentPage('add-team-member');
                  setCurrentFormData(null);
                }}
                onViewMemberDetail={openTeamMemberDetail}
                viewMode={teamViewMode}
                onViewModeChange={(mode) => {
                  setTeamViewMode(mode);
                  localStorage.setItem('teamViewMode', mode);
                }}
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
                onAddClient={openAddClientDialog}
                viewMode={clientsViewMode}
                onViewModeChange={(mode) => {
                  setClientsViewMode(mode);
                  localStorage.setItem('clientsViewMode', mode);
                }}
              />
            </Suspense>
          </ErrorBoundary>
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
                shopDrawings={[]}
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

      default:
        return null;
    }
  }, [currentTab, projects, tasks, teamMembers, clients, filteredProjects, projectsViewMode, 
      teamViewMode, clientsViewMode, showProjectsFilters, projectsFilters, activeFilters,
      dialogState, projectHandlers, taskHandlers, handleViewProject, handleNavigateToProject,
      handleProjectsExport, updateTask, updateTeamMember, deleteTeamMember, updateClient,
      deleteClient, openAddClientDialog, closeTeamMemberDetail, openTeamMemberDetail]);

  // Render full page content (forms, project page, etc.)
  const renderFullPageContent = () => {
    // Check if we're in project context
    if (isInProjectContext() && currentProjectId) {
      return (
        <ErrorBoundary fallbackMessage="Failed to load project page">
          <Suspense fallback={<LoadingFallback message="Loading project..." />}>
            <ProjectPage
              projectId={currentProjectId}
              projects={projects}
              tasks={tasks}
              teamMembers={teamMembers}
              onEditProject={projectHandlers.handleEditProject}
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
                onSubmit={taskHandlers.handleAddTask}
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
                onSubmit={taskHandlers.updateTaskWithForm}
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
                onSubmit={projectHandlers.handleAddProject}
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
        return renderTabContent;
    }
  };

  return (
    <ProtectedRoute>
      <ModernDashboardLayout 
        currentTab={currentTab} 
        onTabChange={(_, newValue) => setCurrentTab(newValue)}
        projects={projects}
        globalSearch={globalSearch}
        onGlobalSearchChange={(value) => {
          setGlobalSearch(value);
          setSearchTerm(value);
          setShowSearchResults(value.trim().length > 0);
        }}
        onSearchSubmit={() => {
          if (searchTerm.trim().length > 0) {
            setShowSearchResults(true);
          }
        }}
        onSearchResultSelect={(result) => {
          setShowSearchResults(false);
          setGlobalSearch('');
          // Handle search result selection
        }}
        onShowFullSearch={() => setShowSearchResults(true)}
      >
        <div style={{ padding: '0' }}>
          {error && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="error">
                ⚠️ {error}
              </Typography>
            </Box>
          )}
          
          {renderFullPageContent()}
        </div>

        <NotificationContainer />
      </ModernDashboardLayout>

      {/* Dialogs */}
      <Suspense fallback={<FormSkeleton />}>
        <DialogContainer
          projects={projects}
          tasks={tasks}
          teamMembers={teamMembers}
          clients={clients}
          onAddProject={projectHandlers.handleAddProject}
          onUpdateProject={projectHandlers.handleUpdateProject}
          onAddTask={taskHandlers.handleAddTask}
          onUpdateTask={taskHandlers.updateTaskWithForm}
          onAddTeamMember={handleAddTeamMemberForm}
          onAddClient={handleAddClientForm}
          searchTerm={searchTerm}
          searchResults={searchResults}
          isSearching={isSearching}
          suggestions={suggestions}
          quickFilters={quickFilters}
          showSearchResults={showSearchResults}
          onSearchChange={(value) => {
            setGlobalSearch(value);
            setSearchTerm(value);
          }}
          onCloseSearch={() => setShowSearchResults(false)}
          onSearchResultSelect={() => {}}
        />
      </Suspense>

      {/* Project Scope Dialog */}
      <Dialog 
        open={dialogState.scopeDialogOpen} 
        onClose={projectHandlers.handleCloseScopeDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {dialogState.selectedProjectForScope && (
            <Suspense fallback={<LoadingFallback message="Loading project scope..." />}>
              <ProjectScope 
                project={dialogState.selectedProjectForScope} 
                onClose={projectHandlers.handleCloseScopeDialog}
              />
            </Suspense>
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
};