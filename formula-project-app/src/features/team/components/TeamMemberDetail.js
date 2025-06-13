import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Avatar,
  IconButton,
  LinearProgress,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Phone,
  Work,
  CalendarToday,
  Assignment,
  CheckCircle,
  Warning,
  Person,
  TrendingUp,
  Schedule,
  PlayArrow,
  Flag,
  PriorityHigh
} from '@mui/icons-material';

const TeamMemberDetail = ({ 
  member, 
  tasks = [], 
  projects = [], 
  teamMembers = [], 
  onClose 
}) => {
  if (!member) return null;

  // Calculate member stats
  const memberTasks = tasks.filter(task => task.assignedTo === member.id);
  const completedTasks = memberTasks.filter(task => task.status === 'completed');
  const overdueTasks = memberTasks.filter(task => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return task.status !== 'completed' && new Date(task.dueDate) < today;
  });
  
  const memberProjects = projects.filter(project => 
    project.projectManager === member.id || 
    (project.teamMembers && project.teamMembers.includes(member.id))
  );

  const stats = {
    totalTasks: memberTasks.length,
    completedTasks: completedTasks.length,
    overdueTasks: overdueTasks.length,
    activeTasks: memberTasks.filter(task => task.status === 'in-progress' || task.status === 'in_progress').length,
    completionRate: memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0,
    totalProjects: memberProjects.length,
    managedProjects: projects.filter(project => project.projectManager === member.id).length
  };

  const priorityConfig = {
    low: { label: 'Low', color: '#27ae60', bgColor: '#eafaf1', icon: <Flag /> },
    medium: { label: 'Medium', color: '#f39c12', bgColor: '#fef9e7', icon: <Flag /> },
    high: { label: 'High', color: '#e67e22', bgColor: '#fef5e7', icon: <Warning /> },
    urgent: { label: 'Urgent', color: '#e74c3c', bgColor: '#fdf2f2', icon: <PriorityHigh /> }
  };

  const statusConfig = {
    pending: { label: 'Pending', color: '#f39c12', bgColor: '#fef9e7', icon: <Schedule /> },
    'in-progress': { label: 'In Progress', color: '#3498db', bgColor: '#ebf5fb', icon: <PlayArrow /> },
    'in_progress': { label: 'In Progress', color: '#3498db', bgColor: '#ebf5fb', icon: <PlayArrow /> },
    completed: { label: 'Completed', color: '#27ae60', bgColor: '#eafaf1', icon: <CheckCircle /> }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onClose} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#2C3E50' }}>
          Team Member Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Member Info Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #E9ECEF', borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: member.roleColor || '#3498db',
                  fontSize: '2rem',
                  fontWeight: 600,
                  mx: 'auto',
                  mb: 2
                }}
              >
                {member.initials}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {member.fullName}
              </Typography>
              
              <Chip
                label={member.role}
                size="medium"
                sx={{
                  backgroundColor: member.roleColor + '20',
                  color: member.roleColor,
                  fontWeight: 600,
                  mb: 2
                }}
              />

              {/* Contact Info */}
              <Box sx={{ textAlign: 'left', mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2">{member.email}</Typography>
                </Box>
                {member.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{member.phone}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Work fontSize="small" color="action" />
                  <Typography variant="body2">{member.department}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2">
                    Joined: {formatDate(member.joinedAt)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats and Overview */}
        <Grid item xs={12} md={8}>
          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Card elevation={0} sx={{ border: '1px solid #E9ECEF', borderRadius: 2, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#3498db', fontWeight: 600 }}>
                  {stats.totalTasks}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Tasks
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card elevation={0} sx={{ border: '1px solid #E9ECEF', borderRadius: 2, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#27ae60', fontWeight: 600 }}>
                  {stats.completedTasks}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card elevation={0} sx={{ border: '1px solid #E9ECEF', borderRadius: 2, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#e74c3c', fontWeight: 600 }}>
                  {stats.overdueTasks}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Overdue
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card elevation={0} sx={{ border: '1px solid #E9ECEF', borderRadius: 2, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#f39c12', fontWeight: 600 }}>
                  {stats.completionRate}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completion Rate
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Progress Overview */}
          <Card elevation={0} sx={{ border: '1px solid #E9ECEF', borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Performance Overview
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Task Completion</Typography>
                  <Typography variant="body2">{stats.completionRate}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.completionRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stats.completionRate >= 80 ? '#27ae60' : stats.completionRate >= 60 ? '#f39c12' : '#e74c3c'
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                Managing {stats.managedProjects} projects, involved in {stats.totalProjects} total projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Table */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid #E9ECEF', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Assigned Tasks ({memberTasks.length})
              </Typography>
              
              {memberTasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No tasks assigned to this team member
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Project</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberTasks.map((task) => {
                        const priority = priorityConfig[task.priority] || priorityConfig.medium;
                        const status = statusConfig[task.status] || statusConfig.pending;
                        const overdue = isOverdue(task.dueDate, task.status);
                        const daysUntilDue = getDaysUntilDue(task.dueDate);
                        
                        return (
                          <TableRow key={task.id}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {task.name}
                                {overdue && <Warning sx={{ ml: 0.5, color: '#e74c3c', fontSize: 16 }} />}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {getProjectName(task.projectId)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={priority.label}
                                size="small"
                                icon={priority.icon}
                                sx={{
                                  backgroundColor: priority.bgColor,
                                  color: priority.color,
                                  fontWeight: 500,
                                  '& .MuiChip-icon': {
                                    color: priority.color,
                                    fontSize: '14px'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={status.label}
                                size="small"
                                icon={status.icon}
                                sx={{
                                  backgroundColor: status.bgColor,
                                  color: status.color,
                                  fontWeight: 500,
                                  '& .MuiChip-icon': {
                                    color: status.color,
                                    fontSize: '14px'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography 
                                variant="body2" 
                                color={overdue ? 'error' : 'textPrimary'}
                                sx={{ fontWeight: overdue ? 600 : 400 }}
                              >
                                {formatDate(task.dueDate)}
                                {task.status !== 'completed' && (
                                  <Box component="span" sx={{ display: 'block', fontSize: '0.75rem' }}>
                                    {overdue ? (
                                      <span style={{ color: '#e74c3c' }}>
                                        Overdue by {Math.abs(daysUntilDue)} days
                                      </span>
                                    ) : daysUntilDue === 0 ? (
                                      <span style={{ color: '#f39c12' }}>Due today</span>
                                    ) : daysUntilDue === 1 ? (
                                      <span style={{ color: '#e67e22' }}>Due tomorrow</span>
                                    ) : (
                                      <span>{daysUntilDue} days left</span>
                                    )}
                                  </Box>
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={task.progress || 0}
                                  sx={{
                                    flex: 1,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: '#f0f0f0'
                                  }}
                                />
                                <Typography variant="caption" sx={{ minWidth: 30 }}>
                                  {task.progress || 0}%
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Projects List */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid #E9ECEF', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Involved Projects ({memberProjects.length})
              </Typography>
              
              {memberProjects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TrendingUp sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Not involved in any projects
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {memberProjects.map((project) => (
                    <Grid item xs={12} md={6} key={project.id}>
                      <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {project.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                            {project.type}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip
                              label={project.status}
                              size="small"
                              sx={{
                                backgroundColor: project.projectManager === member.id ? '#e3f2fd' : '#f5f5f5',
                                color: project.projectManager === member.id ? '#1976d2' : '#757575',
                                fontWeight: 500
                              }}
                            />
                            {project.projectManager === member.id && (
                              <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                PROJECT MANAGER
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamMemberDetail;