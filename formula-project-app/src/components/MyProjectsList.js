import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import UnifiedHeader from './UnifiedHeader';
import UnifiedFilters from './UnifiedFilters';
import ProjectsList from './ProjectsList';
import ProjectsTableView from './ProjectsTableView';

const MyProjectsList = ({ 
  projects, 
  tasks, 
  clients = [], 
  teamMembers = [],
  onDeleteProject,
  onEditProject,
  onViewProject,
  onManageScope,
  currentUserId = 1008 // Default to a specific user ID
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    client: '',
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null,
    budgetFrom: '',
    budgetTo: ''
  });

  // Filter projects to only show user's projects
  const myProjects = projects.filter(p => p.projectManager === currentUserId);

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'on-tender', label: 'On Tender' },
        { value: 'awarded', label: 'Awarded' },
        { value: 'on-hold', label: 'On Hold' },
        { value: 'not-awarded', label: 'Not Awarded' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' }
      ]
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { value: 'general-contractor', label: 'General Contractor' },
        { value: 'millwork', label: 'Millwork' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'mep', label: 'MEP' },
        { value: 'management', label: 'Management' }
      ]
    },
    {
      key: 'client',
      label: 'Client',
      type: 'select',
      options: clients.map(c => ({ value: c.id, label: c.companyName }))
    },
    {
      key: 'startDateFrom',
      label: 'Start Date From',
      type: 'date'
    },
    {
      key: 'startDateTo',
      label: 'Start Date To',
      type: 'date'
    },
    {
      key: 'endDateFrom',
      label: 'End Date From',
      type: 'date'
    },
    {
      key: 'endDateTo',
      label: 'End Date To',
      type: 'date'
    },
    {
      key: 'budgetFrom',
      label: 'Budget From',
      type: 'number',
      placeholder: 'Min budget'
    },
    {
      key: 'budgetTo',
      label: 'Budget To',
      type: 'number',
      placeholder: 'Max budget'
    }
  ];

  // Quick filters
  const quickFilters = [
    {
      label: 'Active Projects',
      filters: { status: 'active' }
    },
    {
      label: 'On Tender',
      filters: { status: 'on-tender' }
    },
    {
      label: 'This Month',
      filters: {
        startDateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        startDateTo: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      }
    },
    {
      label: 'Overdue',
      filters: {} // Will implement custom logic
    }
  ];

  // Filtered and sorted projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = myProjects.filter(project => {
      // Search filter
      const searchLower = searchValue.toLowerCase();
      const matchesSearch = !searchValue || 
        project.name.toLowerCase().includes(searchLower) ||
        (project.description && project.description.toLowerCase().includes(searchLower));

      // Basic filters
      const matchesStatus = !filters.status || project.status === filters.status;
      const matchesType = !filters.type || project.type === filters.type;
      const matchesClient = !filters.client || project.clientId === parseInt(filters.client);

      // Date range filters
      const projectStartDate = project.startDate ? new Date(project.startDate) : null;
      const projectEndDate = project.endDate ? new Date(project.endDate) : null;
      
      const matchesStartDateFrom = !filters.startDateFrom || 
        (projectStartDate && projectStartDate >= filters.startDateFrom);
      const matchesStartDateTo = !filters.startDateTo || 
        (projectStartDate && projectStartDate <= filters.startDateTo);
      const matchesEndDateFrom = !filters.endDateFrom || 
        (projectEndDate && projectEndDate >= filters.endDateFrom);
      const matchesEndDateTo = !filters.endDateTo || 
        (projectEndDate && projectEndDate <= filters.endDateTo);

      // Budget range filters
      const projectBudget = project.budget ? parseFloat(project.budget) : 0;
      const matchesBudgetFrom = !filters.budgetFrom || 
        projectBudget >= parseFloat(filters.budgetFrom);
      const matchesBudgetTo = !filters.budgetTo || 
        projectBudget <= parseFloat(filters.budgetTo);

      return matchesSearch && 
             matchesStatus && 
             matchesType && 
             matchesClient && 
             matchesStartDateFrom &&
             matchesStartDateTo &&
             matchesEndDateFrom &&
             matchesEndDateTo &&
             matchesBudgetFrom &&
             matchesBudgetTo;
    });

    return filtered;
  }, [myProjects, searchValue, filters]);

  // Get active filters for display
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => {
      if (typeof value === 'string') return value !== '';
      if (value instanceof Date) return true;
      return value !== null && value !== undefined;
    })
    .map(([key, value]) => ({
      key,
      label: filterConfig.find(f => f.key === key)?.label || key,
      value: value instanceof Date ? value.toLocaleDateString() : value
    }));

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      type: '',
      client: '',
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null,
      budgetFrom: '',
      budgetTo: ''
    });
  };

  const handleClearFilter = (key) => {
    if (key === 'all') {
      handleClearFilters();
    } else if (key.includes('Date')) {
      setFilters(prev => ({ ...prev, [key]: null }));
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleApplyQuickFilter = (quickFilter) => {
    setFilters(prev => ({ ...prev, ...quickFilter.filters }));
  };

  const handleExport = () => {
    // Implement export functionality if needed
    console.log('Export my projects:', filteredAndSortedProjects);
  };

  if (myProjects.length === 0) {
    return (
      <Box>
        <UnifiedHeader
          title="My Projects"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFiltersCount={activeFilters.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={handleExport}
          showAdd={false} // No add button for My Projects
          activeFilters={activeFilters}
          onClearFilter={handleClearFilter}
        />
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No projects assigned to you yet.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Unified Header */}
      <UnifiedHeader
        title={`My Projects (${filteredAndSortedProjects.length})`}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFiltersCount={activeFilters.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExport}
        showAdd={false} // No add button for My Projects
        activeFilters={activeFilters}
        onClearFilter={handleClearFilter}
      />

      {/* Unified Filters */}
      <UnifiedFilters
        show={showFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onApplyQuickFilter={handleApplyQuickFilter}
        filterConfig={filterConfig}
        quickFilters={quickFilters}
      />

      {/* Table View */}
      {viewMode === 'table' && (
        <ProjectsTableView
          projects={filteredAndSortedProjects}
          clients={clients}
          teamMembers={teamMembers}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
          onViewProject={onViewProject}
          onManageScope={onManageScope}
        />
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <ProjectsList 
          projects={filteredAndSortedProjects}
          tasks={tasks}
          clients={clients}
          onDeleteProject={onDeleteProject}
        />
      )}
    </Box>
  );
};

export default MyProjectsList;