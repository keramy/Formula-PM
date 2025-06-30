import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Chip,
  Grid,
  Paper,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  FaEye as Visibility,
  FaEyeSlash as VisibilityOff,
  FaEnvelope as Email,
  FaLock as Lock,
  FaBuilding as Business,
  FaMoon as Brightness4,
  FaSun as Brightness7
} from 'react-icons/fa';
import { useAuth, USER_ROLES } from '../../context/AuthContext';
import { FormulaLogoWithTagline } from '../branding/LogoVariations';
import { useTheme as useFormulaTheme } from '../../context/ThemeContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useFormulaTheme();
  const darkMode = isDarkMode;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const demoAccounts = [
    {
      role: 'Admin',
      email: 'admin@formulapm.com',
      password: 'admin123',
      description: 'Full system access - edit/delete everything',
      color: '#f44336',
      icon: '👑'
    },
    {
      role: 'Co-founder',
      email: 'cofounder@formulapm.com',
      password: 'cofounder123',
      description: 'View all projects and overall progress',
      color: '#9c27b0',
      icon: '👔'
    },
    {
      role: 'Project Manager',
      email: 'pm1@formulapm.com',
      password: 'pm123',
      description: 'Manage assigned projects (P001, P002)',
      color: '#2196f3',
      icon: '📋'
    }
  ];

  const fillDemoCredentials = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
  };

  // Formula International brand colors
  const colors = {
    background: darkMode 
      ? 'linear-gradient(135deg, #0F1729 0%, #1B2951 50%, #2A3A5C 100%)'
      : 'linear-gradient(135deg, #FDFCFA 0%, #F5F2E8 50%, #E8E2D5 100%)',
    cardBg: darkMode ? '#1B2951' : '#FFFFFF',
    cardBorder: darkMode ? '#566BA3' : '#D1D8E6',
    text: darkMode ? '#F5F2E8' : '#1B2951',
    subtext: darkMode ? '#E8E2D5' : '#566BA3',
    input: darkMode ? 'rgba(245, 242, 232, 0.05)' : 'rgba(27, 41, 81, 0.02)',
    accent: darkMode ? '#F5F2E8' : '#1B2951'
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
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
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: colors.text,
          backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.1)' : 'rgba(27, 41, 81, 0.1)',
          '&:hover': {
            backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.2)' : 'rgba(27, 41, 81, 0.2)',
          },
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      <Grid container maxWidth="lg" spacing={4}>
        {/* Login Form */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: darkMode 
                ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                : '0 20px 40px rgba(27, 41, 81, 0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <FormulaLogoWithTagline
                  darkMode={darkMode}
                  tagline="Project Management Platform"
                  size="medium"
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colors.text, 
                    mt: 3, 
                    mb: 1 
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: colors.subtext, 
                    opacity: 0.8 
                  }}
                >
                  Sign in to continue to your workspace
                </Typography>
              </Box>

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

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: colors.input,
                      '& fieldset': {
                        borderColor: colors.cardBorder,
                      },
                      '&:hover fieldset': {
                        borderColor: colors.text,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colors.subtext,
                    },
                    '& .MuiInputBase-input': {
                      color: colors.text,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: colors.subtext }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: colors.input,
                      '& fieldset': {
                        borderColor: colors.cardBorder,
                      },
                      '&:hover fieldset': {
                        borderColor: colors.text,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colors.subtext,
                    },
                    '& .MuiInputBase-input': {
                      color: colors.text,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: colors.subtext }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: colors.subtext }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    py: 1.5, 
                    fontSize: '1.1rem', 
                    fontWeight: 600,
                    backgroundColor: colors.accent,
                    color: darkMode ? '#1B2951' : '#F5F2E8',
                    '&:hover': {
                      backgroundColor: darkMode ? '#E8E2D5' : '#566BA3',
                    },
                    '&:disabled': {
                      backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.3)' : 'rgba(27, 41, 81, 0.3)',
                    },
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Demo Accounts */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: darkMode 
                ? '0 20px 40px rgba(0, 0, 0, 0.2)'
                : '0 20px 40px rgba(27, 41, 81, 0.08)',
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight={600} 
              gutterBottom
              sx={{ color: colors.text }}
            >
              Demo Accounts
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.subtext, 
                mb: 3, 
                opacity: 0.8 
              }}
            >
              Click any account below to auto-fill login credentials
            </Typography>

            {demoAccounts.map((demo, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${colors.cardBorder}`,
                  backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.02)' : 'rgba(27, 41, 81, 0.02)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: darkMode 
                      ? '0 8px 25px rgba(0, 0, 0, 0.2)'
                      : '0 8px 25px rgba(27, 41, 81, 0.1)',
                    borderColor: demo.color,
                    backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.05)' : 'rgba(27, 41, 81, 0.05)',
                  }
                }}
                onClick={() => fillDemoCredentials(demo)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    {demo.icon}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    sx={{ 
                      flexGrow: 1,
                      color: colors.text
                    }}
                  >
                    {demo.role}
                  </Typography>
                  <Chip
                    label="Click to use"
                    size="small"
                    sx={{
                      bgcolor: demo.color,
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1,
                    color: colors.subtext,
                    opacity: 0.8
                  }}
                >
                  {demo.description}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: colors.subtext,
                    opacity: 0.6
                  }}
                >
                  {demo.email}
                </Typography>
              </Paper>
            ))}

            <Alert 
              severity="info" 
              sx={{ 
                mt: 3,
                backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
                color: darkMode ? '#93C5FD' : '#1E40AF',
                border: `1px solid ${darkMode ? '#3B82F6' : '#93C5FD'}`,
              }}
            >
              <strong>Note:</strong> This is a demo system. In production, these would be replaced with secure authentication.
            </Alert>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: colors.subtext,
            opacity: 0.6,
            letterSpacing: '0.1em',
          }}
        >
          FORMULA INTERNATIONAL © 2025 • Secure Login
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;