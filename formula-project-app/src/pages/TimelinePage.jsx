import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput,
  Slider,
  Switch,
  FormControlLabel,
  LinearProgress,
  Divider,
  Alert,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from '@mui/material';
import {
  MdArrowForward as TimelineIcon,
  MdCalendarToday as CalendarIcon,
  MdFilterList as FilterIcon,
  MdZoomIn as ZoomIn,
  MdZoomOut as ZoomOut,
  MdViewModule as ViewGrid,
  MdViewList as ViewList,
  MdDownload as Download,
  MdSettings as Settings,
  MdPlayArrow as Play,
  MdPause as Pause,
  MdSkipNext as SkipNext,
  MdGroup as Group,
  MdCheckCircle as CheckCircle,
  MdWarning as AlertCircle,
  MdSchedule as Clock,
  MdEdit as Edit,
  MdAdd as Plus,
  MdArrowForward as ArrowRight,
  MdCalendarToday as CalendarPicker
} from 'react-icons/md';
import { ComposedChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import apiService from '../services/api/apiService';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, differenceInDays, parseISO, isWithinInterval } from 'date-fns';

const TimelinePage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('gantt');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Timeline view settings
  const [timelineView, setTimelineView] = useState('weekly'); // weekly, monthly, quarterly
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showMilestones, setShowMilestones] = useState(true);
  const [showDependencies, setShowDependencies] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: addDays(new Date(), 90)
  });
  
  // Interactive features state
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [quickActions, setQuickActions] = useState(false);
  
  // Palettes from the design system
  const colors = {
    background: '#FBFAF8',
    cardBackground: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    caramelEssence: '#E3AF64',
    sapphireDust: '#516AC8',
    cosmicOdyssey: '#0F1939',
    raptureLight: '#F6F3E7',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectsData, tasksData, teamData] = await Promise.all([
          apiService.getProjects(),
          apiService.getTasks(),
          apiService.getTeamMembers()
        ]);
        
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setTeamMembers(Array.isArray(teamData) ? teamData : []);
        
        // Select all projects by default
        setSelectedProjects(Array.isArray(projectsData) ? projectsData.map(p => p.id) : []);
        
        setError(null);
      } catch (err) {
        console.error('Error loading timeline data:', err);
        setError('Failed to load timeline data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calculate timeline data
  const timelineData = useMemo(() => {
    if (!projects.length || !tasks.length) return [];
    
    const filteredProjects = projects.filter(p => selectedProjects.includes(p.id));
    const filteredTasks = tasks.filter(t => selectedProjects.includes(t.projectId));
    
    // Generate timeline data based on view
    const intervals = timelineView === 'weekly' 
      ? eachWeekOfInterval({ start: dateRange.start, end: dateRange.end })
      : timelineView === 'monthly'
      ? eachMonthOfInterval({ start: dateRange.start, end: dateRange.end })
      : eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
    
    return intervals.map(date => {
      const periodStart = timelineView === 'weekly' ? startOfWeek(date) : 
                          timelineView === 'monthly' ? startOfMonth(date) : date;
      const periodEnd = timelineView === 'weekly' ? endOfWeek(date) : 
                        timelineView === 'monthly' ? endOfMonth(date) : date;
      
      const activeTasks = filteredTasks.filter(task => {
        const taskStart = parseISO(task.createdAt || task.startDate || '2024-01-01');
        const taskEnd = parseISO(task.dueDate || addDays(taskStart, 7).toISOString());
        
        return isWithinInterval(taskStart, { start: periodStart, end: periodEnd }) ||
               isWithinInterval(taskEnd, { start: periodStart, end: periodEnd }) ||
               (taskStart <= periodStart && taskEnd >= periodEnd);
      });
      
      const completedTasks = activeTasks.filter(t => t.status === 'completed');
      const inProgressTasks = activeTasks.filter(t => t.status === 'in-progress');
      const pendingTasks = activeTasks.filter(t => t.status === 'pending');
      
      return {
        date: format(date, timelineView === 'monthly' ? 'MMM yyyy' : 'MMM dd'),
        fullDate: date,
        totalTasks: activeTasks.length,
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        pending: pendingTasks.length,
        workload: activeTasks.length * 10 // Simple workload calculation
      };
    });
  }, [projects, tasks, selectedProjects, timelineView, dateRange]);

  // Project statistics
  const projectStats = useMemo(() => {
    if (!projects.length) return { total: 0, active: 0, completed: 0, overdue: 0 };
    
    const filteredProjects = projects.filter(p => selectedProjects.includes(p.id));
    const today = new Date();
    
    return {
      total: filteredProjects.length,
      active: filteredProjects.filter(p => p.status === 'active' || p.status === 'in-progress').length,
      completed: filteredProjects.filter(p => p.status === 'completed').length,
      overdue: filteredProjects.filter(p => {
        const endDate = parseISO(p.endDate || '2024-12-31');
        return p.status !== 'completed' && endDate < today;
      }).length
    };
  }, [projects, selectedProjects]);

  // Event handlers
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleViewChange = useCallback((view) => {
    setTimelineView(view);
  }, []);

  const handleProjectToggle = useCallback((projectId) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  }, []);

  const handleFilterMenuOpen = useCallback((event) => {
    setFilterMenuAnchor(event.currentTarget);
  }, []);

  const handleFilterMenuClose = useCallback(() => {
    setFilterMenuAnchor(null);
  }, []);

  // Interactive handlers
  const handleTaskClick = useCallback((task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  }, []);

  const handleTaskUpdate = useCallback(async (taskId, updates) => {
    try {
      // Update task through API
      await apiService.updateTask(taskId, updates);
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
      
      setTaskDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, []);

  const handleDateRangeChange = useCallback((start, end) => {
    setDateRange({ start, end });
  }, []);

  const handleTaskDragStart = useCallback((task) => {
    setDraggedTask(task);
  }, []);

  const handleTaskDrop = useCallback((date) => {
    if (draggedTask) {
      const newDueDate = format(date, 'yyyy-MM-dd');
      handleTaskUpdate(draggedTask.id, { dueDate: newDueDate });
      setDraggedTask(null);
    }
  }, [draggedTask, handleTaskUpdate]);

  // Loading state
  if (loading) {
    return (
      <CleanPageLayout
        title="Project Timeline"
        subtitle="Loading timeline data..."
      >
        <Box sx={{ p: 3 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2 }} />
          ))}
        </Box>
      </CleanPageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <CleanPageLayout
        title="Project Timeline"
        subtitle="Error loading timeline"
      >
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ backgroundColor: colors.sapphireDust }}
          >
            Retry
          </Button>
        </Box>
      </CleanPageLayout>
    );
  }

  const tabs = [
    <CleanTab 
      key="gantt" 
      label="Gantt Chart" 
      icon={<ViewGrid />} 
      isActive={activeTab === 'gantt'} 
      onClick={() => handleTabChange('gantt')} 
    />,
    <CleanTab 
      key="milestones" 
      label="Milestones" 
      icon={<CheckCircle />} 
      isActive={activeTab === 'milestones'} 
      onClick={() => handleTabChange('milestones')} 
    />,
    <CleanTab 
      key="resources" 
      label="Resources" 
      icon={<Group />} 
      isActive={activeTab === 'resources'} 
      onClick={() => handleTabChange('resources')} 
    />,
    <CleanTab 
      key="critical-path" 
      label="Critical Path" 
      icon={<AlertCircle />} 
      isActive={activeTab === 'critical-path'} 
      onClick={() => handleTabChange('critical-path')} 
    />
  ];

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {/* Date Range Indicator */}
      <Typography variant="body2" sx={{ color: colors.textSecondary, mr: 1 }}>
        {format(dateRange.start, 'MMM dd')} - {format(dateRange.end, 'MMM dd, yyyy')}
      </Typography>
      
      {/* Timeline View Controls */}
      <ButtonGroup size="small" variant="outlined">
        <Button 
          onClick={() => handleViewChange('weekly')}
          variant={timelineView === 'weekly' ? 'contained' : 'outlined'}
          sx={{ 
            backgroundColor: timelineView === 'weekly' ? colors.caramelEssence : 'transparent',
            color: timelineView === 'weekly' ? 'white' : colors.textSecondary,
            '&:hover': { backgroundColor: timelineView === 'weekly' ? colors.caramelEssence : colors.raptureLight }
          }}
        >
          Weekly
        </Button>
        <Button 
          onClick={() => handleViewChange('monthly')}
          variant={timelineView === 'monthly' ? 'contained' : 'outlined'}
          sx={{ 
            backgroundColor: timelineView === 'monthly' ? colors.caramelEssence : 'transparent',
            color: timelineView === 'monthly' ? 'white' : colors.textSecondary,
            '&:hover': { backgroundColor: timelineView === 'monthly' ? colors.caramelEssence : colors.raptureLight }
          }}
        >
          Monthly
        </Button>
      </ButtonGroup>
      
      {/* Date Range Picker */}
      <Tooltip title="Adjust Date Range">
        <IconButton 
          onClick={() => {
            const newStart = addDays(dateRange.start, -30);
            const newEnd = addDays(dateRange.end, 30);
            handleDateRangeChange(newStart, newEnd);
          }}
          sx={{ 
            color: colors.textSecondary,
            '&:hover': { backgroundColor: colors.raptureLight }
          }}
        >
          <CalendarPicker />
        </IconButton>
      </Tooltip>
      
      {/* Filter Button */}
      <IconButton 
        onClick={handleFilterMenuOpen}
        sx={{ 
          color: colors.textSecondary,
          '&:hover': { backgroundColor: colors.raptureLight }
        }}
      >
        <FilterIcon />
      </IconButton>
      
      {/* Quick Actions */}
      <Tooltip title="Quick Actions">
        <IconButton 
          onClick={() => setQuickActions(true)}
          sx={{ 
            color: colors.textSecondary,
            '&:hover': { backgroundColor: colors.raptureLight }
          }}
        >
          <Settings />
        </IconButton>
      </Tooltip>
      
      {/* Export Button */}
      <Button 
        variant="outlined" 
        startIcon={<Download />}
        size="small"
        sx={{ 
          borderPalette: colors.border,
          color: colors.textSecondary,
          '&:hover': { backgroundColor: colors.raptureLight }
        }}
      >
        Export
      </Button>
    </Box>
  );

  return (
    <CleanPageLayout
      title="Project Timeline"
      subtitle={`Visualizing ${projectStats.total} projects with ${projectStats.active} active, ${projectStats.completed} completed`}
      headerActions={headerActions}
      tabs={tabs}
    >
      {/* Timeline Content */}
      <TimelineContent 
        activeTab={activeTab}
        timelineData={timelineData}
        projects={projects}
        tasks={tasks}
        teamMembers={teamMembers}
        selectedProjects={selectedProjects}
        timelineView={timelineView}
        showMilestones={showMilestones}
        showDependencies={showDependencies}
        colors={colors}
        onProjectToggle={handleProjectToggle}
        onTaskClick={handleTaskClick}
        onTaskDragStart={handleTaskDragStart}
        onTaskDrop={handleTaskDrop}
        draggedTask={draggedTask}
      />
      
      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
        PaperProps={{
          sx: {
            width: 300,
            maxHeight: 400,
            p: 2
          }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: colors.textPrimary }}>
          Filter Timeline
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 1, color: colors.textSecondary }}>
          Projects
        </Typography>
        
        {projects.map(project => (
          <FormControlLabel
            key={project.id}
            control={
              <Switch
                checked={selectedProjects.includes(project.id)}
                onChange={() => handleProjectToggle(project.id)}
                size="small"
              />
            }
            label={project.name}
            sx={{ 
              display: 'flex', 
              width: '100%', 
              mb: 1,
              '& .MuiFormControlLabel-label': { fontSize: '14px' }
            }}
          />
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        <FormControlLabel
          control={
            <Switch
              checked={showMilestones}
              onChange={(e) => setShowMilestones(e.target.checked)}
              size="small"
            />
          }
          label="Show Milestones"
          sx={{ mb: 1 }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={showDependencies}
              onChange={(e) => setShowDependencies(e.target.checked)}
              size="small"
            />
          }
          label="Show Dependencies"
        />
      </Menu>
      
      {/* Task Edit Dialog */}
      <TaskEditDialog
        open={taskDialogOpen}
        task={selectedTask}
        onClose={() => {
          setTaskDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskUpdate}
        colors={colors}
        projects={projects}
        teamMembers={teamMembers}
      />
      
      {/* Quick Actions Dialog */}
      <QuickActionsDialog
        open={quickActions}
        onClose={() => setQuickActions(false)}
        colors={colors}
        onDateRangeChange={handleDateRangeChange}
        currentDateRange={dateRange}
        timelineView={timelineView}
        onViewChange={handleViewChange}
      />
    </CleanPageLayout>
  );
};

// Timeline Content Component
const TimelineContent = ({ 
  activeTab, 
  timelineData, 
  projects, 
  tasks, 
  teamMembers, 
  selectedProjects, 
  timelineView, 
  showMilestones, 
  showDependencies, 
  colors,
  onProjectToggle,
  onTaskClick,
  onTaskDragStart,
  onTaskDrop,
  draggedTask
}) => {
  if (activeTab === 'gantt') {
    return <GanttChartView 
      timelineData={timelineData} 
      projects={projects}
      tasks={tasks}
      selectedProjects={selectedProjects}
      timelineView={timelineView}
      colors={colors}
      onTaskClick={onTaskClick}
      onTaskDragStart={onTaskDragStart}
      onTaskDrop={onTaskDrop}
      draggedTask={draggedTask}
    />;
  }
  
  if (activeTab === 'milestones') {
    return <MilestonesView 
      projects={projects}
      tasks={tasks}
      selectedProjects={selectedProjects}
      colors={colors}
    />;
  }
  
  if (activeTab === 'resources') {
    return <ResourcesView 
      teamMembers={teamMembers}
      tasks={tasks}
      projects={projects}
      selectedProjects={selectedProjects}
      colors={colors}
    />;
  }
  
  if (activeTab === 'critical-path') {
    return <CriticalPathView 
      projects={projects}
      tasks={tasks}
      selectedProjects={selectedProjects}
      colors={colors}
    />;
  }
  
  return null;
};

// Gantt Chart View Component
const GanttChartView = ({ 
  timelineData, 
  projects, 
  tasks, 
  selectedProjects, 
  timelineView, 
  colors, 
  onTaskClick, 
  onTaskDragStart, 
  onTaskDrop, 
  draggedTask 
}) => {
  if (!timelineData.length) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 400,
        flexDirection: 'column',
        gap: 2
      }}>
        <TimelineIcon size={48} color={colors.textMuted} />
        <Typography color={colors.textSecondary}>
          No timeline data available for selected projects
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Timeline Chart */}
      <Card sx={{ mb: 3, backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.textPrimary }}>
            Project Timeline - {timelineView === 'weekly' ? 'Weekly' : 'Monthly'} View
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: colors.textSecondary }}
                  axisLine={{ stroke: colors.border }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: colors.textSecondary }}
                  axisLine={{ stroke: colors.border }}
                />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    fontSize: 12
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="completed" 
                  stackId="tasks" 
                  fill={colors.success} 
                  name="Completed Tasks"
                />
                <Bar 
                  dataKey="inProgress" 
                  stackId="tasks" 
                  fill={colors.caramelEssence} 
                  name="In Progress"
                />
                <Bar 
                  dataKey="pending" 
                  stackId="tasks" 
                  fill={colors.sapphireDust} 
                  name="Pending Tasks"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
      
      {/* Project Rows */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {projects.filter(p => selectedProjects.includes(p.id)).map(project => (
          <ProjectTimelineRow 
            key={project.id}
            project={project}
            tasks={tasks.filter(t => t.projectId === project.id)}
            colors={colors}
            onTaskClick={onTaskClick}
            onTaskDragStart={onTaskDragStart}
            draggedTask={draggedTask}
          />
        ))}
      </Box>
    </Box>
  );
};

