// components/auth/UserProfileMenu.jsx
import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Person,
  Settings,
  Logout,
  Edit,
  Close,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export const UserProfileMenu = ({ 
  anchorEl, 
  open, 
  onClose, 
  darkMode = false 
}) => {
  const { user, logout, updateUser } = useAuth();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  const handleProfileClick = () => {
    onClose();
    setProfileDialogOpen(true);
  };

  const handleSettingsClick = () => {
    onClose();
    setSettingsDialogOpen(true);
  };

  const menuStyles = {
    mt: 1.5,
    minWidth: 200,
    backgroundColor: darkMode ? '#1B2951' : '#FFFFFF',
    border: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
    '& .MuiMenuItem-root': {
      color: darkMode ? '#F5F2E8' : '#1B2951',
      '&:hover': {
        backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.1)' : 'rgba(27, 41, 81, 0.05)',
      },
    },
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        onClick={onClose}
        PaperProps={{
          elevation: 3,
          sx: menuStyles,
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: darkMode ? '#F5F2E8' : '#1B2951',
                color: darkMode ? '#1B2951' : '#F5F2E8',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  color: darkMode ? '#F5F2E8' : '#1B2951',
                }}
              >
                {user?.name || 'User'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#E8E2D5' : '#566BA3',
                  opacity: 0.8,
                }}
              >
                {user?.role || 'Member'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <Person sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>

        <Divider sx={{ 
          borderColor: darkMode ? '#566BA3' : '#D1D8E6',
          my: 1,
        }} />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Profile Dialog */}
      <UserProfileDialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        darkMode={darkMode}
        user={user}
        onUpdateUser={updateUser}
      />

      {/* Settings Dialog */}
      <UserSettingsDialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        darkMode={darkMode}
        user={user}
        onUpdateUser={updateUser}
      />
    </>
  );
};

// Profile Edit Dialog
const UserProfileDialog = ({ open, onClose, darkMode, user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpdateUser(formData);
      setMessage('Profile updated successfully!');
      
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const dialogStyles = {
    '& .MuiDialog-paper': {
      backgroundColor: darkMode ? '#1B2951' : '#FFFFFF',
      color: darkMode ? '#F5F2E8' : '#1B2951',
      border: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
    },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={dialogStyles}>
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
      }}>
        <Typography variant="h6">Edit Profile</Typography>
        <IconButton onClick={onClose}>
          <Close sx={{ color: darkMode ? '#F5F2E8' : '#1B2951' }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {message && (
          <Alert 
            severity={message.includes('success') ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          disabled={loading}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={loading}
            sx={{
              backgroundColor: darkMode ? '#F5F2E8' : '#1B2951',
              color: darkMode ? '#1B2951' : '#F5F2E8',
              '&:hover': {
                backgroundColor: darkMode ? '#E8E2D5' : '#566BA3',
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Settings Dialog
const UserSettingsDialog = ({ open, onClose, darkMode, user, onUpdateUser }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const dialogStyles = {
    '& .MuiDialog-paper': {
      backgroundColor: darkMode ? '#1B2951' : '#FFFFFF',
      color: darkMode ? '#F5F2E8' : '#1B2951',
      border: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
    },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={dialogStyles}>
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
      }}>
        <Typography variant="h6">Account Settings</Typography>
        <IconButton onClick={onClose}>
          <Close sx={{ color: darkMode ? '#F5F2E8' : '#1B2951' }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Change Password
        </Typography>

        {message && (
          <Alert 
            severity={message.includes('success') ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Current Password"
          type={showPasswords.current ? 'text' : 'password'}
          value={passwordData.currentPassword}
          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              >
                {showPasswords.current ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="New Password"
          type={showPasswords.new ? 'text' : 'password'}
          value={passwordData.newPassword}
          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              >
                {showPasswords.new ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Confirm New Password"
          type={showPasswords.confirm ? 'text' : 'password'}
          value={passwordData.confirmPassword}
          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              >
                {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePasswordChange} 
            disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
            sx={{
              backgroundColor: darkMode ? '#F5F2E8' : '#1B2951',
              color: darkMode ? '#1B2951' : '#F5F2E8',
              '&:hover': {
                backgroundColor: darkMode ? '#E8E2D5' : '#566BA3',
              },
            }}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileMenu;