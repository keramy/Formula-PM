import React from 'react';
import PlaceholderPage from '../components/common/PlaceholderPage';
import { ShoppingCart } from '@mui/icons-material';

const ProcurementPage = () => {
  return (
    <PlaceholderPage
      title="Procurement Management"
      description="Streamlined procurement process for materials, equipment, and services with vendor management and purchase order tracking."
      icon={ShoppingCart}
      expectedCompletion="Phase 13 - Q3 2024"
      features={[
        "Purchase order management",
        "Vendor and supplier directory",
        "Quote comparison tools",
        "Approval workflow automation",
        "Inventory and stock tracking",
        "Cost analysis and budgeting",
        "Delivery scheduling and tracking",
        "Integration with material specifications"
      ]}
      suggestedAlternatives={[
        { label: "View Material Specs", path: "/material-specs" },
        { label: "Check Projects", path: "/projects" },
        { label: "Return to Dashboard", path: "/dashboard" }
      ]}
    />
  );
};

export default ProcurementPage;