import React, { Suspense, useState, useCallback, useMemo } from 'react';
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
  Plus as Add,
  FilterList,
  List as ViewList,
  ViewGrid as ViewModule,
  Calendar as Timeline,
  ArrowUp as TrendingUp,
  ClipboardCheck as Assignment,
  User as Group,
  Calendar as CalendarToday,
  Clock as Schedule,
  Trash as MoreVert
} from 'iconoir-react';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { 
  ProjectsTableView,
  ProjectsFilters,
  ProjectsList,
  BoardView,
  GanttChart,
  LoadingFallback,
  ListSkeleton,
  ProjectCardSkeleton
} from '../components/lazy';

const ProjectsPage = ({ 
  projects = [],
  tasks = [],
  teamMembers = [],
  clients = [],
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
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('cards');

  const handleAddProject = useCallback(() => {
    onAddProject();
  }, [onAddProject]);

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
        icon={<TrendingUp sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="All Projects" 
        isActive={activeTab === 'projects'}
        onClick={() => setActiveTab('projects')}
        icon={<ViewList sx={{ fontSize: 16 }} />}
        badge={projectStats.total}
      />
      <CleanTab 
        label="Timeline" 
        isActive={activeTab === 'timeline'}
        onClick={() => setActiveTab('timeline')}
        icon={<Timeline sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Board" 
        isActive={activeTab === 'board'}
        onClick={() => setActiveTab('board')}
        icon={<ViewModule sx={{ fontSize: 16 }} />}
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
    const progressColor = project.progress >= 75 ? '#10B981' : project.progress >= 50 ? '#E3AF64' : '#516AC8';
    
    return (
      <Card className="clean-card" sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onViewProject && onViewProject(project)}>
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
            <IconButton size="small" sx={{ color: '#9CA3AF' }}>
              <MoreVert sx={{ fontSize: 18 }} />
            </IconButton>
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
                  backgroundColor: progressColor
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule sx={{ fontSize: 14, color: '#9CA3AF' }} />
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
            icon={<Assignment />}
            color="#516AC8"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Completed"
            value={projectStats.completed}
            subtitle={`${Math.round((projectStats.completed / projectStats.total) * 100) || 0}% completion rate`}
            icon={<TrendingUp />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Budget"
            value={formatCurrency(projectStats.totalBudget)}
            subtitle="Across all projects"
            icon={<Assignment />}
            color="#E3AF64"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Overdue"
            value={projectStats.overdue}
            subtitle="Requires attention"
            icon={<Schedule />}
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

      {/* View Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '18px', 
            fontWeight: 600,
            color: '#0F1939'
          }}
        >
          All Projects ({projects.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            className={viewMode === 'cards' ? 'clean-button-primary' : 'clean-button-secondary'}
            onClick={() => setViewMode('cards')}
            size="small"
          >
            <ViewModule sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            className={viewMode === 'list' ? 'clean-button-primary' : 'clean-button-secondary'}
            onClick={() => setViewMode('list')}
            size="small"
          >
            <ViewList sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Projects Display */}
      {viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {(filteredProjects || projects).map((project) => (
            <Grid item xs={12} sm={6} lg={4} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <ErrorBoundary fallbackMessage="Failed to load projects list">
          <Suspense fallback={<ListSkeleton SkeletonComponent={ProjectCardSkeleton} count={4} />}>
            <ProjectsList 
              projects={filteredProjects || projects}
              tasks={tasks}
              clients={clients}
              teamMembers={teamMembers}
              onDeleteProject={onDeleteProject}
              onManageScope={onManageScope}
              onViewProject={onViewProject}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </Box>
  );

  const renderTimelineContent = () => (
    <ErrorBoundary fallbackMessage="Failed to load Gantt chart">
      <Suspense fallback={<LoadingFallback message="Loading Gantt chart..." />}>
        <GanttChart 
          tasks={tasks}
          projects={projects}
          teamMembers={teamMembers}
        />
      </Suspense>
    </ErrorBoundary>
  );

  const renderBoardContent = () => (
    <ErrorBoundary fallbackMessage="Failed to load board view">
      <Suspense fallback={<LoadingFallback message="Loading board view..." />}>
        <BoardView
          tasks={tasks}
          projects={projects}
          teamMembers={teamMembers}
          clients={clients}
          onProjectUpdate={onUpdateTask}
          showProjects={true}
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
      case 'board':
        return renderBoardContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
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
  );
};

export default React.memo(ProjectsPage);