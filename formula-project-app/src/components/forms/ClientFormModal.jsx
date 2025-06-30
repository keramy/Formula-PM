import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  MdClose as Close,
  MdSave as Save,
  MdBusiness as Business,
  MdPerson as Person,
  MdEmail as Email,
  MdPhone as Phone,
  MdLocationOn as Location,
  MdLanguage as Website
} from 'react-icons/md';

const ClientFormModal = ({
  open,
  onClose,
  onSubmit,
  client = null,
  loading = false,
  error = null
}) => {
  const isEdit = !!client;
  
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    website: '',
    type: 'commercial',
    status: 'active',
    industry: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        companyName: client.companyName || '',
        contactPerson: client.contactPerson || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zipCode: client.zipCode || '',
        country: client.country || 'United States',
        website: client.website || '',
        type: client.type || 'commercial',
        status: client.status || 'active',
        industry: client.industry || '',
        notes: client.notes || ''
      });
    } else {
      setFormData({
        name: '',
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        website: '',
        type: 'commercial',
        status: 'active',
        industry: '',
        notes: ''
      });
    }
    setFormErrors({});
  }, [client, open]);

  const clientTypes = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'residential', label: 'Residential' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'retail', label: 'Retail' },
    { value: 'educational', label: 'Educational' },
    { value: 'government', label: 'Government' },
    { value: 'non_profit', label: 'Non-Profit' }
  ];

  const clientStatuses = [
    { value: 'active', label: 'Active', color: '#10B981' },
    { value: 'potential', label: 'Potential', color: '#E3AF64' },
    { value: 'inactive', label: 'Inactive', color: '#9CA3AF' },
    { value: 'archived', label: 'Archived', color: '#6B7280' }
  ];

  const industries = [
    'Real Estate Development',
    'Healthcare',
    'Hospitality',
    'Retail',
    'Manufacturing',
    'Technology',
    'Education',
    'Government',
    'Non-Profit',
    'Financial Services',
    'Energy',
    'Transportation',
    'Entertainment',
    'Other'
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.companyName.trim() && !formData.name.trim()) {
      errors.companyName = 'Company name or client name is required';
    }
    
    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.website && !/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/.test(formData.website)) {
      errors.website = 'Please enter a valid website URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Clean up the data
    const submitData = {
      ...formData,
      website: formData.website && !formData.website.startsWith('http') 
        ? `https://${formData.website}` 
        : formData.website,
      phone: formData.phone.replace(/[\s\-\(\)]/g, ''), // Clean phone number
      // Use companyName as name if name is empty
      name: formData.name.trim() || formData.companyName.trim()
    };

    if (isEdit) {
      onSubmit(client.id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    
    return value;
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F1939' }}>
            {isEdit ? 'Edit Client' : 'Add New Client'}
          </Typography>
          <Button
            onClick={handleClose}
            sx={{ minWidth: 'auto', p: 1, color: '#6B7280' }}
          >
            <Close size={20} />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Company Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Company Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              error={!!formErrors.companyName}
              helperText={formErrors.companyName}
              placeholder="ABC Construction Corp"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Client Name (if different)"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Alternative name or DBA"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                label="Industry"
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                label="Type"
              >
                {clientTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Contact Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Person"
              value={formData.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              error={!!formErrors.contactPerson}
              helperText={formErrors.contactPerson}
              placeholder="John Smith"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              placeholder="contact@company.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                handleInputChange('phone', formatted);
              }}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              placeholder="(555) 123-4567"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              error={!!formErrors.website}
              helperText={formErrors.website}
              placeholder="www.company.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Website size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Address Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Main Street"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Location size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="New York"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State/Province"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="NY"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ZIP/Postal Code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              placeholder="10001"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="United States"
            />
          </Grid>

          {/* Status and Notes */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
              >
                {clientStatuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={status.label}
                        sx={{
                          backgroundColor: `${status.color}20`,
                          color: status.color,
                          fontSize: '11px'
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              multiline
              rows={3}
              placeholder="Additional notes about the client..."
            />
          </Grid>

          {/* Summary Section */}
          {(formData.companyName || formData.contactPerson) && (
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: '#F9FAFB', 
                borderRadius: 1, 
                border: '1px solid #E5E7EB' 
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0F1939', mb: 1 }}>
                  Client Summary
                </Typography>
                <Grid container spacing={2}>
                  {formData.companyName && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Company
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formData.companyName}
                      </Typography>
                    </Grid>
                  )}
                  {formData.contactPerson && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Contact Person
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formData.contactPerson}
                      </Typography>
                    </Grid>
                  )}
                  {formData.industry && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Industry
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formData.industry}
                      </Typography>
                    </Grid>
                  )}
                  {formData.email && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Email
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formData.email}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#F9FAFB' }}>
        <Button
          onClick={handleClose}
          sx={{ 
            color: '#6B7280',
            '&:hover': { bgcolor: '#F3F4F6' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={16} />
            ) : (
              <Save size={16} />
            )
          }
          sx={{
            bgcolor: '#E3AF64',
            '&:hover': { bgcolor: '#D97706' },
            '&:disabled': { bgcolor: '#9CA3AF' }
          }}
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Client' : 'Add Client')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientFormModal;