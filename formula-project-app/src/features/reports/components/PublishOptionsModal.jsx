import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  FaShare,
  FaTimes,
  FaUsers,
  FaEnvelope,
  FaCalendarAlt,
  FaTrash,
  FaPlus,
  FaCheck,
  FaLock,
  FaGlobe
} from 'react-icons/fa';

const PublishOptionsModal = ({ open, onClose, onPublish, reportTitle, currentStatus }) => {
  const [options, setOptions] = useState({
    // Visibility Settings
    visibility: 'internal', // 'internal', 'client', 'public'
    accessLevel: 'view', // 'view', 'comment', 'edit'
    requireLogin: true,
    
    // Notification Settings
    sendNotifications: true,
    notifyByEmail: true,
    includeMessage: false,
    customMessage: '',
    
    // Recipients
    recipients: [
      { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Project Manager', type: 'internal' },
      { id: 2, name: 'ABC Construction', email: 'contact@abc.com', role: 'Client', type: 'client' }
    ],
    
    // Expiry Settings
    hasExpiry: false,
    expiryDate: '',
    
    // Comments
    allowComments: true,
    moderateComments: true
  });

  const handleChange = (field, value) => {
    setOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRecipient = () => {
    const newRecipient = {
      id: Date.now(),
      name: '',
      email: '',
      role: '',
      type: 'internal'
    };
    setOptions(prev => ({
      ...prev,
      recipients: [...prev.recipients, newRecipient]
    }));
  };

  const updateRecipient = (id, field, value) => {
    setOptions(prev => ({
      ...prev,
      recipients: prev.recipients.map(r => 
        r.id === id ? { ...r, [field]: value } : r
      )
    }));
  };

  const removeRecipient = (id) => {
    setOptions(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r.id !== id)
    }));
  };

  const handlePublish = () => {
    onPublish(options);
    onClose();
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'internal': return <FaLock color="#f57c00" />;
      case 'client': return <FaUsers color="#1976d2" />;
      case 'public': return <FaGlobe color="#4caf50" />;
      default: return <FaLock />;
    }
  };

  const getVisibilityDescription = (visibility) => {
    switch (visibility) {
      case 'internal': return 'Only team members and specified users can access';
      case 'client': return 'Team members and clients can access';
      case 'public': return 'Anyone with the link can access';
      default: return '';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FaShare color="#4caf50" />
            <Typography variant="h6">Publish Report</Typography>
            {currentStatus === 'published' && (
              <Chip label="Already Published" color="success" size="small" />
            )}
          </Box>
          <Button onClick={onClose} color="inherit">
            <FaTimes />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Visibility Settings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getVisibilityIcon(options.visibility)}
                Visibility & Access
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Visibility</InputLabel>
                    <Select
                      value={options.visibility}
                      onChange={(e) => handleChange('visibility', e.target.value)}
                      label="Visibility"
                    >
                      <MenuItem value="internal">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaLock size={14} />
                          Internal Only
                        </Box>
                      </MenuItem>
                      <MenuItem value="client">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaUsers size={14} />
                          Team & Clients
                        </Box>
                      </MenuItem>
                      <MenuItem value="public">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaGlobe size={14} />
                          Public (Anyone with link)
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    {getVisibilityDescription(options.visibility)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Access Level</InputLabel>
                    <Select
                      value={options.accessLevel}
                      onChange={(e) => handleChange('accessLevel', e.target.value)}
                      label="Access Level"
                    >
                      <MenuItem value="view">View Only</MenuItem>
                      <MenuItem value="comment">View & Comment</MenuItem>
                      <MenuItem value="edit">View & Edit</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.requireLogin}
                        onChange={(e) => handleChange('requireLogin', e.target.checked)}
                      />
                    }
                    label="Require login to access"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.allowComments}
                        onChange={(e) => handleChange('allowComments', e.target.checked)}
                      />
                    }
                    label="Allow comments"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaEnvelope color="#1976d2" />
                Notifications
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={options.sendNotifications}
                      onChange={(e) => handleChange('sendNotifications', e.target.checked)}
                    />
                  }
                  label="Send notifications"
                />
                
                {options.sendNotifications && (
                  <>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.notifyByEmail}
                          onChange={(e) => handleChange('notifyByEmail', e.target.checked)}
                        />
                      }
                      label="Send email notifications"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.includeMessage}
                          onChange={(e) => handleChange('includeMessage', e.target.checked)}
                        />
                      }
                      label="Include custom message"
                    />
                    
                    {options.includeMessage && (
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        label="Custom Message"
                        value={options.customMessage}
                        onChange={(e) => handleChange('customMessage', e.target.value)}
                        placeholder="Add a message for recipients..."
                      />
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Recipients */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaUsers color="#4caf50" />
                  Recipients ({options.recipients.length})
                </Typography>
                <Button
                  startIcon={<FaPlus />}
                  onClick={addRecipient}
                  size="small"
                  variant="outlined"
                >
                  Add Recipient
                </Button>
              </Box>
              
              <List dense>
                {options.recipients.map((recipient) => (
                  <ListItem key={recipient.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: recipient.type === 'client' ? '#1976d2' : '#4caf50' }}>
                        {recipient.name.charAt(0) || '?'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={recipient.name || 'New Recipient'}
                      secondary={`${recipient.email} - ${recipient.role}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={recipient.type}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <IconButton
                        edge="end"
                        onClick={() => removeRecipient(recipient.id)}
                        size="small"
                      >
                        <FaTrash />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Expiry Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaCalendarAlt color="#f57c00" />
                Expiry Settings
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.hasExpiry}
                        onChange={(e) => handleChange('hasExpiry', e.target.checked)}
                      />
                    }
                    label="Set expiry date"
                  />
                </Grid>
                
                {options.hasExpiry && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Expiry Date"
                      value={options.expiryDate}
                      onChange={(e) => handleChange('expiryDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0]
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Publish Preview */}
          <Grid item xs={12}>
            <Alert severity="success">
              <Typography variant="body2">
                <strong>Publish Preview:</strong><br />
                Report will be published with {options.visibility} visibility<br />
                {options.sendNotifications && `${options.recipients.length} recipient(s) will be notified`}<br />
                Access level: {options.accessLevel}<br />
                {options.hasExpiry && options.expiryDate && `Expires on: ${new Date(options.expiryDate).toLocaleDateString()}`}
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handlePublish}
          startIcon={<FaCheck />}
        >
          {currentStatus === 'published' ? 'Update Publication' : 'Publish Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PublishOptionsModal;