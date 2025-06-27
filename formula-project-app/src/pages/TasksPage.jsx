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
  Plus as Add,
  FilterList,
  List as ViewList,
  ViewGrid as ViewModule,
  Calendar as DateRange,
  ClipboardCheck as Assignment,
  CheckCircle,
  Clock as PendingIcon,
  Play as InProgressIcon,
  User as PersonIcon,
  Calendar as CalendarToday,
  ArrowUp as TrendingUp,
  WarningTriangle as Warning,
  Trash as MoreVert
} from 'iconoir-react';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import { TaskStatusChip, PriorityChip } from '../components/ui/StatusChip';

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

  const handleAddTask = useCallback(() => {
    onAddTask();
  }, [onAddTask]);

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
        icon={<Assignment sx={{ fontSize: 16 }} />}
        badge={myTasks.length}
      />
      <CleanTab 
        label="All Tasks" 
        isActive={activeTab === 'all-tasks'}
        onClick={() => setActiveTab('all-tasks')}
        icon={<ViewList sx={{ fontSize: 16 }} />}
        badge={taskStats.total}
      />
      <CleanTab 
        label="Board" 
        isActive={activeTab === 'board'}
        onClick={() => setActiveTab('board')}
        icon={<ViewModule sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Calendar" 
        isActive={activeTab === 'calendar'}
        onClick={() => setActiveTab('calendar')}
        icon={<DateRange sx={{ fontSize: 16 }} />}
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

  const TaskCard = ({ task }) => (
    <Card className="clean-card" sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onViewTask && onViewTask(task)}>
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
          <IconButton size="small" sx={{ color: '#9CA3AF' }}>
            <MoreVert sx={{ fontSize: 18 }} />
          </IconButton>
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
            <CalendarToday sx={{ fontSize: 14, color: '#9CA3AF' }} />
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

  const renderMyTasksContent = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="My Tasks"
            value={myTasks.length}
            subtitle={`${myTasks.filter(t => t.status === 'completed').length} completed`}
            icon={<Assignment />}
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
                <Assignment sx={{ fontSize: 64, color: '#9CA3AF', mb: 2 }} />
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
            <ViewModule sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            className={viewMode === 'list' ? 'clean-button-primary' : 'clean-button-secondary'}
            onClick={() => setViewMode('list')}
            size="small"
          >
            <ViewList sx={{ fontSize: 18 }} />
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
                      <MoreVert sx={{ fontSize: 16 }} />
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
  );
};

export default TasksPage;