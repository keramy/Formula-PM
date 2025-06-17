// components/layout/FormulaSidebar.jsx
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Folder,
  Assignment,
  People,
  Business,
  Build,
  Description,
  Timeline,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import FormulaLogo, { FormulaLogoCompact } from '../branding/FormulaLogo';

const FormulaSidebar = ({
  open = true,
  onToggle,
  darkMode = false,
  currentTab = 0,
  onTabChange,
  variant = 'permanent', // 'permanent' or 'temporary'
}) => {
  const [projectsExpanded, setProjectsExpanded] = React.useState(false);
  
  const drawerWidth = open ? 280 : 64;
  
  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <Dashboard />, 
      index: 0,
      path: '/dashboard',
    },
    { 
      label: 'Projects', 
      icon: <Folder />, 
      index: 1,
      path: '/projects',
      hasSubmenu: true,
      submenu: [
        { label: 'All Projects', index: 1 },
        { label: 'My Projects', index: 2 },
      ]
    },
    { 
      label: 'Tasks', 
      icon: <Assignment />, 
      index: 3,
      path: '/tasks',
    },
    { 
      label: 'Team', 
      icon: <People />, 
      index: 4,
      path: '/team',
    },
    { 
      label: 'Clients', 
      icon: <Business />, 
      index: 5,
      path: '/clients',
    },
    { 
      label: 'Shop Drawings', 
      icon: <Build />, 
      index: 8,
      path: '/shop-drawings',
    },
    { 
      label: 'Specifications', 
      icon: <Description />, 
      index: 9,
      path: '/specifications',
    },
    { 
      label: 'Timeline', 
      icon: <Timeline />, 
      index: 7,
      path: '/timeline',
    },
  ];

  const drawerStyles = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: darkMode ? '#1B2951' : '#FDFCFA',
      borderRight: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
      transition: 'width 0.3s ease-in-out',
      overflowX: 'hidden',
    },
  };

  const handleProjectsClick = () => {
    if (open) {
      setProjectsExpanded(!projectsExpanded);
    } else {
      onToggle();
    }
  };

  const renderMenuItem = (item) => {
    const isActive = currentTab === item.index;
    const isProjectsItem = item.hasSubmenu;
    
    return (
      <ListItem key={item.label} disablePadding>
        <ListItemButton
          onClick={isProjectsItem ? handleProjectsClick : () => onTabChange?.(item.index)}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            backgroundColor: isActive ? (darkMode ? 'rgba(245, 242, 232, 0.1)' : 'rgba(27, 41, 81, 0.05)') : 'transparent',
            borderRight: isActive ? `3px solid ${darkMode ? '#F5F2E8' : '#1B2951'}` : 'none',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.05)' : 'rgba(27, 41, 81, 0.03)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: isActive 
                ? (darkMode ? '#F5F2E8' : '#1B2951')
                : (darkMode ? '#E8E2D5' : '#566BA3'),
            }}
          >
            {item.icon}
          </ListItemIcon>
          
          {open && (
            <>
              <ListItemText
                primary={item.label}
                sx={{
                  opacity: 1,
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive 
                      ? (darkMode ? '#F5F2E8' : '#1B2951')
                      : (darkMode ? '#E8E2D5' : '#566BA3'),
                  },
                }}
              />
              
              {isProjectsItem && (
                projectsExpanded ? <ExpandLess sx={{ color: darkMode ? '#E8E2D5' : '#566BA3' }} /> 
                                : <ExpandMore sx={{ color: darkMode ? '#E8E2D5' : '#566BA3' }} />
              )}
            </>
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  const renderSubmenu = (item) => (
    <Collapse in={projectsExpanded && open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {item.submenu?.map((subItem) => (
          <ListItem key={subItem.label} disablePadding>
            <ListItemButton
              onClick={() => onTabChange?.(subItem.index)}
              sx={{
                pl: 4,
                minHeight: 40,
                backgroundColor: currentTab === subItem.index 
                  ? (darkMode ? 'rgba(245, 242, 232, 0.08)' : 'rgba(27, 41, 81, 0.03)') 
                  : 'transparent',
                borderRight: currentTab === subItem.index 
                  ? `2px solid ${darkMode ? '#F5F2E8' : '#1B2951'}` 
                  : 'none',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.05)' : 'rgba(27, 41, 81, 0.02)',
                },
              }}
            >
              <ListItemText
                primary={subItem.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.85rem',
                    fontWeight: currentTab === subItem.index ? 500 : 400,
                    color: currentTab === subItem.index
                      ? (darkMode ? '#F5F2E8' : '#1B2951')
                      : (darkMode ? '#D4C8B8' : '#7A8FB8'),
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Collapse>
  );

  const drawerContent = (
    <>
      {/* Header with Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          p: 2,
          minHeight: 64,
          borderBottom: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
        }}
      >
        {open ? (
          <FormulaLogo 
            size="medium" 
            darkMode={darkMode}
            onClick={() => onTabChange?.(0)}
          />
        ) : (
          <FormulaLogoCompact 
            darkMode={darkMode}
            onClick={() => onTabChange?.(0)}
          />
        )}
        
        <IconButton
          onClick={onToggle}
          sx={{
            color: darkMode ? '#F5F2E8' : '#1B2951',
            ml: open ? 0 : 'auto',
          }}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <React.Fragment key={item.label}>
              {renderMenuItem(item)}
              {item.hasSubmenu && renderSubmenu(item)}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}` }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => console.log('Settings clicked')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.05)' : 'rgba(27, 41, 81, 0.03)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: darkMode ? '#E8E2D5' : '#566BA3',
              }}
            >
              <Settings />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Settings"
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    color: darkMode ? '#E8E2D5' : '#566BA3',
                  },
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        
        {open && (
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? '#A8B8D1' : '#A8B8D1',
              textAlign: 'center',
              display: 'block',
              mt: 2,
              opacity: 0.6,
              fontSize: '0.7rem',
              letterSpacing: '0.05em',
            }}
          >
            Formula International © 2025
          </Typography>
        )}
      </Box>
    </>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        sx={drawerStyles}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={drawerStyles}
    >
      {drawerContent}
    </Drawer>
  );
};

export default FormulaSidebar;