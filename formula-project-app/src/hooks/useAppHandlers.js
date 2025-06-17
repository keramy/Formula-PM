import { useCallback } from 'react';
import { generateProjectId, generateTaskId, generateMemberId } from '../utils/generators/idGenerator';
import apiService from '../services/api/apiService';
import { notificationService } from '../services/notifications/notificationService';
import { exportProjectsToExcel } from '../services/export/excelExport';

/**
 * Custom hook for managing all application event handlers
 * Centralizes business logic and event handling
 */
export const useAppHandlers = ({
  // Data and state
  projects,
  tasks,
  teamMembers,
  clients,
  setTasks,
  setError,
  filteredProjects,
  projectsFilters,
  projectsSearchTerm,
  
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
  navigateToMain,
  navigateToProject,
  setCurrentPage,
  setCurrentFormData,
  
  // Dialog management
  updateDialogState,
  
  // Search and filters
  setSearchTerm,
  setShowSearchResults,
  setProjectsSearchTerm,
  setShowProjectsFilters,
  setProjectsFilters,
  
  // View modes
  setProjectsViewMode,
  setTasksViewMode,
  setTeamViewMode,
  setClientsViewMode
}) => {
  // Project handlers
  const handleAddProject = useCallback(async (project) => {
    try {
      const newProject = {
        ...project,
        id: generateProjectId(),
        createdAt: new Date().toISOString()
      };
      
      const createdProject = await addProject(newProject);
      navigateToMain();
      
      // Add notification for project assignment
      if (project.managerId) {
        const manager = teamMembers.find(m => m.id === project.managerId);
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        
        if (manager) {
          notificationService.notifyProjectAssignment(createdProject, manager, currentUser);
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  }, [addProject, navigateToMain, setError, teamMembers]);

  const handleUpdateProject = useCallback(async (project) => {
    try {
      const oldProject = projects.find(p => p.id === project.id);
      
      // Automatically set progress to 100% if project is marked as completed
      if (project.status === 'completed' && project.progress !== 100) {
        project.progress = 100;
      }
      
      const updatedProject = await updateProject(project.id, project);
      updateDialogState({ 
        editProjectDialogOpen: false, 
        selectedProjectForEdit: null 
      });
      
      // Add notification for project status change
      if (oldProject && project.status !== oldProject.status) {
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        notificationService.notifyProjectStatusChange(updatedProject, oldProject.status, project.status, currentUser);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  }, [updateProject, setError, projects, teamMembers, updateDialogState]);

  const handleDeleteProject = useCallback(async (projectId) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  }, [deleteProject, setError]);

  // Task handlers
  const handleAddTask = useCallback(async (task) => {
    try {
      const newTask = {
        ...task,
        id: generateTaskId(),
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString()
      };
      
      const createdTask = await addTask(newTask);
      navigateToMain();
      
      // Add notification for task assignment
      if (task.assignedTo) {
        const assignee = teamMembers.find(m => m.id === task.assignedTo);
        const project = projects.find(p => p.id === task.projectId);
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        
        if (assignee && project) {
          notificationService.notifyTaskAssignment(createdTask, project, assignee, currentUser);
          
          console.log('📧 Task assigned notification sent:', {
            taskName: createdTask.name,
            assigneeName: assignee.fullName,
            assigneeEmail: assignee.email,
            projectName: project.name
          });
        }
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
    }
  }, [addTask, navigateToMain, teamMembers, projects, setError]);

  const updateTaskWithForm = useCallback(async (task) => {
    try {
      const updatedTask = await apiService.updateTask(task.id, task);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      updateDialogState({ 
        editTaskDialogOpen: false, 
        selectedTaskForEdit: null 
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  }, [tasks, setTasks, setError, updateDialogState]);

  const updateTaskStatus = useCallback(async (taskId, updates) => {
    try {
      const oldTask = tasks.find(t => t.id === taskId);
      const updatedTask = await apiService.updateTask(taskId, updates);
      
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));

      // Add notifications for task changes
      if (updates.status === 'completed' && oldTask.status !== 'completed') {
        const assignee = teamMembers.find(m => m.id === updatedTask.assignedTo);
        const project = projects.find(p => p.id === updatedTask.projectId);
        
        if (assignee && project) {
          notificationService.notifyTaskCompleted(updatedTask, project, assignee);
          
          console.log('📧 Task completion notification sent:', {
            taskName: updatedTask.name,
            assigneeName: assignee.fullName,
            projectName: project.name,
            completedAt: new Date().toISOString()
          });
        }
      }
      
      // Task reassignment notification
      if (updates.assignedTo && updates.assignedTo !== oldTask.assignedTo) {
        const newAssignee = teamMembers.find(m => m.id === updates.assignedTo);
        const project = projects.find(p => p.id === updatedTask.projectId);
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        
        if (newAssignee && project) {
          notificationService.notifyTaskAssignment(updatedTask, project, newAssignee, currentUser);
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  }, [tasks, setTasks, teamMembers, projects, setError]);

  const handleViewTask = useCallback((task) => {
    updateDialogState({
      selectedTaskForView: task,
      viewTaskDialogOpen: true
    });
  }, [updateDialogState]);

  const handleEditTask = useCallback((task) => {
    setCurrentPage('edit-task');
    setCurrentFormData(task);
  }, [setCurrentPage, setCurrentFormData]);

  // Team member handlers
  const handleAddTeamMemberForm = useCallback(async (member) => {
    try {
      const newMember = {
        ...member,
        id: generateMemberId()
      };
      
      await addTeamMember(newMember);
      navigateToMain();
    } catch (error) {
      console.error('Error creating team member:', error);
      setError('Failed to create team member');
    }
  }, [addTeamMember, navigateToMain, setError]);

  const handleAddTeamMember = useCallback(() => {
    setCurrentPage('add-team-member');
    setCurrentFormData(null);
  }, [setCurrentPage, setCurrentFormData]);

  const handleViewTeamMemberDetail = useCallback((member) => {
    updateDialogState({
      selectedMemberForDetail: member,
      teamMemberDetailOpen: true
    });
  }, [updateDialogState]);

  const handleCloseTeamMemberDetail = useCallback(() => {
    updateDialogState({
      teamMemberDetailOpen: false,
      selectedMemberForDetail: null
    });
  }, [updateDialogState]);

  // Client handlers
  const handleAddClientForm = useCallback(async (client) => {
    try {
      const newClient = {
        ...client,
        id: Date.now(), // Simple ID generation
        createdAt: new Date().toISOString()
      };
      
      await addClient(newClient);
      updateDialogState({ addClientDialogOpen: false });
    } catch (error) {
      console.error('Error creating client:', error);
      setError('Failed to create client');
    }
  }, [addClient, updateDialogState, setError]);

  const handleAddClient = useCallback(() => {
    updateDialogState({ addClientDialogOpen: true });
  }, [updateDialogState]);

  // Navigation handlers
  const handleNavigateToAddTask = useCallback(() => {
    setCurrentPage('add-task');
    setCurrentFormData(null);
  }, [setCurrentPage, setCurrentFormData]);

  const handleNavigateToProject = useCallback((projectId, section = 'overview') => {
    navigateToProject(projectId, section);
  }, [navigateToProject]);

  const handleViewProject = useCallback((project) => {
    handleNavigateToProject(project.id, 'overview');
  }, [handleNavigateToProject]);

  const handleEditProject = useCallback((project) => {
    updateDialogState({
      selectedProjectForEdit: project,
      editProjectDialogOpen: true
    });
  }, [updateDialogState]);

  const handleProjectNameClick = useCallback((project) => {
    handleNavigateToProject(project.id, 'overview');
  }, [handleNavigateToProject]);

  const handleManageScope = useCallback((project) => {
    updateDialogState({
      selectedProjectForScope: project,
      scopeDialogOpen: true
    });
  }, [updateDialogState]);

  // Dialog close handlers
  const handleCloseEditDialog = useCallback(() => {
    updateDialogState({
      editProjectDialogOpen: false,
      selectedProjectForEdit: null
    });
  }, [updateDialogState]);

  const handleCloseViewDialog = useCallback(() => {
    updateDialogState({
      viewProjectDialogOpen: false,
      selectedProjectForView: null
    });
  }, [updateDialogState]);

  const handleCloseScopeDialog = useCallback(() => {
    updateDialogState({
      scopeDialogOpen: false,
      selectedProjectForScope: null
    });
  }, [updateDialogState]);

  const handleCloseEditTaskDialog = useCallback(() => {
    updateDialogState({
      editTaskDialogOpen: false,
      selectedTaskForEdit: null
    });
  }, [updateDialogState]);

  const handleCloseViewTaskDialog = useCallback(() => {
    updateDialogState({
      viewTaskDialogOpen: false,
      selectedTaskForView: null
    });
  }, [updateDialogState]);

  // Search handlers
  const handleGlobalSearchChange = useCallback((value) => {
    updateDialogState({ globalSearch: value });
    setSearchTerm(value);
    if (value.trim().length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [updateDialogState, setSearchTerm, setShowSearchResults]);

  const handleSearchSubmit = useCallback(() => {
    const searchTerm = updateDialogState.globalSearch;
    if (searchTerm && searchTerm.trim().length > 0) {
      setShowSearchResults(true);
    }
  }, [updateDialogState, setShowSearchResults]);

  const handleShowFullSearch = useCallback(() => {
    setShowSearchResults(true);
  }, [setShowSearchResults]);

  const handleSearchResultSelect = useCallback((result) => {
    setShowSearchResults(false);
    updateDialogState({ globalSearch: '' });
    
    // Enhanced navigation based on result type
    switch (result.type) {
      case 'project':
        handleNavigateToProject(result.id, 'overview');
        break;
      case 'task':
        updateDialogState({ 
          currentTab: 3,
          selectedTaskForView: result,
          viewTaskDialogOpen: true
        });
        break;
      case 'team-member':
        updateDialogState({ 
          currentTab: 4,
          selectedMemberForDetail: result,
          teamMemberDetailOpen: true
        });
        break;
      case 'client':
        updateDialogState({ currentTab: 5 });
        break;
      case 'shop-drawing':
        if (result.projectId) {
          handleNavigateToProject(result.projectId, 'shop-drawings');
        }
        break;
      case 'specification':
        if (result.projectId) {
          handleNavigateToProject(result.projectId, 'specifications');
        }
        break;
      case 'compliance':
        if (result.projectId) {
          handleNavigateToProject(result.projectId, 'compliance');
        }
        break;
      default:
        break;
    }
  }, [updateDialogState, handleNavigateToProject, setShowSearchResults]);

  // Tab change handler
  const handleTabChange = useCallback((_, newValue) => {
    updateDialogState({ currentTab: newValue });
  }, [updateDialogState]);

  // Filter and view mode handlers
  const handleToggleProjectsFilters = useCallback(() => {
    setShowProjectsFilters(prev => !prev);
  }, [setShowProjectsFilters]);

  const handleProjectsExport = useCallback(async () => {
    try {
      const result = await exportProjectsToExcel(filteredProjects, clients, teamMembers);
      if (result.success) {
        console.log(`Exported ${result.filename} successfully`);
      } else {
        setError(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export projects');
    }
  }, [filteredProjects, clients, teamMembers, setError]);

  const handleViewModeChange = useCallback((mode) => {
    setProjectsViewMode(mode);
    localStorage.setItem('projectsViewMode', mode);
  }, [setProjectsViewMode]);

  const handleTasksViewModeChange = useCallback((mode) => {
    setTasksViewMode(mode);
    localStorage.setItem('tasksViewMode', mode);
  }, [setTasksViewMode]);

  const handleTeamViewModeChange = useCallback((mode) => {
    setTeamViewMode(mode);
    localStorage.setItem('teamViewMode', mode);
  }, [setTeamViewMode]);

  const handleClientsViewModeChange = useCallback((mode) => {
    setClientsViewMode(mode);
    localStorage.setItem('clientsViewMode', mode);
  }, [setClientsViewMode]);

  const handleFiltersChange = useCallback((newFilters) => {
    setProjectsFilters(newFilters);
  }, [setProjectsFilters]);

  const handleClearFilters = useCallback(() => {
    setProjectsFilters({
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
    setProjectsSearchTerm('');
  }, [setProjectsFilters, setProjectsSearchTerm]);

  const handleClearFilter = useCallback((filterKey) => {
    if (filterKey === 'all') {
      handleClearFilters();
    } else if (filterKey === 'search') {
      setProjectsSearchTerm('');
    } else {
      setProjectsFilters(prev => {
        const newFilters = { ...prev };
        if (filterKey.includes('Date')) {
          newFilters[filterKey] = null;
        } else {
          newFilters[filterKey] = '';
        }
        return newFilters;
      });
    }
  }, [handleClearFilters, setProjectsSearchTerm, setProjectsFilters]);

  return {
    // Project handlers
    handleAddProject,
    handleUpdateProject,
    handleDeleteProject,
    handleEditProject,
    handleViewProject,
    handleProjectNameClick,
    handleManageScope,
    handleNavigateToProject,

    // Task handlers
    handleAddTask,
    updateTaskWithForm,
    updateTaskStatus,
    handleViewTask,
    handleEditTask,
    handleNavigateToAddTask,

    // Team member handlers
    handleAddTeamMember,
    handleAddTeamMemberForm,
    handleViewTeamMemberDetail,
    handleCloseTeamMemberDetail,

    // Client handlers
    handleAddClient,
    handleAddClientForm,

    // Dialog close handlers
    handleCloseEditDialog,
    handleCloseViewDialog,
    handleCloseScopeDialog,
    handleCloseEditTaskDialog,
    handleCloseViewTaskDialog,

    // Search handlers
    handleGlobalSearchChange,
    handleSearchSubmit,
    handleShowFullSearch,
    handleSearchResultSelect,

    // Tab and filter handlers
    handleTabChange,
    handleToggleProjectsFilters,
    handleProjectsExport,
    handleViewModeChange,
    handleTasksViewModeChange,
    handleTeamViewModeChange,
    handleClientsViewModeChange,
    handleFiltersChange,
    handleClearFilters,
    handleClearFilter
  };
};