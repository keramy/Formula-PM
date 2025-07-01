import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  LinearProgress, 
  Chip,
  useTheme 
} from '@mui/material';
import {
  MdKeyboardArrowUp as ArrowUp,
  MdBusiness as AccountBalance,
  MdKeyboardArrowUp as Timeline,
  MdAnalytics as Assessment
} from 'react-icons/md';

const FinancialAnalytics = ({ projects = [] }) => {
  const theme = useTheme();

  // Ensure projects is an array
  const safeProjects = Array.isArray(projects) ? projects : [];

  // Calculate financial metrics
  const totalBudget = safeProjects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const activeBudget = safeProjects
    .filter(project => project.status === 'active')
    .reduce((sum, project) => sum + (project.budget || 0), 0);
  const completedBudget = safeProjects
    .filter(project => project.status === 'completed')
    .reduce((sum, project) => sum + (project.budget || 0), 0);
  const onTenderBudget = safeProjects
    .filter(project => project.status === 'on-tender')
    .reduce((sum, project) => sum + (project.budget || 0), 0);

  // Calculate budget utilization (estimated based on progress)
  const estimatedSpent = safeProjects.reduce((sum, project) => {
    const progress = project.progress || 0;
    const budget = project.budget || 0;
    return sum + (budget * (progress / 100));
  }, 0);

  const budgetUtilization = totalBudget > 0 ? (estimatedSpent / totalBudget) * 100 : 0;

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

  // Budget distribution data
  const budgetDistribution = [
    {
      label: 'Active Projects',
      value: activeBudget,
      percentage: totalBudget > 0 ? (activeBudget / totalBudget) * 100 : 0,
      color: '#3498DB',
      count: projects.filter(p => p.status === 'active').length
    },
    {
      label: 'Completed Projects',
      value: completedBudget,
      percentage: totalBudget > 0 ? (completedBudget / totalBudget) * 100 : 0,
      color: '#27AE60',
      count: projects.filter(p => p.status === 'completed').length
    },
    {
      label: 'On Tender',
      value: onTenderBudget,
      percentage: totalBudget > 0 ? (onTenderBudget / totalBudget) * 100 : 0,
      color: '#F39C12',
      count: projects.filter(p => p.status === 'on-tender').length
    }
  ];

  // Project types analysis
  const projectTypes = projects.reduce((acc, project) => {
    const type = project.type || 'Unknown';
    if (!acc[type]) {
      acc[type] = { count: 0, budget: 0 };
    }
    acc[type].count++;
    acc[type].budget += project.budget || 0;
    return acc;
  }, {});

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Budget Utilization Overview */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            height: '300px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Assessment sx={{ color: '#3498DB', mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Budget Utilization
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Estimated Spent
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {budgetUtilization.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={budgetUtilization}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: budgetUtilization > 80 ? '#E74C3C' : '#3498DB',
                  borderRadius: 4
                }
              }}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Total Budget
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(totalBudget)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Estimated Spent
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(estimatedSpent)}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Remaining Budget
            </Typography>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#27AE60' }}>
              {formatCurrency(totalBudget - estimatedSpent)}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Budget Distribution */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            height: '300px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AccountBalance sx={{ color: '#27AE60', mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Budget Distribution
            </Typography>
          </Box>

          {budgetDistribution.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {item.label}
                  </Typography>
                  <Chip 
                    label={item.count} 
                    size="small" 
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(item.value)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: item.color,
                    borderRadius: 3
                  }
                }}
              />
            </Box>
          ))}
        </Paper>
      </Grid>

    </Grid>
  );
};

export default FinancialAnalytics;