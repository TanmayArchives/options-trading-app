import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderbookProps {
  stockSymbol: string;
}

let socket: Socket;

export default function Orderbook({ stockSymbol }: OrderbookProps) {
  const [orderbook, setOrderbook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderbook = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orderbook/${stockSymbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orderbook');
      }
      const data = await response.json();
      setOrderbook(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orderbook:', err);
      setError('Failed to load orderbook. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [stockSymbol]);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socketio');
      if (!socket) {
        socket = io();

        socket.on('connect', () => {
          console.log('Connected to Socket.IO server');
          socket.emit('subscribe', stockSymbol);
        });

        socket.on('orderbook_update', (data) => {
          console.log('Received orderbook update:', data);
          setOrderbook(data);
        });

        socket.on('disconnect', () => {
          console.log('Disconnected from Socket.IO server');
        });
      }

      socket.emit('subscribe', stockSymbol);
    };

    fetchOrderbook();
    socketInitializer();

    return () => {
      if (socket) {
        socket.emit('unsubscribe', stockSymbol);
      }
    };
  }, [stockSymbol, fetchOrderbook]);

  if (loading) return <div>Loading orderbook...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!orderbook) return <div>No orderbook data available.</div>;

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Orderbook for {stockSymbol}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Yes Orders</h3>
          <AnimatePresence>
            {Object.entries(orderbook.yes || {}).length > 0 ? (
              Object.entries(orderbook.yes).map(([price, data]: [string, any]) => (
                <motion.div
                  key={price}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-green-100 p-2 rounded mb-2"
                >
                  Price: {price}, Total: {data.total}
                </motion.div>
              ))
            ) : (
              <p>No Yes orders</p>
            )}
          </AnimatePresence>
        </div>
        <div>
          <h3 className="font-bold mb-2">No Orders</h3>
          <AnimatePresence>
            {Object.entries(orderbook.no || {}).length > 0 ? (
              Object.entries(orderbook.no).map(([price, data]: [string, any]) => (
                <motion.div
                  key={price}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-red-100 p-2 rounded mb-2"
                >
                  Price: {price}, Total: {data.total}
                </motion.div>
              ))
            ) : (
              <p>No No orders</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}