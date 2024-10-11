import { useState } from 'react';
import { motion } from 'framer-motion';

interface OnrampProps {
  userId: string;
  onBalanceUpdate: () => void;
}

export default function Onramp({ userId, onBalanceUpdate }: OnrampProps) {
  const [amount, setAmount] = useState('');

  const handleOnramp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/onramp/inr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: parseInt(amount) * 100 }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Successfully onramped ${amount} INR`);
        setAmount('');
        onBalanceUpdate(); 
      } else {
        alert('Failed to onramp INR: ' + data.error);
      }
    } catch (error) {
      console.error('Error onramping INR:', error);
      alert('An error occurred while onramping INR');
    }
  };

  const handleFaucet = async () => {
    try {
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Successfully received ${data.amount / 100} INR from faucet`);
        onBalanceUpdate(); 
      } else {
        alert('Failed to use faucet: ' + data.error);
      }
    } catch (error) {
      console.error('Error using faucet:', error);
      alert('An error occurred while using the faucet');
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Onramp INR</h2>
      <form onSubmit={handleOnramp} className="space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in INR"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Onramp
        </button>
      </form>
      <button
        onClick={handleFaucet}
        className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Use Faucet (Get 1000 INR)
      </button>
    </motion.div>
  );
}