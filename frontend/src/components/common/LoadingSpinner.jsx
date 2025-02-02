import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
