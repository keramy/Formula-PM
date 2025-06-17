import React, { useState, useMemo } from 'react';
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
  Paper,
  Tab,
  Tabs
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
  DateRange
} from '@mui/icons-material';
import UnifiedHeader from '../../../components/ui/UnifiedHeader';
import UnifiedFilters from '../../../components/ui/UnifiedFilters';
import UnifiedTableView from '../../../components/ui/UnifiedTableView';
import BoardView from '../../../components/views/BoardView';
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
  pending: {
    label: 'To Do',
    color: '#f39c12',
    bgColor: '#fef9e7',
    icon: <Schedule />
  },
  'in-progress': {
    label: 'In Progress',
    color: '#3498db',
    bgColor: '#ebf5fb',
    icon: <PlayArrow />
  },
  'in_progress': {
    label: 'In Progress',
    color: '#3498db',
    bgColor: '#ebf5fb',
    icon: <PlayArrow />
  },
  completed: {
    label: 'Done',
    color: '#27ae60',
    bgColor: '#eafaf1',
    icon: <CheckCircle />
  }
};

// Task view tabs configuration
const taskViewTabs = [
  {
    value: 'list',
    label: 'List',
    icon: <ViewList />
  },
  {
    value: 'board',
    label: 'Board',
    icon: <ViewModule />
  },
  {
    value: 'calendar',
    label: 'Calendar',
    icon: <DateRange />
  }
];

