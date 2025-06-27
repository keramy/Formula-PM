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
  Building as DrawingsIcon,
  Plus as AddIcon,
  Upload as UploadIcon,
  Folder as FolderIcon,
  Reports as ReportIcon
} from 'iconoir-react';
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
    uploadDrawing,
    updateDrawing,
    deleteDrawing,
    refreshDrawings
  } = useShopDrawings();

  // Load drawings on component mount
  useEffect(() => {
    refreshDrawings();
  }, [refreshDrawings]);

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
        icon={<FolderIcon sx={{ fontSize: 16 }} />}
        badge={drawings.length}
      />
      <CleanTab 
        label="Pending Review" 
        isActive={activeTab === 'pending-review'}
        onClick={() => setActiveTab('pending-review')}
        icon={<DrawingsIcon sx={{ fontSize: 16 }} />}
        badge={drawings.filter(d => d.status === 'pending_review').length}
      />
      <CleanTab 
        label="Approved" 
        isActive={activeTab === 'approved'}
        onClick={() => setActiveTab('approved')}
        icon={<DrawingsIcon sx={{ fontSize: 16 }} />}
        badge={drawings.filter(d => d.status === 'approved').length}
      />
      <CleanTab 
        label="Reports" 
        isActive={activeTab === 'reports'}
        onClick={() => setActiveTab('reports')}
        icon={<ReportIcon sx={{ fontSize: 16 }} />}
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
        onViewDrawing={handleViewDrawing}
        onEditDrawing={(drawing) => {
          // Handle edit logic
          console.log('Edit drawing:', drawing);
        }}
        onDeleteDrawing={(drawingId) => {
          deleteDrawing(drawingId);
        }}
        onUploadDrawing={(files) => {
          uploadDrawing(files);
        }}
        onApproveDrawing={(drawingId) => {
          updateDrawing(drawingId, { status: 'approved' });
        }}
        onRejectDrawing={(drawingId, comments) => {
          updateDrawing(drawingId, { 
            status: 'rejected', 
            rejectionComments: comments 
          });
        }}
        onRefresh={refreshDrawings}
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
              onClose={() => setShowDetailDialog(false)}
              onUpdate={(updatedDrawing) => {
                updateDrawing(selectedDrawing.id, updatedDrawing);
                setSelectedDrawing(updatedDrawing);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShopDrawingsPage;