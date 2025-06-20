import React from 'react';
import { Snackbar, Alert, Portal, Box } from '@mui/material';
import { useNotification } from '../../context/NotificationContext';
import NotificationContainer from '../ui/NotificationContainer';
import EnhancedNotification from '../ui/EnhancedNotification';
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

      {/* Enhanced notifications container */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: 1
        }}
      >
        {notifications.map((notification, index) => (
          <EnhancedNotification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
            index={index}
          />
        ))}
      </Box>

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