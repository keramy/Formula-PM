import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

// Test imports for Iconoir icons to verify availability
let availableIcons = {};
let missingIcons = [];

// Navigation Icons Test
try {
  const { Home } = require('iconoir-react');
  availableIcons.Home = Home;
} catch (e) { missingIcons.push('Home'); }

try {
  const { Dashboard } = require('iconoir-react');
  availableIcons.Dashboard = Dashboard;
} catch (e) { missingIcons.push('Dashboard'); }

try {
  const { Menu } = require('iconoir-react');
  availableIcons.Menu = Menu;
} catch (e) { missingIcons.push('Menu'); }

try {
  const { Timeline } = require('iconoir-react');
  availableIcons.Timeline = Timeline;
} catch (e) { missingIcons.push('Timeline'); }

// Action Icons Test
try {
  const { Plus } = require('iconoir-react');
  availableIcons.Plus = Plus;
} catch (e) { missingIcons.push('Plus'); }

try {
  const { Add } = require('iconoir-react');
  availableIcons.Add = Add;
} catch (e) { missingIcons.push('Add'); }

try {
  const { Search } = require('iconoir-react');
  availableIcons.Search = Search;
} catch (e) { missingIcons.push('Search'); }

try {
  const { Filter } = require('iconoir-react');
  availableIcons.Filter = Filter;
} catch (e) { missingIcons.push('Filter'); }

try {
  const { Edit } = require('iconoir-react');
  availableIcons.Edit = Edit;
} catch (e) { missingIcons.push('Edit'); }

try {
  const { Trash } = require('iconoir-react');
  availableIcons.Trash = Trash;
} catch (e) { missingIcons.push('Trash'); }

try {
  const { Save } = require('iconoir-react');
  availableIcons.Save = Save;
} catch (e) { missingIcons.push('Save'); }

// View Icons Test
try {
  const { Grid } = require('iconoir-react');
  availableIcons.Grid = Grid;
} catch (e) { missingIcons.push('Grid'); }

try {
  const { Table } = require('iconoir-react');
  availableIcons.Table = Table;
} catch (e) { missingIcons.push('Table'); }

try {
  const { List } = require('iconoir-react');
  availableIcons.List = List;
} catch (e) { missingIcons.push('List'); }

try {
  const { Calendar } = require('iconoir-react');
  availableIcons.Calendar = Calendar;
} catch (e) { missingIcons.push('Calendar'); }

// Status Icons Test
try {
  const { Check } = require('iconoir-react');
  availableIcons.Check = Check;
} catch (e) { missingIcons.push('Check'); }

try {
  const { Warning } = require('iconoir-react');
  availableIcons.Warning = Warning;
} catch (e) { missingIcons.push('Warning'); }

try {
  const { Star } = require('iconoir-react');
  availableIcons.Star = Star;
} catch (e) { missingIcons.push('Star'); }

// Business Icons Test
try {
  const { Building } = require('iconoir-react');
  availableIcons.Building = Building;
} catch (e) { missingIcons.push('Building'); }

try {
  const { Task } = require('iconoir-react');
  availableIcons.Task = Task;
} catch (e) { missingIcons.push('Task'); }

try {
  const { Group } = require('iconoir-react');
  availableIcons.Group = Group;
} catch (e) { missingIcons.push('Group'); }

try {
  const { User } = require('iconoir-react');
  availableIcons.User = User;
} catch (e) { missingIcons.push('User'); }

try {
  const { Settings } = require('iconoir-react');
  availableIcons.Settings = Settings;
} catch (e) { missingIcons.push('Settings'); }

// Additional common icons
try {
  const { Share } = require('iconoir-react');
  availableIcons.Share = Share;
} catch (e) { missingIcons.push('Share'); }

try {
  const { Download } = require('iconoir-react');
  availableIcons.Download = Download;
} catch (e) { missingIcons.push('Download'); }

try {
  const { Upload } = require('iconoir-react');
  availableIcons.Upload = Upload;
} catch (e) { missingIcons.push('Upload'); }

try {
  const { Eye } = require('iconoir-react');
  availableIcons.Eye = Eye;
} catch (e) { missingIcons.push('Eye'); }

try {
  const { Close } = require('iconoir-react');
  availableIcons.Close = Close;
} catch (e) { missingIcons.push('Close'); }

const IconoirTest = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🎯 Iconoir Icon Availability Test
      </Typography>
      
      <Grid container spacing={3}>
        {/* Available Icons */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
              ✅ Available Icons ({Object.keys(availableIcons).length})
            </Typography>
            {Object.entries(availableIcons).map(([name, IconComponent]) => (
              <Box key={name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconComponent style={{ marginRight: 8, width: 20, height: 20 }} />
                <Typography variant="body2">{name}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Missing Icons */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
              ❌ Missing Icons ({missingIcons.length})
            </Typography>
            {missingIcons.map((name) => (
              <Typography key={name} variant="body2" sx={{ mb: 1 }}>
                {name}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Summary */}
      <Paper sx={{ p: 3, mt: 3, backgroundColor: 'info.light' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📊 Migration Summary
        </Typography>
        <Typography variant="body1">
          <strong>Available:</strong> {Object.keys(availableIcons).length} icons can be directly imported from Iconoir
        </Typography>
        <Typography variant="body1">
          <strong>Missing:</strong> {missingIcons.length} icons need alternative names or custom implementation
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          Next step: Create mapping table for successful migration strategy
        </Typography>
      </Paper>
    </Box>
  );
};

export default IconoirTest;