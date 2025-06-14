import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDeferredValue } from 'react';
import { queryKeys } from '../services/queryClient';

// Custom debounce hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Enhanced search hook with multiple data sources
export const useEnhancedSearch = (projects = [], tasks = [], teamMembers = [], clients = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    includeProjects: true,
    includeTasks: true,
    includeTeamMembers: true,
    includeClients: true,
    status: '',
    priority: '',
    dateRange: null,
  });

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Use React's useDeferredValue for better performance
  const deferredSearchTerm = useDeferredValue(debouncedSearchTerm);

  const searchResults = useMemo(() => {
    if (!deferredSearchTerm.trim()) {
      return {
        projects: [],
        tasks: [],
        teamMembers: [],
        clients: [],
        total: 0,
      };
    }

    const searchRegex = new RegExp(deferredSearchTerm.toLowerCase().split(' ').join('|'), 'i');
    
    const matchesSearch = (text) => {
      if (!text) return false;
      return searchRegex.test(text.toLowerCase());
    };

    // Filter projects
    const filteredProjects = searchFilters.includeProjects ? projects.filter(project => {
      const matchesText = (
        matchesSearch(project.name) ||
        matchesSearch(project.description) ||
        matchesSearch(project.type) ||
        matchesSearch(project.status)
      );
      
      const matchesStatus = !searchFilters.status || project.status === searchFilters.status;
      
      return matchesText && matchesStatus;
    }) : [];

    // Filter tasks
    const filteredTasks = searchFilters.includeTasks ? tasks.filter(task => {
      const matchesText = (
        matchesSearch(task.name) ||
        matchesSearch(task.description) ||
        matchesSearch(task.status) ||
        matchesSearch(task.priority)
      );
      
      const matchesStatus = !searchFilters.status || task.status === searchFilters.status;
      const matchesPriority = !searchFilters.priority || task.priority === searchFilters.priority;
      
      return matchesText && matchesStatus && matchesPriority;
    }) : [];

    // Filter team members
    const filteredTeamMembers = searchFilters.includeTeamMembers ? teamMembers.filter(member => {
      return (
        matchesSearch(member.fullName) ||
        matchesSearch(member.email) ||
        matchesSearch(member.role) ||
        matchesSearch(member.department) ||
        matchesSearch(member.position)
      );
    }) : [];

    // Filter clients
    const filteredClients = searchFilters.includeClients ? clients.filter(client => {
      return (
        matchesSearch(client.companyName) ||
        matchesSearch(client.contactName) ||
        matchesSearch(client.contactEmail) ||
        matchesSearch(client.industry)
      );
    }) : [];

    return {
      projects: filteredProjects,
      tasks: filteredTasks,
      teamMembers: filteredTeamMembers,
      clients: filteredClients,
      total: filteredProjects.length + filteredTasks.length + filteredTeamMembers.length + filteredClients.length,
    };
  }, [deferredSearchTerm, projects, tasks, teamMembers, clients, searchFilters]);

  // Search suggestions based on current input
  const suggestions = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) return [];

    const allTerms = [
      ...projects.map(p => [p.name, p.type, p.status]).flat(),
      ...tasks.map(t => [t.name, t.status, t.priority]).flat(),
      ...teamMembers.map(m => [m.fullName, m.role, m.department]).flat(),
      ...clients.map(c => [c.companyName, c.industry]).flat(),
    ].filter(Boolean);

    const uniqueTerms = [...new Set(allTerms)];
    const matchingTerms = uniqueTerms.filter(term => 
      term.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchingTerms.slice(0, 8); // Limit to 8 suggestions
  }, [searchTerm, projects, tasks, teamMembers, clients]);

  // Quick filters for common searches
  const quickFilters = useMemo(() => [
    {
      label: 'Active Projects',
      action: () => {
        setSearchFilters(prev => ({ ...prev, includeProjects: true, status: 'active' }));
        setSearchTerm('');
      },
      count: projects.filter(p => p.status === 'active').length,
    },
    {
      label: 'Overdue Tasks',
      action: () => {
        setSearchFilters(prev => ({ ...prev, includeTasks: true }));
        setSearchTerm('overdue');
      },
      count: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    },
    {
      label: 'High Priority',
      action: () => {
        setSearchFilters(prev => ({ ...prev, includeTasks: true, priority: 'high' }));
        setSearchTerm('');
      },
      count: tasks.filter(t => t.priority === 'high').length,
    },
    {
      label: 'Completed Projects',
      action: () => {
        setSearchFilters(prev => ({ ...prev, includeProjects: true, status: 'completed' }));
        setSearchTerm('');
      },
      count: projects.filter(p => p.status === 'completed').length,
    },
  ], [projects, tasks]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchFilters({
      includeProjects: true,
      includeTasks: true,
      includeTeamMembers: true,
      includeClients: true,
      status: '',
      priority: '',
      dateRange: null,
    });
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchFilters,
    setSearchFilters: updateFilters,
    searchResults,
    suggestions,
    quickFilters,
    clearSearch,
    isSearching: debouncedSearchTerm !== deferredSearchTerm,
    hasResults: searchResults.total > 0,
  };
};

