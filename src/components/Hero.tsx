import React, { useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PlusCircle } from 'lucide-react';
import Navbar from './Navbar';
import BackgroundReel from './BackgroundReel';
import ParticleEffect from './ParticleEffect';

export default function Hero() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const { scrollY } = useScroll();
  const textScale = useTransform(scrollY, [0, 300], [1, 1.5]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const maskSize = useTransform(scrollY, [0, 300], ['100%', '150%']);

  const handleCreateProject = useCallback(() => {
    // 处理创建项目的逻辑
    console.log('Creating new project...');
  }, []);

  return (
    <motion.section
      ref={ref}
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      <Navbar />
      <BackgroundReel />
      <ParticleEffect />
      
      <div className="relative z-10 flex flex-col items-center gap-12">
        <motion.div
          className="relative"
          style={{ scale: textScale, opacity: textOpacity }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 blur-3xl"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              repeatType: "mirror"
            }}
          />
          
          <motion.h2
            className="text-[8vw] font-black text-center leading-tight mix-blend-overlay relative"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundImage: "linear-gradient(135deg, #fff 30%, #4a90e2 100%)",
              maskImage: "radial-gradient(circle at center, black, transparent)",
              maskSize,
              willChange: 'transform'
            }}
          >
            AI Workflows<br/>for ALL Designers
          </motion.h2>
        </motion.div>

        <motion.button
          className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-colors"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateProject}
        >
          <PlusCircle size={24} />
          Create New Project
        </motion.button>
      </div>

      <motion.div
        className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror"
        }}
      />

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "mirror"
          }}
        >
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}