import React, { useState } from 'react';
import { generateProjectId, generateTaskId, generateMemberId } from '../utils/generators/idGenerator';
import apiService from '../services/api/apiService';
import { useFormulaData, useFilteredData, useActiveFilters } from '../hooks/useFormula';
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
import { NotificationProvider } from '../context';
import NotificationContainer from '../components/ui/NotificationContainer';
import ModernDashboardLayout from '../components/layout/ModernDashboardLayout';
import ModernStatsCards from '../components/charts/ModernStatsCards';
import UnifiedHeader from '../components/ui/UnifiedHeader';
import { exportProjectsToExcel } from '../services/export/excelExport';
import { formulaTheme } from '../theme';

// Direct imports to avoid chunk loading issues
import ModernProjectOverview from '../features/dashboard/components/ModernProjectOverview';
import ProjectForm from '../features/projects/components/ProjectForm';
import TaskForm from '../features/tasks/components/TaskForm';
import ProjectsList from '../features/projects/components/ProjectsList';
import TasksList from '../features/tasks/components/TasksList';
import GanttChart from '../components/charts/GanttChart';
import TeamMemberForm from '../features/team/components/TeamMemberForm';
import TeamMembersList from '../features/team/components/TeamMembersList';
import ClientForm from '../features/clients/components/ClientForm';
import ClientsList from '../features/clients/components/ClientsList';
import ProjectsTableView from '../features/projects/components/ProjectsTableView';
import ProjectsFilters from '../features/projects/components/ProjectsFilters';
import MyProjectsList from '../features/projects/components/MyProjectsList';
import EnhancedProjectScope from '../features/projects/components/EnhancedProjectScope';
import TeamMemberDetail from '../features/team/components/TeamMemberDetail';
import GlobalSearchResults from '../components/ui/GlobalSearchResults';
import BoardView from '../components/views/BoardView';
import EnhancedTabSystem from '../components/layout/EnhancedTabSystem';
import EnhancedHeader from '../components/layout/EnhancedHeader';

import './App.css';
import '../styles/globals.css';
import '../styles/modern-dashboard.css';