// Project Timeline Row Component
const ProjectTimelineRow = ({ project, tasks, colors, onTaskClick, onTaskDragStart, draggedTask }) => {
  const projectProgress = project.progress || 0;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  
  const getStatusPalette = (status) => {
    switch (status) {
      case 'active': case 'in-progress': return colors.caramelEssence;
      case 'completed': return colors.success;
      case 'on-hold': return colors.warning;
      case 'cancelled': return colors.error;
      default: return colors.sapphireDust;
    }
  };
  
  return (
    <Card sx={{ backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>
              {project.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Chip 
                label={project.status?.replace('-', ' ').toUpperCase() || 'ACTIVE'}
                size="small"
                sx={{
                  backgroundColor: `${getStatusPalette(project.status)}20`,
                  color: getStatusPalette(project.status),
                  fontWeight: 600,
                  fontSize: '11px'
                }}
              />
              <Typography variant="body2" color={colors.textSecondary}>
                {totalTasks} tasks • {completedTasks} completed • {inProgressTasks} in progress
              </Typography>
            </Box>
            
            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color={colors.textSecondary}>
                  Project Progress
                </Typography>
                <Typography variant="body2" color={colors.textPrimary} fontWeight={600}>
                  {projectProgress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={projectProgress} 
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.border,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: colors.caramelEssence,
                    borderRadius: 4
                  }
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Typography variant="body2" color={colors.textSecondary}>
              Due: {format(parseISO(project.endDate || '2024-12-31'), 'MMM dd, yyyy')}
            </Typography>
            <Typography variant="h6" sx={{ color: colors.sapphireDust }}>
              ${(project.budget || 0).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        
        {/* Task Timeline */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, color: colors.textSecondary }}>
            Task Timeline
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {tasks.slice(0, 5).map(task => (
              <Chip
                key={task.id}
                label={task.name || task.title}
                size="small"
                clickable
                draggable={true}
                onClick={() => onTaskClick && onTaskClick(task)}
                onDragStart={() => onTaskDragStart && onTaskDragStart(task)}
                icon={<Edit size={12} />}
                sx={{
                  backgroundColor: task.status === 'completed' ? `${colors.success}20` :
                                  task.status === 'in-progress' ? `${colors.caramelEssence}20` :
                                  `${colors.sapphireDust}20`,
                  color: task.status === 'completed' ? colors.success :
                         task.status === 'in-progress' ? colors.caramelEssence :
                         colors.sapphireDust,
                  fontSize: '11px',
                  cursor: 'pointer',
                  opacity: draggedTask?.id === task.id ? 0.5 : 1,
                  border: draggedTask?.id === task.id ? `2px dashed ${colors.caramelEssence}` : 'none',
                  '&:hover': {
                    backgroundColor: task.status === 'completed' ? `${colors.success}30` :
                                    task.status === 'in-progress' ? `${colors.caramelEssence}30` :
                                    `${colors.sapphireDust}30`,
                    transform: 'scale(1.05)'
                  }
                }}
              />
            ))}
            {tasks.length > 5 && (
              <Chip
                label={`+${tasks.length - 5} more`}
                size="small"
                sx={{
                  backgroundColor: colors.raptureLight,
                  color: colors.textSecondary,
                  fontSize: '11px'
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Milestones View Component
const MilestonesView = ({ projects, tasks, selectedProjects, colors }) => {
  const milestones = useMemo(() => {
    const projectMilestones = projects
      .filter(p => selectedProjects.includes(p.id))
      .map(project => ({
        id: `project-${project.id}`,
        title: `${project.name} Completion`,
        date: project.endDate,
        type: 'project',
        status: project.status,
        project: project.name,
        description: project.description
      }));
    
    const taskMilestones = tasks
      .filter(t => selectedProjects.includes(t.projectId) && t.priority === 'high')
      .map(task => {
        const project = projects.find(p => p.id === task.projectId);
        return {
          id: `task-${task.id}`,
          title: task.name || task.title,
          date: task.dueDate,
          type: 'task',
          status: task.status,
          project: project?.name || 'Unknown Project',
          description: task.description
        };
      });
    
    return [...projectMilestones, ...taskMilestones]
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [projects, tasks, selectedProjects]);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle color={colors.success} />;
      case 'in-progress': return <Clock color={colors.caramelEssence} />;
      default: return <AlertCircle color={colors.sapphireDust} />;
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: colors.textPrimary }}>
        Project Milestones
      </Typography>
      
      {milestones.length === 0 ? (
        <Card sx={{ backgroundColor: colors.cardBackground, textAlign: 'center', p: 4 }}>
          <CheckCircle size={48} color={colors.textMuted} />
          <Typography sx={{ mt: 2, color: colors.textSecondary }}>
            No milestones found for selected projects
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {milestones.map((milestone, index) => (
            <Card key={milestone.id} sx={{ backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ mt: 0.5 }}>
                    {getStatusIcon(milestone.status)}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: colors.textPrimary }}>
                        {milestone.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        {format(parseISO(milestone.date || '2024-12-31'), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip 
                        label={milestone.type.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: milestone.type === 'project' ? `${colors.sapphireDust}20` : `${colors.caramelEssence}20`,
                          color: milestone.type === 'project' ? colors.sapphireDust : colors.caramelEssence,
                          fontSize: '11px'
                        }}
                      />
                      <Chip 
                        label={milestone.status.replace('-', ' ').toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${milestone.status === 'completed' ? colors.success : 
                                             milestone.status === 'in-progress' ? colors.caramelEssence : 
                                             colors.sapphireDust}20`,
                          color: milestone.status === 'completed' ? colors.success : 
                                 milestone.status === 'in-progress' ? colors.caramelEssence : 
                                 colors.sapphireDust,
                          fontSize: '11px'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                      {milestone.project}
                    </Typography>
                    
                    {milestone.description && (
                      <Typography variant="body2" sx={{ color: colors.textMuted }}>
                        {milestone.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

// Resources View Component
const ResourcesView = ({ teamMembers, tasks, projects, selectedProjects, colors }) => {
  const resourceData = useMemo(() => {
    return teamMembers.map(member => {
      const memberTasks = tasks.filter(t => 
        t.assignedTo === member.id && selectedProjects.includes(t.projectId)
      );
      
      const completedTasks = memberTasks.filter(t => t.status === 'completed').length;
      const inProgressTasks = memberTasks.filter(t => t.status === 'in-progress').length;
      const pendingTasks = memberTasks.filter(t => t.status === 'pending').length;
      
      const workload = memberTasks.length * 10; // Simple workload calculation
      
      return {
        ...member,
        totalTasks: memberTasks.length,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        workload,
        efficiency: memberTasks.length > 0 ? Math.round((completedTasks / memberTasks.length) * 100) : 0
      };
    }).filter(member => member.totalTasks > 0);
  }, [teamMembers, tasks, selectedProjects]);
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: colors.textPrimary }}>
        Team Resource Allocation
      </Typography>
      
      {resourceData.length === 0 ? (
        <Card sx={{ backgroundColor: colors.cardBackground, textAlign: 'center', p: 4 }}>
          <Group size={48} color={colors.textMuted} />
          <Typography sx={{ mt: 2, color: colors.textSecondary }}>
            No resource data available for selected projects
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 3 }}>
          {resourceData.map(member => (
            <Card key={member.id} sx={{ backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    src={member.avatar}
                    sx={{ width: 48, height: 48, backgroundColor: colors.caramelEssence }}
                  >
                    {member.initials || (member.firstName?.[0] + member.lastName?.[0])}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: colors.textPrimary }}>
                      {member.name || `${member.firstName} ${member.lastName}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      {member.position || member.role}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={`${member.efficiency}% efficiency`}
                    size="small"
                    sx={{
                      backgroundColor: member.efficiency >= 80 ? `${colors.success}20` :
                                      member.efficiency >= 60 ? `${colors.caramelEssence}20` :
                                      `${colors.warning}20`,
                      color: member.efficiency >= 80 ? colors.success :
                             member.efficiency >= 60 ? colors.caramelEssence :
                             colors.warning,
                      fontSize: '11px'
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: colors.sapphireDust }}>
                      {member.totalTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Total Tasks
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: colors.success }}>
                      {member.completedTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Completed
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: colors.caramelEssence }}>
                      {member.inProgressTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      In Progress
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: colors.sapphireDust }}>
                      {member.pendingTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Pending
                    </Typography>
                  </Box>
                </Box>
                
                {/* Workload Bar */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Workload
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                      {member.workload > 80 ? 'High' : member.workload > 40 ? 'Medium' : 'Low'}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(member.workload, 100)} 
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.border,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: member.workload > 80 ? colors.error :
                                        member.workload > 40 ? colors.caramelEssence :
                                        colors.success,
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

// Critical Path View Component
const CriticalPathView = ({ projects, tasks, selectedProjects, colors }) => {
  const criticalPathData = useMemo(() => {
    const filteredProjects = projects.filter(p => selectedProjects.includes(p.id));
    
    return filteredProjects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.id);
      const highPriorityTasks = projectTasks.filter(t => t.priority === 'high' || t.priority === 'urgent');
      const overdueTasks = projectTasks.filter(t => {
        const dueDate = parseISO(t.dueDate || '2024-12-31');
        return t.status !== 'completed' && dueDate < new Date();
      });
      
      const criticalScore = (highPriorityTasks.length * 2) + (overdueTasks.length * 3);
      
      return {
        ...project,
        criticalTasks: highPriorityTasks,
        overdueTasks,
        criticalScore,
        risk: criticalScore > 8 ? 'high' : criticalScore > 4 ? 'medium' : 'low'
      };
    }).sort((a, b) => b.criticalScore - a.criticalScore);
  }, [projects, tasks, selectedProjects]);
  
  const getRiskPalette = (risk) => {
    switch (risk) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textMuted;
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: colors.textPrimary }}>
        Critical Path Analysis
      </Typography>
      
      {criticalPathData.length === 0 ? (
        <Card sx={{ backgroundColor: colors.cardBackground, textAlign: 'center', p: 4 }}>
          <AlertCircle size={48} color={colors.textMuted} />
          <Typography sx={{ mt: 2, color: colors.textSecondary }}>
            No critical path data available for selected projects
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {criticalPathData.map(project => (
            <Card key={project.id} sx={{ backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>
                      {project.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={`${project.risk.toUpperCase()} RISK`}
                        size="small"
                        sx={{
                          backgroundColor: `${getRiskPalette(project.risk)}20`,
                          color: getRiskPalette(project.risk),
                          fontWeight: 600,
                          fontSize: '11px'
                        }}
                      />
                      <Chip 
                        label={`Critical Score: ${project.criticalScore}`}
                        size="small"
                        sx={{
                          backgroundColor: colors.raptureLight,
                          color: colors.textSecondary,
                          fontSize: '11px'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      {project.criticalTasks.length} critical tasks • {project.overdueTasks.length} overdue tasks
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Due Date
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                      {format(parseISO(project.endDate || '2024-12-31'), 'MMM dd')}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Critical Tasks */}
                {project.criticalTasks.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: colors.textSecondary, fontWeight: 600 }}>
                      Critical Tasks
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {project.criticalTasks.slice(0, 3).map(task => (
                        <Box key={task.id} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 1,
                          backgroundColor: colors.raptureLight,
                          borderRadius: 1
                        }}>
                          <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                            {task.name || task.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip 
                              label={task.priority.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: task.priority === 'urgent' ? `${colors.error}20` : `${colors.warning}20`,
                                color: task.priority === 'urgent' ? colors.error : colors.warning,
                                fontSize: '10px',
                                height: 20
                              }}
                            />
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '12px' }}>
                              {format(parseISO(task.dueDate || '2024-12-31'), 'MMM dd')}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                      {project.criticalTasks.length > 3 && (
                        <Typography variant="body2" sx={{ color: colors.textMuted, fontSize: '12px', textAlign: 'center' }}>
                          +{project.criticalTasks.length - 3} more critical tasks
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                
                {/* Overdue Tasks */}
                {project.overdueTasks.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: colors.error, fontWeight: 600 }}>
                      Overdue Tasks ({project.overdueTasks.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {project.overdueTasks.slice(0, 4).map(task => (
                        <Chip
                          key={task.id}
                          label={task.name || task.title}
                          size="small"
                          sx={{
                            backgroundColor: `${colors.error}20`,
                            color: colors.error,
                            fontSize: '11px'
                          }}
                        />
                      ))}
                      {project.overdueTasks.length > 4 && (
                        <Chip
                          label={`+${project.overdueTasks.length - 4} more`}
                          size="small"
                          sx={{
                            backgroundColor: colors.border,
                            color: colors.textMuted,
                            fontSize: '11px'
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

// Task Edit Dialog Component
const TaskEditDialog = ({ open, task, onClose, onSave, colors, projects, teamMembers }) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    description: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || task.title || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        assignedTo: task.assignedTo || '',
        description: task.description || ''
      });
    }
  }, [task]);

  const handleSave = () => {
    if (task) {
      onSave(task.id, formData);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: colors.textPrimary }}>
        Edit Task: {task.name || task.title}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Task Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on-hold">On Hold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              value={formData.dueDate ? format(parseISO(formData.dueDate), 'yyyy-MM-dd') : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                label="Assigned To"
              >
                {teamMembers.map(member => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name || `${member.firstName} ${member.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{ backgroundColor: colors.caramelEssence }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Quick Actions Dialog Component
const QuickActionsDialog = ({ 
  open, 
  onClose, 
  colors, 
  onDateRangeChange, 
  currentDateRange, 
  timelineView, 
  onViewChange 
}) => {
  const [dateRange, setDateRange] = useState(currentDateRange);

  const handleDateRangeApply = () => {
    onDateRangeChange(dateRange.start, dateRange.end);
    onClose();
  };

  const quickDateRanges = [
    { label: 'Next 30 Days', days: 30 },
    { label: 'Next 60 Days', days: 60 },
    { label: 'Next 90 Days', days: 90 },
    { label: 'Next 6 Months', days: 180 },
    { label: 'Next Year', days: 365 }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: colors.textPrimary }}>
        Timeline Quick Actions
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: colors.textPrimary }}>
            Quick Date Ranges
          </Typography>
          
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {quickDateRanges.map((range, index) => (
              <Grid item xs={6} key={index}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const start = new Date();
                    const end = addDays(start, range.days);
                    setDateRange({ start, end });
                  }}
                  sx={{
                    borderPalette: colors.border,
                    color: colors.textSecondary,
                    '&:hover': { backgroundColor: colors.raptureLight }
                  }}
                >
                  {range.label}
                </Button>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h6" sx={{ mb: 2, color: colors.textPrimary }}>
            Timeline Views
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              variant={timelineView === 'weekly' ? 'contained' : 'outlined'}
              onClick={() => onViewChange('weekly')}
              sx={{
                backgroundColor: timelineView === 'weekly' ? colors.caramelEssence : 'transparent',
                color: timelineView === 'weekly' ? 'white' : colors.textSecondary
              }}
            >
              Weekly View
            </Button>
            <Button
              variant={timelineView === 'monthly' ? 'contained' : 'outlined'}
              onClick={() => onViewChange('monthly')}
              sx={{
                backgroundColor: timelineView === 'monthly' ? colors.caramelEssence : 'transparent',
                color: timelineView === 'monthly' ? 'white' : colors.textSecondary
              }}
            >
              Monthly View
            </Button>
          </Box>
          
          <Typography variant="h6" sx={{ mb: 2, color: colors.textPrimary }}>
            Current Date Range
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={format(dateRange.start, 'yyyy-MM-dd')}
              onChange={(e) => setDateRange(prev => ({ 
                ...prev, 
                start: new Date(e.target.value) 
              }))}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              value={format(dateRange.end, 'yyyy-MM-dd')}
              onChange={(e) => setDateRange(prev => ({ 
                ...prev, 
                end: new Date(e.target.value) 
              }))}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleDateRangeApply} 
          variant="contained"
          sx={{ backgroundColor: colors.caramelEssence }}
        >
          Apply Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimelinePage;