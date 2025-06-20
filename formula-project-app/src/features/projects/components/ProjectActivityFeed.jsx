import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup,
  Chip,
  Stack,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import {
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  OpenInNew as OpenIcon
} from '@mui/icons-material';
import ActivityFeed, { CompactActivityFeed, DetailedActivityFeed } from '../../../components/realtime/ActivityFeed';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigation } from '../../../context/NavigationContext';
import { useProjectActivityFeed } from '../../../hooks/useRealTime';

const ProjectActivityFeed = ({ project, projectId, tasks = [], teamMembers = [] }) => {
  const { isDarkMode } = useTheme();
  const { navigateToProjectSection, exitProjectContext } = useNavigation();
  const [view, setView] = useState('detailed');
  const [filter, setFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Use project-specific activity feed
  const { activities, isLoading } = useProjectActivityFeed(projectId, 50);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Handle activity clicks for navigation
  const handleActivityClick = useCallback((activity) => {
    console.log('Activity clicked:', activity);
    
    switch (activity.type) {
      case 'project':
        // Navigate to project overview
        navigateToProjectSection('overview');
        break;
      case 'task':
        // Could navigate to a specific task view or show task details
        console.log('Navigate to task:', activity.metadata?.taskId);
        break;
      case 'scope':
        // Navigate to scope management
        navigateToProjectSection('scope');
        break;
      case 'shop_drawing':
        // Navigate to shop drawings
        navigateToProjectSection('drawings');
        break;
      case 'material_spec':
        // Navigate to material specifications
        navigateToProjectSection('specifications');
        break;
      case 'timeline':
        // Navigate to timeline
        navigateToProjectSection('timeline');
        break;
      case 'compliance':
        // Navigate to compliance
        navigateToProjectSection('compliance');
        break;
      default:
        console.log('Unknown activity type:', activity.type);
    }
  }, [navigateToProjectSection]);

  // Enhanced click handlers for specific elements within activities
  const handleProjectClick = useCallback((projectId, projectName) => {
    console.log('Project element clicked:', projectName);
    navigateToProjectSection('overview');
  }, [navigateToProjectSection]);

  const handleTaskClick = useCallback((projectId, taskId, taskName) => {
    console.log('Task element clicked:', taskName);
    navigateToProjectSection('overview');
    // TODO: Could add task highlighting or detail view
  }, [navigateToProjectSection]);

  const handleScopeClick = useCallback((projectId, scopeItemId, scopeItemName) => {
    console.log('Scope element clicked:', scopeItemName);
    navigateToProjectSection('scope');
    // TODO: Could add scope item highlighting
  }, [navigateToProjectSection]);

  const handleDrawingClick = useCallback((projectId, drawingId, drawingName) => {
    console.log('Drawing element clicked:', drawingName);
    navigateToProjectSection('drawings');
    // TODO: Could add drawing highlighting or detail view
  }, [navigateToProjectSection]);

  const handleSpecClick = useCallback((projectId, specId, specName) => {
    console.log('Specification element clicked:', specName);
    navigateToProjectSection('specifications');
    // TODO: Could add spec highlighting or detail view
  }, [navigateToProjectSection]);

  const activityFilters = [
    { value: 'all', label: 'All Activity', color: 'default' },
    { value: 'project', label: 'Project Updates', color: 'primary' },
    { value: 'task', label: 'Tasks', color: 'secondary' },
    { value: 'scope', label: 'Scope Changes', color: 'success' },
    { value: 'timeline', label: 'Timeline', color: 'info' },
    { value: 'approvals', label: 'Approvals', color: 'warning' },
  ];

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'approvals') {
      return activity.type === 'shop_drawing' || activity.type === 'material_spec';
    }
    return activity.type === filter;
  });

  if (!project) {
    return (
      <Alert severity="error">
        Project not found. Unable to load activity feed.
      </Alert>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: isDarkMode ? '#1B2951' : '#ffffff',
          borderRadius: 2,
          border: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}`
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: isDarkMode ? '#F5F2E8' : '#2C3E50',
              mb: 1
            }}>
              Project Activity Feed
            </Typography>
            <Typography variant="body2" sx={{ 
              color: isDarkMode ? '#A8B8D1' : '#7F8C8D' 
            }}>
              Track all updates, changes, and progress for "{project.name}"
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* View Toggle */}
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              size="small"
              sx={{
                backgroundColor: isDarkMode ? '#2C3966' : '#F8F9FA',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  px: 2,
                  '&.Mui-selected': {
                    backgroundColor: isDarkMode ? '#3A4B7D' : '#E9ECEF',
                    color: isDarkMode ? '#F5F2E8' : '#2C3E50'
                  }
                }
              }}
            >
              <ToggleButton value="compact" aria-label="compact view">
                <Tooltip title="Compact View">
                  <GridIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="detailed" aria-label="detailed view">
                <Tooltip title="Detailed View">
                  <ListIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Refresh Button */}
            <Tooltip title="Refresh Feed">
              <IconButton 
                onClick={handleRefresh}
                sx={{ 
                  backgroundColor: isDarkMode ? '#2C3966' : '#F8F9FA',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#3A4B7D' : '#E9ECEF'
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            {/* Global Feed Link */}
            <Tooltip title="View Global Activity Feed">
              <IconButton 
                onClick={() => exitProjectContext()}
                sx={{ 
                  backgroundColor: isDarkMode ? '#2C3966' : '#F8F9FA',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#3A4B7D' : '#E9ECEF'
                  }
                }}
              >
                <OpenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filter Chips */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {activityFilters.map((filterOption) => (
            <Chip
              key={filterOption.value}
              label={filterOption.label}
              onClick={() => setFilter(filterOption.value)}
              color={filter === filterOption.value ? filterOption.color : 'default'}
              variant={filter === filterOption.value ? 'filled' : 'outlined'}
              size="small"
              sx={{ 
                cursor: 'pointer',
                borderColor: isDarkMode ? '#566BA3' : '#D1D8E6'
              }}
            />
          ))}
        </Stack>

        {/* Project Stats */}
        <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: isDarkMode ? '#A8B8D1' : '#7F8C8D' }}>
            Total Activities: {filteredActivities.length}
          </Typography>
          <Typography variant="body2" sx={{ color: isDarkMode ? '#A8B8D1' : '#7F8C8D' }}>
            Project Tasks: {tasks.length}
          </Typography>
          <Typography variant="body2" sx={{ color: isDarkMode ? '#A8B8D1' : '#7F8C8D' }}>
            Team Members: {teamMembers.length}
          </Typography>
        </Box>
      </Paper>

      {/* Activity Feed Content */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {view === 'compact' ? (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 3,
            height: '100%'
          }}>
            {/* Recent Activity */}
            <Card sx={{ 
              height: '100%',
              backgroundColor: isDarkMode ? '#1B2951' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}`
            }}>
              <CardContent sx={{ height: '100%', p: 0 }}>
                <Box sx={{ p: 2, borderBottom: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}` }}>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Recent Activity
                  </Typography>
                </Box>
                <Box sx={{ height: 'calc(100% - 60px)' }}>
                  <CompactActivityFeed 
                    key={`compact-recent-${refreshKey}`} 
                    limit={15} 
                    maxHeight={500}
                    activities={filteredActivities}
                    onActivityClick={handleActivityClick}
                    onProjectClick={handleProjectClick}
                    onTaskClick={handleTaskClick}
                    onScopeClick={handleScopeClick}
                    onDrawingClick={handleDrawingClick}
                    onSpecClick={handleSpecClick}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Today's Activity */}
            <Card sx={{ 
              height: '100%',
              backgroundColor: isDarkMode ? '#1B2951' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}`
            }}>
              <CardContent sx={{ height: '100%', p: 0 }}>
                <Box sx={{ p: 2, borderBottom: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}` }}>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Today's Updates
                  </Typography>
                </Box>
                <Box sx={{ height: 'calc(100% - 60px)' }}>
                  <CompactActivityFeed 
                    key={`compact-today-${refreshKey}`} 
                    limit={10} 
                    maxHeight={500}
                    activities={filteredActivities.filter(activity => {
                      const today = new Date().toDateString();
                      const activityDate = new Date(activity.timestamp).toDateString();
                      return today === activityDate;
                    })}
                    onActivityClick={handleActivityClick}
                    onProjectClick={handleProjectClick}
                    onTaskClick={handleTaskClick}
                    onScopeClick={handleScopeClick}
                    onDrawingClick={handleDrawingClick}
                    onSpecClick={handleSpecClick}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              backgroundColor: isDarkMode ? '#1B2951' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}`,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <DetailedActivityFeed 
              key={`detailed-${refreshKey}`} 
              limit={100}
              activities={filteredActivities}
              onActivityClick={handleActivityClick}
              onProjectClick={handleProjectClick}
              onTaskClick={handleTaskClick}
              onScopeClick={handleScopeClick}
              onDrawingClick={handleDrawingClick}
              onSpecClick={handleSpecClick}
              title={`Activity Log - ${project.name}`}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ProjectActivityFeed;