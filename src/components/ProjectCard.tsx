import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    date: string;
    preview: string;
  };
}

const ProjectCard = memo(({ project }: ProjectCardProps) => {
  return (
    <motion.div
      className="bg-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition cursor-pointer group"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={project.preview}
          alt={project.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          {project.title}
        </h4>
        <p className="text-white/60">{project.date}</p>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
