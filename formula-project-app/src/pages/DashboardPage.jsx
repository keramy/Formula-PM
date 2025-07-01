import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CleanPageLayout from '../components/layout/CleanPageLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ModernStatsCards from '../components/charts/ModernStatsCards';
import FinancialAnalytics from '../components/charts/FinancialAnalytics';
import { ModernProjectOverview, LoadingFallback } from '../components/lazy';
import { useData } from '../context/DataContext';

const DashboardPage = () => {
  const { projects, tasks, teamMembers } = useData();
  const navigate = useNavigate();
  
  console.log('🔍 DashboardPage received data:', { 
    projects: projects?.length || 'undefined', 
    tasks: tasks?.length || 'undefined', 
    teamMembers: teamMembers?.length || 'undefined' 
  });

  const handleViewProject = (project) => {
    navigate(`/projects/${project.id}`);
  };
  return (
    <CleanPageLayout
      title="Dashboard"
      subtitle="Overview of your construction and millwork projects performance"
      breadcrumbs={[
        { label: 'Team Space', href: '/workspace' },
        { label: 'Dashboard', href: '/dashboard' }
      ]}
    >
      <Box className="clean-fade-in">
        <ErrorBoundary fallbackMessage="Failed to load dashboard">
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
              onViewProject={handleViewProject}
            />
          </Suspense>
          <FinancialAnalytics 
            projects={projects} 
          />
        </ErrorBoundary>
      </Box>
    </CleanPageLayout>
  );
};

export default React.memo(DashboardPage);