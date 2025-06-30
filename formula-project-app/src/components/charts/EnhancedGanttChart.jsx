import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  MdZoomIn as ZoomInIcon,
  MdZoomOut as ZoomOutIcon,
  MdRefresh as RefreshIcon,
  MdViewModule as ViewModuleIcon,
  MdList as ViewListIcon,
  MdFilterList as FilterIcon,
  MdSettings as SettingsIcon,
  MdDownload as ExportIcon,
  MdAdd as AddIcon,
  MdTimeline as TimelineIcon
} from 'react-icons/md';
// import { Gantt } from 'frappe-gantt';
import { format, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import connectionService from '../../services/connectionService';

// Custom CSS for Frappe Gantt styling
const ganttStyles = `
  .gantt-container {
    overflow: auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: white;
  }
  
  .gantt .grid-header {
    background: #f8f9fa;
    border-bottom: 2px solid #e0e0e0;
    font-weight: 600;
  }
  
  .gantt .grid-row {
    border-bottom: 1px solid #f0f0f0;
  }
  
  .gantt .grid-row:hover {
    background: #f8f9fa;
  }
  
  .gantt .bar {
    border-radius: 4px;
    cursor: pointer;
  }
  
  .gantt .bar-progress {
    border-radius: 4px 0 0 4px;
  }
  
  .gantt .bar-construction {
    fill: #E67E22;
  }
  
  .gantt .bar-millwork {
    fill: #8B4513;
  }
  
  .gantt .bar-electric {
    fill: #F1C40F;
  }
  
  .gantt .bar-mep {
    fill: #3498DB;
  }
  
  .gantt .bar-task {
    fill: #2196F3;
  }
  
  .gantt .bar-project {
    fill: #4CAF50;
  }
  
  .gantt .bar-blocked {
    fill: #F44336;
    stroke: #D32F2F;
    stroke-width: 2;
  }
  
  .gantt .bar-warning {
    fill: #FF9800;
    stroke: #F57C00;
    stroke-width: 1;
  }
  
  .gantt .arrow {
    stroke: #666;
    stroke-width: 2;
  }
  
  .gantt .critical-path {
    stroke: #F44336;
    stroke-width: 3;
  }
`;

const VIEW_MODES = {
  QUARTER_DAY: 'Quarter Day',
  HALF_DAY: 'Half Day', 
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month'
};

const GANTT_DATA_TYPES = {
  PROJECTS: 'projects',
  TASKS: 'tasks',
  SCOPE_GROUPS: 'scope-groups',
  SCOPE_ITEMS: 'scope-items',
  MIXED: 'mixed'
};

const EnhancedGanttChart = ({ 
  projects = [],
  tasks = [],
  teamMembers = [],
  scopeItems = [],
  shopDrawings = [],
  materialSpecs = [],
  selectedProjectId = null,
  onTaskUpdate,
  onItemClick,
  height = 600,
  showToolbar = true,
  dataType = GANTT_DATA_TYPES.MIXED
}) => {
  const ganttContainer = useRef(null);
  const ganttInstance = useRef(null);
  const [viewMode, setViewMode] = useState('Week');
  const [selectedProject, setSelectedProject] = useState(selectedProjectId || 'all');
  const [showDependencies, setShowDependencies] = useState(true);
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [ganttData, setGanttData] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Transform data based on selected type and filters
  const transformedData = useMemo(() => {
    let data = [];
    
    try {
      switch (dataType) {
        case GANTT_DATA_TYPES.PROJECTS:
          data = transformProjectsToGantt();
          break;
        case GANTT_DATA_TYPES.TASKS:
          data = transformTasksToGantt();
          break;
        case GANTT_DATA_TYPES.SCOPE_GROUPS:
          data = transformScopeGroupsToGantt();
          break;
        case GANTT_DATA_TYPES.SCOPE_ITEMS:
          data = transformScopeItemsToGantt();
          break;
        case GANTT_DATA_TYPES.MIXED:
        default:
          data = transformMixedDataToGantt();
          break;
      }
      
      // Apply filters
      if (selectedProject !== 'all') {
        data = data.filter(item => 
          item.project_id === selectedProject || 
          item.custom_class?.includes(selectedProject)
        );
      }
      
      if (filterStatus !== 'all') {
        data = data.filter(item => item.custom_class?.includes(filterStatus));
      }
      
      return data;
    } catch (error) {
      console.error('Error transforming Gantt data:', error);
      return [];
    }
  }, [projects, tasks, scopeItems, selectedProject, filterStatus, dataType, shopDrawings, materialSpecs]);

  // Transform projects to Gantt format
  const transformProjectsToGantt = useCallback(() => {
    return projects.map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id);
      const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
      const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
      
      return {
        id: `project-${project.id}`,
        name: project.name,
        start: project.startDate || new Date().toISOString().split('T')[0],
        end: project.endDate || addDays(new Date(), 30).toISOString().split('T')[0],
        progress: Math.round(progress),
        custom_class: `bar-project status-${project.status}`,
        project_id: project.id,
        type: 'project',
        dependencies: ''
      };
    });
  }, [projects, tasks]);

  // Transform tasks to Gantt format
  const transformTasksToGantt = useCallback(() => {
    return tasks.map(task => {
      const project = projects.find(p => p.id === task.projectId);
      const assignee = teamMembers.find(m => m.id === task.assignedTo);
      
      const progress = task.status === 'completed' ? 100 : 
                     task.status === 'in-progress' ? 50 : 0;
      
      const startDate = task.createdAt || new Date().toISOString().split('T')[0];
      const endDate = task.dueDate || addDays(new Date(startDate), 7).toISOString().split('T')[0];
      
      return {
        id: `task-${task.id}`,
        name: task.name,
        start: startDate,
        end: endDate,
        progress: progress,
        custom_class: `bar-task priority-${task.priority} status-${task.status}`,
        project_id: task.projectId,
        type: 'task',
        assignee: assignee?.fullName || 'Unassigned',
        dependencies: '' // To be enhanced with task dependencies
      };
    });
  }, [tasks, projects, teamMembers]);

  // Transform scope groups to Gantt format with dependencies
  const transformScopeGroupsToGantt = useCallback(() => {
    if (!selectedProjectId || selectedProject === 'all') {
      return [];
    }

    const projectScopeItems = scopeItems.filter(item => item.projectId === selectedProjectId);
    const groupStats = calculateGroupStatistics(projectScopeItems);
    
    const scopeGroups = {
      construction: { name: 'Construction', color: 'construction', duration: 4, dependencies: '' },
      millwork: { name: 'Millwork', color: 'millwork', duration: 6, dependencies: 'group-construction' },
      electric: { name: 'Electric', color: 'electric', duration: 3, dependencies: 'group-construction' },
      mep: { name: 'MEP', color: 'mep', duration: 5, dependencies: 'group-construction' }
    };

    return Object.entries(scopeGroups).map(([groupKey, group]) => {
      const stats = groupStats[groupKey] || { progress: 0, totalItems: 0 };
      const startDate = new Date();
      const endDate = addDays(startDate, group.duration * 7);
      
      // Check for production blockers
      const connectionStatus = connectionService.analyzeDependencies(
        projectScopeItems.filter(item => getItemGroup(item) === groupKey),
        shopDrawings,
        materialSpecs
      );
      
      const isBlocked = connectionStatus.blockers.length > 0;
      const hasWarnings = connectionStatus.warnings.length > 0;
      
      let customClass = `bar-${group.color}`;
      if (isBlocked) customClass += ' bar-blocked';
      else if (hasWarnings) customClass += ' bar-warning';
      
      return {
        id: `group-${groupKey}`,
        name: `${group.name} (${stats.totalItems} items)`,
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        progress: Math.round(stats.progress),
        custom_class: customClass,
        project_id: selectedProjectId,
        type: 'scope-group',
        dependencies: group.dependencies,
        blockers: connectionStatus.blockers.length,
        warnings: connectionStatus.warnings.length
      };
    });
  }, [scopeItems, selectedProjectId, selectedProject, shopDrawings, materialSpecs]);

  // Transform individual scope items to Gantt format
  const transformScopeItemsToGantt = useCallback(() => {
    if (!selectedProjectId || selectedProject === 'all') {
      return [];
    }

    const projectScopeItems = scopeItems.filter(item => item.projectId === selectedProjectId);
    
    return projectScopeItems.map(item => {
      const group = getItemGroup(item);
      const startDate = new Date();
      const endDate = addDays(startDate, 14); // 2 weeks default duration
      
      // Analyze dependencies for this specific item
      const itemAnalysis = connectionService.analyzeScopeItemDependencies(
        item, 
        shopDrawings, 
        materialSpecs
      );
      
      let customClass = `bar-${group}`;
      if (itemAnalysis.isBlocked) customClass += ' bar-blocked';
      else if (itemAnalysis.hasWarnings) customClass += ' bar-warning';
      
      return {
        id: `scope-${item.id}`,
        name: item.description,
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        progress: item.progress || 0,
        custom_class: customClass,
        project_id: selectedProjectId,
        type: 'scope-item',
        category: item.category,
        dependencies: getDependenciesForScopeItem(item, itemAnalysis),
        blockers: itemAnalysis.blockers.length,
        warnings: itemAnalysis.warnings.length
      };
    });
  }, [scopeItems, selectedProjectId, selectedProject, shopDrawings, materialSpecs]);

  // Transform mixed data (projects + key scope groups)
  const transformMixedDataToGantt = useCallback(() => {
    const projectData = transformProjectsToGantt();
    
    // If a specific project is selected, add its scope groups
    if (selectedProjectId && selectedProject !== 'all') {
      const scopeGroupData = transformScopeGroupsToGantt();
      return [...projectData, ...scopeGroupData];
    }
    
    return projectData;
  }, [transformProjectsToGantt, transformScopeGroupsToGantt, selectedProjectId, selectedProject]);

  // Helper functions
  const calculateGroupStatistics = (projectScopeItems) => {
    const groups = {
      construction: { items: [], progress: 0, totalItems: 0 },
      millwork: { items: [], progress: 0, totalItems: 0 },
      electric: { items: [], progress: 0, totalItems: 0 },
      mep: { items: [], progress: 0, totalItems: 0 }
    };

    projectScopeItems.forEach(item => {
      const group = getItemGroup(item);
      if (groups[group]) {
        groups[group].items.push(item);
        groups[group].totalItems++;
      }
    });

    Object.keys(groups).forEach(groupKey => {
      const group = groups[groupKey];
      if (group.totalItems > 0) {
        const completedItems = group.items.filter(item => item.status === 'completed').length;
        group.progress = (completedItems / group.totalItems) * 100;
      }
    });

    return groups;
  };

  const getItemGroup = (item) => {
    const category = item.category?.toLowerCase() || '';
    if (category.includes('construction') || category.includes('structural') || 
        category.includes('demolition') || category.includes('flooring')) {
      return 'construction';
    } else if (category.includes('millwork') || category.includes('cabinet') || 
               category.includes('carpentry')) {
      return 'millwork';
    } else if (category.includes('electrical') || category.includes('lighting') || 
               category.includes('power')) {
      return 'electric';
    } else if (category.includes('mep') || category.includes('hvac') || 
               category.includes('plumbing') || category.includes('mechanical')) {
      return 'mep';
    }
    return 'construction'; // default
  };

  const getDependenciesForScopeItem = (item, analysis) => {
    // Simple dependency logic - could be enhanced
    const group = getItemGroup(item);
    if (group !== 'construction') {
      return 'group-construction';
    }
    return '';
  };

  // Initialize and update Gantt chart
  useEffect(() => {
    if (ganttContainer.current && transformedData.length > 0) {
      try {
        // Add custom styles
        if (!document.getElementById('gantt-custom-styles')) {
          const style = document.createElement('style');
          style.id = 'gantt-custom-styles';
          style.textContent = ganttStyles;
          document.head.appendChild(style);
        }

        // Destroy existing instance
        if (ganttInstance.current) {
          ganttInstance.current.destroy();
        }

        // Create new Gantt instance
        // Temporary placeholder - Gantt chart will be implemented after frappe-gantt is properly installed
        if (ganttContainer.current) {
          ganttContainer.current.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #666;">
              <h4>📊 Enhanced Gantt Chart</h4>
              <p>Timeline visualization will be available here</p>
              <p>Data items: ${transformedData.length}</p>
            </div>
          `;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error creating Gantt chart:', error);
        setLoading(false);
      }
    }
  }, [transformedData, viewMode, onItemClick, onTaskUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ganttInstance.current) {
        ganttInstance.current.destroy();
      }
    };
  }, []);

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode) {
      setViewMode(newViewMode);
    }
  };

  const handleZoom = (direction) => {
    const modes = Object.keys(VIEW_MODES);
    const currentIndex = modes.indexOf(viewMode);
    
    if (direction === 'in' && currentIndex > 0) {
      setViewMode(modes[currentIndex - 1]);
    } else if (direction === 'out' && currentIndex < modes.length - 1) {
      setViewMode(modes[currentIndex + 1]);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    // Trigger re-render by updating state
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleExport = () => {
    if (ganttInstance.current) {
      // This would implement export functionality
      console.log('Export Gantt chart');
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Toolbar */}
      {showToolbar && (
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {/* View Mode Selection */}
            <Grid item xs={12} md={3}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
                sx={{ '& .MuiToggleButton-root': { px: 1, py: 0.5 } }}
              >
                {Object.entries(VIEW_MODES).map(([key, label]) => (
                  <ToggleButton key={key} value={key} sx={{ fontSize: '0.8rem' }}>
                    {label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>

            {/* Project Filter */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Project</InputLabel>
                <Select
                  value={selectedProject}
                  label="Project"
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <MenuItem value="all">All Projects</MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Control Buttons */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Tooltip title="Zoom In">
                  <IconButton size="small" onClick={() => handleZoom('in')}>
                    <ZoomInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Zoom Out">
                  <IconButton size="small" onClick={() => handleZoom('out')}>
                    <ZoomOutIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Refresh">
                  <IconButton size="small" onClick={handleRefresh}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export">
                  <IconButton size="small" onClick={handleExport}>
                    <ExportIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Settings">
                  <IconButton size="small" onClick={() => setSettingsOpen(true)}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {/* Data Type Indicator */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon sx={{ color: '#666', fontSize: 20 }} />
            <Typography variant="body2" color="textSecondary">
              Showing: {transformedData.length} items
            </Typography>
            {selectedProject !== 'all' && (
              <Chip 
                label={projects.find(p => p.id === selectedProject)?.name || 'Project'} 
                size="small" 
                color="primary" 
              />
            )}
          </Box>
        </Paper>
      )}

      {/* Gantt Chart Container */}
      <Paper 
        sx={{ 
          height: height, 
          overflow: 'hidden',
          borderRadius: 2,
          position: 'relative'
        }}
      >
        {loading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.8)',
            zIndex: 10
          }}>
            <Typography>Loading timeline...</Typography>
          </Box>
        )}
        
        {transformedData.length === 0 && !loading ? (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}>
            <TimelineIcon sx={{ fontSize: 64, color: '#ccc' }} />
            <Typography variant="h6" color="textSecondary">
              No timeline data available
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Select a project or add tasks to view the timeline
            </Typography>
          </Box>
        ) : (
          <div 
            ref={ganttContainer} 
            className="gantt-container"
            style={{ height: '100%', width: '100%' }}
          />
        )}
      </Paper>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gantt Chart Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Display Options
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <label>
                    <input
                      type="checkbox"
                      checked={showDependencies}
                      onChange={(e) => setShowDependencies(e.target.checked)}
                      style={{ marginRight: 8 }}
                    />
                    Show Dependencies
                  </label>
                </Box>
                <Box>
                  <label>
                    <input
                      type="checkbox"
                      checked={showCriticalPath}
                      onChange={(e) => setShowCriticalPath(e.target.checked)}
                      style={{ marginRight: 8 }}
                    />
                    Highlight Critical Path
                  </label>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedGanttChart;