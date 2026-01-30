
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface GradFlowConfig {
  color1: { r: number; g: number; b: number };
  color2: { r: number; g: number; b: number };
  color3: { r: number; g: number; b: number };
  speed: number;
  scale: number;
  type: 'stripe' | 'blob';
  noise: number;
}

interface Props {
  config?: GradFlowConfig;
  className?: string;
}

export const GradFlow: React.FC<Props> = ({ config, className }) => {
  // Enhanced mystical and luxurious palette
  const cfg = config || {
    color1: { r: 15, g: 23, b: 42 },   // Deep Slate
    color2: { r: 88, g: 28, b: 135 },  // Royal Purple
    color3: { r: 15, g: 12, b: 41 },   // Midnight Indigo
    speed: 0.25,                       // Slower, more majestic movement
    scale: 1.5,                        // Larger, more ethereal gradients
    type: 'stripe',
    noise: 0.12                        // Slightly more texture for a premium "film grain" feel
  };

  const c1 = `rgb(${cfg.color1.r}, ${cfg.color1.g}, ${cfg.color1.b})`;
  const c2 = `rgb(${cfg.color2.r}, ${cfg.color2.g}, ${cfg.color2.b})`;
  const c3 = `rgb(${cfg.color3.r}, ${cfg.color3.g}, ${cfg.color3.b})`;

  return (
    <div className={cn("fixed inset-0 -z-50 overflow-hidden bg-[#020617]", className)}>
      {/* Primary animated layer */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 30 / cfg.speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 opacity-40"
        style={{
          background: `repeating-linear-gradient(
            -45deg,
            ${c1} 0%,
            ${c2} 20%,
            ${c3} 40%,
            ${c2} 60%,
            ${c1} 80%,
            ${c3} 100%
          )`,
          backgroundSize: `${300 * cfg.scale}% ${300 * cfg.scale}%`,
          filter: 'blur(100px)',
        }}
      />

      {/* Dynamic Orbs for depth */}
      <motion.div
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-[80%] h-[80%] rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${c2}, transparent 60%)`, 
          filter: 'blur(140px)' 
        }}
      />
      
      <motion.div
        animate={{
          x: [50, -50, 50],
          y: [30, -30, 30],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[10%] w-[70%] h-[70%] rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${c3}, transparent 60%)`, 
          filter: 'blur(150px)' 
        }}
      />

      {/* Grain/Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3%3E")`
        }}
      />
      
      {/* Dark Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80" />
    </div>
  );
};
