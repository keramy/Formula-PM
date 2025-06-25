import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button
} from '@mui/material';
import {
  Settings as Build,
  Tools as Carpenter,
  Flash as ElectricalServices,
  Settings as Engineering,
  Calendar as CalendarToday,
  Trash as Delete,
  Building as Business
} from 'iconoir-react';
import { StatusChip, ActionTooltip, StandardCard, ProjectStatusChip, ProjectTypeChip, ProjectCard, ActionIconButton, commonTooltips } from '../../../components/ui';
import ProjectTeamAvatars from '../../../components/ui/ProjectTeamAvatars';
import { 
  getProjectStatusConfig, 
  getProjectTypeConfig
} from '../../../utils/statusConfig';

// Using centralized configurations

function ProjectsList({ projects, tasks, clients = [], teamMembers = [], onDeleteProject, onManageScope, onViewProject }) {
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
        const typeConfig = getProjectTypeConfig(project.type);
        const progress = calculateProjectProgress(project.id);
        const stats = getProjectStats(project.id);
        const projectStatus = getProjectStatus(project, stats);
        const statusConfig = getProjectStatusConfig(projectStatus);
        
        return (
          <Grid item xs={12} md={6} key={project.id}>
            <ProjectCard
              project={project}
              type={typeConfig}
              status={projectStatus}
              className={`project-card construction-card type-${project.type}`}
              onClick={() => onViewProject && onViewProject(project)}
            >

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: typeConfig.color }}>
                    {typeConfig.icon}
                  </Box>
                  <ProjectTypeChip type={project.type} size="small" />
                </Box>
                
                <ProjectStatusChip status={projectStatus} size="small" />
                
                <ActionIconButton
                  tooltip={commonTooltips.delete}
                  icon={<Delete />}
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id, project.name);
                  }}
                />
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
                    onViewProject && onViewProject(project);
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

                {/* Team Members */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                    Team Members
                  </Typography>
                  <ProjectTeamAvatars
                    teamMembers={teamMembers}
                    projectTeamIds={project.teamMembers || []}
                    maxAvatars={3}
                    size="small"
                    projectName={project.name}
                  />
                </Box>
                
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewProject && onViewProject(project);
                  }}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500 
                  }}
                >
                  View Details
                </Button>
            </ProjectCard>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default ProjectsList;