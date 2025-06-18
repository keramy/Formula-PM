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
  LinearProgress
} from '@mui/material';
import { format } from 'date-fns';

const ModernProjectOverview = ({ projects, tasks, teamMembers, onViewProject }) => {
  const [filter, setFilter] = useState('All');

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Not set';
    if (amount >= 1000000) {
      return `₺${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₺${(amount / 1000).toFixed(0)}K`;
    } else {
      return `₺${amount.toLocaleString()}`;
    }
  };

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


  return (
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
              <TableCell sx={{ fontWeight: 600, color: '#7F8C8D' }}>Budget</TableCell>
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
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: project.budget ? '#2C3E50' : '#95A5A6',
                        fontWeight: project.budget ? 600 : 400
                      }}
                    >
                      {formatCurrency(project.budget)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
                      {project.clientName || project.client || 'Internal Project'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
                      {project.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : 'No deadline'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                      <Box sx={{ width: '70%' }}>
                        <LinearProgress
                          variant="determinate"
                          value={stats.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: stats.progress === 100 ? '#27AE60' : '#E67E22',
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#2C3E50', 
                          minWidth: '35px' 
                        }}
                      >
                        {stats.progress}%
                      </Typography>
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#7F8C8D', 
                        fontSize: '0.7rem',
                        display: 'block',
                        mt: 0.5
                      }}
                    >
                      {stats.completedTasks}/{stats.totalTasks} tasks
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ModernProjectOverview;