import React from 'react';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ExpenseBarChart from '../components/charts/ExpenseBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { useTransactions } from '../hooks/useTransactions';
import { useAuthContext } from '../contexts/AuthContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';

function Reports() {
  const { user } = useAuthContext();
  const {
    transactions,
    loading,
    error,
    getTransactionStats
  } = useTransactions();

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = getTransactionStats();
  const { totalIncome, totalExpense: totalExpenses, categories } = stats;
  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome * 100)
    : 0;

  // Filter and sort expense categories
  const expenseCategories = Object.entries(categories)
    .filter(([category]) => {
      const transaction = transactions.find(t => t.category === category);
      return transaction && transaction.type === 'EXPENSE';
    })
    .sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Financial Reports</h1>
      
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-green-50 dark:bg-green-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">Total Income</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalIncome, user?.preferences?.currency)}
            </p>
          </div>
        </Card>

        <Card className="bg-indigo-50 dark:bg-indigo-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-200">Total Expenses</h3>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(totalExpenses, user?.preferences?.currency)}
            </p>
          </div>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Savings Rate</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatPercentage(savingsRate)}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Monthly Expense Trend">
          <div className="h-80">
            <ExpenseBarChart transactions={transactions} />
          </div>
        </Card>

        <Card title="Spending Distribution">
          <div className="h-80">
            <CategoryPieChart transactions={transactions} />
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card title="Category Breakdown">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    % of Expenses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transactions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {expenseCategories.map(([category, data], index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(data.total, user?.preferences?.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatPercentage((data.total / totalExpenses) * 100)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {data.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Reports;
