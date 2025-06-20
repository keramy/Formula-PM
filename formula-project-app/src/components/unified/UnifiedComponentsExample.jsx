import React, { useState } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import MasterHeader from './MasterHeader';
import UnifiedSearch from './UnifiedSearch';
import UniversalTabs from './UniversalTabs';
import UniversalFilters from './UniversalFilters';
import {
  Folder20Regular as ProjectIcon,
  Task20Regular as TaskIcon,
  People20Regular as TeamIcon,
  Building20Regular as ClientIcon,
  Document20Regular as DocumentIcon,
  DataUsageSettings20Regular as ReportIcon,
  DocumentPdf20Regular as PdfIcon,
  DocumentTable20Regular as ExcelIcon,
  DocumentText20Regular as CsvIcon
} from '@fluentui/react-icons';

/**
 * UnifiedComponentsExample - Demonstrates usage of all unified components
 * This example shows how to integrate the standardized components
 */
const UnifiedComponentsExample = () => {
  // State management
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: [],
    dateRange: { from: null, to: null },
    budget: { min: 0, max: 1000000 }
  });

  // Mock search function
  const mockSearchFunction = async (searchTerm, options) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock results
    return [
      {
        id: 1,
        type: 'project',
        title: 'Downtown Office Complex',
        subtitle: 'Commercial • Active'
      },
      {
        id: 2,
        type: 'task',
        title: 'Review shop drawings',
        subtitle: 'High Priority • Due in 2 days'
      },
      {
        id: 3,
        type: 'team',
        name: 'John Smith',
        subtitle: 'Project Manager • Construction'
      }
    ];
  };

  // Tab configuration
  const tabs = [
    {
      id: 'projects',
      label: 'Projects',
      icon: <ProjectIcon />,
      count: 12,
      badge: 3,
      badgeColor: 'error'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <TaskIcon />,
      count: 45,
      status: 'warning'
    },
    {
      id: 'team',
      label: 'Team',
      icon: <TeamIcon />,
      count: 8
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: <ClientIcon />,
      count: 23
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <DocumentIcon />,
      count: 156,
      hasDropdown: true
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <ReportIcon />,
      disabled: true
    }
  ];

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      icon: 'active',
      iconCategory: 'status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'on-hold', label: 'On Hold' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'type',
      label: 'Project Type',
      type: 'select',
      icon: 'commercial',
      iconCategory: 'projectType',
      options: [
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'institutional', label: 'Institutional' }
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'multiselect',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      type: 'daterange'
    },
    {
      key: 'budget',
      label: 'Budget Range',
      type: 'range',
      min: 0,
      max: 1000000,
      step: 10000,
      marks: [
        { value: 0, label: '$0' },
        { value: 500000, label: '$500K' },
        { value: 1000000, label: '$1M' }
      ]
    }
  ];

  // Quick filters
  const quickFilters = [
    {
      key: 'my-projects',
      label: 'My Projects',
      filters: { assignedTo: 'current-user' }
    },
    {
      key: 'urgent',
      label: 'Urgent Tasks',
      filters: { priority: ['urgent', 'high'] }
    },
    {
      key: 'this-week',
      label: 'Due This Week',
      filters: { dateRange: { from: new Date(), to: new Date() } }
    }
  ];

  // Export options
  const exportOptions = [
    {
      format: 'pdf',
      label: 'Export as PDF',
      icon: <PdfIcon />
    },
    {
      format: 'excel',
      label: 'Export as Excel',
      icon: <ExcelIcon />
    },
    {
      format: 'csv',
      label: 'Export as CSV',
      icon: <CsvIcon />
    }
  ];

  // Add options
  const addOptions = [
    {
      type: 'project',
      label: 'New Project',
      icon: <ProjectIcon />
    },
    {
      type: 'task',
      label: 'New Task',
      icon: <TaskIcon />
    },
    {
      type: 'client',
      label: 'New Client',
      icon: <ClientIcon />
    }
  ];

  // More actions
  const moreActions = [
    {
      key: 'share',
      label: 'Share View',
      onClick: () => console.log('Share')
    },
    {
      key: 'print',
      label: 'Print',
      onClick: () => window.print()
    },
    {
      divider: true
    },
    {
      key: 'settings',
      label: 'View Settings',
      onClick: () => console.log('Settings')
    }
  ];

  // Handlers
  const handleSearch = (term, options) => {
    console.log('Search:', term, options);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = (format) => {
    console.log('Export as:', format);
  };

  const handleAdd = (type) => {
    console.log('Add new:', type);
  };

  const handleApplyQuickFilter = (quickFilter) => {
    setFilters(prev => ({ ...prev, ...quickFilter.filters }));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Master Header */}
      <MasterHeader
        title="Project Management Dashboard"
        subtitle="Manage your construction projects efficiently"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: 'Dashboard' }
        ]}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearch={handleSearch}
        activeFiltersCount={Object.values(filters).filter(v => v && v !== '').length}
        onFilterToggle={() => setShowFilters(!showFilters)}
        exportOptions={exportOptions}
        onExport={handleExport}
        addOptions={addOptions}
        onAdd={handleAdd}
        moreActions={moreActions}
        user={{
          name: 'John Doe',
          role: 'Project Manager',
          avatar: null
        }}
      />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Universal Tabs */}
        <Paper sx={{ mb: 3 }}>
          <UniversalTabs
            value={activeTab}
            onChange={(e, value) => setActiveTab(value)}
            tabs={tabs}
            variant="enhanced"
            showCounts
            showBadges
            allowTabCustomization
            tabActions={[
              {
                label: 'Reset Tab Order',
                onClick: () => console.log('Reset tabs')
              }
            ]}
          />
        </Paper>

        {/* Universal Filters */}
        <UniversalFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={() => setFilters({})}
          filterConfig={filterConfig}
          layout="dropdown"
          showQuickFilters
          quickFilters={quickFilters}
          onApplyQuickFilter={handleApplyQuickFilter}
          useConstructionIcons
        />

        {/* Content Area */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Active Tab: {activeTab}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This is where your content would go. The unified components above provide
            a consistent interface across all pages.
          </Typography>

          {/* Standalone Search Example */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Standalone Search Component
            </Typography>
            <UnifiedSearch
              placeholder="Search projects, tasks, documents..."
              searchFunction={mockSearchFunction}
              onResultSelect={(result) => console.log('Selected:', result)}
              showHistory
              liveSearch
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UnifiedComponentsExample;