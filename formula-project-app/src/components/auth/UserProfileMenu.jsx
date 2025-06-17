import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
  Dashboard,
  AdminPanelSettings,
  Business
} from '@mui/icons-material';
import { useAuth, USER_ROLES } from '../../context/AuthContext';

const UserProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return '#f44336';
      case USER_ROLES.CO_FOUNDER:
        return '#9c27b0';
      case USER_ROLES.PROJECT_MANAGER:
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Admin';
      case USER_ROLES.CO_FOUNDER:
        return 'Co-founder';
      case USER_ROLES.PROJECT_MANAGER:
        return 'Project Manager';
      default:
        return 'User';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <AdminPanelSettings fontSize="small" />;
      case USER_ROLES.CO_FOUNDER:
        return <Dashboard fontSize="small" />;
      case USER_ROLES.PROJECT_MANAGER:
        return <AccountCircle fontSize="small" />;
      default:
        return <AccountCircle fontSize="small" />;
    }
  };

  if (!user) return null;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: getRoleColor(user.role),
            fontSize: '0.875rem'
          }}
        >
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 280,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: getRoleColor(user.role)
              }}
            >
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={getRoleIcon(user.role)}
            label={getRoleLabel(user.role)}
            size="small"
            sx={{
              bgcolor: getRoleColor(user.role),
              color: 'white',
              fontWeight: 500
            }}
          />
        </Box>

        {/* Menu Items */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfileMenu;