// BACKUP of original ScopeTab component before reorganization
// Created: 2025-07-01
// Original implementation with category cards, tabs, and filtered table

import React, { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdInventory,
  MdDescription as DrawingIcon,
  MdLibraryBooks as SpecIcon
} from 'react-icons/md';
import apiService from '../../../services/api/apiService';

// Scope Tab Component with 4 Categories
const ScopeTab = ({ project, tasks, teamMembers, clients }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [scopeItems, setScopeItems] = useState([]);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Filter items by active category
  const filteredItems = scopeItems.filter(item => 
    item.category === categories[activeCategory].id
  );

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

  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
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
    <Box>
      {/* Budget Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {categories.map((category, index) => {
          const stats = getBudgetStats(category.id);
          return (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <Card sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderColor: activeCategory === index ? category.color : 'transparent',
                borderWidth: 2,
                borderStyle: 'solid',
                '&:hover': {
                  borderColor: category.color,
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
              onClick={() => setActiveCategory(index)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: category.color,
                      mr: 1 
                    }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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
          {/* Header with Add Button */}
          <Box sx={{ 
            p: 3, 
            pb: 0, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {categories[activeCategory].label} Items
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
              Add Item
            </Button>
          </Box>

          {/* Scope Items Table */}
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
                          {item.linkedDrawings && item.linkedDrawings.length > 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                icon={<DrawingIcon fontSize="small" />}
                                label={`${item.linkedDrawings.length} Drawing${item.linkedDrawings.length > 1 ? 's' : ''}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#516AC8',
                                  color: '#516AC8',
                                  '& .MuiChip-icon': { color: '#516AC8' }
                                }}
                              />
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: '#9CA3AF', fontStyle: 'italic' }}>
                              No drawings
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.linkedSpecs && item.linkedSpecs.length > 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                icon={<SpecIcon fontSize="small" />}
                                label={`${item.linkedSpecs.length} Spec${item.linkedSpecs.length > 1 ? 's' : ''}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#E3AF64',
                                  color: '#E3AF64',
                                  '& .MuiChip-icon': { color: '#E3AF64' }
                                }}
                              />
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: '#9CA3AF', fontStyle: 'italic' }}>
                              No specs
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
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%', 
                backgroundColor: categories[activeCategory].color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <MdInventory sx={{ fontSize: 32, color: categories[activeCategory].color }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                No {categories[activeCategory].label.toLowerCase()} items
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2 }}>
                Start by adding your first {categories[activeCategory].label.toLowerCase()} scope item
              </Typography>
              <Button
                variant="outlined"
                startIcon={<MdAdd />}
                onClick={() => setAddItemDialogOpen(true)}
                sx={{ 
                  borderColor: categories[activeCategory].color,
                  color: categories[activeCategory].color
                }}
              >
                Add First Item
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ScopeTab;