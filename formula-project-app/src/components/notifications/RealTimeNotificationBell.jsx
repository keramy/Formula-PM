/**
 * Real-Time Notification Bell Component
 * Enhanced notification system with Socket.IO integration and real-time updates
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Fade,
  Tooltip,
  Stack,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  MdNotifications as NotificationsIcon,
  MdNotificationsNone as NotificationsNoneIcon,
  MdCheck as CheckIcon,
  MdClear as ClearIcon,
  MdSettings as SettingsIcon,
  MdMarkEmailRead as MarkAllReadIcon,
  MdRefresh as RefreshIcon,
  MdCircle as UnreadDotIcon,
  MdTask as TaskIcon,
  MdProject as ProjectIcon,
  MdPerson as PersonIcon,
  MdComment as CommentIcon,
  MdWarning as WarningIcon,
  MdInfo as InfoIcon,
  MdUpdate as UpdateIcon
} from 'react-icons/md';
import { useSocket, useSocketEvent } from '../../hooks/useSocket';
import apiService from '../../services/api/apiService';
import { formatDistanceToNow } from 'date-fns';

const RealTimeNotificationBell = () => {
  const { isReady, socketService } = useSocket();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef(null);
  const open = Boolean(anchorEl);

  // Load initial notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await apiService.getNotifications(20, 0);
        setNotifications(data.notifications || []);
        
        // Count unread notifications
        const unread = (data.notifications || []).filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Handle real-time notification reception
  useSocketEvent('notification_received', useCallback((newNotification) => {
    console.log('Real-time notification received:', newNotification);
    
    setNotifications(prev => {
      // Check if notification already exists
      const exists = prev.find(n => n.id === newNotification.id);
      if (exists) return prev;
      
      // Add new notification to the top
      return [newNotification, ...prev];
    });
    
    // Increment unread count
    setUnreadCount(prev => prev + 1);
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title || 'New Notification', {
        body: newNotification.message,
        icon: '/logo192.png',
        tag: newNotification.id
      });
    }
  }, []), []);

  // Handle activity updates as notifications
  useSocketEvent('activity_update', useCallback((activity) => {
    if (activity.user?.id !== 'current-user-id') { // Don't notify for own actions
      const notification = {
        id: `activity-${Date.now()}`,
        type: 'activity_update',
        title: `${activity.type} updated`,
        message: `${activity.user?.firstName} ${activity.user?.lastName} updated a ${activity.type}`,
        data: activity,
        read: false,
        createdAt: activity.timestamp || new Date().toISOString(),
        fromUser: activity.user
      };
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  }, []), []);

  // Handle user presence updates
  useSocketEvent('user_presence', useCallback((presenceData) => {
    if (presenceData.status === 'online' && presenceData.userId !== 'current-user-id') {
      const notification = {
        id: `presence-${presenceData.userId}-${Date.now()}`,
        type: 'user_online',
        title: 'User Online',
        message: `${presenceData.user?.firstName} ${presenceData.user?.lastName} is now online`,
        data: presenceData,
        read: false,
        createdAt: new Date().toISOString(),
        fromUser: presenceData.user,
        priority: 'low'
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep only 20 notifications
      setUnreadCount(prev => prev + 1);
    }
  }, []), []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarking(true);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      await Promise.all(
        unreadNotifications.map(n => apiService.markNotificationRead(n.id))
      );
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    } finally {
      setMarking(false);
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = { fontSize: 'small' };
    
    switch (type) {
      case 'task_assigned':
      case 'task_updated':
      case 'task_completed':
        return <TaskIcon {...iconProps} />;
      case 'project_updated':
        return <ProjectIcon {...iconProps} />;
      case 'user_online':
      case 'user_joined_project':
        return <PersonIcon {...iconProps} />;
      case 'mention':
      case 'comment':
        return <CommentIcon {...iconProps} />;
      case 'activity_update':
        return <UpdateIcon {...iconProps} />;
      case 'warning':
        return <WarningIcon {...iconProps} />;
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'error';
    if (priority === 'medium') return 'warning';
    
    switch (type) {
      case 'task_completed':
        return 'success';
      case 'task_assigned':
        return 'primary';
      case 'warning':
        return 'error';
      case 'mention':
        return 'secondary';
      case 'user_online':
        return 'success';
      default:
        return 'info';
    }
  };

  const getTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  const formatNotificationContent = (notification) => {
    const { type, data, message, title } = notification;
    
    if (message) return message;
    if (title) return title;
    
    switch (type) {
      case 'task_assigned':
        return `You've been assigned to task: ${data?.taskName || 'Unknown task'}`;
      case 'task_updated':
        return `Task updated: ${data?.taskName || 'Unknown task'}`;
      case 'task_completed':
        return `Task completed: ${data?.taskName || 'Unknown task'}`;
      case 'project_updated':
        return `Project updated: ${data?.projectName || 'Unknown project'}`;
      case 'mention':
        return `You were mentioned by ${data?.mentionedBy || 'someone'}`;
      case 'user_online':
        return `${notification.fromUser?.firstName || 'Someone'} is now online`;
      case 'user_joined_project':
        return `${notification.fromUser?.firstName || 'Someone'} joined the project`;
      case 'activity_update':
        return `${notification.fromUser?.firstName || 'Someone'} updated a ${data?.type || 'resource'}`;
      default:
        return 'You have a new notification';
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>

      <Tooltip title={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}>
        <IconButton
          onClick={handleClick}
          color="inherit"
          sx={{
            position: 'relative',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error" 
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                  },
                }
              }
            }}
          >
            {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
          </Badge>
          
          {/* Connection status indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isReady ? 'success.main' : 'warning.main',
              border: '1px solid white'
            }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            overflow: 'visible'
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {/* Header */}
        <Paper sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Notifications
              {isReady && (
                <Chip 
                  label="Live" 
                  size="small" 
                  color="success" 
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Typography>
            <Stack direction="row" spacing={1}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={handleMarkAllAsRead}
                  disabled={marking}
                  startIcon={marking ? <RefreshIcon className="animate-spin" /> : <MarkAllReadIcon />}
                  sx={{ fontSize: '0.8rem' }}
                >
                  Mark all read
                </Button>
              )}
              <IconButton size="small">
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
          {unreadCount > 0 && (
            <Typography variant="body2" color="textSecondary">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Typography>
          )}
          {marking && <LinearProgress sx={{ mt: 1 }} />}
        </Paper>

        {/* Notifications List */}
        <Box sx={{ maxHeight: 450, overflowY: 'auto' }}>
          {loading ? (
            <Box p={3} textAlign="center">
              <Typography color="textSecondary">Loading notifications...</Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box p={3} textAlign="center">
              <NotificationsNoneIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
              <Typography color="textSecondary">
                No notifications yet
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {isReady ? 'You\'ll receive real-time notifications here' : 'Connecting to real-time updates...'}
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.slice(0, 15).map((notification, index) => (
                <Fade key={notification.id} in timeout={300 + index * 50}>
                  <Box>
                    <ListItem
                      button
                      onClick={() => handleMarkAsRead(notification.id)}
                      sx={{
                        backgroundColor: notification.read ? 'transparent' : 'action.hover',
                        borderLeft: notification.read ? 0 : 3,
                        borderColor: `${getNotificationColor(notification.type, notification.priority)}.main`,
                        '&:hover': {
                          backgroundColor: 'action.selected'
                        },
                        py: 1.5
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={notification.fromUser?.avatar}
                          sx={{
                            bgcolor: `${getNotificationColor(notification.type, notification.priority)}.light`,
                            color: `${getNotificationColor(notification.type, notification.priority)}.dark`,
                            width: 40,
                            height: 40
                          }}
                        >
                          {notification.fromUser?.firstName?.charAt(0) || getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography 
                              variant="body2"
                              sx={{ 
                                fontWeight: notification.read ? 400 : 600,
                                flex: 1,
                                lineHeight: 1.3
                              }}
                            >
                              {formatNotificationContent(notification)}
                            </Typography>
                            {!notification.read && (
                              <UnreadDotIcon 
                                sx={{ 
                                  fontSize: 10, 
                                  color: 'primary.main',
                                  flexShrink: 0
                                }} 
                              />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
                            <Typography variant="caption" color="textSecondary">
                              {getTimeAgo(notification.createdAt)}
                            </Typography>
                            {notification.priority && notification.priority !== 'low' && (
                              <Chip
                                label={notification.priority}
                                size="small"
                                color={getNotificationColor(notification.type, notification.priority)}
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.65rem' }}
                              />
                            )}
                          </Stack>
                        }
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                        >
                          {notification.read ? <CheckIcon fontSize="small" color="success" /> : <ClearIcon fontSize="small" />}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    {index < Math.min(notifications.length, 15) - 1 && <Divider variant="inset" />}
                  </Box>
                </Fade>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 15 && (
          <Paper sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button fullWidth size="small" onClick={handleClose}>
              View All Notifications ({notifications.length})
            </Button>
          </Paper>
        )}
      </Menu>
    </>
  );
};

export default RealTimeNotificationBell;