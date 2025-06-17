import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Tasks = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Task management page
        </Typography>
        {/* Add your tasks content here */}
      </Paper>
    </Box>
  );
};

export default Tasks;