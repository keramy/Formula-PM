import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Badge,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Search20Regular as SearchIcon,
  Filter20Regular as FilterIcon,
  ArrowDownload20Regular as ExportIcon,
  Add20Regular as AddIcon,
  MoreHorizontal20Regular as MoreIcon,
  Person20Regular as PersonIcon,
  Settings20Regular as SettingsIcon,
  SignOut20Regular as LogoutIcon,
  WeatherSunny20Regular as LightModeIcon,
  WeatherMoon20Regular as DarkModeIcon,
  Share20Regular as ShareIcon,
  Print20Regular as PrintIcon,
  Info20Regular as InfoIcon
} from '@fluentui/react-icons';
import { useTheme as useFormulaTheme } from '../../context/ThemeContext';
import UnifiedSearch from './UnifiedSearch';
import FormulaLogo, { FormulaLogoCompact } from '../branding/FormulaLogo';

/**
 * MasterHeader - Unified header component with standardized button placement
 * Button pattern: [Search] [Filters] [Export] [Add] [More] [User]
 */
const MasterHeader = ({
  // Core props
  title,
  subtitle,
  breadcrumbs = [],
  
  // Search props
  searchEnabled = true,
  searchPlaceholder = "Search...",
  onSearch,
  searchValue = '',
  onSearchChange,
  
  // Filter props
  filterEnabled = true,
  activeFiltersCount = 0,
  onFilterToggle,
  
  // Export props
  exportEnabled = true,
  onExport,
  exportOptions = [],
  
  // Add button props
  addEnabled = true,
  addLabel = "Add New",
  onAdd,
  addOptions = [], // For dropdown add button
  
  // More menu props
  moreActions = [],
  
  // User props
  user = { name: 'User', avatar: null, role: 'User' },
  onUserAction,
  
  // Logo props
  showLogo = true,
  logoSize = 'small',
  
  // Style props
  variant = 'default', // default, compact, minimal
  sx = {}
}) => {
  const theme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useFormulaTheme();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);

  // Menu handlers
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  
  const handleMoreMenuOpen = (event) => setMoreMenuAnchor(event.currentTarget);
  const handleMoreMenuClose = () => setMoreMenuAnchor(null);
  
  const handleAddMenuOpen = (event) => setAddMenuAnchor(event.currentTarget);
  const handleAddMenuClose = () => setAddMenuAnchor(null);
  
  const handleExportMenuOpen = (event) => setExportMenuAnchor(event.currentTarget);
  const handleExportMenuClose = () => setExportMenuAnchor(null);

  // User menu actions
  const handleUserMenuAction = (action) => {
    handleUserMenuClose();
    if (action === 'theme') {
      toggleTheme();
    } else if (onUserAction) {
      onUserAction(action);
    }
  };

  // Export handler
  const handleExport = useCallback((format) => {
    handleExportMenuClose();
    if (onExport) {
      onExport(format);
    }
  }, [onExport]);

  // Add handler
  const handleAdd = useCallback((type) => {
    handleAddMenuClose();
    if (onAdd) {
      onAdd(type);
    }
  }, [onAdd]);

  // Palettes based on theme
  const colors = {
    background: theme.palette.background.paper,
    border: theme.palette.divider,
    text: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    primary: theme.palette.primary.main
  };

  // Variant styles
  const variantStyles = {
    default: {
      minHeight: 80,
      px: 4,
      py: 2
    },
    compact: {
      minHeight: 64,
      px: 3,
      py: 1.5
    },
    minimal: {
      minHeight: 56,
      px: 2,
      py: 1
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        borderBottom: `1px solid ${colors.border}`,
        ...variantStyles[variant],
        ...sx
      }}
    >
      {/* Top Row - Logo and User Controls */}
      {showLogo && variant !== 'minimal' && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormulaLogo 
            size={logoSize}
            darkMode={isDarkMode}
            onClick={() => window.location.href = '/'}
            sx={{ cursor: 'pointer' }}
          />
          
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Typography variant="caption" color="textSecondary">/</Typography>}
                  <Typography
                    variant="caption"
                    sx={{
                      color: index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary',
                      cursor: crumb.href ? 'pointer' : 'default',
                      '&:hover': crumb.href ? { textDecoration: 'underline' } : {}
                    }}
                    onClick={() => crumb.href && window.location.assign(crumb.href)}
                  >
                    {crumb.label}
                  </Typography>
                </React.Fragment>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Main Row - Title and Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        {/* Title Section */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant={variant === 'minimal' ? 'h6' : 'h5'}
            sx={{
              fontWeight: 600,
              color: colors.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </Typography>
          {subtitle && variant !== 'minimal' && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Action Buttons - Standardized Order */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search */}
          {searchEnabled && (
            <UnifiedSearch
              value={searchValue}
              onChange={onSearchChange}
              onSearch={onSearch}
              placeholder={searchPlaceholder}
              sx={{ width: 300 }}
            />
          )}

          {/* Filters */}
          {filterEnabled && (
            <Tooltip title="Toggle filters">
              <Badge badgeContent={activeFiltersCount} color="primary">
                <IconButton
                  onClick={onFilterToggle}
                  sx={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: 1,
                    color: activeFiltersCount > 0 ? colors.primary : colors.textSecondary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      borderPalette: colors.primary
                    }
                  }}
                >
                  <FilterIcon />
                </IconButton>
              </Badge>
            </Tooltip>
          )}

          {/* Export */}
          {exportEnabled && (
            exportOptions.length > 0 ? (
              <>
                <Tooltip title="Export options">
                  <IconButton
                    onClick={handleExportMenuOpen}
                    sx={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: 1,
                      color: colors.textSecondary,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        borderPalette: colors.primary
                      }
                    }}
                  >
                    <ExportIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={exportMenuAnchor}
                  open={Boolean(exportMenuAnchor)}
                  onClose={handleExportMenuClose}
                >
                  {exportOptions.map((option) => (
                    <MenuItem
                      key={option.format}
                      onClick={() => handleExport(option.format)}
                    >
                      {option.icon && <Box sx={{ mr: 2, display: 'flex' }}>{option.icon}</Box>}
                      {option.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Tooltip title="Export">
                <IconButton
                  onClick={() => onExport && onExport()}
                  sx={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: 1,
                    color: colors.textSecondary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      borderPalette: colors.primary
                    }
                  }}
                >
                  <ExportIcon />
                </IconButton>
              </Tooltip>
            )
          )}

          {/* Add */}
          {addEnabled && (
            addOptions.length > 0 ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddMenuOpen}
                  endIcon={<MoreIcon style={{ fontSize: 16 }} />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 1,
                    px: 2
                  }}
                >
                  {addLabel}
                </Button>
                <Menu
                  anchorEl={addMenuAnchor}
                  open={Boolean(addMenuAnchor)}
                  onClose={handleAddMenuClose}
                >
                  {addOptions.map((option) => (
                    <MenuItem
                      key={option.type}
                      onClick={() => handleAdd(option.type)}
                    >
                      {option.icon && <Box sx={{ mr: 2, display: 'flex' }}>{option.icon}</Box>}
                      {option.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => onAdd && onAdd()}
                sx={{
                  textTransform: 'none',
                  borderRadius: 1,
                  px: 2
                }}
              >
                {addLabel}
              </Button>
            )
          )}

          {/* More Actions */}
          {moreActions.length > 0 && (
            <>
              <Tooltip title="More actions">
                <IconButton
                  onClick={handleMoreMenuOpen}
                  sx={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: 1,
                    color: colors.textSecondary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      borderPalette: colors.primary
                    }
                  }}
                >
                  <MoreIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={moreMenuAnchor}
                open={Boolean(moreMenuAnchor)}
                onClose={handleMoreMenuClose}
              >
                {moreActions.map((action, index) => (
                  <React.Fragment key={action.key || index}>
                    {action.divider && <Divider />}
                    <MenuItem
                      onClick={() => {
                        handleMoreMenuClose();
                        action.onClick();
                      }}
                      disabled={action.disabled}
                    >
                      {action.icon && <Box sx={{ mr: 2, display: 'flex' }}>{action.icon}</Box>}
                      {action.label}
                    </MenuItem>
                  </React.Fragment>
                ))}
              </Menu>
            </>
          )}

          {/* Divider before user */}
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* User Avatar & Menu */}
          <Tooltip title={user.name}>
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: colors.primary,
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user.role}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => handleUserMenuAction('profile')}>
              <PersonIcon style={{ marginRight: 16 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleUserMenuAction('settings')}>
              <SettingsIcon style={{ marginRight: 16 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={() => handleUserMenuAction('theme')}>
              {isDarkMode ? <LightModeIcon style={{ marginRight: 16 }} /> : <DarkModeIcon style={{ marginRight: 16 }} />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleUserMenuAction('logout')}>
              <LogoutIcon style={{ marginRight: 16, color: theme.palette.error.main }} />
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default MasterHeader;