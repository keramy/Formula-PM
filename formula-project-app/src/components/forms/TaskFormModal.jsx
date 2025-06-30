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
  MdCalendarToday as Calendar,
  MdTask as TaskIcon,
  MdPerson as Person
} from 'react-icons/md';

const TaskFormModal = ({
  open,
  onClose,
  onSubmit,
  task = null,
  projects = [],
  teamMembers = [],
  loading = false,
  error = null
}) => {
  const isEdit = !!task;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    projectId: '',
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
    progress: 0,
    tags: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        projectId: task.projectId || '',
        assignedTo: task.assignedTo || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        estimatedHours: task.estimatedHours?.toString() || '',
        progress: task.progress || 0,
        tags: Array.isArray(task.tags) ? task.tags.join(', ') : (task.tags || '')
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        projectId: '',
        assignedTo: '',
        dueDate: '',
        estimatedHours: '',
        progress: 0,
        tags: ''
      });
    }
    setFormErrors({});
  }, [task, open]);

  const taskStatuses = [
    { value: 'pending', label: 'Pending', color: '#516AC8' },
    { value: 'in_progress', label: 'In Progress', color: '#E3AF64' },
    { value: 'review', label: 'Review', color: '#8B5CF6' },
    { value: 'completed', label: 'Completed', color: '#10B981' },
    { value: 'on_hold', label: 'On Hold', color: '#9CA3AF' },
    { value: 'cancelled', label: 'Cancelled', color: '#EF4444' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#E3AF64' },
    { value: 'high', label: 'High', color: '#EF4444' },
    { value: 'urgent', label: 'Urgent', color: '#8B5CF6' }
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Task name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Task description is required';
    }
    
    if (!formData.projectId) {
      errors.projectId = 'Project selection is required';
    }
    
    if (!formData.assignedTo) {
      errors.assignedTo = 'Assignee selection is required';
    }
    
    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      errors.dueDate = 'Due date cannot be in the past';
    }
    
    if (formData.estimatedHours && (isNaN(parseFloat(formData.estimatedHours)) || parseFloat(formData.estimatedHours) <= 0)) {
      errors.estimatedHours = 'Estimated hours must be a positive number';
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
      dueDate: new Date(formData.dueDate).toISOString(),
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    };

    if (isEdit) {
      onSubmit(task.id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  const getSelectedProject = () => {
    return projects.find(p => p.id === formData.projectId);
  };

  const getSelectedAssignee = () => {
    return teamMembers.find(tm => tm.id === formData.assignedTo);
  };

  const getAvailableTeamMembers = () => {
    // Filter team members who are not clients
    return teamMembers.filter(member => member.role !== 'client');
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
            {isEdit ? 'Edit Task' : 'Create New Task'}
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
              Task Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
              placeholder="Enter task name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TaskIcon size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!formErrors.description}
              helperText={formErrors.description}
              multiline
              rows={3}
              placeholder="Describe what needs to be done"
            />
          </Grid>

          {/* Assignment */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Assignment
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.projectId}>
              <InputLabel>Project</InputLabel>
              <Select
                value={formData.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                label="Project"
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {project.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        {project.client?.name || project.client?.companyName || 'Unknown Client'} • {project.type}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {formErrors.projectId && (
                <Typography variant="caption" sx={{ color: '#EF4444', mt: 0.5, ml: 1.5 }}>
                  {formErrors.projectId}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.assignedTo}>
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                label="Assigned To"
              >
                {getAvailableTeamMembers().map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person size={16} style={{ color: '#9CA3AF' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {member.firstName} {member.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                          {member.position || member.role} • {member.department}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {formErrors.assignedTo && (
                <Typography variant="caption" sx={{ color: '#EF4444', mt: 0.5, ml: 1.5 }}>
                  {formErrors.assignedTo}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Task Details */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Task Details
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
                {taskStatuses.map((status) => (
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
              label="Estimated Hours"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
              error={!!formErrors.estimatedHours}
              helperText={formErrors.estimatedHours}
              placeholder="0"
              type="number"
              inputProps={{ min: 0, step: 0.5 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              error={!!formErrors.dueDate}
              helperText={formErrors.dueDate}
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
              label="Tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="ui design, frontend, urgent (comma separated)"
              helperText="Separate multiple tags with commas"
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
          {(formData.projectId || formData.assignedTo) && (
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: '#F9FAFB', 
                borderRadius: 1, 
                border: '1px solid #E5E7EB' 
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0F1939', mb: 1 }}>
                  Task Summary
                </Typography>
                <Grid container spacing={2}>
                  {getSelectedProject() && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Project
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getSelectedProject().name}
                      </Typography>
                    </Grid>
                  )}
                  {getSelectedAssignee() && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Assignee
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getSelectedAssignee().firstName} {getSelectedAssignee().lastName}
                      </Typography>
                    </Grid>
                  )}
                  {formData.estimatedHours && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Estimated Time
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formData.estimatedHours} hours
                      </Typography>
                    </Grid>
                  )}
                  {formData.dueDate && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Due Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {new Date(formData.dueDate).toLocaleDateString()}
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
          {loading ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormModal;