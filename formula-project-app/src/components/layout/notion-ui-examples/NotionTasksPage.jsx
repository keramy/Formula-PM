// Example: NotionTasksPage.jsx - Template for your Tasks page
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Add,
  FilterList,
  Assignment,
  ViewList,
  ViewModule,
  Schedule,
  CheckCircle
} from '@mui/icons-material';
import CleanPageLayout, { CleanTab } from '../CleanPageLayout';

const NotionTasksPage = ({ 
  tasks = [], 
  projects = [], 
  teamMembers = [],
  onAddTask,
  onUpdateTask,
  onDeleteTask 
}) => {
  const [activeTab, setActiveTab] = useState('my-tasks');
  const [viewMode, setViewMode] = useState('table');

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const myTasks = tasks.filter(t => t.assignedTo === 1008); // Current user
    const overdueTasks = tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return t.status !== 'completed' && dueDate < new Date();
    });
    
    return {
      total: tasks.length,
      myTasks: myTasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: overdueTasks.length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length
    };
  }, [tasks]);

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'review': return 'status-review';
      default: return 'status-todo';
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getAssigneeName = (assigneeId) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member?.fullName || 'Unassigned';
  };

  const headerActions = (
    <>
      <IconButton className="clean-button-secondary">
        <FilterList />
      </IconButton>
      <Button className="clean-button-primary" startIcon={<Add />} onClick={onAddTask}>
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
        badge={taskStats.myTasks}
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
        label="Overdue" 
        isActive={activeTab === 'overdue'}
        onClick={() => setActiveTab('overdue')}
        icon={<Schedule sx={{ fontSize: 16 }} />}
        badge={taskStats.overdue}
      />
    </>
  );

  const StatsCard = ({ title, value, color, icon }) => (
    <Card className="clean-card">
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 700, color: '#0F1939' }}>
              {value}
            </Typography>
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
            {React.cloneElement(icon, { sx: { fontSize: 24, color: color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderTasksTable = (filteredTasks) => (
    <TableContainer component={Paper} className="clean-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F1939' }}>
                  {task.name}
                </Typography>
                {task.description && (
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                    {task.description.substring(0, 60)}...
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  {getProjectName(task.projectId)}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '11px', bgcolor: '#E3AF64' }}>
                    {getAssigneeName(task.assignedTo).charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px' }}>
                    {getAssigneeName(task.assignedTo)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={task.status?.replace('-', ' ') || 'todo'}
                  className={`clean-chip ${getStatusChipClass(task.status)}`}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={task.priority || 'medium'}
                  className={`clean-chip ${task.priority === 'high' ? 'status-todo' : 'status-review'}`}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px' }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                  <LinearProgress
                    variant="determinate"
                    value={task.progress || 0}
                    className="clean-progress-bar"
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                    {task.progress || 0}%
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const getFilteredTasks = () => {
    switch (activeTab) {
      case 'my-tasks':
        return tasks.filter(t => t.assignedTo === 1008);
      case 'overdue':
        return tasks.filter(t => {
          const dueDate = new Date(t.dueDate);
          return t.status !== 'completed' && dueDate < new Date();
        });
      case 'all-tasks':
      default:
        return tasks;
    }
  };

  const renderTabContent = () => {
    const filteredTasks = getFilteredTasks();

    if (activeTab === 'board') {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
            📋 Kanban Board View
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            Task board with drag & drop functionality coming soon
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Tasks"
              value={taskStats.total}
              color="#516AC8"
              icon={<Assignment />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="My Tasks"
              value={taskStats.myTasks}
              color="#E3AF64"
              icon={<Assignment />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Completed"
              value={taskStats.completed}
              color="#10B981"
              icon={<CheckCircle />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Overdue"
              value={taskStats.overdue}
              color="#EF4444"
              icon={<Schedule />}
            />
          </Grid>
        </Grid>

        {/* Tasks Table */}
        {renderTasksTable(filteredTasks)}
      </Box>
    );
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

export default NotionTasksPage;