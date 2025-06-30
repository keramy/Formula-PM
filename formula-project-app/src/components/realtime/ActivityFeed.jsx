import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Box,
  Skeleton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  MdTask as Task,
  MdGroup as Group,
  MdBusiness as Business,
  MdChat as Comment,
  MdRefresh as Update,
  MdAdd as Add,
  MdEdit as Edit,
  MdDelete as Delete,
  MdCheck as Check,
  MdPlayArrow as Play,
  MdPause as Pause,
  MdClose as Block,
  MdDescription as Description,
  MdDownload as FileDownload,
  MdSend as Publish,
  MdPeople as People
} from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';
import { useActivityFeed } from '../../hooks/useRealTime';
import EnhancedActivityDescription from './EnhancedActivityDescription';

// Activity type icons mapping
const getActivityIcon = (type, action) => {
  const iconMap = {
    project: {
      created: <Add color="primary" />,
      updated: <Edit color="info" />,
      deleted: <Delete color="error" />,
    },
    task: {
      created: <Check color="primary" />,
      updated: <Edit color="info" />,
      completed: <Check color="success" />,
      started: <Play color="warning" />,
      paused: <Pause color="warning" />,
      blocked: <Block color="error" />,
    },
    team_member: {
      created: <People color="primary" />,
      updated: <Edit color="info" />,
    },
    client: {
      created: <Business color="primary" />,
      updated: <Edit color="info" />,
    },
    comment: {
      added: <Comment color="info" />,
    },
    data_update: {
      updated: <Update color="info" />,
    },
    // Add new activity types
    scope: {
      created: <Add color="primary" />,
      updated: <Edit color="info" />,
      deleted: <Delete color="error" />,
    },
    shop_drawing: {
      approved: <Check color="success" />,
      pending: <Update color="warning" />,
      rejected: <Block color="error" />,
    },
    material_spec: {
      approved: <Check color="success" />,
      pending: <Update color="warning" />,
      rejected: <Block color="error" />,
    },
    timeline: {
      updated: <Edit color="info" />,
    },
    compliance: {
      updated: <Edit color="info" />,
    },
    report: {
      created: <Description color="primary" />,
      exported: <FileDownload color="info" />,
      published: <Publish color="success" />,
    },
  };

  return iconMap[type]?.[action] || <Update color="info" />;
};

// Activity type colors
const getActivityPalette = (type, action) => {
  const colorMap = {
    project: {
      created: 'primary',
      updated: 'info',
      deleted: 'error',
    },
    task: {
      created: 'primary',
      updated: 'info',
      completed: 'success',
      started: 'warning',
      paused: 'warning',
      blocked: 'error',
    },
    team_member: {
      created: 'primary',
      updated: 'info',
    },
    client: {
      created: 'primary',
      updated: 'info',
    },
    comment: {
      added: 'info',
    },
    data_update: {
      updated: 'info',
    },
    scope: {
      created: 'primary',
      updated: 'info',
      deleted: 'error',
    },
    shop_drawing: {
      approved: 'success',
      pending: 'warning',
      rejected: 'error',
    },
    material_spec: {
      approved: 'success',
      pending: 'warning',
      rejected: 'error',
    },
    timeline: {
      updated: 'info',
    },
    compliance: {
      updated: 'info',
    },
    report: {
      created: 'primary',
      exported: 'info',
      published: 'success',
    },
  };

  return colorMap[type]?.[action] || 'default';
};

// Get proper display name for activity types
const getActivityDisplayName = (type) => {
  const displayNames = {
    project: 'Project',
    task: 'Task',
    team_member: 'Team Member',
    client: 'Client',
    comment: 'Comment',
    data_update: 'Data Update',
    scope: 'Scope',
    shop_drawing: 'Shop Drawing',
    material_spec: 'Material Specification',
    timeline: 'Timeline',
    compliance: 'Compliance',
    report: 'Report'
  };
  return displayNames[type] || 'Activity';
};

// Individual activity item component
const ActivityItem = ({ activity, onActivityClick, onProjectClick, onTaskClick, onScopeClick, onDrawingClick, onSpecClick, onReportClick }) => {
  // Safety check for activity object
  if (!activity || typeof activity !== 'object') {
    return null;
  }

  const handleActivityClick = () => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  const timestamp = activity.timestamp || new Date().toISOString();
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  const activityType = activity.type || 'unknown';
  const activityAction = activity.action || 'updated';
  const icon = getActivityIcon(activityType, activityAction);
  const color = getActivityPalette(activityType, activityAction);

  return (
    <ListItem
      sx={{
        borderBottom: '1px solid #f0f0f0',
        '&:last-child': { borderBottom: 'none' },
        py: 1.5,
        cursor: 'default'
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
          {icon}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ flex: 1 }}>
              <EnhancedActivityDescription
                activity={activity}
                onProjectClick={onProjectClick}
                onTaskClick={onTaskClick}
                onScopeClick={onScopeClick}
                onDrawingClick={onDrawingClick}
                onSpecClick={onSpecClick}
                onReportClick={onReportClick}
              />
            </Box>
            <Chip
              label={getActivityDisplayName(activityType)}
              size="small"
              variant="outlined"
              sx={{ 
                fontSize: '0.7rem',
                height: '20px',
                color: '#1976d2',
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '& .MuiChip-label': {
                  px: 1,
                  color: '#1976d2',
                  fontWeight: 500
                }
              }}
            />
          </Box>
        }
        secondary={
          <Typography variant="caption" color="textSecondary">
            {activity.userName && `by ${String(activity.userName)} • `}{timeAgo}
          </Typography>
        }
      />
    </ListItem>
  );
};

