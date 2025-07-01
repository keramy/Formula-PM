/**
 * Enhanced Project Detail Page
 * Integrates real-time features, presence indicators, and backend APIs
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  MdCheck as TaskIcon,
  MdDescription as FileIcon,
  MdGroup as TeamIcon,
  MdAnalytics as AnalyticsIcon,
  MdTimeline as TimelineIcon
} from 'react-icons/md';
// Real-time features temporarily disabled
// import { useProjectRealtime } from '../../../hooks/useSocket';
// import PresenceIndicators from '../../../components/realtime/PresenceIndicators';
// import RealtimeActivityFeed from '../../../components/realtime/RealtimeActivityFeed';
// import EnhancedGlobalSearch from '../../../components/search/EnhancedGlobalSearch';
import { useData } from '../../../context/DataContext';

const EnhancedProjectDetailPage = () => {
  const { projectId } = useParams();
  const { projects, tasks, teamMembers } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState(null);

  // Find project from loaded data
  const project = projects?.find(p => p.id === projectId);
  const projectTasks = tasks?.filter(t => t.projectId === projectId) || [];
  const projectTeam = teamMembers?.filter(m => 
    project?.teamMembers?.includes(m.id)
  ) || [];

  // Check if project exists
  useEffect(() => {
    if (projectId && projects?.length > 0) {
      if (!project) {
        setError('Project not found');
      }
    }
  }, [projectId, projects, project]);

  // Calculate project analytics
  const analytics = project ? {
    taskCount: projectTasks.length,
    completedTasks: projectTasks.filter(t => t.status === 'completed').length,
    pendingTasks: projectTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
    progressPercentage: projectTasks.length > 0 ? 
      (projectTasks.filter(t => t.status === 'completed').length / projectTasks.length) * 100 : 0
  } : null;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusPalette = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'on_hold': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityPalette = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box p={3}>
        <Typography>Loading project details...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box p={3}>
        <Alert severity="warning">Project not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      {/* Project Header */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {project.name}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Chip
                label={project.status}
                color={getStatusPalette(project.status)}
                variant="filled"
              />
              <Chip
                label={`${project.priority} Priority`}
                color={getPriorityPalette(project.priority)}
                variant="outlined"
              />
              {project.progress !== undefined && (
                <Chip
                  label={`${project.progress}% Complete`}
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>

            {project.description && (
              <Typography variant="body1" color="textSecondary" paragraph>
                {project.description}
              </Typography>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" color="primary">
              Edit Project
            </Button>
          </Box>
        </Box>

        {/* Project Team and Presence */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1" fontWeight="medium">
              Team Members:
            </Typography>
            <AvatarGroup max={6}>
              {projectTeam.map((member) => (
                <Avatar
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  sx={{ width: 32, height: 32 }}
                >
                  {member.name?.charAt(0)}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>

          {/* Real-time presence indicators disabled for now */}
        </Box>
      </Box>

      {/* Enhanced Search - Temporarily disabled */}
      {/* <Box mb={3}>
        <EnhancedGlobalSearch
          placeholder={`Search in ${project.name}...`}
          width={400}
          onResultClick={(result) => {
            console.log('Search result clicked:', result);
          }}
        />
      </Box> */}

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          {/* Project Tabs */}
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab 
                  icon={<TaskIcon />} 
                  label="Tasks" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<FileIcon />} 
                  label="Files" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<TeamIcon />} 
                  label="Team" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<AnalyticsIcon />} 
                  label="Analytics" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<TimelineIcon />} 
                  label="Timeline" 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            <CardContent>
              {/* Tab Content */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Project Tasks ({projectTasks.length})
                  </Typography>
                  {projectTasks.length > 0 ? (
                    <Box>
                      {projectTasks.map((task) => (
                        <Card key={task.id} variant="outlined" sx={{ mb: 2 }}>
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="start">
                              <Box>
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {task.title}
                                </Typography>
                                {task.description && (
                                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    {task.description}
                                  </Typography>
                                )}
                              </Box>
                              <Chip
                                label={task.status}
                                size="small"
                                color={
                                  task.status === 'completed' ? 'success' :
                                  task.status === 'in_progress' ? 'warning' : 'default'
                                }
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Box>
                            {task.assignee && (
                              <Box display="flex" alignItems="center" gap={1} sx={{ mt: 2 }}>
                                <Typography variant="caption" color="textSecondary">
                                  Assigned to:
                                </Typography>
                                <Typography variant="caption" fontWeight="medium">
                                  {task.assignee}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Typography color="textSecondary">
                      No tasks assigned to this project yet.
                    </Typography>
                  )}
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Project Files
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <FileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      File management integration coming soon
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Upload and manage project documents, drawings, and specifications
                    </Typography>
                  </Box>
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Team Management ({projectTeam.length})
                  </Typography>
                  {projectTeam.length > 0 ? (
                    <Grid container spacing={2}>
                      {projectTeam.map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar src={member.avatar} alt={member.name}>
                                  {member.name?.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography fontWeight="medium">
                                    {member.name}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {member.role}
                                  </Typography>
                                  {member.email && (
                                    <Typography variant="caption" color="textSecondary">
                                      {member.email}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <TeamIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        No team members assigned
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Add team members to collaborate on this project
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Project Analytics
                  </Typography>
                  {analytics ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h4" color="primary">
                              {analytics.taskCount || 0}
                            </Typography>
                            <Typography color="textSecondary">
                              Total Tasks
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h4" color="success.main">
                              {analytics.completedTasks || 0}
                            </Typography>
                            <Typography color="textSecondary">
                              Completed
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h4" color="warning.main">
                              {analytics.pendingTasks || 0}
                            </Typography>
                            <Typography color="textSecondary">
                              Pending
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h4" color="info.main">
                              {Math.round(analytics.progressPercentage || 0)}%
                            </Typography>
                            <Typography color="textSecondary">
                              Progress
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography color="textSecondary">
                      Analytics data not available
                    </Typography>
                  )}
                </Box>
              )}

              {activeTab === 4 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Project Timeline
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      Timeline view integration coming soon
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Visualize project milestones, deadlines, and progress over time
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          {/* Project Summary Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={project.status || 'Active'}
                  color={getStatusPalette(project.status)}
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Progress
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <LinearProgress
                    variant="determinate"
                    value={analytics?.progressPercentage || 0}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" fontWeight="medium">
                    {Math.round(analytics?.progressPercentage || 0)}%
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Team Size
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {projectTeam.length} members
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Tasks
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {analytics?.completedTasks || 0} of {analytics?.taskCount || 0} completed
                </Typography>
              </Box>

              {project.budget && (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Budget
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY'
                    }).format(project.budget)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
      >
        <Alert 
          severity={notification?.severity || 'info'}
          onClose={() => setNotification(null)}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnhancedProjectDetailPage;