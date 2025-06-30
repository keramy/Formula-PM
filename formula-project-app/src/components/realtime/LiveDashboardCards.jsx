/**
 * Live Dashboard Cards Component
 * Interactive dashboard elements with real-time progress tracking
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  Stack,
  CircularProgress,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge,
  Paper,
  Fade,
  Grow
} from '@mui/material';
import {
  MdTrendingUp as TrendingUpIcon,
  MdTrendingDown as TrendingDownIcon,
  MdRefresh as RefreshIcon,
  MdTask as TaskIcon,
  MdProject as ProjectIcon,
  MdPeople as PeopleIcon,
  MdWarning as WarningIcon,
  MdCheckCircle as CheckCircleIcon,
  MdSchedule as ScheduleIcon,
  MdPause as PauseIcon,
  MdStop as BlockedIcon,
  MdAssignment as AssignmentIcon,
  MdDashboard as DashboardIcon,
  MdNotifications as NotificationsIcon
} from 'react-icons/md';
import { useSocket, useSocketEvent } from '../../hooks/useSocket';
import apiService from '../../services/api/apiService';

// Individual dashboard stat card with real-time updates
const LiveStatCard = ({ 
  title, 
  value, 
  previousValue, 
  icon, 
  color = 'primary', 
  trend = null,
  subtitle = '',
  isLoading = false,
  onClick,
  notification = null
}) => {
  const [animatedValue, setAnimatedValue] = useState(value);
  const [showPulse, setShowPulse] = useState(false);

  // Animate value changes
  useEffect(() => {
    if (value !== animatedValue) {
      setShowPulse(true);
      setAnimatedValue(value);
      
      // Remove pulse animation after 2 seconds
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [value, animatedValue]);

  const getTrendIcon = () => {
    if (!trend || !previousValue) return null;
    
    const isUp = value > previousValue;
    const change = Math.abs(value - previousValue);
    const percentage = previousValue > 0 ? ((change / previousValue) * 100).toFixed(1) : 0;
    
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {isUp ? (
          <TrendingUpIcon color="success" fontSize="small" />
        ) : (
          <TrendingDownIcon color="error" fontSize="small" />
        )}
        <Typography variant="caption" color={isUp ? 'success.main' : 'error.main'}>
          {percentage}%
        </Typography>
      </Stack>
    );
  };

  return (
    <Grow in timeout={300}>
      <Card
        sx={{
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          ...(showPulse && {
            animation: 'pulse 2s ease-in-out',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', boxShadow: 1 },
              '50%': { transform: 'scale(1.02)', boxShadow: 3 },
              '100%': { transform: 'scale(1)', boxShadow: 1 }
            }
          }),
          '&:hover': onClick ? {
            transform: 'translateY(-2px)',
            boxShadow: 3
          } : {}
        }}
        onClick={onClick}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: `${color}.main` }}>
                {isLoading ? (
                  <CircularProgress size={24} color={color} />
                ) : (
                  animatedValue
                )}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="textSecondary">
                  {subtitle}
                </Typography>
              )}
              {getTrendIcon()}
            </Box>
            
            <Box sx={{ position: 'relative' }}>
              {notification && (
                <Badge badgeContent={notification} color="error" sx={{ position: 'absolute', top: -8, right: -8 }}>
                  <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
                    {icon}
                  </Avatar>
                </Badge>
              )}
              {!notification && (
                <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
                  {icon}
                </Avatar>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Project progress card with real-time updates
const LiveProjectProgressCard = ({ project, onProjectClick }) => {
  const [progress, setProgress] = useState(project?.progress || 0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Listen for project updates
  useSocketEvent('project_updated', useCallback((data) => {
    if (data.data?.id === project?.id) {
      setProgress(data.data.progress || progress);
      setLastUpdate(new Date());
    }
  }, [project?.id, progress]), [project?.id]);

  if (!project) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'on_hold': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'active': return <ProjectIcon />;
      case 'on_hold': return <PauseIcon />;
      case 'cancelled': return <BlockedIcon />;
      default: return <ScheduleIcon />;
    }
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={() => onProjectClick?.(project)}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>
              {project.name}
            </Typography>
            <Chip 
              icon={getStatusIcon(project.status)}
              label={project.status}
              color={getStatusColor(project.status)}
              size="small"
            />
          </Stack>
          
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="textSecondary">
                Progress
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {progress}%
              </Typography>
            </Stack>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  transition: 'transform 1s ease-in-out'
                }
              }}
            />
          </Box>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="textSecondary">
              Due: {new Date(project.dueDate || Date.now()).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Updated: {lastUpdate.toLocaleTimeString()}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Team member status card with presence indicators
const TeamMemberStatusCard = ({ member }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(new Date());
  const [currentActivity, setCurrentActivity] = useState('');

  // Listen for user presence updates
  useSocketEvent('user_presence', useCallback((presenceData) => {
    if (presenceData.userId === member?.id) {
      setIsOnline(presenceData.status === 'online');
      setLastSeen(new Date(presenceData.timestamp));
    }
  }, [member?.id]), [member?.id]);

  if (!member) return null;

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={member.avatar} sx={{ width: 48, height: 48 }}>
            {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
          </Avatar>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: isOnline ? 'success.main' : 'grey.400',
              border: '2px solid white',
              ...(isOnline && {
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 }
                }
              })
            }}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2">
            {member.firstName} {member.lastName}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {member.role}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <Chip
              label={isOnline ? 'Online' : 'Offline'}
              size="small"
              color={isOnline ? 'success' : 'default'}
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
            {!isOnline && (
              <Typography variant="caption" color="textSecondary">
                {lastSeen.toLocaleTimeString()}
              </Typography>
            )}
          </Stack>
          {currentActivity && (
            <Typography variant="caption" color="primary" sx={{ fontStyle: 'italic' }}>
              {currentActivity}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

// Main live dashboard cards component
const LiveDashboardCards = ({ 
  onProjectClick, 
  onTaskClick, 
  onTeamClick,
  refreshInterval = 30000 // 30 seconds
}) => {
  const { isReady } = useSocket();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    overdueTasks: 0,
    upcomingDeadlines: 0
  });
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsData, tasksData, teamData] = await Promise.all([
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getTeamMembers()
      ]);

      const allProjects = projectsData.projects || [];
      const allTasks = tasksData.tasks || [];
      const allTeamMembers = teamData.teamMembers || [];

      setProjects(allProjects.slice(0, 4)); // Show top 4 projects
      setTeamMembers(allTeamMembers.slice(0, 6)); // Show top 6 team members

      // Calculate stats
      const activeTasks = allTasks.filter(t => t.status === 'in_progress').length;
      const completedTasks = allTasks.filter(t => t.status === 'completed').length;
      const overdueTasks = allTasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length;
      const upcomingDeadlines = allTasks.filter(t =>
        t.dueDate && 
        new Date(t.dueDate) > new Date() && 
        new Date(t.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
      ).length;

      setStats({
        totalProjects: allProjects.length,
        activeTasks,
        completedTasks,
        teamMembers: allTeamMembers.length,
        overdueTasks,
        upcomingDeadlines
      });

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle real-time updates
  useSocketEvent('activity_update', useCallback((activity) => {
    // Refresh relevant stats based on activity type
    if (['project', 'task', 'team_member'].includes(activity.type)) {
      loadDashboardData();
    }
  }, []), []);

  const handleRefresh = () => {
    loadDashboardData();
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <DashboardIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Live Dashboard
          </Typography>
          {isReady && (
            <Chip 
              label="Live Updates" 
              color="success" 
              size="small"
              sx={{ fontSize: '0.7rem', fontWeight: 600 }}
            />
          )}
        </Stack>
        
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="textSecondary">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Typography>
          <Tooltip title="Refresh Dashboard">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2}>
          <LiveStatCard
            title="Active Projects"
            value={stats.totalProjects}
            icon={<ProjectIcon />}
            color="primary"
            isLoading={loading}
            onClick={() => onProjectClick?.()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <LiveStatCard
            title="Active Tasks"
            value={stats.activeTasks}
            icon={<TaskIcon />}
            color="info"
            isLoading={loading}
            onClick={() => onTaskClick?.()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <LiveStatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={<CheckCircleIcon />}
            color="success"
            isLoading={loading}
            onClick={() => onTaskClick?.()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <LiveStatCard
            title="Team Members"
            value={stats.teamMembers}
            icon={<PeopleIcon />}
            color="secondary"
            isLoading={loading}
            onClick={() => onTeamClick?.()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <LiveStatCard
            title="Overdue Tasks"
            value={stats.overdueTasks}
            icon={<WarningIcon />}
            color="error"
            isLoading={loading}
            onClick={() => onTaskClick?.()}
            notification={stats.overdueTasks > 0 ? stats.overdueTasks : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <LiveStatCard
            title="Upcoming Deadlines"
            value={stats.upcomingDeadlines}
            icon={<ScheduleIcon />}
            color="warning"
            isLoading={loading}
            onClick={() => onTaskClick?.()}
            notification={stats.upcomingDeadlines > 0 ? stats.upcomingDeadlines : null}
          />
        </Grid>
      </Grid>

      {/* Project Progress Cards */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Project Progress
      </Typography>
      <Grid container spacing={3} mb={4}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={3} key={project.id}>
            <LiveProjectProgressCard 
              project={project} 
              onProjectClick={onProjectClick}
            />
          </Grid>
        ))}
      </Grid>

      {/* Team Status */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Team Status
      </Typography>
      <Grid container spacing={2}>
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <TeamMemberStatusCard member={member} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LiveDashboardCards;