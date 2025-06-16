import { lazy } from 'react';

/**
 * Centralized lazy loading for Formula PM components
 * This file defines all lazy-loaded components to improve initial bundle size
 */

// Dashboard components
export const ModernProjectOverview = lazy(() => 
  import('../features/dashboard/components/ModernProjectOverview')
);

// Project components
export const ProjectForm = lazy(() => 
  import('../features/projects/components/ProjectForm')
);

export const ProjectsList = lazy(() => 
  import('../features/projects/components/ProjectsList')
);

export const ProjectsTableView = lazy(() => 
  import('../features/projects/components/ProjectsTableView')
);

export const ProjectsFilters = lazy(() => 
  import('../features/projects/components/ProjectsFilters')
);

export const MyProjectsList = lazy(() => 
  import('../features/projects/components/MyProjectsList')
);

export const EnhancedProjectScope = lazy(() => 
  import('../features/projects/components/EnhancedProjectScope')
);

export const ProjectFormPage = lazy(() => 
  import('../features/projects/components/ProjectFormPage')
);

export const ProjectPage = lazy(() => 
  import('../features/projects/components/ProjectPage')
);

// Task components
export const TaskForm = lazy(() => 
  import('../features/tasks/components/TaskForm')
);

export const TaskFormPage = lazy(() => 
  import('../features/tasks/components/TaskFormPage')
);

export const EnhancedTasksView = lazy(() => 
  import('../features/tasks/components/EnhancedTasksView')
);

// Team components
export const TeamMemberForm = lazy(() => 
  import('../features/team/components/TeamMemberForm')
);

export const TeamMembersList = lazy(() => 
  import('../features/team/components/TeamMembersList')
);

export const TeamMemberFormPage = lazy(() => 
  import('../features/team/components/TeamMemberFormPage')
);

export const TeamMemberDetail = lazy(() => 
  import('../features/team/components/TeamMemberDetail')
);

// Client components
export const ClientForm = lazy(() => 
  import('../features/clients/components/ClientForm')
);

export const ClientsList = lazy(() => 
  import('../features/clients/components/ClientsList')
);

// Chart components (heavy - should be lazy loaded)
export const GanttChart = lazy(() => 
  import('../components/charts/GanttChart')
);

// View components
export const BoardView = lazy(() => 
  import('../components/views/BoardView')
);

export const GlobalSearchResults = lazy(() => 
  import('../components/ui/GlobalSearchResults')
);

// Feature-specific components
export const ShopDrawingsList = lazy(() => 
  import('../features/shop-drawings/components/ShopDrawingsList')
);

export const MaterialSpecificationsList = lazy(() => 
  import('../features/specifications/components/MaterialSpecificationsList')
);

// Admin components
export const PerformanceDashboard = lazy(() => 
  import('../components/admin/PerformanceDashboard')
);

// Loading fallback components
export const LoadingFallback = ({ message = "Loading..." }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    flexDirection: 'column'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #2C3E50',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    }} />
    <div style={{ color: '#666', fontSize: '14px' }}>{message}</div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export const FormSkeleton = () => (
  <div style={{ padding: '20px' }}>
    <div style={{ 
      height: '20px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '4px', 
      marginBottom: '16px',
      width: '70%'
    }} />
    <div style={{ 
      height: '40px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '4px', 
      marginBottom: '16px'
    }} />
    <div style={{ 
      height: '20px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '4px', 
      marginBottom: '16px',
      width: '50%'
    }} />
    <div style={{ 
      height: '40px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '4px', 
      marginBottom: '16px'
    }} />
  </div>
);

export const ListSkeleton = ({ count = 3, SkeletonComponent = null }) => {
  const DefaultSkeleton = () => (
    <div style={{ 
      height: '80px', 
      backgroundColor: '#f8f8f8', 
      borderRadius: '8px', 
      marginBottom: '12px',
      border: '1px solid #e0e0e0'
    }} />
  );
  
  const Skeleton = SkeletonComponent || DefaultSkeleton;
  
  return (
    <div style={{ padding: '16px' }}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  );
};

export const ProjectCardSkeleton = () => (
  <div style={{ 
    height: '120px', 
    backgroundColor: '#f8f8f8', 
    borderRadius: '8px', 
    marginBottom: '16px',
    border: '1px solid #e0e0e0',
    padding: '16px'
  }}>
    <div style={{ 
      height: '16px', 
      backgroundColor: '#e0e0e0', 
      borderRadius: '4px', 
      marginBottom: '8px',
      width: '60%'
    }} />
    <div style={{ 
      height: '12px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '4px', 
      marginBottom: '8px',
      width: '40%'
    }} />
    <div style={{ 
      height: '12px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '4px', 
      width: '80%'
    }} />
  </div>
);

export const TaskRowSkeleton = () => (
  <div style={{ 
    height: '60px', 
    backgroundColor: '#f8f8f8', 
    borderRadius: '4px', 
    marginBottom: '8px',
    border: '1px solid #e0e0e0',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }}>
    <div style={{ 
      width: '24px', 
      height: '24px', 
      backgroundColor: '#e0e0e0', 
      borderRadius: '50%'
    }} />
    <div style={{ flex: 1 }}>
      <div style={{ 
        height: '14px', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '4px', 
        marginBottom: '4px',
        width: '70%'
      }} />
      <div style={{ 
        height: '12px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '4px', 
        width: '50%'
      }} />
    </div>
  </div>
);

export const TeamMemberSkeleton = () => (
  <div style={{ 
    height: '100px', 
    backgroundColor: '#f8f8f8', 
    borderRadius: '8px', 
    marginBottom: '16px',
    border: '1px solid #e0e0e0',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  }}>
    <div style={{ 
      width: '48px', 
      height: '48px', 
      backgroundColor: '#e0e0e0', 
      borderRadius: '50%'
    }} />
    <div style={{ flex: 1 }}>
      <div style={{ 
        height: '16px', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '4px', 
        marginBottom: '8px',
        width: '60%'
      }} />
      <div style={{ 
        height: '12px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '4px', 
        marginBottom: '4px',
        width: '40%'
      }} />
      <div style={{ 
        height: '12px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '4px', 
        width: '50%'
      }} />
    </div>
  </div>
);

export default {
  ModernProjectOverview,
  ProjectForm,
  ProjectsList,
  ProjectsTableView,
  ProjectsFilters,
  MyProjectsList,
  EnhancedProjectScope,
  ProjectFormPage,
  ProjectPage,
  TaskForm,
  TaskFormPage,
  EnhancedTasksView,
  TeamMemberForm,
  TeamMembersList,
  TeamMemberFormPage,
  TeamMemberDetail,
  ClientForm,
  ClientsList,
  GanttChart,
  BoardView,
  GlobalSearchResults,
  ShopDrawingsList,
  MaterialSpecificationsList,
  PerformanceDashboard,
  LoadingFallback,
  FormSkeleton,
  ListSkeleton,
  ProjectCardSkeleton,
  TaskRowSkeleton,
  TeamMemberSkeleton
};