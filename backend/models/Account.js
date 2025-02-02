const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
    maxlength: [50, 'Account name cannot exceed 50 characters']
  },
  type: {
    type: String,
    required: [true, 'Account type is required'],
    enum: {
      values: ['SAVINGS', 'CHECKING', 'CREDIT_CARD', 'LOAN', 'INVESTMENT'],
      message: '{VALUE} is not a valid account type'
    }
  },
  balance: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    enum: [
      'USD', // US Dollar
      'EUR', // Euro
      'GBP', // British Pound
      'INR', // Indian Rupee
      'AED', // UAE Dirham
      'SAR', // Saudi Riyal
      'QAR', // Qatari Riyal
      'KWD', // Kuwaiti Dinar
      'BHD', // Bahraini Dinar
      'OMR', // Omani Rial
      'JOD', // Jordanian Dinar
      'EGP', // Egyptian Pound
      'ILS'  // Israeli Shekel
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
AccountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for faster queries
AccountSchema.index({ user: 1, type: 1 });
AccountSchema.index({ user: 1, isActive: 1 });

// Virtual field for formatted balance
AccountSchema.virtual('formattedBalance').get(function() {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: this.currency
  }).format(this.balance);
});

// Method to update balance
AccountSchema.methods.updateBalance = async function(amount) {
  this.balance += amount;
  this.updatedAt = Date.now();
  await this.save();
  return this;
};

// Static method to get total balance by type for a user
AccountSchema.statics.getTotalsByType = async function(userId) {
  const totals = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$balance' },
        count: { $sum: 1 }
      }
    }
  ]);

  return totals.reduce((acc, curr) => {
    acc[curr._id.toLowerCase()] = {
      total: curr.total,
      count: curr.count
    };
    return acc;
  }, {});
};

module.exports = mongoose.model('Account', AccountSchema);
