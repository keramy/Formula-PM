import React from 'react';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Formula Project Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        {children}
      </Container>
    </Box>
  );
};

export default DashboardLayout;