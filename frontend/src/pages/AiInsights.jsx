import React from 'react';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAi } from '../hooks/useAi';
import { useAuthContext } from '../contexts/AuthContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';

function AiInsights() {
  const { user } = useAuthContext();
  const { loading, error, predictions, optimizations, insights } = useAi();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">AI Insights</h1>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Spending Predictions" className="bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Expected Spending Next Month</h3>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(predictions.expectedSpending, user?.preferences?.currency)}
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Top Spending Categories</h4>
              <ul className="mt-2 space-y-2">
                {predictions.topCategories.map((cat, index) => (
                  <li key={index} className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{cat.category}</span>
                    <span>{formatCurrency(cat.amount, user?.preferences?.currency)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Recommendations</h4>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {predictions.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card title="Budget Optimization" className="bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Savings</h4>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(optimizations.potentialSavings.monthly, user?.preferences?.currency)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Annual Savings</h4>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(optimizations.potentialSavings.annual, user?.preferences?.currency)}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Suggested Changes</h4>
              <div className="mt-2 space-y-3">
                {optimizations.suggestions.map((sug, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300">{sug.category}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current: {formatCurrency(sug.currentSpending, user?.preferences?.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 dark:text-green-400">
                        Save {formatCurrency(sug.potentialSavings, user?.preferences?.currency)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Target: {formatCurrency(sug.suggestedSpending, user?.preferences?.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Spending Patterns" className="bg-white dark:bg-gray-800">
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Weekday vs Weekend</h4>
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Weekday</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formatPercentage(insights.spendingPatterns.weekdayVsWeekend.weekday)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 dark:text-gray-400">Weekend</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formatPercentage(insights.spendingPatterns.weekdayVsWeekend.weekend)}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Time of Day</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Morning</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formatPercentage(insights.spendingPatterns.timeOfDay.morning)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Afternoon</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formatPercentage(insights.spendingPatterns.timeOfDay.afternoon)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Evening</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formatPercentage(insights.spendingPatterns.timeOfDay.evening)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Recommendations" className="bg-white dark:bg-gray-800">
          <div className="space-y-4">
            {insights.recommendations.length > 0 ? (
              insights.recommendations.map((rec, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className="text-gray-900 dark:text-gray-100">{rec.message}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Type: {rec.type}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No recommendations available at this time.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AiInsights;
