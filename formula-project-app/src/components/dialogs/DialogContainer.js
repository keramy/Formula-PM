import React, { Suspense } from 'react';
import { useDialogManager } from '../../hooks/useDialogManager';
import { FormSkeleton } from '../lazy';

// Lazy load dialog components
const ProjectFormDialog = React.lazy(() => import('./ProjectFormDialog'));
const TaskFormDialog = React.lazy(() => import('./TaskFormDialog'));
const TeamMemberDialog = React.lazy(() => import('./TeamMemberDialog'));
const ClientDialog = React.lazy(() => import('./ClientDialog'));
const ProjectViewDialog = React.lazy(() => import('./ProjectViewDialog'));
const TaskViewDialog = React.lazy(() => import('./TaskViewDialog'));
const TeamMemberDetailDialog = React.lazy(() => import('./TeamMemberDetailDialog'));
const GlobalSearchDialog = React.lazy(() => import('./GlobalSearchDialog'));

/**
 * DialogContainer component that manages all dialogs with lazy loading
 * Uses the useDialogManager hook for centralized dialog state management
 */
const DialogContainer = ({
  // Data props
  projects,
  tasks,
  teamMembers,
  clients,
  
  // Event handlers
  onAddProject,
  onUpdateProject,
  onAddTask,
  onUpdateTask,
  onAddTeamMember,
  onAddClient,
  
  // Search props
  searchTerm,
  searchResults,
  isSearching,
  suggestions,
  quickFilters,
  showSearchResults,
  onSearchChange,
  onCloseSearch,
  onSearchResultSelect
}) => {
  const { dialogState } = useDialogManager();

  return (
    <>
      {/* Create Project Dialog */}
      <Suspense fallback={<FormSkeleton />}>
        <ProjectFormDialog
          open={dialogState.createProjectDialogOpen}
          clients={clients}
          onSubmit={onAddProject}
        />
      </Suspense>

      {/* Edit Project Dialog */}
      <Suspense fallback={<FormSkeleton />}>
        <ProjectFormDialog
          open={dialogState.editProjectDialogOpen}
          clients={clients}
          onSubmit={onUpdateProject}
          initialProject={dialogState.selectedProjectForEdit}
          isEdit={true}
        />
      </Suspense>

      {/* View Project Dialog */}
      <Suspense fallback={<FormSkeleton />}>
        <ProjectViewDialog
          open={dialogState.viewProjectDialogOpen}
          project={dialogState.selectedProjectForView}
          clients={clients}
        />
      </Suspense>

      {/* Add Task Dialog */}
      <Suspense fallback={<FormSkeleton />}>
        <TaskFormDialog
          open={dialogState.addTaskDialogOpen}
          projects={projects}
          teamMembers={teamMembers}
          onSubmit={onAddTask}
        />
      </Suspense>

      {/* Edit Task Dialog */}
      <Suspense fallback={<FormSkeleton />}>
        <TaskFormDialog
          open={dialogState.editTaskDialogOpen}
          projects={projects}
          teamMembers={teamMembers}
          onSubmit={onUpdateTask}
          initialTask={dialogState.selectedTaskForEdit}
          isEdit={true}
        />
      </Suspense>

      {/* View Task Dialog */}
      <Suspense fallback={<FormSkeleton />}>
        <TaskViewDialog
          open={dialogState.viewTaskDialogOpen}
          task={dialogState.selectedTaskForView}
          projects={projects}
          teamMembers={teamMembers}
        />
      </Suspense>

      {/* Add Team Member Dialog */}
      <Suspense fallback={<FormSkeleton />}>
        <TeamMemberDialog
          open={dialogState.addTeamMemberDialogOpen}
          teamMembers={teamMembers}
          onSubmit={onAddTeamMember}
        />
      </Suspense>

      {/* Team Member Detail Dialog */}
      <Suspense fallback={<FormSkeleton />}>
        <TeamMemberDetailDialog
          open={dialogState.teamMemberDetailOpen}
          member={dialogState.selectedMemberForDetail}
          tasks={tasks}
          projects={projects}
          teamMembers={teamMembers}
        />
      </Suspense>

      {/* Add Client Dialog */}
      <Suspense fallback={<FormSkeleton />}>
        <ClientDialog
          open={dialogState.addClientDialogOpen}
          onSubmit={onAddClient}
        />
      </Suspense>

      {/* Global Search Dialog */}
      <Suspense fallback={null}>
        <GlobalSearchDialog
          open={showSearchResults}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onClose={onCloseSearch}
          onSelectResult={onSearchResultSelect}
          results={searchResults}
          isSearching={isSearching}
          suggestions={suggestions}
          quickFilters={quickFilters}
        />
      </Suspense>
    </>
  );
};

export default DialogContainer;