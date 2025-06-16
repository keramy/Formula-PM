import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { NotificationProvider, NavigationProvider } from '../../context';
import { AuthProvider } from '../../context/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';
import queryClient from '../../services/queryClient';
import { formulaTheme } from '../../theme';

/**
 * Centralized provider wrapper for Formula PM application
 * Manages all context providers and global configurations
 */
const AppProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <NavigationProvider>
            <ThemeProvider theme={formulaTheme}>
              <CssBaseline />
              <ProtectedRoute>
                {children}
              </ProtectedRoute>
            </ThemeProvider>
          </NavigationProvider>
        </NotificationProvider>
      </AuthProvider>
      
      {/* React Query DevTools - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default AppProviders;