import { useState, useEffect, useCallback, useMemo } from 'react';
import apiService from '../services/api/apiService';

// MIGRATION NOTE: This hook is being phased out in favor of React Query hooks
// For new components, use useQueryMigration from './useQueryMigration' instead
// This hook will be maintained for backward compatibility during the migration period

// Check if React Query is available and should be used
const shouldUseReactQuery = process.env.REACT_APP_USE_REACT_QUERY !== 'false';

// TODO: Re-enable React Query migration when ready
// let useQueryMigration = null;
// if (shouldUseReactQuery) {
//   try {
//     // Dynamically import the new hook if available
//     const queryMigrationModule = require('./useQueryMigration');
//     useQueryMigration = queryMigrationModule.useQueryMigration;
//   } catch (error) {
//     console.warn('React Query migration hook not available, falling back to legacy implementation');
//   }
// }

// Legacy hook implementation (will be deprecated)
export const useFormulaDataLegacy = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized data loading function
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [teamMembersData, projectsData, tasksData, clientsData] = await Promise.all([
        apiService.getTeamMembers(),
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getClients()
      ]);
      
      setTeamMembers(teamMembersData);
      setProjects(projectsData);
      setTasks(tasksData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data from server. Please check if the backend is running.');
      
      // Fallback to localStorage if API fails
      const savedProjects = localStorage.getItem('formula_projects');
      const savedTasks = localStorage.getItem('formula_tasks');
      const savedTeamMembers = localStorage.getItem('formula_team_members');
      const savedClients = localStorage.getItem('formula_clients');
      
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedTeamMembers) setTeamMembers(JSON.parse(savedTeamMembers));
      if (savedClients) setClients(JSON.parse(savedClients));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Memoized computed values to prevent unnecessary re-calculations
  const stats = useMemo(() => ({
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    overdueTasksCount: tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate < new Date() && t.status !== 'completed';
    }).length,
    totalTeamMembers: teamMembers.length,
    activeTeamMembers: teamMembers.filter(tm => tm.status === 'active').length
  }), [projects, tasks, teamMembers]);

  // Memoized lookup functions for better performance
  const lookups = useMemo(() => ({
    getProjectById: (id) => projects.find(p => p.id === id),
    getTaskById: (id) => tasks.find(t => t.id === id),
    getTeamMemberById: (id) => teamMembers.find(tm => tm.id === id),
    getClientById: (id) => clients.find(c => c.id === id),
    getTasksByProject: (projectId) => tasks.filter(t => t.projectId === projectId),
    getTasksByMember: (memberId) => tasks.filter(t => t.assignedTo === memberId)
  }), [projects, tasks, teamMembers, clients]);

  return {
    // Data
    projects,
    tasks,
    teamMembers,
    clients,
    
    // State
    loading,
    error,
    
    // Computed values
    stats,
    lookups,
    
    // Actions
    setProjects,
    setTasks,
    setTeamMembers,
    setClients,
    setError,
    loadAllData
  };
};

// Main hook that uses legacy implementation for now
// TODO: Migrate to React Query hooks when ready
export const useFormulaData = () => {
  // For now, just use the legacy implementation to avoid hook rule violations
  if (process.env.NODE_ENV === 'development') {
    console.log('Using legacy implementation for data fetching');
  }
  return useFormulaDataLegacy();
};

// Custom hook for filtering with debouncing
export const useFilteredData = (data, filters, searchTerm, debounceMs = 300) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.filter(item => {
      // Search term matching
      const matchesSearch = !debouncedSearchTerm || 
        (item.name && item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        (item.companyName && item.companyName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        (item.fullName && item.fullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

      // Filter matching
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value === '') return true;
        
        if (typeof value === 'string') {
          return item[key] === value;
        }
        
        if (value instanceof Date) {
          const itemDate = item[key] ? new Date(item[key]) : null;
          return itemDate && itemDate >= value;
        }
        
        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, filters, debouncedSearchTerm]);

  return filteredData;
};

// Custom hook for managing active filters display
export const useActiveFilters = (filters, searchTerm, clients = [], teamMembers = []) => {
  return useMemo(() => {
    const activeFilters = Object.entries(filters)
      .filter(([key, value]) => {
        if (typeof value === 'string') return value !== '';
        if (value instanceof Date) return true;
        return value !== null && value !== undefined;
      })
      .map(([key, value]) => {
        let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        let displayValue = value;
        
        if (key === 'client') {
          const client = clients.find(c => c.id === value);
          displayValue = client ? client.companyName : value;
        } else if (key === 'manager' || key === 'assignedTo') {
          const member = teamMembers.find(tm => tm.id === value);
          displayValue = member ? member.fullName : value;
        } else if (key.includes('Date') && value instanceof Date) {
          displayValue = value.toLocaleDateString();
        } else if (key.includes('budget') && value) {
          displayValue = `$${value}`;
        }
        
        return { key, label, value: displayValue };
      });

    if (searchTerm) {
      activeFilters.push({ key: 'search', label: 'Search', value: searchTerm });
    }

    return activeFilters;
  }, [filters, searchTerm, clients, teamMembers]);
};