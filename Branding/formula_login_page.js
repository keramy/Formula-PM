// components/auth/FormulaLoginPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Brightness4,
  Brightness7,
  Email,
  Lock,
  Business,
  Google,
  Microsoft,
} from '@mui/icons-material';
import { FormulaLogoBranded, FormulaLogoWithTagline } from '../branding/LogoVariations';

const FormulaLoginPage = ({
  onLogin,
  onForgotPassword,
  onSignUp,
  darkMode = false,
  onToggleDarkMode,
  loading = false,
  error = null,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    const value = field === 'rememberMe' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      onLogin?.(formData);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  };

  const backgroundStyles = {
    minHeight: '100vh',
    background: darkMode 
      ? 'linear-gradient(135deg, #0F1729 0%, #1B2951 50%, #2A3A5C 100%)'
      : 'linear-gradient(135deg, #FDFCFA 0%, #F5F2E8 50%, #E8E2D5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    position: 'relative',
    overflow: 'hidden',
  };

  const cardStyles = {
    maxWidth: 450,
    width: '100%',
    backgroundColor: darkMode ? '#1B2951' : '#FFFFFF',
    border: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
    borderRadius: 3,
    boxShadow: darkMode 
      ? '0 20px 40px rgba(0, 0, 0, 0.3)'
      : '0 20px 40px rgba(27, 41, 81, 0.1)',
    overflow: 'hidden',
  };

  return (
    <Box sx={backgroundStyles}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: darkMode 
            ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            : 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231B2951" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      {/* Theme Toggle */}
      <IconButton
        onClick={onToggleDarkMode}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: darkMode ? '#F5F2E8' : '#1B2951',
          backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.1)' : 'rgba(27, 41, 81, 0.1)',
          '&:hover': {
            backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.2)' : 'rgba(27, 41, 81, 0.2)',
          },
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      {/* Login Card */}
      <Card sx={cardStyles} elevation={0}>
        {/* Header */}
        <Box
          sx={{
            background: darkMode 
              ? 'linear-gradient(135deg, #1B2951 0%, #566BA3 100%)'
              : 'linear-gradient(135deg, #1B2951 0%, #566BA3 100%)',
            padding: 4,
            textAlign: 'center',
          }}
        >
          <FormulaLogoWithTagline
            darkMode={true} // Always use light text on gradient background
            tagline="Project Management Platform"
            size="large"
          />
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Welcome Text */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: darkMode ? '#F5F2E8' : '#1B2951',
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: darkMode ? '#E8E2D5' : '#566BA3',
                opacity: 0.8,
              }}
            >
              Sign in to continue to your workspace
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: darkMode ? 'rgba(220, 38, 38, 0.1)' : '#FEE2E2',
                color: darkMode ? '#FCA5A5' : '#DC2626',
                border: `1px solid ${darkMode ? '#DC2626' : '#FCA5A5'}`,
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: darkMode ? '#E8E2D5' : '#566BA3' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.05)' : 'rgba(27, 41, 81, 0.02)',
                  '& fieldset': {
                    borderColor: darkMode ? '#566BA3' : '#D1D8E6',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? '#E8E2D5' : '#1B2951',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: darkMode ? '#F5F2E8' : '#1B2951',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#E8E2D5' : '#566BA3',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#F5F2E8' : '#1B2951',
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: darkMode ? '#E8E2D5' : '#566BA3' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: darkMode ? '#E8E2D5' : '#566BA3' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.05)' : 'rgba(27, 41, 81, 0.02)',
                  '& fieldset': {
                    borderColor: darkMode ? '#566BA3' : '#D1D8E6',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? '#E8E2D5' : '#1B2951',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: darkMode ? '#F5F2E8' : '#1B2951',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#E8E2D5' : '#566BA3',
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#F5F2E8' : '#1B2951',
                },
              }}
            />

            {/* Remember Me & Forgot Password */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={handleInputChange('rememberMe')}
                    disabled={loading}
                    sx={{
                      color: darkMode ? '#E8E2D5' : '#566BA3',
                      '&.Mui-checked': {
                        color: darkMode ? '#F5F2E8' : '#1B2951',
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: darkMode ? '#E8E2D5' : '#566BA3' }}
                  >
                    Remember me
                  </Typography>
                }
              />
              
              <Button
                variant="text"
                onClick={onForgotPassword}
                disabled={loading}
                sx={{
                  color: darkMode ? '#F5F2E8' : '#1B2951',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot password?
              </Button>
            </Box>

            {/* Sign In Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                height: 48,
                backgroundColor: darkMode ? '#F5F2E8' : '#1B2951',
                color: darkMode ? '#1B2951' : '#F5F2E8',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '1rem',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: darkMode ? '#E8E2D5' : '#566BA3',
                },
                '&:disabled': {
                  backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.3)' : 'rgba(27, 41, 81, 0.3)',
                },
              }}
            >
              {loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ color: darkMode ? '#1B2951' : '#F5F2E8' }} 
                />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ 
            my: 3,
            '&::before, &::after': {
              borderColor: darkMode ? '#566BA3' : '#D1D8E6',
            },
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#E8E2D5' : '#566BA3',
                px: 2,
              }}
            >
              Or continue with
            </Typography>
          </Divider>

          {/* Social Login Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              startIcon={<Google />}
              sx={{
                height: 44,
                borderColor: darkMode ? '#566BA3' : '#D1D8E6',
                color: darkMode ? '#F5F2E8' : '#1B2951',
                textTransform: 'none',
                '&:hover': {
                  borderColor: darkMode ? '#F5F2E8' : '#1B2951',
                  backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.05)' : 'rgba(27, 41, 81, 0.05)',
                },
              }}
            >
              Google
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialLogin('microsoft')}
              disabled={loading}
              startIcon={<Microsoft />}
              sx={{
                height: 44,
                borderColor: darkMode ? '#566BA3' : '#D1D8E6',
                color: darkMode ? '#F5F2E8' : '#1B2951',
                textTransform: 'none',
                '&:hover': {
                  borderColor: darkMode ? '#F5F2E8' : '#1B2951',
                  backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.05)' : 'rgba(27, 41, 81, 0.05)',
                },
              }}
            >
              Microsoft
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ color: darkMode ? '#E8E2D5' : '#566BA3' }}
            >
              Don't have an account?{' '}
              <Button
                variant="text"
                onClick={onSignUp}
                disabled={loading}
                sx={{
                  color: darkMode ? '#F5F2E8' : '#1B2951',
                  textTransform: 'none',
                  fontWeight: 500,
                  p: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up here
              </Button>
            </Typography>
          </Box>
        </CardContent>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            borderTop: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
            backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.02)' : 'rgba(27, 41, 81, 0.02)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? '#A8B8D1' : '#A8B8D1',
              opacity: 0.7,
              letterSpacing: '0.05em',
            }}
          >
            Formula International © 2025 • Secure Login
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default FormulaLoginPage;