function EnhancedTasksList({ 
  tasks, 
  projects, 
  teamMembers = [], 
  onUpdateTask, 
  onDeleteTask, 
  onAddTask, 
  onViewTask, 
  onEditTask,
  viewMode: propViewMode = 'list',
  onViewModeChange
}) {
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentTab, setCurrentTab] = useState(propViewMode);
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
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Done' }
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
      options: projects.map(project => ({
        value: project.id,
        label: project.name
      }))
    },
    {
      key: 'assignee',
      label: 'Assignee',
      type: 'select',
      options: teamMembers.map(member => ({
        value: member.id,
        label: member.fullName
      }))
    },
    {
      key: 'dueDateFrom',
      label: 'Due Date From',
      type: 'date'
    },
    {
      key: 'dueDateTo',
      label: 'Due Date To',
      type: 'date'
    }
  ];

  // Quick filters
  const quickFilters = [
    { label: 'Overdue', filters: { status: 'overdue' } },
    { label: 'Due Today', filters: { status: 'due-today' } },
    { label: 'This Week', filters: { status: 'this-week' } },
    { label: 'Urgent', filters: { priority: 'urgent' } },
    { label: 'In Progress', filters: { status: 'in-progress' } },
    { label: 'Completed', filters: { status: 'completed' } }
  ];

  // Calculate active filters
  const activeFilters = useMemo(() => {
    const active = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (key === 'project') {
          const project = projects.find(p => p.id === value);
          active.push({ key, label: `Project: ${project?.name || value}` });
        } else if (key === 'assignee') {
          const member = teamMembers.find(m => m.id === value);
          active.push({ key, label: `Assignee: ${member?.fullName || value}` });
        } else {
          active.push({ key, label: `${key}: ${value}` });
        }
      }
    });
    if (searchValue) {
      active.push({ key: 'search', label: `Search: ${searchValue}` });
    }
    return active;
  }, [filters, searchValue, projects, teamMembers]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      // Search filter
      const searchLower = searchValue.toLowerCase();
      const matchesSearch = !searchValue || 
        task.name.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower);

      // Status filter with special handling
      const matchesStatus = !filters.status || 
        task.status === filters.status ||
        (filters.status === 'overdue' && isOverdue(task)) ||
        (filters.status === 'due-today' && isDueToday(task)) ||
        (filters.status === 'this-week' && isDueThisWeek(task));

      // Other filters
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesProject = !filters.project || task.projectId === filters.project;
      const matchesAssignee = !filters.assignee || task.assignedTo === filters.assignee;

      return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'dueDate':
        default:
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, searchValue, filters, sortBy, sortDirection]);

  // Helper functions
  const isOverdue = (task) => {
    if (task.status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  const isDueToday = (task) => {
    if (task.status === 'completed') return false;
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return today.toDateString() === taskDate.toDateString();
  };

  const isDueThisWeek = (task) => {
    if (task.status === 'completed') return false;
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
    const taskDate = new Date(task.dueDate);
    return taskDate >= today && taskDate <= weekFromNow;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
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
    return member ? member.initials : '?';
  };

  const getAssigneeColor = (assigneeId) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.roleColor : '#95A5A6';
  };

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      project: '',
      assignee: '',
      dueDateFrom: null,
      dueDateTo: null
    });
    setSearchValue('');
  };

  const handleClearFilter = (filterKey) => {
    if (filterKey === 'search') {
      setSearchValue('');
    } else {
      setFilters(prev => ({ ...prev, [filterKey]: '' }));
    }
  };

  const handleApplyQuickFilter = (quickFilter) => {
    setFilters(prev => ({ ...prev, ...quickFilter.filters }));
  };

  const handleSort = (column, direction) => {
    setSortBy(column);
    setSortDirection(direction);
  };

  const handleExport = () => {
    exportTasksToExcel(filteredAndSortedTasks, projects, teamMembers);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (onViewModeChange) {
      onViewModeChange(newValue);
    }
  };

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
      }
    });

    return grouped;
  }, [filteredAndSortedTasks]);

  // Table columns for list view
  const tableColumns = [
    {
      key: 'name',
      label: 'Task',
      sortable: true,
      render: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
            {value}
          </Typography>
          {row.description && (
            <Typography variant="caption" color="textSecondary">
              {row.description}
            </Typography>
          )}
        </Box>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'chip',
      render: (value) => {
        const config = priorityConfig[value];
        return {
          label: config?.label || value,
          color: config?.color || '#95A5A6',
          bgColor: config?.bgColor || '#F8F9FA'
        };
      }
    },
    {
      key: 'status',
      label: 'Status',
      type: 'chip',
      render: (value) => {
        const config = statusConfig[value];
        return {
          label: config?.label || value,
          color: config?.color || '#95A5A6',
          bgColor: config?.bgColor || '#F8F9FA'
        };
      }
    },
    {
      key: 'assignedTo',
      label: 'Assignee',
      type: 'avatar',
      render: (value, row) => {
        if (!value) return { text: 'Unassigned', fallback: '?' };
        return {
          fallback: getAssigneeInitials(value),
          bgColor: getAssigneeColor(value),
          text: getAssigneeName(value)
        };
      }
    },
    {
      key: 'projectId',
      label: 'Project',
      render: (value) => getProjectName(value)
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (value, row) => {
        const isTaskOverdue = isOverdue(row);
        return (
          <Typography
            variant="body2"
            sx={{
              color: isTaskOverdue ? '#e74c3c' : 'inherit',
              fontWeight: isTaskOverdue ? 600 : 400
            }}
          >
            {formatDate(value)}
          </Typography>
        );
      }
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress
            variant="determinate"
            value={value || 0}
            sx={{ 
              width: 60, 
              height: 6,
              borderRadius: 3,
              backgroundColor: '#E9ECEF'
            }}
          />
          <Typography variant="caption">
            {value || 0}%
          </Typography>
        </Box>
      )
    }
  ];

  const tableActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: <ViewIcon />
    },
    {
      key: 'edit',
      label: 'Edit Task',
      icon: <EditIcon />
    },
    {
      key: 'delete',
      label: 'Delete Task',
      icon: <Delete />
    }
  ];

  const handleRowAction = (action, task) => {
    switch (action) {
      case 'view':
        onViewTask && onViewTask(task);
        break;
      case 'edit':
        onEditTask && onEditTask(task);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete "${task.name}"?`)) {
          onDeleteTask && onDeleteTask(task.id);
        }
        break;
    }
  };

  // Empty state
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
          viewMode="list"
          onViewModeChange={() => {}}
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
        viewMode="list"
        onViewModeChange={() => {}}
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

      {/* Task View Tabs */}
      <Paper elevation={0} sx={{ borderBottom: '1px solid #E9ECEF', mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            px: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 48,
              display: 'flex',
              flexDirection: 'row',
              gap: 1
            }
          }}
        >
          {taskViewTabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Content based on current tab */}
      {currentTab === 'list' && (
        <Box>
          {/* Completed Tasks Section */}
          {tasksByStatus.completed.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#27ae60' }}>
                ✅ Completed Tasks ({tasksByStatus.completed.length})
              </Typography>
              <Grid container spacing={2}>
                {tasksByStatus.completed.map((task) => (
                  <Grid item xs={12} sm={6} md={4} key={task.id}>
                    <Card
                      elevation={0}
                      sx={{
                        border: '1px solid #E9ECEF',
                        borderRadius: 2,
                        borderLeft: '4px solid #27ae60',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                            {task.name}
                          </Typography>
                          <CheckCircle sx={{ color: '#27ae60', ml: 1 }} />
                        </Box>
                        
                        {task.description && (
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                            {task.description}
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Chip
                            size="small"
                            label={getProjectName(task.projectId)}
                            sx={{ backgroundColor: '#F8F9FA', color: '#7F8C8D' }}
                          />
                          {task.assignedTo && (
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                fontSize: '0.75rem',
                                bgcolor: getAssigneeColor(task.assignedTo)
                              }}
                            >
                              {getAssigneeInitials(task.assignedTo)}
                            </Avatar>
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="textSecondary">
                            Completed: {formatDate(task.completedAt || task.dueDate)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => onViewTask && onViewTask(task)}
                              sx={{ color: '#3498db' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onEditTask && onEditTask(task)}
                              sx={{ color: '#f39c12' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Active Tasks Table */}
          {(tasksByStatus.pending.length > 0 || tasksByStatus['in-progress'].length > 0) && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
                📋 Active Tasks ({tasksByStatus.pending.length + tasksByStatus['in-progress'].length})
              </Typography>
              <UnifiedTableView
                data={[...tasksByStatus.pending, ...tasksByStatus['in-progress']]}
                columns={tableColumns}
                onSort={handleSort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onRowAction={handleRowAction}
                actions={tableActions}
                emptyStateMessage="No active tasks match your filters"
                emptyStateIcon={Assignment}
              />
            </Box>
          )}

          {/* Empty state for no tasks */}
          {filteredAndSortedTasks.length === 0 && (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #E9ECEF' }}>
              <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No tasks match your filters
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Try adjusting your search criteria or filters.
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {currentTab === 'board' && (
        <BoardView
          tasks={filteredAndSortedTasks}
          onTaskUpdate={onUpdateTask}
          teamMembers={teamMembers}
          projects={projects}
        />
      )}

      {currentTab === 'calendar' && (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #E9ECEF' }}>
          <DateRange sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            📅 Calendar View Coming Soon
          </Typography>
          <Typography variant="body2" color="textSecondary">
            We're working on an amazing calendar interface for your tasks.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default EnhancedTasksList;