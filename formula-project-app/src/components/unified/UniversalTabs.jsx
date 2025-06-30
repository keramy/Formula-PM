import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import {
  MoreHorizontal20Regular as MoreIcon,
  ChevronDown20Regular as ChevronDownIcon,
  Settings20Regular as SettingsIcon,
  Pin20Regular as PinIcon,
  Eye20Regular as ShowIcon,
  EyeOff20Regular as HideIcon
} from '@fluentui/react-icons';

/**
 * UniversalTabs - Standardized tab component supporting multiple variants
 * Variants: standard, enhanced, pills
 * Features: Icons, badges, counts, disabled states, overflow handling
 */
const UniversalTabs = ({
  // Core props
  value,
  onChange,
  tabs = [],
  
  // Variant and styling
  variant = 'standard', // standard, enhanced, pills
  orientation = 'horizontal', // horizontal, vertical
  size = 'medium', // small, medium, large
  fullWidth = false,
  centered = false,
  
  // Features
  showIcons = true,
  showCounts = true,
  showBadges = true,
  scrollable = true,
  allowTabCustomization = false,
  
  // Actions
  onTabCustomize,
  tabActions = [], // Actions for the more menu
  
  // Style props
  sx = {},
  tabsSx = {},
  tabSx = {}
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTabForMenu, setSelectedTabForMenu] = useState(null);
  const [pinnedTabs, setPinnedTabs] = useState([]);
  const [hiddenTabs, setHiddenTabs] = useState([]);

  // Handle menu open
  const handleMenuOpen = (event, tab) => {
    setAnchorEl(event.currentTarget);
    setSelectedTabForMenu(tab);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTabForMenu(null);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    if (onChange) {
      onChange(event, newValue);
    }
  };

  // Handle pin/unpin tab
  const handlePinTab = (tabId) => {
    setPinnedTabs(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
    handleMenuClose();
  };

  // Handle hide/show tab
  const handleHideTab = (tabId) => {
    setHiddenTabs(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
    handleMenuClose();
  };

  // Sort tabs by pinned status
  const sortedTabs = [...tabs].sort((a, b) => {
    const aPinned = pinnedTabs.includes(a.id);
    const bPinned = pinnedTabs.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  // Filter out hidden tabs
  const visibleTabs = sortedTabs.filter(tab => !hiddenTabs.includes(tab.id));

  // Variant styles
  const variantStyles = {
    standard: {
      tabs: {
        '& .MuiTabs-indicator': {
          height: 3,
          borderRadius: '3px 3px 0 0'
        }
      },
      tab: {
        textTransform: 'none',
        fontWeight: 500,
        minHeight: 48,
        '&.Mui-selected': {
          fontWeight: 600
        }
      }
    },
    enhanced: {
      tabs: {
        backgroundColor: theme.palette.grey[100],
        borderRadius: 2,
        padding: 0.5,
        '& .MuiTabs-indicator': {
          height: '100%',
          borderRadius: 1.5,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 1,
          zIndex: 1
        }
      },
      tab: {
        textTransform: 'none',
        fontWeight: 500,
        minHeight: 40,
        borderRadius: 1.5,
        zIndex: 2,
        '&:hover': {
          backgroundColor: 'transparent'
        },
        '&.Mui-selected': {
          fontWeight: 600,
          color: theme.palette.text.primary
        }
      }
    },
    pills: {
      tabs: {
        '& .MuiTabs-indicator': {
          display: 'none'
        },
        '& .MuiTabs-flexContainer': {
          gap: 1
        }
      },
      tab: {
        textTransform: 'none',
        fontWeight: 500,
        minHeight: 36,
        borderRadius: 20,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          borderPalette: theme.palette.primary.light
        },
        '&.Mui-selected': {
          fontWeight: 600,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderPalette: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        }
      }
    }
  };

  // Size styles
  const sizeStyles = {
    small: {
      fontSize: '0.75rem',
      minHeight: 32,
      py: 0.5,
      px: 1.5
    },
    medium: {
      fontSize: '0.875rem',
      minHeight: 40,
      py: 1,
      px: 2
    },
    large: {
      fontSize: '1rem',
      minHeight: 48,
      py: 1.5,
      px: 3
    }
  };

  // Render tab label
  const renderTabLabel = (tab) => {
    const isPinned = pinnedTabs.includes(tab.id);
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Pin indicator */}
        {isPinned && (
          <PinIcon style={{ fontSize: 14, transform: 'rotate(45deg)' }} />
        )}
        
        {/* Icon */}
        {showIcons && tab.icon && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {tab.icon}
          </Box>
        )}
        
        {/* Label */}
        <span>{tab.label}</span>
        
        {/* Count */}
        {showCounts && tab.count !== undefined && (
          <Chip
            label={tab.count}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              backgroundColor: variant === 'pills' && value === tab.id
                ? theme.palette.primary.contrastText
                : theme.palette.action.hover,
              color: variant === 'pills' && value === tab.id
                ? theme.palette.primary.main
                : theme.palette.text.secondary
            }}
          />
        )}
        
        {/* Badge */}
        {showBadges && tab.badge && (
          <Badge
            badgeContent={tab.badge}
            color={tab.badgePalette || 'primary'}
            sx={{ ml: 1 }}
          />
        )}
        
        {/* Status indicator */}
        {tab.status && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 
                tab.status === 'success' ? theme.palette.success.main :
                tab.status === 'warning' ? theme.palette.warning.main :
                tab.status === 'error' ? theme.palette.error.main :
                theme.palette.info.main
            }}
          />
        )}
        
        {/* Dropdown indicator */}
        {tab.hasDropdown && (
          <ChevronDownIcon style={{ fontSize: 16, marginLeft: 4 }} />
        )}
        
        {/* Tab actions */}
        {(allowTabCustomization || tab.actions) && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e, tab);
            }}
            sx={{
              ml: 0.5,
              p: 0.25,
              opacity: 0,
              transition: 'opacity 0.2s',
              '.MuiTab-root:hover &': {
                opacity: 1
              }
            }}
          >
            <MoreIcon style={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <Tabs
        value={value}
        onChange={handleTabChange}
        orientation={orientation}
        variant={scrollable ? 'scrollable' : 'standard'}
        scrollButtons={scrollable ? 'auto' : false}
        centered={!scrollable && centered}
        sx={{
          flex: 1,
          ...variantStyles[variant].tabs,
          ...tabsSx
        }}
        TabIndicatorProps={{
          sx: {
            backgroundColor: theme.palette.primary.main,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }
        }}
      >
        {visibleTabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={renderTabLabel(tab)}
            disabled={tab.disabled}
            sx={{
              ...variantStyles[variant].tab,
              ...sizeStyles[size],
              opacity: tab.disabled ? 0.5 : 1,
              ...tabSx,
              ...(tab.sx || {})
            }}
            {...(tab.props || {})}
          />
        ))}
      </Tabs>

      {/* Hidden tabs indicator */}
      {hiddenTabs.length > 0 && (
        <Tooltip title={`${hiddenTabs.length} hidden tabs`}>
          <Chip
            label={`+${hiddenTabs.length}`}
            size="small"
            onClick={(e) => handleMenuOpen(e, { id: 'hidden' })}
            sx={{
              ml: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          />
        </Tooltip>
      )}

      {/* Global tab actions */}
      {tabActions.length > 0 && (
        <Tooltip title="Tab options">
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, null)}
            sx={{ ml: 1 }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* Tab menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        {selectedTabForMenu && selectedTabForMenu.id !== 'hidden' && (
          <>
            <MenuItem dense disabled>
              <Typography variant="caption" color="textSecondary">
                {selectedTabForMenu.label}
              </Typography>
            </MenuItem>
            <Divider />
            
            {allowTabCustomization && (
              <>
                <MenuItem onClick={() => handlePinTab(selectedTabForMenu.id)}>
                  <PinIcon style={{ marginRight: 12, fontSize: 20 }} />
                  {pinnedTabs.includes(selectedTabForMenu.id) ? 'Unpin' : 'Pin'} Tab
                </MenuItem>
                <MenuItem onClick={() => handleHideTab(selectedTabForMenu.id)}>
                  <EyeOff20Regular style={{ marginRight: 12, fontSize: 20 }} />
                  Hide Tab
                </MenuItem>
                <Divider />
              </>
            )}
            
            {selectedTabForMenu.actions?.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  action.onClick();
                  handleMenuClose();
                }}
                disabled={action.disabled}
              >
                {action.icon && <Box sx={{ mr: 1.5, display: 'flex' }}>{action.icon}</Box>}
                {action.label}
              </MenuItem>
            ))}
          </>
        )}
        
        {selectedTabForMenu?.id === 'hidden' && (
          <>
            <MenuItem dense disabled>
              <Typography variant="caption" color="textSecondary">
                Hidden Tabs
              </Typography>
            </MenuItem>
            <Divider />
            {tabs
              .filter(tab => hiddenTabs.includes(tab.id))
              .map(tab => (
                <MenuItem
                  key={tab.id}
                  onClick={() => handleHideTab(tab.id)}
                >
                  <ShowIcon style={{ marginRight: 12, fontSize: 20 }} />
                  Show "{tab.label}"
                </MenuItem>
              ))
            }
          </>
        )}
        
        {!selectedTabForMenu && tabActions.length > 0 && (
          <>
            {tabActions.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  action.onClick();
                  handleMenuClose();
                }}
                disabled={action.disabled}
              >
                {action.icon && <Box sx={{ mr: 1.5, display: 'flex' }}>{action.icon}</Box>}
                {action.label}
              </MenuItem>
            ))}
            {onTabCustomize && (
              <>
                <Divider />
                <MenuItem onClick={() => {
                  onTabCustomize();
                  handleMenuClose();
                }}>
                  <SettingsIcon style={{ marginRight: 12, fontSize: 20 }} />
                  Customize Tabs
                </MenuItem>
              </>
            )}
          </>
        )}
      </Menu>
    </Box>
  );
};

export default UniversalTabs;