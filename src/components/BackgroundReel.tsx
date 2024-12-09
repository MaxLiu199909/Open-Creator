import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const backgrounds = [
  'https://images.unsplash.com/photo-1675426513962-63c6d2f3dba8?w=1920&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1684469763853-06c5fb0c673a?w=1920&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1633218388467-539651dcf81a?w=1920&auto=format&fit=crop&q=80'
];

export default function BackgroundReel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(new Array(backgrounds.length).fill(false));

  useEffect(() => {
    // 预加载所有图片
    backgrounds.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
    });

    // 自动切换背景
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % backgrounds.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <AnimatePresence mode="wait">
        {isLoaded[currentIndex] && (
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              scale: [1.1, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 8, ease: 'linear' }
            }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{ 
                backgroundImage: `url(${backgrounds[currentIndex]})`,
                filter: 'brightness(0.3) contrast(1.2) saturate(1.2)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
    </div>
  );
}