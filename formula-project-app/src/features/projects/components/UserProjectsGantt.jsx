import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  MdViewWeek as WeekView,
  MdViewModule as MonthView,
  MdViewQuilt as QuarterView,
  MdViewStream as YearView,
  MdZoomIn as ZoomIn,
  MdZoomOut as ZoomOut,
  MdFullscreen as Fullscreen,
  MdMoreVert as MoreVert,
  MdDragIndicator as DragIndicator
} from 'react-icons/md';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, addDays, addWeeks, addMonths, differenceInDays, isWithinInterval } from 'date-fns';
import { useAuth } from '../../../context/AuthContext';

const UserProjectsGantt = ({ projects = [], tasks = [], teamMembers = [], onProjectUpdate }) => {
  const { user, getAccessibleProjects } = useAuth();
  const [viewMode, setViewMode] = useState('month'); // week, month, quarter, year
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Filter projects based on user access
  const userProjects = useMemo(() => {
    return getAccessibleProjects(projects);
  }, [projects, getAccessibleProjects]);

  // Create team members lookup
  const teamMembersMap = useMemo(() => {
    return teamMembers.reduce((acc, member) => {
      acc[member.id] = member;
      return acc;
    }, {});
  }, [teamMembers]);

  // Get date range based on view mode
  const getDateRange = (date, mode) => {
    switch (mode) {
      case 'week':
        return { start: startOfWeek(date), end: endOfWeek(date) };
      case 'month':
        return { start: startOfMonth(date), end: endOfMonth(date) };
      case 'quarter':
        return { start: startOfQuarter(date), end: endOfQuarter(date) };
      case 'year':
        return { start: startOfYear(date), end: endOfYear(date) };
      default:
        return { start: startOfMonth(date), end: endOfMonth(date) };
    }
  };

  // Generate time periods based on view mode
  const getTimePeriods = (start, end, mode) => {
    switch (mode) {
      case 'week':
        return eachDayOfInterval({ start, end });
      case 'month':
        return eachWeekOfInterval({ start, end });
      case 'quarter':
        return eachMonthOfInterval({ start, end });
      case 'year':
        return eachMonthOfInterval({ start, end });
      default:
        return eachWeekOfInterval({ start, end });
    }
  };

  // Format period label
  const formatPeriodLabel = (period, mode) => {
    switch (mode) {
      case 'week':
        return format(period, 'EEE d');
      case 'month':
        return format(period, 'MMM d');
      case 'quarter':
        return format(period, 'MMM yyyy');
      case 'year':
        return format(period, 'MMM');
      default:
        return format(period, 'MMM d');
    }
  };

  const dateRange = getDateRange(currentDate, viewMode);
  const timePeriods = getTimePeriods(dateRange.start, dateRange.end, viewMode);

  // Navigation handlers
  const navigatePrevious = () => {
    switch (viewMode) {
      case 'week':
        setCurrentDate(prev => addDays(prev, -7));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, -1));
        break;
      case 'quarter':
        setCurrentDate(prev => addMonths(prev, -3));
        break;
      case 'year':
        setCurrentDate(prev => addMonths(prev, -12));
        break;
    }
  };

  const navigateNext = () => {
    switch (viewMode) {
      case 'week':
        setCurrentDate(prev => addDays(prev, 7));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
      case 'quarter':
        setCurrentDate(prev => addMonths(prev, 3));
        break;
      case 'year':
        setCurrentDate(prev => addMonths(prev, 12));
        break;
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Calculate project position and width
  const getProjectBarStyle = (project) => {
    if (!project.startDate || !project.endDate) return null;

    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    const rangeStart = dateRange.start;
    const rangeEnd = dateRange.end;

    // Check if project overlaps with current view
    if (!isWithinInterval(projectStart, { start: rangeStart, end: rangeEnd }) && 
        !isWithinInterval(projectEnd, { start: rangeStart, end: rangeEnd }) &&
        !isWithinInterval(rangeStart, { start: projectStart, end: projectEnd })) {
      return null;
    }

    const totalDays = differenceInDays(rangeEnd, rangeStart);
    const startOffset = Math.max(0, differenceInDays(projectStart, rangeStart));
    const endOffset = Math.min(totalDays, differenceInDays(projectEnd, rangeStart));
    
    const left = (startOffset / totalDays) * 100;
    const width = ((endOffset - startOffset) / totalDays) * 100;

    return {
      left: `${left}%`,
      width: `${Math.max(width, 2)}%`, // Minimum 2% width for visibility
      opacity: isWithinInterval(new Date(), { start: projectStart, end: projectEnd }) ? 1 : 0.7
    };
  };

  // Get project status color
  const getProjectColor = (project) => {
    switch (project.status?.toLowerCase()) {
      case 'completed':
        return '#10B981';
      case 'active':
      case 'in-progress':
        return '#E3AF64';
      case 'on-hold':
        return '#F59E0B';
      case 'planning':
        return '#516AC8';
      default:
        return '#6B7280';
    }
  };

  // Handle project menu
  const handleProjectMenu = (event, project) => {
    event.stopPropagation();
    setSelectedProject(project);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedProject(null);
  };

  // Get project tasks count
  const getProjectTasksCount = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completedTasks = projectTasks.filter(task => task.status === 'completed');
    return {
      total: projectTasks.length,
      completed: completedTasks.length,
      progress: projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0
    };
  };

  if (userProjects.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #E5E7EB', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#374151' }}>
          No Projects Assigned
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You don't have access to any projects or no projects are assigned to you.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #E5E7EB', backgroundColor: '#F8F9FA' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F1939' }}>
            My Projects Timeline ({userProjects.length})
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button size="small" onClick={navigatePrevious}>Previous</Button>
              <Button size="small" variant="outlined" onClick={navigateToday}>Today</Button>
              <Button size="small" onClick={navigateNext}>Next</Button>
            </Box>

            {/* View Mode */}
            <ButtonGroup size="small" variant="outlined">
              <Button
                variant={viewMode === 'week' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('week')}
                startIcon={<WeekView size={16} />}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('month')}
                startIcon={<MonthView size={16} />}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'quarter' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('quarter')}
                startIcon={<QuarterView size={16} />}
              >
                Quarter
              </Button>
              <Button
                variant={viewMode === 'year' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('year')}
                startIcon={<YearView size={16} />}
              >
                Year
              </Button>
            </ButtonGroup>
          </Box>
        </Box>

        {/* Current Period */}
        <Typography variant="body2" sx={{ color: '#6B7280' }}>
          {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
        </Typography>
      </Box>

      {/* Timeline Grid */}
      <Box sx={{ overflow: 'auto' }}>
        {/* Time Header */}
        <Box sx={{ display: 'flex', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <Box sx={{ width: 250, p: 2, borderRight: '1px solid #E5E7EB' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
              Project
            </Typography>
          </Box>
          <Box sx={{ flex: 1, display: 'flex' }}>
            {timePeriods.map((period, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  p: 1,
                  textAlign: 'center',
                  borderRight: index < timePeriods.length - 1 ? '1px solid #E5E7EB' : 'none',
                  minWidth: viewMode === 'week' ? 80 : 60
                }}
              >
                <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 500 }}>
                  {formatPeriodLabel(period, viewMode)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Project Rows */}
        {userProjects.map((project) => {
          const barStyle = getProjectBarStyle(project);
          const projectColor = getProjectColor(project);
          const manager = teamMembersMap[project.managerId];
          const taskStats = getProjectTasksCount(project.id);

          return (
            <Box
              key={project.id}
              sx={{
                display: 'flex',
                borderBottom: '1px solid #E5E7EB',
                '&:hover': { backgroundColor: '#F9FAFB' }
              }}
            >
              {/* Project Info */}
              <Box sx={{ width: 250, p: 2, borderRight: '1px solid #E5E7EB' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      cursor: 'pointer',
                      '&:hover': { color: '#516AC8' }
                    }}
                  >
                    {project.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleProjectMenu(e, project)}
                    sx={{ ml: 1 }}
                  >
                    <MoreVert size={12} />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={project.status?.replace('-', ' ') || 'Active'}
                    size="small"
                    sx={{
                      backgroundColor: `${projectColor}20`,
                      color: projectColor,
                      fontWeight: 500,
                      fontSize: '11px',
                      height: 20
                    }}
                  />
                </Box>

                {manager && (
                  <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', mb: 1 }}>
                    Manager: {manager.fullName || manager.name}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={taskStats.progress}
                    sx={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: '#E5E7EB',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: projectColor,
                        borderRadius: 2
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#6B7280', minWidth: 30 }}>
                    {taskStats.progress}%
                  </Typography>
                </Box>
              </Box>

              {/* Timeline Bar */}
              <Box sx={{ flex: 1, position: 'relative', height: 100, p: 2 }}>
                {barStyle && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: 24,
                      backgroundColor: projectColor,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                        transform: 'translateY(-50%) scale(1.02)'
                      },
                      ...barStyle
                    }}
                  >
                    <DragIndicator sx={{ color: 'white', fontSize: 16 }} />
                  </Box>
                )}
                
                {/* Today indicator */}
                {isWithinInterval(new Date(), dateRange) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      width: 2,
                      backgroundColor: '#EF4444',
                      left: `${(differenceInDays(new Date(), dateRange.start) / differenceInDays(dateRange.end, dateRange.start)) * 100}%`,
                      zIndex: 10
                    }}
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Project Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }
        }}
      >
        <MenuItem onClick={() => { /* Handle view details */ handleMenuClose(); }}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => { /* Handle edit */ handleMenuClose(); }}>
          Edit Project
        </MenuItem>
        <MenuItem onClick={() => { /* Handle tasks */ handleMenuClose(); }}>
          View Tasks
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default React.memo(UserProjectsGantt);