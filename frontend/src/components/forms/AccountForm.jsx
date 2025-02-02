import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

function AccountForm({ onSubmit, initialData = null }) {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'CHECKING',
    balance: initialData?.balance || '',
    currency: user.currency,
    accountNumber: initialData?.accountNumber || '',
    bankName: initialData?.bankName || '',
    interestRate: initialData?.interestRate || '',
    creditLimit: initialData?.creditLimit || '',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    notes: initialData?.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert numeric fields
    const submitData = {
      ...formData,
      balance: parseFloat(formData.balance) || 0,
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
      creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined
    };

    const success = await onSubmit(submitData);
    if (success && !initialData) {
      // Reset form if it's a new account creation
      setFormData({
        name: '',
        type: 'CHECKING',
        balance: '',
        currency: user?.currency || 'USD',
        accountNumber: '',
        bankName: '',
        interestRate: '',
        creditLimit: '',
        dueDate: '',
        notes: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="CHECKING">Checking Account</option>
          <option value="SAVINGS">Savings Account</option>
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="LOAN">Loan</option>
          <option value="INVESTMENT">Investment Account</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Initial Balance
        </label>
        <input
          type="number"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          required
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Number (Optional)
        </label>
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Bank Name (Optional)
        </label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {(formData.type === 'SAVINGS' || formData.type === 'LOAN') && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Interest Rate % (Optional)
          </label>
          <input
            type="number"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}

      {formData.type === 'CREDIT_CARD' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Credit Limit (Optional)
            </label>
            <input
              type="number"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date (Optional)
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update Account' : 'Add Account'}
        </button>
      </div>
    </form>
  );
}

export default AccountForm;
