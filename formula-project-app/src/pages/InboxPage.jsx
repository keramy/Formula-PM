import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Badge,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Autocomplete
} from '@mui/material';
import {
  Mail as MailIcon,
  Bell as BellIcon,
  ChatBubble as ChatIcon,
  Megaphone as AnnouncementIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarDashed as StarBorderIcon,
  Archive as ArchiveIcon,
  Trash as DeleteIcon,
  Forward as ForwardIcon,
  Reply as ReplyIcon,
  Upload as AttachIcon,
  ArrowRight as SendIcon,
  Filter as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Xmark as CancelIcon,
  Group as GroupIcon,
  User as PersonIcon,
  Circle as OnlineIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Settings as SettingsIcon
} from 'iconoir-react';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import apiService from '../services/api/apiService';
import logger from '../utils/logger';

// Mock data for development
const mockMessages = [
  {
    id: 'msg-1',
    type: 'direct',
    from: { id: 'user-2', name: 'Sarah Chen', avatar: null, online: true },
    to: { id: 'user-1', name: 'Current User' },
    subject: 'Project Update: Formula Engine',
    preview: 'Hey, I\'ve updated the race simulation module with the new telemetry data...',
    content: 'Hey, I\'ve updated the race simulation module with the new telemetry data processing. The performance improvements are significant - we\'re seeing 40% faster processing times. Can you review the changes before we merge?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    starred: true,
    attachments: [
      { name: 'telemetry-analysis.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'performance-metrics.xlsx', size: '156 KB', type: 'excel' }
    ],
    thread: [
      {
        id: 'reply-1',
        from: { id: 'user-1', name: 'You' },
        content: 'Great work! I\'ll review it today.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 'msg-2',
    type: 'team',
    from: { id: 'user-3', name: 'Michael Torres', avatar: null, online: false },
    channel: 'engineering',
    subject: 'Sprint Planning Meeting Tomorrow',
    preview: 'Team, reminder that we have our sprint planning meeting tomorrow at 10 AM...',
    content: 'Team, reminder that we have our sprint planning meeting tomorrow at 10 AM. Please review the backlog items and come prepared with your estimates. Focus areas: aerodynamics module refactoring and pit strategy optimizer.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    starred: false,
    reactions: [
      { emoji: '👍', users: ['Sarah Chen', 'Alex Kim'] },
      { emoji: '📅', users: ['Emma Wilson'] }
    ]
  },
  {
    id: 'msg-3',
    type: 'direct',
    from: { id: 'user-4', name: 'Emma Wilson', avatar: null, online: true },
    to: { id: 'user-1', name: 'Current User' },
    subject: 'Code Review Request',
    preview: 'Could you review my PR for the tire degradation model?',
    content: 'Could you review my PR for the tire degradation model? I\'ve implemented the new algorithm we discussed last week. All tests are passing and I\'ve added comprehensive documentation.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    starred: false
  }
];

const mockNotifications = [
  {
    id: 'notif-1',
    type: 'mention',
    title: '@sarah mentioned you in Formula Engine',
    message: 'Can you check the latest telemetry integration?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    actionUrl: '/projects/formula-engine',
    actor: { name: 'Sarah Chen', avatar: null }
  },
  {
    id: 'notif-2',
    type: 'task',
    title: 'Check assigned: Review Aerodynamics Module',
    message: 'High priority task assigned by Michael Torres',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/tasks/aero-review',
    priority: 'high'
  },
  {
    id: 'notif-3',
    type: 'system',
    title: 'Weekly Report Generated',
    message: 'Your weekly performance report is ready',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    actionUrl: '/reports/weekly'
  }
];

const mockAnnouncements = [
  {
    id: 'ann-1',
    title: 'New Safety Protocols for Simulator Testing',
    content: 'All team members must complete the updated safety training before accessing the simulator facilities. The new protocols include enhanced emergency procedures and equipment handling guidelines.',
    author: { name: 'Admin Team', role: 'System' },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    priority: 'high',
    category: 'safety'
  },
  {
    id: 'ann-2',
    title: 'Q2 Engineering All Hands - Save the Date',
    content: 'Mark your calendars for our Q2 all hands meeting on April 15th. We\'ll be reviewing project milestones, celebrating achievements, and outlining the roadmap for the next quarter.',
    author: { name: 'Leadership Team', role: 'Management' },
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    priority: 'normal',
    category: 'event'
  }
];

const InboxPage = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState(mockMessages);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle attachment download/view
  const handleAttachmentClick = useCallback((attachment, messageSubject) => {
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
      
      showSuccess(`Opening ${attachment.name}`);
    } catch (error) {
      logger.error('Failed to open attachment:', error);
      showError('Failed to open attachment. Please try again.');
    }
  }, [showSuccess, showError]);
  const [typingUsers, setTypingUsers] = useState([]);
  
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'h:mm a');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday ' + format(timestamp, 'h:mm a');
    } else {
      return format(timestamp, 'MMM d, h:mm a');
    }
  };

  // Get unread counts
  const unreadCounts = useMemo(() => {
    return {
      messages: messages.filter(m => !m.read).length,
      notifications: notifications.filter(n => !n.read).length,
      total: messages.filter(m => !m.read).length + notifications.filter(n => !n.read).length
    };
  }, [messages, notifications]);

  // Filter messages based on search and filters
  const filteredMessages = useMemo(() => {
    let filtered = [...messages];
    
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.from.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (showUnreadOnly) {
      filtered = filtered.filter(msg => !msg.read);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(msg => {
        switch (filterType) {
          case 'starred':
            return msg.starred;
          case 'direct':
            return msg.type === 'direct';
          case 'team':
            return msg.type === 'team';
          default:
            return true;
        }
      });
    }
    
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [messages, searchTerm, showUnreadOnly, filterType]);

  // Mark message as read
  const markAsRead = useCallback((messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  }, []);

  // Toggle star
  const toggleStar = useCallback((messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ));
  }, []);

  // Handle message selection
  const handleSelectMessage = useCallback((message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  }, [markAsRead]);

  // Send reply
  const handleSendReply = useCallback(() => {
    if (!replyContent.trim() || !selectedMessage) return;
    
    const newReply = {
      id: `reply-${Date.now()}`,
      from: { id: user.id, name: 'You' },
      content: replyContent,
      timestamp: new Date()
    };
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, thread: [...(msg.thread || []), newReply] }
        : msg
    ));
    
    setReplyContent('');
    showSuccess('Reply sent successfully');
  }, [replyContent, selectedMessage, user, showSuccess]);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notifId ? { ...notif, read: true } : notif
    ));
  }, []);

  // Archive message
  const archiveMessage = useCallback((messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setSelectedMessage(null);
    showSuccess('Message archived');
  }, [showSuccess]);

  // Delete message
  const deleteMessage = useCallback((messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setSelectedMessage(null);
    showSuccess('Message deleted');
  }, [showSuccess]);

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder={`Search ${activeTab}...`}
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
      {activeTab === 'messages' && (
        <>
          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterType}
              label="Filter"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Messages</MenuItem>
              <MenuItem value="starred">Starred</MenuItem>
              <MenuItem value="direct">Direct</MenuItem>
              <MenuItem value="team">Team</MenuItem>
            </Select>
          </FormControl>
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
        </>
      )}
      <IconButton size="small" onClick={() => {
        setLoading(true);
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        // Simulate refresh delay with proper cleanup
        timeoutRef.current = setTimeout(() => {
          setLoading(false);
          showSuccess('Inbox refreshed successfully');
          timeoutRef.current = null;
        }, 500);
      }}>
        <RefreshIcon style={{ fontSize: 18 }} />
      </IconButton>
      <Button
        className="clean-button-primary"
        startIcon={<EditIcon style={{ fontSize: 16 }} />}
        onClick={() => setComposeOpen(true)}
        size="small"
      >
        Compose
      </Button>
    </Box>
  );

  const tabs = (
    <>
      <CleanTab 
        label="Messages" 
        isActive={activeTab === 'messages'}
        onClick={() => setActiveTab('messages')}
        icon={<MailIcon style={{ fontSize: 16 }} />}
        badge={unreadCounts.messages > 0 ? unreadCounts.messages : null}
      />
      <CleanTab 
        label="Notifications" 
        isActive={activeTab === 'notifications'}
        onClick={() => setActiveTab('notifications')}
        icon={<BellIcon style={{ fontSize: 16 }} />}
        badge={unreadCounts.notifications > 0 ? unreadCounts.notifications : null}
      />
      <CleanTab 
        label="Team Chat" 
        isActive={activeTab === 'team-chat'}
        onClick={() => setActiveTab('team-chat')}
        icon={<ChatIcon style={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Announcements" 
        isActive={activeTab === 'announcements'}
        onClick={() => setActiveTab('announcements')}
        icon={<AnnouncementIcon style={{ fontSize: 16 }} />}
      />
    </>
  );

  const renderMessages = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card className="clean-card" sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1, overflow: 'auto', p: 0 }}>
            <List sx={{ p: 0 }}>
              {filteredMessages.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <MailIcon style={{ fontSize: 48, color: '#9CA3AF', marginBottom: 16 }} />
                  <Typography color="text.secondary">
                    {searchTerm ? 'No messages found' : 'No messages yet'}
                  </Typography>
                </Box>
              ) : (
                filteredMessages.map((message) => (
                  <ListItem
                    key={message.id}
                    button
                    selected={selectedMessage?.id === message.id}
                    onClick={() => handleSelectMessage(message)}
                    sx={{
                      borderBottom: '1px solid #E5E7EB',
                      backgroundPalette: !message.read ? '#F3F4F6' : 'transparent',
                      '&:hover': { backgroundPalette: '#F9FAFB' },
                      '&.Mui-selected': { 
                        backgroundPalette: '#EEF2FF',
                        '&:hover': { backgroundPalette: '#E0E7FF' }
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          message.from.online ? 
                          <OnlineIcon style={{ fontSize: 12, color: '#10B981' }} /> : null
                        }
                      >
                        <Avatar sx={{ bgcolor: '#516AC8' }}>
                          {message.from.name.charAt(0)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: !message.read ? 600 : 400 }}>
                            {message.from.name}
                          </Typography>
                          {message.type === 'team' && (
                            <Chip 
                              label={message.channel} 
                              size="small" 
                              sx={{ height: 20, fontSize: 11 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: !message.read ? 600 : 400,
                              color: !message.read ? '#1F2937' : 'text.primary' 
                            }}
                          >
                            {message.subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {message.preview}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(message.id);
                        }}
                      >
                        {message.starred ? 
                          <StarIcon style={{ fontSize: 18, color: '#E3AF64' }} /> :
                          <StarBorderIcon style={{ fontSize: 18 }} />
                        }
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={8}>
        {selectedMessage ? (
          <Card className="clean-card" sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            {/* Message Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#516AC8' }}>
                    {selectedMessage.from.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: 18 }}>
                      {selectedMessage.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From: {selectedMessage.from.name} • {formatTimestamp(selectedMessage.timestamp)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small">
                    <ReplyIcon style={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton size="small">
                    <ForwardIcon style={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => archiveMessage(selectedMessage.id)}>
                    <ArchiveIcon style={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteMessage(selectedMessage.id)}>
                    <DeleteIcon style={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            
            {/* Message Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              <Typography variant="body1" paragraph>
                {selectedMessage.content}
              </Typography>
              
              {/* Attachments */}
              {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Attachments</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedMessage.attachments.map((attachment, index) => (
                      <Chip
                        key={index}
                        icon={<AttachIcon style={{ fontSize: 16 }} />}
                        label={`${attachment.name} (${attachment.size})`}
                        variant="outlined"
                        onClick={() => handleAttachmentClick(attachment, selectedMessage.subject)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundPalette: 'primary.light',
                            color: 'primary.contrastText'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Thread */}
              {selectedMessage.thread && selectedMessage.thread.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Thread</Typography>
                  {selectedMessage.thread.map((reply) => (
                    <Box key={reply.id} sx={{ mt: 2, pl: 2, borderLeft: '2px solid #E5E7EB' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2">{reply.from.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(reply.timestamp)}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{reply.content}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            
            {/* Reply Box */}
            <Box sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Type your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSendReply();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<SendIcon style={{ fontSize: 16 }} />}
                  onClick={handleSendReply}
                  disabled={!replyContent.trim()}
                >
                  Send
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Press Ctrl+Enter to send
              </Typography>
            </Box>
          </Card>
        ) : (
          <Paper sx={{ 
            height: 'calc(100vh - 200px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px dashed #E5E7EB'
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <MailIcon style={{ fontSize: 64, color: '#9CA3AF', marginBottom: 16 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Select a message to read
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a message from the list to view its contents
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );

  const renderNotifications = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className="clean-card">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Notifications</Typography>
              <Button size="small" onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                showSuccess('All notifications marked as read');
              }}>
                Mark all as read
              </Button>
            </Box>
            
            <List>
              {notifications.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <BellIcon style={{ fontSize: 48, color: '#9CA3AF', marginBottom: 16 }} />
                  <Typography color="text.secondary">No new notifications</Typography>
                </Box>
              ) : (
                notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      backgroundPalette: !notification.read ? '#F3F4F6' : 'transparent',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { backgroundPalette: '#F9FAFB' }
                    }}
                  >
                    <ListItemAvatar>
                      {notification.actor ? (
                        <Avatar sx={{ bgcolor: '#516AC8' }}>
                          {notification.actor.name.charAt(0)}
                        </Avatar>
                      ) : (
                        <Avatar sx={{ bgcolor: 
                          notification.type === 'system' ? '#9CA3AF' :
                          notification.type === 'task' ? '#E3AF64' : '#516AC8'
                        }}>
                          {notification.type === 'mention' ? '@' :
                           notification.type === 'task' ? 'T' : 'S'}
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: !notification.read ? 600 : 400 }}>
                            {notification.title}
                          </Typography>
                          {notification.priority === 'high' && (
                            <Chip label="High Priority" size="small" color="error" sx={{ height: 20 }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!notification.read && (
                          <IconButton 
                            size="small" 
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <CheckIcon style={{ fontSize: 18, color: '#10B981' }} />
                          </IconButton>
                        )}
                        <IconButton size="small">
                          <MoreIcon style={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTeamChat = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card className="clean-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>Channels</Typography>
            <List>
              {['general', 'engineering', 'design', 'random'].map((channel) => (
                <ListItem button key={channel}>
                  <ListItemText primary={`#${channel}`} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Direct Messages</Typography>
            <List>
              {['Sarah Chen', 'Michael Torres', 'Emma Wilson'].map((person) => (
                <ListItem button key={person}>
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={<OnlineIcon style={{ fontSize: 8, color: '#10B981' }} />}
                    >
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {person.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText primary={person} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={9}>
        <Card className="clean-card" sx={{ height: 'calc(100vh - 200px)' }}>
          <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <ChatIcon style={{ fontSize: 64, color: '#9CA3AF', marginBottom: 16 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Team Chat Coming Soon
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time team collaboration features are being developed
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAnnouncements = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="clean-card" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6">{announcement.title}</Typography>
                    {announcement.priority === 'high' && (
                      <Chip label="Important" size="small" color="error" />
                    )}
                    <Chip 
                      label={announcement.category} 
                      size="small" 
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      By {announcement.author.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatTimestamp(announcement.timestamp)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small">
                  <MoreIcon style={{ fontSize: 18 }} />
                </IconButton>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {announcement.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'messages':
        return renderMessages();
      case 'notifications':
        return renderNotifications();
      case 'team-chat':
        return renderTeamChat();
      case 'announcements':
        return renderAnnouncements();
      default:
        return null;
    }
  };

  return (
    <CleanPageLayout
      title="Inbox"
      subtitle="Centralized communication hub for all your messages, notifications, and team updates"
      breadcrumbs={[
        { label: 'Workspace', href: '/workspace' },
        { label: 'Inbox', href: '/inbox' }
      ]}
      headerActions={headerActions}
      tabs={tabs}
    >
      <Box className="clean-fade-in">
        {/* Status Bar */}
        {unreadCounts.total > 0 && (
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            action={
              <Button 
                size="small" 
                onClick={() => {
                  setMessages(prev => prev.map(m => ({ ...m, read: true })));
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  showSuccess('All items marked as read');
                }}
              >
                Mark All Read
              </Button>
            }
          >
            You have {unreadCounts.total} unread {unreadCounts.total === 1 ? 'item' : 'items'}
          </Alert>
        )}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </Typography>
          </Box>
        )}
        
        {renderTabContent()}
      </Box>
      
      {/* Compose Dialog */}
      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Message</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Autocomplete
              multiple
              options={['Sarah Chen', 'Michael Torres', 'Emma Wilson', 'Alex Kim']}
              renderInput={(params) => <TextField {...params} label="To" />}
            />
            <TextField
              fullWidth
              label="Subject"
              variant="outlined"
            />
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Message"
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small">
                <AttachIcon style={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            setComposeOpen(false);
            showSuccess('Message sent');
          }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </CleanPageLayout>
  );
};

export default InboxPage;