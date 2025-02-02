const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Helper function to calculate average spending
const calculateAverageSpending = (transactions) => {
  if (!transactions?.length) return 0;
  const total = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  return total / transactions.length;
};

// Helper function to get top spending categories
const getTopCategories = (transactions, limit = 5) => {
  if (!transactions?.length) return [];
  
  const categories = {};
  transactions.forEach(t => {
    if (t.type === 'EXPENSE') {
      categories[t.category] = (categories[t.category] || 0) + (t.amount || 0);
    }
  });
  
  return Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([category, amount]) => ({ category, amount }));
};

// Helper function to analyze spending patterns
const analyzeSpendingPatterns = (transactions) => {
  if (!transactions?.length) {
    return {
      weekdayVsWeekend: { weekday: 0, weekend: 0 },
      timeOfDay: { morning: 0, afternoon: 0, evening: 0 }
    };
  }

  let weekdayTotal = 0;
  let weekendTotal = 0;
  let morningTotal = 0;
  let afternoonTotal = 0;
  let eveningTotal = 0;
  let total = 0;

  transactions.forEach(t => {
    if (!t.date || !t.amount) return;
    
    const date = new Date(t.date);
    const hour = date.getHours();
    const amount = t.amount;
    total += amount;

    // Weekday vs Weekend
    if (date.getDay() === 0 || date.getDay() === 6) {
      weekendTotal += amount;
    } else {
      weekdayTotal += amount;
    }

    // Time of day
    if (hour >= 5 && hour < 12) {
      morningTotal += amount;
    } else if (hour >= 12 && hour < 17) {
      afternoonTotal += amount;
    } else {
      eveningTotal += amount;
    }
  });

  // Prevent division by zero
  if (total === 0) {
    return {
      weekdayVsWeekend: { weekday: 0, weekend: 0 },
      timeOfDay: { morning: 0, afternoon: 0, evening: 0 }
    };
  }

  return {
    weekdayVsWeekend: {
      weekday: Math.round((weekdayTotal / total) * 100),
      weekend: Math.round((weekendTotal / total) * 100)
    },
    timeOfDay: {
      morning: Math.round((morningTotal / total) * 100),
      afternoon: Math.round((afternoonTotal / total) * 100),
      evening: Math.round((eveningTotal / total) * 100)
    }
  };
};

// Get spending predictions
exports.getPredictions = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get last 90 days of transactions
    const transactions = await Transaction.find({
      user: new mongoose.Types.ObjectId(userId),
      date: {
        $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      }
    }).sort({ date: -1 });

    const avgSpending = calculateAverageSpending(transactions);
    const topCategories = getTopCategories(transactions);

    // Generate recommendations based on spending patterns
    const recommendations = [];
    const highSpendingThreshold = avgSpending * 1.2;

    topCategories.forEach(cat => {
      if (cat.amount > highSpendingThreshold) {
        recommendations.push(`Consider reducing spending in ${cat.category}`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push("Your spending patterns look healthy!");
    }

    return {
      nextMonth: {
        expectedSpending: avgSpending * 1.1, // Add 10% buffer
        topCategories: topCategories,
        recommendations: recommendations
      }
    };
  } catch (error) {
    console.error('Error generating predictions:', error);
    throw new Error(error.message || 'Error generating predictions');
  }
};

// Get budget optimization suggestions
exports.getOptimizations = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get last 30 days of transactions
    const transactions = await Transaction.find({
      user: new mongoose.Types.ObjectId(userId),
      date: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }).sort({ date: -1 });

    const categories = getTopCategories(transactions);
    const suggestions = categories.map(cat => ({
      category: cat.category,
      currentSpending: cat.amount,
      suggestedSpending: cat.amount * 0.9, // Suggest 10% reduction
      potentialSavings: cat.amount * 0.1
    }));

    const totalPotentialSavings = suggestions.reduce((sum, s) => sum + s.potentialSavings, 0);

    return {
      suggestions: suggestions,
      potentialSavings: {
        monthly: totalPotentialSavings,
        annual: totalPotentialSavings * 12,
        percentage: 10
      }
    };
  } catch (error) {
    console.error('Error generating optimizations:', error);
    throw new Error(error.message || 'Error generating budget optimizations');
  }
};

// Get financial insights
exports.getInsights = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get last 60 days of transactions
    const transactions = await Transaction.find({
      user: new mongoose.Types.ObjectId(userId),
      date: {
        $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      }
    }).sort({ date: -1 });

    const spendingPatterns = analyzeSpendingPatterns(transactions);
    const recommendations = [];

    // Generate recommendations based on patterns
    if (spendingPatterns.weekdayVsWeekend.weekend > 40) {
      recommendations.push({
        type: 'savings',
        message: 'Your weekend spending is relatively high. Consider setting a weekend budget.'
      });
    }

    if (spendingPatterns.timeOfDay.evening > 45) {
      recommendations.push({
        type: 'budget',
        message: 'Evening spending is significant. Try planning your purchases earlier in the day.'
      });
    }

    return {
      spendingPatterns: spendingPatterns,
      recommendations: recommendations,
      unusualActivity: {
        found: false,
        details: []
      }
    };
  } catch (error) {
    console.error('Error generating insights:', error);
    throw new Error(error.message || 'Error generating insights');
  }
};
