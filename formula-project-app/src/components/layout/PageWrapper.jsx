import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import UniversalBreadcrumb from '../ui/UniversalBreadcrumb';
import { useNavigation } from '../../context';

const PageWrapper = ({ 
  // Page identification
  pageType,
  pageTitle,
  pageData = {},
  
  // Navigation
  parentPath,
  onNavigate,
  
  // Breadcrumb customization
  subtitle,
  actions = [],
  
  // Favorites
  isStarred = false,
  onToggleStar,
  
  // Action handlers
  onEdit,
  onDelete,
  onShare,
  
  // Content
  children,
  
  // Styling
  showBreadcrumb = true,
  breadcrumbElevation = 0,
  contentPadding = 3
}) => {
  const { navigateTo, getBreadcrumbConfig } = useNavigation();

  // Update navigation context when page loads
  useEffect(() => {
    if (pageType && pageTitle) {
      navigateTo({
        title: pageTitle,
        path: window.location.pathname,
        type: pageType,
        parentPath,
        data: pageData
      });
    }
  }, [pageType, pageTitle, parentPath, pageData, navigateTo]);

  // Handle navigation events
  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // Default navigation behavior - update URL and trigger route change
      window.history.pushState({}, '', path);
      // You might want to trigger a route change event here
      // depending on your routing solution
    }
  };

  const breadcrumbConfig = getBreadcrumbConfig();

  return (
    <Box sx={{ minHeight: '100vh', backgroundPalette: '#F8F9FA' }}>
      {/* Universal Breadcrumb */}
      {showBreadcrumb && (
        <UniversalBreadcrumb
          currentPath={breadcrumbConfig.currentPath}
          title={pageTitle}
          subtitle={subtitle}
          itemType={pageType}
          itemData={pageData}
          actions={actions}
          isStarred={isStarred}
          onToggleStar={onToggleStar}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
          onNavigate={handleNavigate}
          elevation={breadcrumbElevation}
        />
      )}

      {/* Page Content */}
      <Box sx={{ p: contentPadding }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageWrapper;