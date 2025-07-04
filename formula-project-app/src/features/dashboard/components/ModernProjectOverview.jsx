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
  Button,
  ButtonGroup,
  LinearProgress,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
// Iconoir icons - migrated dashboard icons
import {
  MdSearch as SearchIcon,
  MdClose as ClearIcon,
  MdKeyboardArrowUp as ArrowUpIcon,
  MdKeyboardArrowDown as ArrowDownIcon,
  MdDownload as ExportIcon,
  MdTimeline as TimelineIcon
} from 'react-icons/md';
import { format, differenceInDays, differenceInMonths } from 'date-fns';
import { exportProjectsToExcel } from '../../../services/export/excelExport';

const ModernProjectOverview = ({ projects = [], tasks = [], teamMembers = [], clients = [], onViewProject, onViewProjectTimeline }) => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Not set';
    if (amount >= 1000000) {
      return `₺${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₺${(amount / 1000).toFixed(0)}K`;
    } else {
      return `₺${amount.toLocaleString()}`;
    }
  };

  // Calculate days remaining until deadline
  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return { text: 'No deadline', color: '#95A5A6', isOverdue: false };
    
    const today = new Date();
    const deadline = new Date(endDate);
    const diffDays = differenceInDays(deadline, today);
    const diffMonths = differenceInMonths(deadline, today);
    
    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        text: overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`,
        color: '#E74C3C',
        isOverdue: true,
        sortValue: diffDays
      };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: '#E74C3C', isOverdue: false, sortValue: 0 };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days left`, color: '#F39C12', isOverdue: false, sortValue: diffDays };
    } else if (diffDays <= 30) {
      return { text: `${diffDays} days left`, color: '#F1C40F', isOverdue: false, sortValue: diffDays };
    } else if (diffMonths >= 1) {
      const remainingDays = diffDays - (diffMonths * 30);
      if (diffMonths === 1 && remainingDays < 7) {
        return { text: `${diffDays} days left`, color: '#F1C40F', isOverdue: false, sortValue: diffDays };
      }
      return { 
        text: diffMonths === 1 ? '1 month left' : `${diffMonths} months left`, 
        color: '#27AE60', 
        isOverdue: false, 
        sortValue: diffDays 
      };
    } else {
      return { text: `${diffDays} days left`, color: '#27AE60', isOverdue: false, sortValue: diffDays };
    }
  };

  // Calculate project statistics
  const getProjectStats = (projectId) => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const projectTasks = safeTasks.filter(task => task.projectId === projectId);
    const completedTasks = projectTasks.filter(task => task.status === 'completed');
    const progress = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;
    
    return {
      totalTasks: projectTasks.length,
      completedTasks: completedTasks.length,
      progress
    };
  };

  // Get status color
  const getStatusPalette = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
      case 'completed':
        return { backgroundColor: '#E3F2FD', color: '#1565C0' };
      case 'on hold':
        return { backgroundColor: '#FFF3E0', color: '#F57C00' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#757575' };
    }
  };


  // Column configuration for sortable headers
  const columns = [
    { id: 'name', label: 'Project Name', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'type', label: 'Type', sortable: true },
    { id: 'budget', label: 'Budget', sortable: false },
    { id: 'startDate', label: 'Start Date', sortable: true },
    { id: 'deadline', label: 'Deadline', sortable: true },
    { id: 'due', label: 'Due', sortable: false },
    { id: 'progress', label: 'Progress', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    const safeProjects = Array.isArray(projects) ? projects : [];
    let filtered = safeProjects.filter(project => {
      // Basic filter (All/Active/Completed)
      const matchesBasicFilter = 
        filter === 'All' || 
        (filter === 'Active' && project.status === 'active') ||
        (filter === 'Completed' && project.status === 'completed');

      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        project.name?.toLowerCase().includes(searchLower) ||
        project.clientName?.toLowerCase().includes(searchLower) ||
        project.client?.toLowerCase().includes(searchLower) ||
        project.type?.toLowerCase().includes(searchLower);

      return matchesBasicFilter && matchesSearch;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'startDate':
          aValue = a.startDate ? new Date(a.startDate).getTime() : 0;
          bValue = b.startDate ? new Date(b.startDate).getTime() : 0;
          break;
        case 'deadline':
          aValue = calculateDaysRemaining(a.endDate).sortValue;
          bValue = calculateDaysRemaining(b.endDate).sortValue;
          break;
        case 'progress':
          aValue = getProjectStats(a.id).progress;
          bValue = getProjectStats(b.id).progress;
          break;
        case 'type':
          aValue = a.type || '';
          bValue = b.type || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
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

    return filtered;
  }, [projects, filter, searchTerm, sortBy, sortDirection, tasks]);

  // Handle column sort
  const handleSort = (columnId) => {
    if (sortBy === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnId);
      setSortDirection('asc');
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilter('All');
  };

  // Handle export
  const handleExportProjects = async () => {
    try {
      console.log('Starting export with:', {
        projectsCount: filteredAndSortedProjects.length,
        clientsCount: clients.length,
        teamMembersCount: teamMembers.length
      });

      if (filteredAndSortedProjects.length === 0) {
        alert('No projects to export. Please adjust your filters.');
        return;
      }

      const exportData = filteredAndSortedProjects.map(project => {
        const stats = getProjectStats(project.id);
        const dueInfo = calculateDaysRemaining(project.endDate);
        
        return {
          ...project,
          progress: stats.progress,
          completedTasks: stats.completedTasks,
          totalTasks: stats.totalTasks,
          dueStatus: dueInfo.text,
          isOverdue: dueInfo.isOverdue
        };
      });

      const result = await exportProjectsToExcel(exportData, clients, teamMembers);
      
      if (result.success) {
        console.log('Export successful:', result.filename);
        // You could add a success notification here
      } else {
        console.error('Export failed with result:', result);
        alert(`Export failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message || 'Unknown error occurred'}`);
    }
  };


  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'white',
        border: '1px solid #E9ECEF',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      {/* Enhanced Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #E9ECEF' }}>
        {/* Title and Controls Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
            Projects Summary ({filteredAndSortedProjects.length})
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Export Button */}
            <Tooltip title="Export all visible projects as an Excel file with detailed information including progress, tasks, and deadlines">
              <Button
                size="small"
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={handleExportProjects}
                sx={{
                  borderColor: '#27AE60',
                  color: '#27AE60',
                  '&:hover': {
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderColor: '#229954'
                  }
                }}
              >
                Export Project List as Excel
              </Button>
            </Tooltip>

            {/* Clear Filters Button */}
            {(searchTerm || filter !== 'All') && (
              <Button
                size="small"
                onClick={clearAllFilters}
                sx={{ color: '#E74C3C', minWidth: 'auto' }}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>

        {/* Search and Quick Filters Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          {/* Search Bar */}
          <TextField
            size="small"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clean-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'var(--gray-400)' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                    sx={{ color: 'var(--gray-400)' }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: 300 }}
          />
          
          {/* Controls Group: Quick Status Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Quick Status Filters */}
            <ButtonGroup size="small" variant="outlined">
              {['All', 'Active', 'Completed'].map((filterOption) => (
                <Button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  variant={filter === filterOption ? 'contained' : 'outlined'}
                  sx={{
                    backgroundColor: filter === filterOption ? '#E67E22' : 'transparent',
                    borderColor: '#E67E22',
                    color: filter === filterOption ? 'white' : '#E67E22',
                    '&:hover': {
                      backgroundColor: filter === filterOption ? '#D35400' : 'rgba(230, 126, 34, 0.1)'
                    }
                  }}
                >
                  {filterOption}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        </Box>

      </Box>


      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  sx={{ fontWeight: 600, color: '#7F8C8D' }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                      sx={{
                        color: '#7F8C8D !important',
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
            {filteredAndSortedProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No projects match your search criteria
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedProjects.map((project) => {
                const stats = getProjectStats(project.id);
                const dueInfo = calculateDaysRemaining(project.endDate);
                return (
                  <TableRow
                    key={project.id}
                    sx={{
                      '&:hover': { backgroundColor: '#F8F9FA' },
                      borderBottom: '1px solid #E9ECEF'
                    }}
                  >
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500, 
                          color: '#3498db',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: '#2980b9'
                          }
                        }}
                        onClick={() => onViewProject && onViewProject(project)}
                      >
                        {project.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={project.status || 'Active'}
                        size="small"
                        sx={{
                          ...getStatusPalette(project.status),
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#7F8C8D', textTransform: 'capitalize' }}>
                        {project.type || 'Not specified'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: project.budget ? '#2C3E50' : '#95A5A6',
                          fontWeight: project.budget ? 600 : 400
                        }}
                      >
                        {formatCurrency(project.budget)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: project.startDate ? '#2C3E50' : '#95A5A6',
                          fontWeight: project.startDate ? 600 : 400,
                          fontSize: '0.875rem'
                        }}
                      >
                        {project.startDate ? format(new Date(project.startDate), 'MMM dd, yyyy') : 'Not set'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: project.endDate ? '#2C3E50' : '#95A5A6',
                          fontWeight: project.endDate ? 600 : 400,
                          fontSize: '0.875rem'
                        }}
                      >
                        {project.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'No deadline'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={dueInfo.text}
                        size="small"
                        sx={{
                          backgroundColor: `${dueInfo.color}20`,
                          color: dueInfo.color,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                        <Box sx={{ width: '70%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={stats.progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: stats.progress === 100 ? '#27AE60' : '#E67E22',
                                borderRadius: 4
                              }
                            }}
                          />
                        </Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#2C3E50', 
                            minWidth: '35px' 
                          }}
                        >
                          {stats.progress}%
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#7F8C8D', 
                          fontSize: '0.7rem',
                          display: 'block',
                          mt: 0.5
                        }}
                      >
                        {stats.completedTasks}/{stats.totalTasks} tasks
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<TimelineIcon />}
                          onClick={() => onViewProjectTimeline && onViewProjectTimeline(project)}
                          sx={{
                            borderColor: '#516AC8',
                            color: '#516AC8',
                            '&:hover': {
                              backgroundColor: 'rgba(81, 106, 200, 0.1)',
                              borderColor: '#3c5aa6'
                            }
                          }}
                        >
                          Timeline
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ModernProjectOverview;