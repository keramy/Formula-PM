/**
 * Enhanced Project Detail Page - Prompt 10 Implementation
 * Comprehensive tab system: Overview, Scope, Shop Drawings, Material Specs, Activity Feed, Reports
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Grid,
  Button,
  IconButton,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  TextField
} from '@mui/material';
import {
  MdBusiness as OverviewIcon,
  MdList as ScopeIcon,
  MdArchitecture as ShopDrawingsIcon,
  MdEngineering as MaterialSpecsIcon,
  MdTimeline as ActivityIcon,
  MdAssessment as ReportsIcon,
  MdEdit as EditIcon,
  MdShare as ShareIcon,
  MdPrint as PrintIcon,
  MdDownload as DownloadIcon,
  MdPerson as PersonIcon,
  MdCalendarToday as CalendarIcon,
  MdAttachMoney as BudgetIcon,
  MdFlag as PriorityIcon,
  MdLocationOn as LocationIcon,
  MdDescription as DescriptionIcon,
  MdCheckCircle as CompletedIcon,
  MdAccessTime as PendingIcon,
  MdWarning as WarningIcon,
  MdAdd,
  MdEdit,
  MdDelete,
  MdInventory,
  MdDescription as DrawingIcon,
  MdLibraryBooks as SpecIcon,
  MdLink as LinkIcon
} from 'react-icons/md';
import CleanPageLayout from '../../../components/layout/CleanPageLayout';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { format, differenceInDays, parseISO, isValid } from 'date-fns';
import apiService from '../../../services/api/apiService';

// Date formatting helper function
const safeFormatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return 'Not set';
  
  try {
    const parsedDate = parseISO(dateString);
    if (isValid(parsedDate)) {
      return format(parsedDate, formatString);
    }
    return 'Invalid date';
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Invalid date';
  }
};

// Safe date comparison helper
const isDateOverdue = (dateString, status) => {
  if (!dateString || status === 'completed') return false;
  
  try {
    const parsedDate = parseISO(dateString);
    if (isValid(parsedDate)) {
      return parsedDate < new Date();
    }
    return false;
  } catch (error) {
    console.warn('Date comparison error:', error);
    return false;
  }
};

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Overview Tab Component
const OverviewTab = ({ project, tasks, teamMembers, clients }) => {
  // Early return if project data is not available
  if (!project) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6B7280' }}>
              Loading project data...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.status === 'completed');
  const projectProgress = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;
  
  const projectClient = clients.find(client => client.id === project.clientId);
  const projectManager = teamMembers.find(member => member.id === project.projectManager);
  const projectTeam = teamMembers.filter(member => project.teamMembers?.includes(member.id));

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
      case 'completed': return { backgroundColor: '#E3F2FD', color: '#1565C0' };
      case 'on-hold': return { backgroundColor: '#FFF3E0', color: '#F57C00' };
      default: return { backgroundColor: '#F5F5F5', color: '#757575' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#10B981';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Project Summary Card */}
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#0F1939', mb: 1 }}>
                  {project?.name || 'Project Name'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={project.status || 'Active'} 
                    size="small"
                    sx={getStatusColor(project.status)}
                  />
                  <Chip 
                    label={project.type || 'General'} 
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#516AC8', color: '#516AC8' }}
                  />
                  <Chip 
                    icon={<PriorityIcon />}
                    label={project.priority || 'Medium'} 
                    size="small"
                    sx={{ backgroundColor: getPriorityColor(project.priority) + '20', color: getPriorityColor(project.priority) }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" sx={{ backgroundColor: '#F6F3E7' }}>
                  <EditIcon sx={{ color: '#E3AF64' }} />
                </IconButton>
                <IconButton size="small" sx={{ backgroundColor: '#F6F3E7' }}>
                  <ShareIcon sx={{ color: '#516AC8' }} />
                </IconButton>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: '#374151', mb: 3, lineHeight: 1.6 }}>
              {project.description || 'No description available for this project.'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ color: '#6B7280', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>Start Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {safeFormatDate(project.startDate)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ color: '#6B7280', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>End Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {safeFormatDate(project.endDate)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BudgetIcon sx={{ color: '#6B7280', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>Budget</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {project.budget ? `₺${project.budget.toLocaleString()}` : 'Not set'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ color: '#6B7280', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>Location</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {project.location || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Progress and Team Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Project Progress</Typography>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#E3AF64', mb: 1 }}>
                {projectProgress}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={projectProgress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: projectProgress === 100 ? '#10B981' : '#E3AF64',
                    borderRadius: 4
                  }
                }} 
              />
              <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
                {completedTasks.length} of {projectTasks.length} tasks completed
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Project Team</Typography>
            
            {projectManager && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ width: 32, height: 32, mr: 2, backgroundColor: '#516AC8' }}
                >
                  {projectManager.initials}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {projectManager.fullName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>
                    Project Manager
                  </Typography>
                </Box>
              </Box>
            )}

            {projectClient && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ width: 32, height: 32, mr: 2, backgroundColor: '#E3AF64' }}
                >
                  {projectClient.companyName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {projectClient.companyName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>
                    Client
                  </Typography>
                </Box>
              </Box>
            )}

            {projectTeam.length > 0 && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Team Members ({projectTeam.length})
                </Typography>
                <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                  {projectTeam.map((member) => (
                    <Avatar 
                      key={member.id}
                      sx={{ width: 32, height: 32, backgroundColor: '#0F1939' }}
                      title={member.fullName}
                    >
                      {member.initials}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Tasks */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Tasks</Typography>
              <Button size="small" sx={{ color: '#516AC8' }}>View All</Button>
            </Box>
            
            {projectTasks.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#6B7280', textAlign: 'center', py: 3 }}>
                No tasks available for this project
              </Typography>
            ) : (
              <List>
                {projectTasks.slice(0, 5).map((task, index) => {
                  const assignee = teamMembers.find(member => member.id === task.assignedTo);
                  const isOverdue = isDateOverdue(task.dueDate, task.status);
                  
                  return (
                    <ListItem key={task.id} divider={index < 4}>
                      <ListItemAvatar>
                        {task.status === 'completed' ? (
                          <CompletedIcon sx={{ color: '#10B981' }} />
                        ) : isOverdue ? (
                          <WarningIcon sx={{ color: '#EF4444' }} />
                        ) : (
                          <PendingIcon sx={{ color: '#F59E0B' }} />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title || task.name}
                        secondary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {assignee && (
                              <Chip 
                                avatar={<Avatar sx={{ width: 20, height: 20 }}>{assignee.initials}</Avatar>}
                                label={assignee.fullName}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {task.dueDate && (
                              <Typography component="span" variant="caption" sx={{ color: isOverdue ? '#EF4444' : '#6B7280' }}>
                                Due: {safeFormatDate(task.dueDate, 'MMM dd')}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip 
                          label={task.status} 
                          size="small"
                          sx={{
                            backgroundColor: task.status === 'completed' ? '#E8F5E8' : 
                                           task.status === 'in-progress' ? '#FFF3E0' : '#F3F4F6',
                            color: task.status === 'completed' ? '#2E7D32' : 
                                 task.status === 'in-progress' ? '#F57C00' : '#6B7280'
                          }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Scope Tab Component - Reorganized Layout
const ScopeTab = ({ project, tasks, teamMembers, clients }) => {
  console.log('🚀 NEW SCOPE TAB COMPONENT LOADING!', { project: project?.id });
  
  const [scopeItems, setScopeItems] = useState([]);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['construction', 'millwork', 'electrical', 'mechanical']);
  const [selectedStatuses, setSelectedStatuses] = useState(['all']);

  // Fetch scope items when component mounts or project changes
  useEffect(() => {
    const fetchScopeItems = async () => {
      if (!project?.id) {
        console.log('No project ID available');
        return;
      }
      
      console.log('Fetching scope items for project:', project.id);
      
      try {
        setLoading(true);
        setError(null);
        const items = await apiService.getScopeItems(project.id);
        console.log('Received scope items:', items);
        setScopeItems(items || []);
      } catch (error) {
        console.error('Error fetching scope items:', error);
        setError('Failed to load scope items');
        setScopeItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScopeItems();
  }, [project?.id]);

  // Early return if project data is not available
  if (!project) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6B7280' }}>
              Loading project data...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Define the 4 scope categories
  const categories = [
    { id: 'construction', label: 'Construction', color: '#E3AF64', prefix: 'C' },
    { id: 'millwork', label: 'Millwork', color: '#516AC8', prefix: 'M' },
    { id: 'electrical', label: 'Electrical', color: '#0F1939', prefix: 'E' },
    { id: 'mechanical', label: 'Mechanical', color: '#10B981', prefix: 'MC' }
  ];

  // Calculate budget statistics
  const getBudgetStats = (categoryId) => {
    const categoryItems = scopeItems.filter(item => item.category === categoryId);
    const totalBudget = categoryItems.reduce((sum, item) => sum + (item.initialCost || 0), 0);
    const actualSpent = categoryItems.reduce((sum, item) => sum + (item.actualCost || 0), 0);
    const deviation = totalBudget > 0 ? ((actualSpent - totalBudget) / totalBudget * 100) : 0;
    
    return {
      itemCount: categoryItems.length,
      totalBudget,
      actualSpent,
      deviation
    };
  };

  const getDeviationColor = (deviation) => {
    if (deviation < 0) return '#10B981'; // Green (under budget)
    if (deviation <= 10) return '#F59E0B'; // Yellow (slightly over)
    return '#EF4444'; // Red (significantly over)
  };

  // Filter items based on selected categories, statuses, and search term
  const filteredItems = scopeItems.filter(item => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Handle category filter changes
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6B7280' }}>
              Loading scope items...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Compact Category Stats - Horizontal Row */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'red' }}>
              🚀 NEW REORGANIZED SCOPE OVERVIEW 🚀
            </Typography>
            <Button
              variant="contained"
              startIcon={<MdAdd />}
              onClick={() => setAddItemDialogOpen(true)}
              sx={{ backgroundColor: '#516AC8' }}
            >
              Add Item
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {categories.map((category) => {
              const stats = getBudgetStats(category.id);
              return (
                <Grid item xs={12} sm={6} md={3} key={category.id}>
                  <Box sx={{ 
                    p: 1.5,
                    border: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 1,
                    backgroundColor: '#FAFAFA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: category.color,
                        mr: 1 
                      }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                          {category.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '11px' }}>
                          {stats.itemCount} items
                        </Typography>
                      </Box>
                    </Box>
                    {stats.deviation !== 0 && (
                      <Chip
                        label={`${stats.deviation > 0 ? '+' : ''}${stats.deviation.toFixed(0)}%`}
                        size="small"
                        sx={{
                          backgroundColor: getDeviationColor(stats.deviation) + '20',
                          color: getDeviationColor(stats.deviation),
                          fontSize: '10px',
                          height: '20px'
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content - Sidebar + Table */}
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
        {/* Filter Sidebar */}
        <Card sx={{ width: 250, height: 'fit-content' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Filters
            </Typography>

            {/* Search */}
            <TextField
              fullWidth
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ mb: 3 }}
            />

            {/* Category Filters */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Categories
            </Typography>
            <Box sx={{ mb: 3 }}>
              {categories.map((category) => {
                const stats = getBudgetStats(category.id);
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <Box 
                    key={category.id}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 1,
                      cursor: 'pointer',
                      borderRadius: 1,
                      backgroundColor: isSelected ? category.color + '10' : 'transparent',
                      '&:hover': { backgroundColor: category.color + '20' }
                    }}
                    onClick={() => handleCategoryFilter(category.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: 1,
                        backgroundColor: isSelected ? category.color : '#E5E7EB',
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected && (
                          <Box sx={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            backgroundColor: 'white' 
                          }} />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 400 }}>
                        {category.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '11px' }}>
                      {stats.itemCount}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Quick Actions */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => setSelectedCategories(['construction', 'millwork', 'electrical', 'mechanical'])}
                sx={{ justifyContent: 'flex-start' }}
              >
                Show All
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => setSelectedCategories([])}
                sx={{ justifyContent: 'flex-start' }}
              >
                Clear Filters
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Main Scope Items Table */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent sx={{ p: 0 }}>
            {/* Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: 1, 
              borderColor: 'divider',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                All Scope Items ({filteredItems.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" startIcon={<MdInventory />}>
                  Export
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  startIcon={<MdAdd />}
                  onClick={() => setAddItemDialogOpen(true)}
                  sx={{ backgroundColor: '#516AC8' }}
                >
                  Add Item
                </Button>
              </Box>
            </Box>

            {/* Scope Items Table */}
            {filteredItems.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Item Code</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Shop Drawings</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Material Specs</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Total Cost</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const category = categories.find(c => c.id === item.category);
                      const deviation = item.initialCost > 0 ? 
                        ((item.actualCost - item.initialCost) / item.initialCost * 100) : 0;
                      
                      return (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              {item.itemCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {item.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={category?.label || item.category}
                              size="small"
                              sx={{
                                backgroundColor: category?.color + '20' || '#F3F4F6',
                                color: category?.color || '#6B7280',
                                fontWeight: 500,
                                fontSize: '11px'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6B7280',
                                maxWidth: 150,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {item.linkedDrawings && item.linkedDrawings.length > 0 ? (
                              <Chip
                                icon={<DrawingIcon fontSize="small" />}
                                label={item.linkedDrawings.length}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#516AC8',
                                  color: '#516AC8',
                                  '& .MuiChip-icon': { color: '#516AC8' }
                                }}
                              />
                            ) : (
                              <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '12px' }}>
                                None
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.linkedSpecs && item.linkedSpecs.length > 0 ? (
                              <Chip
                                icon={<SpecIcon fontSize="small" />}
                                label={item.linkedSpecs.length}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#E3AF64',
                                  color: '#E3AF64',
                                  '& .MuiChip-icon': { color: '#E3AF64' }
                                }}
                              />
                            ) : (
                              <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '12px' }}>
                                None
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              ₺{item.totalPrice.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton size="small" sx={{ color: '#516AC8' }}>
                                <MdEdit fontSize="small" />
                              </IconButton>
                              <IconButton size="small" sx={{ color: '#EF4444' }}>
                                <MdDelete fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <MdInventory sx={{ fontSize: 64, color: '#E3AF64', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                  No scope items found
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2 }}>
                  {searchTerm || selectedCategories.length === 0 
                    ? 'Try adjusting your search criteria or filters' 
                    : 'Add your first scope item to get started'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<MdAdd />}
                  onClick={() => setAddItemDialogOpen(true)}
                  sx={{ backgroundColor: '#516AC8' }}
                >
                  Add Scope Item
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const ShopDrawingsTab = () => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Shop Drawings</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Shop drawings management system will include document approval workflow,
        revision tracking, and team assignments.
      </Alert>
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <ShopDrawingsIcon sx={{ fontSize: 64, color: '#516AC8', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#6B7280' }}>
          Shop Drawings
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
          Coming soon - document management and approval system
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const MaterialSpecsTab = () => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Material Specifications</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Material specifications system will include approval workflow,
        vendor management, and specification tracking.
      </Alert>
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <MaterialSpecsIcon sx={{ fontSize: 64, color: '#E3AF64', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#6B7280' }}>
          Material Specifications
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
          Coming soon - material specification management
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const ActivityFeedTab = () => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Activity Feed</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Activity feed will show real-time project updates, team interactions,
        and milestone achievements.
      </Alert>
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <ActivityIcon sx={{ fontSize: 64, color: '#10B981', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#6B7280' }}>
          Activity Feed
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
          Coming soon - real-time project activity tracking
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const ReportsTab = () => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Project Reports</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Reports section will include progress reports, budget analysis,
        team performance metrics, and project analytics.
      </Alert>
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <ReportsIcon sx={{ fontSize: 64, color: '#8B5CF6', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#6B7280' }}>
          Project Reports
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
          Coming soon - comprehensive project analytics and reporting
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const EnhancedProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projects, tasks, teamMembers, clients, loading, error } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const tabIndex = {
        'overview': 0,
        'scope': 1,
        'shop-drawings': 2,
        'material-specs': 3,
        'activity': 4,
        'reports': 5
      }[tabParam];
      
      if (tabIndex !== undefined) {
        setActiveTab(tabIndex);
      }
    }
  }, [searchParams]);

  // Find the current project
  const project = useMemo(() => {
    return projects.find(p => p.id === projectId);
  }, [projects, projectId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Overview', icon: <OverviewIcon />, component: OverviewTab },
    { label: 'Scope', icon: <ScopeIcon />, component: ScopeTab },
    { label: 'Shop Drawings', icon: <ShopDrawingsIcon />, component: ShopDrawingsTab },
    { label: 'Material Specs', icon: <MaterialSpecsIcon />, component: MaterialSpecsTab },
    { label: 'Activity Feed', icon: <ActivityIcon />, component: ActivityFeedTab },
    { label: 'Reports', icon: <ReportsIcon />, component: ReportsTab }
  ];

  // Loading state
  if (loading) {
    return (
      <CleanPageLayout
        title="Project Detail"
        subtitle="Loading project information..."
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: 'Loading...', href: '#' }
        ]}
      >
        <Box sx={{ p: 3 }}>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={400} />
        </Box>
      </CleanPageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <CleanPageLayout
        title="Project Detail"
        subtitle="Error loading project"
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: 'Error', href: '#' }
        ]}
      >
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/projects')}
            sx={{ backgroundColor: '#516AC8' }}
          >
            Back to Projects
          </Button>
        </Box>
      </CleanPageLayout>
    );
  }

  // Project not found
  if (!project) {
    return (
      <CleanPageLayout
        title="Project Not Found"
        subtitle="The requested project could not be found"
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: 'Not Found', href: '#' }
        ]}
      >
        <Box sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Project with ID "{projectId}" was not found.
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/projects')}
            sx={{ backgroundColor: '#516AC8' }}
          >
            Back to Projects
          </Button>
        </Box>
      </CleanPageLayout>
    );
  }

  return (
    <CleanPageLayout
      title={project?.name || 'Project'}
      subtitle={`${project?.type || 'Project'} • ${project?.status || 'Active'}`}
      breadcrumbs={[
        { label: 'Projects', href: '/projects' },
        { label: project?.name || 'Project', href: `/projects/${projectId}` }
      ]}
      headerActions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ borderColor: '#E3AF64', color: '#E3AF64' }}
          >
            Print
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ borderColor: '#516AC8', color: '#516AC8' }}
          >
            Export
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ backgroundColor: '#0F1939' }}
          >
            Edit Project
          </Button>
        </Box>
      }
    >
      <Box className="clean-fade-in">
        {/* Tabs */}
        <Paper elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 120,
                fontWeight: 500,
                color: '#6B7280',
                '&.Mui-selected': {
                  color: '#0F1939',
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#E3AF64',
                height: 3
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                id={`project-tab-${index}`}
                aria-controls={`project-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            <tab.component 
              project={project}
              tasks={tasks}
              teamMembers={teamMembers}
              clients={clients}
            />
          </TabPanel>
        ))}
      </Box>
    </CleanPageLayout>
  );
};

export default EnhancedProjectDetailPage;