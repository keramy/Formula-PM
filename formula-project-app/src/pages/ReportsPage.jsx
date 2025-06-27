import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Reports as ReportsIcon,
  Plus as AddIcon,
  MagicWand as AutoIcon,
  List as ListIcon,
  GraphUp as AnalyticsIcon
} from 'iconoir-react';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import AutoReportGenerator from '../features/reports/components/AutoReportGenerator';
import ReportsList from '../features/reports/components/ReportsList';
import ReportEditor from '../features/reports/components/ReportEditor';
import { useAuth } from '../context/AuthContext';
import reportService from '../features/reports/services/reportService';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('all-reports');
  const [showAutoGenerator, setShowAutoGenerator] = useState(false);
  const [showReportEditor, setShowReportEditor] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load reports on component mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const reportsData = await reportService.getAllReports();
      setReports(reportsData);
      setError(null);
    } catch (err) {
      setError('Failed to load reports: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAutoReport = () => {
    setShowAutoGenerator(true);
  };

  const handleCreateManualReport = () => {
    setShowReportEditor(true);
  };

  const handleReportGenerated = (newReport) => {
    setReports(prev => [newReport, ...prev]);
    setShowAutoGenerator(false);
  };

  const handleReportCreated = (newReport) => {
    setReports(prev => [newReport, ...prev]);
    setShowReportEditor(false);
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await reportService.deleteReport(reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (err) {
      setError('Failed to delete report: ' + err.message);
    }
  };

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        variant="outlined"
        startIcon={<AutoIcon />}
        onClick={handleCreateAutoReport}
        sx={{ mr: 1 }}
      >
        Auto Generate
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleCreateManualReport}
      >
        Create Report
      </Button>
    </Box>
  );

  const tabs = (
    <>
      <CleanTab 
        label="All Reports" 
        isActive={activeTab === 'all-reports'}
        onClick={() => setActiveTab('all-reports')}
        icon={<ListIcon sx={{ fontSize: 16 }} />}
        badge={reports.length}
      />
      <CleanTab 
        label="Auto Generated" 
        isActive={activeTab === 'auto-generated'}
        onClick={() => setActiveTab('auto-generated')}
        icon={<AutoIcon sx={{ fontSize: 16 }} />}
        badge={reports.filter(r => r.type === 'auto-generated').length}
      />
      <CleanTab 
        label="Manual Reports" 
        isActive={activeTab === 'manual'}
        onClick={() => setActiveTab('manual')}
        icon={<ReportsIcon sx={{ fontSize: 16 }} />}
        badge={reports.filter(r => r.type === 'manual').length}
      />
      <CleanTab 
        label="Analytics" 
        isActive={activeTab === 'analytics'}
        onClick={() => setActiveTab('analytics')}
        icon={<AnalyticsIcon sx={{ fontSize: 16 }} />}
      />
    </>
  );

  const renderTabContent = () => {
    const filteredReports = (() => {
      switch (activeTab) {
        case 'auto-generated':
          return reports.filter(r => r.type === 'auto-generated');
        case 'manual':
          return reports.filter(r => r.type === 'manual');
        case 'analytics':
          return []; // Analytics view - different component
        default:
          return reports;
      }
    })();

    if (activeTab === 'analytics') {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Card sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
            <CardContent>
              <AnalyticsIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Report Analytics Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Advanced analytics and insights for your reports are coming soon. 
                This will include report performance metrics, usage statistics, and AI-powered insights.
              </Typography>
              <Alert severity="info">
                <strong>Coming in Phase 11:</strong> Advanced reporting analytics with 
                AI-powered insights, performance metrics, and automated recommendations.
              </Alert>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return (
      <ReportsList
        reports={filteredReports}
        loading={loading}
        onDeleteReport={handleDeleteReport}
        onEditReport={(report) => {
          // Handle edit logic here
          console.log('Edit report:', report);
        }}
        onViewReport={(report) => {
          // Handle view logic here
          console.log('View report:', report);
        }}
        onRefresh={loadReports}
      />
    );
  };

  return (
    <>
      <CleanPageLayout
        title="Reports & Analytics"
        subtitle="Create and manage project reports with AI-powered automation"
        breadcrumbs={[
          { label: 'Team Space', href: '/workspace' },
          { label: 'Reports', href: '/reports' }
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

      {/* Auto Report Generator Dialog */}
      <Dialog
        open={showAutoGenerator}
        onClose={() => setShowAutoGenerator(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoIcon color="primary" />
            Auto Report Generator
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <AutoReportGenerator
            projectId={selectedProject?.id}
            onReportGenerated={handleReportGenerated}
            onClose={() => setShowAutoGenerator(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Manual Report Editor Dialog */}
      <Dialog
        open={showReportEditor}
        onClose={() => setShowReportEditor(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportsIcon color="primary" />
            Create New Report
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <ReportEditor
            onReportCreated={handleReportCreated}
            onCancel={() => setShowReportEditor(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportsPage;