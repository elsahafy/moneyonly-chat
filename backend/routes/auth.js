const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
// Apply rate limiting to authentication routes
router.use(authController.authRateLimiter);

// Apply token blacklist check
router.use(authController.checkTokenBlacklist);

router.use(authController.protect);
router.get('/me', authController.getMe);
router.patch('/preferences', authController.updatePreferences);

// Add logout route to blacklist token
router.post('/logout', authController.logout);

module.exports = router;
