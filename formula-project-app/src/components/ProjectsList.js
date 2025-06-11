import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Grid,
  IconButton
} from '@mui/material';
import {
  Build,
  Carpenter,
  ElectricalServices,
  Engineering,
  Person,
  CalendarToday,
  Delete,
  Business
} from '@mui/icons-material';

const projectTypeConfig = {
  'fit-out': {
    label: 'Fit-out',
    icon: <Build />,
    color: '#e67e22',
    bgColor: '#fef5e7'
  },
  millwork: {
    label: 'Millwork',
    icon: <Carpenter />,
    color: '#8e44ad',
    bgColor: '#f4ecf7'
  },
  electrical: {
    label: 'Electrical',
    icon: <ElectricalServices />,
    color: '#f1c40f',
    bgColor: '#fffbf0'
  },
  mep: {
    label: 'MEP',
    icon: <Engineering />,
    color: '#1abc9c',
    bgColor: '#e8f8f5'
  },
  management: {
    label: 'Management',
    icon: <Business />,
    color: '#37444B',
    bgColor: '#f5f5f5'
  }
};

const projectStatusConfig = {
  active: {
    label: 'Active',
    className: 'in-progress'
  },
  completed: {
    label: 'Completed',
    className: 'completed'
  },
  'on-hold': {
    label: 'On Hold',
    className: 'on-hold'
  },
  cancelled: {
    label: 'Cancelled',
    className: 'cancelled'
  },
  archived: {
    label: 'Archived',
    className: 'cancelled'
  }
};

function ProjectsList({ projects, tasks, onDeleteProject }) {
  if (projects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No projects created yet. Create your first project to get started!
        </Typography>
      </Box>
    );
  }

  const calculateProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    const overdueTasks = projectTasks.filter(task => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return task.status !== 'completed' && new Date(task.dueDate) < today;
    }).length;

    return {
      total: projectTasks.length,
      completed: completedTasks,
      pending: projectTasks.length - completedTasks,
      overdue: overdueTasks
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDeleteProject = (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This will also delete all associated tasks.`)) {
      onDeleteProject(projectId);
    }
  };

  const getProjectStatus = (project, stats) => {
    if (stats.total === 0) return 'active';
    if (stats.completed === stats.total) return 'completed';
    if (stats.overdue > 0) return 'on-hold';
    return project.status || 'active';
  };

  return (
    <Grid container spacing={3}>
      {projects.map((project) => {
        const typeConfig = projectTypeConfig[project.type] || projectTypeConfig.construction;
        const progress = calculateProjectProgress(project.id);
        const stats = getProjectStats(project.id);
        const projectStatus = getProjectStatus(project, stats);
        const statusConfig = projectStatusConfig[projectStatus] || projectStatusConfig.active;
        
        return (
          <Grid item xs={12} md={6} key={project.id}>
            <Card
              className={`project-card construction-card type-${project.type}`}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={() => {}}
            >

              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: typeConfig.color }}>
                      {typeConfig.icon}
                    </Box>
                    <Chip
                      label={typeConfig.label}
                      size="small"
                      sx={{
                        backgroundColor: typeConfig.bgColor,
                        color: typeConfig.color,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  
                  {/* Status Badge */}
                  <span className={`status-badge status-badge-${statusConfig.className}`}>
                    {statusConfig.label}
                  </span>
                  
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id, project.name);
                    }}
                    sx={{ color: '#e74c3c' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="h6" component="h3" gutterBottom>
                  {project.name}
                </Typography>

                {project.client && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Client: {project.client}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </Typography>
                </Box>

                {project.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                )}

                {/* Enhanced Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {progress}%
                    </Typography>
                  </Box>
                  <div className="construction-progress">
                    <div 
                      className="construction-progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </Box>

                {/* Task Statistics with Status Badges */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <span className="status-badge status-badge-todo" style={{ fontSize: '11px', padding: '2px 6px' }}>
                      {stats.total} total
                    </span>
                    <span className="status-badge status-badge-completed" style={{ fontSize: '11px', padding: '2px 6px' }}>
                      {stats.completed} done
                    </span>
                    {stats.overdue > 0 && (
                      <span className="status-badge status-badge-cancelled" style={{ fontSize: '11px', padding: '2px 6px' }}>
                        {stats.overdue} overdue
                      </span>
                    )}
                  </Box>
                </Box>
                
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500 
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default ProjectsList;