import React from 'react';
import PlaceholderPage from '../components/common/PlaceholderPage';
import { Inbox } from '@mui/icons-material';

const InboxPage = () => {
  return (
    <PlaceholderPage
      title="Inbox"
      description="Centralized communication hub for messages, mentions, and important notifications requiring your attention."
      icon={Inbox}
      expectedCompletion="Phase 10 - Q2 2024"
      features={[
        "Centralized message management",
        "Direct messages and team communications",
        "Mention notifications (@username)",
        "Priority message filtering",
        "Message threading and replies",
        "File attachments and sharing",
        "Read/unread status tracking",
        "Integration with project discussions"
      ]}
      suggestedAlternatives={[
        { label: "View Dashboard", path: "/dashboard" },
        { label: "Check Team", path: "/team" },
        { label: "Review Projects", path: "/projects" }
      ]}
    />
  );
};

export default InboxPage;