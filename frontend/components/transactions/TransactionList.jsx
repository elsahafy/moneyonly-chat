import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../utils/api';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTransactions();
      setTransactions(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t._id} className="border-b py-2">
            {t.category} - ${t.amount} ({t.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;