import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Clients = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Clients
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Client management page
        </Typography>
        {/* Add your clients content here */}
      </Paper>
    </Box>
  );
};

export default Clients;