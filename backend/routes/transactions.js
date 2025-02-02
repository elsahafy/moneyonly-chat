const express = require('express');
const Transaction = require('../models/Transaction');
const { authMiddleware } = require('./auth');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;
    const transaction = new Transaction({
      user: req.user.id,
      type,
      category,
      amount,
      date
    });

    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all transactions for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all transactions (Protected Route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get monthly expense summary
router.get('/summary/monthly', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.aggregate([
      { $match: { user: req.user.id, type: 'expense' } },
      { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get category-based spending summary
router.get('/summary/category', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.aggregate([
      { $match: { user: req.user.id, type: 'expense' } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } }
    ]);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;