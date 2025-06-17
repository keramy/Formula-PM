import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import ModernSidebar from './ModernSidebar';
import UserProfileMenu from '../auth/UserProfileMenu';
import LiveSearchDropdown from '../ui/LiveSearchDropdown';
import { NotificationPanel } from '../../services/notifications/notificationService';
import { useAuth } from '../../context/AuthContext';

const ModernDashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [globalSearch, setGlobalSearch] = useState('');
  
  const handleToggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/projects')) return 'Projects';
    if (path.includes('/tasks')) return 'Tasks';
    if (path.includes('/team')) return 'Team';
    if (path.includes('/clients')) return 'Clients';
    if (path.includes('/dashboard')) return 'Dashboard';
    return 'Dashboard';
  };

  const getWelcomeMessage = () => {
    const userName = user?.name?.split(' ')[0] || 'User';
    const path = location.pathname;
    if (path.includes('/projects')) return 'Manage and track all your construction projects.';
    if (path.includes('/tasks')) return 'View and manage tasks across all projects.';
    if (path.includes('/team')) return 'Manage your team members and assignments.';
    if (path.includes('/clients')) return 'Manage client information and contacts.';
    if (path.includes('/dashboard')) return `Welcome back, ${userName}. Here's what's happening.`;
    return `Welcome back, ${userName}. Here's what's happening.`;
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/projects')) return 1;
    if (path.includes('/tasks')) return 3;
    if (path.includes('/team')) return 4;
    if (path.includes('/clients')) return 5;
    return 0; // dashboard
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Sidebar */}
      <ModernSidebar 
        currentTab={getCurrentTab()} 
        onTabChange={() => {}} // Navigation handled by React Router
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
            {/* Live Search Dropdown */}
            <LiveSearchDropdown
              value={globalSearch}
              onChange={setGlobalSearch}
              onResultSelect={() => {}}
              onNavigate={() => {}}
              placeholder="Search projects, tasks, team..."
            />

            {/* Notifications */}
            <NotificationPanel />
            
            {/* User Profile Menu */}
            <UserProfileMenu />
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
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default ModernDashboardLayout;