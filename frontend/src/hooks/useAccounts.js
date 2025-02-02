import { useState, useEffect, useCallback } from 'react';
import { accounts as accountsApi } from '../utils/api';
import { useAuthContext } from '../contexts/AuthContext';

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthContext();

  const fetchAccounts = useCallback(async () => {
    if (!user) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await accountsApi.getAll();
      setAccounts(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching accounts:', err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createAccount = useCallback(async (accountData) => {
    try {
      setError('');
      const response = await accountsApi.create({
        ...accountData,
        currency: user?.preferences?.currency || 'USD'
      });
      setAccounts(prev => [...prev, response.data]);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error creating account:', err);
      return false;
    }
  }, [user]);

  const updateAccount = useCallback(async (id, accountData) => {
    try {
      setError('');
      const response = await accountsApi.update(id, accountData);
      setAccounts(prev => 
        prev.map(account => 
          account._id === id ? response.data : account
        )
      );
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error updating account:', err);
      return false;
    }
  }, []);

  const deleteAccount = useCallback(async (id) => {
    try {
      setError('');
      await accountsApi.delete(id);
      setAccounts(prev => prev.filter(account => account._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting account:', err);
      return false;
    }
  }, []);

  const getAccountById = useCallback((id) => {
    return accounts.find(account => account._id === id);
  }, [accounts]);

  const getAccountsByType = useCallback((type) => {
    return accounts.filter(account => account.type === type);
  }, [accounts]);

  const getActiveAccounts = useCallback(() => {
    return accounts.filter(account => account.isActive);
  }, [accounts]);

  const calculateTotalBalance = useCallback(() => {
    return accounts.reduce((total, account) => total + (account.balance || 0), 0);
  }, [accounts]);

  const calculateTotals = useCallback(() => {
    const totals = {
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0,
      checking: 0,
      savings: 0,
      creditCards: 0,
      loans: 0,
      investments: 0
    };

    accounts.forEach(account => {
      const balance = account.balance || 0;

      // Calculate by account type
      switch (account.type) {
        case 'CHECKING':
          totals.checking += balance;
          totals.totalAssets += balance;
          break;
        case 'SAVINGS':
          totals.savings += balance;
          totals.totalAssets += balance;
          break;
        case 'INVESTMENT':
          totals.investments += balance;
          totals.totalAssets += balance;
          break;
        case 'CREDIT_CARD':
          totals.creditCards += balance;
          totals.totalLiabilities += balance;
          break;
        case 'LOAN':
          totals.loans += balance;
          totals.totalLiabilities += balance;
          break;
        default:
          break;
      }
    });

    // Calculate net worth
    totals.netWorth = totals.totalAssets - totals.totalLiabilities;

    return totals;
  }, [accounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    getAccountsByType,
    getActiveAccounts,
    calculateTotalBalance,
    calculateTotals,
    refreshAccounts: fetchAccounts
  };
}
