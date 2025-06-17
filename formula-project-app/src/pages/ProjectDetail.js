import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

const ProjectDetail = () => {
  const { projectId } = useParams();

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Project Detail
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Project ID: {projectId}
        </Typography>
        {/* Add your project detail content here */}
      </Paper>
    </Box>
  );
};

export default ProjectDetail;