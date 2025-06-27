import React from 'react';
import PlaceholderPage from '../components/common/PlaceholderPage';
import { NotificationsActive } from '@mui/icons-material';

const UpdatesPage = () => {
  return (
    <PlaceholderPage
      title="Updates & Notifications"
      description="Stay informed about project changes, task assignments, and team activities with our comprehensive updates feed."
      icon={NotificationsActive}
      expectedCompletion="Phase 10 - Q2 2024"
      features={[
        "Real-time project updates and notifications",
        "Task assignment and completion alerts",
        "Project milestone notifications",
        "Team member activity feeds",
        "Customizable notification preferences",
        "Email and in-app notification sync",
        "Update filtering and categorization"
      ]}
      suggestedAlternatives={[
        { label: "View Dashboard", path: "/dashboard" },
        { label: "Check Projects", path: "/projects" },
        { label: "Review Tasks", path: "/tasks" }
      ]}
    />
  );
};

export default UpdatesPage;