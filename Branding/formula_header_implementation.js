// components/layout/FormulaHeader.jsx
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Brightness4, 
  Brightness7,
  Settings,
  Logout,
  Person
} from '@mui/icons-material';
import FormulaLogo, { FormulaLogoCompact } from '../branding/FormulaLogo';

const FormulaHeader = ({ 
  darkMode = false,
  onToggleDarkMode,
  onMenuClick,
  user = { name: 'Admin User', avatar: null },
  onUserMenuClick,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const headerStyles = {
    backgroundColor: darkMode ? '#1B2951' : '#FDFCFA',
    borderBottom: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
    boxShadow: darkMode 
      ? '0 2px 8px rgba(0, 0, 0, 0.2)'
      : '0 2px 8px rgba(27, 41, 81, 0.08)',
    ...sx,
  };

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={headerStyles}>
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          minHeight: '64px !important',
          px: { xs: 2, sm: 3 },
        }}>
          {/* Left Side - Menu + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <IconButton 
              onClick={onMenuClick}
              sx={{ 
                color: darkMode ? '#F5F2E8' : '#1B2951',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.1)' : 'rgba(27, 41, 81, 0.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo - responsive sizing */}
            {isMobile ? (
              <FormulaLogoCompact 
                darkMode={darkMode}
                onClick={() => window.location.href = '/'}
              />
            ) : (
              <FormulaLogo 
                size="medium"
                darkMode={darkMode}
                onClick={() => window.location.href = '/'}
                sx={{ 
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  }
                }}
              />
            )}
          </Box>

          {/* Right Side - Theme Toggle + User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <IconButton 
              onClick={onToggleDarkMode}
              sx={{ 
                color: darkMode ? '#F5F2E8' : '#1B2951',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.1)' : 'rgba(27, 41, 81, 0.1)',
                },
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* User Avatar & Menu */}
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{ 
                p: 0,
                ml: 1,
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: darkMode ? '#F5F2E8' : '#1B2951',
                  color: darkMode ? '#1B2951' : '#F5F2E8',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
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
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => console.log('Profile clicked')}>
          <Person sx={{ mr: 2, fontSize: 20 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => console.log('Settings clicked')}>
          <Settings sx={{ mr: 2, fontSize: 20 }} />
          Settings
        </MenuItem>
        <Divider sx={{ 
          borderColor: darkMode ? '#566BA3' : '#D1D8E6',
          my: 1,
        }} />
        <MenuItem onClick={() => console.log('Logout clicked')}>
          <Logout sx={{ mr: 2, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default FormulaHeader;