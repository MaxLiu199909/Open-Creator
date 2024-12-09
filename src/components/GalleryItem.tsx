import React from 'react';
import { motion } from 'framer-motion';

interface GalleryItemProps {
  item: {
    id: number;
    author: string;
    image: string;
  };
}

export default function GalleryItem({ item }: GalleryItemProps) {
  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden"
      whileHover={{ scale: 1.05 }}
    >
      <motion.img 
        src={item.image} 
        alt={`Art by ${item.author}`} 
        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6"
        initial={{ y: 20 }}
        whileHover={{ y: 0 }}
      >
        <p className="text-lg font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          by {item.author}
        </p>
      </motion.div>
    </motion.div>
  );
}