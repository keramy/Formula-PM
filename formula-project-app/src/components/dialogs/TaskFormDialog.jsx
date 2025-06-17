import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { useDialogManager } from '../../hooks/useDialogManager';
import { TaskForm } from '../lazy';

/**
 * TaskFormDialog component for creating and editing tasks
 * Handles both create and edit modes based on props
 */
const TaskFormDialog = ({
  open,
  projects,
  teamMembers,
  onSubmit,
  initialTask = null,
  isEdit = false
}) => {
  const { 
    closeAddTaskDialog, 
    closeEditTaskDialog 
  } = useDialogManager();

  const handleClose = () => {
    if (isEdit) {
      closeEditTaskDialog();
    } else {
      closeAddTaskDialog();
    }
  };

  const handleSubmit = (taskData) => {
    onSubmit(taskData);
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isEdit ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <DialogContent>
        <TaskForm 
          projects={projects}
          teamMembers={teamMembers}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialTask={initialTask}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;