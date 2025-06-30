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
  FaPlus as AddIcon,
  FaFileUpload as ImportIcon,
  FaEdit as EditIcon,
  FaTrash as DeleteIcon,
  FaPaperclip as AttachFileIcon,
  FaDownload as DownloadIcon,
  FaChevronDown as ExpandMoreIcon,
  FaClock as CalendarIcon,
  FaExclamationTriangle as WarningIcon,
  FaCheckCircle as CheckCircleIcon,
  FaClock as TimeIcon,
  FaChartLine as ProgressIcon,
  FaLink as LinkIcon,
  FaTachometerAlt as DashboardIcon
} from 'react-icons/fa';
import EnhancedScopeItemForm from './EnhancedScopeItemForm';
import ScopeImportDialog from './ScopeImportDialog';
import ConnectionManagementDialog from './ConnectionManagementDialog';
import ProductionBlockedDialog from './ProductionBlockedDialog';
import WorkflowDashboard from './WorkflowDashboard';
import apiService from '../../../services/api/apiService';
import PageWrapper from '../../../components/layout/PageWrapper';
import connectionService from '../../../services/connectionService';

const ProjectScope = React.memo(({ project, onClose, shopDrawings = [], materialSpecs = [], initialScopeItems = [] }) => {
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
  
  // Production blocked dialog state
  const [productionBlockedDialogOpen, setProductionBlockedDialogOpen] = useState(false);
  const [selectedBlockedItem, setSelectedBlockedItem] = useState(null);
  const [selectedBlockedItemStatus, setSelectedBlockedItemStatus] = useState(null);

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
  
  // Handler for production blocked chip click
  const handleProductionBlockedClick = useCallback((item, connectionStatus) => {
    setSelectedBlockedItem(item);
    setSelectedBlockedItemStatus(connectionStatus);
    setProductionBlockedDialogOpen(true);
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
  }, [project.id, initialScopeItems]);

  const loadScopeItems = async () => {
    try {
      setLoading(true);
      
      // Use initial scope items if provided (for demo purposes), otherwise load from API
      if (initialScopeItems && initialScopeItems.length > 0) {
        setScopeItems(initialScopeItems);
        showNotification(`Loaded ${initialScopeItems.length} demo scope items for ${project.name}`);
      } else {
        const items = await apiService.getScopeItems(project.id);
        setScopeItems(items || []);
      }
    } catch (error) {
      console.error('Error loading scope items:', error);
      showNotification('Failed to load scope items', 'error');
      // Fallback to initial scope items if API fails
      if (initialScopeItems && initialScopeItems.length > 0) {
        setScopeItems(initialScopeItems);
        showNotification('Using demo data due to API error', 'warning');
      }
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
    <Box sx={{ 
      height: 'calc(100vh - 120px)', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Minimal Action Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        px: 1,
        py: 0.5,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
          Scope Management ({summaryStats.totalItems} items)
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={downloadExcelTemplate} title="Download Template">
            <DownloadIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setImportDialogOpen(true)} title="Import Excel">
            <ImportIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setAddDialogOpen(true)} title="Add Item">
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Simple Group Filter */}
      <Box sx={{ px: 1, py: 0.5, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              displayEmpty
              sx={{ height: 32 }}
            >
              <MenuItem value="all">All Items</MenuItem>
              {Object.entries(scopeGroups).map(([groupKey, group]) => (
                <MenuItem key={groupKey} value={groupKey}>
                  {group.icon} {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {Object.entries(groupStatistics).map(([groupKey, stats]) => (
            <Chip
              key={groupKey}
              label={`${stats.name}: ${stats.progress}%`}
              size="small"
              sx={{ fontSize: '0.7rem', height: 24 }}
              color={selectedGroup === groupKey ? 'primary' : 'default'}
            />
          ))}
        </Box>
      </Box>

      {/* Main Content Area - Full Page Table */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
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
          <TableContainer sx={{ 
            height: '100%',
            '& .MuiTableRow-root:hover': {
              backgroundColor: 'transparent'
            }
          }}>
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
                      <TableRow key={item.id}>
                        {/* Item Details */}
                        <TableCell sx={{ minWidth: 300 }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.description}
                              </Typography>
                              <Chip 
                                label={item.id} 
                                size="small"
                                sx={{ 
                                  backgroundColor: '#F5F5F5', 
                                  color: '#666666',
                                  fontFamily: 'monospace',
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                            </Box>
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
                            <LinearProgress
                              variant="determinate"
                              value={item.progress || 0}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: '#f0f0f0'
                              }}
                            />
                            <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 600 }}>
                              {item.progress || 0}%
                            </Typography>
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
                                    onClick={() => handleProductionBlockedClick(item, connectionStatus)}
                                    sx={{ cursor: 'pointer' }}
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

      {/* Production Blocked Dialog */}
      <ProductionBlockedDialog
        open={productionBlockedDialogOpen}
        onClose={() => {
          setProductionBlockedDialogOpen(false);
          setSelectedBlockedItem(null);
          setSelectedBlockedItemStatus(null);
        }}
        scopeItem={selectedBlockedItem}
        connectionStatus={selectedBlockedItemStatus}
        onManageConnections={handleManageConnections}
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
  );
});

// Set display name for debugging
ProjectScope.displayName = 'ProjectScope';

export default ProjectScope;