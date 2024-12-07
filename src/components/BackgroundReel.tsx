import React from 'react';
import { motion } from 'framer-motion';

const backgrounds = [
  'https://images.unsplash.com/photo-1675426513962-63c6d2f3dba8?w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1684469763853-06c5fb0c673a?w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1633218388467-539651dcf81a?w=1920&auto=format&fit=crop'
];

export default function BackgroundReel() {
  return (
    <div className="fixed inset-0 z-0">
      {backgrounds.map((bg, index) => (
        <motion.div
          key={bg}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{
            duration: 8,
            delay: index * 8,
            repeat: Infinity,
            repeatDelay: (backgrounds.length - 1) * 8
          }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${bg})`,
              filter: 'brightness(0.3) contrast(1.2) saturate(1.2)'
            }}
          />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
    </div>
  );
}