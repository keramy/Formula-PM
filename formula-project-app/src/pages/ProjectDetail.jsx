import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';
import CleanPageLayout from '../components/layout/CleanPageLayout';

const ProjectDetail = () => {
  const { projectId } = useParams();

  return (
    <CleanPageLayout
      title="Project Detail"
      subtitle={`Detailed view for project ${projectId}`}
      breadcrumbs={[
        { label: 'Projects', href: '/projects' },
        { label: 'Project Detail', href: `/projects/${projectId}` }
      ]}
    >
      <Box className="clean-fade-in">
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Project Information
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Project ID: {projectId}
            </Typography>
            {/* Add your project detail content here */}
          </CardContent>
        </Card>
      </Box>
    </CleanPageLayout>
  );
};

export default ProjectDetail;