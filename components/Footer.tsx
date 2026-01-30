
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const config = storage.getConfig();
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current > 3000) {
      setClickCount(1);
    } else {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount >= 5) {
        navigate('/admin');
        setClickCount(0);
      }
    }
    lastClickTime.current = now;
  };

  return (
    <footer className="relative z-10 pt-16 pb-12 border-t border-white/5 bg-slate-950/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Logo & Brand - Secret Entry Point */}
          <div className="space-y-6">
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-4 group cursor-pointer w-fit"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border border-purple-500/50 shadow-lg shadow-purple-500/10 group-hover:border-purple-400 transition-colors">
                <img src={config.logo} alt="Spiritux" className="w-full h-full object-cover" />
              </div>
              <span className="text-3xl font-cinzel font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                Spiritux
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs tracking-wide">
              {t.footerTagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-blue-400">{t.navTitle}</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] font-medium">{t.navHome}</Link></li>
              <li><Link to="/library" className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] font-medium">{t.navLibrary}</Link></li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-pink-500">{t.footerContact}</h4>
            <div className="space-y-4 flex flex-col">
              <p className="text-xs text-slate-400 font-medium tracking-[0.1em]">
                Email : <a href="mailto:spiritux.ebook@mail.com" className="text-slate-300 hover:text-purple-400 transition-colors">spiritux.ebook@mail.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex justify-center items-center">
          <span className="text-xs text-slate-600 uppercase tracking-[0.4em] font-medium text-center">
            {t.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
};
