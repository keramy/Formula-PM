import React from 'react';
import { Box } from '@mui/material';
import EnhancedScopeItemForm from './EnhancedScopeItemForm';
import PageWrapper from '../../../components/layout/PageWrapper';

const ScopeItemFormPage = ({ 
  item = null, 
  project,
  categories,
  onSubmit, 
  onCancel,
  isEdit = false 
}) => {
  const pageTitle = isEdit ? 'Edit Scope Item' : 'Add Scope Item';
  const pageType = isEdit ? 'edit-scope-item' : 'add-scope-item';
  
  // Build page data for breadcrumbs
  const pageData = {
    projectId: project?.id,
    projectName: project?.name,
    ...(isEdit && item ? {
      itemId: item.id,
      itemDescription: item.description
    } : {})
  };

  return (
    <PageWrapper
      pageType={pageType}
      pageTitle={pageTitle}
      pageData={pageData}
      subtitle={isEdit ? `Editing: ${item?.description}` : `Add item to ${project?.name}`}
      onNavigate={(path) => {
        if (path === `/projects/${project?.id}/scope`) {
          onCancel && onCancel();
        } else if (path === '/projects') {
          onCancel && onCancel();
        }
      }}
      contentPadding={3}
    >
      <Box 
        sx={{ 
          maxWidth: 700, 
          mx: 'auto',
          backgroundPalette: 'white',
          borderRadius: 3,
          border: '1px solid #E9ECEF',
          p: 4
        }}
      >
        <EnhancedScopeItemForm
          item={item}
          categories={categories}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </Box>
    </PageWrapper>
  );
};

export default ScopeItemFormPage;