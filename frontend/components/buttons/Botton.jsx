import React from 'react';

const Button = ({ text, onClick, type = 'primary' }) => {
  return (
    <button
      className={`px-4 py-2 font-semibold rounded-lg transition ${
        type === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-black hover:bg-gray-300'
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;