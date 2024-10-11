import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BalanceProps {
  userId: string;
}

interface StockBalance {
  [symbol: string]: {
    yes?: { quantity: number; locked: number };
    no?: { quantity: number; locked: number };
  };
}

export default function Balance({ userId }: BalanceProps) {
  const [inrBalance, setInrBalance] = useState<number | null>(null);
  const [stockBalance, setStockBalance] = useState<StockBalance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const inrResponse = await fetch(`/api/balance/inr/${userId}`);
        if (!inrResponse.ok) throw new Error('Failed to fetch INR balance');
        const inrData = await inrResponse.json();
        setInrBalance(inrData.balance);

        const stockResponse = await fetch(`/api/balance/stock/${userId}`);
        if (!stockResponse.ok) throw new Error('Failed to fetch stock balance');
        const stockData = await stockResponse.json();
        setStockBalance(stockData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBalances();
  }, [userId]);

  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Balances</h2>
      <motion.p
        className="text-xl mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        INR Balance: {inrBalance !== null ? (inrBalance / 100).toFixed(2) : 'Loading...'} INR
      </motion.p>
      <h3 className="text-lg font-semibold mb-2">Stock Balances:</h3>
      {stockBalance ? (
        <motion.ul
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {Object.entries(stockBalance).map(([symbol, balance]) => (
            <li key={symbol} className="bg-gray-100 p-2 rounded">
              <strong>{symbol}:</strong>
              <ul className="ml-4">
                <li>Yes: {balance.yes?.quantity ?? 'N/A'}</li>
                <li>No: {balance.no?.quantity ?? 'N/A'}</li>
              </ul>
            </li>
          ))}
        </motion.ul>
      ) : (
        <p>Loading...</p>
      )}
    </motion.div>
  );
}