// Hook for searching specific data types
export const useProjectSearch = (projects = [], searchTerm = '', filters = {}) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  return useMemo(() => {
    if (!debouncedSearchTerm.trim() && !Object.values(filters).some(Boolean)) {
      return projects;
    }

    return projects.filter(project => {
      // Text search
      const matchesSearch = !debouncedSearchTerm.trim() || [
        project.name,
        project.description,
        project.type,
        project.status,
      ].some(field => 
        field?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );

      // Filter by status
      const matchesStatus = !filters.status || project.status === filters.status;
      
      // Filter by type
      const matchesType = !filters.type || project.type === filters.type;
      
      // Filter by client
      const matchesClient = !filters.client || project.clientId === filters.client;
      
      // Filter by manager
      const matchesManager = !filters.manager || project.managerId === filters.manager;
      
      // Filter by date range
      const matchesDateRange = !filters.dateRange || (
        filters.dateRange.start && filters.dateRange.end &&
        new Date(project.startDate) >= new Date(filters.dateRange.start) &&
        new Date(project.endDate) <= new Date(filters.dateRange.end)
      );
      
      // Filter by budget range
      const matchesBudget = (!filters.budgetFrom || project.budget >= filters.budgetFrom) &&
                           (!filters.budgetTo || project.budget <= filters.budgetTo);

      return matchesSearch && matchesStatus && matchesType && 
             matchesClient && matchesManager && matchesDateRange && matchesBudget;
    });
  }, [projects, debouncedSearchTerm, filters]);
};

// Hook for task filtering
export const useTaskSearch = (tasks = [], searchTerm = '', filters = {}) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  return useMemo(() => {
    if (!debouncedSearchTerm.trim() && !Object.values(filters).some(Boolean)) {
      return tasks;
    }

    return tasks.filter(task => {
      // Text search
      const matchesSearch = !debouncedSearchTerm.trim() || [
        task.name,
        task.description,
        task.status,
        task.priority,
      ].some(field => 
        field?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );

      // Filter by status
      const matchesStatus = !filters.status || task.status === filters.status;
      
      // Filter by priority
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      
      // Filter by assignee
      const matchesAssignee = !filters.assignee || task.assignedTo === filters.assignee;
      
      // Filter by project
      const matchesProject = !filters.project || task.projectId === filters.project;
      
      // Filter by due date
      const matchesDueDate = !filters.dueDateRange || (
        filters.dueDateRange.start && filters.dueDateRange.end &&
        new Date(task.dueDate) >= new Date(filters.dueDateRange.start) &&
        new Date(task.dueDate) <= new Date(filters.dueDateRange.end)
      );

      return matchesSearch && matchesStatus && matchesPriority && 
             matchesAssignee && matchesProject && matchesDueDate;
    });
  }, [tasks, debouncedSearchTerm, filters]);
};

// Hook for saved search queries
export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState(() => {
    const saved = localStorage.getItem('formula-pm-saved-searches');
    return saved ? JSON.parse(saved) : [];
  });

  const saveSearch = useCallback((name, searchTerm, filters) => {
    const newSearch = {
      id: Date.now(),
      name,
      searchTerm,
      filters,
      createdAt: new Date().toISOString(),
    };
    
    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('formula-pm-saved-searches', JSON.stringify(updated));
  }, [savedSearches]);

  const deleteSearch = useCallback((id) => {
    const updated = savedSearches.filter(search => search.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('formula-pm-saved-searches', JSON.stringify(updated));
  }, [savedSearches]);

  const loadSearch = useCallback((search) => {
    return {
      searchTerm: search.searchTerm,
      filters: search.filters,
    };
  }, []);

  return {
    savedSearches,
    saveSearch,
    deleteSearch,
    loadSearch,
  };
};

// Hook for search history
export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState(() => {
    const history = localStorage.getItem('formula-pm-search-history');
    return history ? JSON.parse(history) : [];
  });

  const addToHistory = useCallback((searchTerm) => {
    if (!searchTerm.trim() || searchHistory.includes(searchTerm)) return;
    
    const updated = [searchTerm, ...searchHistory].slice(0, 10); // Keep last 10 searches
    setSearchHistory(updated);
    localStorage.setItem('formula-pm-search-history', JSON.stringify(updated));
  }, [searchHistory]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('formula-pm-search-history');
  }, []);

  return {
    searchHistory,
    addToHistory,
    clearHistory,
  };
};

export default {
  useEnhancedSearch,
  useProjectSearch,
  useTaskSearch,
  useSavedSearches,
  useSearchHistory,
  useDebounce,
};