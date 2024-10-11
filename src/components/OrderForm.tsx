import { useState } from 'react';
import { motion } from 'framer-motion';

interface OrderFormProps {
  userId: string;
  stockSymbol: string;
  orderType: 'yes' | 'no';
  onOrderPlaced: () => void;
}

export default function OrderForm({ userId, stockSymbol, orderType, onOrderPlaced }: OrderFormProps) {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log(`Placing ${orderType} order...`, { userId, stockSymbol, quantity, price });
      const response = await fetch(`/api/order/${orderType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          stockSymbol,
          quantity: parseInt(quantity),
          price: parseFloat(price),
        }),
      });

      console.log(`Response status: ${response.status}`);
      const data = await response.json();
      console.log(`Response data:`, data);

      if (data.success) {
        setSuccessMessage(`Order received and being processed`);
        setQuantity('');
        setPrice('');
        onOrderPlaced();
      } else {
        setError(`Failed to place ${orderType} order: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error placing ${orderType} order:`, error);
      setError(`An error occurred while placing ${orderType} order: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Place {orderType.toUpperCase()} Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full p-2 border border-gray-300 rounded"
          required
          disabled={isLoading}
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full p-2 border border-gray-300 rounded"
          required
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={`w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {successMessage && <p className="mt-2 text-green-500">{successMessage}</p>}
    </motion.div>
  );
}