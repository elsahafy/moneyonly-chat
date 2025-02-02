const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Account = require('../models/Account');

// Get all accounts for the authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id });
    res.json({
      status: 'success',
      data: accounts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create a new account
router.post('/', protect, async (req, res) => {
  try {
    const account = await Account.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json({
      status: 'success',
      data: account
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update an account
router.patch('/:id', protect, async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'Account not found'
      });
    }

    res.json({
      status: 'success',
      data: account
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete an account
router.delete('/:id', protect, async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'Account not found'
      });
    }

    res.json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get account balance history
router.get('/:id/balance-history', protect, async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'Account not found'
      });
    }

    // In a real app, you would fetch the balance history from a separate collection
    // For now, return a mock response
    res.json({
      status: 'success',
      data: {
        account: account._id,
        history: []
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
