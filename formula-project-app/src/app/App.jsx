import React from 'react';
import AppProviders from '../components/providers/AppProviders';
import GlobalComponents from '../components/global/GlobalComponents';
import { useAppInitialization } from '../hooks/useAppInitialization';
import { useAuthenticatedData } from '../hooks/useAuthenticatedData';
import { FormulaLoadingScreen } from '../components/ui/UnifiedLoading';
import ErrorBoundary from '../components/common/ErrorBoundary';
import DataErrorBoundary from '../components/common/DataErrorBoundary';
import AppRouter from '../router/AppRouter';
import './App.css';
import '../styles/globals.css';
import '../styles/modern-dashboard.css';
import '../styles/clean-ui.css';

/**
 * Main App component - Clean architecture implementation
 * 
 * This component serves as the root of the application and implements
 * the clean architecture pattern with:
 * - Centralized providers
 * - Global components management
 * - Application initialization
 * - Error boundaries
 * - Loading states
 */
// Inner component that uses hooks requiring providers
function AppWithProviders() {
  // Get authenticated data with loading and error states
  const {
    projects,
    tasks,
    teamMembers,
    clients,
    loading,
    error,
    // Pass through all the CRUD operations
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addClient,
    updateClient,
    deleteClient,
    setTasks,
    setError
  } = useAuthenticatedData();

  // Initialize app services (notifications, performance monitoring, etc.)
  useAppInitialization(teamMembers, projects, tasks);

  // Show loading screen during initial data load
  if (loading) {
    return (
      <FormulaLoadingScreen 
        message="Loading Formula Project Management..."
        subtitle="Fetching team members and project data"
      />
    );
  }

  // Show error state if data loading failed
  if (error) {
    return (
      <DataErrorBoundary fallbackMessage="Failed to load application data from server. This might be due to network issues or server unavailability.">
        <div>Critical data loading error</div>
      </DataErrorBoundary>
    );
  }

  // Render the main app once data is loaded and initialized
  return (
    <>
      {/* React Router based navigation with data error handling */}
      <DataErrorBoundary fallbackMessage="Navigation system encountered an error. This might be due to data loading issues.">
        <AppRouter />
      </DataErrorBoundary>
      
      {/* Global components (notifications, performance monitor, etc.) */}
      <GlobalComponents />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary fallbackMessage="Application error occurred">
      <AppProviders>
        <AppWithProviders />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;