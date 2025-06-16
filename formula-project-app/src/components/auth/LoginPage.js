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
  Avatar
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Business
} from '@mui/icons-material';
import { useAuth, USER_ROLES } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Grid container maxWidth="lg" spacing={4}>
        {/* Login Form */}
        <Grid item xs={12} md={6}>
          <Card elevation={8} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    margin: '0 auto 16px',
                    bgcolor: 'primary.main'
                  }}
                >
                  <Business fontSize="large" />
                </Avatar>
                <Typography variant="h4" fontWeight={700} color="primary">
                  Formula PM
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Project Management System
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
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
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
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
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
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
                  sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 600 }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Demo Accounts */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.95)' }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Demo Accounts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Click any account below to auto-fill login credentials
            </Typography>

            {demoAccounts.map((demo, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    borderColor: demo.color
                  }
                }}
                onClick={() => fillDemoCredentials(demo)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    {demo.icon}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {demo.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {demo.email}
                </Typography>
              </Paper>
            ))}

            <Alert severity="info" sx={{ mt: 3 }}>
              <strong>Note:</strong> This is a demo system. In production, these would be replaced with secure authentication.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;