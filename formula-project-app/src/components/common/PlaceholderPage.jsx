import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Alert,
  Button,
  Stack,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowBack, Dashboard } from '@mui/icons-material';

/**
 * Reusable placeholder page component for unimplemented features
 */
const PlaceholderPage = ({
  title,
  description,
  icon: IconComponent = Construction,
  expectedCompletion = "Coming Soon",
  features = [],
  suggestedAlternatives = []
}) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        {/* Icon and Status */}
        <Box sx={{ mb: 3 }}>
          <IconComponent 
            sx={{ 
              fontSize: 80, 
              color: 'primary.main', 
              mb: 2,
              opacity: 0.7 
            }} 
          />
          <Chip 
            label="Under Development" 
            color="warning" 
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Title and Description */}
        <Typography variant="h3" component="h1" gutterBottom>
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
        >
          {description}
        </Typography>

        {/* Expected Completion */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Expected Completion:</strong> {expectedCompletion}
          </Typography>
        </Alert>

        {/* Planned Features */}
        {features.length > 0 && (
          <Box sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              Planned Features:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {features.map((feature, index) => (
                <Typography 
                  key={index} 
                  component="li" 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {feature}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {/* Suggested Alternatives */}
        {suggestedAlternatives.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              In the meantime, you can:
            </Typography>
            <Stack spacing={1}>
              {suggestedAlternatives.map((alternative, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => navigate(alternative.path)}
                  startIcon={<Dashboard />}
                >
                  {alternative.label}
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        {/* Navigation Actions */}
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Dashboard />}
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PlaceholderPage;