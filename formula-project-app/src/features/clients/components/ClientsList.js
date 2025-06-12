import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Person as PersonIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNotification } from '../../../context';
import ClientForm from './ClientForm';
import UnifiedHeader from '../../../components/ui/UnifiedHeader';
import UnifiedFilters from '../../../components/ui/UnifiedFilters';
import UnifiedTableView from '../../../components/ui/UnifiedTableView';

const ClientsList = ({ clients, onUpdateClient, onDeleteClient, onAddClient }) => {
  const { showNotification } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Enhanced view state
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [sortBy, setSortBy] = useState('companyName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    status: '',
    industry: '',
    companySize: '',
    services: []
  });

  const handleMenuOpen = (event, client) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClient(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    onDeleteClient(selectedClient.id);
    setDeleteDialogOpen(false);
    setSelectedClient(null);
    showNotification('Client deleted successfully', 'success');
  };

  const handleEditSubmit = (updatedClient) => {
    onUpdateClient(selectedClient.id, updatedClient);
    setEditDialogOpen(false);
    setSelectedClient(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#757575';
      case 'potential':
        return '#FF9800';
      default:
        return '#757575';
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

  // Filter configuration for clients
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'potential', label: 'Potential' }
      ]
    },
    {
      key: 'industry',
      label: 'Industry',
      type: 'select',
      options: [
        { value: 'construction', label: 'Construction' },
        { value: 'finance', label: 'Finance' },
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'retail', label: 'Retail' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'education', label: 'Education' },
        { value: 'government', label: 'Government' },
        { value: 'hospitality', label: 'Hospitality' },
        { value: 'real_estate', label: 'Real Estate' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      key: 'companySize',
      label: 'Company Size',
      type: 'select',
      options: [
        { value: 'startup', label: 'Startup (1-10)' },
        { value: 'small', label: 'Small (11-50)' },
        { value: 'medium', label: 'Medium (51-200)' },
        { value: 'large', label: 'Large (201-1000)' },
        { value: 'enterprise', label: 'Enterprise (1000+)' }
      ]
    },
    {
      key: 'services',
      label: 'Services Required',
      type: 'multiselect',
      options: [
        { value: 'general-contractor', label: 'General Contractor' },
        { value: 'fit-out', label: 'Fit-out' },
        { value: 'mep', label: 'MEP' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'millwork', label: 'Millwork' },
        { value: 'management', label: 'Project Management' }
      ]
    }
  ];

  // Quick filters for clients
  const quickFilters = [
    { key: 'active', label: 'Active Clients', filters: { status: 'active' } },
    { key: 'potential', label: 'Potential Clients', filters: { status: 'potential' } },
    { key: 'construction', label: 'Construction', filters: { industry: 'construction' } },
    { key: 'finance', label: 'Finance', filters: { industry: 'finance' } },
    { key: 'large', label: 'Large Companies', filters: { companySize: 'large' } }
  ];

  // Table columns configuration
  const tableColumns = [
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      type: 'avatar',
      render: (value, row) => ({
        fallback: getCompanyInitials(row.companyName),
        bgColor: '#E67E22',
        text: row.companyName
      })
    },
    {
      key: 'contactPersonName',
      label: 'Contact Person',
      sortable: true
    },
    {
      key: 'contactPersonTitle',
      label: 'Title',
      sortable: true
    },
    {
      key: 'industry',
      label: 'Industry',
      render: (value) => {
        const industryConfig = filterConfig.find(f => f.key === 'industry');
        const option = industryConfig?.options.find(opt => opt.value === value);
        return option ? option.label : value;
      }
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email'
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'phone'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'chip',
      render: (value) => ({
        label: value.charAt(0).toUpperCase() + value.slice(1),
        color: getStatusColor(value),
        bgColor: `${getStatusColor(value)}20`
      })
    }
  ];

  // Table actions
  const tableActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: <ViewIcon />
    },
    {
      key: 'edit',
      label: 'Edit Client',
      icon: <EditIcon />
    },
    {
      key: 'delete',
      label: 'Delete Client',
      icon: <DeleteIcon />
    }
  ];

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      // Search filter
      const searchLower = searchValue.toLowerCase();
      const matchesSearch = !searchValue || 
        client.companyName.toLowerCase().includes(searchLower) ||
        client.contactPersonName.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.industry?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = !filters.status || client.status === filters.status;

      // Industry filter
      const matchesIndustry = !filters.industry || client.industry === filters.industry;

      // Company size filter
      const matchesCompanySize = !filters.companySize || client.companySize === filters.companySize;

      // Services filter
      const matchesServices = !filters.services.length || 
        (client.services && filters.services.some(service => client.services.includes(service)));

      return matchesSearch && matchesStatus && matchesIndustry && matchesCompanySize && matchesServices;
    });

    // Sort clients
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'company':
        case 'companyName':
          aValue = a.companyName.toLowerCase();
          bValue = b.companyName.toLowerCase();
          break;
        case 'contactPersonName':
          aValue = a.contactPersonName.toLowerCase();
          bValue = b.contactPersonName.toLowerCase();
          break;
        case 'industry':
          aValue = a.industry || '';
          bValue = b.industry || '';
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, searchValue, filters, sortBy, sortDirection]);

  // Get active filters for display
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '';
    })
    .map(([key, value]) => {
      let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      let displayValue = value;
      
      if (key === 'industry' || key === 'status' || key === 'companySize') {
        const config = filterConfig.find(f => f.key === key);
        const option = config?.options.find(opt => opt.value === value);
        displayValue = option ? option.label : value;
      } else if (Array.isArray(value)) {
        const config = filterConfig.find(f => f.key === key);
        displayValue = value.map(v => {
          const option = config?.options.find(opt => opt.value === v);
          return option ? option.label : v;
        }).join(', ');
      }
      
      return { key, label, value: displayValue };
    });

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      industry: '',
      companySize: '',
      services: []
    });
  };

  const handleClearFilter = (key) => {
    if (key === 'all') {
      handleClearFilters();
    } else if (key === 'services') {
      setFilters(prev => ({ ...prev, [key]: [] }));
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleApplyQuickFilter = (quickFilter) => {
    setFilters(prev => ({ ...prev, ...quickFilter.filters }));
  };

  const handleSort = (column, direction) => {
    setSortBy(column);
    setSortDirection(direction);
  };

  const handleRowAction = (action, client) => {
    setSelectedClient(client);
    switch (action) {
      case 'view':
        // Handle view action - could open a detailed view
        console.log('View client:', client);
        break;
      case 'edit':
        setEditDialogOpen(true);
        break;
      case 'delete':
        setDeleteDialogOpen(true);
        break;
    }
  };

  const handleExport = () => {
    const { exportClientsToExcel } = require('../../../services/export/excelExport');
    exportClientsToExcel(filteredAndSortedClients);
  };

  // Empty state
  if (clients.length === 0) {
    return (
      <Box>
        <UnifiedHeader
          title="Clients"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFiltersCount={activeFilters.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={handleExport}
          onAdd={onAddClient}
          addButtonText="Add Client"
          activeFilters={activeFilters}
          onClearFilter={handleClearFilter}
        />
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: '#BDC3C7', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Clients Found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start by adding your first client to manage their information and projects.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Unified Header */}
      <UnifiedHeader
        title="Clients"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFiltersCount={activeFilters.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExport}
        onAdd={onAddClient}
        addButtonText="Add Client"
        activeFilters={activeFilters}
        onClearFilter={handleClearFilter}
      />

      {/* Unified Filters */}
      <UnifiedFilters
        show={showFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onApplyQuickFilter={handleApplyQuickFilter}
        filterConfig={filterConfig}
        quickFilters={quickFilters}
      />

      {/* Table View */}
      {viewMode === 'table' && (
        <UnifiedTableView
          data={filteredAndSortedClients}
          columns={tableColumns}
          onSort={handleSort}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onRowAction={handleRowAction}
          actions={tableActions}
          emptyStateMessage="No clients match your filters"
          emptyStateIcon={BusinessIcon}
        />
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <Grid container spacing={3}>
          {filteredAndSortedClients.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No clients match your filters
                </Typography>
              </Box>
            </Grid>
          ) : (
            filteredAndSortedClients.map((client) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={client.id}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid #E9ECEF',
                    borderRadius: 3,
                    height: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }
                  }}
            >
                  <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header with Company Info */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: '#E67E22',
                      width: 48,
                      height: 48,
                      mr: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    {getCompanyInitials(client.companyName)}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#2C3E50',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {client.companyName}
                    </Typography>
                    <Chip
                      label={client.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(client.status),
                        color: 'white',
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>

                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, client)}
                    sx={{ color: '#7F8C8D' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                {/* Industry */}
                {client.industry && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <BusinessIcon sx={{ fontSize: 16, color: '#7F8C8D', mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {client.industry}
                    </Typography>
                  </Box>
                )}

                {/* Contact Person */}
                {client.contactPersonName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <PersonIcon sx={{ fontSize: 16, color: '#7F8C8D', mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {client.contactPersonName}
                      {client.contactPersonTitle && ` - ${client.contactPersonTitle}`}
                    </Typography>
                  </Box>
                )}

                {/* Email */}
                {client.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <EmailIcon sx={{ fontSize: 16, color: '#7F8C8D', mr: 1 }} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {client.email}
                    </Typography>
                  </Box>
                )}

                {/* Phone */}
                {client.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: '#7F8C8D', mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {client.phone}
                    </Typography>
                  </Box>
                )}

                {/* Location */}
                {client.city && client.country && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <LocationIcon sx={{ fontSize: 16, color: '#7F8C8D', mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {client.city}, {client.country}
                    </Typography>
                  </Box>
                )}

                {/* Website */}
                {client.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WebsiteIcon sx={{ fontSize: 16, color: '#7F8C8D', mr: 1 }} />
                    <Typography
                      variant="body2"
                      color="primary"
                      component="a"
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {client.website}
                    </Typography>
                  </Box>
                )}

                {/* Services */}
                {client.services && client.services.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                      Services Required:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {client.services.slice(0, 3).map((service) => (
                        <Chip
                          key={service}
                          label={service}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            height: 24,
                            borderColor: '#E67E22',
                            color: '#E67E22'
                          }}
                        />
                      ))}
                      {client.services.length > 3 && (
                        <Tooltip
                          title={client.services.slice(3).join(', ')}
                          arrow
                        >
                          <Chip
                            label={`+${client.services.length - 3} more`}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.7rem',
                              height: 24,
                              borderColor: '#BDC3C7',
                              color: '#7F8C8D'
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Client</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Client</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent>
          {selectedClient && (
            <ClientForm
              onSubmit={handleEditSubmit}
              initialData={selectedClient}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedClient?.companyName}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientsList;