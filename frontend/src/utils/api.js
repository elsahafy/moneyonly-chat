import axios from './axiosConfig';

const handleResponse = (response) => {
  // Handle nested response structure
  if (
    response?.data?.status === 'success' &&
    response.data.token &&
    response.data.data?.user
  ) {
    return {
      status: response.data.status,
      data: {
        user: response.data.data.user,
        token: response.data.token
      }
    };
  }
  if (response?.data) {
    return {
      status: 'success',
      data: response.data
    };
  }
  throw new Error('Invalid response format');
};

const handleError = (error) => {
  const message = error.response?.data?.message ||
                 error.response?.data?.error ||
                 error.message ||
                 'An error occurred';
  throw new Error(message);
};

export const auth = {
  register: (data) => 
    axios.post('/auth/register', data)
      .then(handleResponse)
      .catch(handleError),

  login: (data) => 
    axios.post('/auth/login', data)
      .then(handleResponse)
      .catch(handleError),

  getMe: () => 
    axios.get('/auth/me')
      .then(handleResponse)
      .catch(handleError),

  updatePreferences: (data) => 
    axios.patch('/auth/preferences', data)
      .then(handleResponse)
      .catch(handleError)
};

export const transactions = {
  getAll: () => 
    axios.get('/transactions')
      .then(handleResponse)
      .catch(handleError),

  create: (data) => 
    axios.post('/transactions', data)
      .then(handleResponse)
      .catch(handleError),

  update: (id, data) => 
    axios.patch(`/transactions/${id}`, data)
      .then(handleResponse)
      .catch(handleError),

  delete: (id) => 
    axios.delete(`/transactions/${id}`)
      .then(handleResponse)
      .catch(handleError),

  getStats: () => 
    axios.get('/transactions/stats')
      .then(handleResponse)
      .catch(handleError)
};

export const accounts = {
  getAll: () => 
    axios.get('/accounts')
      .then(handleResponse)
      .catch(handleError),

  create: (data) => 
    axios.post('/accounts', data)
      .then(handleResponse)
      .catch(handleError),

  update: (id, data) => 
    axios.patch(`/accounts/${id}`, data)
      .then(handleResponse)
      .catch(handleError),

  delete: (id) => 
    axios.delete(`/accounts/${id}`)
      .then(handleResponse)
      .catch(handleError),

  getBalanceHistory: (id) => 
    axios.get(`/accounts/${id}/balance-history`)
      .then(handleResponse)
      .catch(handleError)
};

export const ai = {
  getPredictions: () => 
    axios.get('/ai/predictions')
      .then(handleResponse)
      .catch(handleError),

  getOptimizations: () => 
    axios.get('/ai/optimize-budget')
      .then(handleResponse)
      .catch(handleError),

  getInsights: () => 
    axios.get('/ai/insights')
      .then(handleResponse)
      .catch(handleError)
};

export const emi = {
  calculate: (data) => 
    axios.post('/emi/calculate', data)
      .then(handleResponse)
      .catch(handleError),

  getHistory: () => 
    axios.get('/emi/history')
      .then(handleResponse)
      .catch(handleError)
};
