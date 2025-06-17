import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDeferredValue } from 'react';

// Custom debounce hook with cleanup
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

// Optimized search matching function - no regex compilation
const createMatchFunction = (searchTerm) => {
  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  if (!lowerSearchTerm) return () => false;
  
  // Split search terms for multi-word matching
  const searchWords = lowerSearchTerm.split(/\s+/).filter(Boolean);
  
  return (text) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    // Use includes() instead of regex for better performance
    return searchWords.every(word => lowerText.includes(word));
  };
};

// Memoized filter functions to prevent recreation
const createProjectFilter = (matchFn, searchFilters) => (project) => {
  const matchesText = (
    matchFn(project.name) ||
    matchFn(project.description) ||
    matchFn(project.type) ||
    matchFn(project.status)
  );
  
  const matchesStatus = !searchFilters.status || project.status === searchFilters.status;
  
  return matchesText && matchesStatus;
};

const createTaskFilter = (matchFn, searchFilters) => (task) => {
  const matchesText = (
    matchFn(task.name) ||
    matchFn(task.description) ||
    matchFn(task.status) ||
    matchFn(task.priority)
  );
  
  const matchesStatus = !searchFilters.status || task.status === searchFilters.status;
  const matchesPriority = !searchFilters.priority || task.priority === searchFilters.priority;
  
  return matchesText && matchesStatus && matchesPriority;
};

const createTeamMemberFilter = (matchFn) => (member) => (
  matchFn(member.fullName) ||
  matchFn(member.email) ||
  matchFn(member.role) ||
  matchFn(member.department) ||
  matchFn(member.position)
);

const createClientFilter = (matchFn) => (client) => (
  matchFn(client.companyName) ||
  matchFn(client.contactName) ||
  matchFn(client.contactEmail) ||
  matchFn(client.industry)
);

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

  // Memoize the search function to prevent recreation
  const matchFunction = useMemo(() => 
    createMatchFunction(deferredSearchTerm), 
    [deferredSearchTerm]
  );

  // Memoize filter functions
  const projectFilter = useMemo(() => 
    createProjectFilter(matchFunction, searchFilters),
    [matchFunction, searchFilters]
  );

  const taskFilter = useMemo(() => 
    createTaskFilter(matchFunction, searchFilters),
    [matchFunction, searchFilters]
  );

  const teamMemberFilter = useMemo(() => 
    createTeamMemberFilter(matchFunction),
    [matchFunction]
  );

  const clientFilter = useMemo(() => 
    createClientFilter(matchFunction),
    [matchFunction]
  );

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

    // Use optimized filter functions
    const filteredProjects = searchFilters.includeProjects 
      ? projects.filter(projectFilter) 
      : [];

    const filteredTasks = searchFilters.includeTasks 
      ? tasks.filter(taskFilter) 
      : [];

    const filteredTeamMembers = searchFilters.includeTeamMembers 
      ? teamMembers.filter(teamMemberFilter) 
      : [];

    const filteredClients = searchFilters.includeClients 
      ? clients.filter(clientFilter) 
      : [];

    return {
      projects: filteredProjects,
      tasks: filteredTasks,
      teamMembers: filteredTeamMembers,
      clients: filteredClients,
      total: filteredProjects.length + filteredTasks.length + filteredTeamMembers.length + filteredClients.length,
    };
  }, [deferredSearchTerm, projects, tasks, teamMembers, clients, projectFilter, taskFilter, teamMemberFilter, clientFilter, searchFilters]);

  // Optimized search suggestions with memoized term extraction
  const allSearchableTerms = useMemo(() => {
    const terms = new Set();
    
    // Extract terms efficiently without intermediate arrays
    projects.forEach(p => {
      if (p.name) terms.add(p.name);
      if (p.type) terms.add(p.type);
      if (p.status) terms.add(p.status);
    });
    
    tasks.forEach(t => {
      if (t.name) terms.add(t.name);
      if (t.status) terms.add(t.status);
      if (t.priority) terms.add(t.priority);
    });
    
    teamMembers.forEach(m => {
      if (m.fullName) terms.add(m.fullName);
      if (m.role) terms.add(m.role);
      if (m.department) terms.add(m.department);
    });
    
    clients.forEach(c => {
      if (c.companyName) terms.add(c.companyName);
      if (c.industry) terms.add(c.industry);
    });
    
    return Array.from(terms);
  }, [projects, tasks, teamMembers, clients]);

  const suggestions = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) return [];
    
    const searchLower = searchTerm.toLowerCase();
    const matching = allSearchableTerms
      .filter(term => term.toLowerCase().includes(searchLower))
      .slice(0, 8); // Limit early for better performance
    
    return matching;
  }, [searchTerm, allSearchableTerms]);

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

