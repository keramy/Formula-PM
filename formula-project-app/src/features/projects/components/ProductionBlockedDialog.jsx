import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  WarningTriangle as WarningIcon,
  Xmark as ErrorIcon,
  Page as DocumentIcon,
  Archive as MaterialIcon,
  CheckCircle as CheckIcon,
  Xmark as CancelIcon
} from 'iconoir-react';

const ProductionBlockedDialog = ({ open, onClose, scopeItem, connectionStatus, onManageConnections }) => {
  if (!scopeItem) return null;

  const { connections = {} } = scopeItem;
  const { shopDrawings = [], materialSpecs = [], warnings = [] } = connections;

  // Get blockers from connectionStatus if provided, otherwise calculate
  const blockers = connectionStatus?.blockers || [];
  const statusWarnings = connectionStatus?.warnings || warnings;
  
  // Get blocked items
  const blockedDrawings = shopDrawings.filter(drawing => 
    !drawing.approved || drawing.status !== 'approved'
  );
  const blockedMaterials = materialSpecs.filter(spec => 
    !spec.approved || spec.status !== 'pending'
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: 'error.main',
        color: 'error.contrastText'
      }}>
        <ErrorIcon />
        Production Blocked
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Production cannot start due to missing approvals or connections.
        </Alert>

        {/* Show blockers from connectionStatus if available */}
        {blockers.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
              Production Blockers
            </Typography>
            <Stack spacing={1}>
              {blockers.map((blocker, index) => (
                <Alert key={index} severity="error" icon={<ErrorIcon />}>
                  {typeof blocker === 'string' ? blocker : blocker.message}
                  {blocker.count && ` (${blocker.count})`}
                </Alert>
              ))}
            </Stack>
          </Box>
        )}

        {/* Blocked Shop Drawings */}
        {blockedDrawings.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Shop Drawings Requiring Approval ({blockedDrawings.length})
            </Typography>
            <List dense>
              {blockedDrawings.map((drawing, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <DocumentIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={drawing.name || `Drawing ${index + 1}`}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={drawing.status || 'Not Approved'} 
                          size="small" 
                          color="error"
                          variant="outlined"
                        />
                        {drawing.submissionDate && (
                          <Typography variant="caption" color="text.secondary">
                            Submitted: {new Date(drawing.submissionDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Blocked Material Specs */}
        {blockedMaterials.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Material Specifications Requiring Approval ({blockedMaterials.length})
            </Typography>
            <List dense>
              {blockedMaterials.map((spec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <MaterialIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={spec.name || `Material Spec ${index + 1}`}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={spec.status || 'Not Approved'} 
                          size="small" 
                          color="error"
                          variant="outlined"
                        />
                        {spec.supplier && (
                          <Typography variant="caption" color="text.secondary">
                            Supplier: {spec.supplier}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Warnings */}
        {statusWarnings.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Additional Warnings
            </Typography>
            <Stack spacing={1}>
              {statusWarnings.map((warning, index) => (
                <Alert key={index} severity="warning" icon={<WarningIcon />}>
                  {typeof warning === 'string' ? warning : warning.message}
                </Alert>
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Summary */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Current Connection Status:
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {shopDrawings.length > 0 ? <CheckIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
              <Typography variant="body2">
                {shopDrawings.length} Shop Drawing{shopDrawings.length !== 1 ? 's' : ''} connected
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {materialSpecs.length > 0 ? <CheckIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
              <Typography variant="body2">
                {materialSpecs.length} Material Spec{materialSpecs.length !== 1 ? 's' : ''} connected
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Resolution Instructions */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            To resolve this issue:
            <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Connect required shop drawings and material specifications</li>
              <li>Ensure all connected items are approved</li>
              <li>Check that all dependencies are satisfied</li>
            </ol>
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            onClose();
            onManageConnections(scopeItem);
          }}
          startIcon={<DocumentIcon />}
        >
          Manage Connections
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductionBlockedDialog;