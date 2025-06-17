import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar
} from '@mui/material';
import {
  Link as LinkIcon,
  LinkOff as UnlinkIcon,
  Architecture as DrawingIcon,
  Assignment as TaskIcon,
  Inventory as SpecIcon,
  ExpandMore as ExpandMoreIcon,
  PictureAsPdf as PdfIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';

const SpecificationLinkingPanel = ({
  specification,
  shopDrawings = [],
  tasks = [],
  projects = [],
  onUpdateLinks,
  onClose
}) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkType, setLinkType] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentLinks, setCurrentLinks] = useState({
    drawings: specification?.linkedDrawings || [],
    tasks: specification?.linkedTasks || [],
    specifications: specification?.linkedSpecifications || []
  });

  if (!specification) {
    return (
      <Alert severity="info">
        Select a specification to view and manage its links
      </Alert>
    );
  }

  // Get linked items details
  const getLinkedDrawings = () => {
    return shopDrawings.filter(drawing => 
      currentLinks.drawings.includes(drawing.id)
    );
  };

  const getLinkedTasks = () => {
    return tasks.filter(task => 
      currentLinks.tasks.includes(task.id)
    );
  };

  const getAvailableDrawings = () => {
    return shopDrawings.filter(drawing => 
      !currentLinks.drawings.includes(drawing.id)
    );
  };

  const getAvailableTasks = () => {
    return tasks.filter(task => 
      !currentLinks.tasks.includes(task.id)
    );
  };

  const handleOpenLinkDialog = (type) => {
    setLinkType(type);
    setSelectedItems([]);
    setLinkDialogOpen(true);
  };

  const handleAddLinks = () => {
    const newLinks = { ...currentLinks };
    
    if (linkType === 'drawings') {
      newLinks.drawings = [...newLinks.drawings, ...selectedItems];
    } else if (linkType === 'tasks') {
      newLinks.tasks = [...newLinks.tasks, ...selectedItems];
    }

    setCurrentLinks(newLinks);
    onUpdateLinks(specification.id, newLinks);
    setLinkDialogOpen(false);
    setSelectedItems([]);
  };

  const handleRemoveLink = (type, itemId) => {
    const newLinks = { ...currentLinks };
    newLinks[type] = newLinks[type].filter(id => id !== itemId);
    
    setCurrentLinks(newLinks);
    onUpdateLinks(specification.id, newLinks);
  };

  const handleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderLinkSection = (title, items, type, icon, addAction) => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="h6">{title}</Typography>
          <Chip 
            label={items.length} 
            size="small" 
            color={items.length > 0 ? 'primary' : 'default'}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {items.length > 0 ? (
          <List dense>
            {items.map((item) => (
              <ListItem key={item.id} divider>
                <Avatar sx={{ mr: 2, backgroundColor: type === 'drawings' ? '#1976d2' : '#2e7d32' }}>
                  {type === 'drawings' ? <PdfIcon /> : <TaskIcon />}
                </Avatar>
                <ListItemText
                  primary={type === 'drawings' ? item.fileName : item.name}
                  secondary={
                    type === 'drawings' 
                      ? `${item.drawingType} • ${item.room} • ${item.version}`
                      : `${item.projectName} • ${item.status}`
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleRemoveLink(type, item.id)}
                    color="error"
                    size="small"
                  >
                    <UnlinkIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary" gutterBottom>
              No {title.toLowerCase()} linked
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addAction()}
              size="small"
            >
              Link {title}
            </Button>
          </Box>
        )}
        
        {items.length > 0 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addAction()}
              size="small"
            >
              Add More {title}
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderLinkDialog = () => {
    const availableItems = linkType === 'drawings' 
      ? getAvailableDrawings() 
      : getAvailableTasks();

    return (
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Link {linkType === 'drawings' ? 'Shop Drawings' : 'Tasks'} to Specification
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select {linkType === 'drawings' ? 'shop drawings' : 'tasks'} to link with: <strong>{specification.itemId}</strong>
          </Typography>
          
          {availableItems.length > 0 ? (
            <List sx={{ mt: 2 }}>
              {availableItems.map((item) => (
                <ListItem key={item.id} dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelection(item.id)}
                      />
                    }
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="body2">
                          {linkType === 'drawings' ? item.fileName : item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {linkType === 'drawings' 
                            ? `${item.drawingType} • ${item.room} • ${item.status}`
                            : `${item.projectName} • Due: ${item.dueDate || 'Not set'}`
                          }
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%' }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No available {linkType === 'drawings' ? 'shop drawings' : 'tasks'} to link.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddLinks}
            variant="contained"
            disabled={selectedItems.length === 0}
          >
            Link Selected ({selectedItems.length})
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      <Card elevation={2}>
        <CardContent>
          {/* Specification Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Specification Links
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <SpecIcon color="primary" />
              <Box>
                <Typography variant="h6">{specification.itemId}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {specification.description}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={specification.category} size="small" />
              <Chip label={specification.material} size="small" variant="outlined" />
              <Chip label={`${specification.quantity} ${specification.unit}`} size="small" variant="outlined" />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Linked Shop Drawings */}
          {renderLinkSection(
            'Shop Drawings',
            getLinkedDrawings(),
            'drawings',
            <DrawingIcon color="primary" />,
            () => handleOpenLinkDialog('drawings')
          )}

          {/* Linked Tasks */}
          {renderLinkSection(
            'Tasks',
            getLinkedTasks(),
            'tasks',
            <TaskIcon color="primary" />,
            () => handleOpenLinkDialog('tasks')
          )}

          {/* Link Summary */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Link Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DrawingIcon fontSize="small" />
                  <Typography variant="body2">
                    {getLinkedDrawings().length} Shop Drawing(s)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TaskIcon fontSize="small" />
                  <Typography variant="body2">
                    {getLinkedTasks().length} Task(s)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {(getLinkedDrawings().length > 0 || getLinkedTasks().length > 0) && (
              <Alert severity="success" sx={{ mt: 2 }}>
                This specification is properly linked to project components. 
                Changes to drawings or tasks will be reflected in the specification tracking.
              </Alert>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() => handleOpenLinkDialog('drawings')}
            >
              Link Drawings
            </Button>
            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() => handleOpenLinkDialog('tasks')}
            >
              Link Tasks
            </Button>
            {onClose && (
              <Button variant="contained" onClick={onClose}>
                Done
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Link Dialog */}
      {renderLinkDialog()}
    </Box>
  );
};

export default SpecificationLinkingPanel;