import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { useDialogManager } from '../../hooks/useDialogManager';
import { TeamMemberForm } from '../lazy';

/**
 * TeamMemberDialog component for adding new team members
 */
const TeamMemberDialog = ({
  open,
  teamMembers,
  onSubmit
}) => {
  const { closeAddTeamMemberDialog } = useDialogManager();

  const handleClose = () => {
    closeAddTeamMemberDialog();
  };

  const handleSubmit = (memberData) => {
    onSubmit(memberData);
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Add Team Member</DialogTitle>
      <DialogContent>
        <TeamMemberForm 
          teamMembers={teamMembers}
          onSubmit={handleSubmit} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDialog;