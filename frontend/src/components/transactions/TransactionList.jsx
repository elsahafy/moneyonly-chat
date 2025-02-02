import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuthContext } from '../../contexts/AuthContext';

function TransactionList({ transactions = [] }) {
  const { user } = useAuthContext();

  if (!transactions.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No transactions found
      </div>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'EXPENSE':
        return 'text-red-600 dark:text-red-400';
      case 'INCOME':
        return 'text-green-600 dark:text-green-400';
      case 'TRANSFER':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'EXPENSE':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      case 'INCOME':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case 'TRANSFER':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <li key={transaction._id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 ${getTypeColor(transaction.type)}`}>
                  {getTypeIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
                <div className={`flex-shrink-0 text-sm font-medium ${getTypeColor(transaction.type)}`}>
                  {transaction.type === 'EXPENSE' ? '- ' : ''}
                  {formatCurrency(transaction.amount, user?.preferences?.currency)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TransactionList;
