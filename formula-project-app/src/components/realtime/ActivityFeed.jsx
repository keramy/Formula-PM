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
  IconButton,
  Collapse,
  Box,
  Skeleton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Assignment,
  People,
  Business,
  Comment,
  Update,
  Add,
  Edit,
  Delete,
  Check,
  PlayArrow,
  Pause,
  Block
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useActivityFeed } from '../../hooks/useRealTime';

// Activity type icons mapping
const getActivityIcon = (type, action) => {
  const iconMap = {
    project: {
      created: <Add color="primary" />,
      updated: <Edit color="info" />,
      deleted: <Delete color="error" />,
    },
    task: {
      created: <Assignment color="primary" />,
      updated: <Edit color="info" />,
      completed: <Check color="success" />,
      started: <PlayArrow color="warning" />,
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
    data_update: <Update color="info" />,
  };

  return iconMap[type]?.[action] || iconMap[type] || <Update color="info" />;
};

// Activity type colors
const getActivityColor = (type, action) => {
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
    data_update: 'info',
  };

  return colorMap[type]?.[action] || colorMap[type] || 'default';
};

// Individual activity item component
const ActivityItem = ({ activity, showDetails = false }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });
  const icon = getActivityIcon(activity.type, activity.action);
  const color = getActivityColor(activity.type, activity.action);

  return (
    <ListItem
      sx={{
        borderBottom: '1px solid #f0f0f0',
        '&:last-child': { borderBottom: 'none' },
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
          {icon}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {activity.description}
            </Typography>
            <Chip
              label={activity.type}
              size="small"
              color={color}
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: '20px' }}
            />
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="textSecondary">
              {activity.userName && `by ${activity.userName} • `}{timeAgo}
            </Typography>
            {showDetails && activity.metadata && (
              <IconButton
                size="small"
                onClick={handleExpandClick}
                sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
              >
                <ExpandMore fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
      />
      
      {showDetails && activity.metadata && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ pl: 7, pb: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Details:
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {Object.entries(activity.metadata).map(([key, value]) => (
                <Typography key={key} variant="caption" display="block">
                  <strong>{key}:</strong> {String(value)}
                </Typography>
              ))}
            </Box>
          </Box>
        </Collapse>
      )}
    </ListItem>
  );
};

// Activity skeleton loader
const ActivitySkeleton = () => (
  <ListItem>
    <ListItemAvatar>
      <Skeleton variant="circular" width={40} height={40} />
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
  showDetails = false,
  showBadge = true,
  title = "Recent Activity"
}) => {
  const { activities, isLoading } = useActivityFeed(limit);
  const [filter, setFilter] = useState('all');
  
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
                    label={type}
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
                  showDetails={showDetails}
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
export const CompactActivityFeed = ({ limit = 10, maxHeight = 300 }) => {
  return (
    <ActivityFeed
      limit={limit}
      showHeader={false}
      maxHeight={maxHeight}
      showDetails={false}
      showBadge={false}
    />
  );
};

// Activity feed with detailed view
export const DetailedActivityFeed = ({ limit = 50 }) => {
  return (
    <ActivityFeed
      limit={limit}
      showHeader={true}
      maxHeight={600}
      showDetails={true}
      showBadge={true}
      title="Activity Log"
    />
  );
};

export default ActivityFeed;