import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ModernStatsCards from '../components/charts/ModernStatsCards';
import FinancialAnalytics from '../components/charts/FinancialAnalytics';
import { ModernProjectOverview, LoadingFallback } from '../components/lazy';

const DashboardPage = ({ projects, tasks, teamMembers }) => {
  return (
    <Box sx={{ p: 3 }}>
      <ErrorBoundary fallbackMessage="Failed to load dashboard">
        <div className="clean-fade-in">
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
        </div>
      </ErrorBoundary>
    </Box>
  );
};

export default React.memo(DashboardPage);