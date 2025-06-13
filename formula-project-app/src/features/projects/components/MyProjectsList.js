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
  Divider
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
  Edit as EditIcon
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
      {/* Unified Header */}
      <UnifiedHeader
        title={`My Work`}
        subtitle={`${filteredAndSortedProjects.length} projects • ${myTasks.length} tasks`}
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

      {/* My Tasks Section */}
      {myTasks.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
            📋 My Tasks ({myTasks.length})
          </Typography>
          <Grid container spacing={2}>
            {myTasks.slice(0, 6).map((task) => {
              const priority = priorityConfig[task.priority] || priorityConfig.medium;
              const status = statusConfig[task.status] || statusConfig.pending;
              const taskOverdue = isOverdue(task);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={task.id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid #E9ECEF',
                      borderRadius: 2,
                      borderLeft: `4px solid ${priority.color}`,
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
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: taskOverdue ? '#e74c3c' : 'text.secondary',
                            fontWeight: taskOverdue ? 600 : 400
                          }}
                        >
                          Due: {formatDate(task.dueDate)}
                          {taskOverdue && ' (Overdue)'}
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
                      
                      {task.progress !== undefined && task.progress > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={task.progress}
                            sx={{ 
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#E9ECEF'
                            }}
                          />
                          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                            {task.progress}% complete
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          {myTasks.length > 6 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Showing 6 of {myTasks.length} tasks. View all tasks in the Tasks section.
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* My Projects Section */}
      {myProjects.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
            🎯 My Projects ({filteredAndSortedProjects.length})
          </Typography>

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
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MyProjectsList;