import React from 'react';
import PlaceholderPage from '../components/common/PlaceholderPage';
import { Assignment } from '@mui/icons-material';

const MyWorkPage = () => {
  return (
    <PlaceholderPage
      title="My Work"
      description="Personal workspace showing your assigned tasks, projects, and deliverables with priority management and progress tracking."
      icon={Assignment}
      expectedCompletion="Phase 10 - Q1 2024"
      features={[
        "Personalized task dashboard",
        "My assigned projects overview",
        "Priority task sorting and filtering",
        "Personal workload analytics",
        "Time tracking and logging",
        "Personal productivity metrics",
        "Deadline and milestone tracking",
        "Custom work views and filters"
      ]}
      suggestedAlternatives={[
        { label: "View All Tasks", path: "/tasks" },
        { label: "Check Projects", path: "/projects" },
        { label: "Return to Dashboard", path: "/dashboard" }
      ]}
    />
  );
};

export default MyWorkPage;