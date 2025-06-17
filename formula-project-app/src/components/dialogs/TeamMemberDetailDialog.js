import React from 'react';
import {
  Dialog,
  DialogContent,
  Box
} from '@mui/material';
import { useDialogManager } from '../../hooks/useDialogManager';
import { TeamMemberDetail } from '../lazy';

/**
 * TeamMemberDetailDialog component for viewing team member details
 * Uses the existing TeamMemberDetail component in a dialog wrapper
 */
const TeamMemberDetailDialog = ({
  open,
  member,
  tasks,
  projects,
  teamMembers
}) => {
  const { closeTeamMemberDetail } = useDialogManager();

  const handleClose = () => {
    closeTeamMemberDetail();
  };

  if (!member) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ height: '100%' }}>
          <TeamMemberDetail
            member={member}
            tasks={tasks}
            projects={projects}
            teamMembers={teamMembers}
            onClose={handleClose}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDetailDialog;