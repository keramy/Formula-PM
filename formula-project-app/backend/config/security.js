/**
 * Security Configuration Module
 * Manages sensitive configurations with proper validation
 */

const crypto = require('crypto');

class SecurityConfig {
  constructor() {
    this.validateEnvironment();
    this.jwtConfig = this.initializeJwtConfig();
    this.sessionConfig = this.initializeSessionConfig();
  }

  /**
   * Validate required environment variables
   */
  validateEnvironment() {
    const required = ['JWT_SECRET', 'SESSION_SECRET'];
    const missing = required.filter(key => !process.env[key] || process.env[key] === 'your-super-secret-jwt-key-change-in-production');
    
    if (missing.length > 0) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Missing or default security configurations: ${missing.join(', ')}`);
      } else {
        console.warn('⚠️  WARNING: Using default security configurations for development');
        console.warn('⚠️  This is not safe for production!');
      }
    }
  }

  /**
   * Initialize JWT configuration with secure defaults
   */
  initializeJwtConfig() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Generate secure secret for development if not provided
    const jwtSecret = process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production' && isDevelopment
      ? this.generateSecureSecret('jwt-dev')
      : process.env.JWT_SECRET;

    return {
      secret: jwtSecret,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      algorithm: 'HS256',
      issuer: 'formula-pm',
      audience: 'formula-pm-api'
    };
  }

  /**
   * Initialize session configuration with secure defaults
   */
  initializeSessionConfig() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Generate secure secret for development if not provided
    const sessionSecret = process.env.SESSION_SECRET === 'your-session-secret-change-in-production' && isDevelopment
      ? this.generateSecureSecret('session-dev')
      : process.env.SESSION_SECRET;

    return {
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: !isDevelopment, // HTTPS only in production
        httpOnly: true,
        maxAge: 86400000, // 24 hours
        sameSite: 'strict'
      }
    };
  }

  /**
   * Generate a secure secret for development
   * @param {string} prefix - Prefix for the secret
   * @returns {string} Generated secret
   */
  generateSecureSecret(prefix) {
    const timestamp = Date.now().toString(36);
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${prefix}-${timestamp}-${randomBytes}`;
  }

  /**
   * Sign a JWT token with additional security checks
   * @param {Object} payload - Token payload
   * @param {Object} options - Additional JWT options
   * @returns {string} Signed token
   */
  signToken(payload, options = {}) {
    const jwt = require('jsonwebtoken');
    
    // Add security claims
    const securePayload = {
      ...payload,
      iss: this.jwtConfig.issuer,
      aud: this.jwtConfig.audience,
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(
      securePayload,
      this.jwtConfig.secret,
      {
        expiresIn: this.jwtConfig.expiresIn,
        algorithm: this.jwtConfig.algorithm,
        ...options
      }
    );
  }

  /**
   * Verify a JWT token with additional security checks
   * @param {string} token - Token to verify
   * @returns {Object} Decoded token
   */
  verifyToken(token) {
    const jwt = require('jsonwebtoken');
    
    return jwt.verify(token, this.jwtConfig.secret, {
      algorithms: [this.jwtConfig.algorithm],
      issuer: this.jwtConfig.issuer,
      audience: this.jwtConfig.audience
    });
  }

  /**
   * Get security headers for enhanced protection
   * @returns {Object} Security headers
   */
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': this.getContentSecurityPolicy()
    };
  }

  /**
   * Get Content Security Policy
   * @returns {string} CSP header value
   */
  getContentSecurityPolicy() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const policies = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for React dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' ws: wss: http://localhost:* https://api.formula-pm.com",
      "frame-ancestors 'none'"
    ];

    if (isDevelopment) {
      policies.push("upgrade-insecure-requests");
    }

    return policies.join('; ');
  }

  /**
   * Hash a password using bcrypt with secure settings
   * @param {string} password - Password to hash
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    const bcrypt = require('bcryptjs');
    const saltRounds = 12; // Increased from default 10
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain password
   * @param {string} hash - Password hash
   * @returns {Promise<boolean>} Match result
   */
  async comparePassword(password, hash) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate secure random token
   * @param {number} bytes - Number of bytes
   * @returns {string} Random token
   */
  generateSecureToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  /**
   * Sanitize user input to prevent injection attacks
   * @param {string} input - User input
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potential script tags and SQL injection attempts
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/['";\\]/g, '\\$&')
      .trim();
  }
}

// Export singleton instance
module.exports = new SecurityConfig();