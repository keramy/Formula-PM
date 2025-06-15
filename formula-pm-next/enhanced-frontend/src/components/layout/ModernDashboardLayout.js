import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, InputBase, Paper } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import ModernSidebar from './ModernSidebar';

const ModernDashboardLayout = ({ 
  children, 
  currentTab, 
  onTabChange, 
  userName = "Kerem",
  globalSearch = '',
  onGlobalSearchChange,
  onSearchSubmit
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  
  const handleToggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };
  const getPageTitle = () => {
    switch (currentTab) {
      case 0: return 'Dashboard';
      case 1: return 'Projects';
      case 2: return 'Tasks';
      case 3: return 'Team';
      case 4: return 'Timeline & Gantt';
      default: return 'Dashboard';
    }
  };

  const getWelcomeMessage = () => {
    switch (currentTab) {
      case 0: return `Welcome back, ${userName}. Here's what's happening.`;
      case 1: return 'Manage and track all your construction projects.';
      case 2: return 'View and manage tasks across all projects.';
      case 3: return 'Manage your team members and assignments.';
      case 4: return 'Visualize project timelines and dependencies.';
      default: return `Welcome back, ${userName}. Here's what's happening.`;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Sidebar */}
      <ModernSidebar 
        currentTab={currentTab} 
        onTabChange={onTabChange} 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: sidebarCollapsed ? '70px' : '250px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        {/* Top Header */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid #E9ECEF',
            px: 4,
            py: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 80
          }}
        >
          {/* Left side - Title and subtitle */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#2C3E50',
                mb: 0.5,
                fontSize: '1.75rem'
              }}
            >
              {getPageTitle()}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#7F8C8D',
                fontSize: '0.95rem'
              }}
            >
              {getWelcomeMessage()}
            </Typography>
          </Box>

          {/* Right side - Search and notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Search Bar */}
            <Paper
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                if (onSearchSubmit) onSearchSubmit();
              }}
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 300,
                backgroundColor: '#F8F9FA',
                border: '1px solid #E9ECEF',
                borderRadius: 2,
                boxShadow: 'none'
              }}
            >
              <SearchIcon sx={{ p: '10px', color: '#7F8C8D' }} />
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
                placeholder="Search projects, tasks, team..."
                inputProps={{ 'aria-label': 'search' }}
                value={globalSearch}
                onChange={(e) => onGlobalSearchChange && onGlobalSearchChange(e.target.value)}
              />
            </Paper>

            {/* Notifications */}
            <IconButton
              sx={{
                backgroundColor: '#F8F9FA',
                border: '1px solid #E9ECEF',
                borderRadius: 2,
                p: 1.5,
                '&:hover': {
                  backgroundColor: '#E9ECEF'
                }
              }}
            >
              <NotificationsIcon sx={{ color: '#7F8C8D' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Container
          maxWidth={false}
          sx={{
            flexGrow: 1,
            py: 4,
            px: 4,
            maxWidth: 'none'
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default ModernDashboardLayout;