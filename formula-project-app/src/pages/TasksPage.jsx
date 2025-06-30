import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  MdAdd as Add,
  MdFilterList as FilterList,
  MdViewList as ViewList,
  MdViewModule as ViewModule,
  MdCalendarToday as DateRange,
  MdAssignment as Task,
  MdCheckCircle as CheckCircle,
  MdSchedule as PendingIcon,
  MdPlayArrow as InProgressIcon,
  MdPerson as PersonIcon,
  MdCalendarToday as CalendarToday,
  MdKeyboardArrowUp as ArrowUp,
  MdWarning as Warning,
  MdMoreVert as MoreVert,
  MdCheck as Check,
  MdEdit as Edit,
  MdDelete as Delete
} from 'react-icons/md';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import { TaskStatusChip, PriorityChip } from '../components/ui/StatusChip';
import TaskFormModal from '../components/forms/TaskFormModal';
import DeleteConfirmationDialog from '../components/forms/DeleteConfirmationDialog';
import { useNotification } from '../context/NotificationContext';
import ApiService from '../services/api/apiService';

const TasksPage = ({ 
  tasks = [],
  projects = [],
  teamMembers = [],
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onViewTask,
  onEditTask
}) => {
  const [activeTab, setActiveTab] = useState('my-tasks');
  const [viewMode, setViewMode] = useState('cards');
  
  // CRUD Modal States
  const [taskFormModal, setTaskFormModal] = useState({
    open: false,
    task: null,
    loading: false,
    error: null
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    task: null,
    loading: false,
    error: null
  });
  
  const { showSuccess, showError } = useNotification();

  // CRUD Handlers
  const handleAddTask = useCallback(() => {
    setTaskFormModal({
      open: true,
      task: null,
      loading: false,
      error: null
    });
  }, []);

  const handleEditTask = useCallback((task) => {
    setTaskFormModal({
      open: true,
      task,
      loading: false,
      error: null
    });
  }, []);

  const handleDeleteTask = useCallback((task) => {
    setDeleteConfirmation({
      open: true,
      task,
      loading: false,
      error: null
    });
  }, []);

  const handleTaskSubmit = useCallback(async (taskIdOrData, updateData = null) => {
    setTaskFormModal(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let result;
      const isEdit = updateData !== null;
      
      if (isEdit) {
        // Update existing task
        result = await ApiService.updateTask(taskIdOrData, updateData);
        showSuccess('Task Updated', `Task "${updateData.name}" has been updated successfully.`);
        if (onUpdateTask) onUpdateTask(taskIdOrData, result);
      } else {
        // Create new task
        result = await ApiService.createTask(taskIdOrData);
        showSuccess('Task Created', `Task "${taskIdOrData.name}" has been created successfully.`);
        if (onAddTask) onAddTask(result);
      }
      
      // Close modal
      setTaskFormModal({
        open: false,
        task: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Task submission error:', error);
      setTaskFormModal(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to save task. Please try again.'
      }));
      showError(
        isEdit ? 'Update Failed' : 'Creation Failed',
        error.message || 'An error occurred while saving the task.'
      );
    }
  }, [onAddTask, onUpdateTask, showSuccess, showError]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirmation.task) return;
    
    setDeleteConfirmation(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await ApiService.deleteTask(deleteConfirmation.task.id);
      showSuccess(
        'Task Deleted',
        `Task "${deleteConfirmation.task.name}" has been deleted successfully.`
      );
      
      if (onDeleteTask) {
        onDeleteTask(deleteConfirmation.task.id);
      }
      
      // Close modal
      setDeleteConfirmation({
        open: false,
        task: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Task deletion error:', error);
      setDeleteConfirmation(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to delete task. Please try again.'
      }));
      showError(
        'Deletion Failed',
        error.message || 'An error occurred while deleting the task.'
      );
    }
  }, [deleteConfirmation.task, onDeleteTask, showSuccess, showError]);

  const handleCloseTaskForm = useCallback(() => {
    setTaskFormModal({
      open: false,
      task: null,
      loading: false,
      error: null
    });
  }, []);

  const handleCloseDeleteConfirmation = useCallback(() => {
    setDeleteConfirmation({
      open: false,
      task: null,
      loading: false,
      error: null
    });
  }, []);

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const overdueTasks = tasks.filter(t => {
      const today = new Date();
      const dueDate = new Date(t.dueDate);
      return t.status !== 'completed' && dueDate < today;
    }).length;

    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
      overdue: overdueTasks
    };
  }, [tasks]);

  // Get my tasks (assuming current user is first team member for demo)
  const myTasks = useMemo(() => {
    const currentUserId = teamMembers[0]?.id;
    return tasks.filter(task => task.assignedTo === currentUserId);
  }, [tasks, teamMembers]);

  // Get recent tasks
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 6);
  }, [tasks]);

  // Get overdue tasks
  const overdueTasks = useMemo(() => {
    const today = new Date();
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return task.status !== 'completed' && dueDate < today;
    }).slice(0, 5);
  }, [tasks]);

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-review';
      case 'on-hold': return 'status-todo';
      default: return 'status-todo';
    }
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle sx={{ color: '#10B981' }} />;
      case 'in-progress':
        return <InProgressIcon sx={{ color: '#E3AF64' }} />;
      default:
        return <PendingIcon sx={{ color: '#516AC8' }} />;
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getAssigneeName = (assigneeId) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.fullName : 'Unassigned';
  };

  const getAssigneeInitials = (assigneeId) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.initials || member.fullName?.charAt(0) : '?';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = (task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return task.status !== 'completed' && dueDate < today;
  };

  const headerActions = (
    <>
      <IconButton className="clean-button-secondary">
        <FilterList />
      </IconButton>
      <Button className="clean-button-primary" startIcon={<Add />} onClick={handleAddTask}>
        Add task
      </Button>
    </>
  );

  const tabs = (
    <>
      <CleanTab 
        label="My Tasks" 
        isActive={activeTab === 'my-tasks'}
        onClick={() => setActiveTab('my-tasks')}
        icon={<Check size={16} />}
        badge={myTasks.length}
      />
      <CleanTab 
        label="All Tasks" 
        isActive={activeTab === 'all-tasks'}
        onClick={() => setActiveTab('all-tasks')}
        icon={<ViewList size={16} />}
        badge={taskStats.total}
      />
      <CleanTab 
        label="Board" 
        isActive={activeTab === 'board'}
        onClick={() => setActiveTab('board')}
        icon={<ViewModule size={16} />}
      />
      <CleanTab 
        label="Calendar" 
        isActive={activeTab === 'calendar'}
        onClick={() => setActiveTab('calendar')}
        icon={<DateRange size={16} />}
      />
    </>
  );

  const StatsCard = ({ title, value, subtitle, icon, color = '#E3AF64' }) => (
    <Card className="clean-card">
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7280',
                fontSize: '13px',
                fontWeight: 500,
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#0F1939',
                mb: 0.5
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '12px'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { 
              sx: { fontSize: 24, color: color }
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const TaskCard = ({ task }) => {
    const handleCardClick = (e) => {
      // Prevent card click when clicking on action buttons
      if (e.target.closest('.task-actions')) {
        return;
      }
      onViewTask && onViewTask(task);
    };

    const handleEditClick = (e) => {
      e.stopPropagation();
      handleEditTask(task);
    };

    const handleDeleteClick = (e) => {
      e.stopPropagation();
      handleDeleteTask(task);
    };

    return (
      <Card className="clean-card" sx={{ height: '100%', cursor: 'pointer' }} onClick={handleCardClick}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#0F1939',
                  mb: 0.5,
                  lineHeight: 1.3
                }}
              >
                {task.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6B7280', 
                  fontSize: '13px',
                  mb: 1
                }}
              >
                {getProjectName(task.projectId)}
              </Typography>
            </Box>
            <Box className="task-actions" sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                sx={{ 
                  color: '#9CA3AF',
                  '&:hover': { color: '#E3AF64', bgcolor: '#FEF3E2' }
                }}
                onClick={handleEditClick}
                title="Edit Task"
              >
                <Edit size={16} />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  color: '#9CA3AF',
                  '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' }
                }}
                onClick={handleDeleteClick}
                title="Delete Task"
              >
                <Delete size={16} />
              </IconButton>
            </Box>
          </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <TaskStatusChip
              status={task.status || 'pending'}
              size="small"
            />
            {task.priority && (
              <PriorityChip
                priority={task.priority}
                size="small"
              />
            )}
          </Box>
          {task.progress !== undefined && (
            <LinearProgress
              variant="determinate"
              value={task.progress || 0}
              className="clean-progress-bar"
              sx={{
                '& .MuiLinearProgress-bar': {
                  backgroundColor: task.progress >= 75 ? '#10B981' : task.progress >= 50 ? '#E3AF64' : '#516AC8'
                }
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday size={14} style={{ color: '#9CA3AF' }} />
            <Typography 
              variant="caption" 
              sx={{ 
                color: isOverdue(task) ? '#EF4444' : '#6B7280',
                fontSize: '12px',
                fontWeight: isOverdue(task) ? 600 : 400
              }}
            >
              {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
            </Typography>
          </Box>
          {isOverdue(task) && (
            <Chip
              label="Overdue"
              size="small"
              sx={{
                backgroundColor: '#EF444420',
                color: '#EF4444',
                fontSize: '10px'
              }}
            />
          )}
        </Box>

        {task.assignedTo && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 20,
                height: 20,
                fontSize: '10px',
                fontWeight: 600,
                bgcolor: '#E3AF64'
              }}
            >
              {getAssigneeInitials(task.assignedTo)}
            </Avatar>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#6B7280',
                fontSize: '12px'
              }}
            >
              {getAssigneeName(task.assignedTo)}
            </Typography>
          </Box>
        )}
        </CardContent>
      </Card>
    );
  };

  const renderMyTasksContent = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="My Tasks"
            value={myTasks.length}
            subtitle={`${myTasks.filter(t => t.status === 'completed').length} completed`}
            icon={<Check />}
            color="#516AC8"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="In Progress"
            value={myTasks.filter(t => t.status === 'in-progress').length}
            subtitle="Currently working on"
            icon={<InProgressIcon />}
            color="#E3AF64"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Pending"
            value={myTasks.filter(t => t.status === 'pending').length}
            subtitle="Waiting to start"
            icon={<PendingIcon />}
            color="#516AC8"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Overdue"
            value={myTasks.filter(t => isOverdue(t)).length}
            subtitle="Requires attention"
            icon={<Warning />}
            color="#EF4444"
          />
        </Grid>
      </Grid>

      {/* My Tasks Grid */}
      <Grid container spacing={3}>
        {myTasks.map((task) => (
          <Grid item xs={12} sm={6} lg={4} key={task.id}>
            <TaskCard task={task} />
          </Grid>
        ))}
        {myTasks.length === 0 && (
          <Grid item xs={12}>
            <Card className="clean-card">
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Check size={64} style={{ color: '#9CA3AF', marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                  No tasks assigned to you
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                  You're all caught up! New tasks will appear here when assigned.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const renderAllTasksContent = () => (
    <Box>
      {/* View Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '18px', 
            fontWeight: 600,
            color: '#0F1939'
          }}
        >
          All Tasks ({tasks.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            className={viewMode === 'cards' ? 'clean-button-primary' : 'clean-button-secondary'}
            onClick={() => setViewMode('cards')}
            size="small"
          >
            <ViewModule size={18} />
          </IconButton>
          <IconButton
            className={viewMode === 'list' ? 'clean-button-primary' : 'clean-button-secondary'}
            onClick={() => setViewMode('list')}
            size="small"
          >
            <ViewList size={18} />
          </IconButton>
        </Box>
      </Box>

      {/* Tasks Display */}
      {viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} lg={4} key={task.id}>
              <TaskCard task={task} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} className="clean-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task Name</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#0F1939'
                      }}
                    >
                      {task.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {getProjectName(task.projectId)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TaskStatusChip
                      status={task.status || 'pending'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {task.priority && (
                      <PriorityChip
                        priority={task.priority}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '11px',
                          bgcolor: '#E3AF64'
                        }}
                      >
                        {getAssigneeInitials(task.assignedTo)}
                      </Avatar>
                      <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px' }}>
                        {getAssigneeName(task.assignedTo)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: isOverdue(task) ? '#EF4444' : '#6B7280',
                        fontSize: '13px',
                        fontWeight: isOverdue(task) ? 600 : 400
                      }}
                    >
                      {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 100 }}>
                      <LinearProgress
                        variant="determinate"
                        value={task.progress || 0}
                        className="clean-progress-bar"
                        sx={{ flex: 1 }}
                      />
                      <Typography className="text-xs font-medium" sx={{ color: 'var(--gray-600)' }}>
                        {task.progress || 0}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        color: 'var(--gray-400)',
                        '&:hover': {
                          color: 'var(--construction-500)',
                          backgroundColor: 'var(--construction-50)'
                        }
                      }}
                    >
                      <MoreVert size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderBoardContent = () => (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
        📋 Board View
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
        Kanban board with drag & drop functionality coming soon
      </Typography>
    </Box>
  );

  const renderCalendarContent = () => (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
        📅 Calendar View
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
        Calendar integration with task deadlines coming soon
      </Typography>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'my-tasks':
        return renderMyTasksContent();
      case 'all-tasks':
        return renderAllTasksContent();
      case 'board':
        return renderBoardContent();
      case 'calendar':
        return renderCalendarContent();
      default:
        return renderMyTasksContent();
    }
  };

  return (
    <>
      <CleanPageLayout
        title="Tasks"
        subtitle="Manage and track all project tasks and assignments"
        breadcrumbs={[
          { label: 'Team Space', href: '/workspace' },
          { label: 'Tasks', href: '/tasks' }
        ]}
        headerActions={headerActions}
        tabs={tabs}
      >
        <Box className="clean-fade-in">
          {renderTabContent()}
        </Box>
      </CleanPageLayout>

      {/* Task Form Modal */}
      <TaskFormModal
        open={taskFormModal.open}
        onClose={handleCloseTaskForm}
        onSubmit={handleTaskSubmit}
        task={taskFormModal.task}
        projects={projects}
        teamMembers={teamMembers}
        loading={taskFormModal.loading}
        error={taskFormModal.error}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmation.open}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        itemName={deleteConfirmation.task?.name}
        itemType="task"
        loading={deleteConfirmation.loading}
        error={deleteConfirmation.error}
      />
    </>
  );
};

export default TasksPage;