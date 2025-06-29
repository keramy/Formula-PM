import React, { useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  Xmark as ClearIcon,
  Filter as FilterIcon,
  Refresh as RefreshIcon
} from 'iconoir-react';
import ActivityFeed, { CompactActivityFeed, DetailedActivityFeed } from '../../../components/realtime/ActivityFeed';
import { useTheme } from '../../../context/ThemeContext';
import { useActivityFeed } from '../../../hooks/useRealTime';
import logger from '../../../utils/logger';

const FeedTab = ({ onTabChange, projects = [], onNavigateToProject }) => {
  const { isDarkMode } = useTheme();
  const [view, setView] = useState('detailed');
  const [filter, setFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get activities from the hook
  const { activities, isLoading } = useActivityFeed(100);
  
  // Debug logging
  logger.debug('FeedTab current filter:', filter);
  logger.debug('FeedTab activities count:', activities?.length || 0);
  logger.debug('FeedTab sample activity:', activities?.[0]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Handle activity clicks for navigation
  const handleActivityClick = useCallback((activity) => {
    logger.debug('Global activity clicked:', activity);
    
    if (activity.metadata?.projectId && onNavigateToProject) {
      // Navigate to the specific section based on activity type
      switch (activity.type) {
        case 'project':
          onNavigateToProject(activity.metadata.projectId, 'overview');
          break;
        case 'task':
          onNavigateToProject(activity.metadata.projectId, 'overview');
          break;
        case 'scope':
          onNavigateToProject(activity.metadata.projectId, 'scope');
          break;
        case 'shop_drawing':
          onNavigateToProject(activity.metadata.projectId, 'drawings');
          break;
        case 'material_spec':
          onNavigateToProject(activity.metadata.projectId, 'specifications');
          break;
        case 'timeline':
          onNavigateToProject(activity.metadata.projectId, 'timeline');
          break;
        case 'compliance':
          onNavigateToProject(activity.metadata.projectId, 'compliance');
          break;
        default:
          onNavigateToProject(activity.metadata.projectId, 'overview');
      }
    } else {
      // Handle global activities (team members, etc.)
      logger.debug('Global activity without project context:', activity.type);
    }
  }, [onNavigateToProject]);

  // Enhanced click handlers for specific elements within activities
  const handleProjectClick = useCallback((projectId, projectName) => {
    logger.debug('Project clicked:', projectName, projectId);
    logger.debug('Available projects:', projects.map(p => ({ id: p.id, name: p.name })));
    
    // First try to find by exact ID match
    let targetProject = projects.find(p => p.id === projectId || p.id === parseInt(projectId));
    
    if (!targetProject) {
      logger.debug('Project ID not found, trying to find by name:', projectName);
      
      // Try to find by exact name match
      targetProject = projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
      
      if (!targetProject) {
        // Try partial name match
        targetProject = projects.find(p => 
          p.name.toLowerCase().includes(projectName.toLowerCase()) ||
          projectName.toLowerCase().includes(p.name.toLowerCase())
        );
      }
    }
    
    if (targetProject) {
      logger.debug('Project found, navigating to:', targetProject);
      if (onNavigateToProject) {
        onNavigateToProject(targetProject.id, 'overview');
      }
    } else {
      logger.warn(`Could not find project "${projectName}" (ID: ${projectId})`);
      logger.debug('Available project names:', projects.map(p => p.name));
      
      // Only use fallback if absolutely necessary and show warning
      if (projects.length > 0) {
        alert(`Project "${projectName}" not found. Redirecting to available project: "${projects[0].name}"`);
        if (onNavigateToProject) {
          onNavigateToProject(projects[0].id, 'overview');
        }
      }
    }
  }, [onNavigateToProject, projects]);

  const handleTaskClick = useCallback((projectId, taskId, taskName) => {
    logger.debug('Task clicked:', taskName, taskId, 'in project', projectId);
    
    // Try to find the project this task belongs to
    const project = projects.find(p => p.id === projectId || p.id === parseInt(projectId));
    
    if (project) {
      logger.debug('Task project found, navigating to:', project);
      if (onNavigateToProject) {
        onNavigateToProject(project.id, 'overview');
        // TODO: Could add task highlighting or task detail view
      }
    } else {
      console.warn(`❌ Task's project (ID: ${projectId}) not found`);
      // Don't auto-redirect for tasks, just show a message
      alert(`The project for task "${taskName}" was not found. Please check if the project still exists.`);
    }
  }, [onNavigateToProject, projects]);

  const handleScopeClick = useCallback((projectId, scopeItemId, scopeItemName) => {
    console.log('Scope item clicked:', scopeItemName, scopeItemId, 'in project', projectId);
    if (onNavigateToProject) {
      onNavigateToProject(projectId, 'scope');
      // TODO: Could add scope item highlighting
    }
  }, [onNavigateToProject]);

  const handleDrawingClick = useCallback((projectId, drawingId, drawingName) => {
    console.log('Drawing clicked:', drawingName, drawingId, 'in project', projectId);
    if (onNavigateToProject) {
      onNavigateToProject(projectId, 'drawings');
      // TODO: Could add drawing highlighting or detail view
    }
  }, [onNavigateToProject]);

  const handleSpecClick = useCallback((projectId, specId, specName) => {
    console.log('Specification clicked:', specName, specId, 'in project', projectId);
    if (onNavigateToProject) {
      onNavigateToProject(projectId, 'specifications');
      // TODO: Could add spec highlighting or detail view
    }
  }, [onNavigateToProject]);

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(activity => {
        const description = (activity.description || '').toLowerCase();
        const userName = (activity.userName || '').toLowerCase();
        const projectName = (activity.metadata?.projectName || '').toLowerCase();
        const taskName = (activity.metadata?.taskName || '').toLowerCase();
        const scopeItemName = (activity.metadata?.scopeItemName || '').toLowerCase();
        const drawingName = (activity.metadata?.drawingName || '').toLowerCase();
        const specName = (activity.metadata?.specName || '').toLowerCase();
        const activityType = (activity.type || '').toLowerCase();
        
        return description.includes(searchLower) ||
               userName.includes(searchLower) ||
               projectName.includes(searchLower) ||
               taskName.includes(searchLower) ||
               scopeItemName.includes(searchLower) ||
               drawingName.includes(searchLower) ||
               specName.includes(searchLower) ||
               activityType.includes(searchLower);
      });
    }
    
    // Apply type filter
    if (filter !== 'all') {
      if (filter === 'projects') {
        filtered = filtered.filter(activity => activity.type === 'project');
      } else if (filter === 'tasks') {
        filtered = filtered.filter(activity => activity.type === 'task');
      } else if (filter === 'team') {
        filtered = filtered.filter(activity => activity.type === 'team_member');
      } else if (filter === 'comments') {
        filtered = filtered.filter(activity => activity.type === 'comment');
      }
    }
    
    return filtered;
  }, [activities, searchTerm, filter]);

  const activityFilters = [
    { value: 'all', label: 'All Activity', color: 'default' },
    { value: 'projects', label: 'Projects', color: 'primary' },
    { value: 'tasks', label: 'Tasks', color: 'secondary' },
    { value: 'team', label: 'Team', color: 'success' },
    { value: 'comments', label: 'Comments', color: 'info' },
  ];

  // Filter menu state
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const filterOpen = Boolean(filterAnchorEl);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (filterValue) => {
    setFilter(filterValue);
    setFilterAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3, pt: 1 }}>
      {/* Single Wide Activity Log Card */}
      <Card sx={{ 
        width: '100%',
        maxWidth: '1200px',
        backgroundPalette: isDarkMode ? '#1B2951' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}`,
        borderRadius: 2
      }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: isDarkMode ? '#F5F2E8' : '#2C3E50'
            }}>
              Activity Log
            </Typography>
          }
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Compact Search Bar */}
              <TextField
                size="small"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  width: 250,
                  '& .MuiOutlinedInput-root': {
                    height: 32,
                    backgroundPalette: isDarkMode ? '#2C3966' : '#f8f9fa',
                    '& fieldset': {
                      borderPalette: isDarkMode ? '#566BA3' : '#E9ECEF'
                    },
                    '&:hover fieldset': {
                      borderPalette: isDarkMode ? '#A8B8D1' : '#1976d2'
                    },
                    '&.Mui-focused fieldset': {
                      borderPalette: '#1976d2'
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F5F2E8' : '#2C3E50',
                    fontSize: '0.875rem'
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: isDarkMode ? '#A8B8D1' : '#7F8C8D',
                    opacity: 1
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: isDarkMode ? '#A8B8D1' : '#7F8C8D' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        sx={{ 
                          color: isDarkMode ? '#A8B8D1' : '#7F8C8D',
                          p: 0.5
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              {/* Filter Dropdown Button */}
              <Tooltip title="Filter Activities">
                <IconButton
                  onClick={handleFilterClick}
                  sx={{
                    backgroundPalette: isDarkMode ? '#2C3966' : '#f8f9fa',
                    border: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}`,
                    width: 32,
                    height: 32,
                    '&:hover': {
                      backgroundPalette: isDarkMode ? '#3A4B7D' : '#E9ECEF'
                    },
                    color: filter === 'all' ? (isDarkMode ? '#A8B8D1' : '#7F8C8D') : '#1976d2'
                  }}
                >
                  <FilterIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              {/* Refresh Button */}
              <Tooltip title="Refresh">
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    backgroundPalette: isDarkMode ? '#2C3966' : '#f8f9fa',
                    border: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}`,
                    width: 32,
                    height: 32,
                    '&:hover': {
                      backgroundPalette: isDarkMode ? '#3A4B7D' : '#E9ECEF'
                    },
                    color: isDarkMode ? '#A8B8D1' : '#7F8C8D'
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
          sx={{
            pb: 1,
            borderBottom: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}`,
            '& .MuiCardHeader-action': {
              m: 0,
              alignSelf: 'center'
            }
          }}
        />
        
        {/* Search Results Info */}
        {searchTerm.trim() && (
          <Box sx={{ px: 2, py: 1, backgroundPalette: isDarkMode ? '#2C3966' : '#f8f9fa', borderBottom: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}` }}>
            <Typography variant="caption" sx={{ color: isDarkMode ? '#A8B8D1' : '#7F8C8D' }}>
              {filteredActivities.length === 0 
                ? `No activities found for "${searchTerm}"`
                : `Found ${filteredActivities.length} activities for "${searchTerm}"`
              }
            </Typography>
          </Box>
        )}
        
        <CardContent sx={{ p: 0, height: 600, overflow: 'hidden' }}>
          <CompactActivityFeed 
            key={`compact-${refreshKey}`} 
            limit={100}
            maxHeight={600}
            activities={filteredActivities}
            onActivityClick={handleActivityClick}
            onProjectClick={handleProjectClick}
            onTaskClick={handleTaskClick}
            onScopeClick={handleScopeClick}
            onDrawingClick={handleDrawingClick}
            onSpecClick={handleSpecClick}
          />
        </CardContent>
      </Card>
      
      {/* Filter Dropdown Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={filterOpen}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            backgroundPalette: isDarkMode ? '#1B2951' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#566BA3' : '#E9ECEF'}`,
            mt: 1
          }
        }}
      >
        {activityFilters.map((filterOption) => (
          <MenuItem 
            key={filterOption.value} 
            onClick={() => handleFilterSelect(filterOption.value)}
            selected={filter === filterOption.value}
            sx={{
              color: isDarkMode ? '#F5F2E8' : '#2C3E50',
              '&.Mui-selected': {
                backgroundPalette: isDarkMode ? '#3A4B7D' : 'rgba(25, 118, 210, 0.12)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <FilterIcon fontSize="small" sx={{ color: '#1976d2' }} />
            </ListItemIcon>
            <ListItemText primary={filterOption.label} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default FeedTab;