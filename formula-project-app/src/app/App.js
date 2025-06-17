import React from 'react';
import AppProviders from '../components/providers/AppProviders';
import GlobalComponents from '../components/global/GlobalComponents';
import { useAppInitialization } from '../hooks/useAppInitialization';
import { useAuthenticatedData } from '../hooks/useAuthenticatedData';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { AppContent } from './AppContent';
import './App.css';
import '../styles/globals.css';
import '../styles/modern-dashboard.css';

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
function App() {
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
      <LoadingScreen 
        message="Loading Formula Project Management..."
        subtitle="Fetching team members and project data"
      />
    );
  }

  // Show error state if data loading failed
  if (error) {
    return (
      <ErrorBoundary error={error}>
        <div>Failed to load application data</div>
      </ErrorBoundary>
    );
  }

  // Render the main app once data is loaded and initialized
  return (
    <ErrorBoundary fallbackMessage="Application error occurred">
      <AppProviders>
        {/* Main application content with all business logic */}
        <AppContent
          // Data props
          projects={projects}
          tasks={tasks}
          teamMembers={teamMembers}
          clients={clients}
          // State props
          loading={loading}
          error={error}
          // CRUD operations
          addProject={addProject}
          updateProject={updateProject}
          deleteProject={deleteProject}
          addTask={addTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          addTeamMember={addTeamMember}
          updateTeamMember={updateTeamMember}
          deleteTeamMember={deleteTeamMember}
          addClient={addClient}
          updateClient={updateClient}
          deleteClient={deleteClient}
          setTasks={setTasks}
          setError={setError}
        />
        
        {/* Global components (notifications, performance monitor, etc.) */}
        <GlobalComponents />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;