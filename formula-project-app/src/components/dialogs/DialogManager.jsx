import React, { Suspense } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Paper
} from '@mui/material';
import { 
  ProjectForm,
  TaskForm,
  TeamMemberForm,
  ClientForm,
  ProjectScope,
  FormSkeleton,
  LoadingFallback
} from '../lazy';

/**
 * Centralized dialog management component
 * Handles all application dialogs with lazy loading
 */
const DialogManager = ({
  dialogState,
  updateDialogState,
  projects,
  tasks,
  teamMembers,
  clients,
  onAddProject,
  onUpdateProject,
  onAddTask,
  onUpdateTask,
  onAddTeamMember,
  onAddClient,
  onCloseProjectScope
}) => {
  return (
    <>
      {/* Create Project Dialog */}
      <Dialog 
        open={dialogState.createProjectDialogOpen} 
        onClose={() => updateDialogState({ createProjectDialogOpen: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Suspense fallback={<FormSkeleton />}>
            <ProjectForm onSubmit={onAddProject} clients={clients} />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog 
        open={dialogState.editProjectDialogOpen} 
        onClose={() => updateDialogState({ 
          editProjectDialogOpen: false,
          selectedProjectForEdit: null 
        })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          {dialogState.selectedProjectForEdit && (
            <Suspense fallback={<FormSkeleton />}>
              <ProjectForm 
                onSubmit={onUpdateProject} 
                clients={clients} 
                initialProject={dialogState.selectedProjectForEdit}
              />
            </Suspense>
          )}
        </DialogContent>
      </Dialog>

      {/* View Project Dialog */}
      <Dialog 
        open={dialogState.viewProjectDialogOpen} 
        onClose={() => updateDialogState({
          viewProjectDialogOpen: false,
          selectedProjectForView: null
        })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          {dialogState.selectedProjectForView && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>
                {dialogState.selectedProjectForView.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {dialogState.selectedProjectForView.description || 'No description provided'}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Type:</strong> {dialogState.selectedProjectForView.type}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Status:</strong> {dialogState.selectedProjectForView.status}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Start Date:</strong> {new Date(dialogState.selectedProjectForView.startDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>End Date:</strong> {new Date(dialogState.selectedProjectForView.endDate).toLocaleDateString()}
              </Typography>
              {dialogState.selectedProjectForView.clientId && (
                <Typography variant="body2" paragraph>
                  <strong>Client:</strong> {clients.find(c => c.id === dialogState.selectedProjectForView.clientId)?.companyName || 'Unknown'}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Project Scope Dialog */}
      <Dialog 
        open={dialogState.scopeDialogOpen} 
        onClose={() => updateDialogState({
          scopeDialogOpen: false,
          selectedProjectForScope: null
        })}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {dialogState.selectedProjectForScope && (
            <Suspense fallback={<LoadingFallback message="Loading project scope..." />}>
              <ProjectScope 
                project={dialogState.selectedProjectForScope} 
                onClose={onCloseProjectScope}
              />
            </Suspense>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Team Member Dialog */}
      <Dialog 
        open={dialogState.addTeamMemberDialogOpen} 
        onClose={() => updateDialogState({ addTeamMemberDialogOpen: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <Suspense fallback={<FormSkeleton />}>
            <TeamMemberForm 
              teamMembers={teamMembers}
              onSubmit={onAddTeamMember} 
            />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog 
        open={dialogState.addClientDialogOpen} 
        onClose={() => updateDialogState({ addClientDialogOpen: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <Suspense fallback={<FormSkeleton />}>
            <ClientForm onSubmit={onAddClient} />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog 
        open={dialogState.addTaskDialogOpen} 
        onClose={() => updateDialogState({ addTaskDialogOpen: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Suspense fallback={<FormSkeleton />}>
            <TaskForm 
              projects={projects}
              teamMembers={teamMembers}
              onSubmit={onAddTask}
              onCancel={() => updateDialogState({ addTaskDialogOpen: false })}
            />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog 
        open={dialogState.editTaskDialogOpen} 
        onClose={() => updateDialogState({
          editTaskDialogOpen: false,
          selectedTaskForEdit: null
        })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {dialogState.selectedTaskForEdit && (
            <Suspense fallback={<FormSkeleton />}>
              <TaskForm 
                projects={projects}
                teamMembers={teamMembers}
                onSubmit={onUpdateTask}
                initialTask={dialogState.selectedTaskForEdit}
              />
            </Suspense>
          )}
        </DialogContent>
      </Dialog>

      {/* View Task Dialog */}
      <Dialog 
        open={dialogState.viewTaskDialogOpen} 
        onClose={() => updateDialogState({
          viewTaskDialogOpen: false,
          selectedTaskForView: null
        })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {dialogState.selectedTaskForView && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>
                {dialogState.selectedTaskForView.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {dialogState.selectedTaskForView.description || 'No description provided'}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Project:</strong> {projects.find(p => p.id === dialogState.selectedTaskForView.projectId)?.name || 'Unknown'}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Assigned To:</strong> {teamMembers.find(tm => tm.id === dialogState.selectedTaskForView.assignedTo)?.fullName || 'Unassigned'}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Priority:</strong> {dialogState.selectedTaskForView.priority}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Status:</strong> {dialogState.selectedTaskForView.status}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Due Date:</strong> {new Date(dialogState.selectedTaskForView.dueDate).toLocaleDateString()}
              </Typography>
              {dialogState.selectedTaskForView.progress !== undefined && (
                <Typography variant="body2" paragraph>
                  <strong>Progress:</strong> {dialogState.selectedTaskForView.progress}%
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogManager;