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
  ClipboardCheck as TaskIcon,
  Refresh as UpdateIcon,
  User as PersonIcon,
  ChatBubble as CommentIcon,
  Page as FileIcon,
  Bell as NotificationIcon,
  NavArrowDown as ExpandMoreIcon,
  NavArrowUp as ExpandLessIcon,
  Dot as CircleIcon
} from 'iconoir-react';
// import { useSocketEvent } from '../../hooks/useSocket';
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

  // Subscribe to real-time events (mock implementation for development)
  // Real socket events would be implemented here in production
  useEffect(() => {
    // Simulate real-time activity updates for development
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new activity
        const mockActivity = {
          type: 'task_updated',
          user: { name: 'Development User' },
          description: 'Updated task status to in progress',
          icon: TaskIcon,
          color: 'info'
        };
        addActivity(mockActivity);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

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
                backgroundPalette: 'rgba(0,0,0,0.2)',
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
                    borderPalette: 'primary.main',
                    pl: activity.isNew ? 1 : 0,
                    opacity: index > 5 ? 0.7 : 1
                  }}
                >
                  <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.light' }}>
                    {React.cloneElement(getActivityIcon(activity), { sx: { fontSize: 12 } })}
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
              backgroundPalette: 'rgba(0,0,0,0.2)',
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
                        borderPalette: 'primary.main',
                        backgroundPalette: activity.isNew ? 'action.hover' : 'transparent',
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
                          {activity.user?.name?.charAt(0) || React.cloneElement(getActivityIcon(activity), { sx: { fontSize: 16 } })}
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