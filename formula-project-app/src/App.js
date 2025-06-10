import React, { useState, useEffect } from 'react';
import { generateProjectId, generateTaskId, generateMemberId } from './utils/idGenerator';
import apiService from './services/apiService';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Grid,
  Paper,
  Box,
  Tabs,
  Tab,
  Typography
} from '@mui/material';
import { NotificationProvider } from './context';
import { NotificationContainer } from './components';
import DashboardLayout from './components/DashboardLayout';
import ProjectForm from './components/ProjectForm';
import TaskForm from './components/TaskForm';
import ProjectsList from './components/ProjectsList';
import TasksList from './components/TasksList';
import StatsCards from './components/StatsCards';
import GanttChart from './components/GanttChart';
import TeamMemberForm from './components/TeamMemberForm';
import TeamMembersList from './components/TeamMembersList';
import AdvancedDashboard from './components/AdvancedDashboard';
import './App.css';

// Custom Formula International Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#37444B',
      light: '#5a6b73',
      dark: '#1f2e35',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#C0B19E',
      light: '#d4c7b5',
      dark: '#a5967e',
      contrastText: '#37444B'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        }
      }
    }
  }
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from API on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [teamMembersData, projectsData, tasksData] = await Promise.all([
        apiService.getTeamMembers(),
        apiService.getProjects(),
        apiService.getTasks()
      ]);
      
      setTeamMembers(teamMembersData);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data from server. Please check if the backend is running.');
      
      // Fallback to localStorage if API fails
      const savedProjects = localStorage.getItem('formula_projects');
      const savedTasks = localStorage.getItem('formula_tasks');
      const savedTeamMembers = localStorage.getItem('formula_team_members');
      
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedTeamMembers) setTeamMembers(JSON.parse(savedTeamMembers));
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project) => {
    try {
      const newProject = {
        ...project,
        id: generateProjectId(),
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      const createdProject = await apiService.createProject(newProject);
      setProjects([...projects, createdProject]);
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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DashboardLayout>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <div style={{ textAlign: 'center' }}>
                <Typography variant="h6">Loading Formula Project Management...</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Fetching team members and project data
                </Typography>
              </div>
            </Box>
          </DashboardLayout>
        </ThemeProvider>
      </NotificationProvider>
    );
  }

  return (
    <NotificationProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DashboardLayout>
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
            
            {/* Statistics Cards */}
            <StatsCards projects={projects} tasks={tasks} teamMembers={teamMembers} />

            {/* Navigation Tabs */}
            <Paper sx={{ mb: 3, mt: 3 }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="📊 Dashboard" />
                <Tab label="📈 Analytics" />
                <Tab label="👥 Team Management" />
                <Tab label="📋 Projects & Tasks" />
                <Tab label="🕐 Timeline" />
              </Tabs>
            </Paper>

            {/* Tab Panels */}
            <TabPanel value={currentTab} index={0}>
              {/* Dashboard */}
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>Create New Project</h3>
                    <ProjectForm onSubmit={addProject} />
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>Add New Task</h3>
                    <TaskForm 
                      projects={projects} 
                      teamMembers={teamMembers}
                      onSubmit={addTask} 
                    />
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              {/* Analytics Dashboard */}
              <AdvancedDashboard 
                projects={projects}
                tasks={tasks}
                teamMembers={teamMembers}
              />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              {/* Team Management */}
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3 }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>Add Team Member</h3>
                    <TeamMemberForm 
                      teamMembers={teamMembers}
                      onSubmit={addTeamMember} 
                    />
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 3 }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>Team Members ({teamMembers.length})</h3>
                    <TeamMembersList 
                      teamMembers={teamMembers}
                      tasks={tasks}
                      onUpdateMember={updateTeamMember}
                      onDeleteMember={deleteTeamMember}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              {/* Projects & Tasks */}
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>Active Projects ({projects.length})</h3>
                    <ProjectsList 
                      projects={projects}
                      tasks={tasks}
                      onDeleteProject={deleteProject}
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>Tasks Overview ({tasks.length})</h3>
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
            </TabPanel>

            <TabPanel value={currentTab} index={4}>
              {/* Timeline */}
              <Paper sx={{ p: 3 }}>
                <h3 style={{ margin: '0 0 20px 0' }}>Project Timeline & Gantt Chart</h3>
                <GanttChart 
                  tasks={tasks}
                  projects={projects}
                  teamMembers={teamMembers}
                />
              </Paper>
            </TabPanel>
          </div>

          {/* Notification Container */}
          <NotificationContainer />
        </DashboardLayout>
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;