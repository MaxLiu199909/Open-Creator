import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';
import GalleryItem from './GalleryItem';
import { GalleryItem as GalleryItemType } from '../types/components';
import { AutoSizer, Grid } from 'react-virtualized';

const gallery: GalleryItemType[] = [
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGalleryClick = useCallback((itemId: number) => {
    console.log('Gallery item clicked:', itemId);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

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

        <AutoSizer>
          {({ width, height }) => (
            <Grid
              cellRenderer={({ columnIndex, key, rowIndex, style }) => {
                const index = rowIndex * 4 + columnIndex;
                if (index >= gallery.length) return null;
                return (
                  <div key={key} style={style} onClick={() => handleGalleryClick(gallery[index].id)}>
                    <GalleryItem item={gallery[index]} />
                  </div>
                );
              }}
              columnCount={4}
              columnWidth={width / 4}
              height={height}
              rowCount={Math.ceil(gallery.length / 4)}
              rowHeight={320}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    </motion.section>
  );
}
