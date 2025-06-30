import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  MdMoreVert as MoreVertIcon,
  MdEdit as EditIcon,
  MdDelete as DeleteIcon,
  MdVisibility as ViewIcon,
  MdStar as StarIcon,
  MdStar as StarBorderIcon,
  MdShare as ShareIcon,
  MdContentCopy as DuplicateIcon,
  MdArchive as ArchiveIcon
} from 'react-icons/md';

const OptionsMenu = ({ 
  options = [],
  onAction,
  iconButtonProps = {},
  menuProps = {},
  disabled = false
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation(); // Prevent triggering parent click events
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action, option) => {
    handleClose();
    if (onAction) {
      onAction(action, option);
    }
  };

  const getIcon = (iconType) => {
    const iconMap = {
      view: <ViewIcon fontSize="small" />,
      edit: <EditIcon fontSize="small" />,
      delete: <DeleteIcon fontSize="small" />,
      star: <StarIcon fontSize="small" />,
      unstar: <StarBorderIcon fontSize="small" />,
      share: <ShareIcon fontSize="small" />,
      duplicate: <DuplicateIcon fontSize="small" />,
      archive: <ArchiveIcon fontSize="small" />
    };
    return iconMap[iconType] || null;
  };

  const getPaletteForAction = (action) => {
    if (action === 'delete') return 'error.main';
    if (action === 'archive') return 'warning.main';
    return 'text.primary';
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={disabled}
        size="small"
        sx={{
          opacity: 0.7,
          transition: 'opacity 0.2s ease',
          '&:hover': {
            opacity: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          },
          ...iconButtonProps.sx
        }}
        {...iconButtonProps}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            minWidth: 160,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid #E9ECEF',
            borderRadius: 2,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: '#F8F9FA'
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        {...menuProps}
      >
        {options.map((option, index) => {
          if (option.divider) {
            return <Divider key={`divider-${index}`} sx={{ my: 0.5 }} />;
          }

          return (
            <MenuItem
              key={option.action || index}
              onClick={() => handleMenuAction(option.action, option)}
              disabled={option.disabled}
              sx={{
                color: getPaletteForAction(option.action),
                '&:hover': {
                  backgroundColor: option.action === 'delete' 
                    ? 'rgba(231, 76, 60, 0.08)' 
                    : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              {option.icon && (
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  {typeof option.icon === 'string' ? getIcon(option.icon) : option.icon}
                </ListItemIcon>
              )}
              <ListItemText>
                {option.label}
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default OptionsMenu;