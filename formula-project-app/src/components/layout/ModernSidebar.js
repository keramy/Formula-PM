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
  useTheme
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
  Business as ClientsIcon
} from '@mui/icons-material';

const ModernSidebar = ({ currentTab, onTabChange }) => {
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
        { id: 2, label: 'My Projects', icon: <MyProjectsIcon />, description: 'Projects I manage' }
      ]
    },
    {
      title: 'Work',
      items: [
        { id: 3, label: 'Tasks', icon: <TaskIcon />, description: 'Task management' },
        { id: 7, label: 'Timeline', icon: <TimelineIcon />, description: 'Gantt charts and timelines' }
      ]
    },
    {
      title: 'Resources',
      items: [
        { id: 4, label: 'Team', icon: <TeamIcon />, description: 'Team member management' },
        { id: 5, label: 'Clients', icon: <ClientsIcon />, description: 'Client database' },
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
        width: 250,
        height: '100vh',
        backgroundColor: '#2C3E50', // Dark blue-gray background
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
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
            transform: 'rotate(45deg)'
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
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 600,
            fontSize: '1.1rem'
          }}
        >
          Formula Project Management
        </Typography>
      </Box>

      {/* Grouped Navigation */}
      <Box sx={{ flex: 1, px: 2 }}>
        {menuGroups.map((group, groupIndex) => (
          <Box key={group.title} sx={{ mb: 3 }}>
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
            
            <List sx={{ padding: 0 }}>
              {group.items.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleItemClick(item.id)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      py: 1.5,
                      backgroundColor: currentTab === item.id ? '#E67E22' : 'transparent',
                      color: currentTab === item.id ? 'white' : '#BDC3C7',
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
                        minWidth: 40
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
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
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* Bottom Section */}
      <Box sx={{ px: 2, pb: 3 }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
        <List sx={{ padding: 0 }}>
          {bottomItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  py: 1.5,
                  color: '#BDC3C7',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ModernSidebar;