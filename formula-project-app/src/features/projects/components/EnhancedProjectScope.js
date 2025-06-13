import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  FileUpload as ImportIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import EnhancedScopeItemForm from './EnhancedScopeItemForm';
import ScopeImportDialog from './ScopeImportDialog';
import apiService from '../../../services/api/apiService';
import PageWrapper from '../../../components/layout/PageWrapper';

const EnhancedProjectScope = ({ project, onClose }) => {
  const [scopeItems, setScopeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Construction/Millwork categories
  const scopeCategories = [
    'Demolition',
    'Structural Work',
    'MEP (Mechanical, Electrical, Plumbing)',
    'Millwork & Carpentry',
    'Flooring & Tiling',
    'Painting & Finishing',
    'Glass & Glazing',
    'Hardware & Accessories',
    'Insulation',
    'Waterproofing',
    'HVAC Systems',
    'Electrical Systems',
    'Fire Safety',
    'Security Systems',
    'General Contractor Items'
  ];

  useEffect(() => {
    loadScopeItems();
  }, [project.id]);

  const loadScopeItems = async () => {
    try {
      setLoading(true);
      const items = await apiService.getScopeItems(project.id);
      setScopeItems(items || []);
    } catch (error) {
      console.error('Error loading scope items:', error);
      showNotification('Failed to load scope items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleAddScopeItem = async (itemData) => {
    try {
      const newItem = {
        ...itemData,
        id: Date.now(),
        projectId: project.id,
        createdAt: new Date().toISOString(),
        totalPrice: parseFloat(itemData.quantity) * parseFloat(itemData.unitPrice)
      };

      await apiService.createScopeItem(newItem);
      setScopeItems([...scopeItems, newItem]);
      setAddDialogOpen(false);
      showNotification('Scope item added successfully');
    } catch (error) {
      console.error('Error adding scope item:', error);
      showNotification('Failed to add scope item', 'error');
    }
  };

  const handleEditScopeItem = async (itemData) => {
    try {
      const updatedItem = {
        ...itemData,
        totalPrice: parseFloat(itemData.quantity) * parseFloat(itemData.unitPrice),
        updatedAt: new Date().toISOString()
      };

      await apiService.updateScopeItem(editingItem.id, updatedItem);
      setScopeItems(scopeItems.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      setEditingItem(null);
      showNotification('Scope item updated successfully');
    } catch (error) {
      console.error('Error updating scope item:', error);
      showNotification('Failed to update scope item', 'error');
    }
  };

  const handleDeleteScopeItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this scope item?')) {
      try {
        await apiService.deleteScopeItem(itemId);
        setScopeItems(scopeItems.filter(item => item.id !== itemId));
        showNotification('Scope item deleted successfully');
      } catch (error) {
        console.error('Error deleting scope item:', error);
        showNotification('Failed to delete scope item', 'error');
      }
    }
  };

  const handleImportItems = async (importedItems) => {
    try {
      const newItems = importedItems.map(item => ({
        ...item,
        id: Date.now() + Math.random(),
        projectId: project.id,
        createdAt: new Date().toISOString(),
        totalPrice: parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)
      }));

      for (const item of newItems) {
        await apiService.createScopeItem(item);
      }

      setScopeItems([...scopeItems, ...newItems]);
      setImportDialogOpen(false);
      showNotification(`Successfully imported ${newItems.length} scope items`);
    } catch (error) {
      console.error('Error importing scope items:', error);
      showNotification('Failed to import scope items', 'error');
    }
  };

  // Calculate summary statistics
  const totalItems = scopeItems.length;
  const totalQuantity = scopeItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const totalValue = scopeItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  return (
    <PageWrapper
      pageType="project-scope"
      pageTitle="Scope Management"
      pageData={{
        projectId: project.id,
        projectName: project.name,
        status: project.status,
        type: project.type
      }}
      subtitle={`${totalItems} items • $${totalValue.toLocaleString()} total value`}
      actions={[
        {
          icon: <ImportIcon />,
          label: 'Import Excel',
          onClick: () => setImportDialogOpen(true),
          color: 'default'
        },
        {
          icon: <AddIcon />,
          label: 'Add Item',
          onClick: () => setAddDialogOpen(true),
          color: 'primary'
        }
      ]}
      onNavigate={(path) => {
        if (path === '/projects') {
          onClose();
        }
      }}
      contentPadding={0}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3, 
              border: '1px solid #E9ECEF',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  backgroundColor: '#3498DB', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    📋
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2C3E50', mb: 1 }}>
                  {totalItems}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Total Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3, 
              border: '1px solid #E9ECEF',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  backgroundColor: '#27AE60', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    📊
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2C3E50', mb: 1 }}>
                  {totalQuantity.toFixed(0)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Total Quantity
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3, 
              border: '1px solid #E9ECEF',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  backgroundColor: '#F39C12', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    💰
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2C3E50', mb: 1 }}>
                  ${totalValue.toLocaleString()}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Total Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Scope Items Table */}
      <Box sx={{ flexGrow: 1, mx: 3, mb: 3 }}>
        <Paper sx={{ 
          borderRadius: 3, 
          border: '1px solid #E9ECEF',
          boxShadow: 'none',
          overflow: 'hidden'
        }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Unit Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scopeItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        No scope items found. Click "Add Item" to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  scopeItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Chip 
                          label={item.category || 'Uncategorized'} 
                          size="small"
                          sx={{ 
                            backgroundColor: '#E3F2FD',
                            color: '#1976D2'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.description}
                        </Typography>
                        {item.notes && (
                          <Typography variant="caption" color="textSecondary">
                            {item.notes}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{item.unit || 'pcs'}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${parseFloat(item.unitPrice || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${(item.totalPrice || 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small"
                            onClick={() => setEditingItem(item)}
                            sx={{ color: '#3498DB' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => handleDeleteScopeItem(item.id)}
                            sx={{ color: '#E74C3C' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          {item.attachments && (
                            <IconButton 
                              size="small"
                              sx={{ color: '#95A5A6' }}
                            >
                              <AttachFileIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Add/Edit Scope Item Dialog */}
      <Dialog 
        open={addDialogOpen || !!editingItem} 
        onClose={() => {
          setAddDialogOpen(false);
          setEditingItem(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Edit Scope Item' : 'Add New Scope Item'}
        </DialogTitle>
        <DialogContent>
          <EnhancedScopeItemForm
            item={editingItem}
            categories={scopeCategories}
            onSubmit={editingItem ? handleEditScopeItem : handleAddScopeItem}
            onCancel={() => {
              setAddDialogOpen(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <ScopeImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImportItems}
        categories={scopeCategories}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      </Box>
    </PageWrapper>
  );
};

export default EnhancedProjectScope;