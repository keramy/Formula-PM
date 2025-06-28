import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  IconButton,
  Badge
} from '@mui/material';
import {
  CheckCircle as AssignmentIcon,
  Calendar as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  User as PersonIcon,
  Folder as FolderIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon
} from 'iconoir-react';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import { useAuth } from '../context/AuthContext';

const MyWorkPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workData, setWorkData] = useState(null);
  const [timeTracking, setTimeTracking] = useState({ isTracking: false, currentTask: null, startTime: null });
  const { user } = useAuth();

  // Load user's work data on component mount
  useEffect(() => {
    loadMyWorkData();
  }, []);

  const loadMyWorkData = async () => {
    try {
      setLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock work data for the current user
      const mockWorkData = {
        overview: {
          totalTasks: 12,
          completedTasks: 8,
          overdueTasks: 2,
          todaysTasks: 4,
          thisWeekDeadlines: 6,
          activeProjects: 3
        },
        recentTasks: [
          {
            id: 'T001',
            title: 'Executive Kitchen Cabinet Review',
            project: 'Akbank Head Office Renovation',
            priority: 'high',
            status: 'in_progress',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            progress: 75,
            assignedBy: 'Project Manager',
            category: 'Quality Control'
          },
          {
            id: 'T002',
            title: 'Shop Drawing Approval - Reception Desk',
            project: 'Garanti BBVA Branch Fit-out',
            priority: 'medium',
            status: 'pending',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 30,
            assignedBy: 'Design Lead',
            category: 'Approval'
          },
          {
            id: 'T003',
            title: 'Material Specification Update',
            project: 'Yapı Kredi Head Office',
            priority: 'low',
            status: 'completed',
            dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            progress: 100,
            assignedBy: 'Technical Manager',
            category: 'Documentation'
          },
          {
            id: 'T004',
            title: 'Client Presentation Preparation',
            project: 'Akbank Head Office Renovation',
            priority: 'high',
            status: 'not_started',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 0,
            assignedBy: 'Account Manager',
            category: 'Presentation'
          }
        ],
        activeProjects: [
          {
            id: 'P001',
            name: 'Akbank Head Office Renovation',
            role: 'Lead Designer',
            progress: 68,
            tasksAssigned: 6,
            tasksCompleted: 4,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'on_track'
          },
          {
            id: 'P002',
            name: 'Garanti BBVA Branch Fit-out',
            role: 'Quality Inspector',
            progress: 45,
            tasksAssigned: 4,
            tasksCompleted: 2,
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'at_risk'
          },
          {
            id: 'P003',
            name: 'Yapı Kredi Head Office',
            role: 'Technical Consultant',
            progress: 90,
            tasksAssigned: 2,
            tasksCompleted: 2,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'ahead'
          }
        ],
        todaysSchedule: [
          {
            id: 'S001',
            time: '09:00',
            title: 'Project kickoff meeting',
            project: 'New Client Project',
            type: 'meeting',
            duration: 60
          },
          {
            id: 'S002',
            time: '11:30',
            title: 'Cabinet quality inspection',
            project: 'Akbank Head Office Renovation',
            type: 'task',
            duration: 120
          },
          {
            id: 'S003',
            time: '14:00',
            title: 'Design review session',
            project: 'Garanti BBVA Branch Fit-out',
            type: 'review',
            duration: 90
          }
        ],
        productivity: {
          tasksCompletedToday: 3,
          hoursWorkedToday: 6.5,
          averageTaskCompletionTime: 2.3,
          weeklyGoal: 15,
          weeklyProgress: 11
        }
      };

      setWorkData(mockWorkData);
      setError(null);
    } catch (err) {
      setError('Failed to load work data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTimeTracking = (task) => {
    setTimeTracking({
      isTracking: true,
      currentTask: task,
      startTime: new Date()
    });
  };

  const handleStopTimeTracking = () => {
    setTimeTracking({
      isTracking: false,
      currentTask: null,
      startTime: null
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'pending': return 'warning';
      case 'not_started': return 'default';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        variant="outlined"
        startIcon={<SettingsIcon />}
        size="small"
      >
        Preferences
      </Button>
      {timeTracking.isTracking ? (
        <Button
          variant="contained"
          startIcon={<PauseIcon />}
          onClick={handleStopTimeTracking}
          color="error"
        >
          Stop Tracking
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<PlayIcon />}
          disabled={!workData?.recentTasks?.length}
        >
          Start Work
        </Button>
      )}
    </Box>
  );

  const tabs = (
    <>
      <CleanTab 
        label="Overview" 
        isActive={activeTab === 'overview'}
        onClick={() => setActiveTab('overview')}
        icon={<AssignmentIcon sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="My Tasks" 
        isActive={activeTab === 'tasks'}
        onClick={() => setActiveTab('tasks')}
        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
        badge={workData?.overview?.totalTasks || 0}
      />
      <CleanTab 
        label="Projects" 
        isActive={activeTab === 'projects'}
        onClick={() => setActiveTab('projects')}
        icon={<FolderIcon sx={{ fontSize: 16 }} />}
        badge={workData?.overview?.activeProjects || 0}
      />
      <CleanTab 
        label="Schedule" 
        isActive={activeTab === 'schedule'}
        onClick={() => setActiveTab('schedule')}
        icon={<CalendarIcon sx={{ fontSize: 16 }} />}
        badge={workData?.todaysSchedule?.length || 0}
      />
      <CleanTab 
        label="Analytics" 
        isActive={activeTab === 'analytics'}
        onClick={() => setActiveTab('analytics')}
        icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
      />
    </>
  );

  const renderOverview = () => {
    if (!workData) return null;

    const { overview } = workData;

    return (
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    Welcome back, {user?.name || 'User'}!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Here's your personal workspace overview
                  </Typography>
                </Box>
              </Box>
              
              {timeTracking.isTracking && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <strong>Time Tracking Active:</strong> Working on "{timeTracking.currentTask?.title}" 
                  since {timeTracking.startTime?.toLocaleTimeString()}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">
                {overview.totalTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">
                {overview.completedTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main">
                {overview.todaysTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="error.main">
                {overview.overdueTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              <List>
                {workData.recentTasks.slice(0, 4).map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Badge
                          color={getPriorityColor(task.priority)}
                          variant="dot"
                        >
                          <AssignmentIcon />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {task.project} • {formatDate(task.dueDate)}
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={task.progress} 
                              sx={{ mt: 1, maxWidth: 200 }}
                            />
                          </Box>
                        }
                      />
                      <Chip 
                        label={task.status.replace('_', ' ')} 
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleStartTimeTracking(task)}
                        disabled={timeTracking.isTracking}
                      >
                        <PlayIcon />
                      </IconButton>
                    </ListItem>
                    {index < workData.recentTasks.slice(0, 4).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Schedule
              </Typography>
              <List dense>
                {workData.todaysSchedule.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemIcon>
                      <ClockIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${item.time} - ${item.title}`}
                      secondary={`${item.project} (${item.duration}min)`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderTasksView = () => {
    if (!workData) return null;

    return (
      <Grid container spacing={2}>
        {workData.recentTasks.map((task) => (
          <Grid item xs={12} md={6} lg={4} key={task.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" noWrap>
                    {task.title}
                  </Typography>
                  <Chip 
                    label={task.priority} 
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {task.project}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Due: {formatDate(task.dueDate)}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{task.progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={task.progress} />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    label={task.status.replace('_', ' ')} 
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderProjectsView = () => {
    if (!workData) return null;

    return (
      <Grid container spacing={2}>
        {workData.activeProjects.map((project) => (
          <Grid item xs={12} md={6} key={project.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">
                    {project.name}
                  </Typography>
                  <Chip 
                    label={project.status.replace('_', ' ')} 
                    color={project.status === 'on_track' ? 'success' : project.status === 'at_risk' ? 'warning' : 'primary'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Role: {project.role}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tasks: {project.tasksCompleted}/{project.tasksAssigned} completed
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Deadline: {formatDate(project.deadline)}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Overall Progress</Typography>
                    <Typography variant="body2">{project.progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={project.progress} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderScheduleView = () => {
    if (!workData) return null;

    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Today's Schedule - {new Date().toLocaleDateString()}
        </Typography>
        <List>
          {workData.todaysSchedule.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemIcon>
                  <ClockIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${item.time} - ${item.title}`}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {item.project}
                      </Typography>
                      <Chip 
                        label={item.type} 
                        size="small" 
                        sx={{ mt: 0.5 }}
                      />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {item.duration} minutes
                      </Typography>
                    </Box>
                  }
                />
                <Button variant="outlined" size="small">
                  Join
                </Button>
              </ListItem>
              {index < workData.todaysSchedule.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    );
  };

  const renderAnalyticsView = () => {
    if (!workData) return null;

    const { productivity } = workData;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">
                {productivity.tasksCompletedToday}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks Completed Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">
                {productivity.hoursWorkedToday}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hours Worked Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main">
                {productivity.averageTaskCompletionTime}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Completion Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="info.main">
                {productivity.weeklyProgress}/{productivity.weeklyGoal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Weekly Goal Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Goal Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(productivity.weeklyProgress / productivity.weeklyGoal) * 100} 
                    sx={{ height: 10, borderRadius: 1 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round((productivity.weeklyProgress / productivity.weeklyGoal) * 100)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {productivity.weeklyGoal - productivity.weeklyProgress} tasks remaining to reach weekly goal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'tasks':
        return renderTasksView();
      case 'projects':
        return renderProjectsView();
      case 'schedule':
        return renderScheduleView();
      case 'analytics':
        return renderAnalyticsView();
      default:
        return renderOverview();
    }
  };

  return (
    <CleanPageLayout
      title="My Work"
      subtitle="Personal workspace with tasks, projects, and productivity insights"
      breadcrumbs={[
        { label: 'Team Space', href: '/workspace' },
        { label: 'My Work', href: '/my-work' }
      ]}
      headerActions={headerActions}
      tabs={tabs}
    >
      <Box className="clean-fade-in">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {loading ? (
          <LinearProgress sx={{ mb: 2 }} />
        ) : (
          renderTabContent()
        )}
      </Box>
    </CleanPageLayout>
  );
};

export default MyWorkPage;