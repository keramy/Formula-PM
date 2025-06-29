import React from 'react';
import { Box } from '@mui/material';
import TeamMemberForm from './TeamMemberForm';
import PageWrapper from '../../../components/layout/PageWrapper';

const TeamMemberFormPage = ({ 
  member = null, 
  teamMembers, 
  onSubmit, 
  onCancel,
  isEdit = false 
}) => {
  const pageTitle = isEdit ? 'Edit Team Member' : 'Add Team Member';
  const pageType = isEdit ? 'edit-team-member' : 'add-team-member';
  
  // Build page data for breadcrumbs
  const pageData = isEdit && member ? {
    memberId: member.id,
    memberName: member.fullName,
    role: member.role,
    department: member.department
  } : {};

  return (
    <PageWrapper
      pageType={pageType}
      pageTitle={pageTitle}
      pageData={pageData}
      subtitle={isEdit ? `Editing: ${member?.fullName}` : 'Add a new team member'}
      onNavigate={(path) => {
        if (path === '/team') {
          onCancel && onCancel();
        }
      }}
      contentPadding={3}
    >
      <Box 
        sx={{ 
          maxWidth: 800, 
          mx: 'auto',
          backgroundPalette: 'white',
          borderRadius: 3,
          border: '1px solid #E9ECEF',
          p: 4
        }}
      >
        <TeamMemberForm
          teamMembers={teamMembers}
          onSubmit={onSubmit}
          initialMember={member}
        />
      </Box>
    </PageWrapper>
  );
};

export default TeamMemberFormPage;