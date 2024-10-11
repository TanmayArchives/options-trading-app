import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onUserChange: (userId: string) => void;
}

export default function Header({ onUserChange }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`/api/user/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
          }
        } catch (error) {
          console.error('Failed to fetch username:', error);
        }
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.h2
            className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Options Trading
          </motion.h2>
          <motion.div
            className="ml-4 flex items-center md:ml-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <BellIcon className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <span className="ml-3 text-gray-700">{username || 'Loading...'}</span>
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
                </button>
              </div>
              {isUserMenuOpen && (
                <motion.div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                </motion.div>
              )}
            </div>
          </motion.div>
          <button
            onClick={handleLogout}
            className="ml-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}