import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip
} from '@mui/material';
import { useDialogManager } from '../../hooks/useDialogManager';

/**
 * TaskViewDialog component for viewing task details
 */
const TaskViewDialog = ({
  open,
  task,
  projects,
  teamMembers
}) => {
  const { closeViewTaskDialog } = useDialogManager();

  const handleClose = () => {
    closeViewTaskDialog();
  };

  if (!task) {
    return null;
  }

  const project = projects?.find(p => p.id === task.projectId);
  const assignee = teamMembers?.find(tm => tm.id === task.assignedTo);

  // Helper function to get priority color
  const getPriorityPalette = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Helper function to get status color
  const getStatusPalette = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            {task.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            {task.description || 'No description provided'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip 
              label={task.priority || 'Medium'} 
              color={getPriorityPalette(task.priority)}
              size="small"
            />
            <Chip 
              label={task.status || 'Pending'} 
              color={getStatusPalette(task.status)}
              size="small"
            />
          </Box>

          {project && (
            <Typography variant="body2" paragraph>
              <strong>Project:</strong> {project.name}
            </Typography>
          )}
          
          {assignee && (
            <Typography variant="body2" paragraph>
              <strong>Assigned To:</strong> {assignee.fullName}
            </Typography>
          )}
          
          {task.dueDate && (
            <Typography variant="body2" paragraph>
              <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          )}
          
          {task.estimatedHours && (
            <Typography variant="body2" paragraph>
              <strong>Estimated Hours:</strong> {task.estimatedHours}h
            </Typography>
          )}
          
          {task.actualHours && (
            <Typography variant="body2" paragraph>
              <strong>Actual Hours:</strong> {task.actualHours}h
            </Typography>
          )}
          
          {task.progress !== undefined && (
            <Typography variant="body2" paragraph>
              <strong>Progress:</strong> {task.progress}%
            </Typography>
          )}
          
          {task.createdAt && (
            <Typography variant="body2" paragraph>
              <strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}
            </Typography>
          )}
          
          {task.updatedAt && (
            <Typography variant="body2" paragraph>
              <strong>Last Updated:</strong> {new Date(task.updatedAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewDialog;