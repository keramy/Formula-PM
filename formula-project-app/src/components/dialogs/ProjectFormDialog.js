import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { useDialogManager } from '../../hooks/useDialogManager';
import { ProjectForm } from '../lazy';

/**
 * ProjectFormDialog component for creating and editing projects
 * Handles both create and edit modes based on props
 */
const ProjectFormDialog = ({
  open,
  clients,
  onSubmit,
  initialProject = null,
  isEdit = false
}) => {
  const { 
    closeCreateProjectDialog, 
    closeEditProjectDialog 
  } = useDialogManager();

  const handleClose = () => {
    if (isEdit) {
      closeEditProjectDialog();
    } else {
      closeCreateProjectDialog();
    }
  };

  const handleSubmit = (projectData) => {
    onSubmit(projectData);
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
        {isEdit ? 'Edit Project' : 'Create New Project'}
      </DialogTitle>
      <DialogContent>
        <ProjectForm 
          onSubmit={handleSubmit} 
          clients={clients} 
          initialProject={initialProject}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;