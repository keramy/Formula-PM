import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Plus as Add,
  FilterList,
  List as ViewList,
  ViewGrid as ViewModule,
  User as PersonIcon,
  Group as TeamIcon,
  ArrowUp as TrendingUp,
  ClipboardCheck as Task,
  CheckCircle,
  Clock as Schedule
} from 'iconoir-react';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import TeamMembersList from '../features/team/components/TeamMembersList';
import TeamPerformance from '../features/team/components/TeamPerformance';

const TeamPage = ({ 
  teamMembers = [],
  tasks = [],
  projects = [],
  clients = [],
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onViewMemberDetail
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('cards');

  const handleAddMember = useCallback(() => {
    onAddMember();
  }, [onAddMember]);

  // Calculate team statistics
  const teamStats = useMemo(() => {
    const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    
    const totalMembers = safeTeamMembers.length;
    const activeMembers = safeTeamMembers.filter(m => m.status === 'active').length;
    const totalTasks = safeTasks.length;
    const completedTasks = safeTasks.filter(t => t.status === 'completed').length;
    const averageCompletion = safeTeamMembers.length > 0 
      ? Math.round(safeTeamMembers.reduce((sum, member) => {
          const memberTasks = safeTasks.filter(task => task.assignedTo === member.id);
          const memberCompleted = memberTasks.filter(task => task.status === 'completed').length;
          return sum + (memberTasks.length > 0 ? (memberCompleted / memberTasks.length) * 100 : 0);
        }, 0) / safeTeamMembers.length)
      : 0;

    const highPerformers = safeTeamMembers.filter(member => {
      const memberTasks = safeTasks.filter(task => task.assignedTo === member.id);
      const memberCompleted = memberTasks.filter(task => task.status === 'completed').length;
      const memberCompletionRate = memberTasks.length > 0 ? (memberCompleted / memberTasks.length) * 100 : 0;
      return memberCompletionRate >= 80;
    }).length;

    return {
      total: totalMembers,
      active: activeMembers,
      totalTasks,
      completedTasks,
      averageCompletion,
      highPerformers
    };
  }, [teamMembers, tasks]);

  // Get top performers (top 5 by completion rate)
  const topPerformers = useMemo(() => {
    return teamMembers
      .map(member => {
        const memberTasks = tasks.filter(task => task.assignedTo === member.id);
        const memberCompleted = memberTasks.filter(task => task.status === 'completed').length;
        const completionRate = memberTasks.length > 0 ? (memberCompleted / memberTasks.length) * 100 : 0;
        return {
          ...member,
          completionRate,
          totalTasks: memberTasks.length,
          completedTasks: memberCompleted
        };
      })
      .filter(member => member.totalTasks > 0)
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5);
  }, [teamMembers, tasks]);

  // Get recent hires (last 5)
  const recentHires = useMemo(() => {
    return [...teamMembers]
      .sort((a, b) => new Date(b.joinedAt || Date.now()) - new Date(a.joinedAt || Date.now()))
      .slice(0, 5);
  }, [teamMembers]);

  const getRoleName = (roleValue) => {
    const roles = {
      'project_manager': 'Project Manager',
      'team_lead': 'Team Lead',
      'senior': 'Senior',
      'junior': 'Junior',
      'client': 'Client'
    };
    return roles[roleValue] || roleValue;
  };

  const getDepartmentName = (deptValue) => {
    const departments = {
      'construction': 'Construction',
      'millwork': 'Millwork',
      'electrical': 'Electrical',
      'mechanical': 'Mechanical',
      'management': 'Management',
      'client': 'Client'
    };
    return departments[deptValue] || deptValue;
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const headerActions = (
    <>
      <IconButton className="clean-button-secondary">
        <FilterList />
      </IconButton>
      <Button className="clean-button-primary" startIcon={<Add />} onClick={handleAddMember}>
        Add member
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
        label="All Members" 
        isActive={activeTab === 'members'}
        onClick={() => setActiveTab('members')}
        icon={<ViewList sx={{ fontSize: 16 }} />}
        badge={teamStats.total}
      />
      <CleanTab 
        label="Performance" 
        isActive={activeTab === 'performance'}
        onClick={() => setActiveTab('performance')}
        icon={<Assignment sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Org Chart" 
        isActive={activeTab === 'org-chart'}
        onClick={() => setActiveTab('org-chart')}
        icon={<TeamIcon sx={{ fontSize: 16 }} />}
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

  const MemberCard = ({ member, showStats = true }) => {
    const memberTasks = tasks.filter(task => task.assignedTo === member.id);
    const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
    const completionRate = memberTasks.length > 0 ? Math.round((completedTasks / memberTasks.length) * 100) : 0;
    
    return (
      <Card className="clean-card" sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onViewMemberDetail && onViewMemberDetail(member)}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                fontSize: '16px',
                fontWeight: 600,
                bgcolor: member.roleColor || '#E3AF64',
                mr: 2
              }}
            >
              {member.initials || member.fullName?.charAt(0) || '?'}
            </Avatar>
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
                {member.fullName}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6B7280', 
                  fontSize: '13px',
                  mb: 0.5
                }}
              >
                {getRoleName(member.role)}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#9CA3AF', 
                  fontSize: '12px'
                }}
              >
                {getDepartmentName(member.department)}
              </Typography>
            </Box>
            <Chip
              label={member.status === 'active' ? 'Active' : 'Inactive'}
              size="small"
              className={`clean-chip ${
                member.status === 'active' ? 'status-completed' : 'status-todo'
              }`}
            />
          </Box>

          {showStats && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6B7280',
                    fontSize: '12px',
                    fontWeight: 500
                  }}
                >
                  Task Completion
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6B7280',
                    fontSize: '12px',
                    fontWeight: 500
                  }}
                >
                  {completionRate}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                className="clean-progress-bar"
                sx={{
                  mb: 1,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: completionRate >= 75 ? '#10B981' : completionRate >= 50 ? '#E3AF64' : '#516AC8'
                  }
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#9CA3AF',
                  fontSize: '11px'
                }}
              >
                {completedTasks}/{memberTasks.length} tasks completed
              </Typography>
            </Box>
          )}

          {member.joinedAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Schedule sx={{ fontSize: 14, color: '#9CA3AF' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '12px'
                }}
              >
                Joined {formatJoinDate(member.joinedAt)}
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
            title="Total Members"
            value={teamStats.total}
            subtitle={`${teamStats.active} active`}
            icon={<PersonIcon />}
            color="#516AC8"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="High Performers"
            value={teamStats.highPerformers}
            subtitle="80%+ completion rate"
            icon={<TrendingUp />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Task Completion"
            value={`${teamStats.averageCompletion}%`}
            subtitle="Team average"
            icon={<Assignment />}
            color="#E3AF64"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Tasks"
            value={teamStats.totalTasks}
            subtitle={`${teamStats.completedTasks} completed`}
            icon={<CheckCircle />}
            color="#10B981"
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={4}>
        {/* Top Performers */}
        <Grid item xs={12} lg={8}>
          <Card className="clean-card">
            <Box className="clean-section-header">
              <Box className="clean-section-indicator"></Box>
              <Typography className="clean-section-title">
                Top Performers
              </Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Grid container spacing={3} sx={{ p: 3 }}>
                {topPerformers.map((member) => (
                  <Grid item xs={12} sm={6} key={member.id}>
                    <MemberCard member={member} />
                  </Grid>
                ))}
                {topPerformers.length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <PersonIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 2 }} />
                      <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                        No performance data available yet
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Hires */}
        <Grid item xs={12} lg={4}>
          <Card className="clean-card">
            <Box className="clean-section-header">
              <Box className="clean-section-indicator" sx={{ backgroundColor: '#516AC8' }}></Box>
              <Typography className="clean-section-title">
                Recent Hires
              </Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              {recentHires.length > 0 ? (
                recentHires.map((member, index) => (
                  <Box
                    key={member.id}
                    sx={{
                      p: 2,
                      borderBottom: index < recentHires.length - 1 ? '1px solid #E5E7EB' : 'none',
                      '&:hover': {
                        backgroundColor: '#F6F3E7'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '12px',
                          fontWeight: 600,
                          bgcolor: member.roleColor || '#E3AF64'
                        }}
                      >
                        {member.initials || member.fullName?.charAt(0) || '?'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#0F1939',
                            fontSize: '14px',
                            mb: 0.5
                          }}
                        >
                          {member.fullName}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#6B7280',
                            fontSize: '12px'
                          }}
                        >
                          {getRoleName(member.role)} • {member.joinedAt ? formatJoinDate(member.joinedAt) : 'Recently'}
                        </Typography>
                      </Box>
                    </Box>
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
                    No recent hires
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderMembersContent = () => (
    <Box>
      <TeamMembersList
        teamMembers={teamMembers}
        tasks={tasks}
        projects={projects}
        onUpdateMember={onUpdateMember}
        onDeleteMember={onDeleteMember}
        onAddMember={onAddMember}
        onViewMemberDetail={onViewMemberDetail}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </Box>
  );

  const renderPerformanceContent = () => (
    <Box>
      <TeamPerformance 
        teamMembers={teamMembers} 
        tasks={tasks} 
        projects={projects} 
      />
    </Box>
  );

  const renderOrgChartContent = () => (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
        🏢 Organization Chart
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
        Interactive organization chart with reporting relationships coming soon
      </Typography>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'members':
        return renderMembersContent();
      case 'performance':
        return renderPerformanceContent();
      case 'org-chart':
        return renderOrgChartContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <CleanPageLayout
      title="Team"
      subtitle="Manage your team members, track performance, and optimize collaboration"
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

export default TeamPage;