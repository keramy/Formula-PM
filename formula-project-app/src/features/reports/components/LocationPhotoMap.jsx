/**
 * LocationPhotoMap - Visual organization of photos by location
 * Provides spatial context for photo management
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaHome,
  FaImage,
  FaEye,
  FaFilter,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import photoService from '../services/photoService';

const LocationPhotoMap = ({ 
  projectId, 
  photos = [], 
  onPhotoSelect,
  onLocationSelect,
  showPhotoCount = true,
  allowPhotoPreview = true 
}) => {
  const [locationGroups, setLocationGroups] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    timeRange: 'all'
  });
  const [expandedView, setExpandedView] = useState(false);

  useEffect(() => {
    if (photos.length > 0) {
      organizePhotosByLocation();
    }
  }, [photos, activeFilters]);

  const organizePhotosByLocation = () => {
    let filteredPhotos = photos;

    // Apply filters
    if (activeFilters.category !== 'all') {
      filteredPhotos = filteredPhotos.filter(photo => photo.category === activeFilters.category);
    }

    if (activeFilters.timeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (activeFilters.timeRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      if (activeFilters.timeRange !== 'all') {
        filteredPhotos = filteredPhotos.filter(photo => 
          new Date(photo.capturedAt) >= cutoffDate
        );
      }
    }

    // Group photos by location
    const groups = filteredPhotos.reduce((acc, photo) => {
      const location = photo.location || {};
      const building = location.building || 'Unknown Building';
      const floor = location.floor || 'Unknown Floor';
      const room = location.room || 'Unknown Room';
      const area = location.area || 'General Area';

      const buildingKey = building;
      const floorKey = `${building}|${floor}`;
      const roomKey = `${building}|${floor}|${room}`;
      const areaKey = `${building}|${floor}|${room}|${area}`;

      // Initialize structure
      if (!acc[buildingKey]) {
        acc[buildingKey] = {
          name: building,
          type: 'building',
          photos: [],
          floors: {}
        };
      }

      if (!acc[buildingKey].floors[floorKey]) {
        acc[buildingKey].floors[floorKey] = {
          name: floor,
          type: 'floor',
          photos: [],
          rooms: {}
        };
      }

      if (!acc[buildingKey].floors[floorKey].rooms[roomKey]) {
        acc[buildingKey].floors[floorKey].rooms[roomKey] = {
          name: room,
          type: 'room',
          photos: [],
          areas: {}
        };
      }

      if (!acc[buildingKey].floors[floorKey].rooms[roomKey].areas[areaKey]) {
        acc[buildingKey].floors[floorKey].rooms[roomKey].areas[areaKey] = {
          name: area,
          type: 'area',
          photos: []
        };
      }

      // Add photo to all levels
      acc[buildingKey].photos.push(photo);
      acc[buildingKey].floors[floorKey].photos.push(photo);
      acc[buildingKey].floors[floorKey].rooms[roomKey].photos.push(photo);
      acc[buildingKey].floors[floorKey].rooms[roomKey].areas[areaKey].photos.push(photo);

      return acc;
    }, {});

    setLocationGroups(groups);
  };

  const handleLocationClick = (location, photos) => {
    setSelectedLocation(location);
    setSelectedPhotos(photos);
    
    if (onLocationSelect) {
      onLocationSelect(location, photos);
    }
    
    if (allowPhotoPreview && photos.length > 0) {
      setPhotoPreviewOpen(true);
    }
  };

  const handlePhotoClick = (photo) => {
    if (onPhotoSelect) {
      onPhotoSelect(photo);
    }
  };

  const getLocationIcon = (type) => {
    switch (type) {
      case 'building': return <FaBuilding />;
      case 'floor': return <FaHome />;
      case 'room': return <FaMapMarkerAlt />;
      case 'area': return <FaMapMarkerAlt />;
      default: return <FaMapMarkerAlt />;
    }
  };

  const getLocationColor = (type) => {
    switch (type) {
      case 'building': return 'primary';
      case 'floor': return 'secondary';
      case 'room': return 'info';
      case 'area': return 'success';
      default: return 'default';
    }
  };

  const renderLocationCard = (location, locationKey, level = 0) => {
    const photoCount = location.photos.length;
    const hasChildren = location.floors || location.rooms || location.areas;

    return (
      <Card
        key={locationKey}
        sx={{
          mb: 1,
          ml: level * 2,
          cursor: photoCount > 0 ? 'pointer' : 'default',
          '&:hover': photoCount > 0 ? {
            boxShadow: 2,
            bgcolor: 'action.hover'
          } : {}
        }}
        onClick={() => photoCount > 0 && handleLocationClick(location, location.photos)}
      >
        <CardContent sx={{ py: 1.5, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getLocationIcon(location.type)}
            <Typography variant="body1" sx={{ flex: 1 }}>
              {location.name}
            </Typography>
            {showPhotoCount && photoCount > 0 && (
              <Badge
                badgeContent={photoCount}
                color={getLocationColor(location.type)}
                sx={{ mr: 1 }}
              >
                <FaImage />
              </Badge>
            )}
            {photoCount > 0 && (
              <Tooltip title="View photos">
                <IconButton size="small">
                  <FaEye />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Show most recent photos as thumbnails */}
          {photoCount > 0 && expandedView && (
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {location.photos.slice(0, 6).map((photo, index) => (
                <Box
                  key={photo.id}
                  component="img"
                  src={photo.thumbnail || photo.url}
                  alt={photo.caption}
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePhotoClick(photo);
                  }}
                />
              ))}
              {photoCount > 6 && (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  +{photoCount - 6}
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderLocationHierarchy = () => {
    return Object.keys(locationGroups).map(buildingKey => {
      const building = locationGroups[buildingKey];
      
      return (
        <Box key={buildingKey} sx={{ mb: 2 }}>
          {renderLocationCard(building, buildingKey, 0)}
          
          {Object.keys(building.floors).map(floorKey => {
            const floor = building.floors[floorKey];
            
            return (
              <Box key={floorKey}>
                {renderLocationCard(floor, floorKey, 1)}
                
                {Object.keys(floor.rooms).map(roomKey => {
                  const room = floor.rooms[roomKey];
                  
                  return (
                    <Box key={roomKey}>
                      {renderLocationCard(room, roomKey, 2)}
                      
                      {Object.keys(room.areas).map(areaKey => {
                        const area = room.areas[areaKey];
                        return renderLocationCard(area, areaKey, 3);
                      })}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      );
    });
  };

  const renderFilterMenu = () => (
    <Menu
      anchorEl={filterMenuAnchor}
      open={Boolean(filterMenuAnchor)}
      onClose={() => setFilterMenuAnchor(null)}
    >
      <MenuItem disabled>
        <Typography variant="subtitle2">Category</Typography>
      </MenuItem>
      <MenuItem 
        selected={activeFilters.category === 'all'}
        onClick={() => {
          setActiveFilters(prev => ({ ...prev, category: 'all' }));
          setFilterMenuAnchor(null);
        }}
      >
        All Categories
      </MenuItem>
      {photoService.getPhotoCategories().map(category => (
        <MenuItem
          key={category.id}
          selected={activeFilters.category === category.id}
          onClick={() => {
            setActiveFilters(prev => ({ ...prev, category: category.id }));
            setFilterMenuAnchor(null);
          }}
        >
          {category.name}
        </MenuItem>
      ))}
      <Divider />
      <MenuItem disabled>
        <Typography variant="subtitle2">Time Range</Typography>
      </MenuItem>
      {[
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
      ].map(option => (
        <MenuItem
          key={option.value}
          selected={activeFilters.timeRange === option.value}
          onClick={() => {
            setActiveFilters(prev => ({ ...prev, timeRange: option.value }));
            setFilterMenuAnchor(null);
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  );

  const renderPhotoPreviewDialog = () => (
    <Dialog
      open={photoPreviewOpen}
      onClose={() => setPhotoPreviewOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Photos from {selectedLocation?.name}
      </DialogTitle>
      <DialogContent>
        <List>
          {selectedPhotos.map((photo, index) => (
            <React.Fragment key={photo.id}>
              <ListItem
                button
                onClick={() => handlePhotoClick(photo)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={photo.thumbnail || photo.url}
                    alt={photo.caption}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={photo.caption || photo.originalName}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {photo.description}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {photo.tags?.map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(photo.capturedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < selectedPhotos.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box>
      {/* Header with controls */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Photos by Location
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<FaFilter />}
            onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
          >
            Filter
          </Button>
          <Button
            size="small"
            startIcon={expandedView ? <FaCompress /> : <FaExpand />}
            onClick={() => setExpandedView(!expandedView)}
          >
            {expandedView ? 'Collapse' : 'Expand'}
          </Button>
        </Box>
      </Box>

      {/* Active filters */}
      {(activeFilters.category !== 'all' || activeFilters.timeRange !== 'all') && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {activeFilters.category !== 'all' && (
            <Chip
              label={`Category: ${photoService.getPhotoCategories().find(c => c.id === activeFilters.category)?.name || activeFilters.category}`}
              onDelete={() => setActiveFilters(prev => ({ ...prev, category: 'all' }))}
              size="small"
            />
          )}
          {activeFilters.timeRange !== 'all' && (
            <Chip
              label={`Time: ${activeFilters.timeRange}`}
              onDelete={() => setActiveFilters(prev => ({ ...prev, timeRange: 'all' }))}
              size="small"
            />
          )}
        </Box>
      )}

      {/* Location hierarchy */}
      <Paper sx={{ p: 2, maxHeight: '60vh', overflowY: 'auto' }}>
        {Object.keys(locationGroups).length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <FaMapMarkerAlt size={48} color="#ccc" />
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
              No photos with location data found
            </Typography>
          </Box>
        ) : (
          renderLocationHierarchy()
        )}
      </Paper>

      {/* Filter menu */}
      {renderFilterMenu()}

      {/* Photo preview dialog */}
      {renderPhotoPreviewDialog()}
    </Box>
  );
};

export default LocationPhotoMap;