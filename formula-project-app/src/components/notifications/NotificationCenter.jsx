/**
 * Notification Center
 * Real-time notifications with Socket.IO integration
 */

import React, { useState, useEffect } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Settings as SettingsIcon,
  Task as TaskIcon,
  Update as UpdateIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNotifications, useSocketEvent } from '../../hooks/useSocket';
import apiService from '../../services/api/apiService';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const open = Boolean(anchorEl);

  // Load initial notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await apiService.getNotifications(20, 0);
        setAllNotifications(data.notifications || []);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Merge real-time notifications with loaded ones
  useEffect(() => {
    if (notifications.length > 0) {
      setAllNotifications(prev => {
        const newNotifications = notifications.filter(
          notif => !prev.some(existing => existing.id === notif.id)
        );
        return [...newNotifications, ...prev];
      });
    }
  }, [notifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationRead(notificationId);
      markAsRead(notificationId);
      setAllNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = allNotifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => apiService.markNotificationRead(n.id))
      );
      
      unreadNotifications.forEach(n => markAsRead(n.id));
      setAllNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
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
        return <UpdateIcon {...iconProps} />;
      case 'mention':
        return <CommentIcon {...iconProps} />;
      case 'user_joined':
        return <PersonIcon {...iconProps} />;
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
    const { type, data, message } = notification;
    
    if (message) return message;
    
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
      case 'user_joined':
        return `${data?.userName || 'Someone'} joined the project`;
      default:
        return 'You have a new notification';
    }
  };

  const totalUnread = allNotifications.filter(n => !n.read).length;

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleClick}
          color="inherit"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Badge badgeContent={totalUnread} color="error" max={99}>
            {totalUnread > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
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
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Notifications
            </Typography>
            <Box display="flex" gap={1}>
              {totalUnread > 0 && (
                <Button
                  size="small"
                  onClick={handleMarkAllAsRead}
                  startIcon={<CheckIcon />}
                >
                  Mark all read
                </Button>
              )}
              <IconButton size="small">
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>
          {totalUnread > 0 && (
            <Typography variant="body2" color="textSecondary">
              {totalUnread} unread notification{totalUnread !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading ? (
            <Box p={3} textAlign="center">
              <Typography color="textSecondary">Loading notifications...</Typography>
            </Box>
          ) : allNotifications.length === 0 ? (
            <Box p={3} textAlign="center">
              <NotificationsNoneIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
              <Typography color="textSecondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {allNotifications.slice(0, 10).map((notification, index) => (
                <Fade key={notification.id} in timeout={300}>
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
                        }
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
                          {notification.fromUser?.name?.charAt(0) || getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography 
                              variant="body2"
                              sx={{ 
                                fontWeight: notification.read ? 400 : 600,
                                flex: 1
                              }}
                            >
                              {formatNotificationContent(notification)}
                            </Typography>
                            {!notification.read && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main'
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                            <Typography variant="caption" color="textSecondary">
                              {getTimeAgo(notification.createdAt)}
                            </Typography>
                            {notification.priority && notification.priority !== 'low' && (
                              <Chip
                                label={notification.priority}
                                size="small"
                                color={getNotificationColor(notification.type, notification.priority)}
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
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
                          {notification.read ? <CheckIcon fontSize="small" /> : <ClearIcon fontSize="small" />}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    {index < allNotifications.length - 1 && <Divider variant="inset" />}
                  </Box>
                </Fade>
              ))}
            </List>
          )}
        </Box>

        {allNotifications.length > 10 && (
          <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button fullWidth size="small" onClick={handleClose}>
              View All Notifications
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter;