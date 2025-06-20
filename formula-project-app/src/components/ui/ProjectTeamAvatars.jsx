import React, { useState } from 'react';
import {
  Box,
  Avatar,
  AvatarGroup,
  Tooltip,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  DialogActions,
  Button
} from '@mui/material';
import { useDialogManager } from '../../hooks/useDialogManager';

const ProjectTeamAvatars = ({ 
  teamMembers = [], 
  projectTeamIds = [], 
  maxAvatars = 3,
  size = 'medium',
  showNames = false,
  compact = false,
  projectName = ''
}) => {
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const { openTeamMemberDetail } = useDialogManager();
  // Filter team members who are assigned to this project
  const assignedMembers = projectTeamIds
    .map(id => teamMembers.find(member => member.id === id))
    .filter(Boolean); // Remove any undefined entries

  if (assignedMembers.length === 0) {
    return compact ? null : (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          sx={{
            width: size === 'small' ? 24 : size === 'large' ? 40 : 32,
            height: size === 'small' ? 24 : size === 'large' ? 40 : 32,
            backgroundColor: '#bdc3c7',
            fontSize: size === 'small' ? '0.7rem' : '0.8rem'
          }}
        >
          ?
        </Avatar>
        {showNames && (
          <Typography variant="body2" color="text.secondary">
            No team assigned
          </Typography>
        )}
      </Box>
    );
  }

  const displayMembers = assignedMembers.slice(0, maxAvatars);
  const remainingCount = assignedMembers.length - maxAvatars;

  const avatarSize = size === 'small' ? 24 : size === 'large' ? 40 : 32;
  const fontSize = size === 'small' ? '0.7rem' : '0.8rem';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AvatarGroup 
        max={maxAvatars}
        sx={{
          '& .MuiAvatar-root': {
            width: avatarSize,
            height: avatarSize,
            fontSize: fontSize,
            border: '2px solid white',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }
          }
        }}
      >
        {displayMembers.map((member) => (
          <Tooltip key={member.id} title={member.fullName || member.firstName + ' ' + member.lastName}>
            <Avatar
              sx={{
                bgcolor: member.roleColor || '#3498db',
                fontWeight: 600
              }}
            >
              {member.initials || (member.firstName?.[0] + member.lastName?.[0])}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
      
      {remainingCount > 0 && (
        <Tooltip title={`+${remainingCount} more team members. Click to view all.`}>
          <Chip 
            label={`+${remainingCount}`}
            size="small"
            onClick={() => setShowTeamDialog(true)}
            sx={{ 
              height: size === 'small' ? 20 : 24,
              fontSize: size === 'small' ? '0.7rem' : '0.75rem',
              fontWeight: 600,
              backgroundColor: '#f8f9fa',
              color: '#495057',
              cursor: 'pointer',
              border: '1px solid #dee2e6',
              '&:hover': {
                backgroundColor: '#e9ecef',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              },
              transition: 'all 0.2s ease'
            }}
          />
        </Tooltip>
      )}

      {showNames && assignedMembers.length <= 2 && (
        <Box sx={{ ml: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {assignedMembers.map(m => m.fullName || m.firstName + ' ' + m.lastName).join(', ')}
          </Typography>
        </Box>
      )}

      {/* Team Members Dialog */}
      <Dialog 
        open={showTeamDialog} 
        onClose={() => setShowTeamDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Team Members{projectName && ` - ${projectName}`}
        </DialogTitle>
        <DialogContent>
          <List>
            {assignedMembers.map((member) => (
              <ListItemButton
                key={member.id}
                onClick={() => {
                  openTeamMemberDetail(member);
                  setShowTeamDialog(false);
                }}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    '& .MuiListItemText-primary': {
                      color: 'primary.contrastText'
                    },
                    '& .MuiListItemText-secondary': {
                      color: 'primary.contrastText'
                    }
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: member.roleColor || '#3498db',
                      fontWeight: 600
                    }}
                  >
                    {member.initials || (member.firstName?.[0] + member.lastName?.[0])}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.fullName || `${member.firstName} ${member.lastName}`}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {member.position}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTeamDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTeamAvatars;