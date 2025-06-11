import React, { useState } from 'react';
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
  Person as PersonIcon
} from '@mui/icons-material';
import { useNotification } from '../context';
import ClientForm from './ClientForm';

const ClientsList = ({ clients, onUpdateClient, onDeleteClient }) => {
  const { showNotification } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  if (clients.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <BusinessIcon sx={{ fontSize: 64, color: '#BDC3C7', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Clients Found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Start by adding your first client to manage their information and projects.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {clients.map((client) => (
          <Grid item xs={12} md={6} lg={4} key={client.id}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #E9ECEF',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
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
        ))}
      </Grid>

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
    </>
  );
};

export default ClientsList;