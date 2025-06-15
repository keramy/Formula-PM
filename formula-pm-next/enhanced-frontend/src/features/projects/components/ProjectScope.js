import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Chip,
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';

const ProjectScope = ({ project, onClose }) => {
  const [scopeItems, setScopeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    unit: '',
    quantity: '',
    unitPrice: '',
    notes: ''
  });

  const categories = [
    'General Construction',
    'MEP Systems',
    'Electrical',
    'HVAC',
    'Plumbing',
    'Finishes',
    'Millwork',
    'Furniture',
    'Technology',
    'Landscaping',
    'Permits & Fees',
    'Other'
  ];

  const units = [
    'sqm', 'lm', 'pcs', 'ls', 'kg', 'ton', 'hour', 'day', 'month', 'lot'
  ];

  useEffect(() => {
    if (project) {
      loadScopeItems();
    }
  }, [project]);

  const loadScopeItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/projects/${project.id}/scope`);
      if (response.ok) {
        const data = await response.json();
        setScopeItems(data);
      } else {
        throw new Error('Failed to load scope items');
      }
    } catch (error) {
      console.error('Error loading scope items:', error);
      setError('Failed to load scope items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = isEditing 
        ? `http://localhost:5001/api/scope/${selectedItem.id}`
        : `http://localhost:5001/api/projects/${project.id}/scope`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity) || 0,
          unitPrice: parseFloat(formData.unitPrice) || 0,
          totalPrice: (parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0)
        }),
      });

      if (response.ok) {
        await loadScopeItems();
        handleCloseDialog();
      } else {
        throw new Error('Failed to save scope item');
      }
    } catch (error) {
      console.error('Error saving scope item:', error);
      setError('Failed to save scope item');
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.description}"?`)) {
      try {
        const response = await fetch(`http://localhost:5001/api/scope/${item.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadScopeItems();
        } else {
          throw new Error('Failed to delete scope item');
        }
      } catch (error) {
        console.error('Error deleting scope item:', error);
        setError('Failed to delete scope item');
      }
    }
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setIsEditing(true);
      setSelectedItem(item);
      setFormData({
        category: item.category || '',
        description: item.description || '',
        unit: item.unit || '',
        quantity: item.quantity?.toString() || '',
        unitPrice: item.unitPrice?.toString() || '',
        notes: item.notes || ''
      });
    } else {
      setIsEditing(false);
      setSelectedItem(null);
      setFormData({
        category: '',
        description: '',
        unit: '',
        quantity: '',
        unitPrice: '',
        notes: ''
      });
    }
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setSelectedItem(null);
    setFormData({
      category: '',
      description: '',
      unit: '',
      quantity: '',
      unitPrice: '',
      notes: ''
    });
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const calculateTotals = () => {
    const totalQuantity = scopeItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = scopeItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const categorySummary = scopeItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = { count: 0, total: 0 };
      }
      acc[category].count += 1;
      acc[category].total += item.totalPrice || 0;
      return acc;
    }, {});

    return { totalQuantity, totalAmount, categorySummary };
  };

  const { totalQuantity, totalAmount, categorySummary } = calculateTotals();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography>Loading scope items...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2C3E50' }}>
          Project Scope - {project.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Import Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ textTransform: 'none' }}
          >
            Add Item
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CategoryIcon sx={{ fontSize: 40, color: '#3498db', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {scopeItems.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalculateIcon sx={{ fontSize: 40, color: '#27ae60', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {totalQuantity.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Quantity
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon sx={{ fontSize: 40, color: '#e67e22', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatCurrency(totalAmount)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Summary */}
      {Object.keys(categorySummary).length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Category Breakdown
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(categorySummary).map(([category, data]) => (
              <Chip
                key={category}
                label={`${category}: ${data.count} items (${formatCurrency(data.total)})`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Scope Items Table */}
      <Paper elevation={0} sx={{ border: '1px solid #E9ECEF', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#F8F9FA', fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ backgroundColor: '#F8F9FA', fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ backgroundColor: '#F8F9FA', fontWeight: 600 }}>Unit</TableCell>
                <TableCell sx={{ backgroundColor: '#F8F9FA', fontWeight: 600 }}>Quantity</TableCell>
                <TableCell sx={{ backgroundColor: '#F8F9FA', fontWeight: 600 }}>Unit Price</TableCell>
                <TableCell sx={{ backgroundColor: '#F8F9FA', fontWeight: 600 }}>Total Price</TableCell>
                <TableCell sx={{ backgroundColor: '#F8F9FA', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scopeItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No scope items found. Click "Add Item" to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                scopeItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Chip 
                        label={item.category || 'Other'} 
                        size="small"
                        sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
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
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.quantity?.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {formatCurrency(item.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, item)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleOpenDialog(selectedItem)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Item</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedItem)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Item</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Scope Item' : 'Add New Scope Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleChange('category')}
                  label="Category"
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={formData.unit}
                  onChange={handleChange('unit')}
                  label="Unit"
                  required
                >
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange('quantity')}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Unit Price"
                type="number"
                value={formData.unitPrice}
                onChange={handleChange('unitPrice')}
                required
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Price"
                value={formatCurrency((parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0))}
                InputProps={{
                  readOnly: true
                }}
                sx={{ backgroundColor: '#F8F9FA' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.category || !formData.description || !formData.unit || !formData.quantity || !formData.unitPrice}
          >
            {isEditing ? 'Update' : 'Add'} Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectScope;