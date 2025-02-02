import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { auth } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await auth.getMe();
          if (response?.data?.user) {
            setUser(response.data.user);
          } else {
            // Invalid response, clear auth state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsInitialized(true);
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      const response = await auth.login({ email, password });
      
if (response?.data?.user && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return true;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login error:', error);
      // Clear any partial auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      const response = await auth.register(userData);
      
if (response?.data?.user && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return true;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Registration error:', error);
      // Clear any partial auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const updateUserPreferences = useCallback(async (preferences) => {
    if (!user?._id) {
      console.error('No user found');
      return false;
    }

    try {
      setIsLoading(true);
      const response = await auth.updatePreferences(preferences);
      
      // Handle nested response structure
      const updatedUser = response?.data?.user || response?.user;
      
      if (!updatedUser) {
        throw new Error('Invalid response format');
      }

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update preferences error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const isAuthenticated = useCallback(() => {
    return !!user?._id && !!localStorage.getItem('token');
  }, [user]);

  const value = {
    user,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    isAuthenticated,
    updateUserPreferences
  };

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
