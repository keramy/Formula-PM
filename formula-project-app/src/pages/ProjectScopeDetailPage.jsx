/**
 * Project Scope Detail Page - Standalone full-page scope management
 * Provides enhanced scope management experience with better editing capabilities
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  LinearProgress,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Tooltip,
  Skeleton
} from '@mui/material';
import {
  MdBusiness as ProjectIcon,
  MdList as ScopeIcon,
  MdAdd,
  MdEdit,
  MdDelete,
  MdInventory,
  MdDescription as DrawingIcon,
  MdLibraryBooks as SpecIcon,
  MdLink as LinkIcon,
  MdSearch as SearchIcon,
  MdFilterList as FilterIcon,
  MdArrowBack as BackIcon,
  MdDownload as ExportIcon,
  MdUpload as ImportIcon
} from 'react-icons/md';
import CleanPageLayout from '../components/layout/CleanPageLayout';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { format, differenceInDays, parseISO, isValid } from 'date-fns';
import apiService from '../services/api/apiService';

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

const ProjectScopeDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, teamMembers, clients, loading, error } = useData();
  const { user } = useAuth();
  
  // Local state
  const [activeCategory, setActiveCategory] = useState(0);
  const [scopeItems, setScopeItems] = useState([]);
  const [scopeLoading, setScopeLoading] = useState(true);
  const [scopeError, setScopeError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

  // Find the current project
  const project = useMemo(() => {
    return projects.find(p => p.id === projectId);
  }, [projects, projectId]);

  // Fetch scope items when component mounts or project changes
  useEffect(() => {
    const fetchScopeItems = async () => {
      if (!projectId) {
        console.log('No project ID available');
        return;
      }
      
      console.log('Fetching scope items for project:', projectId);
      
      try {
        setScopeLoading(true);
        setScopeError(null);
        const items = await apiService.getScopeItems(projectId);
        console.log('Received scope items:', items);
        setScopeItems(items || []);
      } catch (error) {
        console.error('Error fetching scope items:', error);
        setScopeError('Failed to load scope items');
        setScopeItems([]);
      } finally {
        setScopeLoading(false);
      }
    };
    
    fetchScopeItems();
  }, [projectId]);

  // Define the 4 scope categories
  const categories = [
    { id: 'construction', label: 'Construction', color: '#E3AF64', prefix: 'C' },
    { id: 'millwork', label: 'Millwork', color: '#516AC8', prefix: 'M' },
    { id: 'electrical', label: 'Electrical', color: '#0F1939', prefix: 'E' },
    { id: 'mechanical', label: 'Mechanical', color: '#10B981', prefix: 'MC' }
  ];

  // Filter items by active category and search term
  const filteredItems = scopeItems.filter(item => {
    const matchesCategory = item.category === categories[activeCategory].id;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  // Helper to get deviation color
  const getDeviationColor = (deviation) => {
    if (Math.abs(deviation) < 5) return '#10B981'; // Green - within tolerance
    if (Math.abs(deviation) < 15) return '#F59E0B'; // Yellow - moderate deviation
    return '#EF4444'; // Red - significant deviation
  };

  // Handle category change
  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
  };

  // Handle back navigation
  const handleBackToProject = () => {
    navigate(`/projects/${projectId}?tab=scope`);
  };

  // Handle back to scope overview
  const handleBackToScope = () => {
    navigate('/scope');
  };

  // Loading state
  if (loading) {
    return (
      <CleanPageLayout
        title="Project Scope Management"
        subtitle="Loading project information..."
        breadcrumbs={[
          { label: 'Scope', href: '/scope' },
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
        title="Project Scope Management"
        subtitle="Error loading project"
        breadcrumbs={[
          { label: 'Scope', href: '/scope' },
          { label: 'Error', href: '#' }
        ]}
      >
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={handleBackToScope}
            sx={{ backgroundColor: '#516AC8' }}
          >
            Back to Scope Management
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
          { label: 'Scope', href: '/scope' },
          { label: 'Not Found', href: '#' }
        ]}
      >
        <Box sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Project with ID "{projectId}" was not found.
          </Alert>
          <Button 
            variant="contained" 
            onClick={handleBackToScope}
            sx={{ backgroundColor: '#516AC8' }}
          >
            Back to Scope Management
          </Button>
        </Box>
      </CleanPageLayout>
    );
  }

  return (
    <CleanPageLayout
      title={`Scope Management - ${project.name}`}
      subtitle={`${project.type} • ${project.status} • Full-page editing interface`}
      breadcrumbs={[
        { label: 'Scope', href: '/scope' },
        { label: project.name, href: `/projects/${projectId}/scope` }
      ]}
      headerActions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBackToProject}
            sx={{ borderColor: '#E3AF64', color: '#E3AF64' }}
          >
            Project Detail
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ImportIcon />}
            sx={{ borderColor: '#516AC8', color: '#516AC8' }}
          >
            Import
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ExportIcon />}
            sx={{ borderColor: '#516AC8', color: '#516AC8' }}
          >
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
      }
    >
      <Box className="clean-fade-in">
        {/* Project Summary */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ProjectIcon sx={{ color: '#516AC8', mr: 1, fontSize: 28 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6B7280' }}>
                      {project.description}
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
                      Total Budget
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ₺{project.budget?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
                      Progress
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {project.progress || 0}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
                      Start Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {safeFormatDate(project.startDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
                      End Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {safeFormatDate(project.endDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500, mb: 1 }}>
                  Project Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={project.progress || 0} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#F3F4F6',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#516AC8'
                    }
                  }} 
                />
                <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
                  {project.progress || 0}% Complete
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Category Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {categories.map((category, index) => {
            const stats = getBudgetStats(category.id);
            return (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <Card sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  transform: activeCategory === index ? 'translateY(-2px)' : 'none',
                  boxShadow: activeCategory === index ? 3 : 1,
                  border: activeCategory === index ? `2px solid ${category.color}` : '2px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
                onClick={() => setActiveCategory(index)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: category.color,
                        mr: 1.5
                      }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#374151' }}>
                        {category.label}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" sx={{ fontWeight: 700, color: category.color, mb: 0.5 }}>
                      {stats.itemCount} items
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                      Budget: ₺{stats.totalBudget.toLocaleString()}
                    </Typography>
                    
                    {stats.deviation !== 0 && (
                      <Chip
                        label={`${stats.deviation > 0 ? '+' : ''}${stats.deviation.toFixed(1)}%`}
                        size="small"
                        sx={{
                          backgroundColor: getDeviationColor(stats.deviation) + '20',
                          color: getDeviationColor(stats.deviation),
                          fontWeight: 600,
                          fontSize: '11px'
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Search and Filter */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder={`Search ${categories[activeCategory].label.toLowerCase()} items...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6B7280' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ borderColor: '#E3AF64', color: '#E3AF64' }}
          >
            Filter
          </Button>
        </Box>

        {/* Category Tabs */}
        <Paper elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs
            value={activeCategory}
            onChange={handleCategoryChange}
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
                  color: categories[activeCategory].color,
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: categories[activeCategory].color,
                height: 3
              }
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: category.color 
                    }} />
                    {category.label}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>

        {/* Scope Items Content */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {/* Header */}
            <Box sx={{ 
              p: 3, 
              pb: 0, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {categories[activeCategory].label} Items ({filteredItems.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<MdAdd />}
                onClick={() => setAddItemDialogOpen(true)}
                sx={{ 
                  backgroundColor: categories[activeCategory].color,
                  '&:hover': {
                    backgroundColor: categories[activeCategory].color,
                    opacity: 0.9
                  }
                }}
              >
                Add {categories[activeCategory].label} Item
              </Button>
            </Box>

            {/* Loading State */}
            {scopeLoading && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#6B7280' }}>
                  Loading scope items...
                </Typography>
              </Box>
            )}

            {/* Error State */}
            {scopeError && (
              <Box sx={{ p: 3 }}>
                <Alert severity="error">
                  {scopeError}
                </Alert>
              </Box>
            )}

            {/* Scope Items Table */}
            {!scopeLoading && !scopeError && (
              <>
                {filteredItems.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Item Code</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Shop Drawings</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Material Specs</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Total Cost</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredItems.map((item) => {
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
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: '#6B7280',
                                    maxWidth: 200,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {item.description}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {item.linkedDrawings && item.linkedDrawings.length > 0 ? (
                                    item.linkedDrawings.map((drawingId) => (
                                      <Chip
                                        key={drawingId}
                                        label={drawingId}
                                        size="small"
                                        icon={<DrawingIcon />}
                                        sx={{
                                          backgroundColor: '#E8F4FD',
                                          color: '#1565C0',
                                          fontSize: '11px',
                                          height: '20px'
                                        }}
                                      />
                                    ))
                                  ) : (
                                    <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '12px' }}>
                                      No drawings
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {item.linkedSpecs && item.linkedSpecs.length > 0 ? (
                                    item.linkedSpecs.map((specId) => (
                                      <Chip
                                        key={specId}
                                        label={specId}
                                        size="small"
                                        icon={<SpecIcon />}
                                        sx={{
                                          backgroundColor: '#F3E8FF',
                                          color: '#7C3AED',
                                          fontSize: '11px',
                                          height: '20px'
                                        }}
                                      />
                                    ))
                                  ) : (
                                    <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '12px' }}>
                                      No specs
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    ₺{(item.totalPrice || item.actualCost || 0).toLocaleString()}
                                  </Typography>
                                  {deviation !== 0 && (
                                    <Chip
                                      label={`${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}%`}
                                      size="small"
                                      sx={{
                                        backgroundColor: getDeviationColor(deviation) + '20',
                                        color: getDeviationColor(deviation),
                                        fontSize: '10px',
                                        height: '18px',
                                        mt: 0.5
                                      }}
                                    />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Tooltip title="Edit item">
                                    <IconButton size="small" sx={{ color: '#516AC8' }}>
                                      <MdEdit />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Link drawings/specs">
                                    <IconButton size="small" sx={{ color: '#E3AF64' }}>
                                      <LinkIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete item">
                                    <IconButton size="small" sx={{ color: '#EF4444' }}>
                                      <MdDelete />
                                    </IconButton>
                                  </Tooltip>
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
                    <ScopeIcon sx={{ fontSize: 64, color: categories[activeCategory].color, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                      No {categories[activeCategory].label.toLowerCase()} items found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2 }}>
                      {searchTerm ? 'Try adjusting your search criteria' : `Add the first ${categories[activeCategory].label.toLowerCase()} item to get started`}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<MdAdd />}
                      onClick={() => setAddItemDialogOpen(true)}
                      sx={{ 
                        backgroundColor: categories[activeCategory].color,
                        '&:hover': {
                          backgroundColor: categories[activeCategory].color,
                          opacity: 0.9
                        }
                      }}
                    >
                      Add {categories[activeCategory].label} Item
                    </Button>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </CleanPageLayout>
  );
};

export default ProjectScopeDetailPage;