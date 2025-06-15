import React from 'react';
import { Box } from '@mui/material';
import TaskForm from './TaskForm';
import PageWrapper from '../../../components/layout/PageWrapper';

const TaskFormPage = ({ 
  task = null, 
  projects, 
  teamMembers, 
  onSubmit, 
  onCancel,
  isEdit = false 
}) => {
  const pageTitle = isEdit ? 'Edit Task' : 'Add New Task';
  const pageType = isEdit ? 'edit-task' : 'add-task';
  
  // Build page data for breadcrumbs
  const pageData = isEdit && task ? {
    taskId: task.id,
    taskName: task.name,
    projectId: task.projectId,
    status: task.status,
    priority: task.priority
  } : {};

  return (
    <PageWrapper
      pageType={pageType}
      pageTitle={pageTitle}
      pageData={pageData}
      subtitle={isEdit ? `Editing: ${task?.name}` : 'Create a new task'}
      onNavigate={(path) => {
        if (path === '/tasks') {
          onCancel && onCancel();
        }
      }}
      contentPadding={3}
    >
      <Box 
        sx={{ 
          maxWidth: 800, 
          mx: 'auto',
          backgroundColor: 'white',
          borderRadius: 3,
          border: '1px solid #E9ECEF',
          p: 4
        }}
      >
        <TaskForm
          projects={projects}
          teamMembers={teamMembers}
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialTask={task}
        />
      </Box>
    </PageWrapper>
  );
};

export default TaskFormPage;