import { useState, useCallback, useEffect } from 'react';
import { useAuthenticatedData } from './useAuthenticatedData';
import { useEnhancedSearch } from './useEnhancedSearch';
import { useNavigation } from '../context/NavigationContext';
import { useFilteredData, useActiveFilters } from './useFormula';
import { notificationService } from '../services/notifications/notificationService';

/**
 * Custom hook to manage all application state
 * Consolidates state management for better performance
 */
export const useAppState = () => {
  // Core data hooks
  const {
    projects,
    tasks,
    teamMembers,
    clients,
    loading,
    error,
    stats,
    setProjects,
    setTasks,
    setTeamMembers,
    setClients,
    setError,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addClient,
    updateClient,
    deleteClient
  } = useAuthenticatedData();

  // Navigation context
  const { 
    currentProjectId, 
    isInProjectContext, 
    navigateToProject,
    exitProjectContext 
  } = useNavigation();

  // Initialize notification service
  useEffect(() => {
    if (teamMembers.length > 0 && projects.length > 0 && tasks.length > 0) {
      notificationService.init(teamMembers, projects, tasks);
      
      return () => {
        notificationService.destroy();
      };
    }
  }, [teamMembers, projects, tasks]);

  // Consolidated dialog state for better performance
  const [dialogState, setDialogState] = useState({
    currentTab: 0,
    createProjectDialogOpen: false,
    editProjectDialogOpen: false,
    viewProjectDialogOpen: false,
    selectedProjectForEdit: null,
    selectedProjectForView: null,
    scopeDialogOpen: false,
    selectedProjectForScope: null,
    addTeamMemberDialogOpen: false,
    addClientDialogOpen: false,
    addTaskDialogOpen: false,
    editTaskDialogOpen: false,
    viewTaskDialogOpen: false,
    selectedTaskForEdit: null,
    selectedTaskForView: null,
    teamMemberDetailOpen: false,
    selectedMemberForDetail: null,
    globalSearch: ''
  });

  // Helper function to update dialog state
  const updateDialogState = useCallback((updates) => {
    setDialogState(prev => ({ ...prev, ...updates }));
  }, []);

  // Full-page navigation state
  const [currentPage, setCurrentPage] = useState('main');
  const [currentFormData, setCurrentFormData] = useState(null);
  
  // Navigation helpers
  const navigateToMain = useCallback(() => {
    setCurrentPage('main');
    setCurrentFormData(null);
  }, []);

  // Enhanced search with debouncing
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    quickFilters,
    isSearching,
  } = useEnhancedSearch(projects, tasks, teamMembers, clients);
  
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Projects view state
  const [projectsViewMode, setProjectsViewMode] = useState(
    localStorage.getItem('projectsViewMode') || 'board'
  );
  const [tasksViewMode, setTasksViewMode] = useState(
    localStorage.getItem('tasksViewMode') || 'table'
  );
  const [teamViewMode, setTeamViewMode] = useState(
    localStorage.getItem('teamViewMode') || 'card'
  );
  const [clientsViewMode, setClientsViewMode] = useState(
    localStorage.getItem('clientsViewMode') || 'card'
  );
  const [projectsSearchTerm, setProjectsSearchTerm] = useState('');
  const [showProjectsFilters, setShowProjectsFilters] = useState(false);
  const [projectsFilters, setProjectsFilters] = useState({
    status: '',
    type: '',
    client: '',
    manager: '',
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null,
    budgetFrom: '',
    budgetTo: ''
  });

  // Use custom filtering hook for better performance
  const filteredProjects = useFilteredData(projects, projectsFilters, projectsSearchTerm);
  const activeFilters = useActiveFilters(projectsFilters, projectsSearchTerm, clients, teamMembers);

  return {
    // Core data
    projects,
    tasks,
    teamMembers,
    clients,
    loading,
    error,
    stats,
    setProjects,
    setTasks,
    setTeamMembers,
    setClients,
    setError,
    
    // Data operations
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addClient,
    updateClient,
    deleteClient,
    
    // Navigation
    currentProjectId,
    isInProjectContext,
    navigateToProject,
    exitProjectContext,
    currentPage,
    setCurrentPage,
    currentFormData,
    setCurrentFormData,
    navigateToMain,
    
    // Dialog state
    dialogState,
    updateDialogState,
    
    // Search
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    quickFilters,
    isSearching,
    showSearchResults,
    setShowSearchResults,
    
    // View modes
    projectsViewMode,
    setProjectsViewMode,
    tasksViewMode,
    setTasksViewMode,
    teamViewMode,
    setTeamViewMode,
    clientsViewMode,
    setClientsViewMode,
    
    // Projects filters
    projectsSearchTerm,
    setProjectsSearchTerm,
    showProjectsFilters,
    setShowProjectsFilters,
    projectsFilters,
    setProjectsFilters,
    filteredProjects,
    activeFilters
  };
};