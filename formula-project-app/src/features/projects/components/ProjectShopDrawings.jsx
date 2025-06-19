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
      <Suspense fallback={<LoadingFallback />}>
        <ShopDrawingsList 
          projectFilter={projectId}
          projects={[project]}
          teamMembers={[]}
          showProjectFilter={false}
          compactMode={true}
        />
      </Suspense>
    </Box>
  );
};

export default ProjectShopDrawings;