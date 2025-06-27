/**
 * Real-time Activity Feed
 * Shows live project activities and updates
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Badge,
  Fade,
  Collapse
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Update as UpdateIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  FilePresent as FileIcon,
  Notifications as NotificationIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { useSocketEvent } from '../../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';

const RealtimeActivityFeed = ({ 
  projectId, 
  maxItems = 50,
  showTimestamps = true,
  compact = false 
}) => {
  const [activities, setActivities] = useState([]);
  const [newActivityCount, setNewActivityCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const feedRef = useRef(null);
  const lastViewedRef = useRef(Date.now());

  // Auto-scroll to bottom when new activities arrive
  const scrollToBottom = () => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  };

  // Add new activity to the feed
  const addActivity = (activity) => {
    const activityWithId = {
      ...activity,
      id: activity.id || Date.now() + Math.random(),
      timestamp: activity.timestamp || new Date().toISOString(),
      isNew: Date.now() - lastViewedRef.current < 1000
    };

    setActivities(prev => {
      const updated = [activityWithId, ...prev.slice(0, maxItems - 1)];
      return updated;
    });

    if (!isVisible) {
      setNewActivityCount(count => count + 1);
    }

    // Auto-scroll if user is at bottom
    setTimeout(() => {
      if (feedRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
        if (isAtBottom) {
          scrollToBottom();
        }
      }
    }, 100);
  };

  // Subscribe to real-time events
  useSocketEvent('project:updated', (data) => {
    if (data.projectId === projectId) {
      addActivity({
        type: 'project_updated',
        user: data.user,
        description: `Updated project: ${data.changes.join(', ')}`,
        icon: UpdateIcon,
        color: 'primary',
        data: data
      });
    }
  });

  useSocketEvent('task:created', (data) => {
    if (data.projectId === projectId) {
      addActivity({
        type: 'task_created',
        user: data.user,
        description: `Created task: ${data.task.name}`,
        icon: TaskIcon,
        color: 'success',
        data: data
      });
    }
  });

  useSocketEvent('task:updated', (data) => {
    if (data.projectId === projectId) {
      addActivity({
        type: 'task_updated',
        user: data.user,
        description: `Updated task: ${data.task.name}`,
        subtitle: data.changes?.join(', '),
        icon: TaskIcon,
        color: 'info',
        data: data
      });
    }
  });

  useSocketEvent('scope:updated', (data) => {
    if (data.projectId === projectId) {
      addActivity({
        type: 'scope_updated',
        user: data.user,
        description: `Updated project scope`,
        subtitle: data.itemName || 'Scope changes',
        icon: FileIcon,
        color: 'warning',
        data: data
      });
    }
  });

  useSocketEvent('collaboration:user_joined', (data) => {
    if (data.projectId === projectId) {
      addActivity({
        type: 'user_joined',
        user: data.user,
        description: `Joined the project`,
        icon: PersonIcon,
        color: 'success',
        data: data
      });
    }
  });

  useSocketEvent('collaboration:user_left', (data) => {
    if (data.projectId === projectId) {
      addActivity({
        type: 'user_left',
        user: data.user,
        description: `Left the project`,
        icon: PersonIcon,
        color: 'default',
        data: data
      });
    }
  });

  useSocketEvent('mention:created', (data) => {
    if (data.projectId === projectId) {
      addActivity({
        type: 'mention_created',
        user: data.user,
        description: `Mentioned ${data.mentionedUser?.name || 'someone'}`,
        subtitle: data.context || '',
        icon: CommentIcon,
        color: 'secondary',
        data: data
      });
    }
  });

  // Track visibility for new activity count
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setNewActivityCount(0);
          lastViewedRef.current = Date.now();
        }
      },
      { threshold: 0.1 }
    );

    if (feedRef.current) {
      observer.observe(feedRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getActivityIcon = (activity) => {
    const IconComponent = activity.icon || UpdateIcon;
    return <IconComponent color={activity.color || 'default'} />;
  };

  const getTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  if (compact) {
    return (
      <Box>
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="subtitle2" color="textSecondary">
            Live Activity
          </Typography>
          <Badge badgeContent={newActivityCount} color="error">
            <IconButton 
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Badge>
        </Box>
        
        <Collapse in={isExpanded}>
          <Box
            ref={feedRef}
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '2px'
              }
            }}
          >
            {activities.slice(0, 10).map((activity, index) => (
              <Fade key={activity.id} in timeout={300}>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap={1} 
                  py={0.5}
                  sx={{
                    borderLeft: activity.isNew ? 2 : 0,
                    borderColor: 'primary.main',
                    pl: activity.isNew ? 1 : 0,
                    opacity: index > 5 ? 0.7 : 1
                  }}
                >
                  <Avatar sx={{ width: 20, height: 20 }}>
                    {getActivityIcon(activity)}
                  </Avatar>
                  <Box flex={1} minWidth={0}>
                    <Typography 
                      variant="caption" 
                      noWrap
                      sx={{ fontWeight: activity.isNew ? 600 : 400 }}
                    >
                      {activity.user?.name} {activity.description}
                    </Typography>
                    {showTimestamps && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        {getTimeAgo(activity.timestamp)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Fade>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            Live Activity Feed
          </Typography>
          <Badge badgeContent={newActivityCount} color="error">
            <NotificationIcon color="action" />
          </Badge>
        </Box>

        <Box
          ref={feedRef}
          sx={{
            maxHeight: 400,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px'
            }
          }}
        >
          {activities.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="textSecondary">
                No recent activity
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {activities.map((activity, index) => (
                <Fade key={activity.id} in timeout={300}>
                  <Box>
                    <ListItem
                      sx={{
                        borderLeft: activity.isNew ? 3 : 0,
                        borderColor: 'primary.main',
                        backgroundColor: activity.isNew ? 'action.hover' : 'transparent',
                        mb: 1,
                        borderRadius: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={activity.user?.avatar}
                          sx={{ 
                            bgcolor: `${activity.color || 'primary'}.light`,
                            color: `${activity.color || 'primary'}.dark`
                          }}
                        >
                          {activity.user?.name?.charAt(0) || getActivityIcon(activity)}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography 
                              variant="body2"
                              sx={{ fontWeight: activity.isNew ? 600 : 400 }}
                            >
                              <strong>{activity.user?.name}</strong> {activity.description}
                            </Typography>
                            {activity.isNew && (
                              <Chip 
                                label="New" 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            {activity.subtitle && (
                              <Typography variant="body2" color="textSecondary">
                                {activity.subtitle}
                              </Typography>
                            )}
                            {showTimestamps && (
                              <Typography variant="caption" color="textSecondary">
                                {getTimeAgo(activity.timestamp)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <CircleIcon 
                          sx={{ 
                            fontSize: 8,
                            color: activity.isNew ? 'primary.main' : 'action.disabled'
                          }} 
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    {index < activities.length - 1 && <Divider variant="inset" />}
                  </Box>
                </Fade>
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RealtimeActivityFeed;