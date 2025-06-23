import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckIcon,
  Schedule as PendingIcon,
  PlayArrow as InProgressIcon
} from '@mui/icons-material';

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
        return <CheckIcon sx={{ color: '#4CAF50' }} />;
      case 'in-progress':
        return <InProgressIcon sx={{ color: '#FF9800' }} />;
      default:
        return <PendingIcon sx={{ color: '#2196F3' }} />;
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'pending': return '#2196F3';
      default: return '#757575';
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Project Summary */}
      <Grid item xs={12} md={8}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Project Summary
            </Typography>
            
            <Grid container spacing={3}>
              {/* Timeline */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Timeline
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Start Date
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                      </Typography>
                    </Box>
                    <TimelineIcon color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        End Date
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Budget */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Budget Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon color="action" />
                    <Box>
                      <Typography variant="h6" color="primary">
                        {project.budget || 'Not specified'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Project Budget
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Progress */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Overall Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={taskProgress}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {taskProgress.toFixed(0)}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {taskStats.completed} of {taskStats.total} tasks completed
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card elevation={2} sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Tasks
            </Typography>
            {recentTasks.length > 0 ? (
              <List dense>
                {recentTasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getTaskStatusIcon(task.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={task.name}
                        secondary={`Assigned to: ${teamMembers.find(m => m.id === task.assignedTo)?.fullName || 'Unassigned'}`}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Chip
                          label={task.status}
                          size="small"
                          sx={{
                            backgroundColor: getTaskStatusColor(task.status),
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 18
                          }}
                        />
                      </Box>
                    </ListItem>
                    {index < recentTasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No tasks created yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Sidebar */}
      <Grid item xs={12} md={4}>
        {/* Enhanced Task & Project Overview */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Project Overview
            </Typography>
            
            {/* Project Summary Section */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Budget</Typography>
                  <Typography variant="h6" fontWeight={600} color="info.main">
                    {project.budget || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Due Date</Typography>
                  <Typography variant="h6" fontWeight={600} color="warning.main">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Overall Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={taskProgress}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="h6" fontWeight={600} color="success.main">
                      {taskProgress.toFixed(0)}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Task Breakdown */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
              Task Breakdown
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  bgcolor: 'primary.50'
                }}>
                  <Typography variant="h4" color="primary.main" fontWeight={600}>
                    {taskStats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  border: '2px solid #4CAF50',
                  borderRadius: 2,
                  bgcolor: '#E8F5E8'
                }}>
                  <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                    {taskStats.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  border: '2px solid #FF9800',
                  borderRadius: 2,
                  bgcolor: '#FFF3E0'
                }}>
                  <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 600 }}>
                    {taskStats.inProgress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  border: '2px solid #2196F3',
                  borderRadius: 2,
                  bgcolor: '#E3F2FD'
                }}>
                  <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 600 }}>
                    {taskStats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button size="small" variant="outlined" sx={{ fontSize: '0.75rem' }}>
                  Add Task
                </Button>
                <Button size="small" variant="outlined" sx={{ fontSize: '0.75rem' }}>
                  View Timeline
                </Button>
                <Button size="small" variant="outlined" sx={{ fontSize: '0.75rem' }}>
                  Export Data
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card elevation={2} sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Team Members
            </Typography>
            {assignedMembers.length > 0 ? (
              <List dense>
                {assignedMembers.slice(0, 5).map((member, index) => (
                  <React.Fragment key={member.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{ width: 32, height: 32 }}
                          src={member.avatar}
                        >
                          {member.fullName?.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={member.fullName}
                        secondary={member.role || member.department}
                      />
                    </ListItem>
                    {index < assignedMembers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No team members assigned yet.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card elevation={2} sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Project Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Project Type
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {project.type || 'Millwork Project'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Created Date
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1" fontWeight={500}>
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