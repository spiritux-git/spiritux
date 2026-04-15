
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const GradFlow: React.FC = memo(() => {
  return (
    <div className={cn("fixed inset-0 -z-50 overflow-hidden bg-[#0a0518]")}>
      {/* Orbe Magenta vibrant */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: ['-20%', '20%', '-20%'],
          y: ['-10%', '10%', '-10%']
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 -left-1/4 w-full h-full max-w-[800px] max-h-[800px] bg-[#ff00ff]/20 blur-[120px] md:blur-[180px] rounded-full"
        style={{ willChange: 'transform, opacity' }}
      />
      
      {/* Orbe Cyan électrique */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.25, 0.1],
          x: ['20%', '-20%', '20%'],
          y: ['10%', '-10%', '10%']
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-1/4 -right-1/4 w-full h-full max-w-[700px] max-h-[700px] bg-[#00ffff]/20 blur-[120px] md:blur-[180px] rounded-full"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Orbe Doré central */}
      <motion.div
        animate={{
          opacity: [0.03, 0.1, 0.03],
          scale: [0.5, 0.7, 0.5]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-amber-500/10 blur-[150px] md:blur-[200px] rounded-full"
        style={{ willChange: 'transform, opacity' }}
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
          willChange: 'background-position',
        }}
      />

      {/* Vignette prismatique */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,7,32,0.6)_100%)]" />
    </div>
  );
});

GradFlow.displayName = 'GradFlow';
