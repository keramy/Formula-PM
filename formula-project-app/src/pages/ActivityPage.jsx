import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Paper,
  Divider,
  Badge,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Activity as ActivityIcon,
  Filter as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Timeline as TimelineIcon,
  Group as TeamIcon,
  Building as ProjectIcon,
  Calendar as CalendarIcon,
  Clock as TimeIcon,
  Bell as NotificationIcon,
  TrendingUp as TrendingUpIcon,
  StatUp as StatsIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  Export as ExportIcon,
  Eye as ViewIcon
} from 'iconoir-react';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import ActivityFeed from '../components/realtime/ActivityFeed';
import RealtimeActivityFeed from '../components/realtime/RealtimeActivityFeed';
import { useAuth } from '../context/AuthContext';
import { useActivityFeed } from '../hooks/useRealTime';

const ActivityPage = React.memo(() => {
  const [activeTab, setActiveTab] = useState('live-feed');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Use the real-time activity feed hook
  const {
    activities,
    loading,
    error: feedError,
    refreshFeed
  } = useActivityFeed({
    autoRefresh: autoRefresh && activeTab === 'live-feed',
    refreshInterval: 5000 // 5 seconds
  });

  useEffect(() => {
    if (feedError) {
      setError(feedError);
    }
  }, [feedError]);

  const handleRefresh = useCallback(() => {
    refreshFeed();
    setError(null);
  }, [refreshFeed]);

  // Calculate basic activity counts (optimized)
  const activityCounts = useMemo(() => {
    if (!activities.length) return { total: 0, newSinceLastVisit: 0 };
    
    return {
      total: activities.length,
      newSinceLastVisit: activities.filter(a => a.isNew).length
    };
  }, [activities.length, activities]);

  // Calculate date-based statistics (optimized)
  const dateStats = useMemo(() => {
    if (!activities.length) return { today: 0, yesterday: 0 };
    
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    let todayCount = 0;
    let yesterdayCount = 0;
    
    for (const activity of activities) {
      const activityDate = new Date(activity.timestamp).toDateString();
      if (activityDate === today) todayCount++;
      else if (activityDate === yesterdayString) yesterdayCount++;
    }
    
    return { today: todayCount, yesterday: yesterdayCount };
  }, [activities]);

  // Calculate type-based statistics (optimized)
  const typeStats = useMemo(() => {
    if (!activities.length) return { projects: 0, tasks: 0, team: 0, system: 0, uniqueUsers: 0 };
    
    const userIds = new Set();
    let projects = 0, tasks = 0, team = 0, system = 0;
    
    for (const activity of activities) {
      if (activity.userId) userIds.add(activity.userId);
      if (activity.user?.id) userIds.add(activity.user.id);
      
      switch (activity.entityType) {
        case 'project': projects++; break;
        case 'task': tasks++; break;
        case 'system': system++; break;
        default: break;
      }
      
      if (activity.entityType === 'user' || activity.action === 'user_added') {
        team++;
      }
    }
    
    return {
      projects,
      tasks,
      team,
      system,
      uniqueUsers: userIds.size
    };
  }, [activities]);

  // Combine all statistics
  const activityStats = useMemo(() => ({
    ...activityCounts,
    ...dateStats,
    uniqueUsers: typeStats.uniqueUsers,
    byType: {
      projects: typeStats.projects,
      tasks: typeStats.tasks,
      team: typeStats.team,
      system: typeStats.system
    }
  }), [activityCounts, dateStats, typeStats]);


  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Search activities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={{ width: 200, mr: 1 }}
      />
      <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={filterType}
          label="Type"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <MenuItem value="all">All Activities</MenuItem>
          <MenuItem value="projects">Projects</MenuItem>
          <MenuItem value="tasks">Tasks</MenuItem>
          <MenuItem value="team">Team</MenuItem>
          <MenuItem value="system">System</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 100, mr: 1 }}>
        <InputLabel>Period</InputLabel>
        <Select
          value={dateRange}
          label="Period"
          onChange={(e) => setDateRange(e.target.value)}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="yesterday">Yesterday</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </Select>
      </FormControl>
      <Tooltip title="Activity Settings">
        <IconButton 
          size="small" 
          onClick={() => setShowSettings(!showSettings)}
          sx={{ mr: 1 }}
        >
          <SettingsIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      <Button
        className="clean-button-secondary"
        startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
        onClick={handleRefresh}
        size="small"
      >
        Refresh
      </Button>
      <Button
        className="clean-button-primary"
        startIcon={<ExportIcon sx={{ fontSize: 16 }} />}
        size="small"
      >
        Export
      </Button>
    </Box>
  );

  const tabs = (
    <>
      <CleanTab 
        label="Live Feed" 
        isActive={activeTab === 'live-feed'}
        onClick={() => setActiveTab('live-feed')}
        icon={<ActivityIcon sx={{ fontSize: 16 }} />}
        badge={activityStats.newSinceLastVisit > 0 ? activityStats.newSinceLastVisit : null}
      />
      <CleanTab 
        label="Team Activity" 
        isActive={activeTab === 'team-activity'}
        onClick={() => setActiveTab('team-activity')}
        icon={<TeamIcon sx={{ fontSize: 16 }} />}
        badge={activityStats.byType.team > 0 ? activityStats.byType.team : null}
      />
      <CleanTab 
        label="Project Timeline" 
        isActive={activeTab === 'project-timeline'}
        onClick={() => setActiveTab('project-timeline')}
        icon={<TimelineIcon sx={{ fontSize: 16 }} />}
        badge={activityStats.byType.projects > 0 ? activityStats.byType.projects : null}
      />
      <CleanTab 
        label="System Events" 
        isActive={activeTab === 'system-events'}
        onClick={() => setActiveTab('system-events')}
        icon={<ProjectIcon sx={{ fontSize: 16 }} />}
        badge={activityStats.byType.system > 0 ? activityStats.byType.system : null}
      />
    </>
  );

  // Memoized search term processing
  const searchTermLower = useMemo(() => 
    searchTerm.toLowerCase().trim(), 
    [searchTerm]
  );

  const getFilteredActivities = useCallback(() => {
    if (!activities.length) return [];

    // Apply all filters in a single pass for better performance
    const filtered = activities.filter(activity => {
      // Date filter
      const passesDateFilter = (() => {
        if (dateRange === 'all') return true;
        
        const activityTime = new Date(activity.timestamp);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (dateRange) {
          case 'today':
            return activityTime >= today;
          case 'yesterday': {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return activityTime >= yesterday && activityTime < today;
          }
          case 'week': {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return activityTime >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return activityTime >= monthAgo;
          }
          default:
            return true;
        }
      })();

      if (!passesDateFilter) return false;

      // Type filter
      const passesTypeFilter = (() => {
        if (filterType === 'all') return true;
        
        switch (filterType) {
          case 'projects':
            return activity.entityType === 'project';
          case 'tasks':
            return activity.entityType === 'task';
          case 'team':
            return activity.entityType === 'user' || activity.action === 'user_added';
          case 'system':
            return activity.entityType === 'system';
          default:
            return true;
        }
      })();

      if (!passesTypeFilter) return false;

      // Search filter
      const passesSearchFilter = (() => {
        if (!searchTermLower) return true;
        
        return (
          activity.description?.toLowerCase().includes(searchTermLower) ||
          activity.user?.name?.toLowerCase().includes(searchTermLower) ||
          activity.entityName?.toLowerCase().includes(searchTermLower)
        );
      })();

      if (!passesSearchFilter) return false;

      // Tab-specific filters
      switch (activeTab) {
        case 'team-activity':
          return activity.entityType === 'user' || 
                 activity.action === 'user_added' || 
                 activity.action === 'comment_added';
        case 'project-timeline':
          return activity.entityType === 'project' || activity.entityType === 'task';
        case 'system-events':
          return activity.entityType === 'system';
        default:
          return true;
      }
    });

    // Sort if needed (only for project timeline)
    if (activeTab === 'project-timeline') {
      return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return filtered;
  }, [activities, dateRange, filterType, searchTermLower, activeTab]);

  const renderTabContent = () => {
    const filteredActivities = getFilteredActivities();

    if (activeTab === 'live-feed') {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <RealtimeActivityFeed
              activities={filteredActivities}
              loading={loading}
              onRefresh={handleRefresh}
              showFilters={false}
              maxItems={50}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            {/* Activity Statistics */}
            <Card className="clean-card" sx={{ mb: 3 }}>
              <Box className="clean-section-header">
                <Box className="clean-section-indicator"></Box>
                <Typography className="clean-section-title">
                  Activity Statistics
                </Typography>
              </Box>
              <CardContent sx={{ pt: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" sx={{ color: '#516AC8', fontWeight: 700 }}>
                        {activityStats.today}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Today
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" sx={{ color: '#E3AF64', fontWeight: 700 }}>
                        {activityStats.uniqueUsers}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Active Users
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Projects
                  </Typography>
                  <Chip size="small" label={activityStats.byType.projects} color="primary" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tasks
                  </Typography>
                  <Chip size="small" label={activityStats.byType.tasks} color="success" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Team Activity
                  </Typography>
                  <Chip size="small" label={activityStats.byType.team} color="info" variant="outlined" />
                </Box>
                {activityStats.newSinceLastVisit > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>{activityStats.newSinceLastVisit}</strong> new activities since your last visit
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            {/* Real-time Status */}
            <Card className="clean-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Badge color="success" variant="dot">
                    <NotificationIcon sx={{ fontSize: 20, color: '#10B981' }} />
                  </Badge>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Live Updates {autoRefresh ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Activity feed refreshes automatically every 5 seconds when enabled.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    size="small" 
                    variant={autoRefresh ? 'contained' : 'outlined'}
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    startIcon={<TimeIcon sx={{ fontSize: 14 }} />}
                  >
                    {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ActivityFeed
            activities={filteredActivities}
            loading={loading}
            title={
              activeTab === 'team-activity' ? 'Team Activity' :
              activeTab === 'project-timeline' ? 'Project Timeline' :
              activeTab === 'system-events' ? 'System Events' : 'Activity Feed'
            }
            showUserFilters={activeTab === 'team-activity'}
            showProjectFilters={activeTab === 'project-timeline'}
            groupByDate={activeTab === 'project-timeline'}
            onRefresh={handleRefresh}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          {renderActivitySidebar()}
        </Grid>
      </Grid>
    );
  };

  // Render activity sidebar for different tabs
  const renderActivitySidebar = () => {
    switch (activeTab) {
      case 'team-activity':
        return (
          <Card className="clean-card">
            <Box className="clean-section-header">
              <Box className="clean-section-indicator" sx={{ backgroundColor: '#10B981' }}></Box>
              <Typography className="clean-section-title">
                Team Insights
              </Typography>
            </Box>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Most Active Team Members
                </Typography>
                {Array.from(new Set(filteredActivities
                  .filter(a => a.user?.name)
                  .map(a => a.user.name)
                )).slice(0, 5).map((userName, index) => {
                  const userActivities = filteredActivities.filter(a => a.user?.name === userName).length;
                  return (
                    <Box key={userName} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#E3AF64' }}>
                        {userName.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ flex: 1, fontSize: 13 }}>
                        {userName}
                      </Typography>
                      <Chip size="small" label={userActivities} variant="outlined" />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        );
      case 'project-timeline':
        return (
          <Card className="clean-card">
            <Box className="clean-section-header">
              <Box className="clean-section-indicator" sx={{ backgroundColor: '#516AC8' }}></Box>
              <Typography className="clean-section-title">
                Timeline Overview
              </Typography>
            </Box>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Activity Distribution
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Projects</Typography>
                    <Typography variant="caption">{activityStats.byType.projects}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(activityStats.byType.projects / activityStats.total) * 100} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Tasks</Typography>
                    <Typography variant="caption">{activityStats.byType.tasks}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(activityStats.byType.tasks / activityStats.total) * 100} 
                    sx={{ height: 6, borderRadius: 3 }}
                    color="success"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      case 'system-events':
        return (
          <Card className="clean-card">
            <Box className="clean-section-header">
              <Box className="clean-section-indicator" sx={{ backgroundColor: '#9CA3AF' }}></Box>
              <Typography className="clean-section-title">
                System Status
              </Typography>
            </Box>
            <CardContent sx={{ pt: 0 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                System is operating normally. Last backup completed successfully.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                System events help track automated processes, backups, and system maintenance activities.
              </Typography>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <CleanPageLayout
      title="Activity Feed"
      subtitle="Real-time activity stream showing all project activities, team interactions, and system events"
      breadcrumbs={[
        { label: 'Team Space', href: '/workspace' },
        { label: 'Activity', href: '/activity' }
      ]}
      headerActions={headerActions}
      tabs={tabs}
    >
      <Box className="clean-fade-in">
        {/* Settings Panel */}
        {showSettings && (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              mb: 3, 
              border: '1px solid #E5E7EB',
              borderRadius: 2 
            }}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Activity Feed Settings
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Auto-refresh Interval</InputLabel>
                  <Select defaultValue="5000" label="Auto-refresh Interval">
                    <MenuItem value="3000">3 seconds</MenuItem>
                    <MenuItem value="5000">5 seconds</MenuItem>
                    <MenuItem value="10000">10 seconds</MenuItem>
                    <MenuItem value="30000">30 seconds</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Items per page</InputLabel>
                  <Select defaultValue="50" label="Items per page">
                    <MenuItem value="25">25 items</MenuItem>
                    <MenuItem value="50">50 items</MenuItem>
                    <MenuItem value="100">100 items</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button 
                  size="small" 
                  onClick={() => setShowSettings(false)}
                  startIcon={<ViewIcon sx={{ fontSize: 14 }} />}
                >
                  Apply Settings
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Empty state when no activities match filters */}
        {getFilteredActivities().length === 0 && !loading && (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              border: '1px dashed #E5E7EB',
              borderRadius: 2,
              mb: 3
            }}
          >
            <ActivityIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No activities found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try adjusting your filters or date range to see more activities.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => {
                setFilterType('all');
                setDateRange('all');
                setSearchTerm('');
              }}
              size="small"
            >
              Clear All Filters
            </Button>
          </Paper>
        )}

        {renderTabContent()}
      </Box>
    </CleanPageLayout>
  );
});

ActivityPage.displayName = 'ActivityPage';

export default ActivityPage;