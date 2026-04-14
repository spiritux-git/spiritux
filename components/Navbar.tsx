
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Mail } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { GlowingEffect } from './GlowingEffect';
import { UI_TEXT } from '../constants';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { config } = useFirebase();
  
  const navItems = [
    { path: '/', label: UI_TEXT.navHome, icon: Home },
    { path: '/library', label: UI_TEXT.navLibrary, icon: BookOpen },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 md:w-14 md:h-14 overflow-visible rounded-full">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} static={true} />
            <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 z-[1] group-hover:border-transparent transition-all duration-500 shadow-2xl group-hover:shadow-purple-500/20">
              <img src={config.logo} alt="Spiritux Logo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-cinzel font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-none">Spiritux</span>
            <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1">Sagesses Célestes</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`relative px-5 py-2.5 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded-full overflow-hidden group ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-500/30 animate-gradient-flow transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                <Icon size={14} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex md:hidden items-center gap-1">
          <Link to="/" className={`p-2.5 rounded-full transition-all relative overflow-hidden group ${location.pathname === '/' ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>
            <Home size={22} className="relative z-10" />
          </Link>
          <Link to="/library" className={`p-2.5 rounded-full transition-all relative overflow-hidden group ${location.pathname === '/library' ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>
            <BookOpen size={22} className="relative z-10" />
          </Link>
          <Link to="/contact" className={`p-2.5 rounded-full transition-all relative overflow-hidden group ${location.pathname === '/contact' ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>
            <Mail size={22} className="relative z-10" />
          </Link>
        </div>
      </div>
    </nav>
  );
};
