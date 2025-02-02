import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../../utils/formatters';
import { useAuthContext } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function CategoryPieChart({ transactions = [] }) {
  const { user } = useAuthContext();
  const { isDarkMode } = useThemeContext();

  const categoryData = useMemo(() => {
    const data = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'EXPENSE') {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {});

    // Sort categories by amount (descending)
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [category, amount]) => {
        acc.categories.push(category);
        acc.amounts.push(amount);
        return acc;
      }, { categories: [], amounts: [] });
  }, [transactions]);

  const colors = [
    { bg: 'rgba(99, 102, 241, 0.5)', border: 'rgb(99, 102, 241)' },   // Indigo
    { bg: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)' },   // Green
    { bg: 'rgba(245, 158, 11, 0.5)', border: 'rgb(245, 158, 11)' },   // Yellow
    { bg: 'rgba(239, 68, 68, 0.5)', border: 'rgb(239, 68, 68)' },     // Red
    { bg: 'rgba(139, 92, 246, 0.5)', border: 'rgb(139, 92, 246)' },   // Purple
    { bg: 'rgba(236, 72, 153, 0.5)', border: 'rgb(236, 72, 153)' },   // Pink
    { bg: 'rgba(14, 165, 233, 0.5)', border: 'rgb(14, 165, 233)' },   // Sky
    { bg: 'rgba(168, 85, 247, 0.5)', border: 'rgb(168, 85, 247)' },   // Fuchsia
    { bg: 'rgba(234, 88, 12, 0.5)', border: 'rgb(234, 88, 12)' },     // Orange
    { bg: 'rgba(20, 184, 166, 0.5)', border: 'rgb(20, 184, 166)' }    // Teal
  ];

  const data = {
    labels: categoryData.categories,
    datasets: [
      {
        data: categoryData.amounts,
        backgroundColor: colors.map(c => c.bg),
        borderColor: colors.map(c => c.border),
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDarkMode ? '#E5E7EB' : '#374151', // Gray-200 : Gray-700
          padding: 20,
          font: {
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 1,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value, user?.preferences?.currency)} (${percentage}%)`;
          }
        },
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#E5E7EB' : '#374151',
        bodyColor: isDarkMode ? '#E5E7EB' : '#374151',
        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        borderWidth: 1
      }
    }
  };

  if (!categoryData.categories.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        No expense data available
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Pie data={data} options={options} />
    </div>
  );
}

export default CategoryPieChart;
