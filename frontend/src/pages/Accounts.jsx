import React, { useState } from 'react';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import AccountForm from '../components/forms/AccountForm';
import { useAccounts } from '../hooks/useAccounts';
import { formatCurrency } from '../utils/formatters';
import { useAuthContext } from '../contexts/AuthContext';

function Accounts() {
  const {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    calculateTotals
  } = useAccounts();
  const { user } = useAuthContext();

  const [editingAccount, setEditingAccount] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const totals = calculateTotals();

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowAddForm(false);
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      await deleteAccount(accountId);
    }
  };

  const handleUpdate = async (data) => {
    const success = await updateAccount(editingAccount._id, data);
    if (success) {
      setEditingAccount(null);
    }
    return success;
  };

  const handleCreate = async (data) => {
    const success = await createAccount(data);
    if (success) {
      setShowAddForm(false);
    }
    return success;
  };

  const renderAccountCard = (account) => (
    <Card 
      key={account._id}
      className={`${account.isActive ? '' : 'opacity-60'} ${
        account.type === 'CREDIT_CARD' || account.type === 'LOAN' 
          ? 'bg-red-50 dark:bg-red-900' 
          : 'bg-green-50 dark:bg-green-900'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{account.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{account.bankName}</p>
          <p className={`text-xl font-bold ${
            account.type === 'CREDIT_CARD' || account.type === 'LOAN'
              ? 'text-red-600 dark:text-red-400'
              : 'text-green-600 dark:text-green-400'
          }`}>
            {formatCurrency(account.balance, user?.preferences?.currency)}
          </p>
          {account.type === 'CREDIT_CARD' && account.creditLimit && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Available Credit: {formatCurrency(account.creditLimit - (account.balance || 0), user?.preferences?.currency)}
            </p>
          )}
          {account.interestRate && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Interest Rate: {account.interestRate}%
            </p>
          )}
          {!account.isActive && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              Inactive
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(account)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(account._id)}
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Accounts</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingAccount(null);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Add Account
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 dark:bg-blue-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Total Assets</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totals.totalAssets, user?.preferences?.currency)}
            </p>
          </div>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Total Liabilities</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totals.totalLiabilities, user?.preferences?.currency)}
            </p>
          </div>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">Net Worth</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totals.netWorth, user?.preferences?.currency)}
            </p>
          </div>
        </Card>
      </div>

      {/* Account Form */}
      {(showAddForm || editingAccount) && (
        <Card title={editingAccount ? 'Edit Account' : 'Add New Account'} className="mb-8">
          <AccountForm
            onSubmit={editingAccount ? handleUpdate : handleCreate}
            initialData={editingAccount}
          />
        </Card>
      )}

      {/* Account Lists by Type */}
      {accounts.length > 0 ? (
        <div className="space-y-6">
          {/* Checking Accounts */}
          {accounts.some(a => a.type === 'CHECKING') && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Checking Accounts
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Total: {formatCurrency(totals.checking, user?.preferences?.currency)}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts
                  .filter(a => a.type === 'CHECKING')
                  .map(renderAccountCard)}
              </div>
            </div>
          )}

          {/* Savings Accounts */}
          {accounts.some(a => a.type === 'SAVINGS') && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Savings Accounts
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Total: {formatCurrency(totals.savings, user?.preferences?.currency)}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts
                  .filter(a => a.type === 'SAVINGS')
                  .map(renderAccountCard)}
              </div>
            </div>
          )}

          {/* Credit Cards */}
          {accounts.some(a => a.type === 'CREDIT_CARD') && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Credit Cards
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Total: {formatCurrency(totals.creditCards, user?.preferences?.currency)}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts
                  .filter(a => a.type === 'CREDIT_CARD')
                  .map(renderAccountCard)}
              </div>
            </div>
          )}

          {/* Loans */}
          {accounts.some(a => a.type === 'LOAN') && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Loans
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Total: {formatCurrency(totals.loans, user?.preferences?.currency)}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts
                  .filter(a => a.type === 'LOAN')
                  .map(renderAccountCard)}
              </div>
            </div>
          )}

          {/* Investment Accounts */}
          {accounts.some(a => a.type === 'INVESTMENT') && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Investment Accounts
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Total: {formatCurrency(totals.investments, user?.preferences?.currency)}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts
                  .filter(a => a.type === 'INVESTMENT')
                  .map(renderAccountCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No accounts found. Add your first account to get started!
        </div>
      )}
    </div>
  );
}

export default Accounts;
