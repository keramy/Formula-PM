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
import { useProjectRealtime } from '../../../hooks/useSocket';
import PresenceIndicators from '../../../components/realtime/PresenceIndicators';
import RealtimeActivityFeed from '../../../components/realtime/RealtimeActivityFeed';
import EnhancedGlobalSearch from '../../../components/search/EnhancedGlobalSearch';
import apiService from '../../../services/api/apiService';

const EnhancedProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [projectTeam, setProjectTeam] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notification, setNotification] = useState(null);

  // Real-time project updates
  const { projectData, loading: realtimeLoading, isConnected } = useProjectRealtime(projectId);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        
        // Load project details
        const projectResponse = await apiService.request(`/projects/${projectId}`);
        const projectData = projectResponse.data || projectResponse;
        setProject(projectData);

        // Load project team
        const teamResponse = await apiService.request(`/projects/${projectId}/team`);
        const teamData = teamResponse.data || teamResponse;
        setProjectTeam(teamData);

        // Load project analytics
        try {
          const analyticsData = await apiService.getProjectAnalytics(projectId);
          setAnalytics(analyticsData);
        } catch (analyticsError) {
          console.warn('Analytics not available:', analyticsError);
        }

      } catch (err) {
        console.error('Failed to load project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  // Update project when real-time data changes
  useEffect(() => {
    if (projectData) {
      setProject(prev => ({ ...prev, ...projectData }));
      setNotification({
        message: 'Project updated in real-time',
        severity: 'info'
      });
    }
  }, [projectData]);

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
            {/* Real-time connection indicator */}
            <Chip
              label={isConnected ? 'Live' : 'Offline'}
              color={isConnected ? 'success' : 'default'}
              size="small"
              variant="outlined"
            />
            
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

          <PresenceIndicators 
            projectId={projectId}
            location="project_detail"
            showDetails={false}
            maxVisible={5}
          />
        </Box>
      </Box>

      {/* Enhanced Search */}
      <Box mb={3}>
        <EnhancedGlobalSearch
          placeholder={`Search in ${project.name}...`}
          width={400}
          onResultClick={(result) => {
            console.log('Search result clicked:', result);
          }}
        />
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          {/* Project Tabs */}
          <Card>
            <Box sx={{ borderBottom: 1, borderPalette: 'divider' }}>
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
                    Project Tasks
                  </Typography>
                  <Typography color="textSecondary">
                    Task management integration coming soon...
                  </Typography>
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Project Files
                  </Typography>
                  <Typography color="textSecondary">
                    File management integration coming soon...
                  </Typography>
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Team Management
                  </Typography>
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
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
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
                  <Typography color="textSecondary">
                    Timeline view integration coming soon...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          {/* Real-time Activity Feed */}
          <RealtimeActivityFeed
            projectId={projectId}
            maxItems={20}
            showTimestamps={true}
            compact={false}
          />
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