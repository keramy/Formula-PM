import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import ModernDashboardLayout from '../components/layout/ModernDashboardLayout';
import RouteErrorBoundary from '../components/common/RouteErrorBoundary';

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

// Helper component to wrap routes with error boundaries
const ProtectedRouteWithErrorBoundary = ({ children, route }) => (
  <ProtectedRoute>
    <RouteErrorBoundary route={route}>
      <ModernDashboardLayout />
    </RouteErrorBoundary>
  </ProtectedRoute>
);

// Individual page wrapper with error boundary and suspense
const PageWrapper = ({ children, route, fallback = <DashboardSkeleton /> }) => (
  <RouteErrorBoundary route={route}>
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </RouteErrorBoundary>
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

        {/* Protected routes wrapped in dashboard layout with error boundaries */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RouteErrorBoundary route="/">
                <ModernDashboardLayout />
              </RouteErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route
            path="dashboard"
            element={
              <PageWrapper route="/dashboard">
                <DashboardPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="projects"
            element={
              <PageWrapper route="/projects">
                <ProjectsPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="projects/:projectId"
            element={
              <PageWrapper route="/projects/:projectId">
                <ProjectDetail />
              </PageWrapper>
            }
          />
          
          <Route
            path="tasks"
            element={
              <PageWrapper route="/tasks">
                <TasksPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="team"
            element={
              <PageWrapper route="/team">
                <TeamPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="clients"
            element={
              <PageWrapper route="/clients">
                <ClientsPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="updates"
            element={
              <PageWrapper route="/updates">
                <UpdatesPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="inbox"
            element={
              <PageWrapper route="/inbox">
                <InboxPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="my-work"
            element={
              <PageWrapper route="/my-work">
                <MyWorkPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="timeline"
            element={
              <PageWrapper route="/timeline">
                <TimelinePage />
              </PageWrapper>
            }
          />
          
          <Route
            path="shop-drawings"
            element={
              <PageWrapper route="/shop-drawings">
                <ShopDrawingsPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="material-specs"
            element={
              <PageWrapper route="/material-specs">
                <MaterialSpecsPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="reports"
            element={
              <PageWrapper route="/reports">
                <ReportsPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="procurement"
            element={
              <PageWrapper route="/procurement">
                <ProcurementPage />
              </PageWrapper>
            }
          />
          
          <Route
            path="activity"
            element={
              <PageWrapper route="/activity">
                <ActivityPage />
              </PageWrapper>
            }
          />
        </Route>

        {/* 404 route */}
        <Route
          path="*"
          element={
            <RouteErrorBoundary route="*">
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            </RouteErrorBoundary>
          }
        />
        </Routes>
    </Suspense>
  );
};

export default AppRouter;