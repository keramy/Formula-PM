const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In production, these should come from a database
// For now, we'll use in-memory storage with hashed passwords
const users = [
  {
    id: 'USER001',
    email: 'admin@formulapm.com',
    // Password: admin123 (hashed)
    password: '$2a$10$rBEPJdD6P6hYrxJiP6EF9uO92FkNqH.K7rLqGYb.DMmGLEGNmFoFq',
    name: 'Formula Admin',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    department: 'Management'
  },
  {
    id: 'USER002',
    email: 'pm@formulapm.com',
    // Password: pm123 (hashed)
    password: '$2a$10$YJ4Jm8WZpJR9gKlFz1kYJ.Qev0kF8IxKhO2N6bDmLr1J6IaGBgU9G',
    name: 'Sarah Wilson',
    role: 'project_manager',
    avatar: '/avatars/pm1.jpg',
    department: 'Projects',
    assignedProjects: ['P001', 'P002']
  }
];

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Prepare user data (exclude password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user data (exclude password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during verification'
    });
  }
});

// Refresh token endpoint
router.post('/refresh', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Verify current token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new token
    const newToken = generateToken(user);

    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during token refresh'
    });
  }
});

// Logout endpoint (optional - mainly for server-side session invalidation)
router.post('/logout', (req, res) => {
  // In a production app, you might want to:
  // - Add the token to a blacklist
  // - Invalidate server-side sessions
  // - Clear refresh tokens from database
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;