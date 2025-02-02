const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['EXPENSE', 'INCOME', 'TRANSFER'],
      message: '{VALUE} is not a valid transaction type'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be greater than 0']
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
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        // Expense categories
        'Food & Dining',
        'Shopping',
        'Transportation',
        'Bills & Utilities',
        'Entertainment',
        'Health & Fitness',
        'Travel',
        'Education',
        'Personal Care',
        // Income categories
        'Salary',
        'Business',
        'Investments',
        'Rental',
        'Freelance',
        'Gift',
        // Transfer category
        'Account Transfer',
        // Other
        'Others'
      ],
      message: '{VALUE} is not a valid category'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
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
TransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update account balance after saving transaction
TransactionSchema.post('save', async function(doc) {
  const Account = mongoose.model('Account');
  const account = await Account.findById(doc.account);
  
  if (account) {
    let amount = doc.amount;
    if (doc.type === 'EXPENSE') {
      amount = -amount;
    }
    await account.updateBalance(amount);
  }
});

// Update account balance after deleting transaction
TransactionSchema.post('remove', async function(doc) {
  const Account = mongoose.model('Account');
  const account = await Account.findById(doc.account);
  
  if (account) {
    let amount = doc.amount;
    if (doc.type === 'EXPENSE') {
      amount = amount; // Reverse the negative
    } else {
      amount = -amount; // Reverse the positive
    }
    await account.updateBalance(amount);
  }
});

// Indexes for faster queries
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, account: 1 });
TransactionSchema.index({ user: 1, type: 1 });
TransactionSchema.index({ user: 1, category: 1 });

// Virtual field for formatted amount
TransactionSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

// Static method to get transaction statistics
TransactionSchema.statics.getStats = async function(userId, startDate, endDate) {
  const match = {
    user: mongoose.Types.ObjectId(userId),
    ...(startDate && endDate ? {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    } : {})
  };

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          type: '$type',
          category: '$category'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    {
      $group: {
        _id: '$_id.type',
        categories: {
          $push: {
            category: '$_id.category',
            total: '$total',
            count: '$count',
            avgAmount: '$avgAmount'
          }
        },
        totalAmount: { $sum: '$total' }
      }
    }
  ]);

  return stats;
};

module.exports = mongoose.model('Transaction', TransactionSchema);
