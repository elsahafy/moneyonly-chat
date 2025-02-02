import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getCategoryExpenses } from '../../utils/api';

const CategoryPieChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategoryExpenses();
      const labels = data.map((entry) => entry._id);
      const values = data.map((entry) => entry.total);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Category Expenses',
            data: values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0', '#FF9800'],
          }
        ]
      });
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Category-wise Spending</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default CategoryPieChart;