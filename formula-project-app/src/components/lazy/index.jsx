import { lazy } from 'react';

/**
 * Centralized lazy loading for Formula PM components
 * This file defines all lazy-loaded components to improve initial bundle size
 */

// Dashboard components
export const ModernProjectOverview = lazy(() => 
  import('../../features/dashboard/components/ModernProjectOverview')
);

// Project components
export const ProjectForm = lazy(() => 
  import('../../features/projects/components/ProjectForm')
);

export const ProjectsList = lazy(() => 
  import('../../features/projects/components/ProjectsList')
);

export const ProjectsTableView = lazy(() => 
  import('../../features/projects/components/ProjectsTableView')
);

export const ProjectsFilters = lazy(() => 
  import('../../features/projects/components/ProjectsFilters')
);

export const MyProjectsList = lazy(() => 
  import('../../features/projects/components/MyProjectsList')
);

export const ProjectScope = lazy(() => 
  import('../../features/projects/components/ProjectScope')
);

export const ProjectFormPage = lazy(() => 
  import('../../features/projects/components/ProjectFormPage')
);

export const ProjectPage = lazy(() => 
  import('../../features/projects/components/ProjectPage')
);

// Task components
export const TaskForm = lazy(() => 
  import('../../features/tasks/components/TaskForm')
);

export const TaskFormPage = lazy(() => 
  import('../../features/tasks/components/TaskFormPage')
);

export const TasksView = lazy(() => 
  import('../../features/tasks/components/TasksView')
);

// Team components
export const TeamMemberForm = lazy(() => 
  import('../../features/team/components/TeamMemberForm')
);

export const TeamMembersList = lazy(() => 
  import('../../features/team/components/TeamMembersList')
);

export const TeamMemberFormPage = lazy(() => 
  import('../../features/team/components/TeamMemberFormPage')
);

export const TeamMemberDetail = lazy(() => 
  import('../../features/team/components/TeamMemberDetail')
);

// Client components
export const ClientForm = lazy(() => 
  import('../../features/clients/components/ClientForm')
);

export const ClientsList = lazy(() => 
  import('../../features/clients/components/ClientsList')
);

// Chart components (heavy - should be lazy loaded)
export const GanttChart = lazy(() => 
  import('../charts/GanttChart')
);

export const AdvancedDashboard = lazy(() => 
  import('../charts/AdvancedDashboard')
);

export const EnhancedDashboardWidgets = lazy(() => 
  import('../charts/EnhancedDashboardWidgets')
);

// Heavy library components
export const PDFViewer = lazy(() => 
  import('../../features/shop-drawings/components/PDFViewer')
);

// View components
export const BoardView = lazy(() => 
  import('../views/BoardView')
);

export const GlobalSearchResults = lazy(() => 
  import('../ui/GlobalSearchResults')
);

// Feature-specific components
export const ShopDrawingsList = lazy(() => 
  import('../../features/shop-drawings/components/ShopDrawingsList')
);

export const MaterialSpecificationsList = lazy(() => 
  import('../../features/specifications/components/MaterialSpecificationsList')
);

// Feed components
export const FeedTab = lazy(() => 
  import('../../features/feed/components/FeedTab')
);

// Admin components
export const PerformanceDashboard = lazy(() => 
  import('../admin/PerformanceDashboard')
);

// Dialog components
export const DialogContainer = lazy(() => 
  import('../dialogs/DialogContainer')
);

// Import unified loading components
import { LoadingFallback, FormSkeleton } from '../ui/UnifiedLoading';

// Import enhanced lazy components (temporarily commented out for debugging)
// export {
//   LazyGanttChart,
//   LazyAdvancedDashboard,
//   LazyEnhancedDashboardWidgets,
//   LazyChart
// } from './LazyCharts';

// export {
//   LazyPDFViewer,
//   LazyExportComponent,
//   useFileLibraries,
//   loadJSPDF,
//   loadHtml2Canvas,
//   loadXLSX
// } from './LazyFileHandlers';

// Re-export for compatibility
export { LoadingFallback, FormSkeleton };

// FormSkeleton now imported from UnifiedLoading

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
  ProjectScope,
  ProjectFormPage,
  ProjectPage,
  TaskForm,
  TaskFormPage,
  TasksView,
  TeamMemberForm,
  TeamMembersList,
  TeamMemberFormPage,
  TeamMemberDetail,
  ClientForm,
  ClientsList,
  GanttChart,
  AdvancedDashboard,
  EnhancedDashboardWidgets,
  PDFViewer,
  BoardView,
  GlobalSearchResults,
  ShopDrawingsList,
  MaterialSpecificationsList,
  PerformanceDashboard,
  DialogContainer,
  LoadingFallback,
  FormSkeleton,
  ListSkeleton,
  ProjectCardSkeleton,
  TaskRowSkeleton,
  TeamMemberSkeleton
};