// Activity skeleton loader
const ActivitySkeleton = () => (
  <ListItem>
    <ListItemAvatar>
      <Skeleton variant="circular" size={40} />
    </ListItemAvatar>
    <ListItemText
      primary={<Skeleton variant="text" width="80%" />}
      secondary={<Skeleton variant="text" width="60%" />}
    />
  </ListItem>
);

// Main activity feed component
const ActivityFeed = ({ 
  limit = 20, 
  showHeader = true, 
  maxHeight = 400,
  showBadge = true,
  title = "Recent Activity",
  activities: providedActivities,
  onActivityClick,
  onProjectClick,
  onTaskClick,
  onScopeClick,
  onDrawingClick,
  onSpecClick,
  onReportClick
}) => {
  const { activities: fetchedActivities, isLoading } = useActivityFeed(limit);
  const [filter, setFilter] = useState('all');
  
  // Use provided activities if available, otherwise use fetched activities
  const activities = providedActivities || fetchedActivities;
  
  // Filter activities by type
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  // Get unique activity types for filter options
  const activityTypes = [...new Set(activities.map(activity => activity.type))];

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {showHeader && (
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {showBadge ? (
                <Badge badgeContent={activities.length} color="primary" max={99}>
                  <Typography variant="h6">{title}</Typography>
                </Badge>
              ) : (
                <Typography variant="h6">{title}</Typography>
              )}
            </Box>
          }
          action={
            activityTypes.length > 1 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  label="All"
                  size="small"
                  color={filter === 'all' ? 'primary' : 'default'}
                  onClick={() => setFilter('all')}
                  sx={{ cursor: 'pointer' }}
                />
                {activityTypes.map(type => (
                  <Chip
                    key={type}
                    label={getActivityDisplayName(type)}
                    size="small"
                    color={filter === type ? 'primary' : 'default'}
                    onClick={() => setFilter(type)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            )
          }
          sx={{ pb: 1 }}
        />
      )}
      
      <CardContent sx={{ flex: 1, pt: showHeader ? 0 : 2, overflow: 'hidden' }}>
        <Box sx={{ height: maxHeight, overflow: 'auto' }}>
          {isLoading ? (
            <List>
              {Array.from({ length: 5 }).map((_, index) => (
                <ActivitySkeleton key={index} />
              ))}
            </List>
          ) : filteredActivities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="textSecondary">
                No recent activity found
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onActivityClick={onActivityClick}
                  onProjectClick={onProjectClick}
                  onTaskClick={onTaskClick}
                  onScopeClick={onScopeClick}
                  onDrawingClick={onDrawingClick}
                  onSpecClick={onSpecClick}
                  onReportClick={onReportClick}
                />
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Compact activity feed for sidebars
export const CompactActivityFeed = ({ 
  limit = 10, 
  maxHeight = 300, 
  activities, 
  onActivityClick,
  onProjectClick,
  onTaskClick,
  onScopeClick,
  onDrawingClick,
  onSpecClick,
  onReportClick
}) => {
  return (
    <ActivityFeed
      limit={limit}
      showHeader={false}
      maxHeight={maxHeight}
      showBadge={false}
      activities={activities}
      onActivityClick={onActivityClick}
      onProjectClick={onProjectClick}
      onTaskClick={onTaskClick}
      onScopeClick={onScopeClick}
      onDrawingClick={onDrawingClick}
      onSpecClick={onSpecClick}
      onReportClick={onReportClick}
    />
  );
};

// Activity feed with detailed view
export const DetailedActivityFeed = ({ 
  limit = 50, 
  activities, 
  onActivityClick, 
  title,
  onProjectClick,
  onTaskClick,
  onScopeClick,
  onDrawingClick,
  onSpecClick,
  onReportClick
}) => {
  return (
    <ActivityFeed
      limit={limit}
      showHeader={true}
      maxHeight={600}
      showBadge={true}
      title={title || "Activity Log"}
      activities={activities}
      onActivityClick={onActivityClick}
      onProjectClick={onProjectClick}
      onTaskClick={onTaskClick}
      onScopeClick={onScopeClick}
      onDrawingClick={onDrawingClick}
      onSpecClick={onSpecClick}
      onReportClick={onReportClick}
    />
  );
};

export default ActivityFeed;