import React, { useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Avatar, 
  Card, 
  CardContent,
  Tooltip,
  Chip,
  LinearProgress
} from '@mui/material';
// Iconoir icons - safe board view icons
import {
  MdCalendarToday as CalendarToday,
  MdPerson as PersonIcon,
  MdBusiness as Business,
  MdGroup as AccountTree
} from 'react-icons/md';
import { ProjectStatusChip, ProjectTypeChip, PriorityChip } from '../ui/StatusChip';
import ProjectTeamAvatars from '../ui/ProjectTeamAvatars';
import { getProjectStatusConfig, getProjectTypeConfig, getPriorityConfig } from '../../utils/statusConfig';

const BoardView = ({ tasks = [], projects = [], teamMembers = [], clients = [], onProjectUpdate, showProjects = true }) => {

  // Group projects by status
  const columns = useMemo(() => {
    if (showProjects) {
      const columnConfig = [
        {
          id: 'on-tender',
          title: 'ON TENDER',
          color: '#3498db',
          bgPalette: '#ebf3fd'
        },
        {
          id: 'awarded',
          title: 'AWARDED', 
          color: '#27ae60',
          bgPalette: '#eafaf1'
        },
        {
          id: 'active',
          title: 'ACTIVE',
          color: '#9b59b6',
          bgPalette: '#f4ecf7'
        },
        {
          id: 'completed',
          title: 'COMPLETED',
          color: '#2c3e50',
          bgPalette: '#eaeded'
        }
      ];

      const grouped = {};
      
      // Initialize columns
      columnConfig.forEach(col => {
        grouped[col.id] = {
          ...col,
          items: []
        };
      });

      // Group projects by status
      projects.forEach(project => {
        let status = project.status || 'on-tender';
        
        if (grouped[status]) {
          grouped[status].items.push(project);
        } else {
          // Fallback to on-tender if status doesn't match
          grouped['on-tender'].items.push(project);
        }
      });

      return grouped;
    } else {
      // Original task-based columns
      const columnConfig = [
        {
          id: 'pending',
          title: 'TO DO',
          color: '#f39c12',
          bgPalette: '#fef9e7'
        },
        {
          id: 'in-progress',
          title: 'IN PROGRESS', 
          color: '#3498db',
          bgPalette: '#ebf5fb'
        },
        {
          id: 'completed',
          title: 'DONE',
          color: '#27ae60',
          bgPalette: '#eafaf1'
        }
      ];

      const grouped = {};
      
      // Initialize columns
      columnConfig.forEach(col => {
        grouped[col.id] = {
          ...col,
          items: []
        };
      });

      // Group tasks by status
      tasks.forEach(task => {
        let status = task.status || 'pending';
        
        // Handle different status formats
        if (status === 'in_progress') {
          status = 'in-progress';
        }
        
        if (grouped[status]) {
          grouped[status].items.push(task);
        } else {
          // Fallback to pending if status doesn't match
          grouped['pending'].items.push(task);
        }
      });

      return grouped;
    }
  }, [tasks, projects, showProjects]);

  // Utility functions
  const getAssignedMember = (assignedTo) => {
    return teamMembers.find(member => member.id === assignedTo);
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.companyName : 'No Client';
  };

  const calculateProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Overdue ${Math.abs(diffDays)}d`, color: '#e74c3c', urgent: true };
    if (diffDays === 0) return { text: 'Due today', color: '#f39c12', urgent: true };
    if (diffDays === 1) return { text: 'Due tomorrow', color: '#e67e22', urgent: false };
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: '#3498db', urgent: false };
    return { text: date.toLocaleDateString(), color: '#7f8c8d', urgent: false };
  };

  const ProjectCard = ({ project }) => {
    const typeConfig = getProjectTypeConfig(project.type);
    const statusConfig = getProjectStatusConfig(project.status);
    const progress = calculateProjectProgress(project.id);
    
    const formatDate = (dateString) => {
      if (!dateString) return 'Not set';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    };

    return (
      <Card
        sx={{
          mb: 1.5,
          cursor: 'pointer',
          backgroundColor: 'white',
          border: '1px solid #E9ECEF',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)'
          }
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Project Name */}
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              mb: 1,
              color: '#2C3E50',
              lineHeight: 1.4
            }}
          >
            {project.name}
          </Typography>

          {/* Type and Status */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            <ProjectTypeChip type={project.type} size="small" />
            <ProjectStatusChip status={project.status} size="small" />
          </Box>

          {/* Client */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Business sx={{ fontSize: 16, color: '#7f8c8d' }} />
            <Typography variant="caption" color="text.secondary">
              {getClientName(project.clientId)}
            </Typography>
          </Box>

          {/* Timeline */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <CalendarToday sx={{ fontSize: 16, color: '#7f8c8d' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </Typography>
          </Box>

          {/* Progress */}
          {progress > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ 
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#E9ECEF',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: progress === 100 ? '#27ae60' : '#3498db',
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          )}

          {/* Team Members */}
          <Box>
            <ProjectTeamAvatars
              teamMembers={teamMembers}
              projectTeamIds={project.teamMembers || []}
              maxAvatars={3}
              size="small"
              compact={true}
              projectName={project.name}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const TaskCard = ({ task }) => {
    const assignedMember = getAssignedMember(task.assignedTo);
    const priority = getPriorityConfig(task.priority);
    const dueInfo = formatDueDate(task.dueDate);

    return (
      <Card
        sx={{
          mb: 1.5,
          cursor: 'pointer',
          backgroundColor: 'white',
          border: '1px solid #E9ECEF',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)'
          }
        }}
      >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {/* Task Name */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500, 
                  mb: 1,
                  color: '#2C3E50',
                  lineHeight: 1.4
                }}
              >
                {task.name}
              </Typography>

              {/* Priority Badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <PriorityChip 
                  priority={task.priority} 
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem'
                  }}
                />
              </Box>

              {/* Project Name */}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#7f8c8d',
                  display: 'block',
                  mb: 1
                }}
              >
                {getProjectName(task.projectId)}
              </Typography>

              {/* Due Date */}
              {dueInfo && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <CalendarToday sx={{ fontSize: 12, color: dueInfo.color, mr: 0.5 }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: dueInfo.color,
                      fontWeight: dueInfo.urgent ? 600 : 400
                    }}
                  >
                    {dueInfo.text}
                  </Typography>
                </Box>
              )}

              {/* Bottom Row - Assignee and Progress */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 1
              }}>
                {/* Assigned Member */}
                <Box>
                  {assignedMember ? (
                    <Tooltip title={assignedMember.fullName}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '0.7rem',
                          backgroundColor: assignedMember.rolePalette || '#3498db'
                        }}
                      >
                        {assignedMember.initials}
                      </Avatar>
                    </Tooltip>
                  ) : (
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: '#bdc3c7'
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 14 }} />
                    </Avatar>
                  )}
                </Box>

                {/* Progress */}
                {task.progress !== undefined && task.progress > 0 && (
                  <Chip
                    label={`${task.progress}%`}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      borderColor: task.progress === 100 ? '#27ae60' : '#3498db',
                      color: task.progress === 100 ? '#27ae60' : '#3498db'
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
    );
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
      <Box 
        className="board-container"
        sx={{ 
          display: 'flex', 
          gap: 3, 
          overflowX: 'auto', 
          height: '100%',
          pb: 2
        }}
      >
          {Object.entries(columns).map(([columnId, column]) => (
            <Paper
              key={columnId}
              elevation={0}
              sx={{
                minWidth: 320,
                maxWidth: 320,
                backgroundColor: column.bgPalette,
                border: `1px solid ${column.color}30`,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content',
                maxHeight: '100%'
              }}
            >
              {/* Column Header */}
              <Box 
                sx={{ 
                  p: 2, 
                  borderBottom: `1px solid ${column.color}30`,
                  backgroundColor: 'white',
                  borderRadius: '8px 8px 0 0'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600,
                      color: column.color,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}
                  >
                    {column.title}
                  </Typography>
                  <Chip 
                    label={column.items?.length || 0} 
                    size="small" 
                    sx={{ 
                      height: 20,
                      backgroundColor: column.color,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              </Box>
              
              {/* Items List */}
              <Box
                sx={{ 
                  p: 2, 
                  minHeight: 400,
                  maxHeight: 'calc(100vh - 350px)',
                  overflowY: 'auto',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
              >
                {(!column.items || column.items.length === 0) ? (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 4, 
                      color: '#7f8c8d',
                      border: '2px dashed #E9ECEF',
                      borderRadius: 2,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Typography variant="body2">
                      No {showProjects ? 'projects' : 'tasks'} in this column
                    </Typography>
                  </Box>
                ) : (
                  column.items.map((item) => (
                    showProjects ? (
                      <ProjectCard 
                        key={item.id} 
                        project={item} 
                      />
                    ) : (
                      <TaskCard 
                        key={item.id} 
                        task={item} 
                      />
                    )
                  ))
                )}
              </Box>
            </Paper>
          ))}
        </Box>
    </Box>
  );
};

export default BoardView;