import React, { Suspense, useState, useCallback, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  Box,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  MdAdd as Add,
  MdFilterList as FilterList,
  MdViewList as ViewList,
  MdViewModule as ViewModule,
  MdTimeline as Timeline,
  MdKeyboardArrowUp as ArrowUp,
  MdAssignment as Task,
  MdGroup as Group,
  MdCalendarToday as Calendar,
  MdMoreVert as MoreVert,
  MdCheck as Check,
  MdEdit as Edit,
  MdDelete as Delete
} from 'react-icons/md';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ProjectFormModal from '../components/forms/ProjectFormModal';
import DeleteConfirmationDialog from '../components/forms/DeleteConfirmationDialog';
import { useNotification } from '../context/NotificationContext';
import ApiService from '../services/api/apiService';
import { 
  ProjectsFilters,
  LoadingFallback,
  ListSkeleton
} from '../components/lazy';
import EnhancedProjectsTable from '../features/projects/components/EnhancedProjectsTable';
import UserProjectsGantt from '../features/projects/components/UserProjectsGantt';

const ProjectsPage = ({ 
  filteredProjects,
  projectsViewMode,
  projectsSearchTerm,
  setProjectsSearchTerm,
  showProjectsFilters,
  projectsFilters,
  activeFilters,
  onViewModeChange,
  onToggleFilters,
  onExport,
  onFiltersChange,
  onClearFilters,
  onEditProject,
  onDeleteProject,
  onViewProject,
  onManageScope,
  onUpdateTask,
  onAddProject
}) => {
  const { projects = [], tasks = [], teamMembers = [], clients = [] } = useData();
  
  console.log('🔍 ProjectsPage received data:', { 
    projects: projects?.length || 'undefined', 
    tasks: tasks?.length || 'undefined', 
    teamMembers: teamMembers?.length || 'undefined',
    clients: clients?.length || 'undefined'
  });
  
  const [activeTab, setActiveTab] = useState('projects');
  
  // CRUD Modal States
  const [projectFormModal, setProjectFormModal] = useState({
    open: false,
    project: null,
    loading: false,
    error: null
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    project: null,
    loading: false,
    error: null
  });
  
  const { showSuccess, showError } = useNotification();

  // CRUD Handlers
  const handleAddProject = useCallback(() => {
    setProjectFormModal({
      open: true,
      project: null,
      loading: false,
      error: null
    });
  }, []);

  const handleEditProject = useCallback((project) => {
    setProjectFormModal({
      open: true,
      project,
      loading: false,
      error: null
    });
  }, []);

  const handleDeleteProject = useCallback((project) => {
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    setDeleteConfirmation({
      open: true,
      project,
      loading: false,
      error: null,
      consequences: projectTasks.length > 0 ? [
        `Delete ${projectTasks.length} associated task${projectTasks.length === 1 ? '' : 's'}`,
        'Remove project from all reports and analytics',
        'Archive all project-related documents'
      ] : []
    });
  }, [tasks]);

  const handleProjectSubmit = useCallback(async (projectIdOrData, updateData = null) => {
    setProjectFormModal(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let result;
      const isEdit = updateData !== null;
      
      if (isEdit) {
        // Update existing project
        result = await ApiService.updateProject(projectIdOrData, updateData);
        showSuccess('Project Updated', `Project "${updateData.name}" has been updated successfully.`);
        if (onEditProject) onEditProject(projectIdOrData, result);
      } else {
        // Create new project
        result = await ApiService.createProject(projectIdOrData);
        showSuccess('Project Created', `Project "${projectIdOrData.name}" has been created successfully.`);
        if (onAddProject) onAddProject(result);
      }
      
      // Close modal
      setProjectFormModal({
        open: false,
        project: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Project submission error:', error);
      setProjectFormModal(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to save project. Please try again.'
      }));
      showError(
        isEdit ? 'Update Failed' : 'Creation Failed',
        error.message || 'An error occurred while saving the project.'
      );
    }
  }, [onAddProject, onEditProject, showSuccess, showError]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirmation.project) return;
    
    setDeleteConfirmation(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await ApiService.deleteProject(deleteConfirmation.project.id);
      showSuccess(
        'Project Deleted',
        `Project "${deleteConfirmation.project.name}" has been deleted successfully.`
      );
      
      if (onDeleteProject) {
        onDeleteProject(deleteConfirmation.project.id);
      }
      
      // Close modal
      setDeleteConfirmation({
        open: false,
        project: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Project deletion error:', error);
      setDeleteConfirmation(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to delete project. Please try again.'
      }));
      showError(
        'Deletion Failed',
        error.message || 'An error occurred while deleting the project.'
      );
    }
  }, [deleteConfirmation.project, onDeleteProject, showSuccess, showError]);

  // Enhanced action handlers for the new table
  const handleDuplicateProject = useCallback(async (project) => {
    try {
      const duplicatedProject = {
        ...project,
        id: undefined,
        name: `${project.name} (Copy)`,
        status: 'planning'
      };
      const result = await ApiService.createProject(duplicatedProject);
      showSuccess('Project Duplicated', `Project "${duplicatedProject.name}" has been created successfully.`);
      if (onAddProject) onAddProject(result);
    } catch (error) {
      showError('Duplication Failed', error.message || 'Failed to duplicate project.');
    }
  }, [onAddProject, showSuccess, showError]);

  const handleArchiveProject = useCallback(async (project) => {
    try {
      const newStatus = project.status === 'archived' ? 'active' : 'archived';
      await ApiService.updateProject(project.id, { status: newStatus });
      showSuccess(
        newStatus === 'archived' ? 'Project Archived' : 'Project Activated',
        `Project "${project.name}" has been ${newStatus === 'archived' ? 'archived' : 'activated'} successfully.`
      );
      if (onEditProject) onEditProject(project.id, { ...project, status: newStatus });
    } catch (error) {
      showError('Update Failed', error.message || 'Failed to update project status.');
    }
  }, [onEditProject, showSuccess, showError]);

  const handleAssignTeam = useCallback((project) => {
    // This would open a team assignment modal
    console.log('Assign team to project:', project);
    showSuccess('Feature Coming Soon', 'Team assignment feature will be available soon.');
  }, [showSuccess]);

  const handleViewTimeline = useCallback((project) => {
    setActiveTab('timeline');
    if (onViewProject) onViewProject(project);
  }, [onViewProject]);

  const handleExportProject = useCallback((project) => {
    // This would export individual project data
    console.log('Export project:', project);
    showSuccess('Feature Coming Soon', 'Project export feature will be available soon.');
  }, [showSuccess]);

  const handleSetPriority = useCallback((project) => {
    // This would open a priority setting modal
    console.log('Set priority for project:', project);
    showSuccess('Feature Coming Soon', 'Priority setting feature will be available soon.');
  }, [showSuccess]);

  const handleCloseProjectForm = useCallback(() => {
    setProjectFormModal({
      open: false,
      project: null,
      loading: false,
      error: null
    });
  }, []);

  const handleCloseDeleteConfirmation = useCallback(() => {
    setDeleteConfirmation({
      open: false,
      project: null,
      loading: false,
      error: null
    });
  }, []);

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const safeProjects = Array.isArray(projects) ? projects : [];
    const totalProjects = safeProjects.length;
    const activeProjects = safeProjects.filter(p => p.status === 'active' || p.status === 'in-progress').length;
    const completedProjects = safeProjects.filter(p => p.status === 'completed').length;
    const overdueProjects = safeProjects.filter(p => {
      const dueDate = new Date(p.endDate);
      const today = new Date();
      return p.status !== 'completed' && dueDate < today;
    }).length;

    const totalBudget = safeProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const averageProgress = safeProjects.length > 0 
      ? Math.round(safeProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / safeProjects.length)
      : 0;

    return {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      overdue: overdueProjects,
      totalBudget,
      averageProgress
    };
  }, [projects]);

  // Get recent projects (last 5)
  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 5);
  }, [projects]);

  // Get upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    const upcoming = projects
      .filter(p => p.status !== 'completed' && p.endDate)
      .map(p => ({
        ...p,
        daysUntilDeadline: Math.ceil((new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      }))
      .filter(p => p.daysUntilDeadline >= 0 && p.daysUntilDeadline <= 30)
      .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline)
      .slice(0, 5);
    
    return upcoming;
  }, [projects]);

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'active':
      case 'in-progress': return 'status-in-progress';
      case 'planning': return 'status-review';
      case 'on-hold': return 'status-todo';
      default: return 'status-todo';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProjectManager = (managerId) => {
    return teamMembers.find(member => member.id === managerId);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || client?.companyName || 'Unknown Client';
  };

  const headerActions = (
    <>
      <IconButton className="clean-button-secondary" onClick={onToggleFilters}>
        <FilterList />
      </IconButton>
      <Button className="clean-button-primary" startIcon={<Add />} onClick={handleAddProject}>
        New project
      </Button>
    </>
  );

  const tabs = (
    <>
      <CleanTab 
        label="Overview" 
        isActive={activeTab === 'overview'}
        onClick={() => setActiveTab('overview')}
        icon={<Timeline size={16} />}
      />
      <CleanTab 
        label="All Projects" 
        isActive={activeTab === 'projects'}
        onClick={() => setActiveTab('projects')}
        icon={<ViewList size={16} />}
        badge={projectStats.total}
      />
      <CleanTab 
        label="My Timeline" 
        isActive={activeTab === 'timeline'}
        onClick={() => setActiveTab('timeline')}
        icon={<Timeline size={16} />}
      />
    </>
  );

  const StatsCard = ({ title, value, subtitle, icon, color = '#E3AF64' }) => (
    <Card className="clean-card">
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7280',
                fontSize: '13px',
                fontWeight: 500,
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#0F1939',
                mb: 0.5
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '12px'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { 
              sx: { fontSize: 24, color: color }
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const ProjectCard = ({ project }) => {
    const manager = getProjectManager(project.managerId);
    const progressPalette = project.progress >= 75 ? '#10B981' : project.progress >= 50 ? '#E3AF64' : '#516AC8';
    
    const handleCardClick = (e) => {
      // Prevent card click when clicking on action buttons
      if (e.target.closest('.project-actions')) {
        return;
      }
      onViewProject && onViewProject(project);
    };

    const handleEditClick = (e) => {
      e.stopPropagation();
      handleEditProject(project);
    };

    const handleDeleteClick = (e) => {
      e.stopPropagation();
      handleDeleteProject(project);
    };
    
    return (
      <Card className="clean-card" sx={{ height: '100%', cursor: 'pointer' }} onClick={handleCardClick}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#0F1939',
                  mb: 0.5,
                  lineHeight: 1.3
                }}
              >
                {project.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6B7280', 
                  fontSize: '13px',
                  mb: 1
                }}
              >
                {getClientName(project.clientId)}
              </Typography>
            </Box>
            <Box className="project-actions" sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                sx={{ 
                  color: '#9CA3AF',
                  '&:hover': { color: '#E3AF64', bgcolor: '#FEF3E2' }
                }}
                onClick={handleEditClick}
                title="Edit Project"
              >
                <Edit size={16} />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  color: '#9CA3AF',
                  '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' }
                }}
                onClick={handleDeleteClick}
                title="Delete Project"
              >
                <Delete size={16} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Chip
                label={project.status?.replace('-', ' ') || 'planning'}
                className={`clean-chip ${getStatusChipClass(project.status)}`}
                size="small"
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                {project.progress || 0}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={project.progress || 0}
              className="clean-progress-bar"
              sx={{
                '& .MuiLinearProgress-bar': {
                  backgroundColor: progressPalette
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={14} style={{ color: "#9CA3AF" }} />
              <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                Due {new Date(project.endDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                color: '#0F1939',
                fontSize: '14px'
              }}
            >
              {formatCurrency(project.budget || 0)}
            </Typography>
          </Box>

          {manager && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: '10px',
                  fontWeight: 600,
                  bgcolor: '#E3AF64'
                }}
              >
                {manager.fullName?.charAt(0) || 'M'}
              </Avatar>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '12px'
                }}
              >
                {manager.fullName}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderOverviewContent = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Projects"
            value={projectStats.total}
            subtitle={`${projectStats.active} active`}
            icon={<Check />}
            color="#516AC8"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Completed"
            value={projectStats.completed}
            subtitle={`${Math.round((projectStats.completed / projectStats.total) * 100) || 0}% completion rate`}
            icon={<ArrowUp />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Budget"
            value={formatCurrency(projectStats.totalBudget)}
            subtitle="Across all projects"
            icon={<Check />}
            color="#E3AF64"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Overdue"
            value={projectStats.overdue}
            subtitle="Requires attention"
            icon={<Calendar />}
            color="#EF4444"
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={4}>
        {/* Recent Projects */}
        <Grid item xs={12} lg={8}>
          <Card className="clean-card">
            <Box className="clean-section-header">
              <Box className="clean-section-indicator"></Box>
              <Typography className="clean-section-title">
                Recent Projects
              </Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Grid container spacing={3} sx={{ p: 3 }}>
                {recentProjects.map((project) => (
                  <Grid item xs={12} sm={6} key={project.id}>
                    <ProjectCard project={project} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} lg={4}>
          <Card className="clean-card">
            <Box className="clean-section-header">
              <Box className="clean-section-indicator" sx={{ backgroundColor: '#EF4444' }}></Box>
              <Typography className="clean-section-title">
                Upcoming Deadlines
              </Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((project, index) => (
                  <Box
                    key={project.id}
                    sx={{
                      p: 2,
                      borderBottom: index < upcomingDeadlines.length - 1 ? '1px solid #E5E7EB' : 'none',
                      '&:hover': {
                        backgroundColor: '#F6F3E7'
                      }
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#0F1939',
                        fontSize: '14px',
                        mb: 0.5
                      }}
                    >
                      {project.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: project.daysUntilDeadline <= 7 ? '#EF4444' : '#6B7280',
                        fontSize: '12px',
                        fontWeight: 500
                      }}
                    >
                      {project.daysUntilDeadline === 0 
                        ? 'Due today' 
                        : `${project.daysUntilDeadline} days remaining`
                      }
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#9CA3AF',
                      fontSize: '14px'
                    }}
                  >
                    No upcoming deadlines
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderProjectsContent = () => (
    <Box>
      <Suspense fallback={<LoadingFallback message="Loading filters..." />}>
        <ProjectsFilters
          open={showProjectsFilters}
          filters={projectsFilters}
          onFiltersChange={onFiltersChange}
          onClearFilters={onClearFilters}
          clients={clients}
          teamMembers={teamMembers}
          projects={projects}
        />
      </Suspense>

      {/* Enhanced Projects Table */}
      <ErrorBoundary fallbackMessage="Failed to load projects table">
        <EnhancedProjectsTable
          projects={filteredProjects || projects}
          clients={clients}
          teamMembers={teamMembers}
          onViewProject={onViewProject}
          onEditProject={handleEditProject}
          onDuplicateProject={handleDuplicateProject}
          onArchiveProject={handleArchiveProject}
          onAssignTeam={handleAssignTeam}
          onViewTimeline={handleViewTimeline}
          onExportProject={handleExportProject}
          onSetPriority={handleSetPriority}
        />
      </ErrorBoundary>
    </Box>
  );

  const renderTimelineContent = () => (
    <ErrorBoundary fallbackMessage="Failed to load timeline">
      <Suspense fallback={<LoadingFallback message="Loading your project timeline..." />}>
        <UserProjectsGantt 
          projects={projects}
          tasks={tasks}
          teamMembers={teamMembers}
          onProjectUpdate={onUpdateTask}
        />
      </Suspense>
    </ErrorBoundary>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'projects':
        return renderProjectsContent();
      case 'timeline':
        return renderTimelineContent();
      default:
        return renderProjectsContent();
    }
  };

  return (
    <>
      <CleanPageLayout
        title="Projects"
        subtitle="Manage your construction and millwork projects with complete oversight"
        breadcrumbs={[
          { label: 'Team Space', href: '/workspace' },
          { label: 'Projects', href: '/projects' }
        ]}
        headerActions={headerActions}
        tabs={tabs}
      >
        <Box className="clean-fade-in">
          {renderTabContent()}
        </Box>
      </CleanPageLayout>

      {/* Project Form Modal */}
      <ProjectFormModal
        open={projectFormModal.open}
        onClose={handleCloseProjectForm}
        onSubmit={handleProjectSubmit}
        project={projectFormModal.project}
        clients={clients}
        teamMembers={teamMembers}
        loading={projectFormModal.loading}
        error={projectFormModal.error}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmation.open}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        itemName={deleteConfirmation.project?.name}
        itemType="project"
        loading={deleteConfirmation.loading}
        error={deleteConfirmation.error}
        consequences={deleteConfirmation.consequences || []}
      />
    </>
  );
};

export default React.memo(ProjectsPage);