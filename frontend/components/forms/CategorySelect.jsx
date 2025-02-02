import React from 'react';

const categories = ['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Other'];

const CategorySelect = ({ category, handleChange }) => {
  return (
    <div className="mb-4">
      <label>Category</label>
      <select
        name="category"
        value={category}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;