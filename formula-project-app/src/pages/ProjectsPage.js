import React, { Suspense, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import EnhancedHeader from '../components/layout/EnhancedHeader';
import EnhancedTabSystem from '../components/layout/EnhancedTabSystem';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { 
  ProjectsTableView,
  ProjectsFilters,
  ProjectsList,
  BoardView,
  GanttChart,
  LoadingFallback,
  ListSkeleton,
  ProjectCardSkeleton
} from '../components/LazyComponents';

const ProjectsPage = ({ 
  projects,
  tasks,
  teamMembers,
  clients,
  filteredProjects,
  projectsViewMode,
  projectsSearchTerm,
  setProjectsSearchTerm,
  showProjectsFilters,
  projectsFilters,
  activeFilters,
  onViewModeChange,
  onToggleFilters,
  onExport,
  onFiltersChange,
  onClearFilters,
  onEditProject,
  onDeleteProject,
  onViewProject,
  onManageScope,
  onUpdateTask,
  onAddProject
}) => {
  const handleAddProject = useCallback(() => {
    onAddProject();
  }, [onAddProject]);

  return (
    <Box>
      <EnhancedHeader
        title="All Projects"
        breadcrumbs={[
          { label: 'Projects', href: '/projects' }
        ]}
        searchValue={projectsSearchTerm}
        onSearchChange={setProjectsSearchTerm}
        onAdd={handleAddProject}
        isStarred={false}
        onToggleStar={() => {}}
        teamMembers={teamMembers.slice(0, 5)}
        subtitle={`${filteredProjects.length} active projects`}
      />

      <EnhancedTabSystem
        currentView={projectsViewMode}
        onViewChange={onViewModeChange}
        onFilterToggle={onToggleFilters}
        onExport={onExport}
        hasActiveFilters={activeFilters.length > 0}
        activeFiltersCount={activeFilters.length}
        title="Projects"
      />

      <Suspense fallback={<LoadingFallback message="Loading filters..." />}>
        <ProjectsFilters
          open={showProjectsFilters}
          filters={projectsFilters}
          onFiltersChange={onFiltersChange}
          onClearFilters={onClearFilters}
          clients={clients}
          teamMembers={teamMembers}
          projects={projects}
        />
      </Suspense>
      
      {/* Conditional View Rendering */}
      {projectsViewMode === 'board' && (
        <ErrorBoundary fallbackMessage="Failed to load board view">
          <Suspense fallback={<LoadingFallback message="Loading board view..." />}>
            <BoardView
              tasks={tasks}
              onTaskUpdate={onUpdateTask}
              teamMembers={teamMembers}
              projects={projects}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {projectsViewMode === 'table' && (
        <ErrorBoundary fallbackMessage="Failed to load table view">
          <Suspense fallback={<ListSkeleton SkeletonComponent={ProjectCardSkeleton} count={4} />}>
            <ProjectsTableView
              projects={filteredProjects}
              clients={clients}
              teamMembers={teamMembers}
              onEditProject={onEditProject}
              onDeleteProject={onDeleteProject}
              onViewProject={onViewProject}
              onManageScope={onManageScope}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {projectsViewMode === 'list' && (
        <ErrorBoundary fallbackMessage="Failed to load projects list">
          <Suspense fallback={<ListSkeleton SkeletonComponent={ProjectCardSkeleton} count={4} />}>
            <ProjectsList 
              projects={filteredProjects}
              tasks={tasks}
              clients={clients}
              onDeleteProject={onDeleteProject}
              onManageScope={onManageScope}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {projectsViewMode === 'gantt' && (
        <ErrorBoundary fallbackMessage="Failed to load Gantt chart">
          <Suspense fallback={<LoadingFallback message="Loading Gantt chart..." />}>
            <GanttChart 
              tasks={tasks}
              projects={projects}
              teamMembers={teamMembers}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </Box>
  );
};

export default React.memo(ProjectsPage);