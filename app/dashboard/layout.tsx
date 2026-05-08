'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Business {
  id: number;
  nombre: string;
  correo: string;
  numero: string;
  avatar: string;
  banner: string;
  isInitialSetupComplete: boolean;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const router = useRouter();

  useEffect(() => {
    const businessData = localStorage.getItem('business');
    if (businessData) {
      try {
        setBusiness(JSON.parse(businessData));
      } catch (err) {
        console.error('Error parsing business data:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('planiaToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('business');
    router.push('/auth/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        animate={{
          width: sidebarOpen ? 280 : 100,
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="bg-gradient-to-b from-teal-600 via-teal-700 to-teal-800 text-white flex flex-col shadow-2xl relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-10"
          animate={{
            x: sidebarOpen ? 100 : 200,
            y: -100,
          }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full opacity-5"
          animate={{
            x: sidebarOpen ? 0 : 50,
            y: 50,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Logo */}
        <motion.div className="p-6 border-b border-teal-500 border-opacity-30 flex items-center justify-center relative min-h-[100px] z-10">
          <motion.div
            animate={{ opacity: sidebarOpen ? 1 : 0, scale: sidebarOpen ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {sidebarOpen && (
              <Image
                src="/assets/images/plania.nobg.png"
                alt="Plania"
                width={140}
                height={50}
                className="object-contain drop-shadow-lg"
              />
            )}
          </motion.div>
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute right-3 hover:bg-teal-500 hover:bg-opacity-50 p-3 rounded-lg transition text-xl text-white backdrop-blur-sm"
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ☰
          </motion.button>
        </motion.div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-2 z-10 overflow-y-auto">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ x: 4 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-4 px-4 py-3 rounded-lg group relative overflow-hidden"
              >
                {/* Background animation on hover */}
                <motion.div
                  className="absolute inset-0 bg-white bg-opacity-10 rounded-lg blur-xl"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 blur-sm"
                  whileHover={{ opacity: 0.2, x: [0, 100] }}
                  transition={{ duration: 0.5 }}
                />

                {/* Icon */}
                <motion.span
                  className="text-2xl relative z-10 flex-shrink-0"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.icon}
                </motion.span>

                {/* Label */}
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 font-semibold text-sm group-hover:text-teal-100"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Border bottom on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-300 to-teal-100"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Logout */}
        <motion.div className="p-4 border-t border-teal-500 border-opacity-30 z-10 relative">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg group relative overflow-hidden"
            whileHover={{ x: 4 }}
          >
            <motion.div
              className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            <motion.span
              className="text-2xl relative z-10 flex-shrink-0"
              whileHover={{ scale: 1.2, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              🚪
            </motion.span>

            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 font-semibold text-sm group-hover:text-red-200"
                >
                  Cerrar sesión
                </motion.span>
              )}
            </AnimatePresence>

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-300 to-red-200"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          className="bg-white shadow-lg h-16 flex items-center justify-between px-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
            Panel de Control
          </h2>
          {business?.avatar ? (
            <motion.div
              className="w-10 h-10 rounded-full overflow-hidden shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={business.avatar}
                alt={business.nombre}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {business?.nombre?.charAt(0).toUpperCase() || 'P'}
            </motion.div>
          )}
        </motion.header>

        {/* Content */}
        <motion.main
          className="flex-1 overflow-auto p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
