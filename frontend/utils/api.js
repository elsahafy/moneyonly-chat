const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fetch all transactions
export const getTransactions = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/transactions`, {
    headers: { Authorization: token }
  });

  return res.json();
};

// Create a transaction
export const createTransaction = async (transactionData) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(transactionData)
  });

  return res.json();
};

// Fetch monthly expense summary
export const getMonthlyExpenses = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/transactions/summary/monthly`, {
    headers: { Authorization: token }
  });

  return res.json();
};

// Fetch category-based expense summary
export const getCategoryExpenses = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/transactions/summary/category`, {
    headers: { Authorization: token }
  });

  return res.json();
};
// Fetch AI Predicted Spending
export const getPredictedSpending = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/ai/predict-spending`, {
      headers: { Authorization: token }
    });
  
    return res.json();
  };