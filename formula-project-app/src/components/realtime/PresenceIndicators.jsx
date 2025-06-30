/**
 * Presence Indicators Component
 * Real-time user presence, typing indicators, and collaborative features
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Avatar,
  Tooltip,
  Stack,
  Chip,
  Typography,
  Paper,
  Badge,
  AvatarGroup,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import {
  MdCircle as OnlineIcon,
  MdEdit as TypingIcon,
  MdRemoveRedEye as ViewingIcon,
  MdPerson as PersonIcon
} from 'react-icons/md';
import { useSocket, useSocketEvent } from '../../hooks/useSocket';

// Individual user presence indicator
const UserPresenceIndicator = ({ 
  user, 
  showName = false, 
  size = 'medium',
  showStatus = true,
  onClick
}) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [activity, setActivity] = useState('');

  // Listen for user presence updates
  useSocketEvent('user_presence', useCallback((presenceData) => {
    if (presenceData.userId === user?.id) {
      setIsOnline(presenceData.status === 'online');
      setLastSeen(new Date(presenceData.timestamp));
      setActivity(presenceData.activity || '');
    }
  }, [user?.id]), [user?.id]);

  if (!user) return null;

  const getAvatarSize = () => {
    switch (size) {
      case 'small': return { width: 32, height: 32 };
      case 'large': return { width: 56, height: 56 };
      default: return { width: 40, height: 40 };
    }
  };

  const getStatusIcon = () => {
    if (!showStatus) return null;
    
    return (
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: size === 'small' ? 10 : 14,
          height: size === 'small' ? 10 : 14,
          borderRadius: '50%',
          bgcolor: isOnline ? 'success.main' : 'grey.400',
          border: '2px solid white',
          ...(isOnline && {
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.7, transform: 'scale(1.1)' },
              '100%': { opacity: 1, transform: 'scale(1)' }
            }
          })
        }}
      />
    );
  };

  const getTooltipContent = () => {
    const status = isOnline ? 'Online' : 'Offline';
    const name = `${user.firstName} ${user.lastName}`;
    const lastSeenText = lastSeen && !isOnline 
      ? ` (last seen ${lastSeen.toLocaleTimeString()})`
      : '';
    const activityText = activity ? ` - ${activity}` : '';
    
    return `${name} - ${status}${lastSeenText}${activityText}`;
  };

  return (
    <Tooltip title={getTooltipContent()} arrow>
      <Box
        sx={{
          position: 'relative',
          cursor: onClick ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          gap: showName ? 1 : 0
        }}
        onClick={onClick}
      >
        <Avatar
          src={user.avatar}
          sx={{
            ...getAvatarSize(),
            transition: 'all 0.3s ease',
            ...(onClick && {
              '&:hover': {
                transform: 'scale(1.1)'
              }
            })
          }}
        >
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </Avatar>
        {getStatusIcon()}
        
        {showName && (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <OnlineIcon 
                sx={{ 
                  fontSize: 12, 
                  color: isOnline ? 'success.main' : 'grey.400' 
                }} 
              />
              <Typography variant="caption" color="textSecondary">
                {isOnline ? 'Online' : 'Offline'}
              </Typography>
            </Stack>
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};

// Typing indicator component
const TypingIndicator = ({ location, projectId }) => {
  const [typingUsers, setTypingUsers] = useState([]);

  // Listen for typing events
  useSocketEvent('user_typing', useCallback((data) => {
    if (data.location === location) {
      setTypingUsers(prev => {
        if (data.action === 'start') {
          const exists = prev.find(u => u.userId === data.userId);
          if (exists) return prev;
          return [...prev, data];
        } else {
          return prev.filter(u => u.userId !== data.userId);
        }
      });
    }
  }, [location]), [location]);

  // Clear typing indicators after 5 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setTypingUsers([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [typingUsers]);

  if (typingUsers.length === 0) return null;

  return (
    <Fade in>
      <Paper 
        sx={{ 
          p: 1, 
          backgroundColor: 'action.hover',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <TypingIcon sx={{ fontSize: 16, color: 'primary.main' }} />
        <Typography variant="caption" color="textSecondary">
          {typingUsers.length === 1 
            ? `${typingUsers[0].user.firstName} is typing...`
            : `${typingUsers.length} people are typing...`
          }
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '2px',
            '& > div': {
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              animation: 'bounce 1.4s ease-in-out infinite both',
              '&:nth-of-type(1)': { animationDelay: '-0.32s' },
              '&:nth-of-type(2)': { animationDelay: '-0.16s' }
            },
            '@keyframes bounce': {
              '0%, 80%, 100%': { transform: 'scale(0)' },
              '40%': { transform: 'scale(1)' }
            }
          }}
        >
          <div />
          <div />
          <div />
        </Box>
      </Paper>
    </Fade>
  );
};

// Online users list component
const OnlineUsersList = ({ 
  projectId = null, 
  maxUsers = 8, 
  compact = false,
  onUserClick
}) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Listen for presence updates
  useSocketEvent('user_presence', useCallback((presenceData) => {
    setOnlineUsers(prev => {
      if (presenceData.status === 'online') {
        const exists = prev.find(u => u.id === presenceData.userId);
        if (exists) return prev;
        return [...prev, presenceData.user];
      } else {
        return prev.filter(u => u.id !== presenceData.userId);
      }
    });
  }, []), []);

  // Filter by project if specified
  const filteredUsers = useMemo(() => {
    return onlineUsers.slice(0, maxUsers);
  }, [onlineUsers, maxUsers]);

  if (filteredUsers.length === 0) return null;

  if (compact) {
    return (
      <AvatarGroup max={maxUsers} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
        {filteredUsers.map((user) => (
          <UserPresenceIndicator
            key={user.id}
            user={user}
            size="small"
            onClick={() => onUserClick?.(user)}
          />
        ))}
      </AvatarGroup>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Online Now ({filteredUsers.length})
      </Typography>
      <Stack spacing={2}>
        {filteredUsers.map((user) => (
          <UserPresenceIndicator
            key={user.id}
            user={user}
            showName
            onClick={() => onUserClick?.(user)}
          />
        ))}
      </Stack>
    </Paper>
  );
};

// Export all components
export {
  UserPresenceIndicator,
  TypingIndicator,
  OnlineUsersList
};

// Main presence indicators component
const PresenceIndicators = {
  UserPresenceIndicator,
  TypingIndicator,
  OnlineUsersList
};

export default PresenceIndicators;