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

const ModernSidebar = ({ currentTab, onTabChange, isCollapsed, onToggleCollapse }) => {
  const theme = useTheme();

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
      onTabChange(null, id);
    }
  };

  return (
    <Box
      sx={{
        width: isCollapsed ? 70 : 250,
        height: '100vh',
        backgroundColor: '#2C3E50', // Dark blue-gray background
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        transition: 'width 0.3s ease-in-out',
        overflow: 'hidden'
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            backgroundColor: '#E67E22', // Orange accent
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(45deg)',
            flexShrink: 0
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: 'white',
              borderRadius: 0.5,
              transform: 'rotate(-45deg)'
            }}
          />
        </Box>
        
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            Formula Project Management
          </Typography>
        )}
        
        {/* Toggle Button */}
        <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              position: 'absolute',
              right: isCollapsed ? 8 : 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              width: 24,
              height: 24,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            {isCollapsed ? <MenuIcon sx={{ fontSize: 16 }} /> : <ChevronLeftIcon sx={{ fontSize: 16 }} />}
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
                  color: 'rgba(255, 255, 255, 0.6)',
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
                        backgroundColor: currentTab === item.id ? '#E67E22' : 'transparent',
                        color: currentTab === item.id ? 'white' : '#BDC3C7',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        minHeight: 48,
                        '&:hover': {
                          backgroundColor: currentTab === item.id ? '#D35400' : 'rgba(255, 255, 255, 0.08)',
                          color: currentTab === item.id ? 'white' : '#ECF0F1'
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
                            color: currentTab === item.id ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
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
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
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
                    color: '#BDC3C7',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    minHeight: 48,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)'
                    }
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
      </Box>
    </Box>
  );
};

export default ModernSidebar;