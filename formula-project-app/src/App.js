import React, { useState, useEffect } from 'react';
import { generateProjectId, generateTaskId, generateMemberId } from './utils/idGenerator';
import apiService from './services/apiService';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { NotificationProvider } from './context';
import { NotificationContainer } from './components';
import ModernDashboardLayout from './components/ModernDashboardLayout';
import ModernStatsCards from './components/ModernStatsCards';
import ModernProjectOverview from './components/ModernProjectOverview';
import ProjectForm from './components/ProjectForm';
import TaskForm from './components/TaskForm';
import ProjectsList from './components/ProjectsList';
import TasksList from './components/TasksList';
import GanttChart from './components/GanttChart';
import TeamMemberForm from './components/TeamMemberForm';
import TeamMembersList from './components/TeamMembersList';
import ClientForm from './components/ClientForm';
import ClientsList from './components/ClientsList';
import UnifiedHeader from './components/UnifiedHeader';
import ProjectsTableView from './components/ProjectsTableView';
import ProjectsFilters from './components/ProjectsFilters';
import MyProjectsList from './components/MyProjectsList';
import EnhancedProjectScope from './components/EnhancedProjectScope';
import AdvancedDashboard from './components/AdvancedDashboard';
import { exportProjectsToExcel } from './utils/excelExport';

