import { useState, useEffect, useCallback, useRef } from 'react';
import { transactions as transactionsApi } from '../utils/api';
import { useAuthContext } from '../contexts/AuthContext';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isInitialized } = useAuthContext();
  const initialFetchDone = useRef(false);

  const fetchTransactions = useCallback(async (showLoading = true) => {
    // Don't fetch if auth is not initialized or user is not logged in
    if (!isInitialized || !user?._id) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      }
      setError('');
      const response = await transactionsApi.getAll();
      
      if (!response?.data) {
        throw new Error('Invalid response format');
      }

      setTransactions(response.data);
    } catch (err) {
      setError(err.message || 'Error fetching transactions');
      console.error('Error fetching transactions:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [user, isInitialized]);

  const createTransaction = useCallback(async (transactionData) => {
    if (!user?._id) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError('');
      const response = await transactionsApi.create({
        ...transactionData,
        currency: user.preferences?.currency || 'USD'
      });

      if (!response?.data) {
        throw new Error('Invalid response format');
      }

      setTransactions(prev => [response.data, ...prev]);
      return true;
    } catch (err) {
      setError(err.message || 'Error creating transaction');
      console.error('Error creating transaction:', err);
      return false;
    }
  }, [user]);

  const updateTransaction = useCallback(async (id, transactionData) => {
    if (!user?._id) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError('');
      const response = await transactionsApi.update(id, transactionData);

      if (!response?.data) {
        throw new Error('Invalid response format');
      }

      setTransactions(prev => 
        prev.map(transaction => 
          transaction._id === id ? response.data : transaction
        )
      );
      return true;
    } catch (err) {
      setError(err.message || 'Error updating transaction');
      console.error('Error updating transaction:', err);
      return false;
    }
  }, [user]);

  const deleteTransaction = useCallback(async (id) => {
    if (!user?._id) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError('');
      await transactionsApi.delete(id);
      setTransactions(prev => prev.filter(transaction => transaction._id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Error deleting transaction');
      console.error('Error deleting transaction:', err);
      return false;
    }
  }, [user]);

  const getTransactionsByType = useCallback((type) => {
    return transactions.filter(transaction => transaction.type === type);
  }, [transactions]);

  const getTransactionsByAccount = useCallback((accountId) => {
    return transactions.filter(transaction => transaction.account === accountId);
  }, [transactions]);

  const getTransactionsByCategory = useCallback((category) => {
    return transactions.filter(transaction => transaction.category === category);
  }, [transactions]);

  const getTransactionStats = useCallback(() => {
    const stats = {
      totalIncome: 0,
      totalExpense: 0,
      netIncome: 0,
      categories: {}
    };

    transactions.forEach(transaction => {
      const amount = transaction.amount || 0;
      
      // Track totals by type
      if (transaction.type === 'INCOME') {
        stats.totalIncome += amount;
      } else if (transaction.type === 'EXPENSE') {
        stats.totalExpense += amount;
      }

      // Track category totals
      if (transaction.category) {
        if (!stats.categories[transaction.category]) {
          stats.categories[transaction.category] = {
            total: 0,
            count: 0
          };
        }
        stats.categories[transaction.category].total += amount;
        stats.categories[transaction.category].count += 1;
      }
    });

    stats.netIncome = stats.totalIncome - stats.totalExpense;
    return stats;
  }, [transactions]);

  // Initial fetch when component mounts and auth is initialized
  useEffect(() => {
    if (isInitialized && user?._id && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchTransactions();
    }
  }, [isInitialized, user, fetchTransactions]);

  // Reset state when user changes
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setError('');
      setLoading(false);
    }
  }, [user]);

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTransactionsByAccount,
    getTransactionsByCategory,
    getTransactionStats,
    refreshTransactions: () => fetchTransactions(false) // Don't show loading on refresh
  };
}
