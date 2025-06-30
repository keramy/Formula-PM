/**
 * Real-Time Activity Feed Component
 * Enhanced activity feed with Socket.IO integration and live updates
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Badge,
  IconButton,
  Stack,
  Slide,
  LinearProgress
} from '@mui/material';
import {
  MdTask as TaskIcon,
  MdBusiness as BusinessIcon,
  MdChat as CommentIcon,
  MdRefresh as RefreshIcon,
  MdAdd as AddIcon,
  MdEdit as EditIcon,
  MdDelete as DeleteIcon,
  MdCheck as CheckIcon,
  MdUpdate as UpdateIcon,
  MdCircle as OnlineIcon
} from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';
import { useSocket, useSocketEvent } from '../../hooks/useSocket';
import apiService from '../../services/api/apiService';

// Activity type icons mapping with real-time indicators
const getActivityIcon = (type, action, isRealTime = false) => {
  const iconMap = {
    project: { created: <AddIcon color="primary" />, updated: <EditIcon color="info" />, deleted: <DeleteIcon color="error" /> },
    task: { created: <CheckIcon color="primary" />, updated: <EditIcon color="info" />, completed: <CheckIcon color="success" /> },
    client: { created: <BusinessIcon color="primary" />, updated: <EditIcon color="info" /> },
    comment: { added: <CommentIcon color="info" /> },
    user_presence: { online: <OnlineIcon color="success" />, offline: <OnlineIcon color="disabled" /> },
  };

  const icon = iconMap[type]?.[action] || <UpdateIcon color="info" />;
  
  if (isRealTime) {
    return (
      <Box sx={{ position: 'relative' }}>
        {icon}
        <Box
          sx={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'success.main',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.2)', opacity: 0.7 },
              '100%': { transform: 'scale(1)', opacity: 1 },
            }
          }}
        />
      </Box>
    );
  }
  
  return icon;
};

// Activity type colors
const getActivityColor = (type, action) => {
  const colorMap = {
    project: { created: 'primary', updated: 'info', deleted: 'error' },
    task: { created: 'primary', updated: 'info', completed: 'success' },
    client: { created: 'primary', updated: 'info' },
    comment: { added: 'info' },
    user_presence: { online: 'success', offline: 'default' },
  };

  return colorMap[type]?.[action] || 'default';
};

// Enhanced activity description
const getActivityDescription = (activity, isRealTime = false) => {
  const { type, action, user, data, resourceId } = activity;
  const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Someone';
  const prefix = isRealTime ? '🔴 ' : '';
  
  switch (type) {
    case 'project':
      return `${prefix}${userName} ${action} project ${data?.name || resourceId}`;
    case 'task':
      return `${prefix}${userName} ${action} task ${data?.name || resourceId}`;
    case 'client':
      return `${prefix}${userName} ${action} client ${data?.name || resourceId}`;
    case 'comment':
      return `${prefix}${userName} added a comment`;
    case 'user_presence':
      return `${prefix}${userName} is now ${action}`;
    default:
      return `${prefix}${userName} ${action} ${type} ${resourceId}`;
  }
};

// Individual activity item component
const ActivityItem = ({ activity, isRealTime = false, onActivityClick }) => {
  if (!activity || typeof activity !== 'object') {
    return null;
  }

  const timestamp = activity.timestamp || new Date().toISOString();
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  const activityType = activity.type || 'unknown';
  const activityAction = activity.action || 'updated';
  const icon = getActivityIcon(activityType, activityAction, isRealTime);
  const color = getActivityColor(activityType, activityAction);
  const description = getActivityDescription(activity, isRealTime);

  return (
    <Slide direction="down" in timeout={300}>
      <ListItem
        button={!!onActivityClick}
        onClick={() => onActivityClick?.(activity)}
        sx={{
          borderBottom: '1px solid #f0f0f0',
          '&:last-child': { borderBottom: 'none' },
          py: 1.5,
          backgroundColor: isRealTime ? 'action.hover' : 'transparent',
          '&:hover': {
            backgroundColor: isRealTime ? 'action.selected' : 'action.hover'
          },
          transition: 'background-color 0.3s ease'
        }}
      >
        <ListItemAvatar>
          <Avatar 
            sx={{ 
              bgcolor: `${color}.light`, 
              color: `${color}.main`,
              ...(isRealTime && {
                boxShadow: `0 0 10px ${color === 'success' ? '#4caf50' : '#2196f3'}`,
                animation: 'glow 2s ease-in-out infinite alternate',
                '@keyframes glow': {
                  from: { boxShadow: `0 0 5px ${color === 'success' ? '#4caf50' : '#2196f3'}` },
                  to: { boxShadow: `0 0 15px ${color === 'success' ? '#4caf50' : '#2196f3'}` }
                }
              })
            }}
          >
            {activity.user?.avatar ? (
              <img src={activity.user.avatar} alt={activity.user.firstName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              icon
            )}
          </Avatar>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{ 
                  fontWeight: isRealTime ? 600 : 400,
                  color: isRealTime ? 'primary.main' : 'text.primary'
                }}
              >
                {description}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                {isRealTime && (
                  <Chip
                    label="Live"
                    size="small"
                    color="success"
                    variant="filled"
                    sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }}
                  />
                )}
                <Chip
                  label={activityType.replace('_', ' ')}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: '20px',
                    color: '#1976d2',
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  }}
                />
              </Stack>
            </Stack>
          }
          secondary={
            <Typography variant="caption" color="textSecondary">
              {timeAgo}
            </Typography>
          }
        />
      </ListItem>
    </Slide>
  );
};

// Activity skeleton loader
const ActivitySkeleton = () => (
  <ListItem>
    <ListItemAvatar>
      <Skeleton variant="circular" width={40} height={40} animation="wave" />
    </ListItemAvatar>
    <ListItemText
      primary={<Skeleton variant="text" width="80%" animation="wave" />}
      secondary={<Skeleton variant="text" width="60%" animation="wave" />}
    />
  </ListItem>
);

// Main real-time activity feed component
const RealTimeActivityFeed = ({ 
  limit = 20, 
  showHeader = true, 
  maxHeight = 500,
  showBadge = true,
  title = "Live Activity Feed",
  projectId = null,
  onActivityClick
}) => {
  const { isReady } = useSocket();
  const [activities, setActivities] = useState([]);
  const [realtimeActivities, setRealtimeActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load initial activities
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getActivities(limit, 0);
        setActivities(data.activities || []);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [limit]);

  // Handle real-time activity updates
  useSocketEvent('activity_update', useCallback((newActivity) => {
    console.log('Real-time activity received:', newActivity);
    
    setRealtimeActivities(prev => {
      const filtered = prev.filter(a => a.id !== newActivity.id);
      return [{ ...newActivity, isRealTime: true }, ...filtered].slice(0, 10);
    });

    // Move to main activities after delay
    setTimeout(() => {
      setActivities(prev => {
        const exists = prev.find(a => a.id === newActivity.id);
        if (exists) return prev;
        return [newActivity, ...prev.slice(0, limit - 1)];
      });
      
      setRealtimeActivities(prev => prev.filter(a => a.id !== newActivity.id));
    }, 5000);

  }, [limit]), [limit]);

  // Handle global activity updates
  useSocketEvent('global_activity_update', useCallback((activity) => {
    if (!projectId || activity.projectId === projectId) {
      setRealtimeActivities(prev => {
        const exists = prev.find(a => a.id === activity.id);
        if (exists) return prev;
        return [{ ...activity, isRealTime: true }, ...prev.slice(0, 9)];
      });
    }
  }, [projectId]), [projectId]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await apiService.getActivities(limit, 0);
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Failed to refresh activities:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Combine real-time and regular activities
  const combinedActivities = useMemo(() => {
    const combined = [...realtimeActivities, ...activities];
    
    // Remove duplicates and sort by timestamp
    const unique = combined.reduce((acc, activity) => {
      if (!acc.find(a => a.id === activity.id)) {
        acc.push(activity);
      }
      return acc;
    }, []);
    
    return unique.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
  }, [realtimeActivities, activities, limit]);

  const totalActivities = combinedActivities.length;
  const realtimeCount = realtimeActivities.length;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {showHeader && (
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              {showBadge ? (
                <Badge badgeContent={totalActivities} color="primary" max={99}>
                  <Typography variant="h6">{title}</Typography>
                </Badge>
              ) : (
                <Typography variant="h6">{title}</Typography>
              )}
              {isReady && (
                <Chip 
                  label={`Live • ${realtimeCount} new`}
                  size="small" 
                  color="success" 
                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                />
              )}
              {!isReady && (
                <Chip 
                  label="Connecting..."
                  size="small" 
                  color="warning" 
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Stack>
          }
          action={
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                ...(refreshing && {
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                })
              }}
            >
              <RefreshIcon />
            </IconButton>
          }
          sx={{ pb: 1 }}
        />
      )}
      
      <CardContent sx={{ flex: 1, pt: showHeader ? 0 : 2, overflow: 'hidden' }}>
        {refreshing && <LinearProgress sx={{ mb: 1 }} />}
        
        <Box sx={{ height: maxHeight, overflow: 'auto' }}>
          {isLoading ? (
            <List>
              {Array.from({ length: 5 }).map((_, index) => (
                <ActivitySkeleton key={index} />
              ))}
            </List>
          ) : combinedActivities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <UpdateIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                No recent activity found
              </Typography>
              {isReady && (
                <Typography variant="caption" color="textSecondary">
                  Real-time updates will appear here
                </Typography>
              )}
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {combinedActivities.map((activity) => (
                <ActivityItem
                  key={`${activity.id}-${activity.timestamp}`}
                  activity={activity}
                  isRealTime={activity.isRealTime || false}
                  onActivityClick={onActivityClick}
                />
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RealTimeActivityFeed;