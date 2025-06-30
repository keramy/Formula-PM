import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  MdBusiness as DrawingsIcon,
  MdAdd as AddIcon,
  MdCloudUpload as UploadIcon,
  MdFolder as FolderIcon,
  MdDescription as ReportIcon
} from 'react-icons/md';
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';
import ShopDrawingsList from '../features/shop-drawings/components/ShopDrawingsList';
import ShopDrawingDetailPage from '../features/shop-drawings/components/ShopDrawingDetailPage';
import { useShopDrawings } from '../features/shop-drawings/hooks/useShopDrawings';
import { useAuth } from '../context/AuthContext';

const ShopDrawingsPage = () => {
  const [activeTab, setActiveTab] = useState('all-drawings');
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const {
    drawings,
    loading,
    loadDrawings,
    uploadDrawing,
    updateDrawing,
    deleteDrawing
  } = useShopDrawings();

  // Load drawings on component mount
  useEffect(() => {
    loadDrawings();
  }, [loadDrawings]);

  const handleViewDrawing = (drawing) => {
    setSelectedDrawing(drawing);
    setShowDetailDialog(true);
  };

  const handleUploadDrawing = () => {
    // This would trigger the upload dialog in ShopDrawingsList
    console.log('Upload drawing triggered');
  };

  const handleCreateDrawing = () => {
    // This would trigger the create new drawing flow
    console.log('Create drawing triggered');
  };

  // Mock projects data for ShopDrawingsList
  const mockProjects = [
    { id: 2001, name: 'Akbank Head Office Renovation' },
    { id: 2002, name: 'Garanti BBVA Branch Fit-out' },
    { id: 2003, name: 'Yapı Kredi Head Office' }
  ];

  // Mock team members data for ShopDrawingsList
  const mockTeamMembers = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Wilson' },
    { id: 3, name: 'Tom Anderson' },
    { id: 4, name: 'Lisa Chen' }
  ];

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={handleUploadDrawing}
        sx={{ mr: 1 }}
      >
        Upload CAD
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleCreateDrawing}
      >
        New Drawing
      </Button>
    </Box>
  );

  const tabs = (
    <>
      <CleanTab 
        label="All Drawings" 
        isActive={activeTab === 'all-drawings'}
        onClick={() => setActiveTab('all-drawings')}
        icon={<FolderIcon size={16} />}
        badge={drawings.length}
      />
      <CleanTab 
        label="Pending Review" 
        isActive={activeTab === 'pending-review'}
        onClick={() => setActiveTab('pending-review')}
        icon={<DrawingsIcon size={16} />}
        badge={drawings.filter(d => d.status === 'pending_review').length}
      />
      <CleanTab 
        label="Approved" 
        isActive={activeTab === 'approved'}
        onClick={() => setActiveTab('approved')}
        icon={<DrawingsIcon size={16} />}
        badge={drawings.filter(d => d.status === 'approved').length}
      />
      <CleanTab 
        label="Reports" 
        isActive={activeTab === 'reports'}
        onClick={() => setActiveTab('reports')}
        icon={<ReportIcon size={16} />}
      />
    </>
  );

  const getFilteredDrawings = () => {
    switch (activeTab) {
      case 'pending-review':
        return drawings.filter(d => d.status === 'pending_review');
      case 'approved':
        return drawings.filter(d => d.status === 'approved');
      case 'reports':
        return []; // Reports view would be different
      default:
        return drawings;
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'reports') {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
            📊 Shop Drawings Reports
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
            Advanced reporting for shop drawings approval workflows, revision tracking, 
            and project milestone analysis coming in Phase 12.
          </Typography>
          <Alert severity="info">
            <strong>Coming Soon:</strong> Detailed reports on drawing approval times, 
            revision frequency, and project milestone impact analysis.
          </Alert>
        </Box>
      );
    }

    return (
      <ShopDrawingsList
        drawings={getFilteredDrawings()}
        loading={loading}
        projects={mockProjects}
        teamMembers={mockTeamMembers}
        onViewDrawing={handleViewDrawing}
        onEditDrawing={(drawing) => {
          // Handle edit logic
          console.log('Edit drawing:', drawing);
        }}
        onDeleteDrawing={(drawingId) => {
          deleteDrawing(drawingId);
        }}
        onUploadDrawing={(formData) => {
          uploadDrawing(formData);
        }}
        onApproveDrawing={(drawingId) => {
          updateDrawing(drawingId, { status: 'approved' });
        }}
        onRejectDrawing={(drawingId, comments) => {
          updateDrawing(drawingId, { 
            status: 'revision_required', 
            rejectionComments: comments 
          });
        }}
        onRefresh={loadDrawings}
      />
    );
  };

  return (
    <>
      <CleanPageLayout
        title="Shop Drawings"
        subtitle="Manage CAD files, technical drawings, and approval workflows for millwork projects"
        breadcrumbs={[
          { label: 'Team Space', href: '/workspace' },
          { label: 'Shop Drawings', href: '/shop-drawings' }
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

      {/* Drawing Detail Dialog */}
      <Dialog
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DrawingsIcon color="primary" />
            {selectedDrawing?.title || 'Drawing Details'}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedDrawing && (
            <ShopDrawingDetailPage
              drawing={selectedDrawing}
              teamMembers={mockTeamMembers}
              onBack={() => setShowDetailDialog(false)}
              onUpdate={(drawingId, updatedDrawing) => {
                updateDrawing(drawingId, updatedDrawing);
                setSelectedDrawing({...selectedDrawing, ...updatedDrawing});
              }}
              onDelete={(drawingId) => {
                deleteDrawing(drawingId);
                setShowDetailDialog(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShopDrawingsPage;