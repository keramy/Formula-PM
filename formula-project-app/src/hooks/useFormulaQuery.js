import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api/apiService';
import { queryKeys, invalidateQueries } from '../services/queryClient';

// ============================================
// PROJECT HOOKS
// ============================================

export const useProjects = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: apiService.getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useProject = (projectId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: () => apiService.getProject(projectId),
    enabled: !!projectId,
    ...options,
  });
};

export const useCreateProject = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createProject,
    onSuccess: (newProject) => {
      // Add the new project to the cache
      queryClient.setQueryData(queryKeys.projects, (oldProjects) => {
        return oldProjects ? [...oldProjects, newProject] : [newProject];
      });
      
      // Invalidate related queries
      invalidateQueries.projects();
      
      // Call custom success handler
      options.onSuccess?.(newProject);
    },
    onError: (error) => {
      console.error('Failed to create project:', error);
      options.onError?.(error);
    },
    meta: {
      errorMessage: 'Failed to create project. Please try again.',
    },
  });
};

export const useUpdateProject = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...updates }) => apiService.updateProject(id, updates),
    onSuccess: (updatedProject) => {
      // Update the project in the projects list
      queryClient.setQueryData(queryKeys.projects, (oldProjects) => {
        return oldProjects?.map(project => 
          project.id === updatedProject.id ? updatedProject : project
        );
      });
      
      // Update the individual project cache
      queryClient.setQueryData(queryKeys.project(updatedProject.id), updatedProject);
      
      // Invalidate related queries
      invalidateQueries.project(updatedProject.id);
      
      options.onSuccess?.(updatedProject);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to update project. Please try again.',
    },
  });
};

export const useDeleteProject = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.deleteProject,
    onSuccess: (_, deletedProjectId) => {
      // Remove project from cache
      queryClient.setQueryData(queryKeys.projects, (oldProjects) => {
        return oldProjects?.filter(project => project.id !== deletedProjectId);
      });
      
      // Remove individual project cache
      queryClient.removeQueries(queryKeys.project(deletedProjectId));
      
      // Invalidate related queries
      invalidateQueries.projects();
      
      options.onSuccess?.(deletedProjectId);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to delete project. Please try again.',
    },
  });
};

// ============================================
// TASK HOOKS
// ============================================

export const useTasks = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: apiService.getTasks,
    staleTime: 2 * 60 * 1000, // 2 minutes (tasks change more frequently)
    ...options,
  });
};

export const useTask = (taskId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.task(taskId),
    queryFn: () => apiService.getTask(taskId),
    enabled: !!taskId,
    ...options,
  });
};

export const useTasksByProject = (projectId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.tasksByProject(projectId),
    queryFn: async () => {
      const allTasks = await apiService.getTasks();
      return allTasks.filter(task => task.projectId === projectId);
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useTasksByAssignee = (userId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.tasksByAssignee(userId),
    queryFn: async () => {
      const allTasks = await apiService.getTasks();
      return allTasks.filter(task => task.assignedTo === userId);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useCreateTask = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createTask,
    onSuccess: (newTask) => {
      // Add to tasks cache
      queryClient.setQueryData(queryKeys.tasks, (oldTasks) => {
        return oldTasks ? [...oldTasks, newTask] : [newTask];
      });
      
      // Invalidate related queries
      invalidateQueries.task(newTask.id, newTask.projectId, newTask.assignedTo);
      
      options.onSuccess?.(newTask);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to create task. Please try again.',
    },
  });
};

export const useUpdateTask = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...updates }) => apiService.updateTask(id, updates),
    onSuccess: (updatedTask) => {
      // Update tasks cache
      queryClient.setQueryData(queryKeys.tasks, (oldTasks) => {
        return oldTasks?.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      });
      
      // Update individual task cache
      queryClient.setQueryData(queryKeys.task(updatedTask.id), updatedTask);
      
      // Invalidate related queries
      invalidateQueries.task(updatedTask.id, updatedTask.projectId, updatedTask.assignedTo);
      
      options.onSuccess?.(updatedTask);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to update task. Please try again.',
    },
  });
};

export const useDeleteTask = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.deleteTask,
    onSuccess: (_, deletedTaskId) => {
      // Remove from cache
      queryClient.setQueryData(queryKeys.tasks, (oldTasks) => {
        return oldTasks?.filter(task => task.id !== deletedTaskId);
      });
      
      // Remove individual task cache
      queryClient.removeQueries(queryKeys.task(deletedTaskId));
      
      // Invalidate related queries
      invalidateQueries.tasks();
      
      options.onSuccess?.(deletedTaskId);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to delete task. Please try again.',
    },
  });
};

// ============================================
// TEAM MEMBER HOOKS
// ============================================

export const useTeamMembers = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.teamMembers,
    queryFn: apiService.getTeamMembers,
    staleTime: 10 * 60 * 1000, // 10 minutes (team data changes less frequently)
    ...options,
  });
};

export const useTeamMember = (memberId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.teamMember(memberId),
    queryFn: () => apiService.getTeamMember(memberId),
    enabled: !!memberId,
    ...options,
  });
};

