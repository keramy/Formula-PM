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
  Category as CategoryIcon,
  Reports as ReportIcon,
  Table as ExcelIcon
} from 'iconoir-react';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import MaterialSpecificationsList from '../features/specifications/components/MaterialSpecificationsList';
import { useAuth } from '../context/AuthContext';

const MaterialSpecsPage = () => {
  const [activeTab, setActiveTab] = useState('all-specs');
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load specifications on component mount
  useEffect(() => {
    loadSpecifications();
  }, []);

  const loadSpecifications = async () => {
    try {
      setLoading(true);
      // In a real app, this would load from the material specs service
      setSpecs([]);
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
    if (activeTab === 'reports') {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Card sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
            <CardContent>
              <ReportIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Material Specifications Reports
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Advanced reporting for material specifications including cost analysis, 
                supplier performance metrics, and sustainability tracking.
              </Typography>
              <Alert severity="info">
                <strong>Coming in Phase 12:</strong> Comprehensive material reporting with 
                cost tracking, supplier analysis, and sustainability certifications.
              </Alert>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return (
      <MaterialSpecificationsList
        specifications={getFilteredSpecs()}
        loading={loading}
        viewMode={activeTab === 'by-category' ? 'category' : 'list'}
        onCreateSpec={() => {
          console.log('Create spec from list');
        }}
        onEditSpec={(spec) => {
          console.log('Edit spec:', spec);
        }}
        onDeleteSpec={(specId) => {
          setSpecs(prev => prev.filter(s => s.id !== specId));
        }}
        onImportSpecs={(file) => {
          console.log('Import specs from file:', file);
        }}
        onExportSpecs={() => {
          console.log('Export specifications');
        }}
        onApproveSpec={(specId) => {
          setSpecs(prev => prev.map(s => 
            s.id === specId ? { ...s, status: 'approved' } : s
          ));
        }}
        onRefresh={loadSpecifications}
      />
    );
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