// Import the new modular theme
import { formulaTheme } from './theme';
import './App.css';
import './styles/globals.css';
import './styles/modern-dashboard.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [viewProjectDialogOpen, setViewProjectDialogOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState(null);
  const [selectedProjectForView, setSelectedProjectForView] = useState(null);
  const [scopeDialogOpen, setScopeDialogOpen] = useState(false);
  const [selectedProjectForScope, setSelectedProjectForScope] = useState(null);
  const [addTeamMemberDialogOpen, setAddTeamMemberDialogOpen] = useState(false);
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [viewTaskDialogOpen, setViewTaskDialogOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);
  const [selectedTaskForView, setSelectedTaskForView] = useState(null);
  
  // New state for enhanced projects view
  const [projectsViewMode, setProjectsViewMode] = useState('table');
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

  // Load data from API on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [teamMembersData, projectsData, tasksData, clientsData] = await Promise.all([
        apiService.getTeamMembers(),
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getClients()
      ]);
      
      setTeamMembers(teamMembersData);
      setProjects(projectsData);
      setTasks(tasksData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data from server. Please check if the backend is running.');
      
      // Fallback to localStorage if API fails
      const savedProjects = localStorage.getItem('formula_projects');
      const savedTasks = localStorage.getItem('formula_tasks');
      const savedTeamMembers = localStorage.getItem('formula_team_members');
      const savedClients = localStorage.getItem('formula_clients');
      
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedTeamMembers) setTeamMembers(JSON.parse(savedTeamMembers));
      if (savedClients) setClients(JSON.parse(savedClients));
    } finally {
      setLoading(false);
    }
  };

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

  // Advanced filter logic
  const filteredProjects = projects.filter(project => {
    // Search term matching
    const matchesSearch = !projectsSearchTerm || 
      project.name.toLowerCase().includes(projectsSearchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(projectsSearchTerm.toLowerCase()));
    
    // Basic filters
    const matchesStatus = !projectsFilters.status || project.status === projectsFilters.status;
    const matchesType = !projectsFilters.type || project.type === projectsFilters.type;
    const matchesClient = !projectsFilters.client || project.clientId == projectsFilters.client;
    const matchesManager = !projectsFilters.manager || project.projectManager == projectsFilters.manager;

    // Date range filters
    const projectStartDate = project.startDate ? new Date(project.startDate) : null;
    const projectEndDate = project.endDate ? new Date(project.endDate) : null;
    
    const matchesStartDateFrom = !projectsFilters.startDateFrom || 
      (projectStartDate && projectStartDate >= projectsFilters.startDateFrom);
    const matchesStartDateTo = !projectsFilters.startDateTo || 
      (projectStartDate && projectStartDate <= projectsFilters.startDateTo);
    const matchesEndDateFrom = !projectsFilters.endDateFrom || 
      (projectEndDate && projectEndDate >= projectsFilters.endDateFrom);
    const matchesEndDateTo = !projectsFilters.endDateTo || 
      (projectEndDate && projectEndDate <= projectsFilters.endDateTo);

    // Budget range filters
    const projectBudget = project.budget ? parseFloat(project.budget) : 0;
    const matchesBudgetFrom = !projectsFilters.budgetFrom || 
      projectBudget >= parseFloat(projectsFilters.budgetFrom);
    const matchesBudgetTo = !projectsFilters.budgetTo || 
      projectBudget <= parseFloat(projectsFilters.budgetTo);

    return matchesSearch && 
           matchesStatus && 
           matchesType && 
           matchesClient && 
           matchesManager &&
           matchesStartDateFrom &&
           matchesStartDateTo &&
           matchesEndDateFrom &&
           matchesEndDateTo &&
           matchesBudgetFrom &&
           matchesBudgetTo;
  });

  // Get active filters for display
  const activeFilters = Object.entries(projectsFilters)
    .filter(([key, value]) => {
      if (typeof value === 'string') return value !== '';
      if (value instanceof Date) return true;
      return value !== null && value !== undefined;
    })
    .map(([key, value]) => {
      let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      let displayValue = value;
      
      if (key === 'client') {
        const client = clients.find(c => c.id == value);
        displayValue = client ? client.companyName : value;
      } else if (key === 'manager') {
        const manager = teamMembers.find(tm => tm.id == value);
        displayValue = manager ? manager.fullName : value;
      } else if (key.includes('Date') && value instanceof Date) {
        displayValue = value.toLocaleDateString();
      } else if (key.includes('budget') && value) {
        displayValue = `$${value}`;
      }
      
      return { key, label, value: displayValue };
    });

  if (projectsSearchTerm) {
    activeFilters.push({ key: 'search', label: 'Search', value: projectsSearchTerm });
  }

  if (loading) {
    return (
      <NotificationProvider>
        <ThemeProvider theme={formulaTheme}>
          <CssBaseline />
          <ModernDashboardLayout currentTab={currentTab} onTabChange={handleTabChange}>
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
            <UnifiedHeader
              title="Projects"
              searchValue={projectsSearchTerm}
              onSearchChange={setProjectsSearchTerm}
              showFilters={showProjectsFilters}
              onToggleFilters={handleToggleProjectsFilters}
              activeFiltersCount={activeFilters.length}
              viewMode={projectsViewMode}
              onViewModeChange={handleViewModeChange}
              onExport={handleProjectsExport}
              onAdd={() => setCreateProjectDialogOpen(true)}
              addButtonText="New Project"
              exportButtonText="Export"
              activeFilters={activeFilters}
              onClearFilter={handleClearFilter}
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
            
            {projectsViewMode === 'table' ? (
              <ProjectsTableView
                projects={filteredProjects}
                clients={clients}
                teamMembers={teamMembers}
                onEditProject={handleEditProject}
                onDeleteProject={deleteProject}
                onViewProject={handleViewProject}
                onManageScope={handleManageScope}
              />
            ) : (
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
                />
              </Paper>
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
                  onAddTask={() => {/* Handle add task - will show form */}}
                  onViewTask={handleViewTask}
                  onEditTask={handleEditTask}
                />
              </Paper>
            </Grid>
          </Grid>
        );

      case 4: // Team
        return (
          <TeamMembersList 
            teamMembers={teamMembers}
            tasks={tasks}
            onUpdateMember={updateTeamMember}
            onDeleteMember={deleteTeamMember}
            onAddMember={handleAddTeamMember}
          />
        );

      case 5: // Clients
        return (
          <ClientsList 
            clients={clients}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
            onAddClient={handleAddClient}
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
        <ModernDashboardLayout currentTab={currentTab} onTabChange={handleTabChange}>
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
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;