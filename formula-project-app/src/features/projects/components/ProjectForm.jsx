import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const projectTypes = [
  { value: 'general-contractor', label: 'General Contractor' },
  { value: 'millwork', label: 'Millwork' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'mep', label: 'MEP' },
  { value: 'management', label: 'Management' }
];

const projectStatuses = [
  { value: 'on-tender', label: 'On Tender' },
  { value: 'awarded', label: 'Awarded' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'not-awarded', label: 'Not Awarded' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
];

function ProjectForm({ onSubmit, onCancel, clients = [], initialProject = null }) {
  const [formData, setFormData] = useState(
    initialProject ? {
      name: initialProject.name || '',
      type: initialProject.type || '',
      startDate: initialProject.startDate ? new Date(initialProject.startDate) : null,
      endDate: initialProject.endDate ? new Date(initialProject.endDate) : null,
      clientId: initialProject.clientId || '',
      status: initialProject.status || 'on-tender',
      description: initialProject.description || ''
    } : {
      name: '',
      type: '',
      startDate: null,
      endDate: null,
      clientId: '',
      status: 'on-tender',
      description: ''
    }
  );
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Project type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.clientId) {
      newErrors.clientId = 'Client selection is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0]
      };
      
      if (initialProject) {
        submitData.id = initialProject.id;
      }
      
      onSubmit(submitData);
      
      // Only clear form if creating new project
      if (!initialProject) {
        setFormData({
          name: '',
          type: '',
          startDate: null,
          endDate: null,
          clientId: '',
          status: 'on-tender',
          description: ''
        });
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {success && (
          <Alert severity="success">
            Project created successfully!
          </Alert>
        )}
        
        <TextField
          label="Project Name"
          value={formData.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          required
        />

        <TextField
          select
          label="Project Type"
          value={formData.type}
          onChange={handleChange('type')}
          error={!!errors.type}
          helperText={errors.type}
          fullWidth
          required
        >
          {projectTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="Start Date"
          value={formData.startDate}
          onChange={handleDateChange('startDate')}
          slotProps={{
            textField: {
              error: !!errors.startDate,
              helperText: errors.startDate,
              fullWidth: true,
              required: true
            }
          }}
        />

        <DatePicker
          label="End Date"
          value={formData.endDate}
          onChange={handleDateChange('endDate')}
          slotProps={{
            textField: {
              error: !!errors.endDate,
              helperText: errors.endDate,
              fullWidth: true,
              required: true
            }
          }}
        />

        <FormControl fullWidth required error={!!errors.clientId}>
          <InputLabel>Client</InputLabel>
          <Select
            value={formData.clientId}
            onChange={handleChange('clientId')}
            label="Client"
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.companyName}
              </MenuItem>
            ))}
          </Select>
          {errors.clientId && (
            <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
              {errors.clientId}
            </Box>
          )}
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Project Status</InputLabel>
          <Select
            value={formData.status}
            onChange={handleChange('status')}
            label="Project Status"
          >
            {projectStatuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Description"
          value={formData.description}
          onChange={handleChange('description')}
          multiline
          rows={3}
          fullWidth
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCancel}
            sx={{ 
              flex: 1,
              borderColor: '#dee2e6',
              color: '#6c757d',
              '&:hover': {
                borderColor: '#adb5bd',
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ 
              flex: 1,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            {initialProject ? 'Update Project' : 'Create Project'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default ProjectForm;