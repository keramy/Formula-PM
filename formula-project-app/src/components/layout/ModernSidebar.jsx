import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme as useMuiTheme,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import FormulaLogo, { FormulaLogoCompact } from '../branding/FormulaLogo';
// React Icons system
import { NavigationIcon, IconWrapper } from '../icons';
import { useTheme as useFormulaTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';

const ModernSidebar = ({ currentTab, onTabChange, isCollapsed, onToggleCollapse }) => {
  const theme = useMuiTheme();
  const { isDarkMode } = useFormulaTheme();
  const { isInProjectContext, exitProjectContext } = useNavigation();
  const darkMode = isDarkMode;
  
  // Mobile responsiveness
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // Use theme colors instead of hardcoded values
  const colors = {
    background: darkMode ? theme.palette.formulaBrand.navy : theme.palette.formulaBrand.lightBackground,
    text: darkMode ? theme.palette.formulaBrand.lightCream : theme.palette.formulaBrand.navy,
    textSecondary: theme.palette.text.secondary,
    textMuted: theme.palette.text.disabled,
    accent: darkMode ? theme.palette.formulaBrand.lightCream : theme.palette.formulaBrand.navy,
    border: theme.palette.divider,
    hover: theme.palette.action.hover,
    active: theme.palette.action.selected
  };

  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { id: 0, label: 'Dashboard', icon: <NavigationIcon name="dashboard" active={currentTab === 0} />, description: 'Project overview and stats' }
      ]
    },
    {
      title: 'Projects',
      items: [
        { id: 1, label: 'All Projects', icon: <NavigationIcon name="projects" active={currentTab === 1} />, description: 'All company projects' },
        { id: 2, label: 'My Work', icon: <NavigationIcon name="myWork" active={currentTab === 2} />, description: 'My projects and assigned tasks' }
      ]
    },
    {
      title: 'Work',
      items: [
        { id: 3, label: 'Tasks', icon: <NavigationIcon name="tasks" active={currentTab === 3} />, description: 'Task management' },
        { id: 8, label: 'Shop Drawings', icon: <NavigationIcon name="shopDrawings" active={currentTab === 8} />, description: 'Millwork drawings & approvals' },
        { id: 7, label: 'Timeline', icon: <NavigationIcon name="timeline" active={currentTab === 7} />, description: 'Gantt charts and timelines' }
      ]
    },
    {
      title: 'Activity',
      items: [
        { id: 10, label: 'Activity Feed', icon: <NavigationIcon name="activityFeed" active={currentTab === 10} />, description: 'Recent activity and updates' }
      ]
    },
    {
      title: 'Resources',
      items: [
        { id: 4, label: 'Team', icon: <NavigationIcon name="team" active={currentTab === 4} />, description: 'Team member management' },
        { id: 5, label: 'Clients', icon: <NavigationIcon name="clients" active={currentTab === 5} />, description: 'Client database' },
        { id: 9, label: 'Material Specs', icon: <NavigationIcon name="materials" active={currentTab === 9} />, description: 'Material specifications & Excel import' },
        { id: 6, label: 'Procurement', icon: <NavigationIcon name="procurement" active={currentTab === 6} />, description: 'Purchase and suppliers' }
      ]
    }
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: <IconWrapper name="settings" size={20} /> },
    { id: 'help', label: 'Help & Feedback', icon: <IconWrapper name="help" size={20} /> }
  ];

  const handleItemClick = (id) => {
    if (typeof id === 'number') {
      // If we're in project context, exit it first before navigating to main tabs
      if (isInProjectContext()) {
        exitProjectContext();
      }
      onTabChange(null, id);
    }
  };

  const handleKeyDown = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemClick(id);
    }
  };

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Main navigation"
      sx={{
        width: isCollapsed ? 70 : 280,
        height: '100vh',
        backgroundPalette: colors.background,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: isMobile && !sidebarOpen ? '-100%' : 0,
        top: 0,
        zIndex: 1200,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        borderRight: `1px solid ${colors.border}`,
        boxShadow: darkMode ? '4px 0 8px rgba(0, 0, 0, 0.2)' : '4px 0 8px rgba(27, 41, 81, 0.1)'
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          position: 'relative',
          borderBottom: `1px solid ${colors.border}`,
          minHeight: 80
        }}
      >
        {isCollapsed ? (
          <FormulaLogoCompact 
            darkMode={darkMode}
            onClick={() => {
              if (isInProjectContext()) {
                exitProjectContext();
              }
              onTabChange(null, 0);
            }}
          />
        ) : (
          <FormulaLogo 
            size="small"
            darkMode={darkMode}
            onClick={() => {
              if (isInProjectContext()) {
                exitProjectContext();
              }
              onTabChange(null, 0);
            }}
            sx={{ cursor: 'pointer' }}
          />
        )}
        
        {/* Toggle Button */}
        <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              color: colors.text,
              backgroundPalette: 'transparent',
              width: 32,
              height: 32,
              '&:hover': {
                backgroundPalette: theme.palette.action.hover,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              },
              transition: 'all 0.2s ease',
              ml: isCollapsed ? 0 : 1
            }}
          >
            {isCollapsed ? <IconWrapper name="menu" size={18} /> : <IconWrapper name="chevronLeft" size={18} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Grouped Navigation */}
      <Box sx={{ flex: 1, px: 2 }}>
        {menuGroups.map((group, groupIndex) => (
          <Box key={group.title} sx={{ mb: 3 }}>
            {!isCollapsed && (
              <Typography
                variant="caption"
                sx={{
                  color: colors.textMuted,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: 1,
                  px: 2,
                  mb: 1,
                  display: 'block',
                  fontSize: '0.7rem'
                }}
              >
                {group.title}
              </Typography>
            )}
            
            <List sx={{ padding: 0 }}>
              {group.items.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <Tooltip title={isCollapsed ? item.label : ''} placement="right" arrow>
                    <ListItemButton
                      onClick={() => handleItemClick(item.id)}
                      role="button"
                      aria-label={`Navigate to ${item.label} - ${item.description}`}
                      aria-current={currentTab === item.id ? 'page' : false}
                      onKeyDown={(event) => handleKeyDown(event, item.id)}
                      tabIndex={0}
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                        py: isMobile ? 1.5 : 1.5,
                        px: isMobile ? 2 : 1,
                        backgroundPalette: currentTab === item.id ? colors.accent : 'transparent',
                        color: currentTab === item.id ? '#ffffff !important' : colors.textSecondary,
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        minHeight: isMobile ? 44 : 48, // Minimum 44px for mobile touch targets
                        borderLeft: currentTab === item.id ? `3px solid ${colors.accent}` : 'none',
                        '&:hover': {
                          backgroundPalette: currentTab === item.id ? colors.accent : 'var(--rapture-light)',
                          color: currentTab === item.id ? '#ffffff !important' : colors.text,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          transform: 'translateX(4px)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: currentTab === item.id ? '#ffffff !important' : 'inherit',
                          minWidth: isCollapsed ? 0 : 40,
                          justifyContent: 'center'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!isCollapsed && (
                        <ListItemText
                          primary={item.label}
                          secondary={item.description}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                            fontWeight: currentTab === item.id ? 600 : 400,
                            color: currentTab === item.id ? '#ffffff !important' : 'inherit'
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.75rem',
                            color: currentTab === item.id 
                              ? '#ffffffcc'
                              : colors.textMuted,
                            display: 'none' // Show on hover or when active
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* Bottom Section */}
      <Box sx={{ px: 2, pb: 3 }}>
        {!isCollapsed && (
          <Divider sx={{ borderPalette: colors.border, mb: 2 }} />
        )}
        <List sx={{ padding: 0 }}>
          {bottomItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.label : ''} placement="right" arrow>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    py: isMobile ? 1.5 : 1.5,
                    px: isMobile ? 2 : 1,
                    color: colors.textSecondary,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    minHeight: isMobile ? 44 : 48, // Minimum 44px for mobile touch targets
                    '&:hover': {
                      backgroundPalette: 'var(--rapture-light)',
                      color: colors.text,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transform: 'translateX(4px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: isCollapsed ? 0 : 40,
                      justifyContent: 'center'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.9rem'
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        
        {/* Formula International Copyright Footer */}
        {!isCollapsed && (
          <Box sx={{ mt: 3, px: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: colors.textMuted,
                textAlign: 'center',
                display: 'block',
                opacity: 0.6,
                fontSize: '0.7rem',
                letterSpacing: '0.05em',
                lineHeight: 1.3
              }}
            >
              Formula International
              <br />
              © 2025
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ModernSidebar;