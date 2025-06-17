// components/auth/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import FormulaLoginPage from './FormulaLoginPage';
import FormulaLoadingScreen from '../ui/FormulaLoadingScreen';

const ProtectedRoute = ({ 
  children, 
  darkMode = false,
  onToggleDarkMode,
  requireAuth = true,
}) => {
  const { isAuthenticated, loading, login, error, clearError } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <FormulaLoadingScreen
        darkMode={darkMode}
        message="Checking authentication..."
        subtitle="Please wait while we verify your session"
      />
    );
  }

  // If authentication is required and user is not authenticated, show login
  if (requireAuth && !isAuthenticated) {
    return (
      <FormulaLoginPage
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLogin={async (credentials) => {
          clearError(); // Clear any previous errors
          const result = await login(credentials);
          if (!result.success) {
            // Error will be handled by the auth context
            console.error('Login failed:', result.error);
          }
        }}
        onForgotPassword={() => {
          console.log('Forgot password clicked');
          // Implement forgot password logic
        }}
        onSignUp={() => {
          console.log('Sign up clicked');
          // Implement sign up logic
        }}
        loading={loading}
        error={error}
      />
    );
  }

  // User is authenticated or auth is not required, render children
  return children;
};

export default ProtectedRoute;