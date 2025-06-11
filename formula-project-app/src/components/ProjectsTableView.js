import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  LinearProgress,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccountTree as ScopeIcon
} from '@mui/icons-material';

const ProjectsTableView = ({ 
  projects = [], 
  clients = [], 
  teamMembers = [], 
  onEditProject,
  onDeleteProject,
  onViewProject,
  onManageScope 
}) => {
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Helper functions
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.companyName : 'No Client Assigned';
  };

  const getProjectManager = (managerId) => {
    const manager = teamMembers.find(tm => tm.id === managerId);
    return manager ? manager.fullName : 'Unassigned';
  };

  const getStatusConfig = (status) => {
    const configs = {
      'on-tender': { label: 'On Tender', color: '#3498db', bgColor: '#ebf3fd' },
      'awarded': { label: 'Awarded', color: '#27ae60', bgColor: '#eafaf1' },
      'on-hold': { label: 'On Hold', color: '#f39c12', bgColor: '#fef9e7' },
      'not-awarded': { label: 'Not Awarded', color: '#e74c3c', bgColor: '#fdedec' },
      'active': { label: 'Active', color: '#9b59b6', bgColor: '#f4ecf7' },
      'completed': { label: 'Completed', color: '#2c3e50', bgColor: '#eaeded' }
    };
    return configs[status] || configs['on-tender'];
  };

  const getTypeConfig = (type) => {
    const configs = {
      'general-contractor': { label: 'General Contractor', color: '#e67e22' },
      'fit-out': { label: 'Fit-out', color: '#e67e22' },
      'mep': { label: 'MEP', color: '#1abc9c' },
      'electrical': { label: 'Electrical', color: '#f1c40f' },
      'millwork': { label: 'Millwork', color: '#8e44ad' },
      'management': { label: 'Management', color: '#37444B' }
    };
    return configs[type] || configs['general-contractor'];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateProgress = (project) => {
    // This would be calculated based on tasks in a real implementation
    return Math.floor(Math.random() * 100); // Placeholder
  };

  // Sorting functionality
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      // Handle special cases
      if (orderBy === 'client') {
        aValue = getClientName(a.clientId);
        bValue = getClientName(b.clientId);
      }
      
      if (orderBy === 'manager') {
        aValue = getProjectManager(a.projectManager);
        bValue = getProjectManager(b.projectManager);
      }
      
      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [projects, orderBy, order, clients, teamMembers]);

  // Menu handlers
  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleMenuAction = (action) => {
    if (selectedProject) {
      switch (action) {
        case 'view':
          onViewProject && onViewProject(selectedProject);
          break;
        case 'edit':
          onEditProject && onEditProject(selectedProject);
          break;
        case 'scope':
          onManageScope && onManageScope(selectedProject);
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete "${selectedProject.name}"?`)) {
            onDeleteProject && onDeleteProject(selectedProject.id);
          }
          break;
        default:
          break;
      }
    }
    handleMenuClose();
  };

  const columns = [
    { id: 'name', label: 'Project Name', sortable: true, minWidth: 200 },
    { id: 'client', label: 'Client', sortable: true, minWidth: 150 },
    { id: 'type', label: 'Type', sortable: true, minWidth: 130 },
    { id: 'status', label: 'Status', sortable: true, minWidth: 120 },
    { id: 'manager', label: 'Manager', sortable: true, minWidth: 150 },
    { id: 'startDate', label: 'Start Date', sortable: true, minWidth: 120 },
    { id: 'endDate', label: 'End Date', sortable: true, minWidth: 120 },
    { id: 'progress', label: 'Progress', sortable: false, minWidth: 120 },
    { id: 'actions', label: 'Actions', sortable: false, minWidth: 80 }
  ];

  if (projects.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        backgroundColor: 'white',
        borderRadius: 2,
        border: '1px solid #E9ECEF'
      }}>
        <BusinessIcon sx={{ fontSize: 64, color: '#BDC3C7', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Projects Found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Start by creating your first project or adjust your search filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        border: '1px solid #E9ECEF',
        borderRadius: 2
      }}
    >
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ 
                    minWidth: column.minWidth,
                    backgroundColor: '#F8F9FA',
                    fontWeight: 600,
                    color: '#2C3E50'
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProjects.map((project) => {
              const statusConfig = getStatusConfig(project.status);
              const typeConfig = getTypeConfig(project.type);
              const progress = calculateProgress(project);

              return (
                <TableRow 
                  key={project.id}
                  hover
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#F8F9FA' 
                    }
                  }}
                >
                  {/* Project Name */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: typeConfig.color,
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        {project.name.substring(0, 2).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                          {project.name}
                        </Typography>
                        {project.description && (
                          <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                            {project.description.substring(0, 50)}...
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Client */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {getClientName(project.clientId)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Chip
                      label={typeConfig.label}
                      size="small"
                      sx={{
                        backgroundColor: `${typeConfig.color}15`,
                        color: typeConfig.color,
                        fontWeight: 500,
                        border: `1px solid ${typeConfig.color}30`
                      }}
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={statusConfig.label}
                      size="small"
                      sx={{
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.color,
                        fontWeight: 500
                      }}
                    />
                  </TableCell>

                  {/* Manager */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {getProjectManager(project.projectManager)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Start Date */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatDate(project.startDate)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* End Date */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatDate(project.endDate)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Progress */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            backgroundColor: '#E0E0E0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: progress > 75 ? '#27AE60' : 
                                             progress > 50 ? '#F39C12' : 
                                             progress > 25 ? '#3498DB' : '#E74C3C'
                            }
                          }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {progress}%
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, project)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Project</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('scope')}>
          <ListItemIcon>
            <ScopeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Manage Scope</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleMenuAction('delete')}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Project</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ProjectsTableView;