
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Languages, ChevronDown, Check } from 'lucide-react';
import { storage } from '../services/storage';
import { GlowingEffect } from './GlowingEffect';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

/**
 * Composant LanguageSwitcher isolé pour éviter les conflits de Refs 
 * entre les versions Desktop et Mobile.
 */
const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const langs: { code: Language; label: string }[] = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-full text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 hover:border-purple-500/30 group ${isOpen ? 'border-purple-500/50 bg-white/10 text-white' : ''}`}
      >
        <Languages size={16} className={`${isOpen ? 'rotate-12' : ''} transition-transform duration-300`} />
        <span className="text-[10px] font-black uppercase tracking-tighter">{language}</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        
        {/* Active Glow */}
        {isOpen && (
          <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-md -z-10 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-40 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60]"
          >
            <div className="p-1.5 space-y-0.5">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    language === l.code 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="opacity-50 text-[8px] font-black w-4">{l.code}</span>
                    {l.label}
                  </span>
                  {language === l.code && <Check size={12} className="text-purple-400" />}
                </button>
              ))}
            </div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const location = useLocation();
  const config = storage.getConfig();
  const { t } = useLanguage();
  
  const navItems = [
    { path: '/', label: t.navHome, icon: Home },
    { path: '/library', label: t.navLibrary, icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link 
          to="/"
          className="flex items-center gap-2 md:gap-3 group cursor-pointer"
        >
          <div className="relative w-10 h-10 md:w-14 md:h-14 overflow-visible rounded-full">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            
            <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 z-[1] group-hover:border-transparent transition-all duration-500 shadow-2xl group-hover:shadow-purple-500/20">
              <img 
                src={config.logo} 
                alt="Spiritux Logo" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 opacity-50 group-hover:opacity-0 transition-opacity" />
            </div>
            {/* Visual glow backdrop for extra "pop" on hover */}
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-125" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-cinzel font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity leading-none">
              Spiritux
            </span>
            <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1 group-hover:text-slate-300 transition-colors">
              Sagesses Célestes
            </span>
          </div>
        </Link>

        {/* Desktop Navigation & Language */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2.5 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded-full overflow-hidden group ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                  
                  <Icon size={14} className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          {/* Unified Language Switcher */}
          <LanguageSwitcher />
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher />
          
          <div className="flex items-center gap-1">
            <Link to="/" className={`p-2.5 rounded-full transition-all ${location.pathname === '/' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white'}`}>
              <Home size={22} />
            </Link>
            <Link to="/library" className={`p-2.5 rounded-full transition-all ${location.pathname === '/library' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white'}`}>
              <BookOpen size={22} />
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </nav>
  );
};
