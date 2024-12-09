import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageMenu from './LanguageMenu';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { currentLanguage } = useLanguage();

  const getButtonPosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    return {
      top: rect?.top ?? 0,
      right: window.innerWidth - (rect?.right ?? 0),
    };
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full 
                 bg-white/80 dark:bg-black/80 backdrop-blur-xl
                 border border-white/20 shadow-lg
                 hover:bg-white/90 dark:hover:bg-black/90
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={16} className="text-black/80 dark:text-white/80" />
        <span className="text-sm font-medium text-black/80 dark:text-white/80">
          {currentLanguage.code.toUpperCase()}
        </span>
      </motion.button>

      <LanguageMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position={getButtonPosition()}
      />
    </>
  );
}