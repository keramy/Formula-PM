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
import AdvancedDashboard from './components/AdvancedDashboard';

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
    } catch (error) {
      console.error('Error creating client:', error);
      setError('Failed to create client');
    }
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
    } catch (error) {
      console.error('Error creating team member:', error);
      setError('Failed to create team member');
    }
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                    Active Projects ({projects.length})
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setCreateProjectDialogOpen(true)}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3
                    }}
                  >
                    + Create
                  </Button>
                </Box>
                <ProjectsList 
                  projects={projects}
                  tasks={tasks}
                  clients={clients}
                  onDeleteProject={deleteProject}
                />
              </Paper>
            </Grid>
          </Grid>
        );

      case 2: // My Projects
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                    My Projects ({projects.filter(p => p.projectManager === 1008).length})
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setCreateProjectDialogOpen(true)}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3
                    }}
                  >
                    + Create
                  </Button>
                </Box>
                <ProjectsList 
                  projects={projects.filter(p => p.projectManager === 1008)}
                  tasks={tasks}
                  clients={clients}
                  onDeleteProject={deleteProject}
                />
              </Paper>
            </Grid>
          </Grid>
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
                />
              </Paper>
            </Grid>
          </Grid>
        );

      case 4: // Team
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
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
                  Add Team Member
                </Typography>
                <TeamMemberForm 
                  teamMembers={teamMembers}
                  onSubmit={addTeamMember} 
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
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
                  Team Members ({teamMembers.length})
                </Typography>
                <TeamMembersList 
                  teamMembers={teamMembers}
                  tasks={tasks}
                  onUpdateMember={updateTeamMember}
                  onDeleteMember={deleteTeamMember}
                />
              </Paper>
            </Grid>
          </Grid>
        );

      case 5: // Clients
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
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
                  Add New Client
                </Typography>
                <ClientForm onSubmit={addClient} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
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
                  Clients Database ({clients.length})
                </Typography>
                <ClientsList 
                  clients={clients}
                  onUpdateClient={updateClient}
                  onDeleteClient={deleteClient}
                />
              </Paper>
            </Grid>
          </Grid>
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
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;