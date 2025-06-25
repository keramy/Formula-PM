import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Tooltip, useTheme as useMuiTheme } from '@mui/material';
import NotionStyleSidebar from './NotionStyleSidebar';
import Breadcrumbs from '../navigation/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

const ModernDashboardLayout = ({ children, currentTab, onTabChange, projects = [] }) => {
  const { user } = useAuth();
  const { isInProjectContext, currentProjectId, currentSection, exitProjectContext } = useNavigation();
  const theme = useMuiTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  
  const handleToggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };

  const getPageTitle = () => {
    // If we're in project context, show project name
    if (isInProjectContext() && currentProjectId) {
      const project = projects.find(p => p.id === currentProjectId);
      if (project) {
        const sectionName = currentSection ? currentSection.charAt(0).toUpperCase() + currentSection.slice(1) : 'Overview';
        return `${project.name} - ${sectionName}`;
      }
      return 'Project Details';
    }
    
    // Otherwise show tab-based titles
    switch (currentTab) {
      case 0: return 'Dashboard';
      case 1: return 'All Projects';
      case 2: return 'My Work';
      case 3: return 'Tasks';
      case 4: return 'Team';
      case 5: return 'Clients';
      case 6: return 'Procurement';
      case 7: return 'Timeline';
      case 8: return 'Shop Drawings';
      case 9: return 'Material Specs';
      case 10: return 'Activity Feed';
      default: return 'Dashboard';
    }
  };

  const getBreadcrumbItems = () => {
    // If we're in project context, build project breadcrumbs
    if (isInProjectContext() && currentProjectId) {
      const project = projects.find(p => p.id === currentProjectId);
      const items = [
        { label: 'Projects', href: '/projects' }
      ];
      
      if (project) {
        items.push({ 
          label: project.name, 
          href: `/projects/${project.id}` 
        });
      }
      
      return items;
    }
    
    // Otherwise show tab-based breadcrumbs
    switch (currentTab) {
      case 0: 
        return [{ label: 'Dashboard', href: '/dashboard' }];
      case 1: 
        return [{ label: 'Projects', href: '/projects' }];
      case 2: 
        return [{ label: 'My Work', href: '/my-work' }];
      case 3: 
        return [{ label: 'Tasks', href: '/tasks' }];
      case 4: 
        return [{ label: 'Team', href: '/team' }];
      case 5: 
        return [{ label: 'Clients', href: '/clients' }];
      case 6: 
        return [{ label: 'Procurement', href: '/procurement' }];
      case 7: 
        return [{ label: 'Timeline', href: '/timeline' }];
      case 8: 
        return [{ label: 'Shop Drawings', href: '/shop-drawings' }];
      case 9: 
        return [{ label: 'Material Specs', href: '/material-specs' }];
      case 10: 
        return [{ label: 'Activity Feed', href: '/activity-feed' }];
      case 'reports':
        return [{ label: 'Reports', href: '/reports' }];
      default: 
        return [{ label: 'Dashboard', href: '/dashboard' }];
    }
  };

  const handleBreadcrumbNavigate = (href, item) => {
    console.log('Breadcrumb navigation:', href, item);
    
    // Always exit project context when navigating via breadcrumbs
    if (isInProjectContext()) {
      exitProjectContext();
    }
    
    // Handle main tab navigation
    const tabMapping = {
      '/dashboard': 0,
      '/projects': 1,
      '/my-work': 2,
      '/tasks': 3,
      '/team': 4,
      '/clients': 5,
      '/procurement': 6,
      '/timeline': 7,
      '/shop-drawings': 8,
      '/material-specs': 9,
      '/activity-feed': 10,
      '/reports': 'reports'
    };
    
    const targetTab = tabMapping[href];
    if (targetTab !== undefined) {
      onTabChange(null, targetTab);
    }
  };

  const getWelcomeMessage = () => {
    const userName = user?.name?.split(' ')[0] || 'User';
    
    // If we're in project context, show project-specific message
    if (isInProjectContext() && currentProjectId) {
      const project = projects.find(p => p.id === currentProjectId);
      if (project) {
        switch (currentSection) {
          case 'overview': return `Project overview and key metrics for ${project.name}`;
          case 'scope': return `Manage project scope and deliverables for ${project.name}`;
          case 'timeline': return `Project timeline and Gantt chart for ${project.name}`;
          case 'drawings': return `Shop drawings and technical documents for ${project.name}`;
          case 'specifications': return `Material specifications and requirements for ${project.name}`;
          case 'compliance': return `Compliance documentation and approvals for ${project.name}`;
          default: return `Project details for ${project.name}`;
        }
      }
      return 'Project management and tracking tools';
    }
    
    // Otherwise show tab-based messages
    switch (currentTab) {
      case 0: return `Welcome back, ${userName}. Here's what's happening.`;
      case 1: return 'Manage and track all your construction projects.';
      case 2: return 'View your assigned projects and personal tasks.';
      case 3: return 'View and manage tasks across all projects.';
      case 4: return 'Manage your team members and assignments.';
      case 5: return 'Manage client information and contacts.';
      case 6: return 'Procurement management and supplier tracking.';
      case 7: return 'Project timelines and Gantt chart overview.';
      case 8: return 'Shop drawings and technical documentation.';
      case 9: return 'Material specifications and requirements.';
      case 10: return 'Track all project updates and team activities in real-time.';
      default: return `Welcome back, ${userName}. Here's what's happening.`;
    }
  };

  const getCurrentTab = () => {
    return currentTab || 0;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: theme.palette.background.default 
    }}>
      {/* Sidebar */}
      <NotionStyleSidebar 
        currentTab={getCurrentTab()} 
        onTabChange={onTabChange}
        user={user}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FBFAF8',
          minHeight: '100vh',
          width: `calc(100vw - ${sidebarCollapsed ? '70px' : '240px'})`,
          transition: 'width 0.3s ease'
        }}
      >
        {/* Enhanced Breadcrumb Header */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            px: 4,
            py: 2,
            minHeight: 60,
            boxShadow: 'none'
          }}
        >
          <Breadcrumbs
            items={getBreadcrumbItems()}
            onNavigate={handleBreadcrumbNavigate}
            currentSection={currentSection}
            showProjectActions={isInProjectContext()}
            onEditProject={() => {
              console.log('Edit project clicked');
              // This will be connected to edit project functionality
            }}
            onProjectSettings={() => {
              console.log('Project settings clicked');
              // This will be connected to project settings functionality
            }}
          />
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