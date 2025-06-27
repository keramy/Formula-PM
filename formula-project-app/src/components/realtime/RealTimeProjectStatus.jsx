import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Tooltip,
  Badge,
  Alert,
  Fade,
  Paper,
  Grid
} from '@mui/material';
// Timeline components replaced with simple layout - @mui/lab not available
import {
  NavArrowDown as ExpandMore,
  NavArrowUp as ExpandLess,
  TrendingUp,
  TrendingDown,
  ClipboardCheck as Assignment,
  CheckCircle,
  Clock as Schedule,
  WarningTriangle as Warning,
  Cancel as Error,
  Group as People,
  MoneySquare as AttachMoney,
  Calendar as CalendarToday,
  Bell as Notifications,
  BellNotification as NotificationsActive,
  Refresh
} from 'iconoir-react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  useProjectUpdates, 
  useTaskStatusUpdates, 
  useRealTime 
} from '../../hooks/useRealTime';

// Real-time project progress indicator
export const RealTimeProgressIndicator = ({ project, showDetails = true }) => {
  const { projectActivity } = useProjectUpdates(project?.id);
  const [currentProgress, setCurrentProgress] = useState(project?.progress || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (project?.progress !== currentProgress) {
      setIsUpdating(true);
      setTimeout(() => {
        setCurrentProgress(project.progress);
        setIsUpdating(false);
      }, 500);
    }
  }, [project?.progress, currentProgress]);

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'success';
    if (progress >= 75) return 'info';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  const progressColor = getProgressColor(currentProgress);

  return (
    <Card sx={{ position: 'relative', overflow: 'visible' }}>
      {isUpdating && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1,
          height: 4
        }}>
          <LinearProgress color="primary" />
        </Box>
      )}
      
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {project?.name || 'Project Progress'}
          </Typography>
          <Badge 
            badgeContent={projectActivity.length} 
            color="primary" 
            max={99}
            invisible={projectActivity.length === 0}
          >
            <Tooltip title="Recent updates">
              <IconButton size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Badge>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {currentProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={currentProgress}
            color={progressColor}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {showDetails && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={project?.status || 'Unknown'}
                    color={progressColor}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  Due Date
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {project?.endDate 
                    ? format(new Date(project.endDate), 'MMM dd')
                    : 'Not set'
                  }
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        {projectActivity.length > 0 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="caption" color="textSecondary">
              Last update: {formatDistanceToNow(new Date(projectActivity[0].timestamp), { addSuffix: true })}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Real-time task status changes feed
export const RealTimeTaskStatusFeed = ({ limit = 10 }) => {
  const { statusChanges } = useTaskStatusUpdates();
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle color="success" />;
      case 'in-progress': return <Schedule color="warning" />;
      case 'blocked': return <Error color="error" />;
      default: return <Assignment color="primary" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'blocked': return 'error';
      default: return 'primary';
    }
  };

  if (statusChanges.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Assignment color="disabled" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2" color="textSecondary">
              No recent task updates
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const visibleChanges = expanded ? statusChanges : statusChanges.slice(0, 3);

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Task Status Updates</Typography>
            <Badge badgeContent={statusChanges.length} color="primary" max={99}>
              <NotificationsActive color="primary" />
            </Badge>
          </Box>
        }
        action={
          statusChanges.length > 3 && (
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <List>
          {visibleChanges.map((change, index) => (
            <ListItem key={change.taskId + change.timestamp} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Box sx={{ 
                  minWidth: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  backgroundColor: `${getStatusColor(change.newStatus)}.main`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {getStatusIcon(change.newStatus)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {change.taskName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(new Date(), { addSuffix: true })}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, ml: 5 }}>
                <Chip
                  label={change.oldStatus}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
                <Typography variant="caption" color="textSecondary">→</Typography>
                <Chip
                  label={change.newStatus}
                  size="small"
                  color={getStatusColor(change.newStatus)}
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Real-time project dashboard with live updates
export const RealTimeProjectDashboard = ({ projectId }) => {
  const { projectActivity } = useProjectUpdates(projectId);
  const { isConnected } = useRealTime();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Add new activities as notifications
    if (projectActivity.length > 0) {
      const latestActivity = projectActivity[0];
      const notification = {
        id: Date.now(),
        type: latestActivity.type,
        message: `Project ${latestActivity.type === 'project_updated' ? 'updated' : 'task updated'}`,
        timestamp: latestActivity.timestamp
      };

      setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep last 5 notifications

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    }
  }, [projectActivity]);

  return (
    <Box>
      {/* Connection Status */}
      <Fade in={!isConnected}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning />
            <Typography variant="body2">
              Real-time updates are currently unavailable. Reconnecting...
            </Typography>
          </Box>
        </Alert>
      </Fade>

      {/* Live Notifications */}
      <Box sx={{ position: 'fixed', top: 80, right: 20, zIndex: 1300 }}>
        {notifications.map((notification) => (
          <Fade key={notification.id} in timeout={500}>
            <Paper
              sx={{
                p: 2,
                mb: 1,
                minWidth: 250,
                backgroundColor: 'primary.light',
                color: 'primary.contrastText'
              }}
            >
              <Typography variant="body2">
                {notification.message}
              </Typography>
              <Typography variant="caption">
                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
              </Typography>
            </Paper>
          </Fade>
        ))}
      </Box>

      {/* Project Activity Timeline */}
      {projectActivity.length > 0 && (
        <Card sx={{ mt: 2 }}>
          <CardHeader
            title="Recent Project Activity"
            action={
              <Chip
                label={`${projectActivity.length} updates`}
                size="small"
                color="primary"
                variant="outlined"
              />
            }
          />
          <CardContent>
            <List>
              {projectActivity.slice(0, 5).map((activity, index) => (
                <ListItem key={index} divider={index < 4}>
                  <ListItemIcon>
                    {activity.type === 'project_updated' ? (
                      <TrendingUp color="primary" />
                    ) : (
                      <Assignment color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      activity.type === 'project_updated'
                        ? 'Project updated'
                        : `Task "${activity.data.name}" updated`
                    }
                    secondary={formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

// Real-time metrics widget
export const RealTimeMetricsWidget = ({ metrics = {} }) => {
  const [animatingMetrics, setAnimatingMetrics] = useState({});

  useEffect(() => {
    Object.keys(metrics).forEach(key => {
      if (metrics[key] !== animatingMetrics[key]) {
        setAnimatingMetrics(prev => ({ ...prev, [key]: metrics[key] }));
      }
    });
  }, [metrics, animatingMetrics]);

  const metricItems = [
    {
      key: 'activeProjects',
      label: 'Active Projects',
      value: metrics.activeProjects || 0,
      icon: <Assignment color="primary" />,
      color: 'primary'
    },
    {
      key: 'completedTasks',
      label: 'Completed Tasks',
      value: metrics.completedTasks || 0,
      icon: <CheckCircle color="success" />,
      color: 'success'
    },
    {
      key: 'teamMembers',
      label: 'Team Members',
      value: metrics.teamMembers || 0,
      icon: <People color="info" />,
      color: 'info'
    },
    {
      key: 'totalBudget',
      label: 'Total Budget',
      value: metrics.totalBudget || 0,
      icon: <AttachMoney color="warning" />,
      color: 'warning',
      format: (value) => `$${(value / 1000).toFixed(0)}K`
    }
  ];

  return (
    <Grid container spacing={2}>
      {metricItems.map((item) => (
        <Grid item xs={6} sm={3} key={item.key}>
          <Card sx={{ textAlign: 'center', position: 'relative' }}>
            <CardContent>
              {item.icon}
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                {item.format ? item.format(item.value) : item.value}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {item.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default {
  RealTimeProgressIndicator,
  RealTimeTaskStatusFeed,
  RealTimeProjectDashboard,
  RealTimeMetricsWidget
};