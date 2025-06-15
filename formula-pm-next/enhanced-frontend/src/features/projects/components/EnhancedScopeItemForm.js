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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 1. Description */}
        <TextField
          fullWidth
          label="1. Description"
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

        {/* 2. Category */}
        <FormControl fullWidth>
          <InputLabel>2. Category</InputLabel>
          <Select
            value={formData.category}
            onChange={handleChange('category')}
            label="2. Category"
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

        {/* 3. Quantity */}
        <TextField
          fullWidth
          label="3. Quantity"
          required
          type="number"
          value={formData.quantity}
          onChange={handleChange('quantity')}
          inputProps={{ step: 'any', min: 0 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                📊
              </InputAdornment>
            )
          }}
        />

        {/* 4. Unit */}
        <FormControl fullWidth>
          <InputLabel>4. Unit</InputLabel>
          <Select
            value={formData.unit}
            onChange={handleChange('unit')}
            label="4. Unit"
          >
            {unitOptions.map(unit => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 5. Unit Price */}
        <TextField
          fullWidth
          label="5. Unit Price"
          required
          type="number"
          value={formData.unitPrice}
          onChange={handleChange('unitPrice')}
          inputProps={{ step: 'any', min: 0 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">💰 $</InputAdornment>
          }}
        />

        {/* Total Price Display */}
        <Paper sx={{ p: 3, backgroundColor: '#F8F9FA', border: '2px solid #27AE60', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ color: '#27AE60', fontWeight: 700, textAlign: 'center' }}>
            Total Price: ${totalPrice.toLocaleString()}
          </Typography>
        </Paper>

        {/* 6. Notes */}
        <TextField
          fullWidth
          label="6. Notes (Optional)"
          multiline
          rows={3}
          value={formData.notes}
          onChange={handleChange('notes')}
          placeholder="Additional notes or specifications..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                📋
              </InputAdornment>
            )
          }}
        />

        {/* 7. File Attachments */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
            7. File Attachments (Optional)
          </Typography>
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
                📎 Choose File
              </Button>
            </label>
            {formData.attachments && (
              <Typography variant="body2" sx={{ mt: 1, color: '#27AE60' }}>
                ✅ Attached: {formData.attachments}
              </Typography>
            )}
            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#6C757D' }}>
              Upload specifications, drawings, or other relevant files
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #E9ECEF' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4
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
                px: 4,
                '&:hover': {
                  backgroundColor: '#229954'
                }
              }}
            >
              {item ? '✅ Update Item' : '➕ Add Item'}
            </Button>
          </Box>
      </Box>
    </Box>
  );
};

export default EnhancedScopeItemForm;