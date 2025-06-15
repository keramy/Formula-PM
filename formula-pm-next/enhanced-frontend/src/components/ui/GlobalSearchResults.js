import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  IconButton,
  InputBase,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Assignment as ProjectIcon,
  Task as TaskIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const GlobalSearchResults = ({
  open,
  searchTerm,
  onSearchChange,
  onClose,
  onSelectResult,
  results = { projects: [], tasks: [], teamMembers: [] }
}) => {
  const getTotalResults = () => {
    return results.projects.length + results.tasks.length + results.teamMembers.length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getProjectName = (projectId, projects) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const handleItemClick = (type, item) => {
    if (onSelectResult) {
      onSelectResult(type, item);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          position: 'fixed',
          top: 80,
          m: 0,
          borderRadius: 2,
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon color="primary" />
            <Typography variant="h6">
              Search Results
            </Typography>
            {getTotalResults() > 0 && (
              <Chip 
                label={`${getTotalResults()} results`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Search Input */}
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            mt: 2,
            backgroundColor: '#F8F9FA',
            border: '1px solid #E9ECEF',
            borderRadius: 1
          }}
        >
          <SearchIcon sx={{ p: '10px', color: '#7F8C8D' }} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search projects, tasks, team members..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
          />
        </Paper>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {getTotalResults() === 0 && searchTerm ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try searching with different keywords
            </Typography>
          </Box>
        ) : !searchTerm ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Start typing to search
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search across projects, tasks, and team members
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Projects Results */}
            {results.projects.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#2C3E50' }}>
                  Projects ({results.projects.length})
                </Typography>
                <List dense>
                  {results.projects.map((project) => (
                    <ListItem
                      key={project.id}
                      button
                      onClick={() => handleItemClick('project', project)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': { backgroundColor: '#F8F9FA' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#3498db', width: 32, height: 32 }}>
                          <ProjectIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {project.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip 
                              label={project.status} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {project.type} • Due {formatDate(project.endDate)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            {/* Tasks Results */}
            {results.tasks.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#2C3E50' }}>
                  Tasks ({results.tasks.length})
                </Typography>
                <List dense>
                  {results.tasks.map((task) => (
                    <ListItem
                      key={task.id}
                      button
                      onClick={() => handleItemClick('task', task)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': { backgroundColor: '#F8F9FA' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#f39c12', width: 32, height: 32 }}>
                          <TaskIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {task.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip 
                              label={task.status} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                            <Chip 
                              label={task.priority} 
                              size="small" 
                              color={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'default'}
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {getProjectName(task.projectId, results.projects)} • Due {formatDate(task.dueDate)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            {/* Team Members Results */}
            {results.teamMembers.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#2C3E50' }}>
                  Team Members ({results.teamMembers.length})
                </Typography>
                <List dense>
                  {results.teamMembers.map((member) => (
                    <ListItem
                      key={member.id}
                      button
                      onClick={() => handleItemClick('teamMember', member)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': { backgroundColor: '#F8F9FA' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: member.roleColor || '#27ae60', 
                            width: 32, 
                            height: 32,
                            fontSize: '0.8rem'
                          }}
                        >
                          {member.initials}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {member.fullName}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip 
                              label={member.role} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {member.department} • {member.email}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearchResults;