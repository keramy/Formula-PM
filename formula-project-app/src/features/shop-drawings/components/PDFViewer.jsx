import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Toolbar,
  Button,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Expand as FitToScreenIcon,
  Download as DownloadIcon,
  Printer as PrintIcon,
  Cancel as CloseIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Expand as FullscreenIcon
} from 'iconoir-react';

const PDFViewer = ({ 
  pdfUrl, 
  fileName = 'Document.pdf',
  onClose,
  width = '100%',
  height = '600px' 
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleFitToScreen = () => {
    setZoom(100);
  };

  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // For demo purposes, we'll show a placeholder since we don't have actual PDF files
  const isPDFSupported = () => {
    return 'PDFObject' in window || navigator.pdfViewerEnabled;
  };

  const renderPDFContent = () => {
    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Failed to load PDF: {error}
        </Alert>
      );
    }

    if (!pdfUrl) {
      return (
        <Alert severity="info" sx={{ m: 2 }}>
          No PDF selected for viewing
        </Alert>
      );
    }

    // For now, we'll use an iframe approach for PDF viewing
    // In production, you might want to use react-pdf or pdf.js
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease'
        }}
      >
        {/* Placeholder for PDF content */}
        <Paper
          elevation={3}
          sx={{
            width: '210mm', // A4 width
            height: '297mm', // A4 height
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            border: '1px solid #ccc'
          }}
        >
          <Typography variant="h4" color="text.secondary" gutterBottom>
            Shop Drawing Preview
          </Typography>
          <Typography variant="h6" gutterBottom>
            {fileName}
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              This is a placeholder for the PDF viewer.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              In production, this would display the actual PDF content using:
            </Typography>
            <ul style={{ textAlign: 'left', color: '#666' }}>
              <li>react-pdf library for React PDF rendering</li>
              <li>PDF.js for browser-native PDF viewing</li>
              <li>Embedded iframe for simple PDF display</li>
            </ul>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Current zoom: {zoom}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current rotation: {rotation}°
            </Typography>
          </Box>
          
          {/* Sample millwork drawing elements */}
          <Box sx={{ mt: 4, p: 2, border: '2px solid #333', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              KITCHEN CABINET ELEVATION - REV C
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
              <Box sx={{ width: 60, height: 40, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption">UPPER</Typography>
              </Box>
              <Box sx={{ width: 60, height: 60, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption">BASE</Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontFamily: 'monospace' }}>
              SCALE: 1/4" = 1'-0"
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width,
        height: isFullscreen ? '100vh' : height,
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Toolbar */}
      <Toolbar 
        sx={{ 
          backgroundColor: '#37444B', 
          color: 'white',
          minHeight: '56px !important',
          gap: 1
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1rem' }}>
          {fileName}
        </Typography>
        
        <Typography variant="body2" sx={{ mr: 2 }}>
          {zoom}%
        </Typography>
        
        <Tooltip title="Zoom Out">
          <IconButton color="inherit" onClick={handleZoomOut} disabled={zoom <= 25}>
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Zoom In">
          <IconButton color="inherit" onClick={handleZoomIn} disabled={zoom >= 300}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Fit to Screen">
          <IconButton color="inherit" onClick={handleFitToScreen}>
            <FitToScreenIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
        
        <Tooltip title="Rotate Left">
          <IconButton color="inherit" onClick={handleRotateLeft}>
            <RotateLeftIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Rotate Right">
          <IconButton color="inherit" onClick={handleRotateRight}>
            <RotateRightIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
        
        <Tooltip title="Download">
          <IconButton color="inherit" onClick={handleDownload}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Print">
          <IconButton color="inherit" onClick={handlePrint}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <IconButton color="inherit" onClick={handleFullscreen}>
            <FullscreenIcon />
          </IconButton>
        </Tooltip>
        
        {onClose && (
          <Tooltip title="Close">
            <IconButton color="inherit" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
      
      {/* PDF Content Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          backgroundColor: '#e0e0e0'
        }}
      >
        {renderPDFContent()}
      </Box>
    </Paper>
  );
};

export default PDFViewer;