import React, { Suspense } from 'react';
import {
  Box,
  Typography,
  Alert
} from '@mui/material';
import { UnifiedLoading } from '../../../components/ui/UnifiedLoading';

// Lazy load the MaterialSpecificationsList component
const MaterialSpecificationsList = React.lazy(() => import('../../specifications/components/MaterialSpecificationsList'));

const ProjectSpecifications = ({ project, projectId }) => {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Material Specifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage material specifications and cost tracking for {project.name}
      </Typography>

      <Suspense fallback={<UnifiedLoading variant="section" message="Loading specifications..." />}>
        <MaterialSpecificationsList 
          projectFilter={projectId}
          projects={[project]}
          teamMembers={[]}
          showProjectFilter={false}
        />
      </Suspense>
    </Box>
  );
};

export default ProjectSpecifications;