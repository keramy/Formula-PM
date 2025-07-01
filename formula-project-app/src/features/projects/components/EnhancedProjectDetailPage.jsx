/**
 * Enhanced Project Detail Page - Prompt 10 Implementation
 * Comprehensive tab system: Overview, Scope, Shop Drawings, Material Specs, Activity Feed, Reports
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
  Skeleton
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
  MdInventory
} from 'react-icons/md';
import CleanPageLayout from '../../../components/layout/CleanPageLayout';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { format, differenceInDays, parseISO, isValid } from 'date-fns';

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

// Scope Tab Component with 4 Categories
const ScopeTab = ({ project, tasks, teamMembers, clients }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [scopeItems, setScopeItems] = useState([]);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

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

  // Mock scope items data (will be replaced with real data from backend)
  const mockScopeItems = [
    {
      id: 'scope-1',
      itemCode: `${project.name?.substring(0, 3).toUpperCase() || 'PRJ'}-C001`,
      name: 'Concrete Foundation',
      description: 'Pour concrete foundation for main structure',
      category: 'construction',
      quantity: 100,
      unitPrice: 150,
      totalPrice: 15000,
      initialCost: 15000,
      actualCost: 16500,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 'scope-2',
      itemCode: `${project.name?.substring(0, 3).toUpperCase() || 'PRJ'}-M001`,
      name: 'Custom Reception Desk',
      description: 'Handcrafted reception desk with integrated storage',
      category: 'millwork',
      quantity: 1,
      unitPrice: 8500,
      totalPrice: 8500,
      initialCost: 8000,
      actualCost: 8500,
      createdAt: '2024-06-01T11:00:00Z'
    },
    {
      id: 'scope-3',
      itemCode: `${project.name?.substring(0, 3).toUpperCase() || 'PRJ'}-E001`,
      name: 'LED Lighting System',
      description: 'Energy-efficient LED lighting throughout office space',
      category: 'electrical',
      quantity: 25,
      unitPrice: 200,
      totalPrice: 5000,
      initialCost: 5000,
      actualCost: 4800,
      createdAt: '2024-06-01T12:00:00Z'
    }
  ];

  // Filter items by active category
  const filteredItems = mockScopeItems.filter(item => 
    item.category === categories[activeCategory].id
  );

  // Calculate budget statistics
  const getBudgetStats = (categoryId) => {
    const categoryItems = mockScopeItems.filter(item => item.category === categoryId);
    const totalBudget = categoryItems.reduce((sum, item) => sum + item.initialCost, 0);
    const actualSpent = categoryItems.reduce((sum, item) => sum + item.actualCost, 0);
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
                    <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Budget Deviation</TableCell>
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
                          <Typography variant="body2">
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            ₺{item.unitPrice.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ₺{item.totalPrice.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={`${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}%`}
                              size="small"
                              sx={{
                                backgroundColor: getDeviationColor(deviation) + '20',
                                color: getDeviationColor(deviation),
                                fontWeight: 600
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>
                              ₺{item.actualCost.toLocaleString()}
                            </Typography>
                          </Box>
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
  const { projects, tasks, teamMembers, clients, loading, error } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

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
            {index === 0 ? (
              <tab.component 
                project={project}
                tasks={tasks}
                teamMembers={teamMembers}
                clients={clients}
              />
            ) : (
              <tab.component />
            )}
          </TabPanel>
        ))}
      </Box>
    </CleanPageLayout>
  );
};

export default EnhancedProjectDetailPage;