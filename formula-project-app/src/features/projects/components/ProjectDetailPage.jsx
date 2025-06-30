import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  MdArrowBack as BackIcon,
  MdEdit as EditIcon,
  MdDesignServices as DrawingIcon,
  MdArchive as SpecIcon,
  MdCheck as TaskIcon,
  MdDescription as DocumentIcon,
  MdTimeline as TimelineIcon,
  MdAttachMoney as BudgetIcon,
  MdGroup as TeamIcon,
  MdCalendarToday as CalendarIcon,
  MdLink as LinkIcon,
  MdVisibility as ViewIcon,
  MdAdd as AddIcon,
  MdKeyboardArrowUp as ProgressIcon
} from 'react-icons/md';
import UnifiedHeader from '../../../components/ui/UnifiedHeader';
import ComplianceDocumentation from './ComplianceDocumentation';
import { useShopDrawings } from '../../shop-drawings/hooks/useShopDrawings';

const ProjectDetailPage = ({
  project,
  tasks = [],
  teamMembers = [],
  onBack,
  onEdit
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  
  // Get shop drawings for this project
  const { drawings: projectDrawings } = useShopDrawings(project?.id);
  
  // Mock specifications for this project
  const projectSpecifications = [
    {
      id: 'SPEC001',
      itemId: 'SPEC001',
      description: 'Upper Cabinet - 30" Wide',
      category: 'Kitchen Cabinets',
      totalCost: '$1,800.00',
      status: 'approved',
      linkedDrawings: ['SD001']
    },
    {
      id: 'SPEC002',
      itemId: 'SPEC002',
      description: 'Base Cabinet with Drawers',
      category: 'Kitchen Cabinets',
      totalCost: '$3,900.00',
      status: 'approved',
      linkedDrawings: ['SD001']
    }
  ];

  // Filter tasks for this project
  const projectTasks = tasks.filter(task => task.projectId === project?.id);

  if (!project) {
    return (
      <Alert severity="error">
        Project not found
      </Alert>
    );
  }

  // Calculate project statistics
  const totalSpecCost = projectSpecifications.reduce((sum, spec) => 
    sum + parseFloat(spec.totalCost.replace(/[$,]/g, '') || 0), 0
  );

  const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
  const taskProgress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

  const approvedDrawings = projectDrawings.filter(drawing => drawing.status === 'approved').length;
  const drawingProgress = projectDrawings.length > 0 ? (approvedDrawings / projectDrawings.length) * 100 : 0;

  const getStatusPalette = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'planning': return '#FF9800';
      case 'completed': return '#2196F3';
      case 'on-hold': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Project Info Card */}
      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Project Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip 
                label={project.status || 'Active'}
                sx={{ 
                  backgroundColor: getStatusPalette(project.status),
                  color: 'white',
                  fontWeight: 600,
                  mt: 0.5
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Project Type
              </Typography>
              <Typography variant="body1">
                {project.type || 'Millwork'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Start Date
              </Typography>
              <Typography variant="body1">
                {project.startDate || 'Not set'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                End Date
              </Typography>
              <Typography variant="body1">
                {project.endDate || 'Not set'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">
                {project.description || 'No description provided'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Progress Card */}
      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Project Progress
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tasks Completed</Typography>
                <Typography variant="body2">{completedTasks}/{projectTasks.length}</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={taskProgress}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {taskProgress.toFixed(0)}% Complete
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Drawings Approved</Typography>
                <Typography variant="body2">{approvedDrawings}/{projectDrawings.length}</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={drawingProgress}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {drawingProgress.toFixed(0)}% Approved
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Specification Cost
              </Typography>
              <Typography variant="h5" color="primary">
                ${totalSpecCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <DrawingIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h6">{projectDrawings.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Shop Drawings
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <SpecIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
              <Typography variant="h6">{projectSpecifications.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Specifications
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <TaskIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
              <Typography variant="h6">{projectTasks.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <TeamIcon sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
              <Typography variant="h6">
                {teamMembers.filter(member => 
                  projectTasks.some(task => task.assignedTo === member.id)
                ).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team Members
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderShopDrawingsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Shop Drawings ({projectDrawings.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // Navigate to shop drawings page with this project pre-selected
            console.log('Navigate to shop drawings with project:', project.id);
          }}
        >
          Add Drawing
        </Button>
      </Box>

      {projectDrawings.length > 0 ? (
        <List>
          {projectDrawings.map((drawing) => (
            <ListItem key={drawing.id} divider>
              <ListItemIcon>
                <DrawingIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={drawing.fileName}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      {drawing.drawingType} • {drawing.room} • {drawing.version}
                    </Typography>
                    <Chip 
                      label={drawing.status}
                      size="small"
                      sx={{ 
                        backgroundColor: 
                          drawing.status === 'approved' ? '#4CAF50' :
                          drawing.status === 'pending' ? '#FF9800' : '#F44336',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 20,
                        mt: 0.5
                      }}
                    />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="View Drawing">
                  <IconButton size="small">
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Link to Specifications">
                  <IconButton size="small">
                    <LinkIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Alert severity="info">
          No shop drawings uploaded for this project yet.
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ ml: 2 }}
            startIcon={<AddIcon />}
          >
            Upload First Drawing
          </Button>
        </Alert>
      )}
    </Box>
  );

  const renderSpecificationsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Material Specifications ({projectSpecifications.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // Navigate to specifications page with this project pre-selected
            console.log('Navigate to specifications with project:', project.id);
          }}
        >
          Add Specification
        </Button>
      </Box>

      {projectSpecifications.length > 0 ? (
        <List>
          {projectSpecifications.map((spec) => (
            <ListItem key={spec.id} divider>
              <ListItemIcon>
                <SpecIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={spec.description}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      {spec.itemId} • {spec.category}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip 
                        label={spec.status}
                        size="small"
                        sx={{ 
                          backgroundColor: 
                            spec.status === 'approved' ? '#4CAF50' : '#FF9800',
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {spec.totalCost}
                      </Typography>
                      {spec.linkedDrawings.length > 0 && (
                        <Chip 
                          icon={<LinkIcon />}
                          label={`${spec.linkedDrawings.length} linked`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="View Specification">
                  <IconButton size="small">
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Specification">
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Alert severity="info">
          No material specifications added for this project yet.
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ ml: 2 }}
            startIcon={<AddIcon />}
          >
            Add First Specification
          </Button>
        </Alert>
      )}

      <Card sx={{ mt: 3 }} elevation={1}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Cost Summary
          </Typography>
          <Typography variant="h5" color="primary">
            ${totalSpecCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total material specifications cost
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  const renderTasksTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Project Tasks ({projectTasks.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Task
        </Button>
      </Box>

      {projectTasks.length > 0 ? (
        <List>
          {projectTasks.slice(0, 10).map((task) => (
            <ListItem key={task.id} divider>
              <ListItemIcon>
                <TaskIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={task.name}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      Due: {task.dueDate || 'Not set'} • Assigned to: {task.assignedToName || 'Unassigned'}
                    </Typography>
                    <Chip 
                      label={task.status}
                      size="small"
                      sx={{ 
                        backgroundColor: 
                          task.status === 'completed' ? '#4CAF50' :
                          task.status === 'in-progress' ? '#FF9800' : '#2196F3',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 20,
                        mt: 0.5
                      }}
                    />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="View Task">
                  <IconButton size="small">
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Alert severity="info">
          No tasks created for this project yet.
        </Alert>
      )}
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <UnifiedHeader
        title={project.name}
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: project.name }
        ]}
        onBack={onBack}
        teamMembers={teamMembers.slice(0, 3)}
        subtitle={`${project.type || 'Millwork'} Project • ${project.status || 'Active'}`}
      />

      <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderPalette: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<ProgressIcon />} 
              label="Overview" 
              iconPosition="start"
            />
            <Tab 
              icon={
                <Badge badgeContent={projectDrawings.length} color="primary">
                  <DrawingIcon />
                </Badge>
              } 
              label="Shop Drawings" 
              iconPosition="start"
            />
            <Tab 
              icon={
                <Badge badgeContent={projectSpecifications.length} color="primary">
                  <SpecIcon />
                </Badge>
              } 
              label="Specifications" 
              iconPosition="start"
            />
            <Tab 
              icon={
                <Badge badgeContent={projectTasks.length} color="primary">
                  <TaskIcon />
                </Badge>
              } 
              label="Tasks" 
              iconPosition="start"
            />
            <Tab 
              icon={<DocumentIcon />} 
              label="Compliance" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {currentTab === 0 && renderOverviewTab()}
          {currentTab === 1 && renderShopDrawingsTab()}
          {currentTab === 2 && renderSpecificationsTab()}
          {currentTab === 3 && renderTasksTab()}
          {currentTab === 4 && (
            <ComplianceDocumentation 
              project={project}
              onUpdateCompliance={(updates) => {
                console.log('Compliance updated:', updates);
              }}
            />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default ProjectDetailPage;