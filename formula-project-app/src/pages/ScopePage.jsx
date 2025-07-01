import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  MdSearch as SearchIcon,
  MdAdd as AddIcon,
  MdFilterList as FilterIcon,
  MdVisibility as ViewIcon,
  MdEdit as EditIcon,
  MdInventory as ScopeIcon,
  MdBusiness as ProjectIcon
} from 'react-icons/md';
import CleanPageLayout from '../components/layout/CleanPageLayout';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const ScopePage = () => {
  const { projects, loading, error } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects that have scope items
  const projectsWithScope = projects.filter(project => 
    project.scopeItems && project.scopeItems > 0
  );

  // Search functionality
  const filteredProjects = projectsWithScope.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}?tab=scope`);
  };

  const getProjectScopeStats = (project) => {
    // This would normally come from scope items data
    // For now, using demo values
    return {
      totalItems: project.scopeItems || 0,
      totalBudget: project.budget || 0,
      categories: {
        construction: Math.floor((project.scopeItems || 0) * 0.4),
        millwork: Math.floor((project.scopeItems || 0) * 0.3),
        electrical: Math.floor((project.scopeItems || 0) * 0.2),
        mechanical: Math.floor((project.scopeItems || 0) * 0.1)
      }
    };
  };

  const getCategoryColor = (category) => {
    const colors = {
      construction: '#E3AF64', // Caramel
      millwork: '#516AC8', // Sapphire
      electrical: '#0F1939', // Cosmic
      mechanical: '#10B981' // Green
    };
    return colors[category] || '#6B7280';
  };

  if (loading) {
    return (
      <CleanPageLayout
        title="Scope Management"
        subtitle="Loading scope data..."
        breadcrumbs={[
          { label: 'Work Management', href: '#' },
          { label: 'Scope', href: '/scope' }
        ]}
      >
        <Box sx={{ p: 3 }}>
          <Typography>Loading...</Typography>
        </Box>
      </CleanPageLayout>
    );
  }

  if (error) {
    return (
      <CleanPageLayout
        title="Scope Management"
        subtitle="Error loading scope data"
        breadcrumbs={[
          { label: 'Work Management', href: '#' },
          { label: 'Scope', href: '/scope' }
        ]}
      >
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </CleanPageLayout>
    );
  }

  return (
    <CleanPageLayout
      title="Scope Management"
      subtitle="Manage project scope across all categories"
      breadcrumbs={[
        { label: 'Work Management', href: '#' },
        { label: 'Scope', href: '/scope' }
      ]}
      headerActions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ borderColor: '#E3AF64', color: '#E3AF64' }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#516AC8' }}
          >
            New Scope Item
          </Button>
        </Box>
      }
    >
      <Box className="clean-fade-in">
        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScopeIcon sx={{ color: '#E3AF64', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total Projects
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#E3AF64' }}>
                  {projectsWithScope.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  With scope items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ProjectIcon sx={{ color: '#516AC8', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total Items
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#516AC8' }}>
                  {projectsWithScope.reduce((sum, project) => sum + (project.scopeItems || 0), 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Across all projects
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Total Budget
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#0F1939' }}>
                  ₺{projectsWithScope.reduce((sum, project) => sum + (project.budget || 0), 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Combined scope value
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Active Projects
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#10B981' }}>
                  {projectsWithScope.filter(p => p.status === 'active').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Currently in progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search projects by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6B7280' }} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 500 }}
          />
        </Box>

        {/* Projects Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Scope Items</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Categories</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Budget</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const scopeStats = getProjectScopeStats(project);
                    return (
                      <TableRow key={project.id} hover>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {project.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            {project.location}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={project.type || 'General'} 
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: '#516AC8', color: '#516AC8' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={project.status || 'Active'} 
                            size="small"
                            sx={{
                              backgroundColor: project.status === 'active' ? '#E8F5E8' : '#F3F4F6',
                              color: project.status === 'active' ? '#2E7D32' : '#6B7280'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {scopeStats.totalItems}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            items
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {Object.entries(scopeStats.categories).map(([category, count]) => (
                              count > 0 && (
                                <Chip
                                  key={category}
                                  label={`${category.charAt(0).toUpperCase()}${category.slice(1)}: ${count}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: getCategoryColor(category) + '20',
                                    color: getCategoryColor(category),
                                    fontSize: '11px'
                                  }}
                                />
                              )
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            ₺{scopeStats.totalBudget.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewProject(project.id)}
                              sx={{ color: '#516AC8' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ color: '#E3AF64' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredProjects.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ScopeIcon sx={{ fontSize: 64, color: '#E3AF64', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                  No projects found
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                  {searchTerm ? 'Try adjusting your search criteria' : 'No projects with scope items available'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </CleanPageLayout>
  );
};

export default ScopePage;