import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function Profile() {
  const { user, updateUserPreferences } = useAuthContext();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [currency, setCurrency] = useState(user?.preferences?.currency || 'USD');
  const [selectedTheme, setSelectedTheme] = useState(isDarkMode ? 'dark' : 'light');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Update form when user data changes
    if (user?.preferences) {
      setCurrency(user.preferences.currency || 'USD');
      setSelectedTheme(user.preferences.theme || 'light');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const success = await updateUserPreferences({
        currency,
        theme: selectedTheme
      });

      if (success) {
        // Update theme context if theme was changed
        if ((selectedTheme === 'dark') !== isDarkMode) {
          toggleTheme();
        }
        setSuccessMessage('Preferences updated successfully');
      } else {
        setError('Failed to update preferences');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="User Information" className="bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Preferences" className="bg-white dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="INR">Indian Rupee (INR)</option>
                <optgroup label="Gulf Currencies">
                  <option value="AED">UAE Dirham (AED)</option>
                  <option value="SAR">Saudi Riyal (SAR)</option>
                  <option value="QAR">Qatari Riyal (QAR)</option>
                  <option value="KWD">Kuwaiti Dinar (KWD)</option>
                  <option value="BHD">Bahraini Dinar (BHD)</option>
                  <option value="OMR">Omani Rial (OMR)</option>
                </optgroup>
                <optgroup label="Other Middle East Currencies">
                  <option value="JOD">Jordanian Dinar (JOD)</option>
                  <option value="EGP">Egyptian Pound (EGP)</option>
                  <option value="ILS">Israeli Shekel (ILS)</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {error && <ErrorMessage message={error} />}
            
            {successMessage && (
              <div className="text-sm text-green-600 dark:text-green-400">
                {successMessage}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
              >
                {isSubmitting ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
