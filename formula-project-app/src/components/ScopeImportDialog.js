import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

const ScopeImportDialog = ({ open, onClose, onImport, categories }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      // In a real implementation, you would parse the Excel file here
      // For now, we'll simulate with sample data
      setPreviewData([
        {
          description: 'Drywall Installation',
          quantity: 500,
          unitPrice: 15.50,
          unit: 'sqm',
          category: 'Millwork & Carpentry'
        },
        {
          description: 'Electrical Outlets',
          quantity: 25,
          unitPrice: 45.00,
          unit: 'pcs',
          category: 'Electrical Systems'
        }
      ]);
    }
  };

  const handleImport = async () => {
    if (!file || previewData.length === 0) {
      setError('Please select a valid Excel file');
      return;
    }

    setImporting(true);
    
    try {
      // Simulate import delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      onImport(previewData);
      handleClose();
    } catch (error) {
      setError('Failed to import items');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setError('');
    setImporting(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Scope Items from Excel</DialogTitle>
      
      <DialogContent>
        {/* File Upload Area */}
        <Box sx={{ 
          border: '2px dashed #E9ECEF', 
          borderRadius: 2, 
          p: 4,
          textAlign: 'center',
          backgroundColor: '#F8F9FA',
          mb: 3
        }}>
          <input
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            id="excel-upload"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="excel-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadIcon />}
              sx={{ 
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                mb: 2
              }}
            >
              Select Excel File
            </Button>
          </label>
          
          {file && (
            <Typography variant="body2" sx={{ color: '#27AE60', mb: 2 }}>
              Selected: {file.name}
            </Typography>
          )}
          
          <Typography variant="caption" display="block" color="textSecondary">
            Supported formats: .xlsx, .xls, .csv
          </Typography>
          
          <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
            Required columns: Description, Quantity, Unit Price, Unit, Category
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Import Progress */}
        {importing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Importing scope items...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {/* Preview Data */}
        {previewData.length > 0 && !importing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preview ({previewData.length} items)
            </Typography>
            <List dense>
              {previewData.slice(0, 5).map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={item.description}
                    secondary={`${item.quantity} ${item.unit} × $${item.unitPrice} = $${(item.quantity * item.unitPrice).toLocaleString()}`}
                  />
                </ListItem>
              ))}
              {previewData.length > 5 && (
                <ListItem>
                  <ListItemText
                    primary={`... and ${previewData.length - 5} more items`}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleClose}
          disabled={importing}
          sx={{ 
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || previewData.length === 0 || importing}
          sx={{ 
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: '#27AE60',
            '&:hover': {
              backgroundColor: '#229954'
            }
          }}
        >
          {importing ? 'Importing...' : `Import ${previewData.length} Items`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScopeImportDialog;