import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  Avatar
} from '@mui/material';
// Removed @mui/x-date-pickers dependencies - using standard HTML date inputs
import FileUpload from '../../../components/common/FileUpload';
import SmartTextEditor from '../../../components/editors/SmartTextEditor';

const priorityLevels = [
  { value: 'low', label: 'Low', color: '#27ae60' },
  { value: 'medium', label: 'Medium', color: '#f39c12' },
  { value: 'high', label: 'High', color: '#e67e22' },
  { value: 'urgent', label: 'Urgent', color: '#e74c3c' }
];

function TaskForm({ projects, teamMembers = [], onSubmit, onCancel, initialTask = null }) {
  const [formData, setFormData] = useState(
    initialTask ? {
      projectId: initialTask.projectId || '',
      name: initialTask.name || '',
      assignedTo: initialTask.assignedTo || '',
      priority: initialTask.priority || 'medium',
      dueDate: initialTask.dueDate ? (initialTask.dueDate instanceof Date ? initialTask.dueDate.toISOString().split('T')[0] : initialTask.dueDate) : '',
      description: initialTask.description || ''
    } : {
      projectId: '',
      name: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      description: ''
    }
  );
  const [taskFiles, setTaskFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData({
      projectId: '',
      name: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      description: ''
    });
    setTaskFiles([]);
    setErrors({});
    setSuccess(false);
  }, []);

  // Handle cancel action
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      // If no onCancel prop, just reset the form
      resetForm();
    }
  }, [onCancel, resetForm]);

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

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      dueDate: e.target.value
    });
    if (errors.dueDate) {
      setErrors({
        ...errors,
        dueDate: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project';
    }

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please select a team member';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    try {
      if (validateForm()) {
        const submitData = {
          ...formData,
          projectId: parseInt(formData.projectId),
          assignedTo: parseInt(formData.assignedTo),
          dueDate: formData.dueDate instanceof Date ? formData.dueDate.toISOString().split('T')[0] : formData.dueDate,
          files: taskFiles
        };
        
        if (initialTask) {
          submitData.id = initialTask.id;
        }
        
        // Validate data integrity before submission
        if (isNaN(submitData.projectId) || isNaN(submitData.assignedTo)) {
          setErrors({ general: 'Invalid project or team member selection' });
          return;
        }
        
        onSubmit(submitData);
        
        // Only clear form if creating new task
        if (!initialTask) {
          resetForm();
        }
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  return (
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {success && (
          <Alert severity="success">
            Task {initialTask ? 'updated' : 'added'} successfully!
          </Alert>
        )}
        
        {errors.general && (
          <Alert severity="error">
            {errors.general}
          </Alert>
        )}
        
        <TextField
          select
          label="Select Project"
          value={formData.projectId}
          onChange={handleChange('projectId')}
          error={!!errors.projectId}
          helperText={errors.projectId || (projects.length === 0 ? 'Create a project first' : '')}
          fullWidth
          required
          disabled={projects.length === 0}
          className="clean-input"
        >
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name} ({project.type})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Task Name"
          value={formData.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          required
          className="clean-input"
        />

        <TextField
          select
          label="Assigned To"
          value={formData.assignedTo || ''}
          onChange={handleChange('assignedTo')}
          error={!!errors.assignedTo}
          helperText={errors.assignedTo || (teamMembers.length === 0 ? 'Add team members first' : '')}
          fullWidth
          required
          disabled={teamMembers.length === 0}
          className="clean-input"
        >
          {teamMembers.filter(member => member.status === 'active').map((member) => (
            <MenuItem key={member.id} value={member.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: member.roleColor }}>
                  {member.initials}
                </Avatar>
                {member.fullName} - {member.role}
              </Box>
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Priority"
          value={formData.priority}
          onChange={handleChange('priority')}
          fullWidth
          required
          className="clean-input"
        >
          {priorityLevels.map((priority) => (
            <MenuItem 
              key={priority.value} 
              value={priority.value}
              sx={{ 
                borderLeft: `4px solid ${priority.color}`,
                marginBottom: 0.5
              }}
            >
              {priority.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={handleDateChange}
          error={!!errors.dueDate}
          helperText={errors.dueDate}
          fullWidth
          required
          className="clean-input"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: new Date().toISOString().split('T')[0] }}
        />

        <SmartTextEditor
          label="Task Description"
          value={formData.description}
          onChange={handleChange('description')}
          projectId={formData.projectId}
          multiline={true}
          rows={3}
          fullWidth={true}
          placeholder="Optional task details... Use @ to mention scope items, drawings, reports, etc."
          helperText="Tip: Type @ to mention scope items, shop drawings, projects, reports, team members, or specifications"
        />

        <FileUpload
          taskId={Date.now()}
          projectId={formData.projectId}
          files={taskFiles}
          onFilesChange={setTaskFiles}
          maxFiles={5}
          maxSize={10}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            size="large"
            onClick={handleCancel}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ flex: 1 }}
            disabled={projects.length === 0}
          >
            {initialTask ? 'Save Changes' : 'Add Task'}
          </Button>
        </Box>
      </Box>
  );
}

export default TaskForm;