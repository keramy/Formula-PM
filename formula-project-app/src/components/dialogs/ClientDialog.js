import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { useDialogManager } from '../../hooks/useDialogManager';
import { ClientForm } from '../lazy';

/**
 * ClientDialog component for adding new clients
 */
const ClientDialog = ({
  open,
  onSubmit
}) => {
  const { closeAddClientDialog } = useDialogManager();

  const handleClose = () => {
    closeAddClientDialog();
  };

  const handleSubmit = (clientData) => {
    onSubmit(clientData);
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Add New Client</DialogTitle>
      <DialogContent>
        <ClientForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;