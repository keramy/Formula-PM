import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Fade,
  Slide
} from '@mui/material';
import {
  Comment,
  Send,
  Close,
  ChatBubble,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useCollaborativeComments, usePresence } from '../../hooks/useRealTime';

// Real-time comments component
export const CollaborativeComments = ({ 
  entityType, 
  entityId, 
  title = "Comments",
  compact = false 
}) => {
  const { comments, addComment } = useCollaborativeComments(entityType, entityId);
  const [newComment, setNewComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { sendTyping } = usePresence();
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleTyping = (isTyping) => {
    sendTyping(entityType, entityId, isTyping);
    
    if (isTyping) {
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(entityType, entityId, false);
      }, 3000);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
    
    if (e.target.value.length > 0) {
      handleTyping(true);
    } else {
      handleTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment.trim());
      setNewComment('');
      handleTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  // Compact mode - floating button with comments count
  if (compact) {
    return (
      <>
        <Tooltip title={`${comments.length} comments`}>
          <Fab
            size="small"
            color="primary"
            onClick={() => setIsOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 20,
              zIndex: 1200
            }}
          >
            <Badge badgeContent={comments.length} color="error" max={99}>
              <ChatBubble />
            </Badge>
          </Fab>
        </Tooltip>

        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { maxHeight: '80vh' }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{title}</Typography>
            <IconButton onClick={() => setIsOpen(false)} size="small">
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <CollaborativeComments 
              entityType={entityType} 
              entityId={entityId} 
              title={title}
              compact={false}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Comments List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, maxHeight: 400 }}>
        {comments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Comment color="disabled" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2" color="textSecondary">
              No comments yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {comments.map((comment) => (
              <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {comment.userName?.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" component="span">
                        {comment.userName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                      {comment.message}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Comment Input */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Add a comment... (Ctrl+Enter to send)"
              value={newComment}
              onChange={handleCommentChange}
              onKeyDown={handleKeyPress}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!newComment.trim()}
              startIcon={<Send />}
              sx={{ borderRadius: 2, minWidth: 'auto', px: 2 }}
            >
              Send
            </Button>
          </Box>
        </form>
      </Box>
    </Paper>
  );
};

// Real-time collaborative cursor component
export const CollaborativeCursors = ({ 
  entityType, 
  entityId, 
  enabled = true 
}) => {
  const [cursors, setCursors] = useState([]);
  const [myPosition, setMyPosition] = useState(null);
  const { socket } = usePresence();

  useEffect(() => {
    if (!enabled || !socket) return;

    const handleCursorMoved = (cursorData) => {
      setCursors(prev => {
        const others = prev.filter(c => c.userId !== cursorData.userId);
        return [...others, cursorData];
      });

      // Remove cursor after 5 seconds of inactivity
      setTimeout(() => {
        setCursors(prev => prev.filter(c => c.userId !== cursorData.userId));
      }, 5000);
    };

    const handleMouseMove = (e) => {
      const position = {
        x: e.clientX,
        y: e.clientY,
        element: e.target.tagName
      };

      setMyPosition(position);

      // Throttle cursor updates to avoid overwhelming the server
      if (socket && socket.connected) {
        socket.emit('cursorUpdate', {
          roomType: entityType,
          roomId: entityId,
          position,
          element: e.target.tagName
        });
      }
    };

    socket.on('cursorMoved', handleCursorMoved);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      socket.off('cursorMoved', handleCursorMoved);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled, socket, entityType, entityId]);

  if (!enabled) return null;

  return (
    <>
      {/* Other users' cursors */}
      {cursors.map((cursor) => (
        <Box
          key={cursor.userId}
          sx={{
            position: 'fixed',
            left: cursor.position.x,
            top: cursor.position.y,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 9999,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Tooltip title={cursor.userName} arrow>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: 25,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'primary.main',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                whiteSpace: 'nowrap',
                fontSize: '0.7rem'
              }}
            >
              {cursor.userName}
            </Typography>
          </Tooltip>
        </Box>
      ))}

      {/* My cursor indicator (optional) */}
      {myPosition && (
        <Box
          sx={{
            position: 'fixed',
            left: myPosition.x,
            top: myPosition.y,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: 'success.main',
            border: '2px solid white',
            zIndex: 9998,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            opacity: 0.7
          }}
        />
      )}
    </>
  );
};

// Live editing indicator for forms
export const LiveEditingIndicator = ({ 
  isEditing, 
  otherEditors = [], 
  onStartEdit, 
  onStopEdit 
}) => {
  return (
    <Fade in={isEditing || otherEditors.length > 0}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        py: 1,
        px: 2,
        backgroundColor: isEditing ? 'primary.light' : 'warning.light',
        borderRadius: 1,
        mb: 2
      }}>
        {isEditing ? (
          <>
            <Visibility color="primary" fontSize="small" />
            <Typography variant="caption" color="primary.dark">
              You are editing this item
            </Typography>
            <Button
              size="small"
              onClick={onStopEdit}
              startIcon={<VisibilityOff />}
              sx={{ ml: 'auto' }}
            >
              Stop Editing
            </Button>
          </>
        ) : otherEditors.length > 0 ? (
          <>
            <Visibility color="warning" fontSize="small" />
            <Typography variant="caption" color="warning.dark">
              {otherEditors.map(e => e.userName).join(', ')} 
              {otherEditors.length === 1 ? ' is' : ' are'} editing this item
            </Typography>
            <Chip
              label="View Only"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ ml: 'auto' }}
            />
          </>
        ) : null}
      </Box>
    </Fade>
  );
};

// Collaborative notification toast
export const CollaborativeNotification = ({ 
  notification, 
  onClose,
  autoHideDuration = 5000 
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setOpen(false);
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onClose]);

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <Paper
        sx={{
          position: 'fixed',
          top: 80,
          right: 20,
          p: 2,
          minWidth: 300,
          maxWidth: 400,
          zIndex: 1300,
          backgroundColor: 'background.paper',
          boxShadow: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            {notification.userName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2">
              {notification.userName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {notification.message}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Slide>
  );
};

export default {
  CollaborativeComments,
  CollaborativeCursors,
  LiveEditingIndicator,
  CollaborativeNotification
};