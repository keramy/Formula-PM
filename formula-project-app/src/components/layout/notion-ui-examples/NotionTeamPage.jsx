// Example: NotionTeamPage.jsx - Template for your Team page (continued)
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  Add,
  ViewModule,
  ViewList,
  Person,
  Email,
  Phone,
  Work,
  Assignment
} from '@mui/icons-material';
import CleanPageLayout, { CleanTab } from '../CleanPageLayout';

const NotionTeamPage = ({ 
  teamMembers = [], 
  tasks = [], 
  projects = [],
  onAddTeamMember,
  onViewMemberDetail 
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Calculate team statistics
  const teamStats = useMemo(() => {
    const activeMembers = teamMembers.filter(m => m.status === 'active');
    const totalTasks = tasks.length;
    const memberWorkload = teamMembers.map(member => {
      const memberTasks = tasks.filter(t => t.assignedTo === member.id);
      const activeTasks = memberTasks.filter(t => t.status !== 'completed');
      return {
        ...member,
        totalTasks: memberTasks.length,
        activeTasks: activeTasks.length,
        completedTasks: memberTasks.filter(t => t.status === 'completed').length
      };
    });

    return {
      total: teamMembers.length,
      active: activeMembers.length,
      totalTasks,
      memberWorkload
    };
  }, [teamMembers, tasks]);

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'project manager': return '#E3AF64';
      case 'foreman': return '#516AC8';
      case 'carpenter': return '#10B981';
      case 'designer': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'active': return 'status-completed';
      case 'busy': return 'status-in-progress';
      case 'away': return 'status-todo';
      default: return 'status-todo';
    }
  };

  const headerActions = (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          className={viewMode === 'grid' ? 'clean-button-primary' : 'clean-button-secondary'}
          onClick={() => setViewMode('grid')}
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
      <Button className="clean-button-primary" startIcon={<Add />} onClick={onAddTeamMember}>
        Add team member
      </Button>
    </>
  );

  const tabs = (
    <>
      <CleanTab 
        label="All Members" 
        isActive={activeTab === 'all'}
        onClick={() => setActiveTab('all')}
        icon={<Person sx={{ fontSize: 16 }} />}
        badge={teamStats.total}
      />
      <CleanTab 
        label="Active" 
        isActive={activeTab === 'active'}
        onClick={() => setActiveTab('active')}
        icon={<Work sx={{ fontSize: 16 }} />}
        badge={teamStats.active}
      />
      <CleanTab 
        label="Workload" 
        isActive={activeTab === 'workload'}
        onClick={() => setActiveTab('workload')}
        icon={<Assignment sx={{ fontSize: 16 }} />}
      />
    </>
  );

  const StatsCard = ({ title, value, subtitle, color, icon }) => (
    <Card className="clean-card">
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 700, color: '#0F1939' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
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
            {React.cloneElement(icon, { sx: { fontSize: 24, color: color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const TeamMemberCard = ({ member, workload }) => (
    <Card 
      className="clean-card" 
      sx={{ height: '100%', cursor: 'pointer' }}
      onClick={() => onViewMemberDetail(member)}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Member Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: getRoleColor(member.role),
              mr: 2,
              fontSize: '18px',
              fontWeight: 600
            }}
          >
            {member.fullName?.charAt(0) || 'M'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: '#0F1939',
                mb: 0.5
              }}
            >
              {member.fullName}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: getRoleColor(member.role),
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              {member.role}
            </Typography>
          </Box>
          <Chip
            label={member.status || 'active'}
            className={`clean-chip ${getStatusChipClass(member.status)}`}
            size="small"
          />
        </Box>

        {/* Contact Info */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Email sx={{ fontSize: 14, color: '#9CA3AF' }} />
            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
              {member.email}
            </Typography>
          </Box>
          {member.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: 14, color: '#9CA3AF' }} />
              <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                {member.phone}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Workload Stats */}
        {workload && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                Active Tasks
              </Typography>
              <Typography variant="caption" sx={{ color: '#0F1939', fontSize: '12px', fontWeight: 600 }}>
                {workload.activeTasks}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                Completed
              </Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontSize: '12px', fontWeight: 600 }}>
                {workload.completedTasks}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderMembersTable = (members) => (
    <TableContainer component={Paper} className="clean-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Member</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Active Tasks</TableCell>
            <TableCell>Completed Tasks</TableCell>
            <TableCell>Workload</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => {
            const workload = teamStats.memberWorkload.find(w => w.id === member.id);
            const workloadPercentage = Math.min((workload?.activeTasks || 0) * 10, 100);
            
            return (
              <TableRow key={member.id} onClick={() => onViewMemberDetail(member)} sx={{ cursor: 'pointer' }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: getRoleColor(member.role),
                        fontSize: '14px',
                        fontWeight: 600
                      }}
                    >
                      {member.fullName?.charAt(0) || 'M'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F1939' }}>
                        {member.fullName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                        Member since {new Date(member.createdAt || Date.now()).getFullYear()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: getRoleColor(member.role),
                      fontWeight: 500
                    }}
                  >
                    {member.role}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.status || 'active'}
                    className={`clean-chip ${getStatusChipClass(member.status)}`}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px' }}>
                    {member.email}
                  </Typography>
                  {member.phone && (
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '12px' }}>
                      {member.phone}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#E3AF64', fontWeight: 600 }}>
                    {workload?.activeTasks || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                    {workload?.completedTasks || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                    <LinearProgress
                      variant="determinate"
                      value={workloadPercentage}
                      className="clean-progress-bar"
                      sx={{ flex: 1 }}
                    />
                    <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
                      {workloadPercentage}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const getFilteredMembers = () => {
    switch (activeTab) {
      case 'active':
        return teamMembers.filter(m => m.status === 'active');
      case 'workload':
        return [...teamMembers].sort((a, b) => {
          const aWorkload = teamStats.memberWorkload.find(w => w.id === a.id);
          const bWorkload = teamStats.memberWorkload.find(w => w.id === b.id);
          return (bWorkload?.activeTasks || 0) - (aWorkload?.activeTasks || 0);
        });
      case 'all':
      default:
        return teamMembers;
    }
  };

  const renderTabContent = () => {
    const filteredMembers = getFilteredMembers();

    return (
      <Box>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Members"
              value={teamStats.total}
              subtitle="Team size"
              color="#516AC8"
              icon={<Person />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Active Members"
              value={teamStats.active}
              subtitle="Currently working"
              color="#10B981"
              icon={<Work />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Tasks"
              value={teamStats.totalTasks}
              subtitle="Across all projects"
              color="#E3AF64"
              icon={<Assignment />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Avg. Workload"
              value={Math.round(teamStats.totalTasks / (teamStats.total || 1))}
              subtitle="Tasks per member"
              color="#8B5CF6"
              icon={<Assignment />}
            />
          </Grid>
        </Grid>

        {/* Team Members Display */}
        {viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {filteredMembers.map((member) => {
              const workload = teamStats.memberWorkload.find(w => w.id === member.id);
              return (
                <Grid item xs={12} sm={6} lg={4} key={member.id}>
                  <TeamMemberCard member={member} workload={workload} />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          renderMembersTable(filteredMembers)
        )}
      </Box>
    );
  };

  return (
    <CleanPageLayout
      title="Team"
      subtitle="Manage your construction team and track workload distribution"
      breadcrumbs={[
        { label: 'Team Space', href: '/workspace' },
        { label: 'Team', href: '/team' }
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

export default NotionTeamPage;