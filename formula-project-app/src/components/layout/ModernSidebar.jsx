import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import FormulaLogo, { FormulaLogoCompact } from '../branding/FormulaLogo';
import {
  Dashboard as DashboardIcon,
  FolderOpen as ProjectsIcon,
  Assignment as TaskIcon,
  People as TeamIcon,
  Timeline as TimelineIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Person as MyProjectsIcon,
  ShoppingCart as ProcurementIcon,
  Business as ClientsIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Architecture as ShopDrawingsIcon
} from '@mui/icons-material';
import { useTheme as useFormulaTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';

const ModernSidebar = ({ currentTab, onTabChange, isCollapsed, onToggleCollapse }) => {
  const theme = useTheme();
  const { isDarkMode } = useFormulaTheme();
  const { isInProjectContext, exitProjectContext } = useNavigation();
  const darkMode = isDarkMode;
  
  // Formula International brand colors
  const colors = darkMode ? {
    background: '#1B2951',     // Navy background
    text: '#F5F2E8',          // Light cream text
    textSecondary: '#E8E2D5', // Cream secondary text
    textMuted: '#A8B8D1',     // Muted text
    accent: '#F5F2E8',        // Light cream accent
    border: '#566BA3',        // Medium navy border
    hover: 'rgba(245, 242, 232, 0.08)',
    active: 'rgba(245, 242, 232, 0.12)'
  } : {
    background: '#FDFCFA',    // Light cream background
    text: '#1B2951',          // Navy text
    textSecondary: '#566BA3', // Medium navy secondary
    textMuted: '#7A8FB8',     // Muted navy text
    accent: '#1B2951',        // Navy accent
    border: '#D1D8E6',        // Light border
    hover: 'rgba(27, 41, 81, 0.05)',
    active: 'rgba(27, 41, 81, 0.08)'
  };

  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { id: 0, label: 'Dashboard', icon: <DashboardIcon />, description: 'Project overview and stats' }
      ]
    },
    {
      title: 'Projects',
      items: [
        { id: 1, label: 'All Projects', icon: <ProjectsIcon />, description: 'All company projects' },
        { id: 2, label: 'My Work', icon: <MyProjectsIcon />, description: 'My projects and assigned tasks' }
      ]
    },
    {
      title: 'Work',
      items: [
        { id: 3, label: 'Tasks', icon: <TaskIcon />, description: 'Task management' },
        { id: 8, label: 'Shop Drawings', icon: <ShopDrawingsIcon />, description: 'Millwork drawings & approvals' },
        { id: 7, label: 'Timeline', icon: <TimelineIcon />, description: 'Gantt charts and timelines' }
      ]
    },
    {
      title: 'Resources',
      items: [
        { id: 4, label: 'Team', icon: <TeamIcon />, description: 'Team member management' },
        { id: 5, label: 'Clients', icon: <ClientsIcon />, description: 'Client database' },
        { id: 9, label: 'Material Specs', icon: <ProcurementIcon />, description: 'Material specifications & Excel import' },
        { id: 6, label: 'Procurement', icon: <ProcurementIcon />, description: 'Purchase and suppliers' }
      ]
    }
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    { id: 'help', label: 'Help & Feedback', icon: <HelpIcon /> }
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

  return (
    <Box
      sx={{
        width: isCollapsed ? 70 : 280,
        height: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        transition: 'width 0.3s ease-in-out',
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
              backgroundColor: colors.hover,
              width: 32,
              height: 32,
              '&:hover': {
                backgroundColor: colors.active,
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease',
              ml: isCollapsed ? 0 : 1
            }}
          >
            {isCollapsed ? <MenuIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
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
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                        py: 1.5,
                        backgroundColor: currentTab === item.id ? colors.accent : 'transparent',
                        color: currentTab === item.id ? (darkMode ? colors.background : colors.background) : colors.textSecondary,
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        minHeight: 48,
                        borderLeft: currentTab === item.id ? `3px solid ${colors.accent}` : 'none',
                        '&:hover': {
                          backgroundColor: currentTab === item.id ? colors.accent : colors.hover,
                          color: currentTab === item.id ? (darkMode ? colors.background : colors.background) : colors.text,
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
                          secondary={item.description}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                            fontWeight: currentTab === item.id ? 600 : 400
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.75rem',
                            color: currentTab === item.id 
                              ? (darkMode ? `${colors.background}cc` : `${colors.background}cc`)
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
          <Divider sx={{ borderColor: colors.border, mb: 2 }} />
        )}
        <List sx={{ padding: 0 }}>
          {bottomItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.label : ''} placement="right" arrow>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    py: 1.5,
                    color: colors.textSecondary,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    minHeight: 48,
                    '&:hover': {
                      backgroundColor: colors.hover,
                      color: colors.text,
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