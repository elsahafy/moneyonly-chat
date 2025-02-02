const jwt = require('jsonwebtoken');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Token blacklist to prevent reuse of invalidated tokens
const tokenBlacklist = new Set();

exports.protect = async (req, res, next) => {
  try {
    // Validate Authorization header format
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid authorization header format'
      });
    }

    // Extract token
    const token = req.headers.authorization.split(' ')[1];

    // Check if token exists and is not blacklisted
    if (!token || token === 'null') {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        status: 'error',
        message: 'Token is no longer valid'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User no longer exists'
        });
      }

      // Check if user changed password after token was issued
      if (user.passwordChangedAt) {
        const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
        
        // If password was changed after token was issued
        if (decoded.iat < changedTimestamp) {
          return res.status(401).json({
            status: 'error',
            message: 'User recently changed password. Please log in again'
          });
        }
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'User account is deactivated'
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      // Handle JWT verification errors
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token'
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token expired'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication'
    });
  }
};

// Optional: Add role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to perform this action'
      });
    }
    next();
  };
};

// Optional: Add additional rate limiting for sensitive routes
exports.sensitiveRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests for this sensitive route'
  }
});

// Middleware to blacklist token on logout
exports.logout = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    tokenBlacklist.add(token);
  }
  
  next();
};
