import React from 'react';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/forms/TransactionForm';
import ExpenseBarChart from '../components/charts/ExpenseBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { useTransactions } from '../hooks/useTransactions';
import { useAuthContext } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/formatters';

function Dashboard() {
  const {
    transactions,
    loading,
    error,
    createTransaction,
    getTransactionStats
  } = useTransactions();
  const { user, isInitialized } = useAuthContext();

  // Show loading spinner while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  // Show loading spinner while transactions are loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  const stats = getTransactionStats();
  const { totalIncome, totalExpense: totalExpenses, netIncome: netBalance } = stats;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-indigo-50 dark:bg-indigo-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-200">Total Expenses</h3>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(totalExpenses, user?.preferences?.currency)}
            </p>
          </div>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">Total Income</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalIncome, user?.preferences?.currency)}
            </p>
          </div>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Net Balance</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(netBalance, user?.preferences?.currency)}
            </p>
          </div>
        </Card>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Add Transaction">
          <TransactionForm onSuccess={createTransaction} />
        </Card>

        <Card title="Recent Transactions">
          {transactions.length > 0 ? (
            <TransactionList transactions={transactions} />
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No transactions found. Add your first transaction to get started!
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card title="Monthly Expenses">
          <div className="h-64">
            {transactions.length > 0 ? (
              <ExpenseBarChart transactions={transactions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No expense data available
              </div>
            )}
          </div>
        </Card>

        <Card title="Spending by Category">
          <div className="h-64">
            {transactions.length > 0 ? (
              <CategoryPieChart transactions={transactions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No category data available
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
