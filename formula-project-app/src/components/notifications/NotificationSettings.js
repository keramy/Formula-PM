import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
  Button
} from '@mui/material';
import { notificationService } from '../../services/notifications/notificationService';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    taskAssignments: true,
    projectAssignments: true,
    dueDateReminders: true,
    overdueAlerts: true,
    taskCompletions: true,
    projectStatusChanges: true,
    browserNotifications: true,
    emailNotifications: false, // For future email integration
    scopeUpdates: true,
    approvalNotifications: true,
    productionAlerts: true
  });

  // Load current settings on component mount
  useEffect(() => {
    setSettings(notificationService.settings);
  }, []);

  const handleSettingChange = (key) => (event) => {
    const newSettings = {
      ...settings,
      [key]: event.target.checked
    };
    setSettings(newSettings);
    
    // Save to notification service
    notificationService.saveSettings(newSettings);
  };

  const handleTestNotification = () => {
    notificationService.createNotification('TEST', {
      title: 'Test Notification',
      message: 'This is a test notification to verify your notification settings are working correctly!',
      priority: 'medium'
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Task Notifications
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.taskAssignments}
              onChange={handleSettingChange('taskAssignments')}
            />
          }
          label="New task assignments"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.taskCompletions}
              onChange={handleSettingChange('taskCompletions')}
            />
          }
          label="Task completions"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.dueDateReminders}
              onChange={handleSettingChange('dueDateReminders')}
            />
          }
          label="Due date reminders"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.overdueAlerts}
              onChange={handleSettingChange('overdueAlerts')}
            />
          }
          label="Overdue task alerts"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Project Notifications
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.projectAssignments}
              onChange={handleSettingChange('projectAssignments')}
            />
          }
          label="Project assignments"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.projectStatusChanges}
              onChange={handleSettingChange('projectStatusChanges')}
            />
          }
          label="Project status changes"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Workflow Notifications
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.scopeUpdates}
              onChange={handleSettingChange('scopeUpdates')}
            />
          }
          label="Scope item updates"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.approvalNotifications}
              onChange={handleSettingChange('approvalNotifications')}
            />
          }
          label="Drawing and specification approvals"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.productionAlerts}
              onChange={handleSettingChange('productionAlerts')}
            />
          }
          label="Production readiness alerts"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Delivery Method
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.browserNotifications}
              onChange={handleSettingChange('browserNotifications')}
            />
          }
          label="Browser notifications"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.emailNotifications}
              onChange={handleSettingChange('emailNotifications')}
            />
          }
          label="Email notifications (Coming Soon)"
          disabled
        />
      </Box>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleTestNotification}
          sx={{ backgroundColor: '#2C3E50' }}
        >
          Test Notifications
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => {
            // Request browser notification permission if not granted
            if ('Notification' in window && Notification.permission === 'default') {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  handleTestNotification();
                }
              });
            } else {
              handleTestNotification();
            }
          }}
        >
          Request Permission
        </Button>
      </Box>
    </Paper>
  );
};

export default NotificationSettings;