import React, { useState } from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import ModernSidebar from './ModernSidebar';
import UserProfileMenu from '../auth/UserProfileMenu';
import LiveSearchDropdown from '../ui/LiveSearchDropdown';
import { NotificationPanel } from '../../services/notifications/notificationService';
import { useAuth } from '../../context/AuthContext';

const ModernDashboardLayout = ({ 
  children, 
  currentTab, 
  onTabChange, 
  globalSearch = '',
  onGlobalSearchChange,
  onSearchSubmit,
  onSearchResultSelect,
  onShowFullSearch
}) => {
  const { user } = useAuth();
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
      case 2: return 'My Work';
      case 3: return 'Tasks';
      case 4: return 'Team';
      case 5: return 'Clients';
      case 6: return 'Procurement';
      case 7: return 'Timeline & Gantt';
      case 8: return 'Shop Drawings';
      case 9: return 'Material Specifications';
      default: return 'Dashboard';
    }
  };

  const getWelcomeMessage = () => {
    const userName = user?.name?.split(' ')[0] || 'User';
    switch (currentTab) {
      case 0: return `Welcome back, ${userName}. Here's what's happening.`;
      case 1: return 'Manage and track all your construction projects.';
      case 2: return 'View your projects and assigned tasks.';
      case 3: return 'View and manage tasks across all projects.';
      case 4: return 'Manage your team members and assignments.';
      case 5: return 'Manage client information and contacts.';
      case 6: return 'Handle procurement and supplier management.';
      case 7: return 'Visualize project timelines and dependencies.';
      case 8: return 'Manage millwork shop drawings and approvals.';
      case 9: return 'Manage material specifications with Excel integration.';
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
            {/* Live Search Dropdown */}
            <LiveSearchDropdown
              value={globalSearch}
              onChange={onGlobalSearchChange}
              onResultSelect={onSearchResultSelect}
              onNavigate={(type) => {
                if (type === 'full-search' && onShowFullSearch) {
                  onShowFullSearch();
                }
              }}
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
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default ModernDashboardLayout;