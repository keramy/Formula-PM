import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  LinearProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  FileUpload as ImportIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  TrendingUp as ProgressIcon,
  Link as LinkIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import EnhancedScopeItemForm from './EnhancedScopeItemForm';
import ScopeImportDialog from './ScopeImportDialog';
import ConnectionManagementDialog from './ConnectionManagementDialog';
import WorkflowDashboard from './WorkflowDashboard';
import apiService from '../../../services/api/apiService';
import PageWrapper from '../../../components/layout/PageWrapper';
import connectionService from '../../../services/connectionService';

const EnhancedProjectScope = React.memo(({ project, onClose, shopDrawings = [], materialSpecs = [] }) => {
  const [scopeItems, setScopeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Auto-cleanup notifications to prevent memory leaks
  useEffect(() => {
    if (notification.open) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, open: false }));
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.open]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [groupTimelines, setGroupTimelines] = useState({
    construction: { duration: 4, startDate: null, endDate: null },
    millwork: { duration: 6, startDate: null, endDate: null },
    electric: { duration: 3, startDate: null, endDate: null },
    mep: { duration: 5, startDate: null, endDate: null }
  });
  
  // Connection management state
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [selectedItemForConnection, setSelectedItemForConnection] = useState(null);
  const [showWorkflowDashboard, setShowWorkflowDashboard] = useState(false);

  // Enhanced scope groups and categories
  const scopeGroups = {
    construction: {
      name: 'Construction',
      icon: '🏗️',
      color: '#E67E22',
      duration: 0, // weeks - will be calculated
      categories: [
        'Demolition',
        'Structural Work',
        'Flooring & Tiling',
        'Painting & Finishing',
        'Glass & Glazing',
        'Insulation',
        'Waterproofing',
        'General Contractor Items'
      ]
    },
    millwork: {
      name: 'Millwork',
      icon: '🪵',
      color: '#8B4513',
      duration: 0,
      categories: [
        'Millwork & Carpentry',
        'Hardware & Accessories',
        'Cabinet Installation',
        'Trim & Molding',
        'Custom Joinery'
      ]
    },
    electric: {
      name: 'Electric',
      icon: '⚡',
      color: '#F1C40F',
      duration: 0,
      categories: [
        'Electrical Systems',
        'Lighting Installation',
        'Power Distribution',
        'Security Systems',
        'Fire Safety Systems'
      ]
    },
    mep: {
      name: 'MEP',
      icon: '🔧',
      color: '#3498DB',
      duration: 0,
      categories: [
        'HVAC Systems',
        'Plumbing Systems',
        'Mechanical Systems',
        'Ventilation',
        'Temperature Controls'
      ]
    }
  };

  // Flatten categories for backwards compatibility
  const scopeCategories = Object.values(scopeGroups).flatMap(group => group.categories);

  // Memoized group statistics calculation for better performance
  const groupStatistics = useMemo(() => {
    const groupStats = {};
    
    Object.keys(scopeGroups).forEach(groupKey => {
      const group = scopeGroups[groupKey];
      const groupItems = scopeItems.filter(item => 
        group.categories.includes(item.category)
      );
      
      const completedItems = groupItems.filter(item => item.status === 'completed');
      const totalItems = groupItems.length;
      const progress = totalItems > 0 ? (completedItems.length / totalItems) * 100 : 0;
      const totalValue = groupItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      
      groupStats[groupKey] = {
        ...group,
        items: groupItems,
        totalItems,
        completedItems: completedItems.length,
        progress: Math.round(progress),
        totalValue,
        duration: groupTimelines[groupKey]?.duration || 0
      };
    });
    
    return groupStats;
  }, [scopeItems, groupTimelines]);

  // Memoized filtered items for better performance
  const filteredItems = useMemo(() => {
    if (selectedGroup === 'all') return scopeItems;
    
    const group = scopeGroups[selectedGroup];
    if (!group) return scopeItems;
    
    return scopeItems.filter(item => group.categories.includes(item.category));
  }, [selectedGroup, scopeItems]);

  // Memoized callback to prevent unnecessary re-renders
  const handleUpdateItemProgress = useCallback(async (itemId, progress, status) => {
    try {
      const updatedItem = {
        progress: parseInt(progress),
        status: status || (progress === 100 ? 'completed' : 'in-progress'),
        updatedAt: new Date().toISOString()
      };

      await apiService.updateScopeItem(itemId, updatedItem);
      setScopeItems(scopeItems.map(item => 
        item.id === itemId ? { ...item, ...updatedItem } : item
      ));
      showNotification('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
      showNotification('Failed to update progress', 'error');
    }
  }, [scopeItems]);

  // Memoized callback for timeline updates
  const handleUpdateGroupTimeline = useCallback((groupKey, duration) => {
    setGroupTimelines(prev => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        duration: parseInt(duration)
      }
    }));
    showNotification(`${scopeGroups[groupKey].name} timeline updated`);
  }, []);

  // Memoized callbacks for better performance
  const handleManageConnections = useCallback((item) => {
    setSelectedItemForConnection(item);
    setConnectionDialogOpen(true);
  }, []);

  const handleConnectionsUpdated = useCallback(() => {
    // Refresh any dependency analysis or notifications
    showNotification('Connections updated successfully');
  }, []);

  // Memoized connection status to avoid recalculation
  const getConnectionStatus = useCallback((item) => {
    const analysis = connectionService.analyzeScopeItemDependencies(item, shopDrawings, materialSpecs);
    return {
      isBlocked: analysis.isBlocked,
      hasWarnings: analysis.hasWarnings,
      connectedDrawings: analysis.connections.drawings.length,
      connectedMaterials: analysis.connections.materials.length,
      blockers: analysis.blockers,
      warnings: analysis.warnings
    };
  }, [shopDrawings, materialSpecs]);

  // Load scope items with proper cleanup
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await loadScopeItems();
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [project.id]);

  const loadScopeItems = async () => {
    try {
      setLoading(true);
      const items = await apiService.getScopeItems(project.id);
      setScopeItems(items || []);
    } catch (error) {
      console.error('Error loading scope items:', error);
      showNotification('Failed to load scope items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleAddScopeItem = async (itemData) => {
    try {
      const newItem = {
        ...itemData,
        id: Date.now(),
        projectId: project.id,
        createdAt: new Date().toISOString(),
        totalPrice: parseFloat(itemData.quantity) * parseFloat(itemData.unitPrice),
        progress: itemData.progress || 0,
        status: itemData.status || 'pending',
        shopDrawingRequired: itemData.shopDrawingRequired || false,
        materialSpecRequired: itemData.materialSpecRequired || false
      };

      await apiService.createScopeItem(newItem);
      setScopeItems([...scopeItems, newItem]);
      setAddDialogOpen(false);
      showNotification('Scope item added successfully');
    } catch (error) {
      console.error('Error adding scope item:', error);
      showNotification('Failed to add scope item', 'error');
    }
  };

  const handleEditScopeItem = async (itemData) => {
    try {
      const updatedItem = {
        ...itemData,
        totalPrice: parseFloat(itemData.quantity) * parseFloat(itemData.unitPrice),
        updatedAt: new Date().toISOString()
      };

      await apiService.updateScopeItem(editingItem.id, updatedItem);
      setScopeItems(scopeItems.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      setEditingItem(null);
      showNotification('Scope item updated successfully');
    } catch (error) {
      console.error('Error updating scope item:', error);
      showNotification('Failed to update scope item', 'error');
    }
  };

  const handleDeleteScopeItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this scope item?')) {
      try {
        await apiService.deleteScopeItem(itemId);
        setScopeItems(scopeItems.filter(item => item.id !== itemId));
        showNotification('Scope item deleted successfully');
      } catch (error) {
        console.error('Error deleting scope item:', error);
        showNotification('Failed to delete scope item', 'error');
      }
    }
  };

  const handleImportItems = async (importedItems) => {
    try {
      const newItems = importedItems.map(item => ({
        ...item,
        id: Date.now() + Math.random(),
        projectId: project.id,
        createdAt: new Date().toISOString(),
        totalPrice: parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)
      }));

      for (const item of newItems) {
        await apiService.createScopeItem(item);
      }

      setScopeItems([...scopeItems, ...newItems]);
      setImportDialogOpen(false);
      showNotification(`Successfully imported ${newItems.length} scope items`);
    } catch (error) {
      console.error('Error importing scope items:', error);
      showNotification('Failed to import scope items', 'error');
    }
  };

  const downloadExcelTemplate = () => {
    // Create CSV content for Excel template
    const csvContent = [
      ['Description', 'Category', 'Quantity', 'Unit', 'Unit Price', 'Notes'],
      ['Example: Install Kitchen Cabinets', 'Millwork & Carpentry', '10', 'sqft', '150', 'Premium oak finish'],
      ['Example: Electrical Wiring', 'Electrical Systems', '500', 'lft', '12', 'Include outlets and switches'],
      ['Example: Flooring Installation', 'Flooring & Tiling', '200', 'sqft', '45', 'Hardwood flooring']
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `scope_items_template_${project.name.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('Excel template downloaded successfully');
    }
  };

  // Memoized summary statistics for better performance
  const summaryStats = useMemo(() => {
    const totalItems = scopeItems.length;
    const totalQuantity = scopeItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
    const totalValue = scopeItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const completedItems = scopeItems.filter(item => item.status === 'completed').length;
    const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    return {
      totalItems,
      totalQuantity,
      totalValue,
      completedItems,
      overallProgress
    };
  }, [scopeItems]);

  return (
    <PageWrapper
      pageType="project-scope"
      pageTitle="Scope Management"
      pageData={{
        projectId: project.id,
        projectName: project.name,
        status: project.status,
        type: project.type
      }}
      subtitle={`${summaryStats.totalItems} items • $${summaryStats.totalValue.toLocaleString()} total value`}
      actions={[
        {
          icon: <DownloadIcon />,
          label: 'Download Template',
          onClick: downloadExcelTemplate,
          color: 'success'
        },
        {
          icon: <ImportIcon />,
          label: 'Import Excel',
          onClick: () => setImportDialogOpen(true),
          color: 'default'
        },
        {
          icon: <AddIcon />,
          label: 'Add Item',
          onClick: () => setAddDialogOpen(true),
          color: 'primary'
        }
      ]}
      onNavigate={(path) => {
        if (path === '/projects') {
          onClose();
        }
      }}
      contentPadding={0}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Enhanced Summary Cards with Group Progress */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Overall Progress */}
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E9ECEF', boxShadow: 'none' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ 
                    width: 60, height: 60, backgroundColor: '#3498DB', borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <ProgressIcon sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2C3E50', mb: 1 }}>
                    {summaryStats.overallProgress}%
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Overall Progress
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={summaryStats.overallProgress} 
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Total Items */}
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E9ECEF', boxShadow: 'none' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ 
                    width: 60, height: 60, backgroundColor: '#27AE60', borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>📋</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2C3E50', mb: 1 }}>
                    {summaryStats.totalItems}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Total Items
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Value */}
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E9ECEF', boxShadow: 'none' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ 
                    width: 60, height: 60, backgroundColor: '#F39C12', borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>💰</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2C3E50', mb: 1 }}>
                    ${summaryStats.totalValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Total Value
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Timeline */}
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E9ECEF', boxShadow: 'none' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ 
                    width: 60, height: 60, backgroundColor: '#9B59B6', borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <TimeIcon sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2C3E50', mb: 1 }}>
                    {Object.values(groupTimelines).reduce((sum, group) => sum + group.duration, 0)}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Total Weeks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Scope Groups with Timeline Management */}
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Scope Groups & Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage scope items by groups with timeline and progress tracking
          </Typography>

          <Grid container spacing={3}>
            {Object.entries(groupStatistics).map(([groupKey, stats]) => (
              <Grid item xs={12} md={6} lg={3} key={groupKey}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    border: selectedGroup === groupKey ? `2px solid ${stats.color}` : '1px solid #E9ECEF',
                    boxShadow: selectedGroup === groupKey ? `0 4px 12px ${stats.color}20` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedGroup(groupKey)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 1 }}>{stats.icon}</Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {stats.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stats.totalItems} items • {stats.duration} weeks
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Progress</Typography>
                        <Typography variant="body2" fontWeight={600}>{stats.progress}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={stats.progress}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: stats.color
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        ${stats.totalValue.toLocaleString()}
                      </Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={stats.duration}
                        onChange={(e) => handleUpdateGroupTimeline(groupKey, e.target.value)}
                        sx={{ width: 80 }}
                        InputProps={{
                          endAdornment: <Typography variant="caption">wks</Typography>
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* View Mode Tabs */}
        <Box sx={{ px: 3 }}>
          <Tabs 
            value={showWorkflowDashboard ? 'workflow' : selectedGroup} 
            onChange={(_, value) => {
              if (value === 'workflow') {
                setShowWorkflowDashboard(true);
              } else {
                setShowWorkflowDashboard(false);
                setSelectedGroup(value);
              }
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500
              }
            }}
          >
            <Tab 
              icon={<DashboardIcon />}
              label="Workflow Dashboard" 
              value="workflow"
              iconPosition="start"
            />
            <Tab label="All Items" value="all" />
            {Object.entries(scopeGroups).map(([groupKey, group]) => (
              <Tab 
                key={groupKey}
                label={`${group.icon} ${group.name}`} 
                value={groupKey}
              />
            ))}
          </Tabs>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, mx: 3, mb: 3 }}>
          {showWorkflowDashboard ? (
            <WorkflowDashboard
              project={project}
              scopeItems={scopeItems}
              shopDrawings={shopDrawings}
              materialSpecs={materialSpecs}
              onItemSelect={(item) => {
                setShowWorkflowDashboard(false);
                handleManageConnections(item);
              }}
            />
          ) : (
            <Paper sx={{ 
              borderRadius: 3, 
              border: '1px solid #E9ECEF',
              boxShadow: 'none',
              overflow: 'hidden'
            }}>
              <Box sx={{ p: 2, backgroundColor: '#F8F9FA', borderBottom: '1px solid #E9ECEF' }}>
                <Typography variant="h6" fontWeight={600}>
                  {selectedGroup === 'all' 
                    ? `All Scope Items (${filteredItems.length})`
                    : `${scopeGroups[selectedGroup]?.name} Items (${filteredItems.length})`
                  }
                </Typography>
              </Box>
            
            <TableContainer sx={{ maxHeight: 'calc(100vh - 500px)' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Item Details</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Progress</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Connections</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Value</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#F8F9FA' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          {selectedGroup === 'all' 
                            ? 'No scope items found. Click "Add Item" to get started.'
                            : `No items in ${scopeGroups[selectedGroup]?.name} group. Add items to this category.`
                          }
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} hover>
                        {/* Item Details */}
                        <TableCell sx={{ minWidth: 300 }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Chip 
                                label={item.category || 'Uncategorized'} 
                                size="small"
                                sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {item.quantity} {item.unit || 'pcs'}
                              </Typography>
                            </Box>
                            {item.notes && (
                              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                {item.notes}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        {/* Progress */}
                        <TableCell sx={{ minWidth: 200 }}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" fontWeight={500}>
                                {item.progress || 0}%
                              </Typography>
                              <Chip 
                                label={item.status || 'pending'}
                                size="small"
                                sx={{
                                  backgroundColor: 
                                    item.status === 'completed' ? '#4CAF50' :
                                    item.status === 'in-progress' ? '#FF9800' : '#9E9E9E',
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                            <Slider
                              value={item.progress || 0}
                              onChange={(_, value) => handleUpdateItemProgress(item.id, value)}
                              valueLabelDisplay="auto"
                              valueLabelFormat={(value) => `${value}%`}
                              step={5}
                              min={0}
                              max={100}
                              size="small"
                              sx={{
                                '& .MuiSlider-thumb': {
                                  width: 16,
                                  height: 16
                                },
                                '& .MuiSlider-track': {
                                  height: 6
                                }
                              }}
                            />
                          </Box>
                        </TableCell>

                        {/* Connections */}
                        <TableCell>
                          {(() => {
                            const connectionStatus = getConnectionStatus(item);
                            return (
                              <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {item.shopDrawingRequired ? (
                                    connectionStatus.connectedDrawings > 0 ? (
                                      <Chip 
                                        label={`${connectionStatus.connectedDrawings} Drawing(s)`}
                                        size="small" 
                                        color="success"
                                        icon={<CheckCircleIcon />}
                                      />
                                    ) : (
                                      <Chip 
                                        label="Drawing Required" 
                                        size="small" 
                                        color="warning"
                                        icon={<WarningIcon />}
                                      />
                                    )
                                  ) : (
                                    <Chip 
                                      label="No Drawing" 
                                      size="small" 
                                      color="default"
                                    />
                                  )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {item.materialSpecRequired ? (
                                    connectionStatus.connectedMaterials > 0 ? (
                                      <Chip 
                                        label={`${connectionStatus.connectedMaterials} Spec(s)`}
                                        size="small" 
                                        color="success"
                                        icon={<CheckCircleIcon />}
                                      />
                                    ) : (
                                      <Chip 
                                        label="Spec Required" 
                                        size="small" 
                                        color="warning"
                                        icon={<WarningIcon />}
                                      />
                                    )
                                  ) : (
                                    <Chip 
                                      label="No Spec" 
                                      size="small" 
                                      color="default"
                                    />
                                  )}
                                </Box>
                                {connectionStatus.isBlocked && (
                                  <Chip 
                                    label="Production Blocked"
                                    size="small" 
                                    color="error"
                                    icon={<WarningIcon />}
                                  />
                                )}
                              </Box>
                            );
                          })()}
                        </TableCell>

                        {/* Value */}
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ${(item.totalPrice || 0).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ${parseFloat(item.unitPrice || 0).toFixed(2)} per {item.unit || 'pc'}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small"
                              onClick={() => handleManageConnections(item)}
                              sx={{ color: '#9C27B0' }}
                              title="Manage Connections"
                            >
                              <LinkIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => setEditingItem(item)}
                              sx={{ color: '#3498DB' }}
                              title="Edit Item"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => handleDeleteScopeItem(item.id)}
                              sx={{ color: '#E74C3C' }}
                              title="Delete Item"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            {item.attachments && (
                              <IconButton 
                                size="small"
                                sx={{ color: '#95A5A6' }}
                                title="View Attachments"
                              >
                                <AttachFileIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            </Paper>
          )}
        </Box>

      {/* Add/Edit Scope Item Dialog */}
      <Dialog 
        open={addDialogOpen || !!editingItem} 
        onClose={() => {
          setAddDialogOpen(false);
          setEditingItem(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Edit Scope Item' : 'Add New Scope Item'}
        </DialogTitle>
        <DialogContent>
          <EnhancedScopeItemForm
            item={editingItem}
            categories={scopeCategories}
            onSubmit={editingItem ? handleEditScopeItem : handleAddScopeItem}
            onCancel={() => {
              setAddDialogOpen(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <ScopeImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImportItems}
        categories={scopeCategories}
      />

      {/* Connection Management Dialog */}
      <ConnectionManagementDialog
        open={connectionDialogOpen}
        onClose={() => {
          setConnectionDialogOpen(false);
          setSelectedItemForConnection(null);
        }}
        scopeItem={selectedItemForConnection}
        shopDrawings={shopDrawings}
        materialSpecs={materialSpecs}
        onConnectionsUpdated={handleConnectionsUpdated}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      </Box>
    </PageWrapper>
  );
});

// Set display name for debugging
EnhancedProjectScope.displayName = 'EnhancedProjectScope';

export default EnhancedProjectScope;