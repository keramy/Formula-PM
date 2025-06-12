import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  Email,
  Phone,
  Work,
  Person,
  Star,
  AccountTree,
  AccessTime,
  Visibility,
  Edit as EditIcon
} from '@mui/icons-material';
import UnifiedHeader from '../../../components/ui/UnifiedHeader';
import UnifiedFilters from '../../../components/ui/UnifiedFilters';
import UnifiedTableView from '../../../components/ui/UnifiedTableView';

const roles = [
  { value: 'project_manager', label: 'Project Manager', color: '#e74c3c', level: 5 },
  { value: 'team_lead', label: 'Team Lead', color: '#e67e22', level: 4 },
  { value: 'senior', label: 'Senior', color: '#f39c12', level: 3 },
  { value: 'junior', label: 'Junior', color: '#27ae60', level: 2 },
  { value: 'client', label: 'Client', color: '#3498db', level: 1 }
];

const departments = [
  { value: 'construction', label: 'Construction' },
  { value: 'millwork', label: 'Millwork' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'management', label: 'Management' },
  { value: 'client', label: 'Client' }
];

function TeamMembersList({ teamMembers, tasks, onUpdateMember, onDeleteMember, onAddMember }) {
  const [editDialog, setEditDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // Enhanced view state
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [sortBy, setSortBy] = useState('roleLevel');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    status: '',
    level: ''
  });

  // Filter configuration for team members
  const filterConfig = [
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: roles
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: departments
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'level',
      label: 'Level',
      type: 'select',
      options: [
        { value: '1', label: 'Level 1' },
        { value: '2', label: 'Level 2' },
        { value: '3', label: 'Level 3' },
        { value: '4', label: 'Level 4' },
        { value: '5', label: 'Level 5' },
        { value: '6', label: 'Level 6' },
        { value: '7', label: 'Level 7' },
        { value: '8', label: 'Level 8' },
        { value: '9', label: 'Level 9' },
        { value: '10', label: 'Level 10' }
      ]
    }
  ];

  // Quick filters for team members
  const quickFilters = [
    { key: 'managers', label: 'Managers', filters: { role: 'project_manager' } },
    { key: 'senior', label: 'Senior Staff', filters: { role: 'senior' } },
    { key: 'active', label: 'Active Members', filters: { status: 'active' } },
    { key: 'management', label: 'Management', filters: { department: 'management' } },
    { key: 'construction', label: 'Construction', filters: { department: 'construction' } }
  ];

  // Table columns configuration
  const tableColumns = [
    {
      key: 'member',
      label: 'Member',
      sortable: true,
      type: 'avatar',
      render: (value, row) => ({
        fallback: row.initials,
        bgColor: row.roleColor,
        text: row.fullName
      })
    },
    {
      key: 'role',
      label: 'Role',
      type: 'chip',
      render: (value, row) => {
        const roleConfig = roles.find(r => r.value === value);
        return {
          label: roleConfig ? roleConfig.label : value,
          color: row.roleColor,
          bgColor: `${row.roleColor}20`
        };
      }
    },
    {
      key: 'department',
      label: 'Department',
      render: (value) => {
        const deptConfig = departments.find(d => d.value === value);
        return deptConfig ? deptConfig.label : value;
      }
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email'
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'phone'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'chip',
      render: (value) => ({
        label: value === 'active' ? 'Active' : 'Inactive',
        color: value === 'active' ? '#27ae60' : '#e74c3c',
        bgColor: value === 'active' ? '#eafaf1' : '#fdf2f2'
      })
    },
    {
      key: 'tasks',
      label: 'Task Completion',
      type: 'progress',
      render: (value, row) => {
        const stats = getMemberStats(row.id);
        return stats.completionRate;
      }
    }
  ];

  // Table actions
  const tableActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: <Visibility />
    },
    {
      key: 'edit',
      label: 'Edit Member',
      icon: <EditIcon />
    },
    {
      key: 'delete',
      label: 'Delete Member',
      icon: <Delete />
    }
  ];

  const getMemberStats = (memberId) => {
    const memberTasks = tasks.filter(task => task.assignedTo === memberId);
    const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
    const overdueTasks = memberTasks.filter(task => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return task.status !== 'completed' && new Date(task.dueDate) < today;
    }).length;

    return {
      total: memberTasks.length,
      completed: completedTasks,
      pending: memberTasks.length - completedTasks,
      overdue: overdueTasks,
      completionRate: memberTasks.length > 0 ? Math.round((completedTasks / memberTasks.length) * 100) : 0
    };
  };

  const getReportsCount = (managerId) => {
    return teamMembers.filter(member => member.reportsTo === managerId).length;
  };

  const getManagerName = (managerId) => {
    const manager = teamMembers.find(member => member.id === managerId);
    return manager ? manager.fullName : 'No Manager';
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setEditFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone || '',
      role: member.role,
      department: member.department,
      reportsTo: member.reportsTo || '',
      hourlyRate: member.hourlyRate || '',
      notes: member.notes || '',
      status: member.status
    });
    setEditDialog(true);
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setViewDialog(true);
  };

  const handleSaveEdit = () => {
    const selectedRole = roles.find(r => r.value === editFormData.role);
    
    onUpdateMember(selectedMember.id, {
      ...editFormData,
      fullName: `${editFormData.firstName.trim()} ${editFormData.lastName.trim()}`,
      initials: `${editFormData.firstName.charAt(0)}${editFormData.lastName.charAt(0)}`.toUpperCase(),
      roleLevel: selectedRole.level,
      roleColor: selectedRole.color
    });
    
    setEditDialog(false);
    setSelectedMember(null);
  };

  const handleDelete = (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.fullName}? This action cannot be undone.`)) {
      onDeleteMember(member.id);
    }
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter and sort team members
  const filteredAndSortedMembers = useMemo(() => {
    let filtered = teamMembers.filter(member => {
      // Search filter
      const searchLower = searchValue.toLowerCase();
      const matchesSearch = !searchValue || 
        member.fullName.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.position?.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole = !filters.role || member.role === filters.role;

      // Department filter
      const matchesDepartment = !filters.department || member.department === filters.department;

      // Status filter
      const matchesStatus = !filters.status || member.status === filters.status;

      // Level filter
      const matchesLevel = !filters.level || member.level?.toString() === filters.level;

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus && matchesLevel;
    });

    // Sort members
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'member':
        case 'fullName':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'roleLevel':
          aValue = a.level || 0;
          bValue = b.level || 0;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'department':
          aValue = a.department;
          bValue = b.department;
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [teamMembers, searchValue, filters, sortBy, sortDirection]);

  // Get active filters for display
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => value !== '')
    .map(([key, value]) => {
      let label = key.charAt(0).toUpperCase() + key.slice(1);
      let displayValue = value;
      
      if (key === 'role') {
        const role = roles.find(r => r.value === value);
        displayValue = role ? role.label : value;
      } else if (key === 'department') {
        const dept = departments.find(d => d.value === value);
        displayValue = dept ? dept.label : value;
      }
      
      return { key, label, value: displayValue };
    });

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      role: '',
      department: '',
      status: '',
      level: ''
    });
  };

  const handleClearFilter = (key) => {
    if (key === 'all') {
      handleClearFilters();
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleApplyQuickFilter = (quickFilter) => {
    setFilters(prev => ({ ...prev, ...quickFilter.filters }));
  };

  const handleSort = (column, direction) => {
    setSortBy(column);
    setSortDirection(direction);
  };

  const handleRowAction = (action, member) => {
    switch (action) {
      case 'view':
        handleView(member);
        break;
      case 'edit':
        handleEdit(member);
        break;
      case 'delete':
        handleDelete(member);
        break;
    }
  };

  const handleExport = () => {
    const { exportTeamMembersToExcel } = require('../../../services/export/excelExport');
    exportTeamMembersToExcel(filteredAndSortedMembers, tasks);
  };

  // Sort members by role level (highest first) then by name
  const sortedMembers = [...teamMembers].sort((a, b) => {
    if (a.level !== b.level) {
      return b.level - a.level;
    }
    return a.fullName.localeCompare(b.fullName);
  });

  // Empty state
  if (teamMembers.length === 0) {
    return (
      <Box>
        <UnifiedHeader
          title="Team Members"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFiltersCount={activeFilters.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={handleExport}
          onAdd={onAddMember}
          addButtonText="Add Member"
          activeFilters={activeFilters}
          onClearFilter={handleClearFilter}
        />
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No team members added yet. Add your first team member to get started!
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Unified Header */}
      <UnifiedHeader
        title="Team Members"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFiltersCount={activeFilters.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExport}
        onAdd={onAddMember}
        addButtonText="Add Member"
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
        <UnifiedTableView
          data={filteredAndSortedMembers}
          columns={tableColumns}
          onSort={handleSort}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onRowAction={handleRowAction}
          actions={tableActions}
          emptyStateMessage="No team members match your filters"
          emptyStateIcon={Person}
        />
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <Grid container spacing={3}>
          {filteredAndSortedMembers.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No team members match your filters
                </Typography>
              </Box>
            </Grid>
          ) : (
            filteredAndSortedMembers.map((member) => {
          const stats = getMemberStats(member.id);
          const reportsCount = getReportsCount(member.id);
          const roleInfo = roles.find(r => r.value === member.role);
          const deptInfo = departments.find(d => d.value === member.department);
          
          return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
                <Card
                  sx={{
                    height: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderTop: `4px solid ${member.roleColor}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
              >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: member.status === 'active' ? '#27ae60' : '#95a5a6',
                            border: '2px solid white'
                          }}
                        />
                      }
                    >
                      <Avatar
                        sx={{
                          bgcolor: member.roleColor,
                          width: 56,
                          height: 56,
                          fontSize: 20,
                          fontWeight: 'bold'
                        }}
                      >
                        {member.initials}
                      </Avatar>
                    </Badge>
                    
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h6" component="h3">
                        {member.fullName}
                      </Typography>
                      <Chip
                        label={roleInfo?.label}
                        size="small"
                        sx={{
                          backgroundColor: member.roleColor + '20',
                          color: member.roleColor,
                          fontWeight: 'bold',
                          mb: 1
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {deptInfo?.label}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleView(member)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(member)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(member)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Contact Info */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Box>
                    {member.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {member.phone}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Stats */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Task Performance
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`${stats.total} total`} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`${stats.completed} done`} 
                        size="small" 
                        sx={{ backgroundColor: '#eafaf1', color: '#27ae60' }}
                      />
                      {stats.overdue > 0 && (
                        <Chip 
                          label={`${stats.overdue} overdue`} 
                          size="small" 
                          sx={{ backgroundColor: '#fdf2f2', color: '#e74c3c' }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Completion Rate: {stats.completionRate}%
                    </Typography>
                  </Box>

                  {/* Hierarchy Info */}
                  <Box sx={{ mb: 2 }}>
                    {member.reportsTo && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <AccountTree fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Reports to: {getManagerName(member.reportsTo)}
                        </Typography>
                      </Box>
                    )}
                    {reportsCount > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Manages: {reportsCount} team member{reportsCount > 1 ? 's' : ''}
                      </Typography>
                    )}
                  </Box>

                  {/* Join Date */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Joined: {formatJoinDate(member.joinedAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            );
            })
          )}
        </Grid>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Team Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  value={editFormData.firstName || ''}
                  onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  value={editFormData.lastName || ''}
                  onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                  fullWidth
                />
              </Grid>
            </Grid>
            
            <TextField
              label="Email"
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              fullWidth
            />
            
            <TextField
              label="Phone"
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
              fullWidth
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Role"
                  value={editFormData.role || ''}
                  onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                  fullWidth
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Department"
                  value={editFormData.department || ''}
                  onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                  fullWidth
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            
            <TextField
              select
              label="Status"
              value={editFormData.status || 'active'}
              onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Team Member Details</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Box sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: selectedMember.roleColor,
                    width: 64,
                    height: 64,
                    fontSize: 24
                  }}
                >
                  {selectedMember.initials}
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedMember.fullName}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {roles.find(r => r.value === selectedMember.role)?.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {departments.find(d => d.value === selectedMember.department)?.label}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                  <Typography variant="body2">Email: {selectedMember.email}</Typography>
                  {selectedMember.phone && (
                    <Typography variant="body2">Phone: {selectedMember.phone}</Typography>
                  )}
                </Grid>
                
                {selectedMember.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                    <Typography variant="body2">{selectedMember.notes}</Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Statistics</Typography>
                  {(() => {
                    const stats = getMemberStats(selectedMember.id);
                    return (
                      <Box>
                        <Typography variant="body2">Total Tasks: {stats.total}</Typography>
                        <Typography variant="body2">Completed: {stats.completed}</Typography>
                        <Typography variant="body2">Pending: {stats.pending}</Typography>
                        <Typography variant="body2">Overdue: {stats.overdue}</Typography>
                        <Typography variant="body2">Completion Rate: {stats.completionRate}%</Typography>
                      </Box>
                    );
                  })()}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamMembersList;