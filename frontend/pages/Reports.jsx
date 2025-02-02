import React from 'react';
import ExpenseBarChart from '../components/charts/ExpenseBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';

const Reports = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Financial Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseBarChart />
        <CategoryPieChart />
      </div>
    </div>
  );
};

export default Reports;