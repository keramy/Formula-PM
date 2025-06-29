import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  LinearProgress,
  Grid,
  Chip,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  ArrowUp,
  Check,
  CheckCircle,
  Calendar
} from 'iconoir-react';

const TeamPerformance = ({ teamMembers = [], tasks = [], projects = [] }) => {
  const theme = useTheme();

  // Ensure all props are arrays
  const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  // Calculate team performance metrics
  const getTeamMemberStats = (memberId) => {
    const memberTasks = safeTasks.filter(task => task.assignedTo === memberId);
    const completedTasks = memberTasks.filter(task => task.status === 'completed');
    const activeTasks = memberTasks.filter(task => task.status === 'active' || task.status === 'in-progress');
    const overdueTasks = memberTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status !== 'completed';
    });

    const memberProjects = safeProjects.filter(project => 
      project.teamMembers && project.teamMembers.includes(memberId)
    );

    const completionRate = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0;
    
    return {
      totalTasks: memberTasks.length,
      completedTasks: completedTasks.length,
      activeTasks: activeTasks.length,
      overdueTasks: overdueTasks.length,
      totalProjects: memberProjects.length,
      completionRate,
      productivity: completionRate > 80 ? 'High' : completionRate > 60 ? 'Medium' : 'Low'
    };
  };

  // Get productivity color
  const getProductivityPalette = (productivity) => {
    switch (productivity) {
      case 'High':
        return '#27AE60';
      case 'Medium':
        return '#F39C12';
      case 'Low':
        return '#E74C3C';
      default:
        return '#95A5A6';
    }
  };

  // Calculate team summary stats
  const teamStats = {
    totalMembers: safeTeamMembers.length,
    totalTasks: safeTasks.length,
    completedTasks: safeTasks.filter(task => task.status === 'completed').length,
    averageCompletion: safeTeamMembers.length > 0 ? 
      Math.round(safeTeamMembers.reduce((sum, member) => 
        sum + getTeamMemberStats(member.id).completionRate, 0) / safeTeamMembers.length) : 0
  };

  return (
    <Box>
      {/* Team Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Check sx={{ fontSize: 40, color: '#3498DB', mb: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                {teamStats.totalTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: '#27AE60', mb: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                {teamStats.completedTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ArrowUp sx={{ fontSize: 40, color: '#E67E22', mb: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                {teamStats.averageCompletion}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Completion
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Calendar sx={{ fontSize: 40, color: '#9B59B6', mb: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                {teamMembers.filter(member => getTeamMemberStats(member.id).productivity === 'High').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Performers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Individual Performance */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundPalette: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2C3E50' }}>
          Individual Performance
        </Typography>

        <Grid container spacing={3}>
          {safeTeamMembers.map((member) => {
            const stats = getTeamMemberStats(member.id);
            return (
              <Grid item xs={12} md={6} lg={4} key={member.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {/* Member Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        mr: 2,
                        backgroundPalette: '#E67E22',
                        fontSize: '1.2rem'
                      }}
                    >
                      {member.fullName?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                        {member.fullName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
                        {member.role || member.position}
                      </Typography>
                    </Box>
                    <Chip 
                      label={stats.productivity}
                      size="small"
                      sx={{
                        backgroundPalette: `${getProductivityPalette(stats.productivity)}20`,
                        color: getProductivityPalette(stats.productivity),
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  {/* Completion Rate */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Task Completion Rate
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {stats.completionRate}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.completionRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundPalette: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          backgroundPalette: getProductivityPalette(stats.productivity),
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>

                  {/* Performance Metrics */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={600} color="#3498DB">
                          {stats.totalTasks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Tasks
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={600} color="#27AE60">
                          {stats.completedTasks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Completed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={600} color="#E67E22">
                          {stats.activeTasks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Active
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={600} color="#E74C3C">
                          {stats.overdueTasks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Overdue
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Project Count */}
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Working on {stats.totalProjects} project{stats.totalProjects !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
};

export default TeamPerformance;