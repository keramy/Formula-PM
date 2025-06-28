import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  Stack,
  LinearProgress,
  Menu,
  ListItemIcon,
  FormGroup,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Bell as BellIcon,
  Megaphone as AnnouncementIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Star as StarIcon,
  StarDashed as StarOutlineIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Circle as CircleIcon,
  Flag as FlagIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Attachment as AttachIcon,
  Send as SendIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  Tag as TagIcon,
  Group as GroupIcon,
  Building as ProjectIcon,
  Computer as SystemIcon,
  PinAlt as PinIcon,
  Timeline as TimelineIcon,
  MessageSquare as CommentIcon,
  MoreVert as MoreIcon,
  CheckCircle as ReadIcon,
  Email as EmailIcon,
  Smartphone as PhoneIcon,
  Desktop as DesktopIcon,
  Globe as GlobalIcon,
  Archive as ArchiveIcon,
  Book as BookIcon,
  Lightning as LightningIcon,
  WarningTriangle as WarningTriangleIcon
} from 'iconoir-react';
import { format, formatDistanceToNow, isToday, isYesterday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import apiService from '../services/api/apiService';

// Priority levels with colors and icons
const PRIORITY_LEVELS = {
  critical: { label: 'Critical', color: 'error', icon: WarningTriangleIcon },
  important: { label: 'Important', color: 'warning', icon: FlagIcon },
  normal: { label: 'Normal', color: 'primary', icon: CircleIcon },
  info: { label: 'Info', color: 'info', icon: BellIcon }
};

// Update categories
const UPDATE_CATEGORIES = {
  feature: { label: 'New Feature', color: '#6366F1' },
  improvement: { label: 'Improvement', color: '#10B981' },
  bugfix: { label: 'Bug Fix', color: '#EF4444' },
  announcement: { label: 'Announcement', color: '#E3AF64' },
  maintenance: { label: 'Maintenance', color: '#6B7280' },
  security: { label: 'Security', color: '#DC2626' },
  performance: { label: 'Performance', color: '#059669' },
  documentation: { label: 'Documentation', color: '#3B82F6' }
};

// Mock data for development
const mockUpdates = [
  {
    id: 'update-1',
    type: 'project',
    title: 'New Telemetry Analysis Dashboard Released',
    content: 'We\'ve launched a new real-time telemetry analysis dashboard that provides deeper insights into race performance. The dashboard includes live data visualization, predictive analytics, and customizable widgets.',
    priority: 'important',
    category: 'feature',
    project: { id: 'proj-1', name: 'Formula Engine', color: '#516AC8' },
    author: { id: 'user-1', name: 'Sarah Chen', role: 'Product Manager', avatar: null },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    starred: true,
    pinned: true,
    attachments: [
      { name: 'dashboard-overview.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'feature-guide.docx', size: '156 KB', type: 'doc' }
    ],
    reactions: {
      '👍': 12,
      '🎉': 8,
      '❤️': 5
    },
    comments: 3,
    tags: ['telemetry', 'dashboard', 'analytics']
  },
  {
    id: 'update-2',
    type: 'system',
    title: 'Scheduled Maintenance Window',
    content: 'System maintenance is scheduled for Saturday, 2 AM - 4 AM EST. During this time, the platform may experience brief interruptions. We\'re upgrading our infrastructure to improve performance and reliability.',
    priority: 'critical',
    category: 'maintenance',
    author: { id: 'system', name: 'System Admin', role: 'System', avatar: null },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    starred: false,
    pinned: false,
    systemWide: true,
    scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000),
    affectedTeams: ['all']
  },
  {
    id: 'update-3',
    type: 'team',
    title: 'Welcome Emma Wilson to the Engineering Team!',
    content: 'Please join us in welcoming Emma Wilson as our new Senior Frontend Engineer. Emma brings 8 years of experience in building high-performance web applications and will be focusing on our simulation interface improvements.',
    priority: 'normal',
    category: 'announcement',
    team: { id: 'team-1', name: 'Engineering' },
    author: { id: 'user-2', name: 'Michael Torres', role: 'Engineering Manager', avatar: null },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    starred: false,
    pinned: false,
    reactions: {
      '👋': 15,
      '🎉': 20,
      '👏': 18
    },
    comments: 12
  },
  {
    id: 'update-4',
    type: 'project',
    title: 'Performance Improvements in Aerodynamics Module',
    content: 'We\'ve optimized the aerodynamics calculation engine, resulting in 40% faster processing times. This improvement allows for more complex simulations without impacting system performance.',
    priority: 'normal',
    category: 'performance',
    project: { id: 'proj-2', name: 'Simulation Core', color: '#E3AF64' },
    author: { id: 'user-3', name: 'Alex Kim', role: 'Tech Lead', avatar: null },
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
    read: false,
    starred: false,
    pinned: false,
    metrics: {
      before: '2.4s average',
      after: '1.44s average',
      improvement: '40%'
    },
    tags: ['performance', 'aerodynamics', 'optimization']
  }
];

// Notification preferences
const defaultNotificationPreferences = {
  critical: { email: true, inApp: true, push: true },
  important: { email: true, inApp: true, push: false },
  normal: { email: false, inApp: true, push: false },
  info: { email: false, inApp: true, push: false }
};

const UpdatesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [updates, setUpdates] = useState(mockUpdates);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [composeOpen, setComposeOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState(defaultNotificationPreferences);
  const [loading, setLoading] = useState(false);
  const [selectedUpdates, setSelectedUpdates] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedUpdates, setExpandedUpdates] = useState([]);

  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (isToday(timestamp)) {
      return `Today at ${format(timestamp, 'h:mm a')}`;
    } else if (isYesterday(timestamp)) {
      return `Yesterday at ${format(timestamp, 'h:mm a')}`;
    } else {
      return format(timestamp, 'MMM d, yyyy h:mm a');
    }
  };

  // Get relative time
  const getRelativeTime = (timestamp) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  // Filter updates based on tab
  const getTabUpdates = useCallback((updatesList) => {
    switch (activeTab) {
      case 'all':
        return updatesList;
      case 'project':
        return updatesList.filter(u => u.type === 'project');
      case 'system':
        return updatesList.filter(u => u.type === 'system');
      case 'team':
        return updatesList.filter(u => u.type === 'team');
      default:
        return updatesList;
    }
  }, [activeTab]);

  // Apply all filters
  const filteredUpdates = useMemo(() => {
    let filtered = getTabUpdates(updates);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(update => 
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(update => update.priority === filterPriority);
    }

    // Project filter
    if (filterProject !== 'all') {
      filtered = filtered.filter(update => update.project?.id === filterProject);
    }

    // Unread filter
    if (showUnreadOnly) {
      filtered = filtered.filter(update => !update.read);
    }

    // Date range filter
    if (filterDateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(update => {
        const updateDate = new Date(update.timestamp);
        switch (filterDateRange) {
          case 'today':
            return isToday(updateDate);
          case 'week':
            return isWithinInterval(updateDate, {
              start: startOfWeek(now),
              end: endOfWeek(now)
            });
          case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return updateDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Sort by pinned first, then by timestamp
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.timestamp - a.timestamp;
    });
  }, [updates, searchTerm, filterPriority, filterProject, showUnreadOnly, filterDateRange, getTabUpdates]);

  // Get unread counts
  const unreadCounts = useMemo(() => {
    return {
      all: updates.filter(u => !u.read).length,
      project: updates.filter(u => u.type === 'project' && !u.read).length,
      system: updates.filter(u => u.type === 'system' && !u.read).length,
      team: updates.filter(u => u.type === 'team' && !u.read).length
    };
  }, [updates]);

  // Mark as read
  const markAsRead = useCallback((updateId) => {
    setUpdates(prev => prev.map(update => 
      update.id === updateId ? { ...update, read: true } : update
    ));
  }, []);

  // Toggle star
  const toggleStar = useCallback((updateId) => {
    setUpdates(prev => prev.map(update => 
      update.id === updateId ? { ...update, starred: !update.starred } : update
    ));
  }, []);

  // Toggle pin
  const togglePin = useCallback((updateId) => {
    setUpdates(prev => prev.map(update => 
      update.id === updateId ? { ...update, pinned: !update.pinned } : update
    ));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setUpdates(prev => prev.map(update => ({ ...update, read: true })));
    showSuccess('All updates marked as read');
  }, [showSuccess]);

  // Archive update
  const archiveUpdate = useCallback((updateId) => {
    setUpdates(prev => prev.filter(update => update.id !== updateId));
    setSelectedUpdate(null);
    showSuccess('Update archived');
  }, [showSuccess]);

  // Handle attachment download
  const handleAttachmentDownload = useCallback((attachment, updateTitle) => {
    try {
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = attachment.url || `#download-${attachment.name}`;
      link.download = attachment.name;
      link.target = '_blank';
      
      // Simulate file download (in real app, this would be actual file URL)
      if (!attachment.url) {
        showError('File URL not available. Please contact support.');
        return;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess(`Downloading ${attachment.name}`);
    } catch (error) {
      console.error('Download failed:', error);
      showError('Failed to download attachment. Please try again.');
    }
  }, [showSuccess, showError]);

  // Handle reaction to update
  const handleReaction = useCallback((updateId, emoji) => {
    setUpdates(prev => prev.map(update => {
      if (update.id === updateId) {
        const reactions = { ...update.reactions };
        if (reactions[emoji]) {
          reactions[emoji] += 1;
        } else {
          reactions[emoji] = 1;
        }
        return { ...update, reactions };
      }
      return update;
    }));
    showSuccess('Reaction added');
  }, [showSuccess]);

  // Share update functionality
  const shareUpdate = useCallback((updateId) => {
    const update = updates.find(u => u.id === updateId);
    if (!update) return;
    
    const shareUrl = `${window.location.origin}/updates/${updateId}`;
    
    if (navigator.share) {
      navigator.share({
        title: update.title,
        text: update.content.substring(0, 100) + '...',
        url: shareUrl
      }).then(() => {
        showSuccess('Update shared successfully');
      }).catch(() => {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  }, [updates, showSuccess]);

  // Copy to clipboard helper
  const copyToClipboard = useCallback((text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showSuccess('Link copied to clipboard');
      }).catch(() => {
        showError('Failed to copy link');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showSuccess('Link copied to clipboard');
      } catch (err) {
        showError('Failed to copy link');
      }
      document.body.removeChild(textArea);
    }
  }, [showSuccess, showError]);

  // Mute notifications for update
  const muteUpdate = useCallback((updateId) => {
    // In a real app, this would update user preferences
    showSuccess('Notifications muted for this update');
    setAnchorEl(null);
  }, [showSuccess]);

  // Toggle update expansion
  const toggleExpanded = useCallback((updateId) => {
    setExpandedUpdates(prev => 
      prev.includes(updateId) 
        ? prev.filter(id => id !== updateId)
        : [...prev, updateId]
    );
  }, []);

  // Bulk actions menu
  const handleBulkAction = (action) => {
    switch (action) {
      case 'read':
        setUpdates(prev => prev.map(update => 
          selectedUpdates.includes(update.id) ? { ...update, read: true } : update
        ));
        showSuccess(`${selectedUpdates.length} updates marked as read`);
        break;
      case 'archive':
        setUpdates(prev => prev.filter(update => !selectedUpdates.includes(update.id)));
        showSuccess(`${selectedUpdates.length} updates archived`);
        break;
      case 'star':
        setUpdates(prev => prev.map(update => 
          selectedUpdates.includes(update.id) ? { ...update, starred: true } : update
        ));
        showSuccess(`${selectedUpdates.length} updates starred`);
        break;
    }
    setSelectedUpdates([]);
    setAnchorEl(null);
  };

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Search updates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={{ width: 200, mr: 1 }}
      />
      <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={filterPriority}
          label="Priority"
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <MenuItem value="all">All Priorities</MenuItem>
          {Object.entries(PRIORITY_LEVELS).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {React.createElement(value.icon, { style: { fontSize: 16 } })}
                {value.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
        <InputLabel>Date Range</InputLabel>
        <Select
          value={filterDateRange}
          label="Date Range"
          onChange={(e) => setFilterDateRange(e.target.value)}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </Select>
      </FormControl>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e, newMode) => newMode && setViewMode(newMode)}
        size="small"
        sx={{ mr: 1 }}
      >
        <ToggleButton value="list">
          <Tooltip title="List View">
            <Box component="span">
              <BellIcon style={{ fontSize: 18 }} />
            </Box>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="timeline">
          <Tooltip title="Timeline View">
            <Box component="span">
              <TimelineIcon style={{ fontSize: 18 }} />
            </Box>
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
      <FormControlLabel
        control={
          <Switch
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
            size="small"
          />
        }
        label="Unread only"
        sx={{ mr: 2 }}
      />
      <IconButton size="small" onClick={() => setPreferencesOpen(true)}>
        <SettingsIcon style={{ fontSize: 18 }} />
      </IconButton>
      <IconButton size="small" onClick={() => window.location.reload()}>
        <RefreshIcon style={{ fontSize: 18 }} />
      </IconButton>
      {user?.role === 'manager' && (
        <Button
          className="clean-button-primary"
          startIcon={<EditIcon style={{ fontSize: 16 }} />}
          onClick={() => setComposeOpen(true)}
          size="small"
        >
          New Update
        </Button>
      )}
    </Box>
  );

  const tabs = (
    <>
      <CleanTab 
        label="All Updates" 
        isActive={activeTab === 'all'}
        onClick={() => setActiveTab('all')}
        icon={<BellIcon style={{ fontSize: 16 }} />}
        badge={unreadCounts.all > 0 ? unreadCounts.all : null}
      />
      <CleanTab 
        label="Project Updates" 
        isActive={activeTab === 'project'}
        onClick={() => setActiveTab('project')}
        icon={<ProjectIcon style={{ fontSize: 16 }} />}
        badge={unreadCounts.project > 0 ? unreadCounts.project : null}
      />
      <CleanTab 
        label="System Announcements" 
        isActive={activeTab === 'system'}
        onClick={() => setActiveTab('system')}
        icon={<SystemIcon style={{ fontSize: 16 }} />}
        badge={unreadCounts.system > 0 ? unreadCounts.system : null}
      />
      <CleanTab 
        label="Team News" 
        isActive={activeTab === 'team'}
        onClick={() => setActiveTab('team')}
        icon={<GroupIcon style={{ fontSize: 16 }} />}
        badge={unreadCounts.team > 0 ? unreadCounts.team : null}
      />
    </>
  );

  const renderUpdateCard = (update) => (
    <Card 
      key={update.id}
      className="clean-card" 
      sx={{ 
        mb: 2,
        border: update.pinned ? '2px solid' : '1px solid',
        borderColor: update.pinned ? 'primary.main' : '#E5E7EB',
        backgroundColor: !update.read ? '#F9FAFB' : 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        {/* Update Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {update.pinned && (
                <Tooltip title="Pinned">
                  <PinIcon style={{ fontSize: 16, color: '#6366F1' }} />
                </Tooltip>
              )}
              <Chip
                label={PRIORITY_LEVELS[update.priority].label}
                size="small"
                color={PRIORITY_LEVELS[update.priority].color}
                icon={React.createElement(PRIORITY_LEVELS[update.priority].icon, { style: { fontSize: 14 } })}
              />
              <Chip
                label={UPDATE_CATEGORIES[update.category].label}
                size="small"
                sx={{ 
                  backgroundColor: UPDATE_CATEGORIES[update.category].color + '20',
                  color: UPDATE_CATEGORIES[update.category].color,
                  fontWeight: 500
                }}
              />
              {update.type === 'project' && update.project && (
                <Chip
                  label={update.project.name}
                  size="small"
                  sx={{ backgroundColor: update.project.color + '20', color: update.project.color }}
                />
              )}
              {update.type === 'team' && update.team && (
                <Chip
                  label={update.team.name}
                  size="small"
                  icon={<GroupIcon style={{ fontSize: 14 }} />}
                />
              )}
              {update.systemWide && (
                <Chip
                  label="System-wide"
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: 18,
                fontWeight: !update.read ? 600 : 500,
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
              onClick={() => {
                toggleExpanded(update.id);
                if (!update.read) markAsRead(update.id);
              }}
            >
              {update.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                  {update.author.name.charAt(0)}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {update.author.name} • {update.author.role}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {getRelativeTime(update.timestamp)}
              </Typography>
              {update.scheduledFor && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon style={{ fontSize: 14, color: '#6B7280' }} />
                  <Typography variant="body2" color="text.secondary">
                    Scheduled: {format(update.scheduledFor, 'MMM d, h:mm a')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => toggleStar(update.id)}
            >
              {update.starred ? 
                <StarIcon style={{ fontSize: 18, color: '#E3AF64' }} /> :
                <StarOutlineIcon style={{ fontSize: 18 }} />
              }
            </IconButton>
            {user?.role === 'manager' && (
              <IconButton
                size="small"
                onClick={() => togglePin(update.id)}
              >
                <PinIcon style={{ fontSize: 18, color: update.pinned ? '#6366F1' : '#6B7280' }} />
              </IconButton>
            )}
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreIcon style={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Update Content */}
        <Collapse in={expandedUpdates.includes(update.id)} timeout="auto">
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              {update.content}
            </Typography>

            {/* Metrics for performance updates */}
            {update.metrics && (
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#F3F4F6' }}>
                <Typography variant="subtitle2" gutterBottom>Performance Metrics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Before</Typography>
                    <Typography variant="body2" fontWeight={600}>{update.metrics.before}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">After</Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {update.metrics.after}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Improvement</Typography>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {update.metrics.improvement}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Attachments */}
            {update.attachments && update.attachments.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Attachments</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {update.attachments.map((attachment, index) => (
                    <Chip
                      key={index}
                      icon={<AttachIcon style={{ fontSize: 16 }} />}
                      label={`${attachment.name} (${attachment.size})`}
                      variant="outlined"
                      onClick={() => handleAttachmentDownload(attachment, update.title)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Tags */}
            {update.tags && update.tags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {update.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={`#${tag}`}
                      size="small"
                      sx={{ 
                        backgroundColor: '#E5E7EB',
                        fontSize: 12,
                        height: 24
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Reactions and Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {update.reactions && Object.entries(update.reactions).map(([emoji, count]) => (
                  <Chip
                    key={emoji}
                    label={`${emoji} ${count}`}
                    size="small"
                    variant="outlined"
                    onClick={() => handleReaction(update.id, emoji)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {update.comments && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CommentIcon style={{ fontSize: 16, color: '#6B7280' }} />
                    <Typography variant="body2" color="text.secondary">
                      {update.comments} comments
                    </Typography>
                  </Box>
                )}
                <Button size="small" startIcon={<CommentIcon style={{ fontSize: 14 }} />}>
                  Comment
                </Button>
              </Box>
            </Box>
          </Box>
        </Collapse>

        {/* Collapsed View Summary */}
        {!expandedUpdates.includes(update.id) && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {update.content}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const renderTimelineView = () => {
    // Group updates by date
    const groupedUpdates = filteredUpdates.reduce((groups, update) => {
      const date = format(update.timestamp, 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(update);
      return groups;
    }, {});

    return (
      <Box sx={{ position: 'relative' }}>
        {/* Timeline line */}
        <Box sx={{
          position: 'absolute',
          left: 32,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: '#E5E7EB'
        }} />

        {Object.entries(groupedUpdates).map(([date, dateUpdates]) => (
          <Box key={date} sx={{ mb: 4 }}>
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                ml: 8,
                fontWeight: 600
              }}
            >
              {isToday(new Date(date)) ? 'Today' : 
               isYesterday(new Date(date)) ? 'Yesterday' : 
               format(new Date(date), 'MMMM d, yyyy')}
            </Typography>
            {dateUpdates.map((update, index) => (
              <Box key={update.id} sx={{ display: 'flex', mb: 3 }}>
                {/* Timeline node */}
                <Box sx={{ 
                  width: 64, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0
                }}>
                  <Box sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: !update.read ? 'primary.main' : '#9CA3AF',
                    zIndex: 1,
                    mt: 1
                  }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {format(update.timestamp, 'h:mm a')}
                  </Typography>
                </Box>
                {/* Update content */}
                <Box sx={{ flex: 1 }}>
                  {renderUpdateCard(update)}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <CleanPageLayout
      title="Updates & Notifications"
      subtitle="Stay informed about project changes, system announcements, and team activities"
      breadcrumbs={[
        { label: 'Workspace', href: '/workspace' },
        { label: 'Updates', href: '/updates' }
      ]}
      headerActions={headerActions}
      tabs={tabs}
    >
      <Box className="clean-fade-in">
        {/* Status Bar */}
        {unreadCounts.all > 0 && (
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            action={
              <Button 
                size="small" 
                onClick={markAllAsRead}
              >
                Mark All Read
              </Button>
            }
          >
            You have {unreadCounts.all} unread {unreadCounts.all === 1 ? 'update' : 'updates'}
          </Alert>
        )}

        {/* Bulk Actions */}
        {selectedUpdates.length > 0 && (
          <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {selectedUpdates.length} {selectedUpdates.length === 1 ? 'update' : 'updates'} selected
            </Typography>
            <Button
              size="small"
              startIcon={<ReadIcon style={{ fontSize: 16 }} />}
              onClick={() => handleBulkAction('read')}
            >
              Mark as Read
            </Button>
            <Button
              size="small"
              startIcon={<StarIcon style={{ fontSize: 16 }} />}
              onClick={() => handleBulkAction('star')}
            >
              Star
            </Button>
            <Button
              size="small"
              startIcon={<ArchiveIcon style={{ fontSize: 16 }} />}
              onClick={() => handleBulkAction('archive')}
            >
              Archive
            </Button>
            <Button
              size="small"
              onClick={() => setSelectedUpdates([])}
            >
              Cancel
            </Button>
          </Paper>
        )}

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredUpdates.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <BellIcon style={{ fontSize: 64, color: '#9CA3AF', marginBottom: 16 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No updates found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || filterPriority !== 'all' || showUnreadOnly
                ? 'Try adjusting your filters'
                : 'Check back later for new updates'}
            </Typography>
          </Paper>
        ) : viewMode === 'list' ? (
          <Box>
            {filteredUpdates.map(update => renderUpdateCard(update))}
          </Box>
        ) : (
          renderTimelineView()
        )}
      </Box>

      {/* Compose Update Dialog */}
      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Update</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Update Title"
              variant="outlined"
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select defaultValue="project" label="Type">
                    <MenuItem value="project">Project Update</MenuItem>
                    <MenuItem value="system">System Announcement</MenuItem>
                    <MenuItem value="team">Team News</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select defaultValue="normal" label="Priority">
                    {Object.entries(PRIORITY_LEVELS).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {React.createElement(value.icon, { style: { fontSize: 16 } })}
                          {value.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select defaultValue="announcement" label="Category">
                    {Object.entries(UPDATE_CATEGORIES).map(([key, value]) => (
                      <MenuItem key={key} value={key}>{value.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Autocomplete
              options={['Formula Engine', 'Simulation Core', 'Analytics Platform']}
              renderInput={(params) => <TextField {...params} label="Related Project (Optional)" />}
            />
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Update Content"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Tags (comma separated)"
              variant="outlined"
              placeholder="e.g. feature, performance, dashboard"
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small">
                <AttachIcon style={{ fontSize: 18 }} />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                Attach files (optional)
              </Typography>
            </Box>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send email notifications to subscribed users"
            />
            <FormControlLabel
              control={<Switch />}
              label="Pin this update"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeOpen(false)}>Cancel</Button>
          <Button variant="outlined">Save as Draft</Button>
          <Button variant="contained" onClick={() => {
            setComposeOpen(false);
            showSuccess('Update published successfully');
          }}>
            Publish Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Preferences Dialog */}
      <Dialog open={preferencesOpen} onClose={() => setPreferencesOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon style={{ fontSize: 20 }} />
            Notification Preferences
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Choose how you want to receive updates:
            </Typography>
            <Box sx={{ mt: 2 }}>
              {Object.entries(PRIORITY_LEVELS).map(([priority, config]) => (
                <Box key={priority} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {React.createElement(config.icon, { style: { fontSize: 18 } })}
                    <Typography variant="subtitle2">{config.label} Updates</Typography>
                  </Box>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={notificationPreferences[priority]?.email}
                          onChange={(e) => setNotificationPreferences(prev => ({
                            ...prev,
                            [priority]: { ...prev[priority], email: e.target.checked }
                          }))}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon style={{ fontSize: 16 }} />
                          Email
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={notificationPreferences[priority]?.inApp}
                          onChange={(e) => setNotificationPreferences(prev => ({
                            ...prev,
                            [priority]: { ...prev[priority], inApp: e.target.checked }
                          }))}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DesktopIcon style={{ fontSize: 16 }} />
                          In-App
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={notificationPreferences[priority]?.push}
                          onChange={(e) => setNotificationPreferences(prev => ({
                            ...prev,
                            [priority]: { ...prev[priority], push: e.target.checked }
                          }))}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon style={{ fontSize: 16 }} />
                          Push
                        </Box>
                      }
                    />
                  </FormGroup>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Update Subscriptions
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Project updates I'm involved in"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="System-wide announcements"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Team news and announcements"
              />
              <FormControlLabel
                control={<Switch />}
                label="Weekly digest email"
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreferencesOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            setPreferencesOpen(false);
            showSuccess('Preferences saved');
          }}>
            Save Preferences
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          if (selectedUpdate && !selectedUpdate.read) {
            markAsRead(selectedUpdate.id);
          }
          setAnchorEl(null);
        }}>
          <ListItemIcon>
            <ReadIcon style={{ fontSize: 18 }} />
          </ListItemIcon>
          Mark as Read
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedUpdate) {
            archiveUpdate(selectedUpdate.id);
          }
          setAnchorEl(null);
        }}>
          <ListItemIcon>
            <ArchiveIcon style={{ fontSize: 18 }} />
          </ListItemIcon>
          Archive
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedUpdate) {
            shareUpdate(selectedUpdate.id);
          }
          setAnchorEl(null);
        }}>
          <ListItemIcon>
            <SendIcon style={{ fontSize: 18 }} />
          </ListItemIcon>
          Share Update
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          if (selectedUpdate) {
            muteUpdate(selectedUpdate.id);
          }
        }}>
          <ListItemIcon>
            <EyeOffIcon style={{ fontSize: 18 }} />
          </ListItemIcon>
          Mute Notifications
        </MenuItem>
      </Menu>
    </CleanPageLayout>
  );
};

export default UpdatesPage;