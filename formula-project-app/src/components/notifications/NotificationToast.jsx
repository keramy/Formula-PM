import React from 'react';
import { Snackbar, Alert, AlertTitle, Box, Typography } from '@mui/material';
import {
  MdCheckCircle as CheckCircle,
  MdError as Error,
  MdWarning as Warning,
  MdInfo as Info
} from 'react-icons/md';

const NotificationToast = ({
  open,
  onClose,
  severity = 'success',
  title = '',
  message = '',
  duration = 6000,
  action = null
}) => {
  
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <Error size={20} />;
      case 'warning':
        return <Warning size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          padding: 0
        }
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        icon={getIcon()}
        action={action}
        sx={{
          width: '100%',
          minWidth: 350,
          maxWidth: 500,
          borderRadius: 2,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          '& .MuiAlert-icon': {
            alignItems: 'center'
          },
          '& .MuiAlert-message': {
            width: '100%',
            padding: 0
          },
          '& .MuiAlert-action': {
            alignItems: 'flex-start',
            paddingTop: '4px'
          }
        }}
      >
        <Box sx={{ width: '100%' }}>
          {title && (
            <AlertTitle sx={{ 
              margin: 0,
              marginBottom: title && message ? 0.5 : 0,
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: 1.4
            }}>
              {title}
            </AlertTitle>
          )}
          {message && (
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '13px',
                lineHeight: 1.4,
                color: 'inherit'
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;