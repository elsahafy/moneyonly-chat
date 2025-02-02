const express = require('express');
const EMI = require('../models/EMI');
const router = express.Router();

// Add EMI
router.post('/', async (req, res) => {
  try {
    const emi = new EMI(req.body);
    await emi.save();
    res.json(emi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;