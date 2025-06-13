import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  IconButton,
  Button
} from '@mui/material';
import {
  Build,
  Carpenter,
  ElectricalServices,
  Engineering,
  CalendarToday,
  Delete,
  Business
} from '@mui/icons-material';

const projectTypeConfig = {
  'general-contractor': {
    label: 'General Contractor',
    icon: <Build />,
    color: '#e67e22',
    bgColor: '#fef5e7'
  },
  'fit-out': {
    label: 'Fit-out (Legacy)',
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
  'on-tender': {
    label: 'On Tender',
    color: '#3498db',
    bgColor: '#ebf3fd'
  },
  awarded: {
    label: 'Awarded',
    color: '#27ae60',
    bgColor: '#eafaf1'
  },
  'on-hold': {
    label: 'On Hold',
    color: '#f39c12',
    bgColor: '#fef9e7'
  },
  'not-awarded': {
    label: 'Not Awarded',
    color: '#e74c3c',
    bgColor: '#fdedec'
  },
  active: {
    label: 'Active',
    color: '#9b59b6',
    bgColor: '#f4ecf7'
  },
  completed: {
    label: 'Completed',
    color: '#2c3e50',
    bgColor: '#eaeded'
  }
};

function ProjectsList({ projects, tasks, clients = [], onDeleteProject, onManageScope }) {
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

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.companyName : 'No Client Assigned';
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
    // Use the project's actual status from the form
    return project.status || 'on-tender';
  };

  return (
    <Grid container spacing={3}>
      {projects.map((project) => {
        // Safe fallback for type config
        const typeConfig = projectTypeConfig[project.type] || {
          label: 'General Contractor',
          icon: <Build />,
          color: '#e67e22',
          bgColor: '#fef5e7'
        };
        
        const progress = calculateProjectProgress(project.id);
        const stats = getProjectStats(project.id);
        const projectStatus = getProjectStatus(project, stats);
        
        // Safe fallback for status config
        const statusConfig = projectStatusConfig[projectStatus] || {
          label: 'On Tender',
          color: '#3498db',
          bgColor: '#ebf3fd'
        };
        
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
                  <Chip
                    label={statusConfig.label}
                    size="small"
                    sx={{
                      backgroundColor: statusConfig.bgColor,
                      color: statusConfig.color,
                      fontWeight: 'bold'
                    }}
                  />
                  
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

                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  sx={{
                    color: '#3498db',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#2980b9'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onManageScope && onManageScope(project);
                  }}
                >
                  {project.name}
                </Typography>

                {project.clientId && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Business fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Client: {getClientName(project.clientId)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </Typography>
                </Box>


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