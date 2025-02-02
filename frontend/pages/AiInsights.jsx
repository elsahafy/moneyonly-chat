import React from 'react';
import SpendingPrediction from '../components/ai/SpendingPrediction';

const AiInsights = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Financial Insights</h1>
      <SpendingPrediction />
    </div>
  );
};

export default AiInsights;