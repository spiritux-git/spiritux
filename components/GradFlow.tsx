
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const GradFlow: React.FC = () => {
  return (
    <div className={cn("fixed inset-0 -z-50 overflow-hidden bg-[#0a0518]")}>
      {/* Orbe Magenta vibrant */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [-100, 100, -100],
          y: [-50, 50, -50]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 -left-1/4 w-[100vw] h-[100vw] bg-[#ff00ff]/20 blur-[180px] rounded-full"
      />
      
      {/* Orbe Cyan électrique */}
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.15, 0.35, 0.15],
          x: [100, -100, 100],
          y: [50, -50, 50]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-1/4 -right-1/4 w-[90vw] h-[90vw] bg-[#00ffff]/20 blur-[180px] rounded-full"
      />

      {/* Orbe Doré central */}
      <motion.div
        animate={{
          opacity: [0.05, 0.15, 0.05],
          scale: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-amber-500/10 blur-[200px] rounded-full"
      />

      {/* Couche de dégradé animé en arrière-plan */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(45deg, #0f0720, #2e1065, #4c1d95, #0f0720)`,
          backgroundSize: `400% 400%`,
        }}
      />

      {/* Vignette prismatique */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,7,32,0.6)_100%)]" />
    </div>
  );
};
