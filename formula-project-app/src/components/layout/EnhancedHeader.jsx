import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Chip,
  IconButton,
  Button,
  Avatar,
  InputBase,
  Paper,
  AvatarGroup,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  useTheme as useMuiTheme,
  useMediaQuery
} from '@mui/material';
// React Icons MD - Material Design icons
import {
  MdSearch as Search,
  MdAdd as Add,
  MdShare as Share,
  MdMenu as MoreHoriz,
  MdStar as Star,
  MdStarBorder as StarBorder,
  MdHome as Home,
  MdBusiness as Business,
  MdDarkMode as Brightness4,
  MdLightMode as Brightness7,
  MdSettings as Settings,
  MdPerson as User,
  MdPerson as Person,
  MdLogOut as Logout
} from 'react-icons/md';
import FormulaLogo from '../branding/FormulaLogo';
import { FormulaLogoCompact } from '../branding/LogoVariations';
import { useTheme as useFormulaTheme } from '../../context/ThemeContext';
import NotificationCenter from '../notifications/NotificationCenter';
import RealTimeNotificationBell from '../notifications/RealTimeNotificationBell';
import { OnlineUsersList, PresenceIndicators } from '../realtime/PresenceIndicators';

const EnhancedHeader = ({ 
  title, 
  breadcrumbs = [], 
  onSearch, 
  onAdd, 
  createButtonText = null,
  isStarred = false,
  onToggleStar,
  teamMembers = [],
  searchValue = '',
  onSearchChange,
  subtitle = '',
  showTeamAvatars = true,
  maxAvatars = 4,
  showLogo = true,
  user = { name: 'Admin User', avatar: null },
  onUserMenuClick
}) => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleTheme, isDarkMode } = useFormulaTheme();

  // Debug logging
  // EnhancedHeader props received
  const darkMode = isDarkMode;
  
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  const displayMembers = teamMembers.slice(0, maxAvatars);
  const remainingCount = teamMembers.length - maxAvatars;

  const handleStarClick = () => {
    if (onToggleStar) {
      onToggleStar();
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleUserMenuItemClick = (action) => {
    handleUserMenuClose();
    if (onUserMenuClick) {
      onUserMenuClick(action);
    }
  };

  // Use theme colors instead of hardcoded values
  const headerPalettes = {
    background: theme.palette.background.paper,
    border: theme.palette.divider,
    text: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    hover: theme.palette.primary.main
  };

  return (
    <Box sx={{ 
      backgroundColor: headerPalettes.background,
      borderBottom: `1px solid ${headerPalettes.border}`,
      px: 4,
      py: 3,
      transition: 'all 0.3s ease'
    }}>
      {/* Logo and Breadcrumbs Row */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2 
      }}>
        {/* Logo Section */}
        {showLogo && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile ? (
              <FormulaLogoCompact 
                darkMode={darkMode}
                onClick={() => window.location.href = '/'}
              />
            ) : (
              <FormulaLogo 
                size="small"
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
        )}

        {/* User Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <RealTimeNotificationBell />

          {/* Theme Toggle */}
          <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton 
              onClick={toggleTheme}
              sx={{ 
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.action.hover,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {/* User Avatar & Menu */}
          <Tooltip title="User menu">
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{ 
                p: 0,
                ml: 1,
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
                transition: 'transform 0.2s ease'
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: darkMode ? theme.palette.formulaBrand.lightCream : theme.palette.formulaBrand.navy,
                  color: darkMode ? theme.palette.formulaBrand.navy : theme.palette.formulaBrand.lightCream,
                  fontSize: '1rem',
                  fontWeight: 500,
                  border: `2px solid ${darkMode ? 'rgba(245, 242, 232, 0.2)' : 'rgba(27, 41, 81, 0.2)'}`,
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        sx={{ 
          mb: 2, 
          fontSize: '0.875rem',
          '& .MuiBreadcrumbs-separator': {
            color: headerPalettes.textSecondary
          }
        }}
      >
        <Link 
          underline="hover" 
          color="inherit" 
          href="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: headerPalettes.textSecondary,
            '&:hover': { color: headerPalettes.hover }
          }}
        >
          <Home sx={{ fontSize: 16 }} />
          Formula PM
        </Link>
        
        <Link 
          underline="hover" 
          color="inherit" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: headerPalettes.textSecondary,
            '&:hover': { color: headerPalettes.hover }
          }}
        >
          <Business sx={{ fontSize: 16 }} />
          Team Space
        </Link>

        {breadcrumbs.map((crumb, index) => (
          <Link
            key={index}
            underline="hover"
            color="inherit"
            href={crumb.href || '#'}
            sx={{ 
              color: headerPalettes.textSecondary,
              '&:hover': { color: headerPalettes.hover },
              transition: 'color 0.2s ease'
            }}
          >
            {crumb.label}
          </Link>
        ))}
        
        <Typography 
          color="text.primary" 
          fontWeight={500}
          sx={{ 
            color: headerPalettes.text,
            fontSize: '0.875rem'
          }}
        >
          {title}
        </Typography>
      </Breadcrumbs>

      {/* Main Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Title and Star */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: headerPalettes.text,
                fontSize: '1.75rem',
                fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
              }}
            >
              {title}
            </Typography>
            
            <Tooltip title={isStarred ? "Remove from favorites" : "Add to favorites"}>
              <IconButton 
                size="small" 
                onClick={handleStarClick}
                sx={{ 
                  color: isStarred ? theme.palette.warning.main : headerPalettes.textSecondary,
                  '&:hover': {
                    color: isStarred ? theme.palette.warning.dark : theme.palette.warning.main,
                    backgroundColor: theme.palette.action.hover,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {isStarred ? <Star /> : <StarBorder />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Subtitle */}
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: headerPalettes.textSecondary,
                fontSize: '0.9rem',
                ml: 1,
                opacity: 0.8
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Team Avatars with Presence */}
          {showTeamAvatars && teamMembers.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
              <PresenceIndicators 
                projectId={window.location.pathname.includes('/projects/') ? 
                  window.location.pathname.split('/projects/')[1]?.split('/')[0] : 
                  null
                }
                maxVisible={maxAvatars}
                showDetails={false}
              />
              
              <AvatarGroup 
                max={maxAvatars}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    border: `2px solid ${headerPalettes.background}`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      zIndex: 10
                    }
                  }
                }}
              >
                {displayMembers.map((member) => (
                  <Tooltip key={member.id} title={member.fullName}>
                    <Avatar
                      sx={{
                        bgcolor: member.rolePalette || theme.palette.info.main,
                        fontWeight: 600
                      }}
                    >
                      {member.initials}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
              
              {remainingCount > 0 && (
                <Tooltip title={`+${remainingCount} more team members`}>
                  <Chip 
                    label={`+${remainingCount}`}
                    size="small"
                    sx={{ 
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.text.primary,
                      cursor: 'pointer',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          )}
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Search */}
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 240,
              height: 38,
              px: 1.5,
              backgroundColor: theme.palette.action.hover,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.action.selected,
                border: `1px solid ${theme.palette.primary.light}`
              },
              '&:focus-within': {
                backgroundColor: theme.palette.action.selected,
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: `0 0 0 3px ${theme.palette.action.focus}`
              }
            }}
          >
            <Search sx={{ 
              color: headerPalettes.textSecondary, 
              mr: 1, 
              fontSize: 20 
            }} />
            <InputBase
              placeholder="Search in this space..."
              size="small"
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              sx={{ 
                flex: 1, 
                fontSize: '0.875rem',
                color: headerPalettes.text,
                '& input::placeholder': {
                  color: headerPalettes.textSecondary,
                  opacity: 0.7
                }
              }}
            />
          </Paper>

          {/* Action Buttons */}
          <Tooltip title="Share">
            <IconButton 
              sx={{ 
                backgroundColor: theme.palette.action.hover,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                width: 38,
                height: 38,
                color: theme.palette.text.primary,
                '&:hover': { 
                  backgroundColor: theme.palette.action.selected,
                  border: `1px solid ${theme.palette.primary.light}`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Share sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          
          {/* Debug: Check button rendering logic */}
          {/* Button render check */}
          {onAdd && (
            (createButtonText || title === 'All Projects') ? (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAdd}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {createButtonText || 'Create New Project'}
              </Button>
            ) : (
              <Tooltip title="Add New">
                <IconButton 
                  onClick={onAdd}
                  sx={{ 
                    backgroundColor: theme.palette.primary.main, 
                    color: theme.palette.primary.contrastText,
                    borderRadius: 2,
                    width: 38,
                    height: 38,
                    '&:hover': { 
                      backgroundColor: theme.palette.primary.dark,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Add sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )
          )}

          <Tooltip title="More options">
            <IconButton 
              sx={{ 
                backgroundColor: theme.palette.action.hover,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                width: 38,
                height: 38,
                color: theme.palette.text.primary,
                '&:hover': { 
                  backgroundColor: theme.palette.action.selected,
                  border: `1px solid ${theme.palette.primary.light}`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <MoreHoriz sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          {/* User Avatar */}
          <Tooltip title={user.name}>
            <IconButton 
              onClick={handleUserMenuOpen}
              sx={{ 
                p: 0,
                ml: 1,
                '&:hover': { 
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  border: `2px solid ${theme.palette.divider}`,
                }}
              >
                {!user.avatar && user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

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
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            '& .MuiMenuItem-root': {
              color: theme.palette.text.primary,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleUserMenuItemClick('profile')}>
          <Person sx={{ mr: 2, fontSize: 20, color: headerPalettes.textSecondary }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleUserMenuItemClick('settings')}>
          <Settings sx={{ mr: 2, fontSize: 20, color: headerPalettes.textSecondary }} />
          Settings
        </MenuItem>
        <MenuItem onClick={toggleTheme}>
          {darkMode ? (
            <Brightness7 sx={{ mr: 2, fontSize: 20, color: headerPalettes.textSecondary }} />
          ) : (
            <Brightness4 sx={{ mr: 2, fontSize: 20, color: headerPalettes.textSecondary }} />
          )}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </MenuItem>
        <Divider sx={{ 
          borderColor: theme.palette.divider,
          my: 1,
        }} />
        <MenuItem onClick={() => handleUserMenuItemClick('logout')}>
          <Logout sx={{ mr: 2, fontSize: 20, color: theme.palette.error.main }} />
          <Typography sx={{ color: theme.palette.error.main }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EnhancedHeader;