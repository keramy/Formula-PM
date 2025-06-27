import React from 'react';
import PlaceholderPage from '../components/common/PlaceholderPage';
import { Timeline } from '@mui/icons-material';

const TimelinePage = () => {
  return (
    <PlaceholderPage
      title="Project Timeline"
      description="Comprehensive project timeline view with Gantt charts, milestone tracking, and critical path analysis for efficient project scheduling."
      icon={Timeline}
      expectedCompletion="Phase 11 - Q2 2024"
      features={[
        "Interactive Gantt chart visualization",
        "Project milestone tracking",
        "Critical path analysis",
        "Resource allocation timeline",
        "Dependency management",
        "Timeline filtering by project/team",
        "Export to PDF and other formats",
        "Real-time progress updates"
      ]}
      suggestedAlternatives={[
        { label: "View Projects", path: "/projects" },
        { label: "Check Tasks", path: "/tasks" },
        { label: "Return to Dashboard", path: "/dashboard" }
      ]}
    />
  );
};

export default TimelinePage;