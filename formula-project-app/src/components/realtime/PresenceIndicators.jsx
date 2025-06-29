/**
 * Real-time Presence Indicators
 * Shows who's currently online and active in projects
 */

import React, { useState, useEffect } from 'react';
import {
  Avatar,
  AvatarGroup,
  Chip,
  Tooltip,
  Box,
  Typography,
  Badge,
  Paper,
  Stack,
  IconButton
} from '@mui/material';
import {
  Circle as CircleIcon,
  Eye as VisibilityIcon,
  Edit as EditIcon,
  Chat as ChatIcon
} from 'iconoir-react';
import { usePresence, useSocketEvent } from '../../hooks/useSocket';

const PresenceIndicators = ({ 
  projectId, 
  location = 'project',
  showDetails = false,
  maxVisible = 5 
}) => {
  const { onlineUsers, updateActivity } = usePresence(`${location}:${projectId}`);
  const [activeUsers, setActiveUsers] = useState([]);
  const [userActivities, setUserActivities] = useState({});

  // Filter users for current project/location
  useEffect(() => {
    if (onlineUsers && projectId) {
      const projectUsers = onlineUsers.filter(user => 
        user.location?.includes(projectId) || 
        user.projectId === projectId
      );
      setActiveUsers(projectUsers);
    }
  }, [onlineUsers, projectId]);

  // Subscribe to user activity updates
  useSocketEvent('collaboration:user_joined', (data) => {
    if (data.projectId === projectId) {
      updateActivity('joined_project');
    }
  });

  useSocketEvent('collaboration:user_left', (data) => {
    if (data.projectId === projectId) {
      setActiveUsers(prev => prev.filter(user => user.id !== data.userId));
    }
  });

  useSocketEvent('collaboration:typing', (data) => {
    if (data.projectId === projectId) {
      setUserActivities(prev => ({
        ...prev,
        [data.userId]: {
          type: 'typing',
          location: data.location,
          timestamp: data.timestamp
        }
      }));

      // Clear typing indicator after 3 seconds
      setTimeout(() => {
        setUserActivities(prev => {
          const updated = { ...prev };
          if (updated[data.userId]?.type === 'typing') {
            delete updated[data.userId];
          }
          return updated;
        });
      }, 3000);
    }
  });

  const getStatusPalette = (user) => {
    const activity = userActivities[user.id];
    if (activity?.type === 'typing') return 'warning';
    
    switch (user.status) {
      case 'active': return 'success';
      case 'idle': return 'warning';
      case 'busy': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (user) => {
    const activity = userActivities[user.id];
    if (activity?.type === 'typing') return <EditIcon fontSize="small" />;
    
    switch (user.activity) {
      case 'viewing': return <VisibilityIcon fontSize="small" />;
      case 'editing': return <EditIcon fontSize="small" />;
      case 'commenting': return <ChatIcon fontSize="small" />;
      default: return <CircleIcon fontSize="small" />;
    }
  };

  const getTooltipContent = (user) => {
    const activity = userActivities[user.id];
    const lastSeen = user.lastSeen ? new Date(user.lastSeen) : null;
    const timeAgo = lastSeen ? getTimeAgo(lastSeen) : 'Unknown';

    return (
      <Box>
        <Typography variant="subtitle2">{user.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {user.role || 'Team Member'}
        </Typography>
        {activity && (
          <Typography variant="body2" color="primary">
            {activity.type === 'typing' ? 'Typing...' : user.activity}
          </Typography>
        )}
        <Typography variant="caption" color="textSecondary">
          Last seen: {timeAgo}
        </Typography>
      </Box>
    );
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!activeUsers.length) {
    return (
      <Chip
        size="small"
        icon={<CircleIcon />}
        label="No one else here"
        variant="outlined"
        color="default"
      />
    );
  }

  if (showDetails) {
    return (
      <Paper elevation={1} sx={{ p: 2, maxWidth: 300 }}>
        <Typography variant="subtitle2" gutterBottom>
          Active Users ({activeUsers.length})
        </Typography>
        <Stack spacing={1}>
          {activeUsers.map((user) => (
            <Box key={user.id} display="flex" alignItems="center" gap={1}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: `${getStatusPalette(user)}.main`,
                      border: '2px solid white'
                    }}
                  />
                }
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.name?.charAt(0)}
                </Avatar>
              </Badge>
              <Box flex={1}>
                <Typography variant="body2" fontWeight="medium">
                  {user.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  {getStatusIcon(user)}
                  <Typography variant="caption" color="textSecondary">
                    {userActivities[user.id]?.type === 'typing' 
                      ? 'Typing...' 
                      : user.activity || 'Active'
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <AvatarGroup max={maxVisible} total={activeUsers.length}>
        {activeUsers.slice(0, maxVisible).map((user) => (
          <Tooltip key={user.id} title={getTooltipContent(user)} arrow>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: `${getStatusPalette(user)}.main`,
                    border: '2px solid white'
                  }}
                />
              }
            >
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ 
                  width: 32, 
                  height: 32,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                {user.name?.charAt(0)}
              </Avatar>
            </Badge>
          </Tooltip>
        ))}
      </AvatarGroup>
      
      {activeUsers.length > 0 && (
        <Typography variant="body2" color="textSecondary">
          {activeUsers.length === 1 
            ? `${activeUsers[0].name} is here`
            : `${activeUsers.length} people here`
          }
        </Typography>
      )}
    </Box>
  );
};

export default PresenceIndicators;