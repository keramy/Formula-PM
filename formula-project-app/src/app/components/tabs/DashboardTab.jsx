import React, { Suspense } from 'react';
import ErrorBoundary from '../../../components/common/ErrorBoundary';
import ModernStatsCards from '../../../components/charts/ModernStatsCards';
import { ModernProjectOverview, LoadingFallback } from '../../../components/lazy';

/**
 * Dashboard Tab Component
 * Displays statistics and project overview
 */
const DashboardTab = ({ projects, tasks, teamMembers, clients, onViewProject }) => {
  console.log('📈 Rendering dashboard with data:', { 
    projects: projects.length, 
    tasks: tasks.length, 
    teamMembers: teamMembers.length 
  });

  return (
    <ErrorBoundary fallbackMessage="Failed to load dashboard">
      <>
        <ModernStatsCards 
          projects={projects} 
          tasks={tasks} 
          teamMembers={teamMembers} 
        />
        <Suspense fallback={<LoadingFallback message="Loading project overview..." />}>
          <ModernProjectOverview 
            projects={projects} 
            tasks={tasks} 
            teamMembers={teamMembers} 
            clients={clients} 
            onViewProject={onViewProject} 
          />
        </Suspense>
      </>
    </ErrorBoundary>
  );
};

export default React.memo(DashboardTab);