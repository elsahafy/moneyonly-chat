import React from 'react';

const Card = ({ title, amount, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
      <span className="text-2xl">{icon}</span>
      <div className="ml-4">
        <h3 className="text-gray-700 dark:text-gray-300">{title}</h3>
        <p className="text-xl font-bold dark:text-white">${amount}</p>
      </div>
    </div>
  );
};

export default Card;