import React from 'react';
import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
// Iconoir icons - migrated trending icons
import {
  MdKeyboardArrowUp as ArrowUp,
  MdKeyboardArrowDown as TrendingDown
} from 'react-icons/md';

const ModernStatsCards = ({ projects = [], tasks = [], teamMembers = [] }) => {
  const theme = useTheme();
  
  // Ensure all props are arrays
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
  
  // Formula PM Color Palette
  const colors = {
    caramelEssence: '#E3AF64',
    sapphireDust: '#516AC8',
    cosmicOdyssey: '#0F1939',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  };

  // Calculate statistics
  const totalProjects = safeProjects.length;
  const completedTasks = safeTasks.filter(task => task.status === 'completed').length;
  const totalTasks = safeTasks.length;
  const activeProjects = safeProjects.filter(project => project.status === 'active').length;
  const completedProjects = safeProjects.filter(project => project.status === 'completed').length;
  const onHoldProjects = safeProjects.filter(project => project.status === 'on hold').length;
  
  // Calculate budget statistics
  const totalBudget = safeProjects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const activeBudget = safeProjects
    .filter(project => project.status === 'active')
    .reduce((sum, project) => sum + (project.budget || 0), 0);
  const completedBudget = safeProjects
    .filter(project => project.status === 'completed')
    .reduce((sum, project) => sum + (project.budget || 0), 0);

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

  // Prepare chart data
  const projectStatusData = [
    { name: 'Active', value: activeProjects, color: colors.sapphireDust },
    { name: 'Completed', value: completedProjects, color: colors.success },
    { name: 'On Hold', value: onHoldProjects, color: colors.warning }
  ].filter(item => item.value > 0);

  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: colors.success },
    { name: 'Pending', value: totalTasks - completedTasks, color: colors.caramelEssence }
  ].filter(item => item.value > 0);

  const budgetDistributionData = [
    { name: 'Active Projects', value: activeBudget, color: colors.sapphireDust },
    { name: 'Completed Projects', value: completedBudget, color: colors.success },
    { name: 'Other', value: totalBudget - activeBudget - completedBudget, color: colors.cosmicOdyssey }
  ].filter(item => item.value > 0);

  const teamDistributionData = [
    { name: 'Team Members', value: safeTeamMembers.length, color: colors.caramelEssence },
    { name: 'Projects', value: totalProjects, color: colors.sapphireDust }
  ].filter(item => item.value > 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: 2,
            p: 1.5,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: data.payload.color }}>
            {data.payload.name}: {data.value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const chartCards = [
    {
      title: 'Project Status Distribution',
      subtitle: `${totalProjects} total projects`,
      data: projectStatusData,
      centerText: totalProjects,
      centerLabel: 'Projects'
    },
    {
      title: 'Task Completion Progress',
      subtitle: `${Math.round((completedTasks / totalTasks) * 100)}% completion rate`,
      data: taskStatusData,
      centerText: `${Math.round((completedTasks / totalTasks) * 100)}%`,
      centerLabel: 'Complete'
    },
    {
      title: 'Budget Distribution',
      subtitle: `${formatCurrency(totalBudget)} total value`,
      data: budgetDistributionData,
      centerText: formatCurrency(totalBudget),
      centerLabel: 'Total'
    },
    {
      title: 'Team & Project Overview',
      subtitle: `${safeTeamMembers.length} team members`,
      data: teamDistributionData,
      centerText: safeTeamMembers.length,
      centerLabel: 'Members'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {chartCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 3,
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                borderColor: colors.caramelEssence,
                transform: 'translateY(-2px)'
              }
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: colors.cosmicOdyssey,
                  mb: 0.5
                }}
              >
                {card.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.85rem'
                }}
              >
                {card.subtitle}
              </Typography>
            </Box>

            {/* Chart Container */}
            <Box sx={{ flex: 1, position: 'relative' }}>
              {card.data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={card.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {card.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: '12px',
                        paddingTop: '10px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: theme.palette.text.secondary
                  }}
                >
                  <Typography variant="body2">No data available</Typography>
                </Box>
              )}
              
              {/* Center Text Overlay */}
              {card.data.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: colors.cosmicOdyssey,
                      lineHeight: 1
                    }}
                  >
                    {card.centerText}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      color: theme.palette.text.secondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {card.centerLabel}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ModernStatsCards;