import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language } from '../../types/language';
import Backdrop from '../ui/Backdrop';

interface LanguageMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; right: number };
}

export default function LanguageMenu({ isOpen, onClose, position }: LanguageMenuProps) {
  const { currentLanguage, setLanguage, languages } = useLanguage();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            style={{
              top: position.top + 45,
              right: position.right,
            }}
            className="fixed z-50 min-w-[200px] p-1 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 shadow-lg"
          >
            {languages.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-left text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                role="menuitem"
                aria-label={`Select ${language.name}`}
              >
                <span className="flex items-center gap-3">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-black/40 dark:text-white/40">
                    {language.name}
                  </span>
                </span>
                {currentLanguage.code === language.code && (
                  <Check size={16} className="text-blue-500" />
                )}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}