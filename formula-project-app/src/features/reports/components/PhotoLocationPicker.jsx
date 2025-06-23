/**
 * PhotoLocationPicker - Location selection component for photos
 * Allows users to select GPS coordinates and room/area information
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  FaMapMarkerAlt,
  FaGps,
  FaBuilding,
  FaHome,
  FaPlus,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheck,
  FaSpinner
} from 'react-icons/fa';
import metadataService from '../services/metadataService';

const PhotoLocationPicker = ({ 
  value = {}, 
  onChange, 
  projectId,
  enableGPS = true,
  enableCustomLocations = true,
  showRecentLocations = true 
}) => {
  const [locationData, setLocationData] = useState({
    gps: null,
    building: '',
    floor: '',
    room: '',
    area: '',
    ...value
  });

  const [projectLocations, setProjectLocations] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle, acquiring, success, error
  const [customLocationDialog, setCustomLocationDialog] = useState(false);
  const [newLocation, setNewLocation] = useState({
    building: '',
    floor: '',
    room: '',
    area: ''
  });

  const [suggestions, setSuggestions] = useState({
    buildings: [],
    floors: [],
    rooms: [],
    areas: []
  });

  useEffect(() => {
    if (projectId) {
      loadProjectLocations();
    }
    loadRecentLocations();
  }, [projectId]);

  useEffect(() => {
    generateSuggestions();
  }, [projectLocations]);

  useEffect(() => {
    if (onChange) {
      onChange(locationData);
    }
  }, [locationData, onChange]);

  const loadProjectLocations = async () => {
    try {
      const locations = await metadataService.getProjectLocations(projectId);
      setProjectLocations(locations);
    } catch (error) {
      console.error('Error loading project locations:', error);
    }
  };

  const loadRecentLocations = () => {
    // Load recent locations from localStorage
    const recent = JSON.parse(localStorage.getItem('recentLocations') || '[]');
    setRecentLocations(recent.slice(0, 5)); // Keep only 5 most recent
  };

  const saveRecentLocation = (location) => {
    if (!location.room && !location.area) return;

    const recent = JSON.parse(localStorage.getItem('recentLocations') || '[]');
    const locationKey = `${location.building}|${location.floor}|${location.room}|${location.area}`;
    
    // Remove if already exists
    const filtered = recent.filter(loc => 
      `${loc.building}|${loc.floor}|${loc.room}|${loc.area}` !== locationKey
    );
    
    // Add to beginning
    filtered.unshift({
      ...location,
      lastUsed: new Date().toISOString()
    });
    
    // Keep only 10 most recent
    const updated = filtered.slice(0, 10);
    localStorage.setItem('recentLocations', JSON.stringify(updated));
    setRecentLocations(updated.slice(0, 5));
  };

  const generateSuggestions = () => {
    const buildings = [...new Set(projectLocations.map(loc => loc.building).filter(Boolean))];
    const floors = [...new Set(projectLocations.map(loc => loc.floor).filter(Boolean))];
    const rooms = [...new Set(projectLocations.map(loc => loc.room).filter(Boolean))];
    const areas = [...new Set(projectLocations.flatMap(loc => loc.areas || []).filter(Boolean))];

    setSuggestions({ buildings, floors, rooms, areas });
  };

  const handleLocationChange = (field, value) => {
    const updatedLocation = {
      ...locationData,
      [field]: value
    };
    
    setLocationData(updatedLocation);
    
    // Auto-suggest based on selections
    if (field === 'building' || field === 'floor' || field === 'room') {
      const matchingLocations = projectLocations.filter(loc => {
        if (field === 'building') return loc.building === value;
        if (field === 'floor') return loc.building === updatedLocation.building && loc.floor === value;
        if (field === 'room') return loc.building === updatedLocation.building && 
                                  loc.floor === updatedLocation.floor && 
                                  loc.room === value;
        return false;
      });

      if (matchingLocations.length > 0) {
        const match = matchingLocations[0];
        if (field === 'building' && !updatedLocation.floor) {
          setLocationData(prev => ({ ...prev, floor: match.floor }));
        }
        if (field === 'floor' && !updatedLocation.room) {
          setLocationData(prev => ({ ...prev, room: match.room }));
        }
      }
    }
  };

  const handleGPSRequest = async () => {
    if (!enableGPS) return;

    setGpsStatus('acquiring');
    try {
      const gpsData = await metadataService.getCurrentLocation();
      setLocationData(prev => ({
        ...prev,
        gps: {
          latitude: gpsData.latitude,
          longitude: gpsData.longitude,
          accuracy: gpsData.accuracy
        }
      }));
      setGpsStatus('success');
    } catch (error) {
      console.error('GPS error:', error);
      setGpsStatus('error');
    }
  };

  const handleQuickSelect = (location) => {
    setLocationData({
      ...locationData,
      building: location.building || '',
      floor: location.floor || '',
      room: location.room || '',
      area: location.area || ''
    });
    
    saveRecentLocation(location);
  };

  const handleAddCustomLocation = async () => {
    if (!newLocation.room && !newLocation.area) {
      alert('Please provide at least a room or area name');
      return;
    }

    try {
      // Save to project locations
      await metadataService.updateProjectLocation(projectId, {
        ...newLocation,
        areas: newLocation.area ? [newLocation.area] : []
      });

      // Apply to current selection
      setLocationData({
        ...locationData,
        ...newLocation
      });

      // Refresh project locations
      await loadProjectLocations();
      
      // Clear form and close dialog
      setNewLocation({
        building: '',
        floor: '',
        room: '',
        area: ''
      });
      setCustomLocationDialog(false);
      
      saveRecentLocation(newLocation);
    } catch (error) {
      console.error('Error adding custom location:', error);
      alert('Error adding location: ' + error.message);
    }
  };

  const getGPSStatusIcon = () => {
    switch (gpsStatus) {
      case 'acquiring': return <FaSpinner className="fa-spin" />;
      case 'success': return <FaCheck color="green" />;
      case 'error': return <FaTimes color="red" />;
      default: return <FaGps />;
    }
  };

  const getGPSStatusText = () => {
    switch (gpsStatus) {
      case 'acquiring': return 'Acquiring GPS...';
      case 'success': return 'GPS acquired';
      case 'error': return 'GPS failed';
      default: return 'Get GPS location';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Location Information
      </Typography>

      <Grid container spacing={2}>
        {/* GPS Section */}
        {enableGPS && (
          <Grid item xs={12}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={getGPSStatusIcon()}
                    onClick={handleGPSRequest}
                    disabled={gpsStatus === 'acquiring'}
                    color={gpsStatus === 'success' ? 'success' : 'primary'}
                  >
                    {getGPSStatusText()}
                  </Button>
                  
                  {locationData.gps && (
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Lat: {locationData.gps.latitude.toFixed(6)}, 
                        Lng: {locationData.gps.longitude.toFixed(6)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Accuracy: ±{locationData.gps.accuracy}m
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Manual Location Entry */}
        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={suggestions.buildings}
            value={locationData.building}
            onChange={(e, newValue) => handleLocationChange('building', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Building"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={suggestions.floors}
            value={locationData.floor}
            onChange={(e, newValue) => handleLocationChange('floor', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Floor"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={suggestions.rooms}
            value={locationData.room}
            onChange={(e, newValue) => handleLocationChange('room', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Room"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={suggestions.areas}
            value={locationData.area}
            onChange={(e, newValue) => handleLocationChange('area', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Area"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Grid>

        {/* Quick Select from Project Locations */}
        {projectLocations.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, maxHeight: 300, overflowY: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom>
                Project Locations
              </Typography>
              <List dense>
                {projectLocations.map((location, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => handleQuickSelect(location)}
                  >
                    <ListItemText
                      primary={`${location.room || 'Room'}`}
                      secondary={`${location.building} - ${location.floor}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Recent Locations */}
        {showRecentLocations && recentLocations.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, maxHeight: 300, overflowY: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom>
                Recent Locations
              </Typography>
              <List dense>
                {recentLocations.map((location, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => handleQuickSelect(location)}
                  >
                    <ListItemText
                      primary={`${location.room || 'Room'} - ${location.area || 'Area'}`}
                      secondary={`${location.building} - ${location.floor}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Add Custom Location Button */}
        {enableCustomLocations && (
          <Grid item xs={12}>
            <Button
              variant="outlined"
              startIcon={<FaPlus />}
              onClick={() => setCustomLocationDialog(true)}
              sx={{ mt: 1 }}
            >
              Add New Location to Project
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Custom Location Dialog */}
      <Dialog
        open={customLocationDialog}
        onClose={() => setCustomLocationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Location</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Building"
                value={newLocation.building}
                onChange={(e) => setNewLocation({ ...newLocation, building: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Floor"
                value={newLocation.floor}
                onChange={(e) => setNewLocation({ ...newLocation, floor: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room"
                value={newLocation.room}
                onChange={(e) => setNewLocation({ ...newLocation, room: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Area"
                value={newLocation.area}
                onChange={(e) => setNewLocation({ ...newLocation, area: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomLocationDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddCustomLocation}
            variant="contained"
            startIcon={<FaSave />}
          >
            Add Location
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhotoLocationPicker;