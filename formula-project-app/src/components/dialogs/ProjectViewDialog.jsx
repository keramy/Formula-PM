import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography
} from '@mui/material';
import { useDialogManager } from '../../hooks/useDialogManager';

/**
 * ProjectViewDialog component for viewing project details
 */
const ProjectViewDialog = ({
  open,
  project,
  clients
}) => {
  const { closeViewProjectDialog } = useDialogManager();

  const handleClose = () => {
    closeViewProjectDialog();
  };

  if (!project) {
    return null;
  }

  const client = clients?.find(c => c.id === project.clientId);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Project Details</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            {project.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {project.description || 'No description provided'}
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Type:</strong> {project.type}
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Status:</strong> {project.status}
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
          </Typography>
          {project.budget && (
            <Typography variant="body2" paragraph>
              <strong>Budget:</strong> ${project.budget.toLocaleString()}
            </Typography>
          )}
          {project.progress !== undefined && (
            <Typography variant="body2" paragraph>
              <strong>Progress:</strong> {project.progress}%
            </Typography>
          )}
          {client && (
            <Typography variant="body2" paragraph>
              <strong>Client:</strong> {client.companyName}
            </Typography>
          )}
          {project.location && (
            <Typography variant="body2" paragraph>
              <strong>Location:</strong> {project.location}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectViewDialog;