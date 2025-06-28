import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle,
  Trash as Delete,
  User as Person,
  Calendar as CalendarToday,
  Check as Assignment,
  Warning,
  Undo,
  Edit as EditIcon,
  Eye as ViewIcon
} from 'iconoir-react';
import UnifiedHeader from '../../../components/ui/UnifiedHeader';
import UnifiedFilters from '../../../components/ui/UnifiedFilters';
import UnifiedTableView from '../../../components/ui/UnifiedTableView';
import { StatusChip, ActionTooltip, StandardCard, TaskStatusChip, PriorityChip, TaskCard, ActionIconButton, commonTooltips } from '../../../components/ui';
import { exportTasksToExcel } from '../../../services/export/excelExport';
import { 
  getTaskStatusConfig, 
  getPriorityConfig, 
  getTaskStatusOptions, 
  getPriorityOptions,
  normalizeTaskStatus,
  isCompletedStatus 
} from '../../../utils/statusConfig';

// Using centralized configuration - removed duplicate config

function TasksList({ tasks = [], projects = [], teamMembers = [], onUpdateTask, onDeleteTask, onAddTask, onViewTask, onEditTask }) {
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('card');
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
      options: getTaskStatusOptions()
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: getPriorityOptions()
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

  // Quick filters for tasks
  const quickFilters = [
    { key: 'overdue', label: 'Overdue Tasks', filters: { status: '', dueDateTo: new Date() } },
    { key: 'today', label: 'Due Today', filters: { dueDateFrom: new Date(), dueDateTo: new Date() } },
    { key: 'thisWeek', label: 'Due This Week', filters: { dueDateFrom: new Date(), dueDateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } },
    { key: 'urgent', label: 'Urgent Tasks', filters: { priority: 'urgent' } },
    { key: 'completed', label: 'Completed', filters: { status: 'completed' } }
  ];

  // Table columns configuration
  const tableColumns = [
    {
      key: 'name',
      label: 'Task Name',
      sortable: true,
      minWidth: 200
    },
    {
      key: 'project',
      label: 'Project',
      sortable: true,
      render: (value, row) => {
        const project = projects.find(p => p.id === row.projectId);
        return project ? project.name : 'Unknown Project';
      }
    },
    {
      key: 'assignee',
      label: 'Assignee',
      type: 'avatar',
      render: (value, row) => {
        const member = teamMembers.find(tm => tm.id === row.assignedTo);
        if (!member) return { fallback: '?', text: 'Unassigned' };
        return {
          fallback: member.initials,
          bgColor: member.roleColor,
          text: member.fullName
        };
      }
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'chip',
      render: (value) => {
        const config = getPriorityConfig(value);
        return {
          label: config.label,
          color: config.color,
          bgColor: config.bgColor,
          icon: config.icon
        };
      }
    },
    {
      key: 'status',
      label: 'Status',
      type: 'chip',
      render: (value) => {
        const config = getTaskStatusConfig(value);
        return {
          label: config.label,
          color: config.color,
          bgColor: config.bgColor,
          icon: config.icon
        };
      }
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      type: 'date',
      sortable: true
    },
    {
      key: 'progress',
      label: 'Progress',
      type: 'progress',
      render: (value, row) => row.progress || 0
    }
  ];

  // Table actions
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
      key: 'complete',
      label: 'Mark Complete',
      icon: <CheckCircle />,
      disabled: (row) => row?.status === 'completed'
    },
    {
      key: 'delete',
      label: 'Delete Task',
      icon: <Delete />
    }
  ];

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    let filtered = safeTasks.filter(task => {
      // Search filter
      const searchLower = searchValue.toLowerCase();
      const matchesSearch = !searchValue || 
        task.name.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower);

      // Status filter with normalization
      const normalizedTaskStatus = normalizeTaskStatus(task.status);
      const matchesStatus = !filters.status || normalizedTaskStatus === filters.status;

      // Priority filter
      const matchesPriority = !filters.priority || task.priority === filters.priority;

      // Project filter
      const matchesProject = !filters.project || task.projectId === filters.project;

      // Assignee filter
      const matchesAssignee = !filters.assignee || task.assignedTo === filters.assignee;

      // Due date filters
      const taskDueDate = new Date(task.dueDate);
      const matchesDueDateFrom = !filters.dueDateFrom || taskDueDate >= filters.dueDateFrom;
      const matchesDueDateTo = !filters.dueDateTo || taskDueDate <= filters.dueDateTo;

      return matchesSearch && matchesStatus && matchesPriority && 
             matchesProject && matchesAssignee && matchesDueDateFrom && matchesDueDateTo;
    });

    // Sort tasks
    filtered.sort((a, b) => {
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
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'project':
          const projectA = projects.find(p => p.id === a.projectId);
          const projectB = projects.find(p => p.id === b.projectId);
          aValue = projectA ? projectA.name : '';
          bValue = projectB ? projectB.name : '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, searchValue, filters, sortBy, sortDirection, projects]);

  // Get active filters for display
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => {
      if (typeof value === 'string') return value !== '';
      if (value instanceof Date) return true;
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
      } else if (key.includes('Date') && value instanceof Date) {
        displayValue = value.toLocaleDateString();
      }
      
      return { key, label, value: displayValue };
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate, status) => {
    if (isCompletedStatus(status)) return false;
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
  };

  const handleClearFilter = (key) => {
    if (key === 'all') {
      handleClearFilters();
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleApplyQuickFilter = (quickFilter) => {
    setFilters(prev => ({ ...prev, ...quickFilter.filters }));
  };

  const handleSort = (column, direction) => {
    setSortBy(column);
    setSortDirection(direction);
  };

  const handleRowAction = (action, task) => {
    switch (action) {
      case 'view':
        onViewTask && onViewTask(task);
        break;
      case 'edit':
        onEditTask && onEditTask(task);
        break;
      case 'complete':
        onUpdateTask(task.id, { 
          status: 'completed',
          completedAt: new Date().toISOString()
        });
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete "${task.name}"?`)) {
          onDeleteTask(task.id);
        }
        break;
    }
  };

  const handleExport = () => {
    exportTasksToExcel(filteredAndSortedTasks, projects, teamMembers);
  };

  const handleCompleteTask = (taskId) => {
    onUpdateTask(taskId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const handleUndoTask = (taskId) => {
    onUpdateTask(taskId, { 
      status: 'pending',
      completedAt: null
    });
  };

  const handleDeleteTask = (taskId, taskName) => {
    if (window.confirm(`Are you sure you want to delete "${taskName}"?`)) {
      onDeleteTask(taskId);
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
          viewMode={viewMode}
          onViewModeChange={setViewMode}
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
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

      {/* Table View */}
      {viewMode === 'table' && (
        <UnifiedTableView
          data={filteredAndSortedTasks}
          columns={tableColumns}
          onSort={handleSort}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onRowAction={handleRowAction}
          actions={tableActions}
          emptyStateMessage="No tasks match your filters"
          emptyStateIcon={Assignment}
        />
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <Grid container spacing={2}>
          {filteredAndSortedTasks.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No tasks match your filters
                </Typography>
              </Box>
            </Grid>
          ) : (
            filteredAndSortedTasks.map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              const priority = getPriorityConfig(task.priority);
              const status = getTaskStatusConfig(task.status);
              const overdue = isOverdue(task.dueDate, task.status);
              const daysUntilDue = getDaysUntilDue(task.dueDate);
              const assignedMember = teamMembers.find(member => member.id === task.assignedTo);
              
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                  <TaskCard
                    task={task}
                    priority={priority}
                    status={task.status}
                    overdue={overdue}
                    height={320}
                    className={`task-card priority-${task.priority} ${isCompletedStatus(task.status) ? 'status-completed' : ''} ${overdue ? 'status-overdue' : ''}`}
                  >
                    {/* Task Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Typography 
                        variant="h6" 
                        component="h3"
                        sx={{ 
                          textDecoration: isCompletedStatus(task.status) ? 'line-through' : 'none',
                          flex: 1,
                          fontSize: '1rem',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mr: 1
                        }}
                      >
                        {task.name}
                        {overdue && (
                          <Warning sx={{ ml: 0.5, color: '#e74c3c', fontSize: 16 }} />
                        )}
                      </Typography>
                      
                      <PriorityChip priority={task.priority} size="small" />
                    </Box>

                    {/* Project Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Assignment fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Project:</strong> {project ? project.name : 'Unknown Project'}
                      </Typography>
                    </Box>

                    {/* Assigned Member */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ 
                        width: 20, 
                        height: 20, 
                        fontSize: 12, 
                        bgcolor: assignedMember ? assignedMember.roleColor : '#95a5a6' 
                      }}>
                        {assignedMember ? assignedMember.initials : '?'}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Assigned to:</strong> {assignedMember ? assignedMember.fullName : 'Unassigned'}
                      </Typography>
                    </Box>

                    {/* Due Date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography 
                        variant="body2" 
                        color={overdue ? 'error' : 'text.secondary'}
                        sx={{ fontWeight: overdue ? 'bold' : 'normal' }}
                      >
                        <strong>Due:</strong> {formatDate(task.dueDate)}
                        {!isCompletedStatus(task.status) && (
                          <span style={{ marginLeft: 8 }}>
                            {overdue ? (
                              <span style={{ color: '#e74c3c' }}>
                                (Overdue by {Math.abs(daysUntilDue)} days)
                              </span>
                            ) : daysUntilDue === 0 ? (
                              <span style={{ color: '#f39c12' }}>(Due today)</span>
                            ) : daysUntilDue === 1 ? (
                              <span style={{ color: '#e67e22' }}>(Due tomorrow)</span>
                            ) : (
                              <span>({daysUntilDue} days left)</span>
                            )}
                          </span>
                        )}
                      </Typography>
                    </Box>

                    {/* Description */}
                    {task.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <strong>Description:</strong> {task.description}
                      </Typography>
                    )}

                    {/* Status and Progress */}
                    <Box sx={{ mt: 'auto', pt: 1, mb: 2 }}>
                      {isCompletedStatus(task.status) ? (
                        <TaskStatusChip status={task.status} size="small" />
                      ) : (
                        <LinearProgress
                          variant="determinate"
                          value={task.progress || 0}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'grey.200'
                          }}
                        />
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      {isCompletedStatus(task.status) ? (
                        <ActionIconButton
                          tooltip={commonTooltips.undo}
                          icon={<Undo />}
                          color="warning"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUndoTask(task.id);
                          }}
                        />
                      ) : (
                        <ActionIconButton
                          tooltip={commonTooltips.complete}
                          icon={<CheckCircle />}
                          color="success"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteTask(task.id);
                          }}
                        />
                      )}
                      
                      <ActionIconButton
                        tooltip={commonTooltips.delete}
                        icon={<Delete />}
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id, task.name);
                        }}
                      />
                    </Box>
                  </TaskCard>
                </Grid>
              );
            })
          )}
        </Grid>
      )}
    </Box>
  );
}

export default TasksList;