export const useTeamMemberTasks = (memberId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.teamMemberTasks(memberId),
    queryFn: async () => {
      const allTasks = await apiService.getTasks();
      return allTasks.filter(task => task.assignedTo === memberId);
    },
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useCreateTeamMember = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createTeamMember,
    onSuccess: (newMember) => {
      queryClient.setQueryData(queryKeys.teamMembers, (oldMembers) => {
        return oldMembers ? [...oldMembers, newMember] : [newMember];
      });
      
      invalidateQueries.teamMembers();
      options.onSuccess?.(newMember);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to add team member. Please try again.',
    },
  });
};

export const useUpdateTeamMember = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...updates }) => apiService.updateTeamMember(id, updates),
    onSuccess: (updatedMember) => {
      queryClient.setQueryData(queryKeys.teamMembers, (oldMembers) => {
        return oldMembers?.map(member => 
          member.id === updatedMember.id ? updatedMember : member
        );
      });
      
      queryClient.setQueryData(queryKeys.teamMember(updatedMember.id), updatedMember);
      invalidateQueries.teamMember(updatedMember.id);
      
      options.onSuccess?.(updatedMember);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to update team member. Please try again.',
    },
  });
};

export const useDeleteTeamMember = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.deleteTeamMember,
    onSuccess: (_, deletedMemberId) => {
      queryClient.setQueryData(queryKeys.teamMembers, (oldMembers) => {
        return oldMembers?.filter(member => member.id !== deletedMemberId);
      });
      
      queryClient.removeQueries(queryKeys.teamMember(deletedMemberId));
      invalidateQueries.teamMembers();
      
      options.onSuccess?.(deletedMemberId);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to delete team member. Please try again.',
    },
  });
};

// ============================================
// CLIENT HOOKS
// ============================================

export const useClients = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.clients,
    queryFn: apiService.getClients,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useClient = (clientId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.client(clientId),
    queryFn: () => apiService.getClient(clientId),
    enabled: !!clientId,
    ...options,
  });
};

export const useCreateClient = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createClient,
    onSuccess: (newClient) => {
      queryClient.setQueryData(queryKeys.clients, (oldClients) => {
        return oldClients ? [...oldClients, newClient] : [newClient];
      });
      
      invalidateQueries.clients();
      options.onSuccess?.(newClient);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to create client. Please try again.',
    },
  });
};

export const useUpdateClient = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...updates }) => apiService.updateClient(id, updates),
    onSuccess: (updatedClient) => {
      queryClient.setQueryData(queryKeys.clients, (oldClients) => {
        return oldClients?.map(client => 
          client.id === updatedClient.id ? updatedClient : client
        );
      });
      
      queryClient.setQueryData(queryKeys.client(updatedClient.id), updatedClient);
      invalidateQueries.client(updatedClient.id);
      
      options.onSuccess?.(updatedClient);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to update client. Please try again.',
    },
  });
};

export const useDeleteClient = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.deleteClient,
    onSuccess: (_, deletedClientId) => {
      queryClient.setQueryData(queryKeys.clients, (oldClients) => {
        return oldClients?.filter(client => client.id !== deletedClientId);
      });
      
      queryClient.removeQueries(queryKeys.client(deletedClientId));
      invalidateQueries.clients();
      
      options.onSuccess?.(deletedClientId);
    },
    onError: options.onError,
    meta: {
      errorMessage: 'Failed to delete client. Please try again.',
    },
  });
};

// ============================================
// ANALYTICS & STATS HOOKS
// ============================================

export const useStats = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: async () => {
      // Fetch all necessary data for stats calculation
      const [projects, tasks, teamMembers, clients] = await Promise.all([
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getTeamMembers(),
        apiService.getClients(),
      ]);
      
      // Calculate stats
      return {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        overdueTasks: tasks.filter(t => 
          new Date(t.dueDate) < new Date() && t.status !== 'completed'
        ).length,
        totalTeamMembers: teamMembers.length,
        totalClients: clients.length,
        avgProjectProgress: projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// ============================================
// OPTIMISTIC UPDATE HELPERS
// ============================================

export const useOptimisticTaskUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...updates }) => apiService.updateTask(id, updates),
    onMutate: async ({ id, ...updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(queryKeys.tasks);
      
      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(queryKeys.tasks);
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.tasks, (oldTasks) => {
        return oldTasks?.map(task => 
          task.id === id ? { ...task, ...updates } : task
        );
      });
      
      // Return context for rollback
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks, context.previousTasks);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(queryKeys.tasks);
    },
  });
};

export default {
  // Projects
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  
  // Tasks
  useTasks,
  useTask,
  useTasksByProject,
  useTasksByAssignee,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  
  // Team Members
  useTeamMembers,
  useTeamMember,
  useTeamMemberTasks,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  
  // Clients
  useClients,
  useClient,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  
  // Analytics
  useStats,
  
  // Optimistic updates
  useOptimisticTaskUpdate,
};