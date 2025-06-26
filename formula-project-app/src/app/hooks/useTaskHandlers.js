import { useCallback } from 'react';
import { generateTaskId } from '../../utils/generators/idGenerator';
import apiService from '../../services/api/apiService';
import { notificationService } from '../../services/notifications/notificationService';

/**
 * Custom hook for task-related handlers
 * Extracts task management logic from AppContent
 */
export const useTaskHandlers = ({
  tasks,
  projects,
  teamMembers,
  addTask,
  deleteTask,
  setTasks,
  setError,
  navigateToMain,
  showSuccess,
  showError,
  closeEditTaskDialog,
  openViewTaskDialog
}) => {
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
      
      // Show success notification
      showSuccess(`Task "${task.name}" created successfully`, { action: 'save' });
      
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
      showError('Failed to create task. Please try again.');
    }
  }, [addTask, navigateToMain, teamMembers, projects, setError, showSuccess, showError]);

  const updateTaskWithForm = useCallback(async (task) => {
    try {
      const updatedTask = await apiService.updateTask(task.id, task);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      closeEditTaskDialog();
      showSuccess(`Task "${task.name}" updated successfully`, { action: 'save' });
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
      showError('Failed to update task. Please try again.');
    }
  }, [tasks, setTasks, setError, closeEditTaskDialog, showSuccess, showError]);

  const updateTaskStatus = useCallback(async (taskId, updates) => {
    try {
      const oldTask = tasks.find(t => t.id === taskId);
      const updatedTask = await apiService.updateTask(taskId, updates);
      
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));

      // Show success notification for status update
      if (updates.status) {
        showSuccess(`Task status updated to "${updates.status}"`, { action: 'save' });
      }

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
  }, [tasks, setTasks, teamMembers, projects, setError, showSuccess]);

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await deleteTask(taskId);
      showSuccess(`Task "${task?.name || 'Unknown'}" deleted successfully`, { action: 'delete' });
    } catch (error) {
      console.error('Error deleting task:', error);
      showError('Failed to delete task. Please try again.');
    }
  }, [deleteTask, tasks, showSuccess, showError]);

  const handleViewTask = useCallback((task) => {
    openViewTaskDialog(task);
  }, [openViewTaskDialog]);

  const handleEditTask = useCallback((task) => {
    // This will be handled by the page navigation
    return { page: 'edit-task', data: task };
  }, []);

  return {
    handleAddTask,
    updateTaskWithForm,
    updateTaskStatus,
    handleDeleteTask,
    handleViewTask,
    handleEditTask
  };
};