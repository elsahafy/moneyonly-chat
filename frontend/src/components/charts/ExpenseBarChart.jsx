import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency, getMonthName } from '../../utils/formatters';
import { useAuthContext } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ExpenseBarChart({ transactions = [] }) {
  const { user } = useAuthContext();
  const { isDarkMode } = useThemeContext();
  
  const monthNames = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => getMonthName(i + 1)),
    []
  );
  
  // Group transactions by month
  const monthlyData = useMemo(() => 
    transactions.reduce((acc, transaction) => {
      if (transaction.type === 'EXPENSE') {
        const date = new Date(transaction.date);
        const month = date.getMonth();
        acc[month] = (acc[month] || 0) + transaction.amount;
      }
      return acc;
    }, {}),
    [transactions]
  );

  const data = {
    labels: monthNames,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthNames.map((_, index) => monthlyData[index] || 0),
        backgroundColor: isDarkMode 
          ? 'rgba(129, 140, 248, 0.5)'  // Indigo-400 with opacity
          : 'rgba(99, 102, 241, 0.5)',  // Indigo-600 with opacity
        borderColor: isDarkMode
          ? 'rgb(129, 140, 248)'        // Indigo-400
          : 'rgb(99, 102, 241)',        // Indigo-600
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#E5E7EB' : '#374151' // Gray-200 : Gray-700
        }
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Expenses: ${formatCurrency(context.raw, user?.preferences?.currency)}`;
          }
        },
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#E5E7EB' : '#374151',
        bodyColor: isDarkMode ? '#E5E7EB' : '#374151',
        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          color: isDarkMode ? '#E5E7EB' : '#374151'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          color: isDarkMode ? '#E5E7EB' : '#374151',
          callback: (value) => formatCurrency(value, user?.preferences?.currency, 0)
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
}

export default ExpenseBarChart;
