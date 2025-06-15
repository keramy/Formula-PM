import React from 'react';
import { Box } from '@mui/material';
import ProjectForm from './ProjectForm';
import PageWrapper from '../../../components/layout/PageWrapper';

const ProjectFormPage = ({ 
  project = null, 
  clients, 
  onSubmit, 
  onCancel,
  isEdit = false 
}) => {
  const pageTitle = isEdit ? 'Edit Project' : 'Create New Project';
  const pageType = isEdit ? 'edit-project' : 'add-project';
  
  // Build page data for breadcrumbs
  const pageData = isEdit && project ? {
    projectId: project.id,
    projectName: project.name,
    status: project.status,
    type: project.type
  } : {};

  return (
    <PageWrapper
      pageType={pageType}
      pageTitle={pageTitle}
      pageData={pageData}
      subtitle={isEdit ? `Editing: ${project?.name}` : 'Create a new project'}
      onNavigate={(path) => {
        if (path === '/projects') {
          onCancel && onCancel();
        }
      }}
      contentPadding={3}
    >
      <Box 
        sx={{ 
          maxWidth: 800, 
          mx: 'auto',
          backgroundColor: 'white',
          borderRadius: 3,
          border: '1px solid #E9ECEF',
          p: 4
        }}
      >
        <ProjectForm
          clients={clients}
          onSubmit={onSubmit}
          initialProject={project}
        />
      </Box>
    </PageWrapper>
  );
};

export default ProjectFormPage;