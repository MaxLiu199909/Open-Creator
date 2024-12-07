import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Apple, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await login(provider);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-24 px-4 overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-purple-500/10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <motion.button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={20} />
          Back to home
        </motion.button>

        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
          <div className="relative">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-white/60 mb-8">
              Sign in to continue your creative journey
            </p>

            <div className="space-y-4">
              <motion.button
                onClick={() => handleLogin('google')}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl
                         bg-gradient-to-r from-white to-white/90 text-black font-medium
                         hover:from-white hover:to-white transition-all shadow-lg shadow-white/5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </motion.button>

              <motion.button
                onClick={() => handleLogin('apple')}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl
                         bg-gradient-to-r from-zinc-900 to-black text-white font-medium 
                         border border-white/10 hover:border-white/20 transition-all
                         shadow-lg shadow-black/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <Apple size={20} />
                Continue with Apple
              </motion.button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black text-white/40">Or continue with</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10
                             text-white placeholder-white/40
                             focus:outline-none focus:ring-2 focus:ring-purple-500/30
                             group-hover:border-purple-500/30 transition-all"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-purple-400 transition-colors" size={20} />
                </div>

                <motion.button
                  onClick={() => handleLogin('email')}
                  className="w-full px-6 py-3 rounded-xl font-medium
                           bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500
                           hover:from-purple-600 hover:via-pink-600 hover:to-blue-600
                           text-white shadow-lg shadow-purple-500/20
                           transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  Continue with Email
                </motion.button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-white/40">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}