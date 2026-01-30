
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { GlowingEffect } from './GlowingEffect';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LuminousCard: React.FC<Props> = ({ children, className = "", onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative rounded-2xl bg-slate-900/40 cursor-pointer overflow-visible",
        className
      )}
    >
      {/* Composant GlowingEffect intégré */}
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      
      {/* Contenu de la carte avec un fond sombre semi-transparent */}
      <div 
        className="relative h-full overflow-hidden rounded-[15px] bg-slate-950/90 backdrop-blur-xl z-[1] border border-white/5 group-hover:border-transparent transition-colors duration-500"
      >
        {children}
      </div>
    </motion.div>
  );
};
