import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Tooltip } from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon 
} from '@mui/icons-material';
import ModernSidebar from './ModernSidebar';
import UserProfileMenu from '../auth/UserProfileMenu';
import LiveSearchDropdown from '../ui/LiveSearchDropdown';
import { NotificationPanel } from '../../services/notifications/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ModernDashboardLayout = ({ children, currentTab, onTabChange }) => {
  const { user } = useAuth();
  const { mode, toggleTheme, isDarkMode } = useTheme();
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
    switch (currentTab) {
      case 0: return 'Dashboard';
      case 1: return 'Projects';
      case 2: return 'Tasks';
      case 3: return 'Team';
      case 4: return 'Clients';
      default: return 'Dashboard';
    }
  };

  const getWelcomeMessage = () => {
    const userName = user?.name?.split(' ')[0] || 'User';
    const pageTitle = getPageTitle();
    switch (currentTab) {
      case 0: return `Welcome back, ${userName}. Here's what's happening.`;
      case 1: return 'Manage and track all your construction projects.';
      case 2: return 'View and manage tasks across all projects.';
      case 3: return 'Manage your team members and assignments.';
      case 4: return 'Manage client information and contacts.';
      default: return `Welcome back, ${userName}. Here's what's happening.`;
    }
  };

  const getCurrentTab = () => {
    return currentTab || 0;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Sidebar */}
      <ModernSidebar 
        currentTab={getCurrentTab()} 
        onTabChange={onTabChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        darkMode={isDarkMode}
      />
      
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: sidebarCollapsed ? '70px' : '280px',
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

            {/* Theme Toggle */}
            <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  },
                  width: 40,
                  height: 40
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

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
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default ModernDashboardLayout;