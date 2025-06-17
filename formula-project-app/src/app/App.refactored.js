import React, { Suspense } from 'react';
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
import EnhancedTabSystem from '../components/layout/EnhancedTabSystem';
import EnhancedHeader from '../components/layout/EnhancedHeader';
import ErrorBoundary from '../components/common/ErrorBoundary';
import './App.css';
import '../styles/globals.css';
import '../styles/modern-dashboard.css';
import { formulaTheme } from '../theme';

// Import custom hooks
import { 
  useAppState, 
  useDialogManager, 
  useAppHandlers, 
  useAppInitialization,
  useFilteredData,
  useActiveFilters 
} from '../hooks';

// Import centralized lazy components
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
} from '../components/lazy';

function App() {
  // Use the refactored hooks
  const appState = useAppState();
  const dialogManager = useDialogManager();
  const { isInitialized } = useAppInitialization(
    appState.teamMembers, 
    appState.projects, 
    appState.tasks
  );

  // Extract commonly used values from appState
  const {
    projects,
    tasks,
    teamMembers,
    clients,
    loading,
    error,
    stats,
    setTasks,
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
    deleteClient,
    currentProjectId,
    isInProjectContext,
    navigateToProject,
    currentPage,
    setCurrentPage,
    currentFormData,
    setCurrentFormData,
    navigateToMain,
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    quickFilters,
    isSearching,
    showSearchResults,
    setShowSearchResults,
    projectsViewMode,
    setProjectsViewMode,
    tasksViewMode,
    setTasksViewMode,
    teamViewMode,
    setTeamViewMode,
    clientsViewMode,
    setClientsViewMode,
    projectsSearchTerm,
    setProjectsSearchTerm,
    showProjectsFilters,
    setShowProjectsFilters,
    projectsFilters,
    setProjectsFilters,
    filteredProjects,
    activeFilters
  } = appState;

  // Use dialog manager
  const {
    dialogState,
    updateDialogState,
    currentTab,
    globalSearch,
    setCurrentTab,
    setGlobalSearch
  } = dialogManager;

  // Use app handlers
  const handlers = useAppHandlers({
    // Data and state
    projects,
    tasks,
    teamMembers,
    clients,
    setTasks,
    setError,
    filteredProjects,
    projectsFilters,
    projectsSearchTerm,
    
    // Data operations
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
    
    // Navigation
    navigateToMain,
    navigateToProject,
    setCurrentPage,
    setCurrentFormData,
    
    // Dialog management
    updateDialogState,
    
    // Search and filters
    setSearchTerm,
    setShowSearchResults,
    setProjectsSearchTerm,
    setShowProjectsFilters,
    setProjectsFilters,
    
    // View modes
    setProjectsViewMode,
    setTasksViewMode,
    setTeamViewMode,
    setClientsViewMode
  });

  // Get search results
  const getSearchResults = () => {
    return {
      projects: searchResults.projects,
      tasks: searchResults.tasks,
      teamMembers: searchResults.teamMembers
    };
  };

  if (loading) {
    return (
      <NotificationProvider>
        <NavigationProvider>
          <ThemeProvider theme={formulaTheme}>
            <CssBaseline />
            <ModernDashboardLayout 
              currentTab={currentTab} 
              onTabChange={handlers.handleTabChange}
              globalSearch={globalSearch}
              onGlobalSearchChange={handlers.handleGlobalSearchChange}
              onSearchSubmit={handlers.handleSearchSubmit}
              onSearchResultSelect={handlers.handleSearchResultSelect}
              onShowFullSearch={handlers.handleShowFullSearch}
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
              onEditProject={handlers.handleEditProject}
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
                onSubmit={handlers.handleAddTask}
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
                onSubmit={handlers.updateTaskWithForm}
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
                onSubmit={handlers.handleAddProject}
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
                onSubmit={handlers.handleAddTeamMemberForm}
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

            <EnhancedTabSystem
              currentView={projectsViewMode}
              onViewChange={handlers.handleViewModeChange}
              onFilterToggle={handlers.handleToggleProjectsFilters}
              onExport={handlers.handleProjectsExport}
              hasActiveFilters={activeFilters.length > 0}
              activeFiltersCount={activeFilters.length}
              title="Projects"
            />

            <Suspense fallback={<LoadingFallback message="Loading filters..." />}>
              <ProjectsFilters
                open={showProjectsFilters}
                filters={projectsFilters}
                onFiltersChange={handlers.handleFiltersChange}
                onClearFilters={handlers.handleClearFilters}
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
                    onTaskUpdate={handlers.updateTaskStatus}
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
                    onEditProject={handlers.handleEditProject}
                    onDeleteProject={deleteProject}
                    onViewProject={handlers.handleViewProject}
                    onManageScope={handlers.handleManageScope}
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
                      onManageScope={handlers.handleManageScope}
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
                onEditProject={handlers.handleEditProject}
                onViewProject={handlers.handleViewProject}
                onManageScope={handlers.handleManageScope}
                onViewTask={handlers.handleViewTask}
                onEditTask={handlers.handleEditTask}
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
                onAddTask={handlers.handleNavigateToAddTask}
                onViewTask={handlers.handleViewTask}
                onEditTask={handlers.handleEditTask}
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
                onClose={handlers.handleCloseTeamMemberDetail}
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
                onAddMember={handlers.handleAddTeamMember}
                onViewMemberDetail={handlers.handleViewTeamMemberDetail}
                viewMode={teamViewMode}
                onViewModeChange={handlers.handleTeamViewModeChange}
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
                onAddClient={handlers.handleAddClient}
                viewMode={clientsViewMode}
                onViewModeChange={handlers.handleClientsViewModeChange}
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
                  console.log('Drawing uploaded:', drawing);
                }}
                onDrawingUpdate={(drawingId, updates) => {
                  console.log('Drawing updated:', drawingId, updates);
                }}
                onDrawingDelete={(drawingId) => {
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
                shopDrawings={[]}
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
                  onTabChange={handlers.handleTabChange}
                  globalSearch={globalSearch}
                  onGlobalSearchChange={handlers.handleGlobalSearchChange}
                  onSearchSubmit={handlers.handleSearchSubmit}
                  onSearchResultSelect={handlers.handleSearchResultSelect}
                  onShowFullSearch={handlers.handleShowFullSearch}
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

                {/* Dialogs */}
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
                      <ProjectForm onSubmit={handlers.handleAddProject} clients={clients} />
                    </Suspense>
                  </DialogContent>
                </Dialog>

                {/* Edit Project Dialog */}
                <Dialog 
                  open={dialogState.editProjectDialogOpen} 
                  onClose={handlers.handleCloseEditDialog}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogContent>
                    {dialogState.selectedProjectForEdit && (
                      <Suspense fallback={<FormSkeleton />}>
                        <ProjectForm 
                          onSubmit={handlers.handleUpdateProject} 
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
                  onClose={handlers.handleCloseViewDialog}
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
                  onClose={handlers.handleCloseScopeDialog}
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
                          onClose={handlers.handleCloseScopeDialog}
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
                        onSubmit={handlers.handleAddTeamMemberForm} 
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
                      <ClientForm onSubmit={handlers.handleAddClientForm} />
                    </Suspense>
                  </DialogContent>
                </Dialog>

                {/* Edit Task Dialog */}
                <Dialog 
                  open={dialogState.editTaskDialogOpen} 
                  onClose={handlers.handleCloseEditTaskDialog}
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
                          onSubmit={handlers.updateTaskWithForm}
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
                        onSubmit={handlers.handleAddTask}
                        onCancel={() => updateDialogState({ addTaskDialogOpen: false })}
                      />
                    </Suspense>
                  </DialogContent>
                </Dialog>

                {/* View Task Dialog */}
                <Dialog 
                  open={dialogState.viewTaskDialogOpen} 
                  onClose={handlers.handleCloseViewTaskDialog}
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
                    onSearchChange={handlers.handleGlobalSearchChange}
                    onClose={() => setShowSearchResults(false)}
                    onSelectResult={handlers.handleSearchResultSelect}
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