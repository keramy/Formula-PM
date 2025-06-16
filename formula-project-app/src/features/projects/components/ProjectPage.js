import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Alert,
  Paper,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Architecture as DrawingIcon,
  Inventory as SpecIcon,
  Assignment as TaskIcon,
  Description as DocumentIcon,
  Timeline as TimelineIcon,
  AttachMoney as BudgetIcon,
  TrendingUp as ProgressIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '../../../context/NavigationContext';
import Breadcrumbs from '../../../components/navigation/Breadcrumbs';
import ProjectOverview from './ProjectOverview';
import EnhancedProjectScope from './EnhancedProjectScope';
import ProjectShopDrawings from './ProjectShopDrawings';
import ProjectSpecifications from './ProjectSpecifications';
import ComplianceDocumentation from './ComplianceDocumentation';
import EnhancedGanttChart from '../../../components/charts/EnhancedGanttChart';

const ProjectPage = ({ 
  projectId, 
  projects = [], 
  tasks = [], 
  teamMembers = [],
  onEditProject,
  onUpdateTask
}) => {
  const { user, canEditProject } = useAuth();
  const { 
    currentSection, 
    navigateToProjectSection, 
    exitProjectContext,
    getProjectSections,
    navigateBack,
    canNavigateBack 
  } = useNavigation();
  
  const [activeTab, setActiveTab] = useState(0);
  
  // Find the current project
  const project = projects.find(p => p.id === projectId);
  
  // Get project-specific data
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
  const taskProgress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

  // Mock data for shop drawings and material specifications (in production, these would come from props or API)
  const mockShopDrawings = [
    {
      id: 'SD001',
      projectId: projectId,
      fileName: 'Kitchen_Cabinets_Rev_C.pdf',
      drawingType: 'Kitchen Cabinets',
      room: 'Kitchen',
      version: 'Rev C',
      status: 'approved',
      uploadDate: '2024-06-10',
      uploadedBy: 'John Smith',
      fileSize: '2.4 MB'
    },
    {
      id: 'SD002',
      projectId: projectId,
      fileName: 'Reception_Desk_Rev_B.pdf',
      drawingType: 'Reception Desk',
      room: 'Reception',
      version: 'Rev B',
      status: 'pending',
      uploadDate: '2024-06-12',
      uploadedBy: 'Sarah Johnson',
      fileSize: '1.8 MB'
    }
  ];

  const mockMaterialSpecs = [
    {
      id: 'SPEC001',
      projectId: projectId,
      description: 'Upper Cabinet - 30" Wide',
      category: 'Kitchen Cabinets',
      material: 'Maple Hardwood',
      finish: 'Natural Stain',
      status: 'approved',
      itemId: 'SPEC001',
      unitCost: '$450.00',
      totalCost: '$1,800.00'
    },
    {
      id: 'SPEC002',
      projectId: projectId,
      description: 'Reception Desk - Custom',
      category: 'Reception Furniture',
      material: 'White Oak Veneer',
      finish: 'Clear Lacquer',
      status: 'pending',
      itemId: 'SPEC002',
      unitCost: '$2,800.00',
      totalCost: '$2,800.00'
    }
  ];

  // Available project sections
  const sections = getProjectSections();
  
  // Set active tab based on current section
  useEffect(() => {
    if (currentSection) {
      const sectionIndex = sections.findIndex(s => s.id === currentSection);
      if (sectionIndex !== -1) {
        setActiveTab(sectionIndex);
      }
    }
  }, [currentSection, sections]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const section = sections[newValue];
    if (section) {
      navigateToProjectSection(section.id);
    }
  };

  // Handle navigation
  const handleBack = () => {
    if (canNavigateBack()) {
      navigateBack();
    } else {
      exitProjectContext();
    }
  };

  const handleEditProject = () => {
    if (onEditProject && canEditProject(projectId)) {
      onEditProject(project);
    }
  };

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Project not found or you don't have access to this project.
        </Alert>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'planning': return '#FF9800';
      case 'completed': return '#2196F3';
      case 'on-hold': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' },
    { label: project.name }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Overview
        return (
          <ProjectOverview
            project={project}
            tasks={projectTasks}
            teamMembers={teamMembers}
            taskProgress={taskProgress}
          />
        );
      case 1: // Scope Management
        return (
          <EnhancedProjectScope
            project={project}
            tasks={projectTasks}
            teamMembers={teamMembers}
            shopDrawings={mockShopDrawings}
            materialSpecs={mockMaterialSpecs}
          />
        );
      case 2: // Timeline & Gantt
        return (
          <EnhancedGanttChart
            projects={[project]}
            tasks={projectTasks}
            teamMembers={teamMembers}
            scopeItems={[]} // This would come from project scope data
            shopDrawings={mockShopDrawings}
            materialSpecs={mockMaterialSpecs}
            selectedProjectId={projectId}
            onTaskUpdate={onUpdateTask}
            onItemClick={(item) => {
              console.log('Timeline item clicked:', item);
              // Handle navigation based on item type
            }}
            height={600}
            showToolbar={true}
            dataType="scope-groups"
          />
        );
      case 3: // Shop Drawings
        return (
          <ProjectShopDrawings
            project={project}
            projectId={projectId}
          />
        );
      case 4: // Material Specifications
        return (
          <ProjectSpecifications
            project={project}
            projectId={projectId}
          />
        );
      case 5: // Compliance
        return (
          <ComplianceDocumentation
            project={project}
            onUpdateCompliance={(updates) => {
              console.log('Compliance updated:', updates);
            }}
          />
        );
      default:
        return <ProjectOverview project={project} tasks={projectTasks} teamMembers={teamMembers} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Breadcrumbs
          items={breadcrumbItems}
          onNavigate={(href) => {
            if (href === '/projects') {
              exitProjectContext();
            }
          }}
          showBackNext={true}
          onBack={handleBack}
          canGoBack={canNavigateBack()}
          currentSection={currentSection}
        />
      </Box>

      {/* Project Header */}
      <Box sx={{ p: 3, pt: 1 }}>
        <Card elevation={2}>
          <CardContent sx={{ pb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {project.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={project.status || 'Active'}
                    sx={{
                      backgroundColor: getStatusColor(project.status),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {project.type || 'Millwork Project'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.description || 'No description provided'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {canEditProject(projectId) && (
                  <IconButton
                    onClick={handleEditProject}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 2
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {projectTasks.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {taskProgress.toFixed(0)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completion
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={taskProgress}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {project.budget || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Budget
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due Date
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Project Tabs */}
      <Box sx={{ px: 3 }}>
        <Paper elevation={1}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500
              }
            }}
          >
            {sections.map((section, index) => (
              <Tab
                key={section.id}
                icon={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
                  </Box>
                }
                label={section.label}
                iconPosition="start"
                sx={{
                  '& .MuiTab-iconWrapper': {
                    marginBottom: 0,
                    marginRight: 1
                  }
                }}
              />
            ))}
          </Tabs>
        </Paper>
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Paper elevation={1} sx={{ mt: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <Box sx={{ p: 3 }}>
            {renderTabContent()}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProjectPage;