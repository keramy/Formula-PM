import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Box,
  Typography,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  MoreVertCircle as MoreVertIcon,
  Edit as EditIcon,
  Trash as DeleteIcon,
  Eye as ViewIcon
} from 'iconoir-react';

const UnifiedTableView = ({
  data,
  columns,
  onSort,
  sortBy,
  sortDirection,
  onRowAction,
  showCheckboxes = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  actions = [],
  emptyStateMessage = "No data available",
  emptyStateIcon: EmptyStateIcon
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleMenuOpen = (event, rowData) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowData(rowData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowData(null);
  };

  const handleAction = (action) => {
    if (onRowAction && selectedRowData) {
      onRowAction(action, selectedRowData);
    }
    handleMenuClose();
  };

  const handleSort = (column) => {
    if (column.sortable !== false && onSort) {
      const isAsc = sortBy === column.key && sortDirection === 'asc';
      onSort(column.key, isAsc ? 'desc' : 'asc');
    }
  };

  const renderCellContent = (column, rowData) => {
    // Ensure rowData is valid
    if (!rowData || typeof rowData !== 'object') {
      console.warn('Invalid rowData in renderCellContent:', rowData);
      return '-';
    }
    
    const value = rowData[column.key];

    // Safety wrapper to ensure we never return invalid React children
    const safeRender = (content) => {
      if (React.isValidElement(content)) {
        return content;
      }
      if (typeof content === 'string' || typeof content === 'number') {
        return content;
      }
      if (content === null || content === undefined) {
        return '-';
      }
      if (typeof content === 'boolean') {
        return content.toString();
      }
      if (typeof content === 'object') {
        console.warn('Attempting to render object as React child:', content);
        return '[Object]';
      }
      return String(content);
    };

    if (column.render) {
      try {
        const renderedValue = column.render(value, rowData);
      
      // If the render function returns an object, we need to handle it properly
      if (typeof renderedValue === 'object' && renderedValue !== null && !React.isValidElement(renderedValue)) {
        
        // Handle avatar objects (check for avatar-specific properties)
        if (renderedValue.hasOwnProperty('fallback') || renderedValue.hasOwnProperty('bgColor') || renderedValue.hasOwnProperty('text')) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                src={renderedValue.src} 
                sx={{ 
                  width: 32, 
                  height: 32,
                  backgroundColor: renderedValue.bgColor || 'primary.main'
                }}
              >
                {renderedValue.fallback || '?'}
              </Avatar>
              {renderedValue.text && (
                <Typography 
                  variant="body2"
                  sx={{
                    cursor: renderedValue.clickable ? 'pointer' : 'default',
                    color: renderedValue.clickable ? '#3498db' : 'inherit',
                    textDecoration: 'none',
                    '&:hover': renderedValue.clickable ? {
                      textDecoration: 'underline',
                      color: '#2980b9'
                    } : {}
                  }}
                  onClick={renderedValue.clickable ? renderedValue.onClick : undefined}
                >
                  {renderedValue.text}
                </Typography>
              )}
            </Box>
          );
        }
        
        // Handle chip objects (check for chip-specific properties)
        if (renderedValue.hasOwnProperty('label') || renderedValue.hasOwnProperty('color')) {
          return (
            <Chip
              label={renderedValue.label || 'Unknown'}
              size="small"
              icon={renderedValue.icon || null}
              sx={{
                backgroundColor: renderedValue.bgColor || 'grey.100',
                color: renderedValue.color || 'text.primary',
                fontWeight: 500,
                '& .MuiChip-icon': {
                  color: renderedValue.color || 'text.primary',
                  fontSize: '16px'
                }
              }}
            />
          );
        }
        
        // For any other object, convert to string as fallback
        console.warn('Unhandled object in table cell:', renderedValue, 'Column:', column);
        try {
          return String(renderedValue.toString ? renderedValue.toString() : JSON.stringify(renderedValue));
        } catch (e) {
          console.error('Failed to stringify object:', e, renderedValue);
          return 'Error: Invalid object';
        }
      }
      
      // For non-objects or valid React elements, return safely
      return safeRender(renderedValue);
      } catch (error) {
        console.error('Error in column render function:', error, 'Column:', column.key, 'Value:', value);
        return 'Error: Render failed';
      }
    }

    switch (column.type) {
      case 'avatar':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={value?.src} 
              sx={{ 
                width: 32, 
                height: 32,
                backgroundColor: value?.bgColor || 'primary.main'
              }}
            >
              {value?.fallback || (typeof value === 'string' ? value.charAt(0) : '')}
            </Avatar>
            {value?.text && <Typography variant="body2">{value.text}</Typography>}
          </Box>
        );

      case 'chip':
        if (!value) return '-';
        return (
          <Chip
            label={value.label || value}
            size="small"
            icon={value.icon || null}
            sx={{
              backgroundColor: value.bgColor || 'grey.100',
              color: value.color || 'text.primary',
              fontWeight: 500,
              '& .MuiChip-icon': {
                color: value.color || 'text.primary',
                fontSize: '16px'
              }
            }}
          />
        );

      case 'progress':
        if (typeof value !== 'number') return '-';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 100 }}>
            <LinearProgress
              variant="determinate"
              value={value}
              className="clean-progress-bar"
              sx={{ flexGrow: 1 }}
            />
            <Typography className="text-xs font-medium" sx={{ minWidth: 35, color: 'var(--gray-600)' }}>
              {value}%
            </Typography>
          </Box>
        );

      case 'date':
        if (!value) return '-';
        const date = value instanceof Date ? value : new Date(value);
        return date.toLocaleDateString();

      case 'currency':
        if (!value) return '-';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);

      case 'email':
        if (!value) return '-';
        return (
          <Typography 
            variant="body2" 
            component="a" 
            href={`mailto:${value}`}
            sx={{ color: 'primary.main', textDecoration: 'none' }}
          >
            {value}
          </Typography>
        );

      case 'phone':
        if (!value) return '-';
        return (
          <Typography 
            variant="body2" 
            component="a" 
            href={`tel:${value}`}
            sx={{ color: 'primary.main', textDecoration: 'none' }}
          >
            {value}
          </Typography>
        );

      case 'multiline':
        if (!value) return '-';
        return (
          <Tooltip title={value} arrow>
            <Typography 
              variant="body2" 
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 200
              }}
            >
              {value}
            </Typography>
          </Tooltip>
        );

      default:
        return safeRender(value);
    }
  };

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {EmptyStateIcon && <EmptyStateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />}
        <Typography variant="h6" color="text.secondary">
          {emptyStateMessage}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer className="clean-table" component={Paper} sx={{ mt: 'var(--space-4)' }}>
      <Table>
        <TableHead>
          <TableRow>
            {showCheckboxes && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                  checked={data.length > 0 && selectedRows.length === data.length}
                  onChange={onSelectAll}
                  sx={{ color: 'var(--construction-500)' }}
                />
              </TableCell>
            )}
            
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align || 'left'}
                sx={{ 
                  minWidth: column.minWidth,
                  width: column.width
                }}
              >
                {column.sortable !== false ? (
                  <TableSortLabel
                    active={sortBy === column.key}
                    direction={sortBy === column.key ? sortDirection : 'asc'}
                    onClick={() => handleSort(column)}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        color: 'var(--construction-500) !important'
                      }
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
            
            {actions.length > 0 && (
              <TableCell align="center" sx={{ width: 60 }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id || index}
              hover
              selected={selectedRows.includes(row.id)}
            >
              {showCheckboxes && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={() => onSelectRow && onSelectRow(row.id)}
                    sx={{ color: 'var(--construction-500)' }}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell 
                  key={column.key} 
                  align={column.align || 'left'}
                >
                  {renderCellContent(column, row)}
                </TableCell>
              ))}
              
              {actions.length > 0 && (
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, row)}
                    sx={{
                      color: 'var(--gray-400)',
                      '&:hover': {
                        color: 'var(--construction-500)',
                        backgroundColor: 'var(--construction-50)'
                      }
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 120 }
        }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.key}
            onClick={() => handleAction(action.key)}
            disabled={action.disabled && action.disabled(selectedRowData)}
          >
            <ListItemIcon>
              {action.icon}
            </ListItemIcon>
            <ListItemText>
              {action.label}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  );
};

export default UnifiedTableView;