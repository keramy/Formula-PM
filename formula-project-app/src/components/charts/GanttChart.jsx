import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Alert,
  Button,
  Grid
} from '@mui/material';
import { FaCalendarAlt as TimelineIcon, FaArrowUp as UpgradeIcon } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import EnhancedGanttChart from './EnhancedGanttChart';
import { useAuthenticatedData } from '../../hooks/useAuthenticatedData';

const priorityPalettes = {
  low: '#27ae60',
  medium: '#f39c12',
  high: '#e67e22',
  urgent: '#e74c3c'
};

function GanttChart({ tasks = [], projects = [], scopeItems = [], teamMembers = [] }) {
  const [useEnhancedGantt, setUseEnhancedGantt] = useState(true);
  const { shopDrawings = [], materialSpecs = [] } = useAuthenticatedData();

  // Determine if we should show the enhanced Gantt
  const shouldShowEnhanced = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeScopeItems = Array.isArray(scopeItems) ? scopeItems : [];
    return useEnhancedGantt && (safeTasks.length > 0 || safeProjects.length > 0 || safeScopeItems.length > 0);
  }, [useEnhancedGantt, tasks, projects, scopeItems]);

  const handleTaskUpdate = (task, updates) => {
    // Task updated
    // This would integrate with your task update logic
  };

  const handleItemClick = (item) => {
    // Gantt item clicked
    // This would handle navigation or detail views
  };

  if (tasks.length === 0 && projects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <TimelineIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Timeline Data Available
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Timeline will appear here as you add projects and tasks
        </Typography>
      </Box>
    );
  }

  if (shouldShowEnhanced) {
    return (
      <Box sx={{ width: '100%' }}>
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => setUseEnhancedGantt(false)}
            >
              Use Simple View
            </Button>
          }
        >
          Showing Enhanced Gantt Chart with scope and workflow integration
        </Alert>
        
        <EnhancedGanttChart
          projects={projects}
          tasks={tasks}
          teamMembers={teamMembers}
          scopeItems={scopeItems}
          shopDrawings={shopDrawings}
          materialSpecs={materialSpecs}
          onTaskUpdate={handleTaskUpdate}
          onItemClick={handleItemClick}
          height={600}
          showToolbar={true}
          dataType="mixed"
        />
      </Box>
    );
  }

  const createTimelineData = () => {
    const today = new Date();
    const timelineData = [];

    for (let i = -7; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const safeTasks = Array.isArray(tasks) ? tasks : [];
      const dayTasks = safeTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === date.toDateString();
      });

      timelineData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0],
        tasks: dayTasks.length,
        completedTasks: dayTasks.filter(t => t.status === 'completed').length,
        pendingTasks: dayTasks.filter(t => t.status === 'pending').length,
        isToday: date.toDateString() === today.toDateString(),
        dayTasks: dayTasks
      });
    }

    return timelineData.filter(day => day.tasks > 0);
  };

  const timelineData = createTimelineData();

  const createTaskTimeline = () => {
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    return sortedTasks.map(task => {
      const project = projects.find(p => p.id === task.projectId);
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const isOverdue = dueDate < today && task.status !== 'completed';
      const daysFromToday = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      
      return {
        ...task,
        projectName: project ? project.name : 'Unknown',
        isOverdue,
        daysFromToday,
        formattedDate: dueDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: dueDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        })
      };
    });
  };

  const taskTimeline = createTaskTimeline();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Tasks: {data.tasks}
          </Typography>
          <Typography variant="body2" sx={{ color: '#27ae60' }}>
            Completed: {data.completedTasks}
          </Typography>
          <Typography variant="body2" sx={{ color: '#f39c12' }}>
            Pending: {data.pendingTasks}
          </Typography>
          {data.dayTasks.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" display="block">
                Tasks:
              </Typography>
              {data.dayTasks.slice(0, 3).map((task, index) => (
                <Typography key={index} variant="caption" display="block" sx={{ ml: 1 }}>
                  • {task.name}
                </Typography>
              ))}
              {data.dayTasks.length > 3 && (
                <Typography variant="caption" display="block" sx={{ ml: 1 }}>
                  ... and {data.dayTasks.length - 3} more
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Enhanced Gantt Upgrade Alert */}
      <Alert 
        severity="info" 
        sx={{ mb: 3 }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            startIcon={<UpgradeIcon />}
            onClick={() => setUseEnhancedGantt(true)}
          >
            Upgrade to Enhanced Gantt
          </Button>
        }
      >
        You're viewing the simple timeline. Try the Enhanced Gantt Chart for advanced project visualization and dependency management.
      </Alert>

      {timelineData.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Task Distribution Timeline
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tasks" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      <Typography variant="h6" gutterBottom>
        Task Timeline
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {taskTimeline.map((task) => (
          <Paper
            key={task.id}
            sx={{
              p: 2,
              borderLeft: `4px solid ${task.isOverdue ? '#e74c3c' : priorityPalettes[task.priority]}`,
              backgroundColor: task.status === 'completed' ? '#f8f9fa' : 
                             task.isOverdue ? '#fff5f5' : 'white',
              opacity: task.status === 'completed' ? 0.7 : 1
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 500,
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                  }}
                >
                  {task.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.projectName} • {task.assignee}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={task.priority}
                  size="small"
                  sx={{
                    backgroundColor: `${priorityPalettes[task.priority]}20`,
                    color: priorityPalettes[task.priority],
                    fontWeight: 'bold'
                  }}
                />
                
                <Chip
                  label={task.formattedDate}
                  size="small"
                  color={task.isOverdue ? 'error' : task.daysFromToday <= 1 ? 'warning' : 'default'}
                />
                
                {task.status === 'completed' && (
                  <Chip
                    label="Done"
                    size="small"
                    color="success"
                  />
                )}
                
                {task.isOverdue && task.status !== 'completed' && (
                  <Chip
                    label="Overdue"
                    size="small"
                    color="error"
                  />
                )}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
      
      {taskTimeline.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No tasks to display in timeline
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default GanttChart;