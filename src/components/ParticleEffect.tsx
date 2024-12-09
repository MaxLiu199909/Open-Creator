import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function ParticleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const opacity = useTransform(scrollY, [0, 200], [0, 1]);

  const createParticles = useMemo(() => (width: number, height: number) => {
    const particleCount = Math.min(100, Math.floor((width * height) / 20000));
    return Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      opacity: Math.random()
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      
      ctx.scale(dpr, dpr);
      particles.current = createParticles(displayWidth, displayHeight);
    };

    const animate = (timestamp: number) => {
      if (!ctx) return;
      
      if (timestamp - lastTimeRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      particles.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.opacity *= 0.99;

        if (particle.opacity < 0.01) {
          particle.opacity = 1;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.moveTo(particle.x, particle.y);
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      });
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticles]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity }}
    />
  );
}