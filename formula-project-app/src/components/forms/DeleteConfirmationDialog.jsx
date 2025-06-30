import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  MdWarning as Warning,
  MdClose as Close,
  MdDelete as Delete
} from 'react-icons/md';

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item?',
  itemName = '',
  itemType = 'item',
  loading = false,
  error = null,
  consequences = []
}) => {
  
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Warning size={24} style={{ color: '#EF4444' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F1939' }}>
              {title}
            </Typography>
          </Box>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ minWidth: 'auto', p: 1, color: '#6B7280' }}
          >
            <Close size={20} />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#0F1939', mb: 2 }}>
            {message}
          </Typography>
          
          {itemName && (
            <Box
              sx={{
                p: 2,
                bgcolor: '#F9FAFB',
                borderRadius: 1,
                border: '1px solid #E5E7EB',
                mb: 2
              }}
            >
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                {itemType.charAt(0).toUpperCase() + itemType.slice(1)} to delete:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F1939' }}>
                {itemName}
              </Typography>
            </Box>
          )}

          {consequences.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                This action will also:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {consequences.map((consequence, index) => (
                  <Typography 
                    key={index} 
                    component="li" 
                    variant="body2" 
                    sx={{ mb: 0.5 }}
                  >
                    {consequence}
                  </Typography>
                ))}
              </Box>
            </Alert>
          )}

          <Alert severity="error">
            <Typography variant="body2">
              <strong>This action cannot be undone.</strong> The {itemType} and all related data will be permanently deleted.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#F9FAFB' }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ 
            color: '#6B7280',
            '&:hover': { bgcolor: '#F3F4F6' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={16} />
            ) : (
              <Delete size={16} />
            )
          }
          sx={{
            bgcolor: '#EF4444',
            '&:hover': { bgcolor: '#DC2626' },
            '&:disabled': { bgcolor: '#9CA3AF' }
          }}
        >
          {loading ? 'Deleting...' : `Delete ${itemType}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;