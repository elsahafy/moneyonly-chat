import axios from 'axios';

// Create axios instance with custom config
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000, // 15 second timeout
  withCredentials: true
});

// Request queue for handling 401 responses
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add auth token to headers if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If another request is already refreshing the token, wait for it
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login with return path
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = `/login?redirect=${currentPath}`;
      }

      processQueue(error);
      return Promise.reject(error);
    }

    // Handle other errors
    if (error.response) {
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     error.message || 
                     'An error occurred';

      error.message = message;

      // Handle specific error cases
      switch (error.response.status) {
        case 400:
          console.error('Bad Request:', message);
          break;
        case 403:
          console.error('Access Denied:', message);
          break;
        case 404:
          console.error('Not Found:', message);
          break;
        case 422:
          console.error('Validation Error:', message);
          break;
        case 500:
          console.error('Server Error:', message);
          break;
        default:
          console.error('API Error:', message);
      }
    } else if (error.request) {
      error.message = 'No response from server';
      console.error('No Response:', error.request);
    } else {
      error.message = 'Request failed';
      console.error('Request Failed:', error.message);
    }

    return Promise.reject(error);
  }
);

// Add retry mechanism for failed requests (except for auth-related requests)
const retryStatuses = [408, 429, 500, 502, 503, 504];
const maxRetries = 3;
const retryDelay = 1000;

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Don't retry auth requests or if max retries reached
    if (!config || 
        config.url.includes('/auth/') || 
        !response || 
        !retryStatuses.includes(response.status) || 
        config._retryCount >= maxRetries) {
      return Promise.reject(error);
    }

    // Implement exponential backoff
    config._retryCount = config._retryCount || 0;
    config._retryCount += 1;

    await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, config._retryCount - 1)));
    return instance(config);
  }
);

export default instance;
