import React from 'react';
import {
  Box,
  Avatar,
  AvatarGroup,
  Tooltip,
  Badge,
  Typography,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Collapse
} from '@mui/material';
import {
  MdCircle as Circle,
  MdExpandMore as ExpandMore,
  MdExpandLess as ExpandLess,
  MdPerson as Person,
  MdPersonOff as PersonOff
} from 'react-icons/md';
import { usePresence } from '../../hooks/useRealTime';
import { formatDistanceToNow } from 'date-fns';

// Status indicator colors
const getStatusPalette = (status) => {
  switch (status) {
    case 'online':
      return '#4caf50'; // Green
    case 'away':
      return '#ff9800'; // Orange
    case 'busy':
      return '#f44336'; // Red
    case 'offline':
    default:
      return '#9e9e9e'; // Gray
  }
};

// User avatar with presence indicator
const PresenceAvatar = ({ user, size = 40, showTooltip = true }) => {
  const statusPalette = getStatusPalette(user.status);
  
  const avatar = (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <Circle 
          sx={{ 
            color: statusPalette,
            fontSize: size * 0.3,
            border: '2px solid white',
            borderRadius: '50%',
            backgroundColor: 'white'
          }} 
        />
      }
    >
      <Avatar
        sx={{ width: size, height: size }}
        src={user.avatarUrl}
        alt={user.userName}
      >
        {user.userName?.charAt(0).toUpperCase()}
      </Avatar>
    </Badge>
  );

  if (!showTooltip) return avatar;

  const lastActivity = user.lastActivity 
    ? formatDistanceToNow(new Date(user.lastActivity), { addSuffix: true })
    : 'Unknown';

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2">{user.userName}</Typography>
          <Typography variant="caption" display="block">
            Status: {user.status}
          </Typography>
          <Typography variant="caption" display="block">
            Last active: {lastActivity}
          </Typography>
          {user.email && (
            <Typography variant="caption" display="block">
              {user.email}
            </Typography>
          )}
        </Box>
      }
      arrow
    >
      {avatar}
    </Tooltip>
  );
};

// Compact presence indicator showing online users
export const CompactPresenceIndicator = ({ maxVisible = 5 }) => {
  const { onlineUsers } = usePresence();

  if (onlineUsers.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonOff fontSize="small" color="disabled" />
        <Typography variant="caption" color="textSecondary">
          No one online
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AvatarGroup max={maxVisible} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
        {onlineUsers.map((user) => (
          <PresenceAvatar key={user.userId} user={user} size={32} />
        ))}
      </AvatarGroup>
      
      {onlineUsers.length > 0 && (
        <Chip
          label={`${onlineUsers.length} online`}
          size="small"
          color="success"
          variant="outlined"
          sx={{ fontSize: '0.7rem', height: '20px' }}
        />
      )}
    </Box>
  );
};

// Detailed presence list
export const DetailedPresenceList = ({ showOfflineUsers = false }) => {
  const { users, onlineUsers } = usePresence();
  const [showOffline, setShowOffline] = React.useState(false);

  const displayUsers = showOfflineUsers ? users : onlineUsers;
  const offlineUsers = users.filter(user => user.status === 'offline');

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Team Presence
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`${onlineUsers.length} online`}
            size="small"
            color="success"
            variant={showOfflineUsers ? "outlined" : "filled"}
          />
          {offlineUsers.length > 0 && (
            <Chip
              label={`${offlineUsers.length} offline`}
              size="small"
              color="default"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {onlineUsers.map((user) => (
          <ListItem key={user.userId} sx={{ px: 0 }}>
            <ListItemAvatar>
              <PresenceAvatar user={user} showTooltip={false} />
            </ListItemAvatar>
            <ListItemText
              primary={user.userName}
              secondary={
                <Box>
                  <Typography variant="caption" display="block">
                    {user.email}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={user.status}
                      size="small"
                      color="success"
                      sx={{ fontSize: '0.65rem', height: '18px' }}
                    />
                    {user.lastActivity && (
                      <Typography variant="caption" color="textSecondary">
                        Active {formatDistanceToNow(new Date(user.lastActivity), { addSuffix: true })}
                      </Typography>
                    )}
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}

        {showOfflineUsers && offlineUsers.length > 0 && (
          <>
            <ListItem sx={{ px: 0, py: 1 }}>
              <IconButton
                size="small"
                onClick={() => setShowOffline(!showOffline)}
                sx={{ mr: 1 }}
              >
                {showOffline ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
              <Typography variant="body2" color="textSecondary">
                Offline Users ({offlineUsers.length})
              </Typography>
            </ListItem>

            <Collapse in={showOffline} timeout="auto" unmountOnExit>
              {offlineUsers.map((user) => (
                <ListItem key={user.userId} sx={{ px: 0, pl: 4, opacity: 0.6 }}>
                  <ListItemAvatar>
                    <PresenceAvatar user={user} showTooltip={false} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.userName}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {user.email}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip
                            label="offline"
                            size="small"
                            color="default"
                            sx={{ fontSize: '0.65rem', height: '18px' }}
                          />
                          {user.lastActivity && (
                            <Typography variant="caption" color="textSecondary">
                              Last seen {formatDistanceToNow(new Date(user.lastActivity), { addSuffix: true })}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </Collapse>
          </>
        )}
      </List>

      {displayUsers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <PersonOff fontSize="large" color="disabled" />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            No users found
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Typing indicator
export const TypingIndicator = () => {
  const { typingUsers } = usePresence();

  if (typingUsers.length === 0) return null;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      py: 1, 
      px: 2,
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      borderRadius: 1,
      animation: 'pulse 1.5s infinite'
    }}>
      <Circle sx={{ color: 'primary.main', fontSize: 8 }} />
      <Typography variant="caption" color="primary.main">
        {typingUsers.length === 1 
          ? `${typingUsers[0].userName} is typing...`
          : `${typingUsers.map(u => u.userName).join(', ')} are typing...`
        }
      </Typography>
    </Box>
  );
};

// Real-time user counter for header/navbar
export const UserCounter = () => {
  const { onlineUsers } = usePresence();

  return (
    <Tooltip title={`${onlineUsers.length} users online`}>
      <Chip
        icon={<Person />}
        label={onlineUsers.length}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ cursor: 'pointer' }}
      />
    </Tooltip>
  );
};

export default {
  PresenceAvatar,
  CompactPresenceIndicator,
  DetailedPresenceList,
  TypingIndicator,
  UserCounter
};