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
  Avatar
} from '@mui/material';
import {
  MdClose as Close,
  MdSave as Save,
  MdPerson as Person,
  MdEmail as Email,
  MdPhone as Phone,
  MdWork as Work,
  MdCalendarToday as Calendar,
  MdBadge as Badge
} from 'react-icons/md';

const TeamMemberFormModal = ({
  open,
  onClose,
  onSubmit,
  teamMember = null,
  loading = false,
  error = null
}) => {
  const isEdit = !!teamMember;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'craftsman',
    position: '',
    department: 'construction',
    status: 'active',
    joinDate: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (teamMember) {
      setFormData({
        firstName: teamMember.firstName || '',
        lastName: teamMember.lastName || '',
        email: teamMember.email || '',
        phone: teamMember.phone || '',
        role: teamMember.role || 'craftsman',
        position: teamMember.position || '',
        department: teamMember.department || 'construction',
        status: teamMember.status || 'active',
        joinDate: teamMember.joinDate ? new Date(teamMember.joinDate).toISOString().split('T')[0] : '',
        emergencyContact: teamMember.emergencyContact || '',
        emergencyPhone: teamMember.emergencyPhone || '',
        notes: teamMember.notes || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'craftsman',
        position: '',
        department: 'construction',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        emergencyContact: '',
        emergencyPhone: '',
        notes: ''
      });
    }
    setFormErrors({});
  }, [teamMember, open]);

  const roles = [
    { value: 'admin', label: 'Administrator', color: '#8B5CF6' },
    { value: 'project_manager', label: 'Project Manager', color: '#EF4444' },
    { value: 'designer', label: 'Designer', color: '#E3AF64' },
    { value: 'coordinator', label: 'Coordinator', color: '#10B981' },
    { value: 'craftsman', label: 'Craftsman', color: '#516AC8' },
    { value: 'foreman', label: 'Foreman', color: '#D97706' }
  ];

  const departments = [
    { value: 'administration', label: 'Administration' },
    { value: 'project_management', label: 'Project Management' },
    { value: 'design', label: 'Design' },
    { value: 'construction', label: 'Construction' },
    { value: 'operations', label: 'Operations' },
    { value: 'procurement', label: 'Procurement' },
    { value: 'quality_control', label: 'Quality Control' },
    { value: 'safety', label: 'Safety' }
  ];

  const memberStatuses = [
    { value: 'active', label: 'Active', color: '#10B981' },
    { value: 'inactive', label: 'Inactive', color: '#9CA3AF' },
    { value: 'on_leave', label: 'On Leave', color: '#E3AF64' },
    { value: 'terminated', label: 'Terminated', color: '#EF4444' }
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.position.trim()) {
      errors.position = 'Position/title is required';
    }
    
    if (!formData.joinDate) {
      errors.joinDate = 'Join date is required';
    }
    
    if (formData.emergencyPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.emergencyPhone.replace(/[\s\-\(\)]/g, ''))) {
      errors.emergencyPhone = 'Please enter a valid emergency phone number';
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
      joinDate: new Date(formData.joinDate).toISOString(),
      phone: formData.phone ? formData.phone.replace(/[\s\-\(\)]/g, '') : '', // Clean phone number
      emergencyPhone: formData.emergencyPhone ? formData.emergencyPhone.replace(/[\s\-\(\)]/g, '') : '', // Clean emergency phone
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      initials: `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()
    };

    if (isEdit) {
      onSubmit(teamMember.id, submitData);
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

  const getSelectedRole = () => {
    return roles.find(r => r.value === formData.role);
  };

  const generateInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    }
    return '';
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
            {isEdit ? 'Edit Team Member' : 'Add New Team Member'}
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
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Personal Information
            </Typography>
          </Grid>

          {/* Avatar Preview */}
          {(formData.firstName || formData.lastName) && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    fontSize: '18px',
                    fontWeight: 600,
                    bgcolor: getSelectedRole()?.color || '#E3AF64'
                  }}
                >
                  {generateInitials()}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F1939' }}>
                    {formData.firstName} {formData.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {getSelectedRole()?.label || 'Team Member'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              placeholder="John"
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
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              placeholder="Smith"
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
              placeholder="john.smith@formulapm.com"
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

          {/* Work Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Work Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={role.label}
                        sx={{
                          backgroundColor: `${role.color}20`,
                          color: role.color,
                          fontSize: '11px'
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Position/Title"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              error={!!formErrors.position}
              helperText={formErrors.position}
              placeholder="Senior Carpenter"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
              >
                {memberStatuses.map((status) => (
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Join Date"
              type="date"
              value={formData.joinDate}
              onChange={(e) => handleInputChange('joinDate', e.target.value)}
              error={!!formErrors.joinDate}
              helperText={formErrors.joinDate}
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

          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F1939', mb: 2 }}>
              Emergency Contact
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact Name"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="Jane Smith"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Phone"
              value={formData.emergencyPhone}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                handleInputChange('emergencyPhone', formatted);
              }}
              error={!!formErrors.emergencyPhone}
              helperText={formErrors.emergencyPhone}
              placeholder="(555) 987-6543"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone size={20} style={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              multiline
              rows={3}
              placeholder="Additional notes about the team member..."
            />
          </Grid>

          {/* Summary Section */}
          {(formData.firstName && formData.lastName) && (
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: '#F9FAFB', 
                borderRadius: 1, 
                border: '1px solid #E5E7EB' 
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0F1939', mb: 1 }}>
                  Team Member Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Full Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formData.firstName} {formData.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Role & Department
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {getSelectedRole()?.label} • {departments.find(d => d.value === formData.department)?.label}
                    </Typography>
                  </Grid>
                  {formData.position && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Position
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formData.position}
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
          {loading ? 'Saving...' : (isEdit ? 'Update Member' : 'Add Member')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamMemberFormModal;