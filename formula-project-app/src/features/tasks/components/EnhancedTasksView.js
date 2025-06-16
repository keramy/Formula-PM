import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Calendar
} from '@mui/material';
import {
  CheckCircle,
  Delete,
  Person,
  CalendarToday,
  Assignment,
  Warning,
  Undo,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Schedule,
  PlayArrow,
  Flag,
  Error,
  PriorityHigh,
  ViewList,
  ViewModule,
  Today
} from '@mui/icons-material';
import UnifiedHeader from '../../../components/ui/UnifiedHeader';
import UnifiedFilters from '../../../components/ui/UnifiedFilters';
import { exportTasksToExcel } from '../../../services/export/excelExport';

const priorityConfig = {
  low: {
    label: 'Low',
    color: '#27ae60',
    bgColor: '#eafaf1',
    icon: <Flag />
  },
  medium: {
    label: 'Medium',
    color: '#f39c12',
    bgColor: '#fef9e7',
    icon: <Flag />
  },
  high: {
    label: 'High',
    color: '#e67e22',
    bgColor: '#fef5e7',
    icon: <Warning />
  },
  urgent: {
    label: 'Urgent',
    color: '#e74c3c',
    bgColor: '#fdf2f2',
    icon: <PriorityHigh />
  }
};

const statusConfig = {
  pending: { label: 'To Do', color: '#f39c12', bgColor: '#fef9e7', icon: <Schedule /> },
  'in-progress': { label: 'In Progress', color: '#3498db', bgColor: '#ebf5fb', icon: <PlayArrow /> },
  'in_progress': { label: 'In Progress', color: '#3498db', bgColor: '#ebf5fb', icon: <PlayArrow /> },
  completed: { label: 'Completed', color: '#27ae60', bgColor: '#eafaf1', icon: <CheckCircle /> }
};

const EnhancedTasksView = React.memo(function EnhancedTasksView({ tasks, projects, teamMembers = [], onUpdateTask, onDeleteTask, onAddTask, onViewTask, onEditTask }) {
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // 0: List, 1: Board, 2: Calendar
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: '',
    assignee: '',
    dueDateFrom: null,
    dueDateTo: null
  });

  // Filter configuration for tasks
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]
    },
    {
      key: 'project',
      label: 'Project',
      type: 'select',
      options: projects.map(p => ({ value: p.id, label: p.name }))
    },
    {
      key: 'assignee',
      label: 'Assignee',
      type: 'select',
      options: teamMembers.map(tm => ({ value: tm.id, label: tm.fullName }))
    }
  ];

  // Quick filters for tasks
  const quickFilters = [
    { key: 'overdue', label: 'Overdue Tasks', filters: { status: '', dueDateTo: new Date() } },
    { key: 'today', label: 'Due Today', filters: { dueDateFrom: new Date(), dueDateTo: new Date() } },
    { key: 'urgent', label: 'Urgent Tasks', filters: { priority: 'urgent' } },
    { key: 'completed', label: 'Completed', filters: { status: 'completed' } }
  ];

  // Optimized filter function using memoization
  const taskFilter = useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    const hasSearch = !!searchValue;
    
    return (task) => {
      // Search filter - optimized with early exit
      if (hasSearch) {
        const matchesSearch = task.name.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && task.status !== filters.status) return false;

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) return false;

      // Project filter
      if (filters.project && task.projectId !== filters.project) return false;

      // Assignee filter
      if (filters.assignee && task.assignedTo !== filters.assignee) return false;

      return true;
    };
  }, [searchValue, filters]);

  // Optimized sort function using memoization
  const taskSorter = useMemo(() => {
    const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
    
    return (a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case 'priority':
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    };
  }, [sortBy, sortDirection]);

  // Filter and sort tasks with optimized functions
  const filteredAndSortedTasks = useMemo(() => {
    return tasks.filter(taskFilter).sort(taskSorter);
  }, [tasks, taskFilter, taskSorter]);

  // Group tasks by status for board view
  const tasksByStatus = useMemo(() => {
    const grouped = {
      pending: [],
      'in-progress': [],
      completed: []
    };

    filteredAndSortedTasks.forEach(task => {
      const status = task.status === 'in_progress' ? 'in-progress' : task.status;
      if (grouped[status]) {
        grouped[status].push(task);
      } else {
        grouped.pending.push(task);
      }
    });

    return grouped;
  }, [filteredAndSortedTasks]);

  // Memoized active filters calculation
  const activeFilters = useMemo(() => {
    return Object.entries(filters)
      .filter(([key, value]) => {
        if (typeof value === 'string') return value !== '';
        return value !== null && value !== undefined;
      })
      .map(([key, value]) => {
        let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        let displayValue = value;
        
        if (key === 'project') {
          const project = projects.find(p => p.id === value);
          displayValue = project ? project.name : value;
        } else if (key === 'assignee') {
          const member = teamMembers.find(tm => tm.id === value);
          displayValue = member ? member.fullName : value;
        }
        
        return { key, label, value: displayValue };
      });
  }, [filters, projects, teamMembers]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Memoized event handlers for better performance
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      status: '',
      priority: '',
      project: '',
      assignee: '',
      dueDateFrom: null,
      dueDateTo: null
    });
  }, []);

  const handleClearFilter = useCallback((key) => {
    if (key === 'all') {
      handleClearFilters();
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  }, [handleClearFilters]);

  const handleApplyQuickFilter = useCallback((quickFilter) => {
    setFilters(prev => ({ ...prev, ...quickFilter.filters }));
  }, []);

  const handleExport = useCallback(() => {
    exportTasksToExcel(filteredAndSortedTasks, projects, teamMembers);
  }, [filteredAndSortedTasks, projects, teamMembers]);

  const handleCompleteTask = useCallback((taskId) => {
    onUpdateTask(taskId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  }, [onUpdateTask]);

  const handleUndoTask = useCallback((taskId) => {
    onUpdateTask(taskId, { 
      status: 'pending',
      completedAt: null
    });
  }, [onUpdateTask]);

  const handleDeleteTask = useCallback((taskId, taskName) => {
    if (window.confirm(`Are you sure you want to delete "${taskName}"?`)) {
      onDeleteTask(taskId);
    }
  }, [onDeleteTask]);

  // Memoized render task card for board view
  const renderTaskCard = useCallback((task) => {
    const project = projects.find(p => p.id === task.projectId);
    const priority = priorityConfig[task.priority];
    const overdue = isOverdue(task.dueDate, task.status);
    const assignedMember = teamMembers.find(member => member.id === task.assignedTo);

    return (
      <Card
        key={task.id}
        sx={{
          mb: 1,
          borderLeft: `4px solid ${overdue ? '#e74c3c' : priority.color}`,
          backgroundColor: overdue ? '#fff5f5' : 'white',
          '&:hover': {
            boxShadow: 2
          }
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {task.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label={priority.label}
              size="small"
              sx={{
                backgroundColor: priority.bgColor,
                color: priority.color,
                fontSize: '0.7rem'
              }}
            />
            {overdue && (
              <Chip
                label="Overdue"
                size="small"
                sx={{
                  backgroundColor: '#fdf2f2',
                  color: '#e74c3c',
                  fontSize: '0.7rem'
                }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {project ? project.name : 'Unknown Project'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {assignedMember && (
                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: assignedMember.roleColor }}>
                  {assignedMember.initials}
                </Avatar>
              )}
              <Typography variant="caption" color="text.secondary">
                {formatDate(task.dueDate)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => onEditTask && onEditTask(task)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              {task.status === 'completed' ? (
                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => handleUndoTask(task.id)}
                >
                  <Undo fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  <CheckCircle fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }, [projects, teamMembers, formatDate, handleCompleteTask, handleUndoTask, onEditTask]);

  // Memoized render list view
  const renderListView = useCallback(() => (
    <List>
      {filteredAndSortedTasks.map((task) => {
        const project = projects.find(p => p.id === task.projectId);
        const priority = priorityConfig[task.priority];
        const overdue = isOverdue(task.dueDate, task.status);
        const assignedMember = teamMembers.find(member => member.id === task.assignedTo);
        const status = statusConfig[task.status] || statusConfig.pending;

        return (
          <React.Fragment key={task.id}>
            <ListItem
              sx={{
                borderLeft: `4px solid ${overdue ? '#e74c3c' : priority.color}`,
                backgroundColor: overdue ? '#fff5f5' : 'white',
                mb: 1,
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <ListItemAvatar>
                {assignedMember ? (
                  <Avatar sx={{ bgcolor: assignedMember.roleColor }}>
                    {assignedMember.initials}
                  </Avatar>
                ) : (
                  <Avatar>
                    <Person />
                  </Avatar>
                )}
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {task.name}
                    </Typography>
                    <Chip
                      label={priority.label}
                      size="small"
                      sx={{
                        backgroundColor: priority.bgColor,
                        color: priority.color,
                        fontSize: '0.7rem'
                      }}
                    />
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        backgroundColor: status.bgColor,
                        color: status.color,
                        fontSize: '0.7rem'
                      }}
                    />
                    {overdue && (
                      <Chip
                        label="Overdue"
                        size="small"
                        sx={{
                          backgroundColor: '#fdf2f2',
                          color: '#e74c3c',
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Project: {project ? project.name : 'Unknown Project'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assigned to: {assignedMember ? assignedMember.fullName : 'Unassigned'}
                    </Typography>
                    <Typography variant="body2" color={overdue ? 'error' : 'text.secondary'}>
                      Due: {formatDate(task.dueDate)}
                    </Typography>
                  </Box>
                }
              />
              
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => onEditTask && onEditTask(task)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  {task.status === 'completed' ? (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => handleUndoTask(task.id)}
                    >
                      <Undo fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      <CheckCircle fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteTask(task.id, task.name)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          </React.Fragment>
        );
      })}
    </List>
  ), [filteredAndSortedTasks, projects, teamMembers, formatDate, handleCompleteTask, handleUndoTask, handleDeleteTask, onEditTask]);

  // Memoized render board view
  const renderBoardView = useCallback(() => (
    <Grid container spacing={2}>
      {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
        const statusInfo = statusConfig[status] || statusConfig.pending;
        return (
          <Grid item xs={12} md={4} key={status}>
            <Paper sx={{ p: 2, minHeight: 400 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {statusInfo.icon}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {statusInfo.label}
                </Typography>
                <Chip
                  label={statusTasks.length}
                  size="small"
                  sx={{
                    backgroundColor: statusInfo.bgColor,
                    color: statusInfo.color
                  }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box>
                {statusTasks.map(task => renderTaskCard(task))}
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  ), [tasksByStatus, renderTaskCard]);

  // Memoized render calendar view (simplified)
  const renderCalendarView = useCallback(() => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tasks by Due Date
      </Typography>
      <Grid container spacing={2}>
        {filteredAndSortedTasks.map((task) => {
          const project = projects.find(p => p.id === task.projectId);
          const priority = priorityConfig[task.priority];
          const overdue = isOverdue(task.dueDate, task.status);
          const assignedMember = teamMembers.find(member => member.id === task.assignedTo);

          return (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card
                sx={{
                  borderLeft: `4px solid ${overdue ? '#e74c3c' : priority.color}`,
                  backgroundColor: overdue ? '#fff5f5' : 'white'
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {task.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {project ? project.name : 'Unknown Project'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday fontSize="small" />
                    <Typography variant="body2" color={overdue ? 'error' : 'text.secondary'}>
                      Due: {formatDate(task.dueDate)}
                    </Typography>
                  </Box>
                  {assignedMember && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 20, height: 20, fontSize: 12, bgcolor: assignedMember.roleColor }}>
                        {assignedMember.initials}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {assignedMember.fullName}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  ), [filteredAndSortedTasks, projects, teamMembers, formatDate]);

  if (tasks.length === 0) {
    return (
      <Box>
        <UnifiedHeader
          title="Tasks"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFiltersCount={activeFilters.length}
          onExport={handleExport}
          onAdd={onAddTask}
          addButtonText="Add Task"
          activeFilters={activeFilters}
          onClearFilter={handleClearFilter}
        />
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No tasks added yet. Create a project and add your first task!
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Unified Header */}
      <UnifiedHeader
        title="Tasks"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFiltersCount={activeFilters.length}
        onExport={handleExport}
        onAdd={onAddTask}
        addButtonText="Add Task"
        activeFilters={activeFilters}
        onClearFilter={handleClearFilter}
      />

      {/* Unified Filters */}
      <UnifiedFilters
        show={showFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onApplyQuickFilter={handleApplyQuickFilter}
        filterConfig={filterConfig}
        quickFilters={quickFilters}
      />

      {/* View Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab icon={<ViewList />} label="List" />
          <Tab icon={<ViewModule />} label="Board" />
          <Tab icon={<Today />} label="Calendar" />
        </Tabs>
      </Box>

      {/* Content based on selected tab */}
      {currentTab === 0 && renderListView()}
      {currentTab === 1 && renderBoardView()}
      {currentTab === 2 && renderCalendarView()}
    </Box>
  );
});

export default EnhancedTasksView;