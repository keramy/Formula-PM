import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Typography
} from '@mui/material';
import { useNotification } from '../context';

const ClientForm = ({ onSubmit, initialData, onCancel }) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPersonName: '',
    contactPersonTitle: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    website: '',
    industry: '',
    companySize: '',
    services: [],
    taxId: '',
    notes: '',
    status: 'active',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const industryOptions = [
    'Banking & Finance',
    'Technology',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Education',
    'Government',
    'Hospitality',
    'Energy',
    'Transportation',
    'Insurance',
    'Telecommunications',
    'Media & Entertainment',
    'Other'
  ];

  const companySizeOptions = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  const serviceOptions = [
    'Fit-out Projects',
    'MEP Engineering',
    'Project Management',
    'Design & Planning',
    'Construction',
    'Renovation',
    'Maintenance',
    'Consulting',
    'Interior Design',
    'Procurement'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleServicesChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      services: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = 'Contact person name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Please fill in all required fields correctly', 'error');
      return;
    }

    onSubmit(formData);
    showNotification(
      `Client ${initialData ? 'updated' : 'created'} successfully!`,
      'success'
    );

    if (!initialData) {
      // Reset form for new clients
      setFormData({
        companyName: '',
        contactPersonName: '',
        contactPersonTitle: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        website: '',
        industry: '',
        companySize: '',
        services: [],
        taxId: '',
        notes: '',
        status: 'active'
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Company Information */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2C3E50', fontWeight: 600 }}>
            Company Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Company Name *"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            error={!!errors.companyName}
            helperText={errors.companyName}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.industry}>
            <InputLabel>Industry *</InputLabel>
            <Select
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              label="Industry *"
            >
              {industryOptions.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Company Size</InputLabel>
            <Select
              name="companySize"
              value={formData.companySize}
              onChange={handleInputChange}
              label="Company Size"
            >
              {companySizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            variant="outlined"
            placeholder="https://www.example.com"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Tax ID"
            name="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="potential">Potential</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#2C3E50', fontWeight: 600 }}>
            Contact Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Person Name *"
            name="contactPersonName"
            value={formData.contactPersonName}
            onChange={handleInputChange}
            error={!!errors.contactPersonName}
            helperText={errors.contactPersonName}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Person Title"
            name="contactPersonTitle"
            value={formData.contactPersonTitle}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone *"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            error={!!errors.phone}
            helperText={errors.phone}
            variant="outlined"
          />
        </Grid>

        {/* Address Information */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#2C3E50', fontWeight: 600 }}>
            Address Information
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address *"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={!!errors.address}
            helperText={errors.address}
            variant="outlined"
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City *"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            error={!!errors.city}
            helperText={errors.city}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State/Province"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Country *"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            error={!!errors.country}
            helperText={errors.country}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>

        {/* Services */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Services Required</InputLabel>
            <Select
              multiple
              name="services"
              value={formData.services}
              onChange={handleServicesChange}
              input={<OutlinedInput label="Services Required" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {serviceOptions.map((service) => (
                <MenuItem key={service} value={service}>
                  {service}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={3}
            placeholder="Additional notes about the client..."
          />
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outlined"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4
              }}
            >
              {initialData ? 'Update Client' : 'Create Client'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientForm;