import React from 'react';

function Card({ children, className = '', title }) {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200 ${className}`}>
      {title && (
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export default Card;
