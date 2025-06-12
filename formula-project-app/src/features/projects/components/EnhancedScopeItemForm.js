import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  InputAdornment,
  Paper
} from '@mui/material';
import { AttachFile as AttachFileIcon } from '@mui/icons-material';

const EnhancedScopeItemForm = ({ item, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    quantity: '',
    unitPrice: '',
    unit: 'pcs',
    category: '',
    notes: '',
    attachments: null
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (item) {
      setFormData({
        description: item.description || '',
        quantity: item.quantity || '',
        unitPrice: item.unitPrice || '',
        unit: item.unit || 'pcs',
        category: item.category || '',
        notes: item.notes || '',
        attachments: item.attachments || null
      });
    }
  }, [item]);

  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.unitPrice) || 0;
    setTotalPrice(qty * price);
  }, [formData.quantity, formData.unitPrice]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        attachments: file.name
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      alert('Please enter a valid unit price');
      return;
    }

    onSubmit(formData);
  };

  const unitOptions = [
    'pcs', 'sqm', 'sqft', 'lm', 'lft', 'm', 'ft', 
    'kg', 'lb', 'ton', 'hours', 'days', 'lot'
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Description */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            required
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Enter item description..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  📝
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Quantity and Unit Price */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Quantity"
            required
            type="number"
            value={formData.quantity}
            onChange={handleChange('quantity')}
            inputProps={{ step: 'any', min: 0 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Unit Price"
            required
            type="number"
            value={formData.unitPrice}
            onChange={handleChange('unitPrice')}
            inputProps={{ step: 'any', min: 0 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
        </Grid>

        {/* Total Price Display */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#F8F9FA', border: '1px solid #E9ECEF' }}>
            <Typography variant="h6" sx={{ color: '#27AE60', fontWeight: 600 }}>
              Total Price: ${totalPrice.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Unit and Category */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Unit</InputLabel>
            <Select
              value={formData.unit}
              onChange={handleChange('unit')}
              label="Unit"
            >
              {unitOptions.map(unit => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={handleChange('category')}
              label="Category"
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* File Upload */}
        <Grid item xs={12}>
          <Box sx={{ 
            border: '2px dashed #E9ECEF', 
            borderRadius: 2, 
            p: 3,
            textAlign: 'center',
            backgroundColor: '#F8F9FA'
          }}>
            <input
              accept="*/*"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AttachFileIcon />}
                sx={{ 
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Choose File
              </Button>
            </label>
            {formData.attachments && (
              <Typography variant="body2" sx={{ mt: 1, color: '#27AE60' }}>
                Attached: {formData.attachments}
              </Typography>
            )}
            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#6C757D' }}>
              Upload specifications, drawings, or other relevant files
            </Typography>
          </Box>
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={formData.notes}
            onChange={handleChange('notes')}
            placeholder="Additional notes or specifications..."
          />
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ 
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ 
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#27AE60',
                '&:hover': {
                  backgroundColor: '#229954'
                }
              }}
            >
              {item ? 'Update Item' : 'Add Item'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedScopeItemForm;