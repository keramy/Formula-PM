/**
 * React Form Pattern
 * Reusable form component with validation, error handling, and state management
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';

const FormPattern = ({
  initialData = {},
  validationSchema = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Generic field change handler
  const handleChange = useCallback((field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Handle field blur for validation
  const handleBlur = useCallback((field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  }, [formData]);

  // Validate individual field
  const validateField = useCallback((field, value) => {
    const fieldValidation = validationSchema[field];
    if (!fieldValidation) return;

    let error = '';
    
    // Required validation
    if (fieldValidation.required && (!value || value.trim() === '')) {
      error = `${fieldValidation.label || field} is required`;
    }
    
    // Min length validation
    if (!error && fieldValidation.minLength && value && value.length < fieldValidation.minLength) {
      error = `${fieldValidation.label || field} must be at least ${fieldValidation.minLength} characters`;
    }
    
    // Max length validation
    if (!error && fieldValidation.maxLength && value && value.length > fieldValidation.maxLength) {
      error = `${fieldValidation.label || field} must be less than ${fieldValidation.maxLength} characters`;
    }
    
    // Email validation
    if (!error && fieldValidation.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Invalid email format';
      }
    }
    
    // Custom validation
    if (!error && fieldValidation.validate && value) {
      const customError = fieldValidation.validate(value, formData);
      if (customError) error = customError;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  }, [formData, validationSchema]);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationSchema).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));

    return isValid;
  }, [formData, validationSchema, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error.message || 'An error occurred while saving');
    }
  }, [formData, validateForm, onSubmit]);

  // Render form field based on type
  const renderField = (field, config) => {
    const hasError = touched[field] && errors[field];
    
    if (config.type === 'select') {
      return (
        <FormControl fullWidth error={hasError} key={field}>
          <InputLabel>{config.label}</InputLabel>
          <Select
            value={formData[field] || ''}
            onChange={handleChange(field)}
            onBlur={handleBlur(field)}
            label={config.label}
          >
            {config.options?.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {hasError && <FormHelperText>{errors[field]}</FormHelperText>}
        </FormControl>
      );
    }

    return (
      <TextField
        key={field}
        fullWidth
        label={config.label}
        value={formData[field] || ''}
        onChange={handleChange(field)}
        onBlur={handleBlur(field)}
        error={hasError}
        helperText={hasError ? errors[field] : config.helperText}
        type={config.type || 'text'}
        multiline={config.multiline}
        rows={config.rows}
        required={config.required}
        disabled={loading}
      />
    );
  };

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {submitError && (
            <Alert severity="error" onClose={() => setSubmitError('')}>
              {submitError}
            </Alert>
          )}

          {Object.entries(validationSchema).map(([field, config]) => 
            renderField(field, config)
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : submitLabel}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Example usage:
/*
const MyForm = () => {
  const validationSchema = {
    name: {
      label: 'Name',
      required: true,
      minLength: 2,
      maxLength: 100
    },
    email: {
      label: 'Email',
      required: true,
      type: 'email'
    },
    status: {
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    description: {
      label: 'Description',
      multiline: true,
      rows: 4,
      maxLength: 500
    }
  };

  const handleSubmit = async (data) => {
    // Submit logic
    console.log('Submitting:', data);
  };

  return (
    <FormPattern
      initialData={{ name: '', email: '', status: '', description: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      onCancel={() => console.log('Cancelled')}
      submitLabel="Create"
    />
  );
};
*/

export default FormPattern;