import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api/apiService';
import { 
  safeArray, 
  safeGet, 
  safeTransformProjects, 
  safeTransformTasks, 
  safeTransformTeamMembers,
  isNullOrUndefined,
  debugSafety,
  validateProjectData,
  validateTaskData,
  validateTeamMemberData
} from '../utils/safety';

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
      
      // Enhanced error handling with retry logic
      const loadDataWithRetry = async (loadFunction, dataType, retries = 1) => {
        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            return await loadFunction(signal);
          } catch (error) {
            if (error.name === 'AbortError' || signal?.aborted) {
              throw error;
            }
            
            if (attempt === retries) {
              // Only log warning if this is not a network connectivity issue
              if (!error.message?.includes('Network connection failed') && 
                  !error.message?.includes('fetch') && 
                  !error.originalError?.name?.includes('TypeError')) {
                console.warn(`Failed to load ${dataType} after ${retries + 1} attempts:`, error.message);
              }
              throw error;
            }
            
            // Wait before retry (shorter delay for faster fallback to demo data)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
          }
        }
      };

      // Load all data in parallel with enhanced error handling
      const dataLoaders = [
        { fn: () => loadDataWithRetry(() => apiService.getTeamMembers(signal), 'team members'), key: 'teamMembers' },
        { fn: () => loadDataWithRetry(() => apiService.getProjects(signal), 'projects'), key: 'projects' },
        { fn: () => loadDataWithRetry(() => apiService.getTasks(signal), 'tasks'), key: 'tasks' },
        { fn: () => loadDataWithRetry(() => apiService.getClients(signal), 'clients'), key: 'clients' }
      ];

      const results = await Promise.allSettled(dataLoaders.map(loader => loader.fn()));
      
      // Check if operation was cancelled
      if (signal?.aborted) return;

      // Process results and handle partial failures with null safety
      const dataMap = {};
      const errors = [];
      
      results.forEach((result, index) => {
        const key = dataLoaders[index].key;
        if (result.status === 'fulfilled') {
          // Transform and validate data with safety checks
          const rawData = safeArray(result.value);
          
          switch (key) {
            case 'teamMembers':
              dataMap[key] = safeTransformTeamMembers(rawData);
              console.log('🔍 Team members data:', rawData.length, 'items');
              // debugSafety.validateDataStructure(rawData[0], ['id', 'name', 'email'], 'teamMembers');
              break;
            case 'projects':
              dataMap[key] = safeTransformProjects(rawData);
              console.log('🔍 Projects data:', rawData.length, 'items');
              // debugSafety.validateDataStructure(rawData[0], ['id', 'name', 'clientId'], 'projects');
              break;
            case 'tasks':
              dataMap[key] = safeTransformTasks(rawData);
              console.log('🔍 Tasks data:', rawData.length, 'items');
              // debugSafety.validateDataStructure(rawData[0], ['id', 'title', 'projectId'], 'tasks');
              break;
            case 'clients':
              dataMap[key] = safeArray(rawData); // Clients don't need special transformation yet
              console.log('🔍 Clients data:', rawData.length, 'items');
              // debugSafety.validateDataStructure(rawData[0], ['id', 'name'], 'clients');
              break;
            default:
              dataMap[key] = safeArray(rawData);
          }
        } else {
          console.error(`Failed to load ${key}:`, result.reason);
          const errorMessage = safeGet(result.reason, 'message', 'Unknown error');
          errors.push(`${key}: ${errorMessage}`);
          // Provide empty array as fallback
          dataMap[key] = [];
        }
      });

      // If all critical data failed to load, throw error
      if (errors.length === dataLoaders.length) {
        throw new Error(`All data loading failed: ${errors.join(', ')}`);
      }

      // Filter projects based on user permissions with comprehensive safety checks
      const safeProjects = safeArray(dataMap.projects);
      const accessibleProjects = safeProjects.length > 0 && typeof getAccessibleProjects === 'function' ? 
        safeArray(getAccessibleProjects(safeProjects)) : safeProjects;
      
      // Extract project IDs safely
      const accessibleProjectIds = accessibleProjects
        .map(p => safeGet(p, 'id'))
        .filter(id => !isNullOrUndefined(id));
      
      // Filter tasks to only include those from accessible projects with safety checks
      const safeTasks = safeArray(dataMap.tasks);
      const accessibleTasks = safeTasks.filter(task => {
        const taskProjectId = safeGet(task, 'projectId');
        return !isNullOrUndefined(taskProjectId) && accessibleProjectIds.includes(taskProjectId);
      });
      
      // Only update state if not cancelled
      if (!signal?.aborted) {
        console.log('🎯 Setting state data:');
        console.log('  - Team members:', dataMap.teamMembers?.length || 0);
        console.log('  - Projects:', accessibleProjects?.length || 0);
        console.log('  - Tasks:', accessibleTasks?.length || 0);
        console.log('  - Clients:', dataMap.clients?.length || 0);
        
        setTeamMembers(safeArray(dataMap.teamMembers));
        setProjects(accessibleProjects);
        setTasks(accessibleTasks);
        setClients(safeArray(dataMap.clients));

        // Set warning if some data failed to load
        if (errors.length > 0) {
          setError(`Some data failed to load: ${errors.join(', ')}`);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError' && !signal?.aborted) {
        console.error('Critical error loading data:', error);
        setError(error.message || 'Failed to load application data');
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

  // Project management functions with permission checks and null safety
  const addProject = useCallback(async (projectData) => {
    if (isNullOrUndefined(user) || isNullOrUndefined(safeGet(user, 'role'))) {
      throw new Error('User authentication required');
    }
    
    try {
      // Validate project data before sending
      const validation = validateProjectData(projectData);
      if (!validation.isValid) {
        throw new Error(`Invalid project data: ${validation.errors.join(', ')}`);
      }
      
      const newProject = await apiService.createProject(validation.data);
      const safeNewProject = safeTransformProjects([newProject])[0];
      
      if (!safeNewProject) {
        throw new Error('Failed to process created project data');
      }
      
      // Only add to local state if user can access it
      if (typeof getAccessibleProjects === 'function') {
        const accessibleCheck = safeArray(getAccessibleProjects([safeNewProject]));
        if (accessibleCheck.length > 0) {
          setProjects(prev => [safeNewProject, ...safeArray(prev)]);
        }
      } else {
        setProjects(prev => [safeNewProject, ...safeArray(prev)]);
      }
      
      return safeNewProject;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }, [user, getAccessibleProjects]);

  const updateProject = useCallback(async (projectId, updates) => {
    if (isNullOrUndefined(user) || isNullOrUndefined(safeGet(user, 'role'))) {
      throw new Error('User authentication required');
    }
    
    if (isNullOrUndefined(projectId)) {
      throw new Error('Project ID is required');
    }
    
    try {
      // Validate update data
      const validation = validateProjectData({ ...updates, id: projectId });
      if (!validation.isValid) {
        throw new Error(`Invalid project update data: ${validation.errors.join(', ')}`);
      }
      
      const updatedProject = await apiService.updateProject(projectId, validation.data);
      const safeUpdatedProject = safeTransformProjects([updatedProject])[0];
      
      if (!safeUpdatedProject) {
        throw new Error('Failed to process updated project data');
      }
      
      setProjects(prev => 
        safeArray(prev).map(project => 
          safeGet(project, 'id') === projectId ? safeUpdatedProject : project
        )
      );
      
      return safeUpdatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }, [user]);

  const deleteProject = useCallback(async (projectId) => {
    if (isNullOrUndefined(user) || isNullOrUndefined(safeGet(user, 'role'))) {
      throw new Error('User authentication required');
    }
    
    if (isNullOrUndefined(projectId)) {
      throw new Error('Project ID is required');
    }
    
    try {
      await apiService.deleteProject(projectId);
      
      setProjects(prev => safeArray(prev).filter(project => 
        safeGet(project, 'id') !== projectId
      ));
      
      setTasks(prev => safeArray(prev).filter(task => 
        safeGet(task, 'projectId') !== projectId
      ));
      
      return true;
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

  // Computed statistics with filtered data and null safety
  const stats = {
    totalProjects: safeArray(projects).length,
    activeProjects: safeArray(projects).filter(p => safeGet(p, 'status') === 'active').length,
    completedProjects: safeArray(projects).filter(p => safeGet(p, 'status') === 'completed').length,
    totalTasks: safeArray(tasks).length,
    completedTasks: safeArray(tasks).filter(t => safeGet(t, 'status') === 'completed').length,
    pendingTasks: safeArray(tasks).filter(t => safeGet(t, 'status') === 'pending').length,
    inProgressTasks: safeArray(tasks).filter(t => safeGet(t, 'status') === 'in-progress').length,
    teamMembersCount: safeArray(teamMembers).length,
    clientsCount: safeArray(clients).length
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