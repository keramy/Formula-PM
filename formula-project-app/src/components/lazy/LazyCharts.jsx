import React, { lazy, Suspense } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

// Lazy load heavy chart components with error handling
const GanttChart = lazy(() => 
  import('../charts/GanttChart').catch(() => ({
    default: () => <div>Gantt Chart not available</div>
  }))
);

const AdvancedDashboard = lazy(() => 
  import('../charts/AdvancedDashboard').catch(() => ({
    default: () => <div>Dashboard not available</div>
  }))
);

const EnhancedDashboardWidgets = lazy(() => 
  import('../charts/EnhancedDashboardWidgets').catch(() => ({
    default: () => <div>Dashboard Widgets not available</div>
  }))
);

// Loading skeletons for different chart types
const ChartSkeleton = ({ height = 400, title = "Loading chart..." }) => (
  <Box sx={{ p: 2 }}>
    {title && (
      <Typography variant="h6" sx={{ mb: 2 }}>
        <Skeleton width="40%" />
      </Typography>
    )}
    <Skeleton 
      variant="rectangular" 
      height={height} 
      sx={{ borderRadius: 1 }}
    />
  </Box>
);

const GanttSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
      <Skeleton variant="rectangular" width={100} height={36} />
      <Skeleton variant="rectangular" width={100} height={36} />
      <Skeleton variant="rectangular" width={100} height={36} />
    </Box>
    <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 1 }} />
  </Box>
);

const DashboardSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mb: 3 }}>
      {[1, 2, 3, 4].map((i) => (
        <Box key={i} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
          <Skeleton height={200} />
        </Box>
      ))}
    </Box>
  </Box>
);

// Lazy component wrappers with enhanced Suspense
export const LazyGanttChart = (props) => (
  <Suspense fallback={<GanttSkeleton />}>
    <GanttChart {...props} />
  </Suspense>
);

export const LazyAdvancedDashboard = (props) => (
  <Suspense fallback={<DashboardSkeleton />}>
    <AdvancedDashboard {...props} />
  </Suspense>
);

export const LazyEnhancedDashboardWidgets = (props) => (
  <Suspense fallback={<ChartSkeleton height={300} title="Loading dashboard widgets..." />}>
    <EnhancedDashboardWidgets {...props} />
  </Suspense>
);

// Generic lazy chart wrapper for any chart component
export const LazyChart = ({ 
  component, 
  fallback = <ChartSkeleton />, 
  ...props 
}) => (
  <Suspense fallback={fallback}>
    {React.createElement(component, props)}
  </Suspense>
);

export default {
  LazyGanttChart,
  LazyAdvancedDashboard,
  LazyEnhancedDashboardWidgets,
  LazyChart
};