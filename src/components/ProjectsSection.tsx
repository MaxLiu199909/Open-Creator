import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PlusCircle } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { AutoSizer, Grid } from 'react-virtualized';

const projects = [
  { id: 1, title: 'Neon Dreams', date: '2024-03-15', preview: 'https://images.unsplash.com/photo-1633218388467-539651dcf81a?w=800&auto=format&fit=crop' },
  { id: 2, title: 'Digital Echo', date: '2024-03-14', preview: 'https://images.unsplash.com/photo-1684469763853-06c5fb0c673a?w=800&auto=format&fit=crop' },
  { id: 3, title: 'Cyber Pulse', date: '2024-03-13', preview: 'https://images.unsplash.com/photo-1675426513962-63c6d2f3dba8?w=800&auto=format&fit=crop' }
];

export default function ProjectsSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateProject = useCallback(() => {
    console.log('Creating new project...');
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
      className="min-h-screen p-8 md:p-16"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 100 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Your Projects
          </h3>
          <motion.button
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-white/90 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateProject}
          >
            <PlusCircle size={24} />
            Create New
          </motion.button>
        </div>

        <AutoSizer>
          {({ width, height }) => (
            <Grid
              cellRenderer={({ columnIndex, key, rowIndex, style }) => {
                const index = rowIndex * 3 + columnIndex;
                if (index >= projects.length) return null;
                return (
                  <div key={key} style={style}>
                    <ProjectCard project={projects[index]} />
                  </div>
                );
              }}
              columnCount={3}
              columnWidth={width / 3}
              height={height}
              rowCount={Math.ceil(projects.length / 3)}
              rowHeight={300}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    </motion.section>
  );
}
