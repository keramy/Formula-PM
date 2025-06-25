// src/components/layout/NotionStyleSidebar.jsx
import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import {
  Home,
  Notifications,
  Inbox,
  Assignment,
  Group,
  ViewList,
  Folder,
  ExpandLess,
  ExpandMore,
  Add,
  Search,
  Settings,
  Person
} from '@mui/icons-material';
import FormulaLogo from '../branding/FormulaLogo';

const NotionStyleSidebar = ({ currentTab, onTabChange, user }) => {
  const theme = useTheme();
  const [openSections, setOpenSections] = useState({
    workspace: true,
    spaces: true
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
    { id: 3, label: 'Your tasks', icon: <Assignment />, path: '/tasks' }
  ];

  const workspaceItems = [
    { id: 1, label: 'Project board', icon: <ViewList />, path: '/projects' },
    { id: 'upcoming', label: 'Upcoming', icon: <Assignment />, path: '/upcoming' },
    { id: 'templates', label: 'Templates', icon: <Folder />, path: '/templates' },
    { id: 'views', label: 'Views', icon: <ViewList />, path: '/views', active: true },
    { id: 4, label: 'Teams', icon: <Group />, path: '/team' }
  ];

  const spaceItems = [
    { id: 'formula-pm', label: 'Formula PM', icon: '🏗️', hasSubmenu: true },
    { id: 5, label: 'Clients', icon: '🏢', hasSubmenu: false },
    { id: 'projects', label: 'Projects', icon: '📋', hasSubmenu: true }
  ];

  const NavItem = ({ item, isActive, level = 0 }) => (
    <ListItemButton
      onClick={() => onTabChange && onTabChange(null, item.id)}
      sx={{
        py: 0.5,
        px: level === 0 ? 1.5 : 2.5,
        borderRadius: 1.5,
        mx: 1,
        minHeight: 28,
        backgroundColor: isActive ? colors.activeBackground : 'transparent',
        color: isActive ? colors.textPrimary : colors.textSecondary,
        fontSize: '14px',
        '&:hover': {
          backgroundColor: colors.hoverBackground,
          color: colors.textPrimary
        },
        transition: 'all 0.2s ease'
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 20,
          mr: 1.5,
          color: 'inherit',
          fontSize: typeof item.icon === 'string' ? '16px' : '18px'
        }}
      >
        {typeof item.icon === 'string' ? item.icon : item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{
          fontSize: '14px',
          fontWeight: isActive ? 500 : 400,
          lineHeight: 1.4
        }}
      />
      {item.hasSubmenu && (
        <ExpandLess sx={{ fontSize: '16px', color: colors.textMuted }} />
      )}
    </ListItemButton>
  );

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
        {isOpen ? <ExpandLess sx={{ fontSize: 14 }} /> : <ExpandMore sx={{ fontSize: 14 }} />}
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
        width: 240,
        height: '100vh',
        backgroundColor: colors.background,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Search Bar */}
      <Box sx={{ p: 1.5, pb: 1 }}>
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.border}`,
            borderRadius: 1.5,
            boxShadow: 'none',
            '&:hover': {
              borderColor: colors.caramelEssence
            }
          }}
        >
          <Search sx={{ fontSize: 16, color: colors.textMuted, mr: 1 }} />
          <InputBase
            placeholder="Search"
            sx={{
              flex: 1,
              fontSize: '14px',
              color: colors.textPrimary,
              '& input::placeholder': {
                color: colors.textMuted,
                opacity: 1
              }
            }}
          />
        </Paper>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ px: 0.5 }}>
        <List sx={{ py: 0 }}>
          {mainNavItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <NavItem 
                item={item} 
                isActive={currentTab === item.id}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Workspace Section */}
      <Box sx={{ mt: 1 }}>
        <SectionHeader
          title="WORKSPACE"
          isOpen={openSections.workspace}
          onToggle={() => handleSectionToggle('workspace')}
        />
        <Collapse in={openSections.workspace}>
          <List sx={{ py: 0, px: 0.5 }}>
            {workspaceItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <NavItem 
                  item={item} 
                  isActive={item.active || currentTab === item.id}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>

      {/* Spaces Section */}
      <Box sx={{ mt: 1, flex: 1 }}>
        <SectionHeader
          title="SPACES"
          isOpen={openSections.spaces}
          onToggle={() => handleSectionToggle('spaces')}
          showAdd={true}
        />
        <Collapse in={openSections.spaces}>
          <List sx={{ py: 0, px: 0.5 }}>
            {spaceItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <NavItem 
                  item={item} 
                  isActive={currentTab === item.id}
                />
              </ListItem>
            ))}
          </List>
          
          {/* Add new space button */}
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                py: 0.5,
                px: 1.5,
                borderRadius: 1.5,
                mx: 1,
                minHeight: 28,
                color: colors.textMuted,
                fontSize: '14px',
                '&:hover': {
                  backgroundColor: colors.hoverBackground,
                  color: colors.textPrimary
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 20, mr: 1.5, color: 'inherit' }}>
                <Add sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText
                primary="Add new space"
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: 400
                }}
              />
            </ListItemButton>
          </ListItem>
        </Collapse>
      </Box>

      {/* Settings and Profile */}
      <Box sx={{ borderTop: `1px solid ${colors.border}`, py: 1 }}>
        <List sx={{ py: 0, px: 0.5 }}>
          <ListItem disablePadding>
            <NavItem 
              item={{ id: 'appearance', label: 'Appearance', icon: <Settings /> }}
              isActive={false}
            />
          </ListItem>
          <ListItem disablePadding>
            <NavItem 
              item={{ id: 'profile', label: 'Profile', icon: <Person /> }}
              isActive={false}
            />
          </ListItem>
          <ListItem disablePadding>
            <NavItem 
              item={{ id: 'settings', label: 'Settings', icon: <Settings /> }}
              isActive={false}
            />
          </ListItem>
        </List>

        {/* User Profile */}
        <Box sx={{ 
          mx: 1.5, 
          mt: 1,
          p: 1,
          borderRadius: 1.5,
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.caramelEssence}, ${colors.sapphireDust})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              fontWeight: 600
            }}
          >
            {user?.name?.charAt(0) || 'J'}
          </Box>
          <Typography sx={{ 
            fontSize: '14px', 
            fontWeight: 500,
            color: colors.textPrimary,
            flex: 1
          }}>
            {user?.name || 'Janice Karen'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NotionStyleSidebar;