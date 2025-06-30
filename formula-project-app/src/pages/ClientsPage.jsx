import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  MdAdd as Add,
  MdFilterList as FilterList,
  MdList as ViewList,
  MdViewModule as ViewModule,
  MdBusiness as BusinessIcon,
  MdKeyboardArrowUp as ArrowUp,
  MdTask as Task,
  MdCheckCircle as CheckCircle,
  MdPerson as PersonIcon,
  MdEdit as Edit,
  MdDelete as Delete
} from 'react-icons/md';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import ClientsList from '../features/clients/components/ClientsList';
import ClientFormModal from '../components/forms/ClientFormModal';
import DeleteConfirmationDialog from '../components/forms/DeleteConfirmationDialog';
import { useNotification } from '../context/NotificationContext';
import ApiService from '../services/api/apiService';

const ClientsPage = ({ 
  clients = [],
  projects = [],
  onAddClient,
  onUpdateClient,
  onDeleteClient
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('cards');
  
  // CRUD Modal States
  const [clientFormModal, setClientFormModal] = useState({
    open: false,
    client: null,
    loading: false,
    error: null
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    client: null,
    loading: false,
    error: null
  });
  
  const { showSuccess, showError } = useNotification();

  // CRUD Handlers
  const handleAddClient = useCallback(() => {
    setClientFormModal({
      open: true,
      client: null,
      loading: false,
      error: null
    });
  }, []);

  const handleEditClient = useCallback((client) => {
    setClientFormModal({
      open: true,
      client,
      loading: false,
      error: null
    });
  }, []);

  const handleDeleteClient = useCallback((client) => {
    const clientProjects = projects.filter(p => p.clientId === client.id);
    setDeleteConfirmation({
      open: true,
      client,
      loading: false,
      error: null,
      consequences: clientProjects.length > 0 ? [
        `Remove association with ${clientProjects.length} project${clientProjects.length === 1 ? '' : 's'}`,
        'Archive all client communications',
        'Update project records to reflect client removal'
      ] : []
    });
  }, [projects]);

  const handleClientSubmit = useCallback(async (clientIdOrData, updateData = null) => {
    setClientFormModal(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let result;
      const isEdit = updateData !== null;
      
      if (isEdit) {
        // Update existing client
        result = await ApiService.updateClient(clientIdOrData, updateData);
        showSuccess('Client Updated', `Client "${updateData.companyName || updateData.name}" has been updated successfully.`);
        if (onUpdateClient) onUpdateClient(clientIdOrData, result);
      } else {
        // Create new client
        result = await ApiService.createClient(clientIdOrData);
        showSuccess('Client Added', `Client "${clientIdOrData.companyName || clientIdOrData.name}" has been added successfully.`);
        if (onAddClient) onAddClient(result);
      }
      
      // Close modal
      setClientFormModal({
        open: false,
        client: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Client submission error:', error);
      setClientFormModal(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to save client. Please try again.'
      }));
      showError(
        isEdit ? 'Update Failed' : 'Creation Failed',
        error.message || 'An error occurred while saving the client.'
      );
    }
  }, [onAddClient, onUpdateClient, showSuccess, showError]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirmation.client) return;
    
    setDeleteConfirmation(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await ApiService.deleteClient(deleteConfirmation.client.id);
      showSuccess(
        'Client Deleted',
        `Client "${deleteConfirmation.client.companyName || deleteConfirmation.client.name}" has been deleted successfully.`
      );
      
      if (onDeleteClient) {
        onDeleteClient(deleteConfirmation.client.id);
      }
      
      // Close modal
      setDeleteConfirmation({
        open: false,
        client: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Client deletion error:', error);
      setDeleteConfirmation(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to delete client. Please try again.'
      }));
      showError(
        'Deletion Failed',
        error.message || 'An error occurred while deleting the client.'
      );
    }
  }, [deleteConfirmation.client, onDeleteClient, showSuccess, showError]);

  const handleCloseClientForm = useCallback(() => {
    setClientFormModal({
      open: false,
      client: null,
      loading: false,
      error: null
    });
  }, []);

  const handleCloseDeleteConfirmation = useCallback(() => {
    setDeleteConfirmation({
      open: false,
      client: null,
      loading: false,
      error: null
    });
  }, []);

  // Calculate client statistics
  const clientStats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const potentialClients = clients.filter(c => c.status === 'potential').length;
    const inactiveClients = clients.filter(c => c.status === 'inactive').length;
    
    // Calculate projects by client
    const clientProjects = clients.map(client => {
      const clientProjectCount = projects.filter(p => p.clientId === client.id).length;
      return { ...client, projectCount: clientProjectCount };
    });
    
    const totalProjects = projects.length;
    const averageProjectsPerClient = totalClients > 0 ? Math.round(totalProjects / totalClients * 10) / 10 : 0;

    return {
      total: totalClients,
      active: activeClients,
      potential: potentialClients,
      inactive: inactiveClients,
      totalProjects,
      averageProjectsPerClient
    };
  }, [clients, projects]);

  // Get top clients (by project count)
  const topClients = useMemo(() => {
    return clients
      .map(client => {
        const clientProjects = projects.filter(p => p.clientId === client.id);
        const activeProjects = clientProjects.filter(p => p.status === 'active' || p.status === 'in-progress');
        return {
          ...client,
          projectCount: clientProjects.length,
          activeProjectCount: activeProjects.length
        };
      })
      .filter(client => client.projectCount > 0)
      .sort((a, b) => b.projectCount - a.projectCount)
      .slice(0, 5);
  }, [clients, projects]);

  // Get recent clients (last 5)
  const recentClients = useMemo(() => {
    return [...clients]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 5);
  }, [clients]);

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'active': return 'status-completed';
      case 'potential': return 'status-in-progress';
      case 'inactive': return 'status-todo';
      default: return 'status-todo';
    }
  };

  const getCompanyInitials = (companyName) => {
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const headerActions = (
    <>
      <IconButton className="clean-button-secondary">
        <FilterList />
      </IconButton>
      <Button className="clean-button-primary" startIcon={<Add />} onClick={handleAddClient}>
        Add client
      </Button>
    </>
  );

  const tabs = (
    <>
      <CleanTab 
        label="Overview" 
        isActive={activeTab === 'overview'}
        onClick={() => setActiveTab('overview')}
        icon={<ArrowUp sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="All Clients" 
        isActive={activeTab === 'clients'}
        onClick={() => setActiveTab('clients')}
        icon={<ViewList sx={{ fontSize: 16 }} />}
        badge={clientStats.total}
      />
      <CleanTab 
        label="Analytics" 
        isActive={activeTab === 'analytics'}
        onClick={() => setActiveTab('analytics')}
        icon={<CheckCircle sx={{ fontSize: 16 }} />}
      />
    </>
  );

  const StatsCard = ({ title, value, subtitle, icon, color = '#E3AF64' }) => (
    <Card className="clean-card">
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7280',
                fontSize: '13px',
                fontWeight: 500,
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#0F1939',
                mb: 0.5
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '12px'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { 
              sx: { fontSize: 24, color: color }
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const ClientCard = ({ client, showProjects = true }) => {
    const handleCardClick = (e) => {
      // Prevent card click when clicking on action buttons
      if (e.target.closest('.client-actions')) {
        return;
      }
      // Add view client functionality here if needed
    };

    const handleEditClick = (e) => {
      e.stopPropagation();
      handleEditClient(client);
    };

    const handleDeleteClick = (e) => {
      e.stopPropagation();
      handleDeleteClient(client);
    };

    return (
      <Card className="clean-card" sx={{ height: '100%', cursor: 'pointer' }} onClick={handleCardClick}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                fontSize: '16px',
                fontWeight: 600,
                bgcolor: '#E67E22',
                mr: 2
              }}
            >
              {getCompanyInitials(client.companyName || client.name || 'C')}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#0F1939',
                  mb: 0.5,
                  lineHeight: 1.3
                }}
              >
                {client.companyName || client.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6B7280', 
                  fontSize: '13px',
                  mb: 0.5
                }}
              >
                {client.contactPerson || 'No contact'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#9CA3AF', 
                  fontSize: '12px'
                }}
              >
                {client.industry || 'Industry not specified'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <Chip
                label={client.status || 'active'}
                size="small"
                className={`clean-chip ${getStatusChipClass(client.status)}`}
              />
              <Box className="client-actions" sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: '#9CA3AF',
                    '&:hover': { color: '#E3AF64', bgcolor: '#FEF3E2' }
                  }}
                  onClick={handleEditClick}
                  title="Edit Client"
                >
                  <Edit size={16} />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: '#9CA3AF',
                    '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' }
                  }}
                  onClick={handleDeleteClick}
                  title="Delete Client"
                >
                  <Delete size={16} />
                </IconButton>
              </Box>
            </Box>
          </Box>

        {showProjects && (
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#6B7280',
                fontSize: '12px',
                fontWeight: 500,
                mb: 1,
                display: 'block'
              }}
            >
              Projects: {client.projectCount || 0}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min((client.activeProjectCount || 0) * 20, 100)}
              className="clean-progress-bar"
              sx={{
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#10B981'
                }
              }}
            />
          </Box>
        )}

        {client.email && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#6B7280',
              fontSize: '12px'
            }}
          >
            {client.email}
          </Typography>
        )}

        {client.createdAt && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#9CA3AF',
                fontSize: '11px'
              }}
            >
              Added {formatDate(client.createdAt)}
            </Typography>
          </Box>
        )}
        </CardContent>
      </Card>
    );
  };

  const renderOverviewContent = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Clients"
            value={clientStats.total}
            subtitle={`${clientStats.active} active`}
            icon={<BusinessIcon />}
            color="#516AC8"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Active Clients"
            value={clientStats.active}
            subtitle={`${Math.round((clientStats.active / clientStats.total) * 100) || 0}% of total`}
            icon={<CheckCircle />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Potential Clients"
            value={clientStats.potential}
            subtitle="In pipeline"
            icon={<CheckCircle />}
            color="#E3AF64"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Projects"
            value={clientStats.totalProjects}
            subtitle={`${clientStats.averageProjectsPerClient} avg per client`}
            icon={<ArrowUp />}
            color="#E3AF64"
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={4}>
        {/* Top Clients */}
        <Grid item xs={12} lg={8}>
          <Card className="clean-card">
            <Box className="clean-section-header">
              <Box className="clean-section-indicator"></Box>
              <Typography className="clean-section-title">
                Top Clients
              </Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Grid container spacing={3} sx={{ p: 3 }}>
                {topClients.map((client) => (
                  <Grid item xs={12} sm={6} key={client.id}>
                    <ClientCard client={client} />
                  </Grid>
                ))}
                {topClients.length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 2 }} />
                      <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                        No client project data available yet
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Clients */}
        <Grid item xs={12} lg={4}>
          <Card className="clean-card">
            <Box className="clean-section-header">
              <Box className="clean-section-indicator" sx={{ backgroundColor: '#516AC8' }}></Box>
              <Typography className="clean-section-title">
                Recent Clients
              </Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              {recentClients.length > 0 ? (
                recentClients.map((client, index) => (
                  <Box
                    key={client.id}
                    sx={{
                      p: 2,
                      borderBottom: index < recentClients.length - 1 ? '1px solid #E5E7EB' : 'none',
                      '&:hover': {
                        backgroundColor: '#F6F3E7'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '12px',
                          fontWeight: 600,
                          bgcolor: '#E67E22'
                        }}
                      >
                        {getCompanyInitials(client.companyName || client.name || 'C')}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#0F1939',
                            fontSize: '14px',
                            mb: 0.5
                          }}
                        >
                          {client.companyName || client.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#6B7280',
                            fontSize: '12px'
                          }}
                        >
                          {client.status || 'active'} • {client.createdAt ? formatDate(client.createdAt) : 'Recently'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#9CA3AF',
                      fontSize: '14px'
                    }}
                  >
                    No clients added yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderClientsContent = () => (
    <Box>
      <ClientsList
        clients={clients}
        onUpdateClient={onUpdateClient}
        onDeleteClient={onDeleteClient}
        onAddClient={onAddClient}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </Box>
  );

  const renderAnalyticsContent = () => (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
        📈 Client Analytics
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
        Advanced client analytics and insights coming soon
      </Typography>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'clients':
        return renderClientsContent();
      case 'analytics':
        return renderAnalyticsContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <>
      <CleanPageLayout
        title="Clients"
        subtitle="Manage your client relationships and track business development"
        breadcrumbs={[
          { label: 'Team Space', href: '/workspace' },
          { label: 'Clients', href: '/clients' }
        ]}
        headerActions={headerActions}
        tabs={tabs}
      >
        <Box className="clean-fade-in">
          {renderTabContent()}
        </Box>
      </CleanPageLayout>

      {/* Client Form Modal */}
      <ClientFormModal
        open={clientFormModal.open}
        onClose={handleCloseClientForm}
        onSubmit={handleClientSubmit}
        client={clientFormModal.client}
        loading={clientFormModal.loading}
        error={clientFormModal.error}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmation.open}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleDeleteConfirm}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        itemName={deleteConfirmation.client?.companyName || deleteConfirmation.client?.name}
        itemType="client"
        loading={deleteConfirmation.loading}
        error={deleteConfirmation.error}
        consequences={deleteConfirmation.consequences || []}
      />
    </>
  );
};

export default ClientsPage;