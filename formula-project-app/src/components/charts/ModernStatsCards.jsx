import React from 'react';
import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
// Iconoir icons - migrated trending icons
import { ArrowUp as TrendingUp, ArrowDown as TrendingDown } from 'iconoir-react';

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
      subtitle: 'Total project budgets',
      gradient: 'linear-gradient(135deg, rgba(227, 175, 100, 0.2) 0%, rgba(227, 175, 100, 0.1) 100%)',
      color: '#E3AF64' // Caramel Essence
    },
    {
      title: 'Active Project Value',
      value: formatCurrency(activeBudget),
      change: `${activeProjects} active`,
      isPositive: true,
      subtitle: 'Currently in progress',
      gradient: 'linear-gradient(135deg, rgba(81, 106, 200, 0.2) 0%, rgba(81, 106, 200, 0.1) 100%)',
      color: '#516AC8' // Sapphire Dust
    },
    {
      title: 'Revenue Generated',
      value: formatCurrency(completedBudget),
      change: `${avgProgress}% avg progress`,
      isPositive: avgProgress > 50,
      subtitle: 'From completed projects',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
      color: '#10B981' // Success green
    },
    {
      title: 'Task Completion',
      value: `${completionPercentage}%`,
      change: `${completedTasks}/${totalTasks}`,
      isPositive: completionPercentage > 70,
      subtitle: 'Tasks completed',
      gradient: 'linear-gradient(135deg, rgba(38, 66, 139, 0.2) 0%, rgba(38, 66, 139, 0.1) 100%)',
      color: '#26428B' // Blue Oblivion
    },
    {
      title: 'Overall Progress',
      value: `${overallProgress}%`,
      change: `${Math.round((completedProjects / totalProjects) * 100)}% completed`,
      isPositive: overallProgress > 60,
      subtitle: 'Project completion rate',
      gradient: 'linear-gradient(135deg, rgba(15, 25, 57, 0.2) 0%, rgba(15, 25, 57, 0.1) 100%)',
      color: '#0F1939' // Cosmic Odyssey
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
              background: stat.gradient,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 'var(--border-radius-lg, 12px)',
              height: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1))',
              '&:hover': {
                boxShadow: 'var(--shadow-hover, 0 4px 20px rgba(0, 0, 0, 0.15))',
                borderColor: stat.color,
                transform: 'translateY(-2px)'
              }
            }}
            className="card-entrance"
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
                  color: stat.color,
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
                  color: theme.palette.text.secondary,
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
                  color: stat.isPositive ? theme.palette.success.main : theme.palette.error.main
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