import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';
import GalleryItem from './GalleryItem';

const gallery = [
  { id: 1, author: 'Neo', image: 'https://images.unsplash.com/photo-1679083216051-aa510a1a2c0e?w=800&auto=format&fit=crop' },
  { id: 2, author: 'Trinity', image: 'https://images.unsplash.com/photo-1708616748538-bdd66d6a9e25?w=800&auto=format&fit=crop' },
  { id: 3, author: 'Morpheus', image: 'https://images.unsplash.com/photo-1708638781158-21d9d946c4db?w=800&auto=format&fit=crop' },
  { id: 4, author: 'Oracle', image: 'https://images.unsplash.com/photo-1675426513962-63c6d2f3dba8?w=800&auto=format&fit=crop' }
];

export default function GallerySection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <motion.section
      ref={ref}
      className="min-h-screen p-8 md:p-16 bg-gradient-to-b from-black to-purple-900/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex items-center gap-3 mb-12"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles className="text-yellow-400" size={32} />
          <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
            Community Gallery
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gallery.map((item) => (
            <GalleryItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}