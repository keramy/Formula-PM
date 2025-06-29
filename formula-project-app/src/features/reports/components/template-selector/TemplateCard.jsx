/**
 * Template Card Component - Individual template card display
 * Extracted from SmartTemplateSelector for better modularity
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import {
  FaEye,
  FaClone,
  FaEdit,
  FaTrash,
  FaMagic
} from 'react-icons/fa';

const TemplateCard = ({
  template,
  isSelected,
  recommendation,
  suitabilityScore,
  analysisResult,
  showCustomization,
  onTemplateSelect,
  onPreviewTemplate,
  onEditTemplate,
  onDeleteTemplate
}) => {
  const IconComponent = template.icon;
  const isRecommended = !!recommendation;

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        border: isSelected ? 2 : 1,
        borderPalette: isSelected ? 'primary.main' : 'divider',
        '&:hover': { 
          boxShadow: 3,
          borderPalette: 'primary.light'
        },
        position: 'relative'
      }}
      onClick={() => onTemplateSelect(template)}
    >
      {/* Recommendation Badge */}
      {isRecommended && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <Chip
            icon={<FaMagic />}
            label={`${Math.round(recommendation.confidence * 100)}% Match`}
            size="small"
            sx={{
              bgcolor: recommendation.confidence > 0.8 ? 'success.main' : 'warning.main',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: 'right', 
              mt: 0.5,
              px: 1,
              color: 'text.secondary',
              fontSize: '0.7rem'
            }}
          >
            {recommendation.reason}
          </Typography>
        </Box>
      )}

      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconComponent 
            size={24} 
            color={template.color}
            style={{ marginRight: 12 }}
          />
          <Typography variant="h6" component="h3">
            {template.name}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {template.description}
        </Typography>

        {/* Suitability Score */}
        {analysisResult && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" gutterBottom>
              Suitability Score: {suitabilityScore}%
            </Typography>
            <Box sx={{ 
              width: '100%', 
              height: 4, 
              bgcolor: 'grey.300', 
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                width: `${suitabilityScore}%`, 
                height: '100%', 
                bgcolor: suitabilityScore > 70 ? 'success.main' : suitabilityScore > 40 ? 'warning.main' : 'error.main',
                transition: 'width 0.3s ease'
              }} />
            </Box>
          </Box>
        )}

        {/* Features */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" gutterBottom>
            Features:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {template.features?.slice(0, 3).map(feature => (
              <Chip 
                key={feature} 
                label={feature} 
                size="small" 
                variant="outlined"
              />
            ))}
            {template.features?.length > 3 && (
              <Chip 
                label={`+${template.features.length - 3} more`} 
                size="small" 
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {/* Sections Count */}
        <Typography variant="caption" color="text.secondary">
          {template.sections?.length || 0} sections • Est. {template.estimatedTime || '2-3 minutes'}
        </Typography>
      </CardContent>

      <CardActions>
        <Button 
          size="small" 
          startIcon={<FaEye />}
          onClick={(e) => {
            e.stopPropagation();
            onPreviewTemplate(template);
          }}
        >
          Preview
        </Button>
        
        {showCustomization && (
          <Button 
            size="small" 
            startIcon={template.isBuiltIn ? <FaClone /> : <FaEdit />}
            onClick={(e) => {
              e.stopPropagation();
              onEditTemplate(template);
            }}
          >
            {template.isBuiltIn ? 'Customize' : 'Edit'}
          </Button>
        )}

        {!template.isBuiltIn && (
          <IconButton 
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTemplate(template.id);
            }}
          >
            <FaTrash />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default TemplateCard;