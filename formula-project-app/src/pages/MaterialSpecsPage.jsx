import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent
} from '@mui/material';
import {
  Package as MaterialsIcon,
  Plus as AddIcon,
  Upload as UploadIcon,
  TagOutline as CategoryIcon,
  Reports as ReportIcon,
  Table as ExcelIcon,
  UserBag as VendorIcon,
  Shield as ComplianceIcon,
  Template as TemplateIcon,
  Cart as ProcurementIcon
} from 'iconoir-react';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import MaterialSpecificationsList from '../features/specifications/components/MaterialSpecificationsList';
import VendorManagement from '../features/specifications/components/VendorManagement';
import ComplianceTracking from '../features/specifications/components/ComplianceTracking';
import SpecificationTemplates from '../features/specifications/components/SpecificationTemplates';
import ProcurementWorkflow from '../features/specifications/components/ProcurementWorkflow';
import MaterialSpecsReports from '../features/specifications/components/MaterialSpecsReports';
import apiService from '../services/api/apiService';
import { useAuth } from '../context/AuthContext';

const MaterialSpecsPage = () => {
  const [activeTab, setActiveTab] = useState('all-specs');
  const [specs, setSpecs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load specifications on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [specsData, projectsData, teamData] = await Promise.all([
        apiService.getMaterialSpecifications(),
        apiService.getProjects(),
        apiService.getTeamMembers()
      ]);
      
      setSpecs(specsData);
      setProjects(projectsData);
      setTeamMembers(teamData);
      setError(null);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecifications = async () => {
    try {
      setLoading(true);
      const specsData = await apiService.getMaterialSpecifications();
      setSpecs(specsData);
      setError(null);
    } catch (err) {
      setError('Failed to load specifications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpec = () => {
    console.log('Create specification triggered');
  };

  const handleImportSpecs = () => {
    console.log('Import specifications triggered');
  };

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        variant="outlined"
        startIcon={<ExcelIcon />}
        onClick={handleImportSpecs}
        sx={{ mr: 1 }}
      >
        Import Excel
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleCreateSpec}
      >
        New Specification
      </Button>
    </Box>
  );

  const tabs = (
    <>
      <CleanTab 
        label="All Specifications" 
        isActive={activeTab === 'all-specs'}
        onClick={() => setActiveTab('all-specs')}
        icon={<MaterialsIcon sx={{ fontSize: 16 }} />}
        badge={specs.length}
      />
      <CleanTab 
        label="By Category" 
        isActive={activeTab === 'by-category'}
        onClick={() => setActiveTab('by-category')}
        icon={<CategoryIcon sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Vendor Management" 
        isActive={activeTab === 'vendors'}
        onClick={() => setActiveTab('vendors')}
        icon={<VendorIcon sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Compliance Tracking" 
        isActive={activeTab === 'compliance'}
        onClick={() => setActiveTab('compliance')}
        icon={<ComplianceIcon sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Templates & Standards" 
        isActive={activeTab === 'templates'}
        onClick={() => setActiveTab('templates')}
        icon={<TemplateIcon sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Procurement" 
        isActive={activeTab === 'procurement'}
        onClick={() => setActiveTab('procurement')}
        icon={<ProcurementIcon sx={{ fontSize: 16 }} />}
      />
      <CleanTab 
        label="Pending Approval" 
        isActive={activeTab === 'pending'}
        onClick={() => setActiveTab('pending')}
        icon={<MaterialsIcon sx={{ fontSize: 16 }} />}
        badge={specs.filter(s => s.status === 'pending').length}
      />
      <CleanTab 
        label="Reports" 
        isActive={activeTab === 'reports'}
        onClick={() => setActiveTab('reports')}
        icon={<ReportIcon sx={{ fontSize: 16 }} />}
      />
    </>
  );

  const getFilteredSpecs = () => {
    switch (activeTab) {
      case 'pending':
        return specs.filter(s => s.status === 'pending');
      case 'by-category':
        return specs; // Would be grouped by category in the component
      case 'reports':
        return [];
      default:
        return specs;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vendors':
        return (
          <VendorManagement
            onVendorSelect={(vendor) => {
              console.log('Selected vendor:', vendor);
            }}
            specifications={specs}
          />
        );
      
      case 'compliance':
        return (
          <ComplianceTracking
            specifications={specs}
            onUpdateCompliance={(specId, complianceData) => {
              console.log('Update compliance:', specId, complianceData);
            }}
            onGenerateReport={(reportType) => {
              console.log('Generate compliance report:', reportType);
            }}
          />
        );
      
      case 'templates':
        return (
          <SpecificationTemplates
            onCreateFromTemplate={(template) => {
              console.log('Create specification from template:', template);
              // TODO: Implement creating spec from template
            }}
            onUpdateStandards={(standards) => {
              console.log('Update standards:', standards);
            }}
            categories={[...new Set(specs.map(spec => spec.category))]}
          />
        );
      
      case 'procurement':
        return (
          <ProcurementWorkflow
            specifications={specs}
            onCreatePurchaseOrder={(orderData) => {
              console.log('Create purchase order:', orderData);
            }}
            onUpdateOrderStatus={(orderId, status) => {
              console.log('Update order status:', orderId, status);
            }}
          />
        );
      
      case 'reports':
        return (
          <MaterialSpecsReports
            specifications={specs}
            vendors={[]} // TODO: Load vendor data
            purchaseOrders={[]} // TODO: Load purchase order data
            onGenerateReport={(reportType) => {
              console.log('Generate report:', reportType);
            }}
            onCalendarReport={(reportType) => {
              console.log('Calendar report:', reportType);
            }}
            onExportData={(format) => {
              console.log('Export data:', format);
            }}
          />
        );
      
      default:
        return (
          <MaterialSpecificationsList
            projects={projects}
            teamMembers={teamMembers}
            shopDrawings={[]} // TODO: Load shop drawings data
            specifications={getFilteredSpecs()}
            loading={loading}
            viewMode={activeTab === 'by-category' ? 'category' : 'list'}
            onCreateSpec={() => {
              console.log('Create spec from list');
            }}
            onEditSpec={(spec) => {
              console.log('Edit spec:', spec);
            }}
            onDeleteSpec={async (specId) => {
              try {
                await apiService.deleteMaterialSpecification(specId);
                setSpecs(prev => prev.filter(s => s.id !== specId));
              } catch (error) {
                console.error('Error deleting specification:', error);
                setError('Failed to delete specification');
              }
            }}
            onImportSpecs={(file) => {
              console.log('Import specs from file:', file);
            }}
            onExportSpecs={() => {
              console.log('Export specifications');
            }}
            onApproveSpec={async (specId) => {
              try {
                await apiService.updateMaterialSpecificationStatus(specId, 'approved');
                setSpecs(prev => prev.map(s => 
                  s.id === specId ? { ...s, status: 'approved' } : s
                ));
              } catch (error) {
                console.error('Error approving specification:', error);
                setError('Failed to approve specification');
              }
            }}
            onRefresh={loadSpecifications}
          />
        );
    }
  };

  return (
    <CleanPageLayout
      title="Material Specifications"
      subtitle="Manage material specifications, quality standards, and supplier information for millwork projects"
      breadcrumbs={[
        { label: 'Team Space', href: '/workspace' },
        { label: 'Material Specs', href: '/material-specs' }
      ]}
      headerActions={headerActions}
      tabs={tabs}
    >
      <Box className="clean-fade-in">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {renderTabContent()}
      </Box>
    </CleanPageLayout>
  );
};

export default MaterialSpecsPage;