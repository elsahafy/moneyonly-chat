import React, { useState } from 'react';
import { createTransaction } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CategorySelect from './CategorySelect';

const TransactionForm = ({ refreshTransactions }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction(formData);
      refreshTransactions();
      setFormData({ type: 'expense', category: '', amount: '', date: '' });
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <CategorySelect category={formData.category} handleChange={handleChange} />

        <div className="mb-4">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;