import { useState } from 'react';
import { motion } from 'framer-motion';

interface MintTokensProps {
  userId: string;
  stockSymbol: string;
}

export default function MintTokens({ userId, stockSymbol }: MintTokensProps) {
  const [quantity, setQuantity] = useState('');

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/trade/mint/${stockSymbol}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, quantity: parseInt(quantity) }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        alert(`Successfully minted ${quantity} tokens for ${stockSymbol}`);
        setQuantity('');
      } else {
        alert('Failed to mint tokens: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error minting tokens:', error);
      alert('An error occurred while minting tokens');
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Mint Tokens</h2>
      <form onSubmit={handleMint} className="space-y-4">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          Mint Tokens
        </button>
      </form>
    </motion.div>
  );
}