import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PlusCircle } from 'lucide-react';
import ProjectCard from './ProjectCard';

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
          >
            <PlusCircle size={24} />
            Create New
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}