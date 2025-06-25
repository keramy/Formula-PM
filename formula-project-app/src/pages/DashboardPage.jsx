import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import CleanPageLayout from '../components/layout/CleanPageLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ModernStatsCards from '../components/charts/ModernStatsCards';
import FinancialAnalytics from '../components/charts/FinancialAnalytics';
import { ModernProjectOverview, LoadingFallback } from '../components/lazy';

const DashboardPage = ({ projects, tasks, teamMembers }) => {
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
          <FinancialAnalytics 
            projects={projects} 
          />
          <Suspense fallback={<LoadingFallback message="Loading project overview..." />}>
            <ModernProjectOverview 
              projects={projects} 
              tasks={tasks} 
              teamMembers={teamMembers} 
            />
          </Suspense>
        </ErrorBoundary>
      </Box>
    </CleanPageLayout>
  );
};

export default React.memo(DashboardPage);