// Optimized project search hook with memoized filters
export const useProjectSearch = (projects = [], searchTerm = '', filters = {}) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Memoize the search function to prevent recreation
  const searchFunction = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return () => true;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (project) => {
      return [
        project.name,
        project.description,
        project.type,
        project.status,
      ].some(field => field?.toLowerCase().includes(searchLower));
    };
  }, [debouncedSearchTerm]);
  
  // Memoize filter checks
  const filterFunction = useMemo(() => {
    const hasFilters = Object.values(filters).some(Boolean);
    if (!hasFilters) return () => true;
    
    return (project) => {
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

      return matchesStatus && matchesType && matchesClient && 
             matchesManager && matchesDateRange && matchesBudget;
    };
  }, [filters]);
  
  return useMemo(() => {
    return projects.filter(project => 
      searchFunction(project) && filterFunction(project)
    );
  }, [projects, searchFunction, filterFunction]);
};

// Optimized task search hook with memoized filters
export const useTaskSearch = (tasks = [], searchTerm = '', filters = {}) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Memoize the search function
  const searchFunction = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return () => true;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (task) => {
      return [
        task.name,
        task.description,
        task.status,
        task.priority,
      ].some(field => field?.toLowerCase().includes(searchLower));
    };
  }, [debouncedSearchTerm]);
  
  // Memoize filter checks
  const filterFunction = useMemo(() => {
    const hasFilters = Object.values(filters).some(Boolean);
    if (!hasFilters) return () => true;
    
    return (task) => {
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

      return matchesStatus && matchesPriority && 
             matchesAssignee && matchesProject && matchesDueDate;
    };
  }, [filters]);
  
  return useMemo(() => {
    return tasks.filter(task => 
      searchFunction(task) && filterFunction(task)
    );
  }, [tasks, searchFunction, filterFunction]);
};

// Hook for saved search queries with proper cleanup
export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('formula-pm-saved-searches');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Failed to parse saved searches from localStorage:', error);
      return [];
    }
  });

  const saveSearch = useCallback((name, searchTerm, filters) => {
    try {
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
    } catch (error) {
      console.warn('Failed to save search to localStorage:', error);
    }
  }, [savedSearches]);

  const deleteSearch = useCallback((id) => {
    try {
      const updated = savedSearches.filter(search => search.id !== id);
      setSavedSearches(updated);
      localStorage.setItem('formula-pm-saved-searches', JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to delete search from localStorage:', error);
    }
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

// Hook for search history with proper error handling
export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const history = localStorage.getItem('formula-pm-search-history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.warn('Failed to parse search history from localStorage:', error);
      return [];
    }
  });

  const addToHistory = useCallback((searchTerm) => {
    if (!searchTerm.trim() || searchHistory.includes(searchTerm)) return;
    
    try {
      const updated = [searchTerm, ...searchHistory].slice(0, 10); // Keep last 10 searches
      setSearchHistory(updated);
      localStorage.setItem('formula-pm-search-history', JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save search history to localStorage:', error);
    }
  }, [searchHistory]);

  const clearHistory = useCallback(() => {
    try {
      setSearchHistory([]);
      localStorage.removeItem('formula-pm-search-history');
    } catch (error) {
      console.warn('Failed to clear search history from localStorage:', error);
    }
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