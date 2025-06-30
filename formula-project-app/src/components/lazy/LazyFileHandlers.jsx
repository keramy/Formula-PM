import React, { lazy, Suspense } from 'react';
import { Box, Skeleton, Typography, CircularProgress } from '@mui/material';
import { MdPictureAsPdf } from 'react-icons/md';

// Lazy load heavy file handling components with error handling
const PDFViewer = lazy(() => 
  import('../../features/shop-drawings/components/PDFViewer').catch(() => ({
    default: () => <div>PDF Viewer not available</div>
  }))
);

// Loading skeletons for file components
const PDFSkeleton = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: 600,
      border: '2px dashed',
      borderColor: 'divider',
      borderRadius: 2,
      backgroundColor: 'background.paper'
    }}
  >
    <MdPictureAsPdf size={48} color="#666" />
    <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
      Loading PDF Viewer...
    </Typography>
    <CircularProgress sx={{ mt: 2 }} />
  </Box>
);

const ExportSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      <Skeleton width="50%" />
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Skeleton variant="rectangular" width={120} height={36} />
      <Skeleton variant="rectangular" width={120} height={36} />
      <Skeleton variant="rectangular" width={120} height={36} />
    </Box>
    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
  </Box>
);

// Dynamic import functions for heavy libraries
export const loadJSPDF = () => import('jspdf');
export const loadHtml2Canvas = () => import('html2canvas');
export const loadXLSX = () => import('xlsx');

// Lazy PDF viewer with enhanced loading
export const LazyPDFViewer = (props) => (
  <Suspense fallback={<PDFSkeleton />}>
    <PDFViewer {...props} />
  </Suspense>
);

// Lazy export functionality
export const LazyExportComponent = ({ 
  children, 
  fallback = <ExportSkeleton /> 
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Hook for lazy loading file handling libraries
export const useFileLibraries = () => {
  const [libraries, setLibraries] = React.useState({});
  const [loading, setLoading] = React.useState({});

  const loadLibrary = React.useCallback(async (libraryName) => {
    if (libraries[libraryName] || loading[libraryName]) {
      return libraries[libraryName];
    }

    setLoading(prev => ({ ...prev, [libraryName]: true }));

    try {
      let library;
      switch (libraryName) {
        case 'jspdf':
          library = await loadJSPDF();
          break;
        case 'html2canvas':
          library = await loadHtml2Canvas();
          break;
        case 'xlsx':
          library = await loadXLSX();
          break;
        default:
          throw new Error(`Unknown library: ${libraryName}`);
      }

      setLibraries(prev => ({ ...prev, [libraryName]: library }));
      setLoading(prev => ({ ...prev, [libraryName]: false }));
      return library;
    } catch (error) {
      console.error(`Failed to load ${libraryName}:`, error);
      setLoading(prev => ({ ...prev, [libraryName]: false }));
      throw error;
    }
  }, [libraries, loading]);

  return { loadLibrary, libraries, loading };
};

export default {
  LazyPDFViewer,
  LazyExportComponent,
  useFileLibraries,
  loadJSPDF,
  loadHtml2Canvas,
  loadXLSX
};