import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  useTheme,
  IconButton,
  InputBase,
  Paper,
  Tooltip
} from '@mui/material';
// Iconoir icons - verified working icons only
import {
  MdHome as Home,
  MdNotifications as Notifications,
  MdEmail as Inbox,
  MdCheck as Task,
  MdGroup as Group,
  MdList as ViewList,
  MdFolder as Folder,
  MdKeyboardArrowUp as NavArrowUp,
  MdKeyboardArrowDown as NavArrowDown,
  MdAdd as Add,
  MdSearch as Search,
  MdSettings as Settings,
  MdPerson as User,
  MdDashboard as Dashboard,
  MdFolder as FolderOpen,
  MdKeyboardArrowUp as Timeline,
  MdBusiness as Engineering,
  MdMenu as MenuOpen,
  MdMenu as Menu,
  MdDescription as Description,
  MdBusiness as Business
} from 'react-icons/md';
import FormulaLogo from '../branding/FormulaLogo';

const NotionStyleSidebar = ({ currentTab, onTabChange, user, isCollapsed, onToggleCollapse }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    projects: true,
    workManagement: true,
    business: true
  });

  // Your color palette
  const colors = {
    background: '#FBFAF8',
    cardBackground: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280', 
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    hoverBackground: '#F6F3E7',  // Your rapture-light
    activeBackground: '#F6F3E7',
    caramelEssence: '#E3AF64',
    sapphireDust: '#516AC8',
    cosmicOdyssey: '#0F1939'
  };

  const handleSectionToggle = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const mainNavItems = [
    { id: 0, label: 'Home', icon: <Home />, path: '/dashboard' },
    { id: 'updates', label: 'Updates', icon: <Notifications />, path: '/updates' },
    { id: 'inbox', label: 'Inbox', icon: <Inbox />, path: '/inbox' },
    { id: 3, label: 'Your tasks', icon: <Task />, path: '/tasks' }
  ];

  const projectsItems = [
    { id: 0, label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { id: 1, label: 'All Projects', icon: <FolderOpen />, path: '/projects' },
    { id: 2, label: 'My Work', icon: <User />, path: '/my-work' },
    { id: 7, label: 'Timeline', icon: <Timeline />, path: '/timeline' }
  ];

  const workManagementItems = [
    { id: 3, label: 'Tasks', icon: <Task />, path: '/tasks' },
    { id: 8, label: 'Shop Drawings', icon: <Engineering />, path: '/shop-drawings' },
    { id: 9, label: 'Material Specs', icon: <Description />, path: '/material-specs' },
    { id: 'reports', label: 'Reports', icon: <Folder />, path: '/reports' }
  ];

  const businessItems = [
    { id: 5, label: 'Clients', icon: <Business />, path: '/clients' },
    { id: 4, label: 'Team Members', icon: <Group />, path: '/team' },
    { id: 6, label: 'Procurement', icon: <FolderOpen />, path: '/procurement' },
    { id: 10, label: 'Activity Feed', icon: <Timeline />, path: '/activity' }
  ];

  // Function to check if current route matches the nav item
  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item, isActive, level = 0, isCollapsed = false }) => {
    // Use route-based active state if path is available, otherwise fall back to currentTab
    const itemIsActive = item.path ? isActiveRoute(item.path) : isActive;
    
    return (
      <Tooltip title={isCollapsed ? item.label : ''} placement="right" arrow>
        <ListItemButton
          onClick={() => {
            if (item.path) {
              navigate(item.path);
            } else {
              onTabChange && onTabChange(null, item.id);
            }
          }}
        sx={{
          py: 0.5,
          px: isCollapsed ? 1 : (level === 0 ? 1.5 : 2.5),
          borderRadius: 1.5,
          mx: 1,
          minHeight: 28,
          backgroundColor: itemIsActive ? colors.activeBackground : 'transparent',
          color: itemIsActive ? colors.textPrimary : colors.textSecondary,
          fontSize: '14px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          '&:hover': {
            backgroundColor: colors.hoverBackground,
            color: colors.textPrimary
          },
          transition: 'all 0.2s ease'
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: isCollapsed ? 0 : 20,
            mr: isCollapsed ? 0 : 1.5,
            color: 'inherit',
            fontSize: typeof item.icon === 'string' ? '16px' : '18px',
            justifyContent: 'center'
          }}
        >
          {typeof item.icon === 'string' ? item.icon : item.icon}
        </ListItemIcon>
        {!isCollapsed && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '14px',
              fontWeight: itemIsActive ? 500 : 400,
              lineHeight: 1.4
            }}
          />
        )}
        {!isCollapsed && item.hasSubmenu && (
          <NavArrowUp size={16} color={colors.textMuted} />
        )}
      </ListItemButton>
    </Tooltip>
    );
  };

  const SectionHeader = ({ title, isOpen, onToggle, showAdd = false }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      px: 2,
      py: 0.5,
      color: colors.textMuted
    }}>
      <Typography
        variant="caption"
        sx={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: colors.textMuted,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
        onClick={onToggle}
      >
        {isOpen ? <NavArrowUp size={14} /> : <NavArrowDown size={14} />}
        {title}
      </Typography>
      {showAdd && (
        <IconButton size="small" sx={{ p: 0.25, color: colors.textMuted }}>
          <Add sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        width: isCollapsed ? 70 : 240,
        height: '100vh',
        backgroundColor: colors.background,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s ease'
      }}
    >
      {/* Header with Collapse Button */}
      <Box sx={{ 
        p: 1.5, 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: `1px solid ${colors.border}`
      }}>
        <IconButton 
          onClick={onToggleCollapse}
          sx={{ 
            color: colors.textMuted,
            width: 24,
            height: 24
          }}
        >
          {isCollapsed ? <MenuOpen sx={{ fontSize: 16 }} /> : <Menu sx={{ fontSize: 16 }} />}
        </IconButton>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ px: 0.5 }}>
        <List sx={{ py: 0 }}>
          {mainNavItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <NavItem 
                item={item} 
                isActive={currentTab === item.id}
                isCollapsed={isCollapsed}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Projects Section */}
      <Box sx={{ mt: 1 }}>
        {!isCollapsed && (
          <SectionHeader
            title="PROJECTS"
            isOpen={openSections.projects}
            onToggle={() => handleSectionToggle('projects')}
          />
        )}
        <Collapse in={isCollapsed || openSections.projects}>
          <List sx={{ py: 0, px: 0.5 }}>
            {projectsItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <NavItem 
                  item={item} 
                  isActive={currentTab === item.id}
                  isCollapsed={isCollapsed}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>

      {/* Work Management Section */}
      <Box sx={{ mt: 1 }}>
        {!isCollapsed && (
          <SectionHeader
            title="WORK MANAGEMENT"
            isOpen={openSections.workManagement}
            onToggle={() => handleSectionToggle('workManagement')}
          />
        )}
        <Collapse in={isCollapsed || openSections.workManagement}>
          <List sx={{ py: 0, px: 0.5 }}>
            {workManagementItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <NavItem 
                  item={item} 
                  isActive={currentTab === item.id}
                  isCollapsed={isCollapsed}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>

      {/* Business Section */}
      <Box sx={{ mt: 1 }}>
        {!isCollapsed && (
          <SectionHeader
            title="BUSINESS"
            isOpen={openSections.business}
            onToggle={() => handleSectionToggle('business')}
          />
        )}
        <Collapse in={isCollapsed || openSections.business}>
          <List sx={{ py: 0, px: 0.5 }}>
            {businessItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <NavItem 
                  item={item} 
                  isActive={currentTab === item.id}
                  isCollapsed={isCollapsed}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>

      {/* Flex spacer */}
      <Box sx={{ flex: 1 }} />

    </Box>
  );
};

export default NotionStyleSidebar;