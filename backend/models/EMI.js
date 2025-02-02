const mongoose = require('mongoose');

const EMISchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  principal: {
    type: Number,
    required: [true, 'Principal amount is required']
  },
  rate: {
    type: Number,
    required: [true, 'Interest rate is required']
  },
  tenure: {
    type: Number,
    required: [true, 'Loan tenure is required']
  },
  emi: {
    type: Number,
    required: true
  },
  totalPayment: {
    type: Number,
    required: true
  },
  totalInterest: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
EMISchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('EMI', EMISchema);
