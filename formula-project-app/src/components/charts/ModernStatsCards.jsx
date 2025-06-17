import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const ModernStatsCards = ({ projects, tasks, teamMembers }) => {
  // Calculate statistics
  const totalProjects = projects.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const activeProjects = projects.filter(project => project.status === 'active').length;
  
  // Calculate total estimated hours (mock calculation)
  const totalHours = tasks.reduce((sum, task) => {
    return sum + (task.estimatedHours || 8); // Default 8 hours if not specified
  }, 0);

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statsData = [
    {
      title: 'Total Revenue',
      value: '$2.5M',
      change: '+10%',
      isPositive: true,
      subtitle: 'From completed projects'
    },
    {
      title: 'Active Projects',
      value: activeProjects.toString(),
      change: '+5%',
      isPositive: true,
      subtitle: 'Currently in progress'
    },
    {
      title: 'Time Spent',
      value: `${totalHours}h`,
      change: '-2%',
      isPositive: false,
      subtitle: 'Total estimated hours'
    },
    {
      title: 'Completion Rate',
      value: `${completionPercentage}%`,
      change: `${completedTasks}/${totalTasks}`,
      isPositive: completionPercentage > 70,
      subtitle: 'Tasks completed'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: 'white',
              border: '1px solid #E9ECEF',
              borderRadius: 3,
              height: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {/* Header */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#7F8C8D',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  mb: 1
                }}
              >
                {stat.title}
              </Typography>
              
              <Typography
                variant="h4"
                sx={{
                  color: '#2C3E50',
                  fontWeight: 700,
                  fontSize: '1.8rem',
                  mb: 0.5
                }}
              >
                {stat.value}
              </Typography>
            </Box>

            {/* Footer with change indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#95A5A6',
                  fontSize: '0.75rem'
                }}
              >
                {stat.subtitle}
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: stat.isPositive ? '#27AE60' : '#E74C3C'
                }}
              >
                {stat.isPositive ? (
                  <TrendingUp sx={{ fontSize: 16 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16 }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  }}
                >
                  {stat.change}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ModernStatsCards;