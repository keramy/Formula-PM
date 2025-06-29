import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  TextField,
  Alert,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  Plus as AddIcon,
  WarningTriangle as WarningIcon,
  CheckCircle as CheckIcon,
  Design2D as DrawingIcon,
  Archive as MaterialIcon,
  Check as ScopeIcon
} from 'iconoir-react';
import { FaSave } from 'react-icons/fa';
import connectionService from '../../../services/connectionService';

const ConnectionManagementDialog = ({ 
  open, 
  onClose, 
  scopeItem,
  shopDrawings = [],
  materialSpecs = [],
  onConnectionsUpdated
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [connectedDrawings, setConnectedDrawings] = useState([]);
  const [connectedSpecs, setConnectedSpecs] = useState([]);
  const [availableDrawings, setAvailableDrawings] = useState([]);
  const [availableMaterialSpecs, setAvailableMaterialSpecs] = useState([]);
  const [dependencyAnalysis, setDependencyAnalysis] = useState(null);

  useEffect(() => {
    if (open && scopeItem) {
      loadConnections();
      analyzeDependencies();
    }
  }, [open, scopeItem, shopDrawings, materialSpecs]);

  const loadConnections = () => {
    if (!scopeItem) return;

    // Get current connections
    const drawings = connectionService.getConnectedDrawings(scopeItem.id);
    const specs = connectionService.getConnectedMaterialSpecs(scopeItem.id);

    setConnectedDrawings(drawings);
    setConnectedSpecs(specs);

    // Filter available items (not yet connected)
    const connectedDrawingIds = drawings.map(d => d.drawingId);
    const connectedSpecIds = specs.map(s => s.specId);

    setAvailableDrawings(
      shopDrawings.filter(d => 
        d.projectId === scopeItem.projectId && 
        !connectedDrawingIds.includes(d.id)
      )
    );

    setAvailableMaterialSpecs(
      materialSpecs.filter(s => 
        s.projectId === scopeItem.projectId && 
        !connectedSpecIds.includes(s.id)
      )
    );
  };

  const analyzeDependencies = () => {
    if (!scopeItem) return;

    const analysis = connectionService.analyzeScopeItemDependencies(
      scopeItem, 
      shopDrawings, 
      materialSpecs
    );
    setDependencyAnalysis(analysis);
  };

  const handleConnectDrawing = (drawingId) => {
    connectionService.connectScopeToDrawing(scopeItem.id, drawingId);
    loadConnections();
    analyzeDependencies();
    onConnectionsUpdated?.();
  };

  const handleConnectMaterialSpec = (specId) => {
    connectionService.connectScopeToMaterialSpec(scopeItem.id, specId);
    loadConnections();
    analyzeDependencies();
    onConnectionsUpdated?.();
  };

  const handleDisconnect = (connectionId) => {
    connectionService.removeConnection(connectionId);
    loadConnections();
    analyzeDependencies();
    onConnectionsUpdated?.();
  };

  const getStatusPalette = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'revision_required': return '#F44336';
      case 'rejected': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  const renderDependencyStatus = () => {
    if (!dependencyAnalysis) return null;

    const { isBlocked, blockers, warnings } = dependencyAnalysis;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dependency Status
        </Typography>
        
        {isBlocked && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Production Blocked
            </Typography>
            {blockers.map((blocker, index) => (
              <Typography key={index} variant="body2">
                • {blocker.message}
              </Typography>
            ))}
          </Alert>
        )}

        {warnings.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Warnings
            </Typography>
            {warnings.map((warning, index) => (
              <Typography key={index} variant="body2">
                • {warning.message}
              </Typography>
            ))}
          </Alert>
        )}

        {!isBlocked && warnings.length === 0 && (
          <Alert severity="success">
            <Typography variant="body2">
              ✅ All dependencies satisfied - Ready for production
            </Typography>
          </Alert>
        )}
      </Box>
    );
  };

  const renderShopDrawingsTab = () => (
    <Box>
      {/* Connected Drawings */}
      <Typography variant="h6" gutterBottom>
        Connected Shop Drawings ({connectedDrawings.length})
      </Typography>
      
      {connectedDrawings.length === 0 ? (
        <Alert severity={scopeItem?.shopDrawingRequired ? "warning" : "info"} sx={{ mb: 3 }}>
          {scopeItem?.shopDrawingRequired 
            ? "Shop drawing connection required for this item"
            : "No shop drawings connected"
          }
        </Alert>
      ) : (
        <List dense sx={{ mb: 3 }}>
          {connectedDrawings.map((connection) => {
            const drawing = shopDrawings.find(d => d.id === connection.drawingId);
            if (!drawing) return null;

            return (
              <ListItem key={connection.connectionId} divider>
                <DrawingIcon sx={{ mr: 2, color: '#1976d2' }} />
                <ListItemText
                  primary={drawing.fileName}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {drawing.drawingType} • {drawing.room}
                      </Typography>
                      <Chip 
                        label={drawing.status}
                        size="small"
                        sx={{
                          backgroundPalette: getStatusPalette(drawing.status),
                          color: 'white',
                          mt: 0.5
                        }}
                      />
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => handleDisconnect(connection.connectionId)}
                    color="error"
                  >
                    <UnlinkIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}

      {/* Available Drawings */}
      <Typography variant="h6" gutterBottom>
        Available Shop Drawings ({availableDrawings.length})
      </Typography>
      
      {availableDrawings.length === 0 ? (
        <Alert severity="info">
          No additional shop drawings available for this project
        </Alert>
      ) : (
        <List dense>
          {availableDrawings.map((drawing) => (
            <ListItem key={drawing.id} divider>
              <DrawingIcon sx={{ mr: 2, color: '#757575' }} />
              <ListItemText
                primary={drawing.fileName}
                secondary={`${drawing.drawingType} • ${drawing.room}`}
              />
              <ListItemSecondaryAction>
                <Button
                  startIcon={<LinkIcon />}
                  onClick={() => handleConnectDrawing(drawing.id)}
                  size="small"
                  variant="outlined"
                >
                  Connect
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  const renderMaterialSpecsTab = () => (
    <Box>
      {/* Connected Material Specs */}
      <Typography variant="h6" gutterBottom>
        Connected Material Specifications ({connectedSpecs.length})
      </Typography>
      
      {connectedSpecs.length === 0 ? (
        <Alert severity={scopeItem?.materialSpecRequired ? "warning" : "info"} sx={{ mb: 3 }}>
          {scopeItem?.materialSpecRequired 
            ? "Material specification connection required for this item"
            : "No material specifications connected"
          }
        </Alert>
      ) : (
        <List dense sx={{ mb: 3 }}>
          {connectedSpecs.map((connection) => {
            const spec = materialSpecs.find(s => s.id === connection.specId);
            if (!spec) return null;

            return (
              <ListItem key={connection.connectionId} divider>
                <MaterialIcon sx={{ mr: 2, color: '#4caf50' }} />
                <ListItemText
                  primary={spec.description}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {spec.category} • {spec.material}
                      </Typography>
                      <Chip 
                        label={spec.status}
                        size="small"
                        sx={{
                          backgroundPalette: getStatusPalette(spec.status),
                          color: 'white',
                          mt: 0.5
                        }}
                      />
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => handleDisconnect(connection.connectionId)}
                    color="error"
                  >
                    <UnlinkIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}

      {/* Available Material Specs */}
      <Typography variant="h6" gutterBottom>
        Available Material Specifications ({availableMaterialSpecs.length})
      </Typography>
      
      {availableMaterialSpecs.length === 0 ? (
        <Alert severity="info">
          No additional material specifications available for this project
        </Alert>
      ) : (
        <List dense>
          {availableMaterialSpecs.map((spec) => (
            <ListItem key={spec.id} divider>
              <MaterialIcon sx={{ mr: 2, color: '#757575' }} />
              <ListItemText
                primary={spec.description}
                secondary={`${spec.category} • ${spec.material}`}
              />
              <ListItemSecondaryAction>
                <Button
                  startIcon={<LinkIcon />}
                  onClick={() => handleConnectMaterialSpec(spec.id)}
                  size="small"
                  variant="outlined"
                >
                  Connect
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  if (!scopeItem) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ScopeIcon />
          <Box>
            <Typography variant="h6">
              Manage Connections
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {scopeItem.description}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {renderDependencyStatus()}
        
        <Box sx={{ borderBottom: 1, borderPalette: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
            <Tab 
              icon={<DrawingIcon />} 
              label={`Shop Drawings (${connectedDrawings.length})`}
              iconPosition="start"
            />
            <Tab 
              icon={<MaterialIcon />} 
              label={`Material Specs (${connectedSpecs.length})`}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {activeTab === 0 && renderShopDrawingsTab()}
        {activeTab === 1 && renderMaterialSpecsTab()}
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose}
          startIcon={<FaSave />}
          variant="contained"
          color="primary"
        >
          Save Changes
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionManagementDialog;