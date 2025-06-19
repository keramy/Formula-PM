import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Paper,
  Divider,
  Tabs,
  Tab,
  Button,
  ButtonGroup,
  Badge,
  Tooltip
} from '@mui/material';
import { 
  Assignment, 
  CheckCircle,
  Flag,
  Warning,
  PriorityHigh,
  Schedule,
  PlayArrow,
  Visibility as ViewIcon,
  Edit as EditIcon,
  DoneAll as CompleteIcon,
  Pause as PauseIcon,
  FolderOpen as ProjectIcon,
  Today as TodayIcon,
  Error as OverdueIcon
} from '@mui/icons-material';
import UnifiedHeader from '../../../components/ui/UnifiedHeader';
import UnifiedFilters from '../../../components/ui/UnifiedFilters';
import ProjectsList from './ProjectsList';
import ProjectsTableView from './ProjectsTableView';

const MyProjectsList = ({ 
  projects, 
  tasks, 
  clients = [], 
  teamMembers = [],
  onDeleteProject,
  onEditProject,
  onViewProject,
  onManageScope,
  onViewTask,
  onEditTask,
  onUpdateTask,
  currentUserId = 1008 // Default to a specific user ID
}) => {
  const [activeTab, setActiveTab] = useState(0); // 0: My Tasks, 1: My Projects
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    client: '',
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null,
    budgetFrom: '',
    budgetTo: ''
  });

  // Filter projects to only show user's projects
  const myProjects = projects.filter(p => p.projectManager === currentUserId);
  
  // Filter tasks assigned to the current user
  const myTasks = tasks.filter(t => t.assignedTo === currentUserId);

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'on-tender', label: 'On Tender' },
        { value: 'awarded', label: 'Awarded' },
        { value: 'on-hold', label: 'On Hold' },
        { value: 'not-awarded', label: 'Not Awarded' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' }
      ]
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { value: 'general-contractor', label: 'General Contractor' },
        { value: 'millwork', label: 'Millwork' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'mep', label: 'MEP' },
        { value: 'management', label: 'Management' }
      ]
    },
    {
      key: 'client',
      label: 'Client',
      type: 'select',
      options: clients.map(c => ({ value: c.id, label: c.companyName }))
    },
    {
      key: 'startDateFrom',
      label: 'Start Date From',
      type: 'date'
    },
    {
      key: 'startDateTo',
      label: 'Start Date To',
      type: 'date'
    },
    {
      key: 'endDateFrom',
      label: 'End Date From',
      type: 'date'
    },
    {
      key: 'endDateTo',
      label: 'End Date To',
      type: 'date'
    },
    {
      key: 'budgetFrom',
      label: 'Budget From',
      type: 'number',
      placeholder: 'Min budget'
    },
    {
      key: 'budgetTo',
      label: 'Budget To',
      type: 'number',
      placeholder: 'Max budget'
    }
  ];

  // Quick filters
  const quickFilters = [
    {
      label: 'Active Projects',
      filters: { status: 'active' }
    },
    {
      label: 'On Tender',
      filters: { status: 'on-tender' }
    },
    {
      label: 'This Month',
      filters: {
        startDateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        startDateTo: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      }
    },
    {
      label: 'Overdue',
      filters: {} // Will implement custom logic
    }
  ];

  // Filtered and sorted projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = myProjects.filter(project => {
      // Search filter
      const searchLower = searchValue.toLowerCase();
      const matchesSearch = !searchValue || 
        project.name.toLowerCase().includes(searchLower) ||
        (project.description && project.description.toLowerCase().includes(searchLower));

      // Basic filters
      const matchesStatus = !filters.status || project.status === filters.status;
      const matchesType = !filters.type || project.type === filters.type;
      const matchesClient = !filters.client || project.clientId === parseInt(filters.client);

      // Date range filters
      const projectStartDate = project.startDate ? new Date(project.startDate) : null;
      const projectEndDate = project.endDate ? new Date(project.endDate) : null;
      
      const matchesStartDateFrom = !filters.startDateFrom || 
        (projectStartDate && projectStartDate >= filters.startDateFrom);
      const matchesStartDateTo = !filters.startDateTo || 
        (projectStartDate && projectStartDate <= filters.startDateTo);
      const matchesEndDateFrom = !filters.endDateFrom || 
        (projectEndDate && projectEndDate >= filters.endDateFrom);
      const matchesEndDateTo = !filters.endDateTo || 
        (projectEndDate && projectEndDate <= filters.endDateTo);

      // Budget range filters
      const projectBudget = project.budget ? parseFloat(project.budget) : 0;
      const matchesBudgetFrom = !filters.budgetFrom || 
        projectBudget >= parseFloat(filters.budgetFrom);
      const matchesBudgetTo = !filters.budgetTo || 
        projectBudget <= parseFloat(filters.budgetTo);

      return matchesSearch && 
             matchesStatus && 
             matchesType && 
             matchesClient && 
             matchesStartDateFrom &&
             matchesStartDateTo &&
             matchesEndDateFrom &&
             matchesEndDateTo &&
             matchesBudgetFrom &&
             matchesBudgetTo;
    });

    return filtered;
  }, [myProjects, searchValue, filters]);

  // Get active filters for display
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => {
      if (typeof value === 'string') return value !== '';
      if (value instanceof Date) return true;
      return value !== null && value !== undefined;
    })
    .map(([key, value]) => ({
      key,
      label: filterConfig.find(f => f.key === key)?.label || key,
      value: value instanceof Date ? value.toLocaleDateString() : value
    }));

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      type: '',
      client: '',
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null,
      budgetFrom: '',
      budgetTo: ''
    });
  };

  const handleClearFilter = (key) => {
    if (key === 'all') {
      handleClearFilters();
    } else if (key.includes('Date')) {
      setFilters(prev => ({ ...prev, [key]: null }));
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleApplyQuickFilter = (quickFilter) => {
    setFilters(prev => ({ ...prev, ...quickFilter.filters }));
  };

  const handleExport = () => {
    // Implement export functionality if needed
    console.log('Export my projects:', filteredAndSortedProjects);
  };

  // Task helper functions
  const priorityConfig = {
    low: { label: 'Low', color: '#27ae60', bgColor: '#eafaf1', icon: <Flag /> },
    medium: { label: 'Medium', color: '#f39c12', bgColor: '#fef9e7', icon: <Flag /> },
    high: { label: 'High', color: '#e67e22', bgColor: '#fef5e7', icon: <Warning /> },
    urgent: { label: 'Urgent', color: '#e74c3c', bgColor: '#fdf2f2', icon: <PriorityHigh /> }
  };

  const statusConfig = {
    pending: { label: 'To Do', color: '#f39c12', bgColor: '#fef9e7', icon: <Schedule /> },
    'in-progress': { label: 'In Progress', color: '#3498db', bgColor: '#ebf5fb', icon: <PlayArrow /> },
    'in_progress': { label: 'In Progress', color: '#3498db', bgColor: '#ebf5fb', icon: <PlayArrow /> },
    completed: { label: 'Done', color: '#27ae60', bgColor: '#eafaf1', icon: <CheckCircle /> }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
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
    if (task.status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  const isDueSoon = (task) => {
    if (task.status === 'completed') return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };

  // Enhanced task statistics
  const getTaskStats = () => {
    const total = myTasks.length;
    const completed = myTasks.filter(t => t.status === 'completed').length;
    const inProgress = myTasks.filter(t => t.status === 'in-progress' || t.status === 'in_progress').length;
    const pending = myTasks.filter(t => t.status === 'pending').length;
    const overdue = myTasks.filter(t => isOverdue(t)).length;
    const dueSoon = myTasks.filter(t => isDueSoon(t)).length;
    
    return { total, completed, inProgress, pending, overdue, dueSoon };
  };

  const taskStats = getTaskStats();

  // Quick task status update
  const handleQuickStatusChange = async (taskId, newStatus) => {
    if (onUpdateTask) {
      await onUpdateTask(taskId, { status: newStatus });
    }
  };

  if (myProjects.length === 0 && myTasks.length === 0) {
    return (
      <Box>
        <UnifiedHeader
          title="My Work"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFiltersCount={activeFilters.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={handleExport}
          showAdd={false} // No add button for My Work
          activeFilters={activeFilters}
          onClearFilter={handleClearFilter}
        />
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No projects or tasks assigned to you yet.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Modern Header with Statistics */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'white',
          border: '1px solid #E9ECEF',
          borderRadius: 3,
          mb: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#2C3E50', mb: 1 }}>
                My Work
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overview of your assigned projects and tasks
              </Typography>
            </Box>
            
            {/* Quick Stats */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#3498db' }}>
                  {myProjects.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Projects
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#27ae60' }}>
                  {taskStats.completed}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Completed
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: taskStats.overdue > 0 ? '#e74c3c' : '#f39c12' }}>
                  {taskStats.overdue || taskStats.pending}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {taskStats.overdue > 0 ? 'Overdue' : 'Pending'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Tab Navigation */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem'
              }
            }}
          >
            <Tab
              icon={<Badge badgeContent={taskStats.overdue} color="error" invisible={taskStats.overdue === 0}>
                <Assignment />
              </Badge>}
              label="My Tasks"
              iconPosition="start"
              sx={{ mr: 2 }}
            />
            <Tab
              icon={<ProjectIcon />}
              label="My Projects"
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Paper>

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

      {/* Tab Content */}
      {activeTab === 0 && (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'white',
            border: '1px solid #E9ECEF',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Task Statistics Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #E9ECEF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                My Tasks ({myTasks.length})
              </Typography>
              
              {/* Task Quick Stats */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {taskStats.overdue > 0 && (
                  <Chip
                    icon={<OverdueIcon />}
                    label={`${taskStats.overdue} Overdue`}
                    size="small"
                    sx={{ backgroundColor: '#fdf2f2', color: '#e74c3c', fontWeight: 600 }}
                  />
                )}
                {taskStats.dueSoon > 0 && (
                  <Chip
                    icon={<TodayIcon />}
                    label={`${taskStats.dueSoon} Due Soon`}
                    size="small"
                    sx={{ backgroundColor: '#fef9e7', color: '#f39c12', fontWeight: 600 }}
                  />
                )}
                <Chip
                  icon={<CheckCircle />}
                  label={`${taskStats.completed} Completed`}
                  size="small"
                  sx={{ backgroundColor: '#eafaf1', color: '#27ae60', fontWeight: 600 }}
                />
              </Box>
            </Box>
          </Box>

          {/* Tasks Content */}
          <Box sx={{ p: 3 }}>
            {myTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tasks assigned
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You don't have any tasks assigned to you yet.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {myTasks.map((task) => {
                  const priority = priorityConfig[task.priority] || priorityConfig.medium;
                  const status = statusConfig[task.status] || statusConfig.pending;
                  const taskOverdue = isOverdue(task);
                  const taskDueSoon = isDueSoon(task);
                  
                  return (
                    <Grid item xs={12} sm={6} lg={4} key={task.id}>
                      <Card
                        elevation={0}
                        sx={{
                          border: '1px solid #E9ECEF',
                          borderRadius: 3,
                          borderLeft: `4px solid ${taskOverdue ? '#e74c3c' : priority.color}`,
                          '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease',
                          position: 'relative'
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {/* Task Header */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, color: '#2C3E50' }}>
                              {task.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={status.label}
                              sx={{
                                backgroundColor: status.bgColor,
                                color: status.color,
                                fontWeight: 600,
                                ml: 1
                              }}
                            />
                          </Box>
                          
                          {/* Description */}
                          {task.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                              {task.description}
                            </Typography>
                          )}
                          
                          {/* Project and Priority */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Chip
                              icon={<ProjectIcon />}
                              size="small"
                              label={getProjectName(task.projectId)}
                              sx={{ backgroundColor: '#F8F9FA', color: '#7F8C8D' }}
                            />
                            <Chip
                              size="small"
                              label={priority.label}
                              sx={{
                                backgroundColor: priority.bgColor,
                                color: priority.color,
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          
                          {/* Due Date */}
                          <Box sx={{ mb: 2 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: taskOverdue ? '#e74c3c' : taskDueSoon ? '#f39c12' : 'text.secondary',
                                fontWeight: taskOverdue || taskDueSoon ? 600 : 400,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <Schedule fontSize="small" />
                              Due: {formatDate(task.dueDate)}
                              {taskOverdue && ' (Overdue)'}
                              {taskDueSoon && !taskOverdue && ' (Due Soon)'}
                            </Typography>
                          </Box>
                          
                          {/* Progress Bar */}
                          {task.progress !== undefined && (
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Progress
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  {task.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={task.progress}
                                sx={{ 
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#E9ECEF',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: task.progress === 100 ? '#27ae60' : '#3498db',
                                    borderRadius: 4
                                  }
                                }}
                              />
                            </Box>
                          )}
                          
                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => onViewTask && onViewTask(task)}
                                  sx={{ color: '#3498db' }}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Task">
                                <IconButton
                                  size="small"
                                  onClick={() => onEditTask && onEditTask(task)}
                                  sx={{ color: '#f39c12' }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            
                            {/* Quick Actions */}
                            <ButtonGroup size="small" variant="outlined">
                              {task.status !== 'completed' && (
                                <Button
                                  onClick={() => handleQuickStatusChange(task.id, 'completed')}
                                  sx={{ color: '#27ae60', borderColor: '#27ae60', minWidth: 'auto', px: 1 }}
                                >
                                  <CompleteIcon fontSize="small" />
                                </Button>
                              )}
                              {task.status !== 'in-progress' && task.status !== 'completed' && (
                                <Button
                                  onClick={() => handleQuickStatusChange(task.id, 'in-progress')}
                                  sx={{ color: '#3498db', borderColor: '#3498db', minWidth: 'auto', px: 1 }}
                                >
                                  <PlayArrow fontSize="small" />
                                </Button>
                              )}
                            </ButtonGroup>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Paper>
      )}

      {/* My Projects Tab */}
      {activeTab === 1 && (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'white',
            border: '1px solid #E9ECEF',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid #E9ECEF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                My Projects ({filteredAndSortedProjects.length})
              </Typography>
              
              {/* View Mode Toggle */}
              <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Button
                  size="small"
                  onClick={() => setViewMode('card')}
                  variant={viewMode === 'card' ? 'contained' : 'outlined'}
                  sx={{ borderRadius: '4px 0 0 4px', minWidth: 'auto', px: 2 }}
                >
                  Cards
                </Button>
                <Button
                  size="small"
                  onClick={() => setViewMode('table')}
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  sx={{ borderRadius: '0 4px 4px 0', minWidth: 'auto', px: 2 }}
                >
                  Table
                </Button>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            {myProjects.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ProjectIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No projects assigned
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You are not currently assigned as a project manager for any projects.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Projects Table View */}
                {viewMode === 'table' && (
                  <ProjectsTableView
                    projects={filteredAndSortedProjects}
                    clients={clients}
                    teamMembers={teamMembers}
                    onEditProject={onEditProject}
                    onDeleteProject={onDeleteProject}
                    onViewProject={onViewProject}
                    onManageScope={onManageScope}
                  />
                )}

                {/* Projects Card View */}
                {viewMode === 'card' && (
                  <ProjectsList 
                    projects={filteredAndSortedProjects}
                    tasks={tasks}
                    clients={clients}
                    onDeleteProject={onDeleteProject}
                    onManageScope={onManageScope}
                    onViewProject={onViewProject}
                  />
                )}
              </>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MyProjectsList;