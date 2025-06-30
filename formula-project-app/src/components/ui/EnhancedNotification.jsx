import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  Box, 
  LinearProgress,
  IconButton,
  Collapse
} from '@mui/material';
import {
  MdCheckCircle as SuccessIcon,
  MdError as ErrorIcon,
  MdWarning as WarningIcon,
  MdInfo as InfoIcon,
  MdClose as CloseIcon,
  MdCloudUpload as UploadIcon,
  MdSave as SaveIcon,
  MdDelete as DeleteIcon,
  MdRefresh as SyncIcon
} from 'react-icons/md';

const EnhancedNotification = ({ 
  notification, 
  onClose,
  index = 0 
}) => {
  const [show, setShow] = React.useState(true);

  // Get icon based on notification type and action
  const getIcon = () => {
    // Check for specific actions first
    if (notification.action) {
      switch (notification.action) {
        case 'upload': return <UploadIcon />;
        case 'save': return <SaveIcon />;
        case 'delete': return <DeleteIcon />;
        case 'sync': return <SyncIcon />;
        default: break;
      }
    }

    // Default icons based on type
    switch (notification.type) {
      case 'success': return <SuccessIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  // Get title based on type if not provided
  const getTitle = () => {
    if (notification.title) return notification.title;
    
    switch (notification.type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
      default: return '';
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(notification.id), 300);
  };

  return (
    <Collapse in={show} timeout={300}>
      <Alert
        severity={notification.type}
        icon={getIcon()}
        onClose={handleClose}
        sx={{
          minWidth: '350px',
          maxWidth: '500px',
          boxShadow: 4,
          border: 'none',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          animation: 'slideInRight 0.3s ease-out',
          mb: 2,
          '& .MuiAlert-icon': {
            fontSize: '2rem',
            alignItems: 'center'
          },
          '& .MuiAlert-message': {
            fontSize: '0.95rem',
            fontWeight: 400,
            width: '100%'
          },
          '& .MuiAlert-action': {
            alignItems: 'flex-start',
            pt: 0.5
          },
          '@keyframes slideInRight': {
            '0%': {
              transform: 'translateX(100%)',
              opacity: 0
            },
            '100%': {
              transform: 'translateX(0)',
              opacity: 1
            }
          }
        }}
        variant="filled"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {notification.title && (
          <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>
            {getTitle()}
          </AlertTitle>
        )}
        <Box>
          {notification.message}
          {notification.details && (
            <Box sx={{ mt: 1, fontSize: '0.85rem', opacity: 0.9 }}>
              {notification.details}
            </Box>
          )}
        </Box>
        {notification.progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={notification.progress}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }
            }}
          />
        )}
      </Alert>
    </Collapse>
  );
};

export default EnhancedNotification;