import React, { createContext, useContext, useState, useCallback } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [navigationStack, setNavigationStack] = useState([]);
  const [currentPage, setCurrentPage] = useState({
    title: 'Dashboard',
    path: '/',
    type: 'dashboard'
  });
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);

  // Navigate to a new page and update breadcrumb stack
  const navigateTo = useCallback((pageInfo) => {
    const { title, path, type, parentPath, data } = pageInfo;
    
    setCurrentPage({
      title,
      path,
      type,
      data
    });

    // Build navigation stack based on page type and hierarchy
    const newStack = buildNavigationStack(type, path, parentPath, data);
    setNavigationStack(newStack);
  }, []);

  // Navigate back to a specific breadcrumb level
  const navigateBack = useCallback((targetPath) => {
    if (targetPath) {
      // Find the target in the stack and navigate there
      const targetIndex = navigationStack.findIndex(item => item.href === targetPath);
      if (targetIndex !== -1) {
        const newStack = navigationStack.slice(0, targetIndex + 1);
        setNavigationStack(newStack);
        setCurrentPage(navigationStack[targetIndex]);
      }
    } else {
      // Go back one level
      if (navigationStack.length > 0) {
        const previousPage = navigationStack[navigationStack.length - 1];
        setCurrentPage(previousPage);
        setNavigationStack(navigationStack.slice(0, -1));
      }
    }
  }, [navigationStack]);

  // Build navigation stack based on current location
  const buildNavigationStack = (type, path, parentPath, data) => {
    const stack = [];

    switch (type) {
      case 'projects':
        stack.push({ label: 'Projects', href: '/projects' });
        break;
        
      case 'project-details':
        stack.push({ label: 'Projects', href: '/projects' });
        if (data?.projectName) {
          stack.push({ label: data.projectName, href: `/projects/${data.projectId}` });
        }
        break;
        
      case 'project-page':
        stack.push({ label: 'Projects', href: '/projects' });
        if (data?.projectId) {
          const projectLabel = data?.projectName || `Project ${data.projectId}`;
          stack.push({ label: projectLabel, href: `/projects/${data.projectId}` });
        }
        break;
        
      case 'project-scope':
        stack.push({ label: 'Projects', href: '/projects' });
        if (data?.projectName) {
          stack.push({ label: data.projectName, href: `/projects/${data.projectId}` });
          stack.push({ label: 'Scope Management', href: `/projects/${data.projectId}/scope` });
        }
        break;
        
      case 'add-scope-item':
        stack.push({ label: 'Projects', href: '/projects' });
        if (data?.projectName) {
          stack.push({ label: data.projectName, href: `/projects/${data.projectId}` });
          stack.push({ label: 'Scope Management', href: `/projects/${data.projectId}/scope` });
          stack.push({ label: 'Add Scope Item', href: `/projects/${data.projectId}/scope/add` });
        }
        break;

      case 'tasks':
        stack.push({ label: 'Tasks', href: '/tasks' });
        break;
        
      case 'task-details':
        stack.push({ label: 'Tasks', href: '/tasks' });
        if (data?.taskName) {
          stack.push({ label: data.taskName, href: `/tasks/${data.taskId}` });
        }
        break;
        
      case 'add-task':
        stack.push({ label: 'Tasks', href: '/tasks' });
        stack.push({ label: 'Add New Task', href: '/tasks/add' });
        break;
        
      case 'edit-task':
        stack.push({ label: 'Tasks', href: '/tasks' });
        if (data?.taskName) {
          stack.push({ label: data.taskName, href: `/tasks/${data.taskId}` });
          stack.push({ label: 'Edit Task', href: `/tasks/${data.taskId}/edit` });
        }
        break;

      case 'team':
        stack.push({ label: 'Team', href: '/team' });
        break;
        
      case 'team-member-details':
        stack.push({ label: 'Team', href: '/team' });
        if (data?.memberName) {
          stack.push({ label: data.memberName, href: `/team/${data.memberId}` });
        }
        break;
        
      case 'add-team-member':
        stack.push({ label: 'Team', href: '/team' });
        stack.push({ label: 'Add Team Member', href: '/team/add' });
        break;
        
      case 'edit-team-member':
        stack.push({ label: 'Team', href: '/team' });
        if (data?.memberName) {
          stack.push({ label: data.memberName, href: `/team/${data.memberId}` });
          stack.push({ label: 'Edit Profile', href: `/team/${data.memberId}/edit` });
        }
        break;

      case 'clients':
        stack.push({ label: 'Clients', href: '/clients' });
        break;
        
      case 'client-details':
        stack.push({ label: 'Clients', href: '/clients' });
        if (data?.clientName) {
          stack.push({ label: data.clientName, href: `/clients/${data.clientId}` });
        }
        break;
        
      case 'add-client':
        stack.push({ label: 'Clients', href: '/clients' });
        stack.push({ label: 'Add New Client', href: '/clients/add' });
        break;
        
      case 'edit-client':
        stack.push({ label: 'Clients', href: '/clients' });
        if (data?.clientName) {
          stack.push({ label: data.clientName, href: `/clients/${data.clientId}` });
          stack.push({ label: 'Edit Client', href: `/clients/${data.clientId}/edit` });
        }
        break;

      case 'my-projects':
        stack.push({ label: 'My Work', href: '/my-projects' });
        break;

      case 'dashboard':
      default:
        // Dashboard has no parent navigation
        break;
    }

    return stack;
  };

  // Get current breadcrumb configuration
  const getBreadcrumbConfig = () => {
    return {
      currentPath: navigationStack,
      title: currentPage.title,
      type: currentPage.type,
      data: currentPage.data
    };
  };

  // Project-specific navigation functions
  const navigateToProject = useCallback((projectId, section = 'overview', projectName = null) => {
    setCurrentProjectId(projectId);
    setCurrentSection(section);
    const finalProjectName = projectName || `Project ${projectId}`;
    navigateTo({
      title: `Project ${section}`,
      path: `/project/${projectId}/${section}`,
      type: 'project-page',
      data: { projectId, section, projectName: finalProjectName }
    });
  }, [navigateTo]);

  const navigateToProjectSection = useCallback((section) => {
    if (!currentProjectId) return;
    
    setCurrentSection(section);
    navigateTo({
      title: `Project ${section}`,
      path: `/project/${currentProjectId}/${section}`,
      type: 'project-page',
      data: { projectId: currentProjectId, section, projectName: `Project ${currentProjectId}` }
    });
  }, [currentProjectId, navigateTo]);

  const exitProjectContext = useCallback(() => {
    setCurrentProjectId(null);
    setCurrentSection(null);
    navigateTo({
      title: 'Projects',
      path: '/projects',
      type: 'projects'
    });
  }, [navigateTo]);

  // Get available project sections
  const getProjectSections = useCallback(() => {
    return [
      { id: 'overview', label: 'Overview', icon: '📊', path: 'overview' },
      { id: 'scope', label: 'Scope Management', icon: '📋', path: 'scope' },
      { id: 'timeline', label: 'Timeline & Gantt', icon: '📅', path: 'timeline' },
      { id: 'drawings', label: 'Shop Drawings', icon: '🏗️', path: 'drawings' },
      { id: 'specifications', label: 'Material Specs', icon: '📄', path: 'specifications' },
      { id: 'compliance', label: 'Compliance', icon: '✅', path: 'compliance' }
    ];
  }, []);

  const getCurrentProjectSection = useCallback(() => {
    return currentSection;
  }, [currentSection]);

  const isInProjectContext = useCallback(() => {
    return currentProjectId !== null;
  }, [currentProjectId]);

  // Check if we can navigate back
  const canNavigateBack = () => {
    return navigationStack.length > 0;
  };

  const value = {
    navigationStack,
    currentPage,
    currentProjectId,
    currentSection,
    navigateTo,
    navigateBack,
    navigateToProject,
    navigateToProjectSection,
    exitProjectContext,
    getBreadcrumbConfig,
    getProjectSections,
    getCurrentProjectSection,
    isInProjectContext,
    canNavigateBack
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;