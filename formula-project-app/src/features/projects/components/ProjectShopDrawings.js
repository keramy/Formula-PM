import React, { Suspense } from 'react';
import {
  Box,
  Typography,
  Alert
} from '@mui/material';
import { LoadingFallback } from '../../../components/common/LoadingFallback';

// Lazy load the ShopDrawingsList component
const ShopDrawingsList = React.lazy(() => import('../../shop-drawings/components/ShopDrawingsList'));

const ProjectShopDrawings = ({ project, projectId }) => {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Shop Drawings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage millwork shop drawings and approval workflow for {project.name}
      </Typography>

      <Suspense fallback={<LoadingFallback />}>
        <ShopDrawingsList 
          projectFilter={projectId}
          projects={[project]}
          teamMembers={[]}
          showProjectFilter={false}
        />
      </Suspense>
    </Box>
  );
};

export default ProjectShopDrawings;