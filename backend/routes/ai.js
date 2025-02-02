const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const aiService = require('../ai/ai_service');

// Get spending predictions
router.get('/predictions', protect, async (req, res) => {
  try {
    const predictions = await aiService.getPredictions(req.user._id);
    res.json({
      status: 'success',
      data: predictions
    });
  } catch (error) {
    console.error('Error in predictions route:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error generating predictions'
    });
  }
});

// Get budget optimization suggestions
router.get('/optimize-budget', protect, async (req, res) => {
  try {
    const optimizations = await aiService.getOptimizations(req.user._id);
    res.json({
      status: 'success',
      data: optimizations
    });
  } catch (error) {
    console.error('Error in optimize-budget route:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error generating budget optimizations'
    });
  }
});

// Get financial insights
router.get('/insights', protect, async (req, res) => {
  try {
    const insights = await aiService.getInsights(req.user._id);
    res.json({
      status: 'success',
      data: insights
    });
  } catch (error) {
    console.error('Error in insights route:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error generating insights'
    });
  }
});

module.exports = router;
