"use client";
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Balance from '@/components/Balance';
import Onramp from '@/components/Onramp';
import OrderForm from '@/components/OrderForm';
import Orderbook from '@/components/Orderbook';
import MintTokens from '@/components/MintTokens';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [stockSymbol, setStockSymbol] = useState('BTC_USDT_10_Oct_2024_9_30');
  const [balanceVersion, setBalanceVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/login');
    } else {
      setUserId(storedUserId);
    }
    setIsLoading(false);
  }, [router]);

  const handleUserChange = useCallback((newUserId: string) => {
    setUserId(newUserId);
  }, []);

  const handleStockSymbolChange = useCallback((newStockSymbol: string) => {
    setStockSymbol(newStockSymbol);
  }, []);

  const handleBalanceUpdate = useCallback(() => {
    setBalanceVersion(prev => prev + 1);
  }, []);

  const handleOrderPlaced = useCallback(() => {
    handleBalanceUpdate();
    setStockSymbol(prevSymbol => prevSymbol);
  }, [handleBalanceUpdate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return null; 
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onUserChange={handleUserChange} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <motion.h1 
              className="text-3xl font-semibold text-gray-800 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Options Trading Dashboard
            </motion.h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Balance userId={userId} key={balanceVersion} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Onramp userId={userId} onBalanceUpdate={handleBalanceUpdate} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <OrderForm userId={userId} stockSymbol={stockSymbol} orderType="yes" onOrderPlaced={handleOrderPlaced} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <OrderForm userId={userId} stockSymbol={stockSymbol} orderType="no" onOrderPlaced={handleOrderPlaced} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <MintTokens userId={userId} stockSymbol={stockSymbol} />
              </motion.div>
              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Orderbook stockSymbol={stockSymbol} onStockSymbolChange={handleStockSymbolChange} />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
