import React from 'react';
import { motion } from 'framer-motion';

interface BackdropProps {
  onClick: () => void;
}

export default function Backdrop({ onClick }: BackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
      aria-hidden="true"
    />
  );
}