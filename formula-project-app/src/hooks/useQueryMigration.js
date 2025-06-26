import { useCallback } from 'react';
import { 
  useProjects, 
  useTasks, 
  useTeamMembers, 
  useClients,
  useStats
} from './useFormulaQuery';
import { useEnhancedSearch } from './useEnhancedSearch';

/**
 * Migration hook that provides the same interface as the old useFormulaData hook
 * but with React Query caching underneath. This allows for gradual migration.
 * 
 * Usage: Replace useFormulaData() with useQueryMigration() in components
 */
export const useQueryMigration = () => {
  // Fetch data using React Query hooks
  const { 
    data: projects = [], 
    isLoading: projectsLoading, 
    error: projectsError,
    refetch: refetchProjects 
  } = useProjects();

  const { 
    data: tasks = [], 
    isLoading: tasksLoading, 
    error: tasksError,
    refetch: refetchTasks 
  } = useTasks();

  const { 
    data: teamMembers = [], 
    isLoading: teamMembersLoading, 
    error: teamMembersError,
    refetch: refetchTeamMembers 
  } = useTeamMembers();

  const { 
    data: clients = [], 
    isLoading: clientsLoading, 
    error: clientsError,
    refetch: refetchClients 
  } = useClients();

  const { 
    data: stats = {}, 
    isLoading: statsLoading, 
    error: statsError 
  } = useStats();

  // Enhanced search functionality
  const searchHooks = useEnhancedSearch(projects, tasks, teamMembers, clients);

  // Calculate overall loading state
  const loading = projectsLoading || tasksLoading || teamMembersLoading || clientsLoading;

  // Combine errors (prioritize the first error encountered)
  const error = projectsError || tasksError || teamMembersError || clientsError || statsError;

  // Lookups for backward compatibility
  const lookups = {
    projectTypes: [
      { value: 'fit-out', label: 'Fit-out' },
      { value: 'mep', label: 'MEP' },
      { value: 'general-contractor', label: 'General Contractor' },
      { value: 'renovation', label: 'Renovation' },
      { value: 'new-construction', label: 'New Construction' },
      { value: 'other', label: 'Other' },
    ],
    taskStatuses: [
      { value: 'todo', label: 'To Do' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'review', label: 'In Review' },
      { value: 'blocked', label: 'Blocked' },
      { value: 'completed', label: 'Completed' },
    ],
    priorities: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'urgent', label: 'Urgent' },
    ],
  };

  // Legacy setter functions (these won't be needed with React Query, but included for compatibility)
  const setProjects = useCallback(() => {
    // setProjects is deprecated. Use React Query mutations instead.
    refetchProjects();
  }, [refetchProjects]);

  const setTasks = useCallback(() => {
    // setTasks is deprecated. Use React Query mutations instead.
    refetchTasks();
  }, [refetchTasks]);

  const setTeamMembers = useCallback(() => {
    // setTeamMembers is deprecated. Use React Query mutations instead.
    refetchTeamMembers();
  }, [refetchTeamMembers]);

  const setClients = useCallback(() => {
    // setClients is deprecated. Use React Query mutations instead.
    refetchClients();
  }, [refetchClients]);

  const setError = useCallback((newError) => {
    // setError is deprecated. Errors are handled automatically by React Query.
    if (newError) {
      console.error('Manual error set:', newError);
    }
  }, []);

  const loadAllData = useCallback(() => {
    // Refreshing all data...
    refetchProjects();
    refetchTasks();
    refetchTeamMembers();
    refetchClients();
  }, [refetchProjects, refetchTasks, refetchTeamMembers, refetchClients]);

  return {
    // Data
    projects,
    tasks,
    teamMembers,
    clients,
    stats,
    lookups,
    
    // States
    loading,
    error: error?.message || null,
    
    // Legacy setters (deprecated)
    setProjects,
    setTasks,
    setTeamMembers,
    setClients,
    setError,
    
    // Utilities
    loadAllData,
    
    // Enhanced search (new feature)
    search: searchHooks,
    
    // React Query specific features
    refetch: {
      projects: refetchProjects,
      tasks: refetchTasks,
      teamMembers: refetchTeamMembers,
      clients: refetchClients,
    },
    
    // Loading states for individual data types
    isLoading: {
      projects: projectsLoading,
      tasks: tasksLoading,
      teamMembers: teamMembersLoading,
      clients: clientsLoading,
      stats: statsLoading,
    },
    
    // Errors for individual data types
    errors: {
      projects: projectsError,
      tasks: tasksError,
      teamMembers: teamMembersError,
      clients: clientsError,
      stats: statsError,
    },
  };
};

/**
 * Simplified hook for specific data fetching with React Query benefits
 */
export const useFormulaData = () => {
  return useQueryMigration();
};

/**
 * Hook for filtered data with enhanced search capabilities
 * This replaces the old useFilteredData hook
 */
export const useFilteredData = (searchTerm = '', filters = {}) => {
  const { projects, tasks, teamMembers, clients, search } = useQueryMigration();
  
  // Use the enhanced search with the provided term and filters
  search.setSearchTerm(searchTerm);
  search.setSearchFilters(filters);
  
  return {
    projects: search.searchResults.projects,
    tasks: search.searchResults.tasks,
    teamMembers: search.searchResults.teamMembers,
    clients: search.searchResults.clients,
    total: search.searchResults.total,
    isSearching: search.isSearching,
    hasResults: search.hasResults,
  };
};

/**
 * Hook for active filters display
 * This replaces the old useActiveFilters hook
 */
export const useActiveFilters = (filters = {}, searchTerm = '', clients = [], teamMembers = []) => {
  const activeFilters = [];
  
  if (searchTerm?.trim()) {
    activeFilters.push({
      type: 'search',
      label: `Search: "${searchTerm}"`,
      value: searchTerm,
    });
  }
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '') {
      let label = key;
      let displayValue = value;
      
      // Custom labels for different filter types
      switch (key) {
        case 'status':
          label = 'Status';
          break;
        case 'type':
          label = 'Type';
          break;
        case 'client':
          label = 'Client';
          const client = clients.find(c => c.id === value);
          displayValue = client ? client.companyName : 'Unknown Client';
          break;
        case 'manager':
          label = 'Manager';
          const manager = teamMembers.find(m => m.id === value);
          displayValue = manager ? manager.fullName : 'Unknown Manager';
          break;
        case 'priority':
          label = 'Priority';
          break;
        default:
          label = key.charAt(0).toUpperCase() + key.slice(1);
      }
      
      activeFilters.push({
        type: key,
        label: `${label}: ${displayValue}`,
        value: value,
      });
    }
  });
  
  return activeFilters;
};

export default {
  useQueryMigration,
  useFormulaData,
  useFilteredData,
  useActiveFilters,
};