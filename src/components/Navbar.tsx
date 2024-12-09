import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './language/LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <motion.nav 
      className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-sm bg-black/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
        OpenCreator
      </h1>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {isAuthenticated ? (
          <motion.button
            onClick={logout}
            className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        ) : (
          <motion.button
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}