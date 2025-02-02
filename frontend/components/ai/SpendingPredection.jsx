import React, { useEffect, useState } from 'react';
import { getPredictedSpending } from '../../utils/api';

const SpendingPrediction = () => {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      const data = await getPredictedSpending();
      setPrediction(data.predictedSpending);
    };

    fetchPrediction();
  }, []);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">AI Predicted Spending</h2>
      {prediction !== null ? (
        <p className="text-lg">Expected monthly expense: <strong>${prediction.toFixed(2)}</strong></p>
      ) : (
        <p>Loading prediction...</p>
      )}
    </div>
  );
};

export default SpendingPrediction;