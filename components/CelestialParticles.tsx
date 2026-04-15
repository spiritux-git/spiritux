
import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';

export const CelestialParticles: React.FC = memo(() => {
  const shards = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 15 : 40;
    
    return Array.from({ length: count }).map((_, i) => {
      const colors = ['#ff00ff', '#00ffff', '#f59e0b', '#8b5cf6'];
      return {
        id: i,
        size: Math.random() * 15 + 5,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 500 - 250,
        rotate: Math.random() * 360,
        duration: Math.random() * 30 + 20,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.4 + 0.1,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 perspective-container">
      {shards.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            backgroundColor: s.color,
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            opacity: s.opacity,
            boxShadow: `0 0 20px ${s.color}`,
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotateX: [s.rotate, s.rotate + 360],
            rotateY: [s.rotate, s.rotate - 360],
            z: [s.z, s.z + 100, s.z],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
});

CelestialParticles.displayName = 'CelestialParticles';
