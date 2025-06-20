import React from 'react';
import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const ModernStatsCards = ({ projects, tasks, teamMembers }) => {
  const theme = useTheme();
  
  // Calculate statistics
  const totalProjects = projects.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const activeProjects = projects.filter(project => project.status === 'active').length;
  
  // Calculate budget statistics
  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const activeBudget = projects
    .filter(project => project.status === 'active')
    .reduce((sum, project) => sum + (project.budget || 0), 0);
  const completedBudget = projects
    .filter(project => project.status === 'completed')
    .reduce((sum, project) => sum + (project.budget || 0), 0);
  
  // Calculate average project progress for active projects
  const activeProjectsProgress = projects
    .filter(project => project.status === 'active')
    .reduce((sum, project) => sum + (project.progress || 0), 0);
  const avgProgress = activeProjects > 0 ? Math.round(activeProjectsProgress / activeProjects) : 0;

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate overall progress
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Project status distribution
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'active').length;

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `₺${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₺${(amount / 1000).toFixed(0)}K`;
    } else {
      return `₺${amount.toLocaleString()}`;
    }
  };

  const statsData = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(totalBudget),
      change: `${totalProjects} projects`,
      isPositive: true,
      subtitle: 'Total project budgets'
    },
    {
      title: 'Active Project Value',
      value: formatCurrency(activeBudget),
      change: `${activeProjects} active`,
      isPositive: true,
      subtitle: 'Currently in progress'
    },
    {
      title: 'Revenue Generated',
      value: formatCurrency(completedBudget),
      change: `${avgProgress}% avg progress`,
      isPositive: avgProgress > 50,
      subtitle: 'From completed projects'
    },
    {
      title: 'Task Completion',
      value: `${completionPercentage}%`,
      change: `${completedTasks}/${totalTasks}`,
      isPositive: completionPercentage > 70,
      subtitle: 'Tasks completed'
    },
    {
      title: 'Overall Progress',
      value: `${overallProgress}%`,
      change: `${Math.round((completedProjects / totalProjects) * 100)}% completed`,
      isPositive: overallProgress > 60,
      subtitle: 'Project completion rate'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={2.4} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              height: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            {/* Header */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
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
                  color: theme.palette.text.primary,
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