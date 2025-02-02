const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const EMI = require('../models/EMI');

// Calculate EMI
router.post('/calculate', protect, async (req, res) => {
  try {
    const { principal, rate, tenure } = req.body;

    // Validate inputs
    if (!principal || !rate || !tenure) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide principal amount, interest rate, and tenure'
      });
    }

    // Convert annual rate to monthly rate
    const monthlyRate = (rate / 12) / 100;

    // Calculate EMI using formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    // where P = Principal, r = monthly rate, n = tenure in months
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);

    // Calculate total payment and interest
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - principal;

    // Create EMI record
    const emiRecord = await EMI.create({
      user: req.user._id,
      principal,
      rate,
      tenure,
      emi: Math.round(emi * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100
    });

    // Generate amortization schedule
    const schedule = [];
    let remainingPrincipal = principal;
    let month = 1;

    while (month <= tenure) {
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = emi - interestPayment;
      remainingPrincipal -= principalPayment;

      schedule.push({
        month,
        emi: Math.round(emi * 100) / 100,
        principal: Math.round(principalPayment * 100) / 100,
        interest: Math.round(interestPayment * 100) / 100,
        balance: Math.round(remainingPrincipal * 100) / 100
      });

      month++;
    }

    res.status(201).json({
      status: 'success',
      data: {
        emi: emiRecord,
        schedule
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get EMI calculation history
router.get('/history', protect, async (req, res) => {
  try {
    const history = await EMI.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      status: 'success',
      data: history
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get specific EMI calculation
router.get('/:id', protect, async (req, res) => {
  try {
    const emi = await EMI.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!emi) {
      return res.status(404).json({
        status: 'error',
        message: 'EMI calculation not found'
      });
    }

    res.json({
      status: 'success',
      data: emi
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete EMI calculation
router.delete('/:id', protect, async (req, res) => {
  try {
    const emi = await EMI.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!emi) {
      return res.status(404).json({
        status: 'error',
        message: 'EMI calculation not found'
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

module.exports = router;
