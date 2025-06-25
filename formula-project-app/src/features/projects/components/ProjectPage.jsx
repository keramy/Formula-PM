import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Alert,
  Paper
} from '@mui/material';
// Icons are now handled by the Breadcrumbs component
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '../../../context/NavigationContext';
import Breadcrumbs from '../../../components/navigation/Breadcrumbs';
import ProjectOverview from './ProjectOverview';
import EnhancedProjectScope from './EnhancedProjectScope';
import ProjectShopDrawings from './ProjectShopDrawings';
import ProjectSpecifications from './ProjectSpecifications';
import ComplianceDocumentation from './ComplianceDocumentation';
import EnhancedGanttChart from '../../../components/charts/EnhancedGanttChart';
import ProjectActivityFeed from './ProjectActivityFeed';
import ReportsList from '../../reports/components/ReportsList';
import SimpleReportEditor from '../../reports/components/SimpleReportEditor';

const ProjectPage = ({ 
  projectId, 
  projects = [], 
  tasks = [], 
  teamMembers = [],
  onEditProject,
  onUpdateTask,
  onNavigateToProject
}) => {
  const { user, canEditProject } = useAuth();
  const { 
    currentSection, 
    navigateToProjectSection, 
    exitProjectContext,
    getProjectSections,
    navigateBack,
    canNavigateBack,
    navigationStack
  } = useNavigation();
  
  const [activeTab, setActiveTab] = useState(0);
  const [editingReportId, setEditingReportId] = useState(null);
  
  // Find the current project
  const project = projects.find(p => p.id === projectId);
  
  // Get project-specific data
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
  const taskProgress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

  // Comprehensive demo data for millwork workflow demonstration
  // This includes proper linking between scope items, shop drawings, and material specifications
  const mockShopDrawings = [
    {
      id: 'SD001',
      projectId: projectId,
      fileName: 'Kitchen_Upper_Cabinets_Rev_C.pdf',
      drawingType: 'Kitchen Upper Cabinets',
      room: 'Kitchen',
      version: 'Rev C',
      status: 'approved',
      uploadDate: '2024-06-10',
      uploadedBy: 'John Smith',
      fileSize: '2.4 MB',
      scopeItemIds: ['SCOPE001'] // Linked to kitchen cabinet scope item
    },
    {
      id: 'SD002',
      projectId: projectId,
      fileName: 'Kitchen_Base_Cabinets_Rev_A.pdf',
      drawingType: 'Kitchen Base Cabinets',
      room: 'Kitchen',
      version: 'Rev A',
      status: 'pending',
      uploadDate: '2024-06-12',
      uploadedBy: 'Sarah Johnson',
      fileSize: '1.8 MB',
      scopeItemIds: ['SCOPE002'] // Linked to base cabinet scope item
    },
    {
      id: 'SD003',
      projectId: projectId,
      fileName: 'Reception_Desk_Custom_Rev_B.pdf',
      drawingType: 'Reception Desk - Custom',
      room: 'Reception',
      version: 'Rev B',
      status: 'approved',
      uploadDate: '2024-06-08',
      uploadedBy: 'Mike Wilson',
      fileSize: '3.1 MB',
      scopeItemIds: ['SCOPE003'] // Linked to reception desk scope item
    },
    {
      id: 'SD004',
      projectId: projectId,
      fileName: 'Crown_Molding_Details_Rev_A.pdf',
      drawingType: 'Crown Molding',
      room: 'Multiple',
      version: 'Rev A',
      status: 'rejected',
      uploadDate: '2024-06-15',
      uploadedBy: 'Lisa Chen',
      fileSize: '1.2 MB',
      scopeItemIds: ['SCOPE004'], // Linked to crown molding scope item
      rejectionReason: 'Dimensions need revision for ceiling height clearance'
    },
    {
      id: 'SD005',
      projectId: projectId,
      fileName: 'Countertop_Template_Kitchen.pdf',
      drawingType: 'Countertop Template',
      room: 'Kitchen',
      version: 'Rev A',
      status: 'pending',
      uploadDate: '2024-06-14',
      uploadedBy: 'David Rodriguez',
      fileSize: '0.8 MB',
      scopeItemIds: ['SCOPE005'] // Linked to countertop scope item
    }
  ];

  const mockMaterialSpecs = [
    {
      id: 'SPEC001',
      projectId: projectId,
      description: 'Upper Cabinet - 30" Wide x 42" High',
      category: 'Kitchen Cabinets',
      material: 'Maple Hardwood',
      finish: 'Natural Stain with Clear Coat',
      status: 'approved',
      itemId: 'KC-UC-30',
      unitCost: '$450.00',
      totalCost: '$1,800.00',
      quantity: '4',
      unit: 'EA',
      supplier: 'Premium Wood Works',
      partNumber: 'PWW-UC30-42-MAP',
      leadTime: '3 weeks',
      scopeItemIds: ['SCOPE001'], // Linked to upper cabinet scope item
      linkedDrawings: ['SD001']
    },
    {
      id: 'SPEC002',
      projectId: projectId,
      description: 'Base Cabinet - 36" Wide with Soft Close',
      category: 'Kitchen Cabinets',
      material: 'Maple Hardwood',
      finish: 'Natural Stain with Clear Coat',
      status: 'pending',
      itemId: 'KC-BC-36',
      unitCost: '$380.00',
      totalCost: '$2,280.00',
      quantity: '6',
      unit: 'EA',
      supplier: 'Premium Wood Works',
      partNumber: 'PWW-BC36-MAP-SC',
      leadTime: '3 weeks',
      scopeItemIds: ['SCOPE002'], // Linked to base cabinet scope item
      linkedDrawings: ['SD002']
    },
    {
      id: 'SPEC003',
      projectId: projectId,
      description: 'Reception Desk - Custom White Oak',
      category: 'Reception Furniture',
      material: 'White Oak Veneer',
      finish: 'Clear Lacquer with Satin Sheen',
      status: 'approved',
      itemId: 'RD-CUSTOM-01',
      unitCost: '$2,800.00',
      totalCost: '$2,800.00',
      quantity: '1',
      unit: 'EA',
      supplier: 'Executive Millwork Ltd',
      partNumber: 'EML-RD-WO-001',
      leadTime: '5 weeks',
      scopeItemIds: ['SCOPE003'], // Linked to reception desk scope item
      linkedDrawings: ['SD003']
    },
    {
      id: 'SPEC004',
      projectId: projectId,
      description: 'Crown Molding - 4.5" Profile',
      category: 'Millwork & Trim',
      material: 'MDF with Primed Finish',
      finish: 'Factory Primed, Paint Grade',
      status: 'pending',
      itemId: 'CM-4.5-MDF',
      unitCost: '$12.50',
      totalCost: '$500.00',
      quantity: '40',
      unit: 'LF',
      supplier: 'Millwork Supply Co',
      partNumber: 'MSC-CM-45-MDF-P',
      leadTime: '2 weeks',
      scopeItemIds: ['SCOPE004'], // Linked to crown molding scope item
      linkedDrawings: ['SD004']
    },
    {
      id: 'SPEC005',
      projectId: projectId,
      description: 'Quartz Countertop - Calacatta Marble Look',
      category: 'Countertops',
      material: 'Engineered Quartz',
      finish: 'Polished Edge, Undermount Sink Cutout',
      status: 'approved',
      itemId: 'CT-QUARTZ-CAL',
      unitCost: '$85.00',
      totalCost: '$2,125.00',
      quantity: '25',
      unit: 'SF',
      supplier: 'Stone Craft Industries',
      partNumber: 'SCI-QTZ-CAL-3CM',
      leadTime: '4 weeks',
      scopeItemIds: ['SCOPE005'], // Linked to countertop scope item
      linkedDrawings: ['SD005']
    },
    {
      id: 'SPEC006',
      projectId: projectId,
      description: 'Cabinet Hardware - Soft Close Hinges',
      category: 'Hardware',
      material: 'Stainless Steel',
      finish: 'Brushed Nickel',
      status: 'approved',
      itemId: 'HW-HINGE-SC',
      unitCost: '$8.50',
      totalCost: '$102.00',
      quantity: '12',
      unit: 'EA',
      supplier: 'Hardware Solutions Inc',
      partNumber: 'HSI-SC-HINGE-BN',
      leadTime: '1 week',
      scopeItemIds: ['SCOPE001', 'SCOPE002'], // Linked to both cabinet scope items
      notes: 'Required for both upper and base cabinets'
    }
  ];

  // Mock scope items for millwork workflow demonstration
  // These demonstrate various dependency states to showcase the validation system
  const mockScopeItems = [
    {
      id: 'SCOPE001',
      projectId: projectId,
      description: 'Kitchen Upper Cabinets Installation',
      category: 'Millwork & Carpentry',
      quantity: 4,
      unit: 'EA',
      unitPrice: 450,
      totalPrice: 1800,
      progress: 85,
      status: 'in-progress',
      shopDrawingRequired: true,
      materialSpecRequired: true,
      notes: 'Premium maple finish with soft-close hardware',
      room: 'Kitchen',
      phase: 'Production',
      priority: 'high',
      assignedTo: 'John Smith',
      startDate: '2024-06-01',
      endDate: '2024-06-20',
      dependencies: [],
      connectedDrawings: ['SD001'], // Has approved shop drawing
      connectedMaterials: ['SPEC001', 'SPEC006'] // Has approved material specs
    },
    {
      id: 'SCOPE002',
      projectId: projectId,
      description: 'Kitchen Base Cabinets Installation',
      category: 'Millwork & Carpentry',
      quantity: 6,
      unit: 'EA',
      unitPrice: 380,
      totalPrice: 2280,
      progress: 30,
      status: 'in-progress',
      shopDrawingRequired: true,
      materialSpecRequired: true,
      notes: 'Includes soft-close drawers and doors',
      room: 'Kitchen',
      phase: 'Planning',
      priority: 'high',
      assignedTo: 'Sarah Johnson',
      startDate: '2024-06-15',
      endDate: '2024-07-05',
      dependencies: ['SCOPE001'],
      connectedDrawings: ['SD002'], // Has pending shop drawing - BLOCKER
      connectedMaterials: ['SPEC002', 'SPEC006'] // Has pending material specs - BLOCKER
    },
    {
      id: 'SCOPE003',
      projectId: projectId,
      description: 'Reception Desk - Custom Build',
      category: 'Custom Millwork',
      quantity: 1,
      unit: 'EA',
      unitPrice: 2800,
      totalPrice: 2800,
      progress: 100,
      status: 'completed',
      shopDrawingRequired: true,
      materialSpecRequired: true,
      notes: 'Executive-level custom reception desk with cable management',
      room: 'Reception',
      phase: 'Completed',
      priority: 'medium',
      assignedTo: 'Mike Wilson',
      startDate: '2024-05-20',
      endDate: '2024-06-10',
      dependencies: [],
      connectedDrawings: ['SD003'], // Has approved shop drawing
      connectedMaterials: ['SPEC003'] // Has approved material specs
    },
    {
      id: 'SCOPE004',
      projectId: projectId,
      description: 'Crown Molding Installation',
      category: 'Millwork & Trim',
      quantity: 40,
      unit: 'LF',
      unitPrice: 12.50,
      totalPrice: 500,
      progress: 0,
      status: 'pending',
      shopDrawingRequired: true,
      materialSpecRequired: true,
      notes: 'Requires precise measurements for ceiling height variations',
      room: 'Multiple Rooms',
      phase: 'On Hold',
      priority: 'low',
      assignedTo: 'Lisa Chen',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
      dependencies: ['SCOPE001', 'SCOPE002'],
      connectedDrawings: ['SD004'], // Has rejected shop drawing - BLOCKER
      connectedMaterials: ['SPEC004'] // Has pending material specs - BLOCKER
    },
    {
      id: 'SCOPE005',
      projectId: projectId,
      description: 'Quartz Countertop Installation',
      category: 'Countertops',
      quantity: 25,
      unit: 'SF',
      unitPrice: 85,
      totalPrice: 2125,
      progress: 60,
      status: 'in-progress',
      shopDrawingRequired: true,
      materialSpecRequired: true,
      notes: 'Template required for precise sink and appliance cutouts',
      room: 'Kitchen',
      phase: 'Production',
      priority: 'high',
      assignedTo: 'David Rodriguez',
      startDate: '2024-06-10',
      endDate: '2024-06-25',
      dependencies: ['SCOPE002'],
      connectedDrawings: ['SD005'], // Has pending shop drawing - BLOCKER
      connectedMaterials: ['SPEC005'] // Has approved material specs
    },
    {
      id: 'SCOPE006',
      projectId: projectId,
      description: 'Cabinet Door Adjustment & Hardware',
      category: 'Millwork Finishing',
      quantity: 1,
      unit: 'LOT',
      unitPrice: 350,
      totalPrice: 350,
      progress: 10,
      status: 'pending',
      shopDrawingRequired: false, // No shop drawing required
      materialSpecRequired: true,
      notes: 'Final adjustments and hardware installation',
      room: 'Kitchen',
      phase: 'Finishing',
      priority: 'medium',
      assignedTo: 'John Smith',
      startDate: '2024-06-25',
      endDate: '2024-06-30',
      dependencies: ['SCOPE001', 'SCOPE002'],
      connectedDrawings: [], // No shop drawing needed
      connectedMaterials: ['SPEC006'] // Has approved material specs - READY FOR PRODUCTION
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

  // Handle navigation - now project-based instead of tab-based
  const handleBack = () => {
    if (onNavigateToProject && projects.length > 0) {
      const currentIndex = projects.findIndex(p => p.id === projectId);
      if (currentIndex > 0) {
        const previousProject = projects[currentIndex - 1];
        onNavigateToProject(previousProject.id);
        return;
      }
    }
    // Fallback to navigation context or exit to projects
    if (canNavigateBack() && navigationStack.length > 0) {
      navigateBack();
    } else {
      exitProjectContext();
    }
  };

  const handleNext = () => {
    if (onNavigateToProject && projects.length > 0) {
      const currentIndex = projects.findIndex(p => p.id === projectId);
      if (currentIndex < projects.length - 1) {
        const nextProject = projects[currentIndex + 1];
        onNavigateToProject(nextProject.id);
      }
    }
  };

  const canGoNext = () => {
    if (!projects.length) return false;
    const currentIndex = projects.findIndex(p => p.id === projectId);
    return currentIndex < projects.length - 1;
  };

  const canGoBack = () => {
    if (!projects.length) return false;
    const currentIndex = projects.findIndex(p => p.id === projectId);
    return currentIndex > 0;
  };

  const handleEditProject = () => {
    if (onEditProject && canEditProject(projectId)) {
      onEditProject(project);
    }
  };

  const handleSettings = () => {
    // TODO: Open project settings dialog
    console.log('Project settings for:', project.name);
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


  // Create static breadcrumb items for reliable navigation
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
            initialScopeItems={mockScopeItems}
          />
        );
      case 2: // Timeline & Gantt
        return (
          <EnhancedGanttChart
            projects={[project]}
            tasks={projectTasks}
            teamMembers={teamMembers}
            scopeItems={mockScopeItems} // Now includes comprehensive millwork scope items
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
      case 6: // Activity Feed
        return (
          <ProjectActivityFeed
            project={project}
            projectId={projectId}
            tasks={projectTasks}
            teamMembers={teamMembers}
          />
        );
      case 7: // Reports
        if (editingReportId) {
          return (
            <SimpleReportEditor
              reportId={editingReportId}
              projectId={projectId}
              onBack={() => setEditingReportId(null)}
            />
          );
        }
        return (
          <ReportsList
            projectId={projectId}
            onEditReport={(reportId) => setEditingReportId(reportId)}
          />
        );
      default:
        return <ProjectOverview project={project} tasks={projectTasks} teamMembers={teamMembers} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Project Tabs */}
      <Box sx={{ px: 3, pt: 3 }}>
        <Paper elevation={1} sx={{ borderRadius: '8px 8px 0 0', border: '1px solid #e0e0e0' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': {
                minHeight: 56,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                px: 2
              }
            }}
          >
            {sections.map((section, index) => (
              <Tab
                key={section.id}
                icon={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '1.1rem' }}>{section.icon}</span>
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
      <Box sx={{ px: 3, pt: 0, pb: 3 }}>
        <Paper elevation={1} sx={{ mt: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRadius: '0 0 8px 8px' }}>
          <Box sx={{ p: 3 }}>
            {renderTabContent()}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProjectPage;