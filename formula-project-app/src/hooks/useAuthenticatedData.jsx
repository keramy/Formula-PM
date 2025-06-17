import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api/apiService';

export const useAuthenticatedData = () => {
  const { user, getAccessibleProjects } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized data loading function with auth filtering and cancellation support
  const loadAllData = useCallback(async (signal) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Load all data in parallel with cancellation support
      const [teamMembersData, allProjectsData, tasksData, clientsData] = await Promise.all([
        apiService.getTeamMembers(signal),
        apiService.getProjects(signal),
        apiService.getTasks(signal),
        apiService.getClients(signal)
      ]);
      
      // Check if operation was cancelled
      if (signal?.aborted) return;
      
      // Filter projects based on user permissions
      const accessibleProjects = getAccessibleProjects(allProjectsData);
      const accessibleProjectIds = accessibleProjects.map(p => p.id);
      
      // Filter tasks to only include those from accessible projects
      const accessibleTasks = tasksData.filter(task => 
        accessibleProjectIds.includes(task.projectId)
      );
      
      // Only update state if not cancelled
      if (!signal?.aborted) {
        setTeamMembers(teamMembersData);
        setProjects(accessibleProjects);
        setTasks(accessibleTasks);
        setClients(clientsData);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error loading data:', error);
        setError(error.message || 'Failed to load data');
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [user]); // Simplified dependency to prevent frequent re-renders

  // Load data when user changes or component mounts with proper cleanup
  useEffect(() => {
    const abortController = new AbortController();
    
    const loadData = async () => {
      // Add delay to prevent React StrictMode double-mounting issues
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!abortController.signal.aborted) {
        await loadAllData(abortController.signal);
      }
    };
    
    loadData();
    
    return () => {
      // Only abort if we're actually unmounting, not in StrictMode re-mount
      setTimeout(() => {
        if (!abortController.signal.aborted) {
          abortController.abort();
        }
      }, 50);
    };
  }, [user]); // Simplified dependency - only re-run when user changes

  // Project management functions with permission checks
  const addProject = useCallback(async (projectData) => {
    if (!user?.role) return;
    
    try {
      const newProject = await apiService.createProject(projectData);
      
      // Only add to local state if user can access it
      if (getAccessibleProjects([newProject]).length > 0) {
        setProjects(prev => [newProject, ...prev]);
      }
      
      return newProject;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }, [user, getAccessibleProjects]);

  const updateProject = useCallback(async (projectId, updates) => {
    if (!user?.role) return;
    
    try {
      const updatedProject = await apiService.updateProject(projectId, updates);
      
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId ? updatedProject : project
        )
      );
      
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }, [user]);

  const deleteProject = useCallback(async (projectId) => {
    if (!user?.role) return;
    
    try {
      await apiService.deleteProject(projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));
      setTasks(prev => prev.filter(task => task.projectId !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }, [user]);

  // Task management functions
  const addTask = useCallback(async (taskData) => {
    if (!user?.role) return;
    
    try {
      const newTask = await apiService.createTask(taskData);
      
      // Only add to local state if it belongs to an accessible project
      const accessibleProjects = getAccessibleProjects(projects);
      const accessibleProjectIds = accessibleProjects.map(p => p.id);
      
      if (accessibleProjectIds.includes(newTask.projectId)) {
        setTasks(prev => [newTask, ...prev]);
      }
      
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }, [user, projects, getAccessibleProjects]);

  const updateTask = useCallback(async (taskId, updates) => {
    if (!user?.role) return;
    
    try {
      const updatedTask = await apiService.updateTask(taskId, updates);
      
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }, [user]);

  const deleteTask = useCallback(async (taskId) => {
    if (!user?.role) return;
    
    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }, [user]);

  // Team member management (admin only)
  const addTeamMember = useCallback(async (memberData) => {
    if (!user?.role) return;
    
    try {
      const newMember = await apiService.createTeamMember(memberData);
      setTeamMembers(prev => [newMember, ...prev]);
      return newMember;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }, [user]);

  const updateTeamMember = useCallback(async (memberId, updates) => {
    if (!user?.role) return;
    
    try {
      const updatedMember = await apiService.updateTeamMember(memberId, updates);
      
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? updatedMember : member
        )
      );
      
      return updatedMember;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }, [user]);

  const deleteTeamMember = useCallback(async (memberId) => {
    if (!user?.role) return;
    
    try {
      await apiService.deleteTeamMember(memberId);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  }, [user]);

  // Client management functions
  const addClient = useCallback(async (clientData) => {
    if (!user?.role) return;
    
    try {
      const newClient = await apiService.createClient(clientData);
      setClients(prev => [newClient, ...prev]);
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  }, [user]);

  const updateClient = useCallback(async (clientId, updates) => {
    if (!user?.role) return;
    
    try {
      const updatedClient = await apiService.updateClient(clientId, updates);
      
      setClients(prev => 
        prev.map(client => 
          client.id === clientId ? updatedClient : client
        )
      );
      
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }, [user]);

  const deleteClient = useCallback(async (clientId) => {
    if (!user?.role) return;
    
    try {
      await apiService.deleteClient(clientId);
      setClients(prev => prev.filter(client => client.id !== clientId));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }, [user]);

  // Computed statistics with filtered data
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    teamMembersCount: teamMembers.length,
    clientsCount: clients.length
  };

  return {
    // Data
    projects,
    tasks,
    teamMembers,
    clients,
    stats,
    
    // State
    loading,
    error,
    
    // Actions
    loadAllData,
    
    // Project actions
    addProject,
    updateProject,
    deleteProject,
    
    // Task actions
    addTask,
    updateTask,
    deleteTask,
    
    // Team member actions
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    
    // Client actions
    addClient,
    updateClient,
    deleteClient,
    
    // Setters for direct state updates
    setProjects,
    setTasks,
    setTeamMembers,
    setClients,
    setError
  };
};