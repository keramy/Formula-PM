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
  Paper,
  Slider,
  FormControlLabel,
  Switch,
  Chip,
  Divider
} from '@mui/material';
import { FaPaperclip as AttachFileIcon } from 'react-icons/fa';

const EnhancedScopeItemForm = ({ item, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    quantity: '',
    unitPrice: '',
    unit: 'pcs',
    category: '',
    notes: '',
    attachments: null,
    progress: 0,
    status: 'pending',
    shopDrawingRequired: false,
    materialSpecRequired: false
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
        attachments: item.attachments || null,
        progress: item.progress || 0,
        status: item.status || 'pending',
        shopDrawingRequired: item.shopDrawingRequired || false,
        materialSpecRequired: item.materialSpecRequired || false
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

  const handleSwitchChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.checked
    });
  };

  const handleSliderChange = (field) => (event, value) => {
    setFormData({
      ...formData,
      [field]: value
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
        {/* 1. Item Code */}
        <TextField
          fullWidth
          label="1. Item Code"
          required
          value={formData.id}
          onChange={handleChange('id')}
          placeholder="Enter item code (e.g., SCOPE001)..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                🏷️
              </InputAdornment>
            ),
            style: { fontFamily: 'monospace' }
          }}
        />

        {/* 2. Description */}
        <TextField
          fullWidth
          label="2. Description"
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

        {/* 3. Category */}
        <FormControl fullWidth>
          <InputLabel>3. Category</InputLabel>
          <Select
            value={formData.category}
            onChange={handleChange('category')}
            label="3. Category"
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

        {/* 4. Quantity */}
        <TextField
          fullWidth
          label="4. Quantity"
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

        {/* 5. Unit */}
        <FormControl fullWidth>
          <InputLabel>5. Unit</InputLabel>
          <Select
            value={formData.unit}
            onChange={handleChange('unit')}
            label="5. Unit"
          >
            {unitOptions.map(unit => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 6. Unit Price */}
        <TextField
          fullWidth
          label="6. Unit Price"
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
        <Paper sx={{ p: 3, backgroundPalette: '#F8F9FA', border: '2px solid #27AE60', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ color: '#27AE60', fontWeight: 700, textAlign: 'center' }}>
            Total Price: ${totalPrice.toLocaleString()}
          </Typography>
        </Paper>

        {/* Progress & Status Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
            7. Progress & Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange('status')}
                  label="Status"
                >
                  <MenuItem value="pending">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Pending" size="small" sx={{ backgroundPalette: '#9E9E9E', color: 'white' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="in-progress">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="In Progress" size="small" sx={{ backgroundPalette: '#FF9800', color: 'white' }} />
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Completed" size="small" sx={{ backgroundPalette: '#4CAF50', color: 'white' }} />
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Progress: {formData.progress}%
                </Typography>
                <Slider
                  value={formData.progress}
                  onChange={handleSliderChange('progress')}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  step={5}
                  min={0}
                  max={100}
                  sx={{
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 20
                    },
                    '& .MuiSlider-track': {
                      height: 8
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Connections Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
            8. Connections & Requirements
          </Typography>
          <Paper sx={{ p: 3, backgroundPalette: '#F8F9FA', borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.shopDrawingRequired}
                      onChange={handleSwitchChange('shopDrawingRequired')}
                      color="warning"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        Shop Drawing Required
                      </Typography>
                      {formData.shopDrawingRequired && (
                        <Chip label="Required" size="small" color="warning" />
                      )}
                    </Box>
                  }
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
                  This item requires shop drawings before production
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.materialSpecRequired}
                      onChange={handleSwitchChange('materialSpecRequired')}
                      color="info"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        Material Specification Required
                      </Typography>
                      {formData.materialSpecRequired && (
                        <Chip label="Required" size="small" color="info" />
                      )}
                    </Box>
                  }
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
                  This item requires material specifications
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* 9. Notes */}
        <TextField
          fullWidth
          label="9. Notes (Optional)"
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

        {/* 9. File Attachments */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
            9. File Attachments (Optional)
          </Typography>
          <Box sx={{ 
            border: '2px dashed #E9ECEF', 
            borderRadius: 2, 
            p: 3,
            textAlign: 'center',
            backgroundPalette: '#F8F9FA'
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
                backgroundPalette: '#27AE60',
                px: 4,
                '&:hover': {
                  backgroundPalette: '#229954'
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