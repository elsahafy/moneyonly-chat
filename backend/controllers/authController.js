const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const rateLimit = require('express-rate-limit');

// Token blacklist to prevent reuse of invalidated tokens
const tokenBlacklist = new Set();

// Rate limiting middleware for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later'
  }
});

// Middleware to check if token is blacklisted
const checkTokenBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({
      status: 'error',
      message: 'Token is no longer valid'
    });
  }
  
  next();
};

// Logout middleware to blacklist token
const logout = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    tokenBlacklist.add(token);
  }
  
  next();
};

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// Create and send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, currency } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    // Create new user with default preferences
    const user = await User.create({
      name,
      email,
      password,
      preferences: {
        currency: currency || 'USD',
        theme: 'light' // Default theme
      }
    });

    createSendToken(user, 201, res);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join('. ')
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        status: 'error',
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    res.status(400).json({
      status: 'error',
      message: error.message || 'Error creating user'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message || 'Error logging in'
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in'
      });
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: 'User recently changed password. Please log in again'
      });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { currency, theme } = req.body;
    
    // Validate preferences
    if (currency && !User.schema.path('preferences.currency').enumValues.includes(currency)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid currency'
      });
    }

    if (theme && !User.schema.path('preferences.theme').enumValues.includes(theme)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid theme'
      });
    }

    // Update user preferences
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    await user.updatePreferences({ currency, theme });

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message || 'Error updating preferences'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message || 'Error fetching user data'
    });
  }
};

// Export additional middleware
exports.authRateLimiter = authLimiter;
exports.checkTokenBlacklist = checkTokenBlacklist;
exports.logout = logout;
