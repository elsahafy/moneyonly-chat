import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setError('');
      setLoading(true);
      const response = await auth.login(credentials);
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate('/dashboard');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setError('');
      setLoading(true);
      const response = await auth.register(userData);
      const { token, user: newUser } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      navigate('/dashboard');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }, [navigate]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  // Get current user data
  const getCurrentUser = useCallback(async () => {
    if (!isAuthenticated()) return null;
    
    try {
      const response = await auth.getCurrentUser();
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      return null;
    }
  }, [isAuthenticated]);

  // Update user profile
  const updateUser = useCallback(async (userData) => {
    try {
      setError('');
      setLoading(true);
      const response = await auth.updateProfile(userData);
      const updatedUser = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
    updateUser
  };
}
