import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  MdMoreVert as MoreVert,
  MdEdit as Edit,
  MdContentCopy as Duplicate,
  MdArchive as Archive,
  MdUnarchive as Unarchive,
  MdGroup as AssignTeam,
  MdTimeline as ViewTimeline,
  MdDownload as Export,
  MdFlag as SetPriority
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext';

const EnhancedProjectsTable = ({ 
  projects = [], 
  clients = [], 
  teamMembers = [], 
  onViewProject,
  onEditProject,
  onDuplicateProject,
  onArchiveProject,
  onAssignTeam,
  onViewTimeline,
  onExportProject,
  onSetPriority
}) => {
  const { user, getAccessibleProjects } = useAuth();
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects based on user access
  const accessibleProjects = useMemo(() => {
    return getAccessibleProjects(projects);
  }, [projects, getAccessibleProjects]);

  // Create lookup maps for better performance
  const clientsMap = useMemo(() => {
    return clients.reduce((acc, client) => {
      acc[client.id] = client;
      return acc;
    }, {});
  }, [clients]);

  const teamMembersMap = useMemo(() => {
    return teamMembers.reduce((acc, member) => {
      acc[member.id] = member;
      return acc;
    }, {});
  }, [teamMembers]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const sorted = [...accessibleProjects].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'client':
          aValue = clientsMap[a.clientId]?.name || clientsMap[a.clientId]?.companyName || '';
          bValue = clientsMap[b.clientId]?.name || clientsMap[b.clientId]?.companyName || '';
          break;
        case 'type':
          aValue = a.type || '';
          bValue = b.type || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'manager':
          aValue = teamMembersMap[a.managerId]?.fullName || '';
          bValue = teamMembersMap[b.managerId]?.fullName || '';
          break;
        case 'progress':
          aValue = a.progress || 0;
          bValue = b.progress || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
    });

    return sorted;
  }, [accessibleProjects, sortBy, sortDirection, clientsMap, teamMembersMap]);

  // Handle column sort
  const handleSort = (columnId) => {
    if (sortBy === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnId);
      setSortDirection('asc');
    }
  };

  // Action menu handlers
  const handleActionClick = (event, project) => {
    event.stopPropagation();
    setSelectedProject(project);
    setActionMenuAnchor(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionMenuAnchor(null);
    setSelectedProject(null);
  };

  const handleActionSelect = (action) => {
    if (!selectedProject) return;

    switch (action) {
      case 'edit':
        onEditProject?.(selectedProject);
        break;
      case 'duplicate':
        onDuplicateProject?.(selectedProject);
        break;
      case 'archive':
        onArchiveProject?.(selectedProject);
        break;
      case 'assign':
        onAssignTeam?.(selectedProject);
        break;
      case 'timeline':
        onViewTimeline?.(selectedProject);
        break;
      case 'export':
        onExportProject?.(selectedProject);
        break;
      case 'priority':
        onSetPriority?.(selectedProject);
        break;
    }
    
    handleActionClose();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in-progress':
        return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
      case 'completed':
        return { backgroundColor: '#E3F2FD', color: '#1565C0' };
      case 'on-hold':
        return { backgroundColor: '#FFF3E0', color: '#F57C00' };
      case 'planning':
        return { backgroundColor: '#F3E5F5', color: '#7B1FA2' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#757575' };
    }
  };

  // Get progress color
  const getProgressColor = (progress) => {
    if (progress >= 75) return '#10B981';
    if (progress >= 50) return '#E3AF64';
    return '#516AC8';
  };

  // Get team member avatars
  const getTeamAvatars = (project) => {
    const teamIds = project.teamMembers || [];
    const members = teamIds.map(id => teamMembersMap[id]).filter(Boolean);
    
    return (
      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '12px' } }}>
        {members.map((member) => (
          <Tooltip key={member.id} title={member.fullName || member.name}>
            <Avatar
              sx={{
                bgcolor: '#E3AF64',
                color: 'white',
                fontWeight: 600
              }}
            >
              {(member.fullName || member.name)?.charAt(0) || 'T'}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    );
  };

  // Table columns configuration
  const columns = [
    { id: 'name', label: 'Project Name', sortable: true },
    { id: 'client', label: 'Client', sortable: true },
    { id: 'type', label: 'Type', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'manager', label: 'Manager', sortable: true },
    { id: 'team', label: 'Team', sortable: false },
    { id: 'progress', label: 'Progress', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  if (sortedProjects.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #E5E7EB', borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No projects available or you don't have access to any projects.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  sx={{ 
                    fontWeight: 600, 
                    color: '#6B7280',
                    borderBottom: '1px solid #E5E7EB'
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                      sx={{
                        color: '#6B7280 !important',
                        '&:hover': {
                          color: '#E3AF64 !important'
                        },
                        '&.Mui-active': {
                          color: '#E3AF64 !important',
                          '& .MuiTableSortLabel-icon': {
                            color: '#E3AF64 !important'
                          }
                        }
                      }}
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
              const client = clientsMap[project.clientId];
              const manager = teamMembersMap[project.managerId];
              const statusConfig = getStatusColor(project.status);
              const progressColor = getProgressColor(project.progress || 0);
              
              return (
                <TableRow
                  key={project.id}
                  sx={{
                    '&:hover': { backgroundColor: '#F9FAFB' },
                    borderBottom: '1px solid #E5E7EB',
                    cursor: 'pointer'
                  }}
                  onClick={() => onViewProject?.(project)}
                >
                  {/* Project Name */}
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#516AC8',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {project.name}
                    </Typography>
                    {project.description && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#6B7280',
                          display: 'block',
                          mt: 0.5
                        }}
                      >
                        {project.description.length > 50 
                          ? `${project.description.substring(0, 50)}...` 
                          : project.description
                        }
                      </Typography>
                    )}
                  </TableCell>

                  {/* Client */}
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#374151' }}>
                      {client?.name || client?.companyName || 'No Client'}
                    </Typography>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6B7280',
                        textTransform: 'capitalize'
                      }}
                    >
                      {project.type || 'Not specified'}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={project.status?.replace('-', ' ') || 'Active'}
                      size="small"
                      sx={{
                        ...statusConfig,
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        minWidth: 80
                      }}
                    />
                  </TableCell>

                  {/* Manager */}
                  <TableCell>
                    {manager ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: '12px',
                            bgcolor: '#E3AF64',
                            color: 'white',
                            fontWeight: 600
                          }}
                        >
                          {manager.fullName?.charAt(0) || 'M'}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {manager.fullName || manager.name}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                        No manager
                      </Typography>
                    )}
                  </TableCell>

                  {/* Team */}
                  <TableCell>
                    {getTeamAvatars(project)}
                  </TableCell>

                  {/* Progress */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                      <Box sx={{ width: '70%' }}>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress || 0}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#E5E7EB',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: progressColor,
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#374151',
                          minWidth: '35px'
                        }}
                      >
                        {project.progress || 0}%
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionClick(e, project)}
                      sx={{
                        color: '#6B7280',
                        '&:hover': {
                          color: '#374151',
                          backgroundColor: '#F3F4F6'
                        }
                      }}
                    >
                      <MoreVert size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }
        }}
      >
        <MenuItem onClick={() => handleActionSelect('edit')}>
          <ListItemIcon>
            <Edit size={16} />
          </ListItemIcon>
          <ListItemText>Edit Project Details</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleActionSelect('duplicate')}>
          <ListItemIcon>
            <Duplicate size={16} />
          </ListItemIcon>
          <ListItemText>Duplicate Project</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleActionSelect('archive')}>
          <ListItemIcon>
            {selectedProject?.status === 'archived' ? <Unarchive size={16} /> : <Archive size={16} />}
          </ListItemIcon>
          <ListItemText>
            {selectedProject?.status === 'archived' ? 'Activate Project' : 'Archive Project'}
          </ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleActionSelect('assign')}>
          <ListItemIcon>
            <AssignTeam size={16} />
          </ListItemIcon>
          <ListItemText>Assign Team Members</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleActionSelect('timeline')}>
          <ListItemIcon>
            <ViewTimeline size={16} />
          </ListItemIcon>
          <ListItemText>View Project Timeline</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleActionSelect('export')}>
          <ListItemIcon>
            <Export size={16} />
          </ListItemIcon>
          <ListItemText>Export Project Data</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleActionSelect('priority')}>
          <ListItemIcon>
            <SetPriority size={16} />
          </ListItemIcon>
          <ListItemText>Set Project Priority</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default React.memo(EnhancedProjectsTable);