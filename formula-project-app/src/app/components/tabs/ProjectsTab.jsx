import React, { Suspense } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Plus as Add } from 'iconoir-react';
import EnhancedTabSystem from '../../../components/layout/EnhancedTabSystem';
import ErrorBoundary from '../../../components/common/ErrorBoundary';
import {
  ProjectsFilters,
  BoardView,
  ProjectsTableView,
  ProjectsList,
  GanttChart,
  LoadingFallback,
  ListSkeleton,
  ProjectCardSkeleton
} from '../../../components/lazy';

/**
 * Projects Tab Component
 * Manages project views and filtering
 */
const ProjectsTab = ({
  projectsViewMode,
  filteredProjects,
  projects,
  tasks,
  clients,
  teamMembers,
  showProjectsFilters,
  projectsFilters,
  activeFilters,
  onViewModeChange,
  onToggleFilters,
  onExport,
  onFiltersChange,
  onClearFilters,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onViewProject,
  onManageScope,
  onTaskUpdate
}) => {
  return (
    <Box>
      {/* Simple Header with Add Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {`${filteredProjects.length} active projects`}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={onAddProject}
          sx={{ 
            backgroundColor: '#E3AF64',
            '&:hover': { backgroundColor: '#d19a4d' }
          }}
        >
          Add Project
        </Button>
      </Box>

      {/* Enhanced Tab System */}
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
              onTaskUpdate={onTaskUpdate}
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
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            backgroundColor: 'white',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 3
          }}
        >
          <ErrorBoundary fallbackMessage="Failed to load projects list">
            <Suspense fallback={<ListSkeleton SkeletonComponent={ProjectCardSkeleton} count={4} />}>
              <ProjectsList 
                projects={filteredProjects}
                tasks={tasks}
                clients={clients}
                onDeleteProject={onDeleteProject}
                onManageScope={onManageScope}
                onViewProject={onViewProject}
              />
            </Suspense>
          </ErrorBoundary>
        </Paper>
      )}

      {projectsViewMode === 'gantt' && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            backgroundColor: 'white',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 3
          }}
        >
          <ErrorBoundary fallbackMessage="Failed to load Gantt chart">
            <Suspense fallback={<LoadingFallback message="Loading Gantt chart..." />}>
              <GanttChart 
                tasks={tasks}
                projects={projects}
                teamMembers={teamMembers}
              />
            </Suspense>
          </ErrorBoundary>
        </Paper>
      )}

      {projectsViewMode === 'calendar' && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            📅 Calendar View Coming Soon
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            We're working on an amazing calendar interface for your projects.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(ProjectsTab);