import React from 'react';
import { Snackbar, Alert, Portal } from '@mui/material';
import { useNotification } from '../../context/NotificationContext';
import NotificationContainer from '../ui/NotificationContainer';
import { PerformanceMonitorComponent as PerformanceMonitor } from '../../utils/performance';

/**
 * GlobalComponents - Contains all components that need to be rendered at the app level
 * These components are typically portals, notifications, modals, etc.
 */
const GlobalComponents = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {/* Global notification container for browser notifications */}
      <NotificationContainer />

      {/* Snackbars for in-app notifications */}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration || 6000}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          sx={{ mb: notifications.indexOf(notification) * 7 }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}

      {/* Performance monitor in development */}
      {process.env.NODE_ENV === 'development' && (
        <Portal>
          <PerformanceMonitor />
        </Portal>
      )}

      {/* Add any other global components here */}
    </>
  );
};

export default GlobalComponents;