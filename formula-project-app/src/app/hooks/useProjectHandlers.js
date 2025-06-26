import { useCallback } from 'react';
import { generateProjectId } from '../../utils/generators/idGenerator';
import { notificationService } from '../../services/notifications/notificationService';

/**
 * Custom hook for project-related handlers
 * Extracts project management logic from AppContent
 */
export const useProjectHandlers = ({
  projects,
  teamMembers,
  addProject,
  updateProject,
  deleteProject,
  navigateToMain,
  showSuccess,
  showError,
  setError,
  closeEditProjectDialog,
  openEditProjectDialog,
  openScopeDialog,
  closeScopeDialog
}) => {
  const handleAddProject = useCallback(async (project) => {
    try {
      const newProject = {
        ...project,
        id: generateProjectId(),
        createdAt: new Date().toISOString()
      };
      
      const createdProject = await addProject(newProject);
      navigateToMain();
      
      // Show success notification
      showSuccess(`Project "${project.name}" created successfully`, { action: 'save' });
      
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
      showError('Failed to create project. Please try again.');
    }
  }, [addProject, navigateToMain, setError, teamMembers, showSuccess, showError]);

  const handleUpdateProject = useCallback(async (project) => {
    try {
      const oldProject = projects.find(p => p.id === project.id);
      
      // Automatically set progress to 100% if project is marked as completed
      if (project.status === 'completed' && project.progress !== 100) {
        project.progress = 100;
      }
      
      const updatedProject = await updateProject(project.id, project);
      closeEditProjectDialog();
      
      // Show success notification
      showSuccess(`Project "${project.name}" updated successfully`, { action: 'save' });
      
      // Add notification for project status change
      if (oldProject && project.status !== oldProject.status) {
        const currentUser = teamMembers.find(m => m.id === 1008); // Current user ID
        notificationService.notifyProjectStatusChange(updatedProject, oldProject.status, project.status, currentUser);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
      showError('Failed to update project. Please try again.');
    }
  }, [updateProject, setError, projects, teamMembers, closeEditProjectDialog, showSuccess, showError]);

  const handleDeleteProject = useCallback(async (projectId) => {
    try {
      const project = projects.find(p => p.id === projectId);
      await deleteProject(projectId);
      showSuccess(`Project "${project?.name || 'Unknown'}" deleted successfully`, { action: 'delete' });
    } catch (error) {
      console.error('Error deleting project:', error);
      showError('Failed to delete project. Please try again.');
    }
  }, [deleteProject, projects, showSuccess, showError]);

  const handleEditProject = useCallback((project) => {
    openEditProjectDialog(project);
  }, [openEditProjectDialog]);

  const handleManageScope = useCallback((project) => {
    openScopeDialog(project);
  }, [openScopeDialog]);

  const handleCloseScopeDialog = useCallback(() => {
    closeScopeDialog();
  }, [closeScopeDialog]);

  return {
    handleAddProject,
    handleUpdateProject,
    handleDeleteProject,
    handleEditProject,
    handleManageScope,
    handleCloseScopeDialog
  };
};