function App() {
  // Use custom hook for data management
  const {
    projects,
    tasks,
    teamMembers,
    clients,
    loading,
    error,
    stats,
    lookups,
    setProjects,
    setTasks,
    setTeamMembers,
    setClients,
    setError,
    loadAllData
  } = useFormulaData();

  const [currentTab, setCurrentTab] = useState(0);
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [viewProjectDialogOpen, setViewProjectDialogOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState(null);
  const [selectedProjectForView, setSelectedProjectForView] = useState(null);
  const [scopeDialogOpen, setScopeDialogOpen] = useState(false);
  const [selectedProjectForScope, setSelectedProjectForScope] = useState(null);
  const [addTeamMemberDialogOpen, setAddTeamMemberDialogOpen] = useState(false);
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [viewTaskDialogOpen, setViewTaskDialogOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);
  const [selectedTaskForView, setSelectedTaskForView] = useState(null);
  const [teamMemberDetailOpen, setTeamMemberDetailOpen] = useState(false);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
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


  const addProject = async (project) => {
    try {
      const newProject = {
        ...project,
        id: generateProjectId(),
        createdAt: new Date().toISOString()
      };
      
      const createdProject = await apiService.createProject(newProject);
      setProjects([...projects, createdProject]);
      setCreateProjectDialogOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  };

  const updateProject = async (project) => {
    try {
      // Automatically set progress to 100% if project is marked as completed
      if (project.status === 'completed' && project.progress !== 100) {
        project.progress = 100;
      }
      
      const updatedProject = await apiService.updateProject(project.id, project);
      setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
      setEditProjectDialogOpen(false);
      setSelectedProjectForEdit(null);
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  };

  const addTask = async (task) => {
    try {
      const newTask = {
        ...task,
        id: generateTaskId(),
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString()
      };
      
      const createdTask = await apiService.createTask(newTask);
      setTasks([...tasks, createdTask]);
      setAddTaskDialogOpen(false);
      
      // Log task assignment (for demo)
      if (task.assignedTo) {
        const assignee = teamMembers.find(m => m.id === task.assignedTo);
        const project = projects.find(p => p.id === task.projectId);
        
        if (assignee && project) {
          console.log('📧 Task assigned notification would be sent:', {
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
  };

  const updateTaskWithForm = async (task) => {
    try {
      const updatedTask = await apiService.updateTask(task.id, task);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      setEditTaskDialogOpen(false);
      setSelectedTaskForEdit(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const oldTask = tasks.find(t => t.id === taskId);
      const updatedTask = await apiService.updateTask(taskId, updates);
      
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));

      // Log task completion (for demo)
      if (updates.status === 'completed' && oldTask.status !== 'completed') {
        const assignee = teamMembers.find(m => m.id === updatedTask.assignedTo);
        const project = projects.find(p => p.id === updatedTask.projectId);
        
        if (assignee && project) {
          console.log('📧 Task completion notification would be sent:', {
            taskName: updatedTask.name,
            assigneeName: assignee.fullName,
            projectName: project.name,
            completedAt: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleViewTask = (task) => {
    setSelectedTaskForView(task);
    setViewTaskDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTaskForEdit(task);
    setEditTaskDialogOpen(true);
  };

  const handleCloseEditTaskDialog = () => {
    setEditTaskDialogOpen(false);
    setSelectedTaskForEdit(null);
  };

  const handleCloseViewTaskDialog = () => {
    setViewTaskDialogOpen(false);
    setSelectedTaskForView(null);
  };

  const deleteProject = async (projectId) => {
    try {
      await apiService.deleteProject(projectId);
      setProjects(projects.filter(project => project.id !== projectId));
      setTasks(tasks.filter(task => task.projectId !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  // Client functions
  const addClient = async (client) => {
    try {
      const newClient = {
        ...client,
        id: Date.now(), // Simple ID generation
        createdAt: new Date().toISOString()
      };
      
      const createdClient = await apiService.createClient(newClient);
      setClients([...clients, createdClient]);
      setAddClientDialogOpen(false);
    } catch (error) {
      console.error('Error creating client:', error);
      setError('Failed to create client');
    }
  };

  const handleAddClient = () => {
    setAddClientDialogOpen(true);
  };

  const updateClient = async (clientId, updates) => {
    try {
      const updatedClient = await apiService.updateClient(clientId, updates);
      setClients(clients.map(client => 
        client.id === clientId ? updatedClient : client
      ));
    } catch (error) {
      console.error('Error updating client:', error);
      setError('Failed to update client');
    }
  };

  const deleteClient = async (clientId) => {
    try {
      await apiService.deleteClient(clientId);
      setClients(clients.filter(client => client.id !== clientId));
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Failed to delete client');
    }
  };

  // Team Members functions
  const addTeamMember = async (member) => {
    try {
      const newMember = {
        ...member,
        id: generateMemberId()
      };
      
      const createdMember = await apiService.createTeamMember(newMember);
      setTeamMembers([...teamMembers, createdMember]);
      setAddTeamMemberDialogOpen(false);
    } catch (error) {
      console.error('Error creating team member:', error);
      setError('Failed to create team member');
    }
  };

  const handleAddTeamMember = () => {
    setAddTeamMemberDialogOpen(true);
  };

  const handleAddTask = () => {
    setAddTaskDialogOpen(true);
  };

  const handleViewTeamMemberDetail = (member) => {
    setSelectedMemberForDetail(member);
    setTeamMemberDetailOpen(true);
  };

  const handleCloseTeamMemberDetail = () => {
    setTeamMemberDetailOpen(false);
    setSelectedMemberForDetail(null);
  };

  // Global search functionality
  const handleGlobalSearchChange = (value) => {
    setGlobalSearch(value);
    if (value.trim().length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = () => {
    if (globalSearch.trim().length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchResultSelect = (type, item) => {
    setShowSearchResults(false);
    setGlobalSearch('');
    
    switch (type) {
      case 'project':
        setCurrentTab(1); // Switch to Projects tab
        // You could add additional logic here to highlight the selected project
        break;
      case 'task':
        setCurrentTab(3); // Switch to Tasks tab
        break;
      case 'teamMember':
        setCurrentTab(4); // Switch to Team tab
        setSelectedMemberForDetail(item);
        setTeamMemberDetailOpen(true);
        break;
    }
  };

  const getSearchResults = () => {
    if (!globalSearch.trim()) {
      return { projects: [], tasks: [], teamMembers: [] };
    }

    const searchTerm = globalSearch.toLowerCase();
    
    const filteredProjects = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm) ||
      project.type.toLowerCase().includes(searchTerm) ||
      project.status.toLowerCase().includes(searchTerm)
    );

    const filteredTasks = tasks.filter(task =>
      task.name.toLowerCase().includes(searchTerm) ||
      task.description?.toLowerCase().includes(searchTerm) ||
      task.status.toLowerCase().includes(searchTerm) ||
      task.priority.toLowerCase().includes(searchTerm)
    );

    const filteredTeamMembers = teamMembers.filter(member =>
      member.fullName.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm) ||
      member.role.toLowerCase().includes(searchTerm) ||
      member.department.toLowerCase().includes(searchTerm)
    );

    return {
      projects: filteredProjects,
      tasks: filteredTasks,
      teamMembers: filteredTeamMembers
    };
  };

  const updateTeamMember = async (memberId, updates) => {
    try {
      const updatedMember = await apiService.updateTeamMember(memberId, updates);
      setTeamMembers(teamMembers.map(member => 
        member.id === memberId ? updatedMember : member
      ));
    } catch (error) {
      console.error('Error updating team member:', error);
      setError('Failed to update team member');
    }
  };

  const deleteTeamMember = async (memberId) => {
    try {
      await apiService.deleteTeamMember(memberId);
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      
      // Also update tasks that were assigned to this member
      const updatedTasks = tasks.map(task => 
        task.assignedTo === memberId ? { ...task, assignedTo: null } : task
      );
      setTasks(updatedTasks);
      
      // Update tasks in the backend too
      for (const task of updatedTasks) {
        if (task.assignedTo === null && tasks.find(t => t.id === task.id).assignedTo === memberId) {
          await apiService.updateTask(task.id, { assignedTo: null });
        }
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      setError('Failed to delete team member');
    }
  };

  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
  };

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

  const handleManageScope = (project) => {
    setSelectedProjectForScope(project);
    setScopeDialogOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProjectForEdit(project);
    setEditProjectDialogOpen(true);
  };

  const handleViewProject = (project) => {
    setSelectedProjectForView(project);
    setViewProjectDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditProjectDialogOpen(false);
    setSelectedProjectForEdit(null);
  };

  const handleCloseViewDialog = () => {
    setViewProjectDialogOpen(false);
    setSelectedProjectForView(null);
  };

  const handleCloseScopeDialog = () => {
    setScopeDialogOpen(false);
    setSelectedProjectForScope(null);
  };

  // Use custom filtering hook for better performance
  const filteredProjects = useFilteredData(projects, projectsFilters, projectsSearchTerm);
  const activeFilters = useActiveFilters(projectsFilters, projectsSearchTerm, clients, teamMembers);

  if (loading) {
    return (
      <NotificationProvider>
        <ThemeProvider theme={formulaTheme}>
          <CssBaseline />
          <ModernDashboardLayout 
            currentTab={currentTab} 
            onTabChange={handleTabChange}
            globalSearch={globalSearch}
            onGlobalSearchChange={handleGlobalSearchChange}
            onSearchSubmit={handleSearchSubmit}
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
      </NotificationProvider>
    );
  }


  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Dashboard
        return (
          <>
            <ModernStatsCards projects={projects} tasks={tasks} teamMembers={teamMembers} />
            <ModernProjectOverview projects={projects} tasks={tasks} teamMembers={teamMembers} />
          </>
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
              onAdd={() => setCreateProjectDialogOpen(true)}
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

            <ProjectsFilters
              open={showProjectsFilters}
              filters={projectsFilters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              clients={clients}
              teamMembers={teamMembers}
              projects={projects}
            />
            
            {/* Conditional View Rendering */}
            {projectsViewMode === 'board' && (
              <BoardView
                tasks={tasks}
                onTaskUpdate={updateTask}
                teamMembers={teamMembers}
                projects={projects}
              />
            )}

            {projectsViewMode === 'table' && (
              <ProjectsTableView
                projects={filteredProjects}
                clients={clients}
                teamMembers={teamMembers}
                onEditProject={handleEditProject}
                onDeleteProject={deleteProject}
                onViewProject={handleViewProject}
                onManageScope={handleManageScope}
              />
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
                <ProjectsList 
                  projects={filteredProjects}
                  tasks={tasks}
                  clients={clients}
                  onDeleteProject={deleteProject}
                  onManageScope={handleManageScope}
                />
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
                <GanttChart 
                  tasks={tasks}
                  projects={projects}
                  teamMembers={teamMembers}
                />
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
          <MyProjectsList 
            projects={projects}
            tasks={tasks}
            clients={clients}
            teamMembers={teamMembers}
            onDeleteProject={deleteProject}
            onEditProject={handleEditProject}
            onViewProject={handleViewProject}
            onManageScope={handleManageScope}
            currentUserId={1008} // This would come from authentication in a real app
          />
        );

      case 3: // Tasks
        return (
          <Box>
            <UnifiedHeader
              title="Tasks"
              searchValue=""
              onSearchChange={() => {}}
              showFilters={false}
              onToggleFilters={() => {}}
              activeFiltersCount={0}
              viewMode={tasksViewMode}
              onViewModeChange={handleTasksViewModeChange}
              onExport={() => {}}
              onAdd={handleAddTask}
              addButtonText="New Task"
              activeFilters={[]}
              onClearFilter={() => {}}
            />

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
                    Tasks Overview ({tasks.length})
                  </Typography>
                  <TasksList 
                    tasks={tasks}
                    projects={projects}
                    teamMembers={teamMembers}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                    onAddTask={handleAddTask}
                    onViewTask={handleViewTask}
                    onEditTask={handleEditTask}
                    viewMode={tasksViewMode}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      case 4: // Team
        return teamMemberDetailOpen ? (
          <TeamMemberDetail
            member={selectedMemberForDetail}
            tasks={tasks}
            projects={projects}
            teamMembers={teamMembers}
            onClose={handleCloseTeamMemberDetail}
          />
        ) : (
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
        );

      case 5: // Clients
        return (
          <ClientsList 
            clients={clients}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
            onAddClient={handleAddClient}
            viewMode={clientsViewMode}
            onViewModeChange={handleClientsViewModeChange}
          />
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
            <GanttChart 
              tasks={tasks}
              projects={projects}
              teamMembers={teamMembers}
            />
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <NotificationProvider>
      <ThemeProvider theme={formulaTheme}>
        <CssBaseline />
        <ModernDashboardLayout 
          currentTab={currentTab} 
          onTabChange={handleTabChange}
          globalSearch={globalSearch}
          onGlobalSearchChange={handleGlobalSearchChange}
          onSearchSubmit={handleSearchSubmit}
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
            {renderTabContent()}
          </div>

          {/* Notification Container */}
          <NotificationContainer />
        </ModernDashboardLayout>

        {/* Create Project Dialog */}
        <Dialog 
          open={createProjectDialogOpen} 
          onClose={() => setCreateProjectDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create New Project</DialogTitle>
          <DialogContent>
            <ProjectForm onSubmit={addProject} clients={clients} />
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog 
          open={editProjectDialogOpen} 
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Project</DialogTitle>
          <DialogContent>
            {selectedProjectForEdit && (
              <ProjectForm 
                onSubmit={updateProject} 
                clients={clients} 
                initialProject={selectedProjectForEdit}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Project Dialog */}
        <Dialog 
          open={viewProjectDialogOpen} 
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Project Details</DialogTitle>
          <DialogContent>
            {selectedProjectForView && (
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedProjectForView.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedProjectForView.description || 'No description provided'}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Type:</strong> {selectedProjectForView.type}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Status:</strong> {selectedProjectForView.status}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Start Date:</strong> {new Date(selectedProjectForView.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>End Date:</strong> {new Date(selectedProjectForView.endDate).toLocaleDateString()}
                </Typography>
                {selectedProjectForView.clientId && (
                  <Typography variant="body2" paragraph>
                    <strong>Client:</strong> {clients.find(c => c.id === selectedProjectForView.clientId)?.companyName || 'Unknown'}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Project Scope Dialog */}
        <Dialog 
          open={scopeDialogOpen} 
          onClose={handleCloseScopeDialog}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { height: '90vh' }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            {selectedProjectForScope && (
              <EnhancedProjectScope 
                project={selectedProjectForScope} 
                onClose={handleCloseScopeDialog}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Add Team Member Dialog */}
        <Dialog 
          open={addTeamMemberDialogOpen} 
          onClose={() => setAddTeamMemberDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogContent>
            <TeamMemberForm 
              teamMembers={teamMembers}
              onSubmit={addTeamMember} 
            />
          </DialogContent>
        </Dialog>

        {/* Add Client Dialog */}
        <Dialog 
          open={addClientDialogOpen} 
          onClose={() => setAddClientDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Client</DialogTitle>
          <DialogContent>
            <ClientForm onSubmit={addClient} />
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog 
          open={editTaskDialogOpen} 
          onClose={handleCloseEditTaskDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            {selectedTaskForEdit && (
              <TaskForm 
                projects={projects}
                teamMembers={teamMembers}
                onSubmit={updateTaskWithForm}
                initialTask={selectedTaskForEdit}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Add Task Dialog */}
        <Dialog 
          open={addTaskDialogOpen} 
          onClose={() => setAddTaskDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <TaskForm 
              projects={projects}
              teamMembers={teamMembers}
              onSubmit={addTask}
              onCancel={() => setAddTaskDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* View Task Dialog */}
        <Dialog 
          open={viewTaskDialogOpen} 
          onClose={handleCloseViewTaskDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            {selectedTaskForView && (
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedTaskForView.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedTaskForView.description || 'No description provided'}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Project:</strong> {projects.find(p => p.id === selectedTaskForView.projectId)?.name || 'Unknown'}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Assigned To:</strong> {teamMembers.find(tm => tm.id === selectedTaskForView.assignedTo)?.fullName || 'Unassigned'}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Priority:</strong> {selectedTaskForView.priority}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Status:</strong> {selectedTaskForView.status}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Due Date:</strong> {new Date(selectedTaskForView.dueDate).toLocaleDateString()}
                </Typography>
                {selectedTaskForView.progress !== undefined && (
                  <Typography variant="body2" paragraph>
                    <strong>Progress:</strong> {selectedTaskForView.progress}%
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Global Search Results */}
        <GlobalSearchResults
          open={showSearchResults}
          searchTerm={globalSearch}
          onSearchChange={handleGlobalSearchChange}
          onClose={() => setShowSearchResults(false)}
          onSelectResult={handleSearchResultSelect}
          results={getSearchResults()}
        />
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;