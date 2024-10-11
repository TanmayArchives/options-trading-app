import { motion } from 'framer-motion';
import { HomeIcon, ChartBarIcon, CurrencyDollarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, href: '#', current: true },
  { name: 'Analytics', icon: ChartBarIcon, href: '#', current: false },
  { name: 'Transactions', icon: CurrencyDollarIcon, href: '#', current: false },
  { name: 'Settings', icon: Cog6ToothIcon, href: '#', current: false },
];

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-indigo-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
            
              <span className="ml-2 text-white text-lg font-semibold">OptionsPro</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                  {item.name}
                </motion.a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}