
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  type?: "button" | "submit" | "reset";
}

export const GradientButton: React.FC<Props> = ({ 
  children, 
  onClick, 
  className = "", 
  variant = 'primary',
  type = "button"
}) => {
  const baseStyles = "relative px-5 py-2.5 rounded-full font-bold transition-all duration-300 overflow-hidden group text-[11px] uppercase tracking-widest flex items-center justify-center gap-2";
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.4)]",
    secondary: "text-white border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10",
    success: "text-white bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    danger: "text-white bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)]"
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Animated shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
      
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.button>
  );
};
