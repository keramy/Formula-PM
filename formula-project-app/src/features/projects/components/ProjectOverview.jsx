import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import {
  ClipboardCheck as TaskIcon,
  User as PersonIcon,
  MoneySquare as MoneyIcon,
  Calendar as TimelineIcon,
  CheckCircle as CheckIcon,
  Clock as PendingIcon,
  Play as InProgressIcon
} from 'iconoir-react';
import { TaskStatusChip, ProjectTypeChip } from '../../../components/ui/StatusChip';

const ProjectOverview = ({ project, tasks = [], teamMembers = [], taskProgress = 0 }) => {
  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  // Get assigned team members
  const assignedMembers = teamMembers.filter(member =>
    tasks.some(task => task.assignedTo === member.id)
  );

  // Get recent tasks
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckIcon sx={{ color: 'var(--success-500)' }} />;
      case 'in-progress':
        return <InProgressIcon sx={{ color: 'var(--warning-500)' }} />;
      default:
        return <PendingIcon sx={{ color: 'var(--construction-500)' }} />;
    }
  };

  const formatProjectType = (type) => {
    if (!type) return 'Millwork Project';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };


  return (
    <Grid container spacing={3}>
      {/* Project Summary */}
      <Grid item xs={12} md={8}>
        <Card className="clean-card">
          <CardContent sx={{ p: 'var(--space-6)' }}>
            <Typography 
              variant="h6" 
              className="text-xl font-semibold text-primary"
              sx={{ mb: 'var(--space-4)' }}
            >
              Project Summary
            </Typography>
            
            <Grid container spacing={3}>
              {/* Timeline */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 'var(--space-4)' }}>
                  <Typography className="text-sm font-medium text-secondary" sx={{ mb: 'var(--space-2)' }}>
                    Timeline
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <Box>
                      <Typography className="text-sm font-semibold">
                        Start Date
                      </Typography>
                      <Typography className="text-sm text-muted">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                      </Typography>
                    </Box>
                    <TimelineIcon 
                      sx={{ 
                        color: 'var(--gray-400)', 
                        fontSize: 'var(--text-base)' 
                      }} 
                    />
                    <Box>
                      <Typography className="text-sm font-semibold">
                        End Date
                      </Typography>
                      <Typography className="text-sm text-muted">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Budget */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 'var(--space-4)' }}>
                  <Typography className="text-sm font-medium text-secondary" sx={{ mb: 'var(--space-2)' }}>
                    Budget Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <MoneyIcon 
                      sx={{ 
                        color: 'var(--construction-500)', 
                        fontSize: 'var(--text-lg)' 
                      }} 
                    />
                    <Box>
                      <Typography className="text-lg font-semibold" sx={{ color: 'var(--construction-600)' }}>
                        {project.budget || 'Not specified'}
                      </Typography>
                      <Typography className="text-sm text-muted">
                        Total Project Budget
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Progress */}
              <Grid item xs={12}>
                <Box>
                  <Typography className="text-sm font-medium text-secondary" sx={{ mb: 'var(--space-2)' }}>
                    Overall Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', mb: 'var(--space-2)' }}>
                    <LinearProgress
                      variant="determinate"
                      value={taskProgress}
                      className="clean-progress-bar"
                      sx={{ flexGrow: 1 }}
                    />
                    <Typography className="text-sm font-semibold" sx={{ color: 'var(--construction-600)' }}>
                      {taskProgress.toFixed(0)}%
                    </Typography>
                  </Box>
                  <Typography className="text-sm text-muted">
                    {taskStats.completed} of {taskStats.total} tasks completed
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="clean-card" sx={{ mt: 'var(--space-4)' }}>
          <CardContent sx={{ p: 'var(--space-6)' }}>
            <Typography 
              className="text-xl font-semibold text-primary"
              sx={{ mb: 'var(--space-4)' }}
            >
              Recent Tasks
            </Typography>
            {recentTasks.length > 0 ? (
              <List dense sx={{ '& .MuiListItem-root': { px: 0, py: 'var(--space-2)' } }}>
                {recentTasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 'var(--space-8)' }}>
                        {getTaskStatusIcon(task.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography className="text-sm font-medium">
                            {task.name}
                          </Typography>
                        }
                        secondary={
                          <Typography className="text-xs text-muted">
                            Assigned to: {teamMembers.find(m => m.id === task.assignedTo)?.fullName || 'Unassigned'}
                          </Typography>
                        }
                      />
                      <Box sx={{ ml: 'var(--space-2)' }}>
                        <TaskStatusChip 
                          status={task.status} 
                          size="small"
                        />
                      </Box>
                    </ListItem>
                    {index < recentTasks.length - 1 && (
                      <Divider sx={{ borderColor: 'var(--gray-100)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography className="text-sm text-muted">
                No tasks created yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Sidebar */}
      <Grid item xs={12} md={4}>
        {/* Enhanced Task & Project Overview */}
        <Card className="clean-card">
          <CardContent sx={{ p: 'var(--space-6)' }}>
            <Typography 
              className="text-xl font-semibold text-primary"
              sx={{ mb: 'var(--space-4)' }}
            >
              Project Overview
            </Typography>
            
            {/* Project Summary Section */}
            <Box sx={{ 
              mb: 'var(--space-6)', 
              p: 'var(--space-4)', 
              bgcolor: 'var(--gray-50)', 
              borderRadius: 2,
              border: '1px solid var(--gray-200)'
            }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography className="text-xs font-medium text-secondary">Budget</Typography>
                  <Typography className="text-base font-semibold" sx={{ color: 'var(--construction-600)' }}>
                    {project.budget || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className="text-xs font-medium text-secondary">Due Date</Typography>
                  <Typography className="text-base font-semibold" sx={{ color: 'var(--warning-500)' }}>
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography className="text-xs font-medium text-secondary" sx={{ mb: 'var(--space-2)' }}>
                    Overall Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <LinearProgress
                      variant="determinate"
                      value={taskProgress}
                      className="clean-progress-bar"
                      sx={{ flexGrow: 1 }}
                    />
                    <Typography className="text-base font-semibold" sx={{ color: 'var(--success-500)' }}>
                      {taskProgress.toFixed(0)}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Task Breakdown */}
            <Typography 
              className="text-base font-semibold text-primary"
              sx={{ mb: 'var(--space-4)' }}
            >
              Task Breakdown
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box className="clean-card-subtle" sx={{ 
                  p: 'var(--space-4)', 
                  textAlign: 'center',
                  border: '1px solid var(--construction-500)',
                  backgroundColor: 'var(--construction-50)'
                }}>
                  <Typography className="text-2xl font-bold" sx={{ color: 'var(--construction-600)' }}>
                    {taskStats.total}
                  </Typography>
                  <Typography className="text-xs text-muted">
                    Total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="clean-card-subtle" sx={{ 
                  p: 'var(--space-4)', 
                  textAlign: 'center',
                  border: '1px solid var(--success-500)',
                  backgroundColor: 'var(--success-50)'
                }}>
                  <Typography className="text-2xl font-bold" sx={{ color: 'var(--success-500)' }}>
                    {taskStats.completed}
                  </Typography>
                  <Typography className="text-xs text-muted">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="clean-card-subtle" sx={{ 
                  p: 'var(--space-4)', 
                  textAlign: 'center',
                  border: '1px solid var(--warning-500)',
                  backgroundColor: 'var(--warning-50)'
                }}>
                  <Typography className="text-2xl font-bold" sx={{ color: 'var(--warning-500)' }}>
                    {taskStats.inProgress}
                  </Typography>
                  <Typography className="text-xs text-muted">
                    In Progress
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="clean-card-subtle" sx={{ 
                  p: 'var(--space-4)', 
                  textAlign: 'center',
                  border: '1px solid var(--gray-400)',
                  backgroundColor: 'var(--gray-50)'
                }}>
                  <Typography className="text-2xl font-bold" sx={{ color: 'var(--gray-600)' }}>
                    {taskStats.pending}
                  </Typography>
                  <Typography className="text-xs text-muted">
                    Pending
                  </Typography>
                </Box>
              </Grid>
            </Grid>

          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="clean-card" sx={{ mt: 'var(--space-4)' }}>
          <CardContent sx={{ p: 'var(--space-6)' }}>
            <Typography 
              className="text-xl font-semibold text-primary"
              sx={{ mb: 'var(--space-4)' }}
            >
              Team Members
            </Typography>
            {assignedMembers.length > 0 ? (
              <List dense sx={{ '& .MuiListItem-root': { px: 0, py: 'var(--space-2)' } }}>
                {assignedMembers.slice(0, 5).map((member, index) => (
                  <React.Fragment key={member.id}>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 'var(--space-8)' }}>
                        <Avatar
                          sx={{ 
                            width: 32, 
                            height: 32,
                            backgroundColor: 'var(--construction-500)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600
                          }}
                          src={member.avatar}
                        >
                          {member.fullName?.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography className="text-sm font-medium">
                            {member.fullName}
                          </Typography>
                        }
                        secondary={
                          <Typography className="text-xs text-muted">
                            {member.role || member.department}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < assignedMembers.length - 1 && (
                      <Divider sx={{ borderColor: 'var(--gray-100)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography className="text-sm text-muted">
                No team members assigned yet.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className="clean-card" sx={{ mt: 'var(--space-4)' }}>
          <CardContent sx={{ p: 'var(--space-6)' }}>
            <Typography 
              className="text-xl font-semibold text-primary"
              sx={{ mb: 'var(--space-4)' }}
            >
              Project Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Box>
                <Typography className="text-sm font-medium text-secondary" sx={{ mb: 'var(--space-2)' }}>
                  Project Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <ProjectTypeChip type={project.type} size="small" />
                </Box>
              </Box>
              <Box>
                <Typography className="text-sm font-medium text-secondary" sx={{ mb: 'var(--space-1)' }}>
                  Created Date
                </Typography>
                <Typography className="text-sm font-medium">
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                </Typography>
              </Box>
              <Box>
                <Typography className="text-sm font-medium text-secondary" sx={{ mb: 'var(--space-1)' }}>
                  Last Updated
                </Typography>
                <Typography className="text-sm font-medium">
                  {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Never'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProjectOverview;