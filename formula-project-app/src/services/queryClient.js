import { QueryClient } from '@tanstack/react-query';

// Create a React Query client with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long until data is considered stale (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // Cache time: how long unused data stays in cache (10 minutes)
      cacheTime: 10 * 60 * 1000,
      
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (useful for real-time updates)
      refetchOnWindowFocus: true,
      
      // Refetch on reconnect after network issues
      refetchOnReconnect: true,
      
      // Background refetch interval (disabled by default)
      refetchInterval: false,
      
      // Keep previous data while fetching new data (better UX)
      keepPreviousData: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      
      // Mutation cache time (shorter than queries)
      cacheTime: 5 * 60 * 1000,
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  // Projects
  projects: ['projects'],
  project: (id) => ['projects', id],
  projectScope: (id) => ['projects', id, 'scope'],
  
  // Tasks
  tasks: ['tasks'],
  task: (id) => ['tasks', id],
  tasksByProject: (projectId) => ['tasks', 'project', projectId],
  tasksByAssignee: (userId) => ['tasks', 'assignee', userId],
  
  // Team Members
  teamMembers: ['teamMembers'],
  teamMember: (id) => ['teamMembers', id],
  teamMemberTasks: (id) => ['teamMembers', id, 'tasks'],
  
  // Clients
  clients: ['clients'],
  client: (id) => ['clients', id],
  clientProjects: (id) => ['clients', id, 'projects'],
  
  // Analytics & Stats
  stats: ['stats'],
  projectStats: (id) => ['stats', 'project', id],
  teamStats: ['stats', 'team'],
  
  // Search
  search: (term) => ['search', term],
  globalSearch: (term) => ['search', 'global', term],
};

// Helper function to invalidate related queries
export const invalidateQueries = {
  // Invalidate all project-related data
  projects: () => {
    queryClient.invalidateQueries(queryKeys.projects);
    queryClient.invalidateQueries(queryKeys.stats);
    queryClient.invalidateQueries(queryKeys.teamStats);
  },
  
  // Invalidate specific project and related data
  project: (projectId) => {
    queryClient.invalidateQueries(queryKeys.project(projectId));
    queryClient.invalidateQueries(queryKeys.projectScope(projectId));
    queryClient.invalidateQueries(queryKeys.tasksByProject(projectId));
    queryClient.invalidateQueries(queryKeys.projects);
    queryClient.invalidateQueries(queryKeys.stats);
  },
  
  // Invalidate all task-related data
  tasks: () => {
    queryClient.invalidateQueries(queryKeys.tasks);
    queryClient.invalidateQueries(queryKeys.stats);
    queryClient.invalidateQueries(queryKeys.teamStats);
  },
  
  // Invalidate specific task and related data
  task: (taskId, projectId, assigneeId) => {
    queryClient.invalidateQueries(queryKeys.task(taskId));
    queryClient.invalidateQueries(queryKeys.tasks);
    if (projectId) {
      queryClient.invalidateQueries(queryKeys.tasksByProject(projectId));
    }
    if (assigneeId) {
      queryClient.invalidateQueries(queryKeys.tasksByAssignee(assigneeId));
      queryClient.invalidateQueries(queryKeys.teamMemberTasks(assigneeId));
    }
    queryClient.invalidateQueries(queryKeys.stats);
  },
  
  // Invalidate team member data
  teamMembers: () => {
    queryClient.invalidateQueries(queryKeys.teamMembers);
    queryClient.invalidateQueries(queryKeys.teamStats);
  },
  
  teamMember: (memberId) => {
    queryClient.invalidateQueries(queryKeys.teamMember(memberId));
    queryClient.invalidateQueries(queryKeys.teamMemberTasks(memberId));
    queryClient.invalidateQueries(queryKeys.teamMembers);
    queryClient.invalidateQueries(queryKeys.teamStats);
  },
  
  // Invalidate client data
  clients: () => {
    queryClient.invalidateQueries(queryKeys.clients);
  },
  
  client: (clientId) => {
    queryClient.invalidateQueries(queryKeys.client(clientId));
    queryClient.invalidateQueries(queryKeys.clientProjects(clientId));
    queryClient.invalidateQueries(queryKeys.clients);
  },
  
  // Clear all search results
  search: () => {
    queryClient.invalidateQueries(['search']);
  },
  
  // Clear all cached data (use sparingly)
  all: () => {
    queryClient.clear();
  },
};

// Prefetch helpers for better performance
export const prefetchQueries = {
  // Prefetch projects when user is likely to navigate there
  projects: async () => {
    await queryClient.prefetchQuery(queryKeys.projects, () => 
      import('../services/api/apiService').then(module => module.default.getProjects())
    );
  },
  
  // Prefetch project details
  project: async (projectId) => {
    await queryClient.prefetchQuery(queryKeys.project(projectId), () =>
      import('../services/api/apiService').then(module => module.default.getProject(projectId))
    );
  },
  
  // Prefetch tasks for a project
  projectTasks: async (projectId) => {
    await queryClient.prefetchQuery(queryKeys.tasksByProject(projectId), () =>
      import('../services/api/apiService').then(module => module.default.getTasks())
        .then(tasks => tasks.filter(task => task.projectId === projectId))
    );
  },
};

// Error handling utilities
export const errorHandling = {
  // Global error handler for queries
  onError: (error, query) => {
    console.error('Query error:', error, query);
    
    // You could integrate with error reporting service here
    // Example: errorReportingService.log(error, { query: query.queryKey });
    
    // Show user-friendly error message based on error type
    if (error.code === 'NETWORK_ERROR') {
      // Handle network errors
      // Network error detected, will retry automatically
    } else if (error.status === 401) {
      // Handle authentication errors
      // Authentication error, redirecting to login
      // window.location.href = '/login';
    } else if (error.status >= 500) {
      // Handle server errors
      // Server error detected
    }
  },
  
  // Global error handler for mutations
  onMutationError: (error, variables, context, mutation) => {
    console.error('Mutation error:', error, { variables, context, mutation });
    
    // Handle specific mutation errors
    if (mutation.meta?.errorMessage) {
      // Show custom error message
      // Show mutation error message
    }
  },
};

// Performance monitoring
export const performanceMonitoring = {
  // Track query performance
  onSuccess: (data, query) => {
    if (import.meta.env.MODE === 'development') {
      // Query completed successfully
    }
  },
  
  // Track slow queries
  onSettled: (data, error, query) => {
    const duration = Date.now() - query.state.fetchFailureReason?.timestamp;
    if (duration > 5000) { // Queries taking more than 5 seconds
      // Slow query detected
    }
  },
};

export default queryClient;