import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Team = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Team
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Team management page
        </Typography>
        {/* Add your team content here */}
      </Paper>
    </Box>
  );
};

export default Team;