import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Grid,
  useTheme
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
import { Gantt } from 'wx-react-gantt';
import 'wx-react-gantt/dist/gantt.css';
import '../styles/gantt-custom.css';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import apiService from '../services/api/apiService';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, differenceInDays, parseISO, isWithinInterval } from 'date-fns';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const TimelinePage = () => {
  // Get data from context and URL parameters
  const { projects: contextProjects, tasks: contextTasks, teamMembers: contextTeamMembers } = useData();
  const { user, canEditProject, getAccessibleProjects } = useAuth();
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('project');
  
  // State management
  const [activeTab, setActiveTab] = useState('gantt');
  const [projects, setProjects] = useState(contextProjects || []);
  const [tasks, setTasks] = useState(contextTasks || []);
  const [teamMembers, setTeamMembers] = useState(contextTeamMembers || []);
  const [loading, setLoading] = useState(false);
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
  
  // Project-specific editing state
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedTaskForComment, setSelectedTaskForComment] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [comments, setComments] = useState([]);
  const [criticalPath, setCriticalPath] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  
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

  // Update state when context data changes
  useEffect(() => {
    if (contextProjects && user) {
      // Get only projects the user can access
      const accessibleProjects = getAccessibleProjects(contextProjects);
      setProjects(accessibleProjects);
      
      // If project ID is in URL and user can access it, select only that project
      if (projectIdFromUrl && accessibleProjects.some(p => p.id === projectIdFromUrl)) {
        setSelectedProjects([projectIdFromUrl]);
        setSelectedProject(accessibleProjects.find(p => p.id === projectIdFromUrl));
        setCanEdit(canEditProject(projectIdFromUrl));
      } else {
        // For non-admin users, default to first accessible project
        if (user.role === 'project_manager' && accessibleProjects.length > 0) {
          const firstProject = accessibleProjects[0];
          setSelectedProjects([firstProject.id]);
          setSelectedProject(firstProject);
          setCanEdit(canEditProject(firstProject.id));
        } else {
          // Admin/co-founder can see all projects but editing is restricted
          setSelectedProjects(accessibleProjects.map(p => p.id));
          setCanEdit(false); // No editing when multiple projects are selected
        }
      }
    }
  }, [contextProjects, projectIdFromUrl, user, getAccessibleProjects, canEditProject]);

  useEffect(() => {
    if (contextTasks) {
      setTasks(contextTasks);
    }
  }, [contextTasks]);

  useEffect(() => {
    if (contextTeamMembers) {
      setTeamMembers(contextTeamMembers);
    }
  }, [contextTeamMembers]);

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
    // For project-specific editing, only allow single project selection
    if (user?.role === 'project_manager') {
      setSelectedProjects([projectId]);
      const project = projects.find(p => p.id === projectId);
      setSelectedProject(project);
      setCanEdit(canEditProject(projectId));
    } else {
      // Admin/co-founder can toggle multiple projects but cannot edit
      setSelectedProjects(prev => 
        prev.includes(projectId) 
          ? prev.filter(id => id !== projectId)
          : [...prev, projectId]
      );
      setCanEdit(false); // Disable editing when multiple projects
    }
  }, [user, projects, canEditProject]);

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
    // Check if user can edit this task's project
    const task = tasks.find(t => t.id === taskId);
    if (!task || !canEditProject(task.projectId)) {
      console.warn('User cannot edit this task');
      return;
    }
    
    try {
      // Update local state optimistically
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, ...updates } : t
      ));
      
      // Try to update through API
      try {
        await apiService.updateTask(taskId, updates);
        console.log('✅ Task updated successfully via API');
      } catch (apiError) {
        console.log('API update failed (expected in demo mode):', apiError);
      }
      
      setTaskDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, [tasks, canEditProject]);

  const handleDateRangeChange = useCallback((start, end) => {
    setDateRange({ start, end });
  }, []);

  const handleTaskDragStart = useCallback((task) => {
    setDraggedTask(task);
  }, []);

  const handleTaskDrop = useCallback((date) => {
    if (draggedTask && canEdit) {
      const newDueDate = format(date, 'yyyy-MM-dd');
      handleTaskUpdate(draggedTask.id, { dueDate: newDueDate });
      setDraggedTask(null);
    }
  }, [draggedTask, canEdit, handleTaskUpdate]);
  
  // Milestone management handlers
  const handleCreateMilestone = useCallback(async (milestoneData) => {
    if (!selectedProject || !canEdit) return;
    
    try {
      const newMilestone = {
        id: Date.now().toString(),
        ...milestoneData,
        projectId: selectedProject.id,
        createdBy: user.id,
        createdAt: new Date().toISOString()
      };
      
      setMilestones(prev => [...prev, newMilestone]);
      
      // Try to save via API
      try {
        await apiService.createTask({ 
          ...newMilestone, 
          isMilestone: true,
          name: milestoneData.title
        });
        console.log('✅ Milestone created successfully via API');
      } catch (apiError) {
        console.log('API creation failed (expected in demo mode):', apiError);
      }
      
      setMilestoneDialogOpen(false);
    } catch (error) {
      console.error('Error creating milestone:', error);
    }
  }, [selectedProject, canEdit, user]);
  
  const handleDeleteMilestone = useCallback(async (milestoneId) => {
    if (!canEdit) return;
    
    try {
      setMilestones(prev => prev.filter(m => m.id !== milestoneId));
      
      // Try to delete via API
      try {
        await apiService.deleteTask(milestoneId);
        console.log('✅ Milestone deleted successfully via API');
      } catch (apiError) {
        console.log('API deletion failed (expected in demo mode):', apiError);
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  }, [canEdit]);
  
  // Comment management handlers
  const handleAddComment = useCallback(async (taskId, commentText) => {
    if (!user || !commentText.trim()) return;
    
    try {
      const newComment = {
        id: Date.now().toString(),
        taskId,
        text: commentText,
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString()
      };
      
      setComments(prev => [...prev, newComment]);
      
      // In a real implementation, this would be saved to the backend
      console.log('Comment added locally:', newComment);
      
      setCommentDialogOpen(false);
      setSelectedTaskForComment(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }, [user]);

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
      key="comments" 
      label="Comments" 
      icon={<Edit />} 
      isActive={activeTab === 'comments'} 
      onClick={() => handleTabChange('comments')} 
    />,
    <CleanTab 
      key="critical-path" 
      label="Critical Path" 
      icon={<AlertCircle />} 
      isActive={activeTab === 'critical-path'} 
      onClick={() => handleTabChange('critical-path')} 
    />,
    <CleanTab 
      key="resources" 
      label="Resources" 
      icon={<Group />} 
      isActive={activeTab === 'resources'} 
      onClick={() => handleTabChange('resources')} 
    />
  ];

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {/* Project Selector for single-project editing */}
      {user?.role === 'project_manager' && projects.length > 1 && (
        <FormControl size="small" sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel>Select Project</InputLabel>
          <Select
            value={selectedProject?.id || ''}
            onChange={(e) => {
              const projectId = e.target.value;
              handleProjectToggle(projectId);
            }}
            label="Select Project"
          >
            {projects.map(project => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      
      {/* Current project indicator */}
      {selectedProject && (
        <Chip
          label={`Editing: ${selectedProject.name}`}
          size="small"
          sx={{
            backgroundColor: canEdit ? `${colors.caramelEssence}20` : `${colors.textMuted}20`,
            color: canEdit ? colors.caramelEssence : colors.textMuted,
            mr: 2
          }}
        />
      )}
      
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
      
      {/* Add Milestone Button (only for editable projects) */}
      {canEdit && (
        <Tooltip title="Add Milestone">
          <IconButton 
            onClick={() => setMilestoneDialogOpen(true)}
            sx={{ 
              color: colors.caramelEssence,
              '&:hover': { backgroundColor: colors.raptureLight }
            }}
          >
            <Plus />
          </IconButton>
        </Tooltip>
      )}
      
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
          borderColor: colors.border,
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
        selectedProject={selectedProject}
        timelineView={timelineView}
        showMilestones={showMilestones}
        showDependencies={showDependencies}
        colors={colors}
        canEdit={canEdit}
        user={user}
        milestones={milestones}
        comments={comments}
        criticalPath={criticalPath}
        onProjectToggle={handleProjectToggle}
        onTaskClick={handleTaskClick}
        onTaskDragStart={handleTaskDragStart}
        onTaskDrop={handleTaskDrop}
        onCommentClick={(task) => {
          setSelectedTaskForComment(task);
          setCommentDialogOpen(true);
        }}
        onMilestoneDelete={handleDeleteMilestone}
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
      
      {/* Milestone Creation Dialog */}
      <MilestoneDialog
        open={milestoneDialogOpen}
        onClose={() => setMilestoneDialogOpen(false)}
        onSave={handleCreateMilestone}
        colors={colors}
        project={selectedProject}
      />
      
      {/* Comment Dialog */}
      <CommentDialog
        open={commentDialogOpen}
        task={selectedTaskForComment}
        onClose={() => {
          setCommentDialogOpen(false);
          setSelectedTaskForComment(null);
        }}
        onSave={handleAddComment}
        colors={colors}
        user={user}
        existingComments={comments.filter(c => c.taskId === selectedTaskForComment?.id)}
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
  selectedProject, 
  timelineView, 
  showMilestones, 
  showDependencies, 
  colors,
  canEdit,
  user,
  milestones,
  comments,
  criticalPath,
  onProjectToggle,
  onTaskClick,
  onTaskDragStart,
  onTaskDrop,
  onCommentClick,
  onMilestoneDelete,
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
      canEdit={canEdit}
      onTaskClick={onTaskClick}
      onTaskDragStart={onTaskDragStart}
      onTaskDrop={onTaskDrop}
      onTaskUpdate={onTaskClick} // Reuse the task click handler for updates
      draggedTask={draggedTask}
    />;
  }
  
  if (activeTab === 'milestones') {
    return <MilestonesView 
      projects={projects}
      tasks={tasks}
      selectedProjects={selectedProjects}
      selectedProject={selectedProject}
      milestones={milestones}
      colors={colors}
      canEdit={canEdit}
      onMilestoneDelete={onMilestoneDelete}
    />;
  }
  
  if (activeTab === 'comments') {
    return <CommentsView 
      tasks={tasks}
      selectedProjects={selectedProjects}
      selectedProject={selectedProject}
      comments={comments}
      colors={colors}
      canEdit={canEdit}
      user={user}
      onCommentClick={onCommentClick}
    />;
  }
  
  if (activeTab === 'critical-path') {
    return <CriticalPathView 
      projects={projects}
      tasks={tasks}
      selectedProjects={selectedProjects}
      selectedProject={selectedProject}
      colors={colors}
      canEdit={canEdit}
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
  canEdit,
  onTaskClick, 
  onTaskDragStart, 
  onTaskDrop,
  onTaskUpdate, 
  draggedTask 
}) => {
  // Validate and prepare data for Gantt with robust error handling
  const ganttData = useMemo(() => {
    try {
      if (!projects?.length || !tasks?.length) {
        return { tasks: [], links: [], isValid: false };
      }

      // Filter projects and tasks with safety checks
      const filteredProjects = (projects || []).filter(p => 
        p && p.id && selectedProjects.includes(p.id)
      );
      const filteredTasks = (tasks || []).filter(t => 
        t && t.id && t.projectId && selectedProjects.includes(t.projectId)
      );

      if (!filteredProjects.length) {
        return { tasks: [], links: [], isValid: false };
      }

      // Create Gantt tasks with comprehensive validation
      const ganttTasks = [];

      // Add projects as parent tasks
      filteredProjects.forEach(project => {
        if (!project || !project.id || !project.name) return;

        const projectStart = project.startDate ? 
          new Date(project.startDate) : new Date('2024-01-01');
        const projectEnd = project.endDate ? 
          new Date(project.endDate) : new Date('2024-12-31');
        
        // Validate dates
        if (isNaN(projectStart.getTime())) projectStart.setTime(new Date('2024-01-01').getTime());
        if (isNaN(projectEnd.getTime())) projectEnd.setTime(new Date('2024-12-31').getTime());
        if (projectEnd <= projectStart) projectEnd.setTime(projectStart.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        ganttTasks.push({
          id: `project-${project.id}`,
          text: String(project.name || 'Untitled Project'),
          start: projectStart,
          end: projectEnd,
          progress: Math.max(0, Math.min(1, (project.progress || 0) / 100)),
          type: 'summary',
          open: true
        });

        // Add project tasks
        const projectTasks = filteredTasks.filter(t => t.projectId === project.id);
        projectTasks.forEach(task => {
          if (!task || !task.id) return;

          const taskStart = task.createdAt || task.startDate ? 
            new Date(task.createdAt || task.startDate) : new Date();
          const taskEnd = task.dueDate ? 
            new Date(task.dueDate) : addDays(taskStart, 7);
          
          // Validate dates
          if (isNaN(taskStart.getTime())) taskStart.setTime(Date.now());
          if (isNaN(taskEnd.getTime())) taskEnd.setTime(taskStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          if (taskEnd <= taskStart) taskEnd.setTime(taskStart.getTime() + 24 * 60 * 60 * 1000);
          
          ganttTasks.push({
            id: String(task.id),
            text: String(task.title || task.name || 'Untitled Task'),
            start: taskStart,
            end: taskEnd,
            progress: task.status === 'completed' ? 1 : 
                     task.status === 'in_progress' ? 0.5 : 0,
            type: task.isMilestone ? 'milestone' : 'task',
            parent: `project-${project.id}`
          });
        });
      });

      console.log('✅ Gantt data prepared successfully:', { 
        taskCount: ganttTasks.length, 
        projects: filteredProjects.length,
        tasks: filteredTasks.length 
      });
      
      return { 
        tasks: ganttTasks, 
        links: [], 
        isValid: ganttTasks.length > 0 
      };
    } catch (error) {
      console.error('Error preparing Gantt data:', error);
      return { tasks: [], links: [], isValid: false };
    }
  }, [projects, tasks, selectedProjects]);

  const handleTaskUpdate = useCallback((task) => {
    // Handle task update (drag & drop, progress change, etc.)
    if (onTaskClick && task.id && !task.id.startsWith('project-')) {
      const originalTask = tasks.find(t => t.id === task.id);
      if (originalTask) {
        onTaskClick(originalTask);
      }
    }
  }, [tasks, onTaskClick]);

  // Show fallback if no valid data
  if (!ganttData.isValid || !ganttData.tasks.length) {
    return <TimelineFallback 
      timelineData={timelineData} 
      projects={projects.filter(p => selectedProjects.includes(p.id))}
      tasks={tasks.filter(t => selectedProjects.includes(t.projectId))}
      colors={colors}
      onTaskClick={onTaskClick}
    />;
  }

  return (
    <Box>
      {/* SVAR Gantt Chart with Enhanced Error Handling */}
      <Card sx={{ mb: 3, backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.textPrimary }}>
            Project Timeline - Interactive Gantt Chart
          </Typography>
          <Box sx={{ height: 600, width: '100%' }}>
            <GanttErrorBoundary fallback={
              <TimelineFallback 
                timelineData={timelineData} 
                projects={projects.filter(p => selectedProjects.includes(p.id))}
                tasks={tasks.filter(t => selectedProjects.includes(t.projectId))}
                colors={colors}
                canEdit={canEdit}
                onTaskClick={onTaskClick}
                onTaskUpdate={onTaskUpdate}
                showError={true}
              />
            }>
              {ganttData.isValid && ganttData.tasks.length > 0 ? (
                <Gantt
                  tasks={ganttData.tasks}
                  links={ganttData.links}
                />
              ) : (
                <TimelineFallback 
                  timelineData={timelineData} 
                  projects={projects.filter(p => selectedProjects.includes(p.id))}
                  tasks={tasks.filter(t => selectedProjects.includes(t.projectId))}
                  colors={colors}
                  onTaskClick={onTaskClick}
                />
              )}
            </GanttErrorBoundary>
          </Box>
        </CardContent>
      </Card>
      
      {/* Summary Statistics */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.sapphireDust }}>
                {ganttData.tasks.filter(t => t.type === 'summary').length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                Active Projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.caramelEssence }}>
                {ganttData.tasks.filter(t => t.type === 'task').length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                Total Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.success }}>
                {ganttData.tasks.filter(t => t.type === 'task' && t.progress === 1).length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.warning }}>
                {ganttData.tasks.filter(t => t.type === 'task' && t.progress > 0 && t.progress < 1).length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
const MilestonesView = ({ projects, tasks, selectedProjects, selectedProject, milestones, colors, canEdit, onMilestoneDelete }) => {
  const allMilestones = useMemo(() => {
    const projectMilestones = projects
      .filter(p => selectedProjects.includes(p.id))
      .map(project => ({
        id: `project-${project.id}`,
        title: `${project.name} Completion`,
        date: project.endDate,
        type: 'project',
        status: project.status,
        project: project.name,
        description: project.description,
        isSystemMilestone: true
      }));
    
    const taskMilestones = tasks
      .filter(t => selectedProjects.includes(t.projectId) && (t.priority === 'high' || t.isMilestone))
      .map(task => {
        const project = projects.find(p => p.id === task.projectId);
        return {
          id: `task-${task.id}`,
          title: task.name || task.title,
          date: task.dueDate,
          type: 'task',
          status: task.status,
          project: project?.name || 'Unknown Project',
          description: task.description,
          isSystemMilestone: false
        };
      });
    
    // Add custom milestones created by user
    const customMilestones = (milestones || [])
      .filter(m => selectedProjects.includes(m.projectId))
      .map(milestone => ({
        ...milestone,
        type: 'milestone',
        project: projects.find(p => p.id === milestone.projectId)?.name || 'Unknown Project',
        isSystemMilestone: false
      }));
    
    return [...projectMilestones, ...taskMilestones, ...customMilestones]
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [projects, tasks, selectedProjects, milestones]);
  
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
      
      {allMilestones.length === 0 ? (
        <Card sx={{ backgroundColor: colors.cardBackground, textAlign: 'center', p: 4 }}>
          <CheckCircle size={48} color={colors.textMuted} />
          <Typography sx={{ mt: 2, color: colors.textSecondary }}>
            No milestones found for selected projects
          </Typography>
          {canEdit && (
            <Typography variant="body2" sx={{ mt: 1, color: colors.textMuted }}>
              Create your first milestone to track project progress
            </Typography>
          )}
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {allMilestones.map((milestone, index) => (
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
const CriticalPathView = ({ projects, tasks, selectedProjects, selectedProject, colors, canEdit }) => {
  const criticalPathData = useMemo(() => {
    const filteredProjects = projects.filter(p => selectedProjects.includes(p.id));
    
    return filteredProjects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.id);
      const highPriorityTasks = projectTasks.filter(t => t.priority === 'high' || t.priority === 'urgent');
      const overdueTasks = projectTasks.filter(t => {
        const dueDate = parseISO(t.dueDate || '2024-12-31');
        return t.status !== 'completed' && dueDate < new Date();
      });
      const blockedTasks = projectTasks.filter(t => t.status === 'on-hold' || t.blocked);
      const dependentTasks = projectTasks.filter(t => t.dependencies && t.dependencies.length > 0);
      
      // Enhanced critical path calculation
      const criticalScore = 
        (highPriorityTasks.length * 2) + 
        (overdueTasks.length * 3) + 
        (blockedTasks.length * 2) +
        (dependentTasks.length * 1);
      
      // Calculate project timeline impact
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
      const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      // Identify critical path tasks (simplified algorithm)
      const criticalPathTasks = identifyCriticalPath(projectTasks);
      
      return {
        ...project,
        criticalTasks: highPriorityTasks,
        overdueTasks,
        blockedTasks,
        dependentTasks,
        criticalPathTasks,
        criticalScore,
        progressPercentage,
        risk: criticalScore > 8 ? 'high' : criticalScore > 4 ? 'medium' : 'low',
        timelineImpact: calculateTimelineImpact(overdueTasks, blockedTasks)
      };
    }).sort((a, b) => b.criticalScore - a.criticalScore);
  }, [projects, tasks, selectedProjects]);
  
  // Simple critical path identification
  const identifyCriticalPath = (projectTasks) => {
    // This is a simplified critical path algorithm
    // In a real implementation, this would use proper CPM calculations
    return projectTasks
      .filter(task => {
        const isHighPriority = task.priority === 'high' || task.priority === 'urgent';
        const hasNoDependents = !projectTasks.some(t => 
          t.dependencies && t.dependencies.includes(task.id)
        );
        const isNotCompleted = task.status !== 'completed';
        return isHighPriority || (!hasNoDependents && isNotCompleted);
      })
      .sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      });
  };
  
  // Calculate timeline impact of delays
  const calculateTimelineImpact = (overdueTasks, blockedTasks) => {
    const totalDelayDays = overdueTasks.reduce((total, task) => {
      const dueDate = parseISO(task.dueDate || '2024-12-31');
      const today = new Date();
      return total + Math.max(0, differenceInDays(today, dueDate));
    }, 0);
    
    return {
      delayDays: totalDelayDays,
      blockedCount: blockedTasks.length,
      severity: totalDelayDays > 30 ? 'critical' : totalDelayDays > 14 ? 'high' : 'medium'
    };
  };
  
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: colors.textPrimary }}>
          Critical Path Analysis
          {selectedProject && (
            <Typography component="span" variant="body2" sx={{ ml: 1, color: colors.textSecondary }}>
              • {selectedProject.name}
            </Typography>
          )}
        </Typography>
        
        {criticalPathData.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip 
              label={`${criticalPathData.reduce((sum, p) => sum + p.criticalPathTasks.length, 0)} Critical Tasks`}
              size="small"
              sx={{
                backgroundColor: `${colors.error}20`,
                color: colors.error,
                fontSize: '11px'
              }}
            />
            <Chip 
              label={`${criticalPathData.reduce((sum, p) => sum + p.overdueTasks.length, 0)} Overdue`}
              size="small"
              sx={{
                backgroundColor: `${colors.warning}20`,
                color: colors.warning,
                fontSize: '11px'
              }}
            />
          </Box>
        )}
      </Box>
      
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
                    
                    <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        {project.criticalPathTasks.length} critical path tasks
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        {project.overdueTasks.length} overdue
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        {Math.round(project.progressPercentage)}% complete
                      </Typography>
                    </Box>
                    
                    {project.timelineImpact.delayDays > 0 && (
                      <Box sx={{ 
                        p: 1, 
                        backgroundColor: `${colors.error}10`, 
                        borderRadius: 1,
                        border: `1px solid ${colors.error}30`,
                        mb: 1
                      }}>
                        <Typography variant="body2" sx={{ color: colors.error, fontWeight: 600 }}>
                          ⚠️ Timeline Impact: {project.timelineImpact.delayDays} days behind schedule
                        </Typography>
                        {project.timelineImpact.blockedCount > 0 && (
                          <Typography variant="body2" sx={{ color: colors.error }}>
                            {project.timelineImpact.blockedCount} blocked tasks affecting timeline
                          </Typography>
                        )}
                      </Box>
                    )}
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
                
                {/* Critical Path Tasks */}
                {project.criticalPathTasks.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: colors.error, fontWeight: 600 }}>
                      Critical Path Tasks (Impact on Timeline)
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {project.criticalPathTasks.slice(0, 4).map((task, index) => (
                        <Box key={task.id} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 1.5,
                          backgroundColor: index === 0 ? `${colors.error}15` : colors.raptureLight,
                          borderRadius: 1,
                          border: index === 0 ? `2px solid ${colors.error}30` : `1px solid ${colors.border}`
                        }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: index === 0 ? 600 : 400 }}>
                              {index === 0 && '🔥 '}{task.name || task.title}
                            </Typography>
                            {task.dependencies && task.dependencies.length > 0 && (
                              <Typography variant="caption" sx={{ color: colors.textMuted }}>
                                Depends on {task.dependencies.length} task(s)
                              </Typography>
                            )}
                          </Box>
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
                            {task.status === 'on-hold' && (
                              <Chip 
                                label="BLOCKED"
                                size="small"
                                sx={{
                                  backgroundColor: `${colors.error}20`,
                                  color: colors.error,
                                  fontSize: '10px',
                                  height: 20
                                }}
                              />
                            )}
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '12px' }}>
                              {format(parseISO(task.dueDate || '2024-12-31'), 'MMM dd')}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                      {project.criticalPathTasks.length > 4 && (
                        <Typography variant="body2" sx={{ color: colors.textMuted, fontSize: '12px', textAlign: 'center' }}>
                          +{project.criticalPathTasks.length - 4} more critical path tasks
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                
                {/* Overdue Tasks with Impact Analysis */}
                {project.overdueTasks.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: colors.error, fontWeight: 600 }}>
                      Overdue Tasks ({project.overdueTasks.length}) - Immediate Attention Needed
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {project.overdueTasks.slice(0, 3).map(task => {
                        const daysOverdue = Math.max(0, differenceInDays(new Date(), parseISO(task.dueDate || '2024-12-31')));
                        return (
                          <Chip
                            key={task.id}
                            label={`${task.name || task.title} (${daysOverdue}d overdue)`}
                            size="small"
                            sx={{
                              backgroundColor: `${colors.error}20`,
                              color: colors.error,
                              fontSize: '11px',
                              fontWeight: daysOverdue > 7 ? 600 : 400
                            }}
                          />
                        );
                      })}
                      {project.overdueTasks.length > 3 && (
                        <Chip
                          label={`+${project.overdueTasks.length - 3} more overdue`}
                          size="small"
                          sx={{
                            backgroundColor: `${colors.error}30`,
                            color: colors.error,
                            fontSize: '11px',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
                
                {/* Project Health Score */}
                <Box sx={{ mt: 2, p: 1, backgroundColor: colors.raptureLight, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                    Project Health Analysis
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={project.progressPercentage} 
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: colors.border,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: project.progressPercentage > 75 ? colors.success :
                                            project.progressPercentage > 50 ? colors.caramelEssence :
                                            colors.warning,
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 600, minWidth: 50 }}>
                      {Math.round(project.progressPercentage)}%
                    </Typography>
                    <Chip 
                      label={project.timelineImpact.severity.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: project.timelineImpact.severity === 'critical' ? `${colors.error}20` :
                                        project.timelineImpact.severity === 'high' ? `${colors.warning}20` :
                                        `${colors.success}20`,
                        color: project.timelineImpact.severity === 'critical' ? colors.error :
                               project.timelineImpact.severity === 'high' ? colors.warning :
                               colors.success,
                        fontSize: '10px'
                      }}
                    />
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
                    borderColor: colors.border,
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

// Timeline Fallback Component
const TimelineFallback = ({ timelineData, projects, tasks, colors, onTaskClick, showError = false }) => {
  if (showError) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 400,
        flexDirection: 'column',
        gap: 2,
        backgroundColor: colors.raptureLight,
        borderRadius: 2,
        p: 3
      }}>
        <TimelineIcon size={48} color={colors.textMuted} />
        <Typography variant="h6" color={colors.textPrimary} sx={{ mb: 1 }}>
          Interactive Gantt Chart Unavailable
        </Typography>
        <Typography color={colors.textSecondary} sx={{ textAlign: 'center', mb: 2 }}>
          The advanced Gantt chart is temporarily unavailable. Using fallback timeline view.
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
          sx={{ 
            borderColor: colors.sapphireDust,
            color: colors.sapphireDust,
            '&:hover': { backgroundColor: `${colors.sapphireDust}10` }
          }}
        >
          Try Refresh
        </Button>
      </Box>
    );
  }

  if (!timelineData.length && !projects.length) {
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
      {/* Fallback Timeline Chart */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: colors.textPrimary }}>
          Project Timeline - Overview Chart
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
      </Box>

      {/* Project Timeline Rows */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {projects.map(project => (
          <ProjectTimelineRow 
            key={project.id}
            project={project}
            tasks={tasks.filter(t => t.projectId === project.id)}
            colors={colors}
            canEdit={canEdit}
            onTaskClick={onTaskClick}
            onTaskDragStart={() => {}}
            onTaskUpdate={onTaskUpdate || (() => {})}
            draggedTask={null}
          />
        ))}
      </Box>

      {showError && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: colors.warning + '10', borderRadius: 1 }}>
          <Typography variant="body2" color={colors.warning}>
            ⚠️ Advanced timeline features are temporarily disabled. Project data is still accessible above.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Comments View Component
const CommentsView = ({ tasks, selectedProjects, selectedProject, comments, colors, canEdit, user, onCommentClick }) => {
  const filteredTasks = tasks.filter(t => selectedProjects.includes(t.projectId));
  const taskComments = comments || [];
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: colors.textPrimary }}>
        Timeline Comments
        {selectedProject && (
          <Typography component="span" variant="body2" sx={{ ml: 1, color: colors.textSecondary }}>
            • {selectedProject.name}
          </Typography>
        )}
      </Typography>
      
      {filteredTasks.length === 0 ? (
        <Card sx={{ backgroundColor: colors.cardBackground, textAlign: 'center', p: 4 }}>
          <Edit size={48} color={colors.textMuted} />
          <Typography sx={{ mt: 2, color: colors.textSecondary }}>
            No tasks available for comments
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredTasks.map(task => {
            const taskCommentsList = taskComments.filter(c => c.taskId === task.id);
            
            return (
              <Card key={task.id} sx={{ backgroundColor: colors.cardBackground, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>
                        {task.name || task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip 
                          label={task.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
                          size="small"
                          sx={{
                            backgroundColor: task.status === 'completed' ? `${colors.success}20` :
                                            task.status === 'in-progress' ? `${colors.caramelEssence}20` :
                                            `${colors.sapphireDust}20`,
                            color: task.status === 'completed' ? colors.success :
                                   task.status === 'in-progress' ? colors.caramelEssence :
                                   colors.sapphireDust,
                            fontSize: '11px'
                          }}
                        />
                        <Chip 
                          label={`${taskCommentsList.length} comments`}
                          size="small"
                          sx={{
                            backgroundColor: colors.raptureLight,
                            color: colors.textSecondary,
                            fontSize: '11px'
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Button 
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => onCommentClick(task)}
                      disabled={!canEdit}
                      sx={{
                        borderColor: colors.caramelEssence,
                        color: colors.caramelEssence,
                        '&:hover': { backgroundColor: `${colors.caramelEssence}10` },
                        '&.Mui-disabled': { opacity: 0.5 }
                      }}
                    >
                      Add Comment
                    </Button>
                  </Box>
                  
                  {/* Comments List */}
                  {taskCommentsList.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: colors.textSecondary, fontWeight: 600 }}>
                        Comments
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {taskCommentsList.slice(0, 3).map(comment => (
                          <Box key={comment.id} sx={{ 
                            p: 2,
                            backgroundColor: colors.raptureLight,
                            borderRadius: 1,
                            borderLeft: `3px solid ${colors.caramelEssence}`
                          }}>
                            <Typography variant="body2" sx={{ color: colors.textPrimary, mb: 1 }}>
                              {comment.text}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                              {comment.authorName} • {format(parseISO(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                            </Typography>
                          </Box>
                        ))}
                        {taskCommentsList.length > 3 && (
                          <Typography variant="body2" sx={{ color: colors.textMuted, fontSize: '12px', textAlign: 'center' }}>
                            +{taskCommentsList.length - 3} more comments
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

// Milestone Dialog Component
const MilestoneDialog = ({ open, onClose, onSave, colors, project }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    priority: 'high'
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: '',
        description: '',
        date: '',
        priority: 'high'
      });
    }
  }, [open]);

  const handleSave = () => {
    if (formData.title && formData.date) {
      onSave(formData);
      setFormData({ title: '', description: '', date: '', priority: 'high' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: colors.textPrimary }}>
        Create Milestone
        {project && (
          <Typography component="span" variant="body2" sx={{ ml: 1, color: colors.textSecondary }}>
            for {project.name}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Milestone Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              variant="outlined"
              size="small"
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Target Date"
              type="date"
              fullWidth
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              size="small"
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
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
          disabled={!formData.title || !formData.date}
          sx={{ backgroundColor: colors.caramelEssence }}
        >
          Create Milestone
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Comment Dialog Component
const CommentDialog = ({ open, task, onClose, onSave, colors, user, existingComments = [] }) => {
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (open) {
      setCommentText('');
    }
  }, [open]);

  const handleSave = () => {
    if (commentText.trim() && task) {
      onSave(task.id, commentText);
      setCommentText('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: colors.textPrimary }}>
        Add Comment to Task
        {task && (
          <Typography component="span" variant="body2" sx={{ ml: 1, color: colors.textSecondary }}>
            • {task.name || task.title}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Existing Comments */}
          {existingComments.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.textPrimary }}>
                Previous Comments ({existingComments.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 200, overflowY: 'auto' }}>
                {existingComments.map(comment => (
                  <Box key={comment.id} sx={{ 
                    p: 2,
                    backgroundColor: colors.raptureLight,
                    borderRadius: 1
                  }}>
                    <Typography variant="body2" sx={{ color: colors.textPrimary, mb: 1 }}>
                      {comment.text}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      {comment.authorName} • {format(parseISO(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          
          {/* New Comment */}
          <Typography variant="h6" sx={{ mb: 2, color: colors.textPrimary }}>
            Add New Comment
          </Typography>
          <TextField
            label="Your comment"
            fullWidth
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            placeholder="Enter your comment about this task..."
            helperText={`Writing as ${user?.name || 'Unknown User'}`}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!commentText.trim()}
          sx={{ backgroundColor: colors.caramelEssence }}
        >
          Add Comment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Error Boundary Component for Gantt Chart
class GanttErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Gantt Error Boundary caught error:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 400,
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography color="error">
            Gantt chart error occurred
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default TimelinePage;