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
  InputAdornment,
  Slider
} from '@mui/material';
import {
  MdClose as Close,
  MdSave as Save,
  MdAttachMoney as Money,
  MdCalendarToday as Calendar,
  MdLocationOn as Location
} from 'react-icons/md';

const ProjectFormModal = ({
  open,
  onClose,
  onSubmit,
  project = null,
  clients = [],
  teamMembers = [],
  loading = false,
  error = null
}) => {
  const isEdit = !!project;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'commercial',
    status: 'planning',
    priority: 'medium',
    budget: '',
    startDate: '',
    endDate: '',
    location: '',
    clientId: '',
    projectManagerId: '',
    progress: 0
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        type: project.type || 'commercial',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        budget: project.budget?.toString() || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        location: project.location || '',
        clientId: project.clientId || project.client?.id || '',
        projectManagerId: project.projectManagerId || project.projectManager?.id || '',
        progress: project.progress || 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'commercial',
        status: 'planning',
        priority: 'medium',
        budget: '',
        startDate: '',
        endDate: '',
        location: '',
        clientId: '',
        projectManagerId: '',
        progress: 0
      });
    }
    setFormErrors({});
  }, [project, open]);

  const projectTypes = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'residential', label: 'Residential' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'retail', label: 'Retail' },
    { value: 'educational', label: 'Educational' },
    { value: 'mixed_use', label: 'Mixed Use' }
  ];

  const projectStatuses = [
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'on_tender', label: 'On Tender' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#E3AF64' },
    { value: 'high', label: 'High', color: '#EF4444' },
    { value: 'urgent', label: 'Urgent', color: '#8B5CF6' }
  ];

  const projectManagers = teamMembers.filter(member => 
    member.role === 'project_manager' || 
    member.role === 'admin' || 
    member.department === 'Project Management'
  );

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    }
    
    if (!formData.clientId) {
      errors.clientId = 'Client selection is required';
    }
    
    if (!formData.projectManagerId) {
      errors.projectManagerId = 'Project manager selection is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (!formData.budget || isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) <= 0) {
      errors.budget = 'Budget must be a positive number';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Project location is required';
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

    const submitData = {
      ...formData,
      budget: parseFloat(formData.budget),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    };

    if (isEdit) {
      onSubmit(project.id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  const getSelectedClient = () => {
    return clients.find(c => c.id === formData.clientId);
  };

  const getSelectedProjectManager = () => {
    return projectManagers.find(pm => pm.id === formData.projectManagerId);
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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
            {isEdit ? 'Edit Project' : 'Create New Project'}
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
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Project Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
              placeholder="Enter project name"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth error={!!formErrors.type}>
              <InputLabel>Project Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                label="Project Type"
              >
                {projectTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Project Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!formErrors.description}
              helperText={formErrors.description}
              multiline
              rows={3}
              placeholder="Describe the project scope and objectives"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              error={!!formErrors.location}
              helperText={formErrors.location}
              placeholder="Project address or location"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Location size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Assignment */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Assignment
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.clientId}>
              <InputLabel>Client</InputLabel>
              <Select
                value={formData.clientId}
                onChange={(e) => handleInputChange('clientId', e.target.value)}
                label="Client"
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {client.companyName || client.name}
                      </Typography>
                      {client.contactPerson && (
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                          {client.contactPerson}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {formErrors.clientId && (
                <Typography variant="caption" sx={{ color: '#EF4444', mt: 0.5, ml: 1.5 }}>
                  {formErrors.clientId}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.projectManagerId}>
              <InputLabel>Project Manager</InputLabel>
              <Select
                value={formData.projectManagerId}
                onChange={(e) => handleInputChange('projectManagerId', e.target.value)}
                label="Project Manager"
              >
                {projectManagers.map((pm) => (
                  <MenuItem key={pm.id} value={pm.id}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {pm.firstName} {pm.lastName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        {pm.position || pm.role}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {formErrors.projectManagerId && (
                <Typography variant="caption" sx={{ color: '#EF4444', mt: 0.5, ml: 1.5 }}>
                  {formErrors.projectManagerId}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Project Details */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Project Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
              >
                {projectStatuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                label="Priority"
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={priority.label}
                        sx={{
                          backgroundColor: `${priority.color}20`,
                          color: priority.color,
                          fontSize: '11px'
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Budget"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              error={!!formErrors.budget}
              helperText={formErrors.budget || (formData.budget && formatCurrency(parseFloat(formData.budget)))}
              placeholder="0"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Money size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              error={!!formErrors.startDate}
              helperText={formErrors.startDate}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Calendar size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              error={!!formErrors.endDate}
              helperText={formErrors.endDate}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Calendar size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {isEdit && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                Progress: {formData.progress}%
              </Typography>
              <Slider
                value={formData.progress}
                onChange={(e, value) => handleInputChange('progress', value)}
                step={5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' }
                ]}
                min={0}
                max={100}
                sx={{
                  '& .MuiSlider-thumb': {
                    color: formData.progress >= 75 ? '#10B981' : formData.progress >= 50 ? '#E3AF64' : '#516AC8'
                  },
                  '& .MuiSlider-track': {
                    color: formData.progress >= 75 ? '#10B981' : formData.progress >= 50 ? '#E3AF64' : '#516AC8'
                  }
                }}
              />
            </Grid>
          )}

          {/* Summary Section */}
          {(formData.clientId || formData.projectManagerId) && (
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: '#F9FAFB', 
                borderRadius: 1, 
                border: '1px solid #E5E7EB' 
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0F1939', mb: 1 }}>
                  Project Summary
                </Typography>
                <Grid container spacing={2}>
                  {getSelectedClient() && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Client
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getSelectedClient().companyName || getSelectedClient().name}
                      </Typography>
                    </Grid>
                  )}
                  {getSelectedProjectManager() && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Project Manager
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getSelectedProjectManager().firstName} {getSelectedProjectManager().lastName}
                      </Typography>
                    </Grid>
                  )}
                  {formData.budget && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Budget
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(parseFloat(formData.budget))}
                      </Typography>
                    </Grid>
                  )}
                  {formData.startDate && formData.endDate && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Duration
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days
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
          {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectFormModal;