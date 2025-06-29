import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, Typography, useTheme as useMuiTheme } from '@mui/material';
import NotionStyleSidebar from './NotionStyleSidebar';
import Breadcrumbs from '../navigation/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

const ModernDashboardLayout = ({ projects = [] }) => {
  const { user } = useAuth();
  const location = useLocation();
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
    
    // Otherwise derive from route
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/projects')) return 'All Projects';
    if (path.startsWith('/my-work')) return 'My Work';
    if (path.startsWith('/tasks')) return 'Tasks';
    if (path.startsWith('/team')) return 'Team';
    if (path.startsWith('/clients')) return 'Clients';
    if (path.startsWith('/procurement')) return 'Procurement';
    if (path.startsWith('/timeline')) return 'Timeline';
    if (path.startsWith('/shop-drawings')) return 'Shop Drawings';
    if (path.startsWith('/material-specs')) return 'Material Specs';
    if (path.startsWith('/activity')) return 'Activity Feed';
    return 'Dashboard';
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
    
    // Otherwise derive from route
    const currentTab = getCurrentTab();
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
    // Breadcrumb navigation with React Router
    
    // Always exit project context when navigating via breadcrumbs
    if (isInProjectContext()) {
      exitProjectContext();
    }
    
    // React Router will handle the navigation automatically through Link components
    // in the Breadcrumbs component
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
    
    // Otherwise derive from route
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return `Welcome back, ${userName}. Here's what's happening.`;
    if (path.startsWith('/projects')) return 'Manage and track all your construction projects.';
    if (path.startsWith('/my-work')) return 'View your assigned projects and personal tasks.';
    if (path.startsWith('/tasks')) return 'View and manage tasks across all projects.';
    if (path.startsWith('/team')) return 'Manage your team members and assignments.';
    if (path.startsWith('/clients')) return 'Manage client information and contacts.';
    if (path.startsWith('/procurement')) return 'Procurement management and supplier tracking.';
    if (path.startsWith('/timeline')) return 'Project timelines and Gantt chart overview.';
    if (path.startsWith('/shop-drawings')) return 'Shop drawings and technical documentation.';
    if (path.startsWith('/material-specs')) return 'Material specifications and requirements.';
    if (path.startsWith('/activity')) return 'Track all project updates and team activities in real-time.';
    return `Welcome back, ${userName}. Here's what's happening.`;
  };

  const getCurrentTab = () => {
    // Derive current tab from route
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 0;
    if (path.startsWith('/projects')) return 1;
    if (path.startsWith('/my-work')) return 2;
    if (path.startsWith('/tasks')) return 3;
    if (path.startsWith('/team')) return 4;
    if (path.startsWith('/clients')) return 5;
    if (path.startsWith('/procurement')) return 6;
    if (path.startsWith('/timeline')) return 7;
    if (path.startsWith('/shop-drawings')) return 8;
    if (path.startsWith('/material-specs')) return 9;
    if (path.startsWith('/activity')) return 10;
    return 0;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundPalette: theme.palette.background.default 
    }}>
      {/* Sidebar */}
      <NotionStyleSidebar 
        currentTab={getCurrentTab()} 
        onTabChange={() => {}} // No longer needed with router navigation
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
          backgroundPalette: '#FBFAF8',
          minHeight: '100vh',
          width: `calc(100vw - ${sidebarCollapsed ? '70px' : '240px'})`,
          transition: 'width 0.3s ease'
        }}
      >
        {/* Enhanced Breadcrumb Header */}
        <Box
          sx={{
            backgroundPalette: theme.palette.background.paper,
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
              // Edit project clicked
              // This will be connected to edit project functionality
            }}
            onProjectSettings={() => {
              // Project settings clicked
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
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default ModernDashboardLayout;