import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import ModernDashboardLayout from '../components/layout/ModernDashboardLayout';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'));
const TasksPage = lazy(() => import('../pages/TasksPage'));
const TeamPage = lazy(() => import('../pages/TeamPage'));
const ClientsPage = lazy(() => import('../pages/ClientsPage'));
const Login = lazy(() => import('../pages/Login'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Lazy load placeholder pages for missing routes
const UpdatesPage = lazy(() => import('../pages/UpdatesPage'));
const InboxPage = lazy(() => import('../pages/InboxPage'));
const MyWorkPage = lazy(() => import('../pages/MyWorkPage'));
const TimelinePage = lazy(() => import('../pages/TimelinePage'));
const ShopDrawingsPage = lazy(() => import('../pages/ShopDrawingsPage'));
const MaterialSpecsPage = lazy(() => import('../pages/MaterialSpecsPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const ProcurementPage = lazy(() => import('../pages/ProcurementPage'));
const ActivityPage = lazy(() => import('../pages/ActivityPage'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'background.default',
    }}
  >
    <CircularProgress size={60} />
  </Box>
);

// Skeleton loader for dashboard content
const DashboardSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ mb: 3, height: 40, backgroundColor: 'action.hover', borderRadius: 1 }} />
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
      {[1, 2, 3, 4].map((i) => (
        <Box key={i} sx={{ height: 100, backgroundColor: 'action.hover', borderRadius: 1 }} />
      ))}
    </Box>
    <Box sx={{ height: 400, backgroundColor: 'action.hover', borderRadius: 1 }} />
  </Box>
);

/**
 * AppRouter component that handles all application routing
 */
const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes wrapped in dashboard layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ModernDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <DashboardPage />
              </Suspense>
            }
          />
          
          <Route
            path="projects"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <ProjectsPage />
              </Suspense>
            }
          />
          
          <Route
            path="projects/:projectId"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <ProjectDetail />
              </Suspense>
            }
          />
          
          <Route
            path="tasks"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <TasksPage />
              </Suspense>
            }
          />
          
          <Route
            path="team"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <TeamPage />
              </Suspense>
            }
          />
          
          <Route
            path="clients"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <ClientsPage />
              </Suspense>
            }
          />
          
          <Route
            path="updates"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <UpdatesPage />
              </Suspense>
            }
          />
          
          <Route
            path="inbox"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <InboxPage />
              </Suspense>
            }
          />
          
          <Route
            path="my-work"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <MyWorkPage />
              </Suspense>
            }
          />
          
          <Route
            path="timeline"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <TimelinePage />
              </Suspense>
            }
          />
          
          <Route
            path="shop-drawings"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <ShopDrawingsPage />
              </Suspense>
            }
          />
          
          <Route
            path="material-specs"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <MaterialSpecsPage />
              </Suspense>
            }
          />
          
          <Route
            path="reports"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <ReportsPage />
              </Suspense>
            }
          />
          
          <Route
            path="procurement"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <ProcurementPage />
              </Suspense>
            }
          />
          
          <Route
            path="activity"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <ActivityPage />
              </Suspense>
            }
          />
        </Route>

        {/* 404 route */}
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          }
        />
        </Routes>
    </Suspense>
  );
};

export default AppRouter;