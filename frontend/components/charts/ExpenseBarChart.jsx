import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getMonthlyExpenses } from '../../utils/api';

const ExpenseBarChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMonthlyExpenses();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const expenses = new Array(12).fill(0);

      data.forEach((entry) => {
        expenses[entry._id - 1] = entry.total;
      });

      setChartData({
        labels: months,
        datasets: [
          {
            label: 'Monthly Expenses',
            data: expenses,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
          }
        ]
      });
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Monthly Expenses</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default ExpenseBarChart;