import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  ButtonGroup,
  Avatar,
  CircularProgress,
  Grid
} from '@mui/material';
import { format } from 'date-fns';

const ModernProjectOverview = ({ projects, tasks, teamMembers, onViewProject }) => {
  const [filter, setFilter] = useState('All');

  // Calculate project statistics
  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completedTasks = projectTasks.filter(task => task.status === 'completed');
    const progress = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;
    
    return {
      totalTasks: projectTasks.length,
      completedTasks: completedTasks.length,
      progress
    };
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
      case 'completed':
        return { backgroundColor: '#E3F2FD', color: '#1565C0' };
      case 'on hold':
        return { backgroundColor: '#FFF3E0', color: '#F57C00' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#757575' };
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    if (filter === 'All') return true;
    if (filter === 'Active') return project.status === 'active';
    if (filter === 'Completed') return project.status === 'completed';
    return false;
  });

  // Calculate overall progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Project status distribution
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'active').length;
  const onHoldProjects = projects.filter(p => p.status === 'on hold').length;

  return (
    <Grid container spacing={4}>
      {/* Left side - Projects Summary Table */}
      <Grid item xs={12} lg={8}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'white',
            border: '1px solid #E9ECEF',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #E9ECEF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                Projects Summary
              </Typography>
              
              <ButtonGroup size="small" variant="outlined">
                {['All', 'Active', 'Completed'].map((filterOption) => (
                  <Button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    variant={filter === filterOption ? 'contained' : 'outlined'}
                    sx={{
                      backgroundColor: filter === filterOption ? '#E67E22' : 'transparent',
                      borderColor: '#E67E22',
                      color: filter === filterOption ? 'white' : '#E67E22',
                      '&:hover': {
                        backgroundColor: filter === filterOption ? '#D35400' : 'rgba(230, 126, 34, 0.1)'
                      }
                    }}
                  >
                    {filterOption}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#7F8C8D' }}>Project Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#7F8C8D' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#7F8C8D' }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#7F8C8D' }}>Deadline</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#7F8C8D' }}>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map((project) => {
                  const stats = getProjectStats(project.id);
                  return (
                    <TableRow
                      key={project.id}
                      sx={{
                        '&:hover': { backgroundColor: '#F8F9FA' },
                        borderBottom: '1px solid #E9ECEF'
                      }}
                    >
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500, 
                            color: '#3498db',
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                              color: '#2980b9'
                            }
                          }}
                          onClick={() => onViewProject && onViewProject(project)}
                        >
                          {project.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={project.status || 'Active'}
                          size="small"
                          sx={{
                            ...getStatusColor(project.status),
                            fontWeight: 500,
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
                          {project.client || 'Internal Project'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
                          {project.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : 'No deadline'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress
                              variant="determinate"
                              value={stats.progress}
                              size={24}
                              thickness={4}
                              sx={{
                                color: stats.progress === 100 ? '#27AE60' : '#E67E22',
                                '& .MuiCircularProgress-circle': {
                                  strokeLinecap: 'round',
                                },
                              }}
                            />
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography
                                variant="caption"
                                component="div"
                                sx={{ fontSize: '0.6rem', fontWeight: 600 }}
                              >
                                {stats.progress}%
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#7F8C8D' }}>
                            {stats.completedTasks}/{stats.totalTasks} tasks
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* Right side - Overall Progress & Team Performance */}
      <Grid item xs={12} lg={4}>
        <Grid container spacing={3}>
          {/* Overall Progress */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: 'white',
                border: '1px solid #E9ECEF',
                borderRadius: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
                Overall Progress
              </Typography>
              
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={overallProgress}
                  size={120}
                  thickness={6}
                  sx={{
                    color: '#E67E22',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#E67E22' }}>
                    {overallProgress}%
                  </Typography>
                </Box>
              </Box>

              {/* Progress breakdown */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#7F8C8D' }}>Completed</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#27AE60' }}>
                    {Math.round((completedProjects / projects.length) * 100)}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#7F8C8D' }}>In Progress</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#E67E22' }}>
                    {Math.round((inProgressProjects / projects.length) * 100)}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#7F8C8D' }}>On Hold</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F39C12' }}>
                    {Math.round((onHoldProjects / projects.length) * 100)}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Team Performance */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: 'white',
                border: '1px solid #E9ECEF',
                borderRadius: 3
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
                Team Performance
              </Typography>
              
              {teamMembers.slice(0, 3).map((member, index) => {
                const memberTasks = tasks.filter(task => task.assignedTo === member.id);
                const completedMemberTasks = memberTasks.filter(task => task.status === 'completed');
                const memberProgress = memberTasks.length > 0 ? Math.round((completedMemberTasks.length / memberTasks.length) * 100) : 0;
                
                return (
                  <Box key={member.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 2,
                        backgroundColor: '#E67E22',
                        fontSize: '0.8rem'
                      }}
                    >
                      {member.fullName?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#2C3E50' }}>
                        {member.fullName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7F8C8D' }}>
                        {member.role || member.position}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#27AE60' }}>
                      {memberProgress}%
                    </Typography>
                  </Box>
                );
              })}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ModernProjectOverview;