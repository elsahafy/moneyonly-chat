import React from 'react';

const CATEGORIES = {
  expense: [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Education',
    'Personal Care',
    'Travel',
    'Insurance',
    'Debt Payment',
    'Savings',
    'Investments',
    'Gifts & Donations',
    'Other'
  ],
  income: [
    'Salary',
    'Business',
    'Freelance',
    'Investments',
    'Rental',
    'Interest',
    'Dividends',
    'Gifts',
    'Other'
  ]
};

function CategorySelect({ value, onChange, type = 'expense', className = '' }) {
  const categories = CATEGORIES[type] || CATEGORIES.expense;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${className}`}
    >
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}

export default CategorySelect;

// Export categories for use in other components
export { CATEGORIES };
