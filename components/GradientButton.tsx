
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'luxury' | 'prismatic';
  type?: "button" | "submit" | "reset";
  rounded?: 'full' | 'xl' | '2xl' | 'lg';
  disabled?: boolean;
}

export const GradientButton: React.FC<Props> = ({ 
  children, 
  onClick, 
  className = "", 
  variant = 'primary',
  type = "button",
  rounded = 'full',
  disabled = false
}) => {
  const roundedClasses = {
    full: 'rounded-full',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    lg: 'rounded-lg'
  };

  const baseStyles = `relative px-7 py-3.5 ${roundedClasses[rounded]} font-bold transition-all duration-500 overflow-hidden group text-[11px] tracking-[0.2em] flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed border shadow-xl transform-gpu`;
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 border-white/20 hover:border-white/40 shadow-purple-900/20 hover:shadow-purple-500/30 animate-gradient-flow uppercase",
    secondary: "text-white border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/30 shadow-black/40 uppercase",
    luxury: "text-white bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-600 border-amber-400/30 hover:border-amber-400/60 shadow-amber-900/40 hover:shadow-amber-500/30 animate-gradient-flow",
    prismatic: "text-white bg-gradient-to-r from-cyan-500 via-magenta-500 via-purple-600 to-amber-500 border-white/20 hover:border-white/50 shadow-magenta-500/20 hover:shadow-cyan-500/40 animate-gradient-flow",
    success: "text-white bg-gradient-to-r from-emerald-600 via-green-500 to-teal-400 border-emerald-400/20 hover:shadow-emerald-500/20 animate-gradient-flow uppercase",
    danger: "text-white bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 border-rose-400/20 hover:shadow-rose-500/20 animate-gradient-flow uppercase",
    warning: "text-white bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 border-amber-400/20 hover:shadow-amber-500/20 animate-gradient-flow uppercase"
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05, y: -3, rotateX: 5, rotateY: 5 }}
      whileTap={disabled ? {} : { scale: 0.95, y: 0 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Reflective light bar */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      
      {/* Subtle radial glow inside button */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{children}</span>
    </motion.button>
  );
};
