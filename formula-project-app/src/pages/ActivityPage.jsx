import React, { useState, useEffect } from 'react';
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
  InputAdornment
} from '@mui/material';
import {
  Activity as ActivityIcon,
  Filter as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Timeline as TimelineIcon,
  Group as TeamIcon,
  Building as ProjectIcon
} from 'iconoir-react';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import ActivityFeed from '../components/realtime/ActivityFeed';
import RealtimeActivityFeed from '../components/realtime/RealtimeActivityFeed';
import { useAuth } from '../context/AuthContext';
import { useActivityFeed } from '../hooks/useRealTime';

const ActivityPage = () => {
  const [activeTab, setActiveTab] = useState('live-feed');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Use the real-time activity feed hook
  const {
    activities,
    loading,
    error: feedError,
    refreshFeed
  } = useActivityFeed({
    autoRefresh: activeTab === 'live-feed',
    refreshInterval: 5000 // 5 seconds
  });

  useEffect(() => {
    if (feedError) {
      setError(feedError);
    }
  }, [feedError]);

  const handleRefresh = () => {
    refreshFeed();
    setError(null);
  };

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
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ width: 200, mr: 1 }}
      />
      <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
        <InputLabel>Filter</InputLabel>
        <Select
          value={filterType}
          label="Filter"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <MenuItem value="all">All Activities</MenuItem>
          <MenuItem value="projects">Projects</MenuItem>
          <MenuItem value="tasks">Tasks</MenuItem>
          <MenuItem value="team">Team</MenuItem>
          <MenuItem value="system">System</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={handleRefresh}
      >
        Refresh
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
        badge={activities.filter(a => a.isNew).length}
      />
      <CleanTab 
        label="Team Activity" 
        isActive={activeTab === 'team-activity'}
        onClick={() => setActiveTab('team-activity')}
        icon={<TeamIcon sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Project Timeline" 
        isActive={activeTab === 'project-timeline'}
        onClick={() => setActiveTab('project-timeline')}
        icon={<TimelineIcon sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="System Events" 
        isActive={activeTab === 'system-events'}
        onClick={() => setActiveTab('system-events')}
        icon={<ProjectIcon sx={{ fontSize: 16 }} />}
      />
    </>
  );

  const getFilteredActivities = () => {
    let filtered = [...activities];

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => {
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
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.entityName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab-specific filters
    switch (activeTab) {
      case 'team-activity':
        return filtered.filter(a => 
          a.entityType === 'user' || 
          a.action === 'user_added' || 
          a.action === 'comment_added'
        );
      case 'project-timeline':
        return filtered.filter(a => 
          a.entityType === 'project' || 
          a.entityType === 'task'
        ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case 'system-events':
        return filtered.filter(a => a.entityType === 'system');
      default:
        return filtered;
    }
  };

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
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Activity Summary
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Activities Today: <strong>{activities.length}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New Since Last Visit: <strong>{activities.filter(a => a.isNew).length}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users: <strong>{new Set(activities.map(a => a.userId)).size}</strong>
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Real-time updates are enabled. New activities will appear automatically.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    }

    return (
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
    );
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {renderTabContent()}
      </Box>
    </CleanPageLayout>
  );
};

export default ActivityPage;