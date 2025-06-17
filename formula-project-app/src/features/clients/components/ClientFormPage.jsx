import React from 'react';
import { Box } from '@mui/material';
import ClientForm from './ClientForm';
import PageWrapper from '../../../components/layout/PageWrapper';

const ClientFormPage = ({ 
  client = null, 
  onSubmit, 
  onCancel,
  isEdit = false 
}) => {
  const pageTitle = isEdit ? 'Edit Client' : 'Add New Client';
  const pageType = isEdit ? 'edit-client' : 'add-client';
  
  // Build page data for breadcrumbs
  const pageData = isEdit && client ? {
    clientId: client.id,
    clientName: client.companyName,
    industry: client.industry,
    status: client.status
  } : {};

  return (
    <PageWrapper
      pageType={pageType}
      pageTitle={pageTitle}
      pageData={pageData}
      subtitle={isEdit ? `Editing: ${client?.companyName}` : 'Add a new client'}
      onNavigate={(path) => {
        if (path === '/clients') {
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
        <ClientForm
          onSubmit={onSubmit}
          initialClient={client}
        />
      </Box>
    </PageWrapper>
  );
};

export default ClientFormPage;