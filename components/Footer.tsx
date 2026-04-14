
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { UI_TEXT } from '../constants';
import { Facebook, Instagram, MessageCircle, Mail } from 'lucide-react';

const XIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.486 3.24H4.298l13.31 17.41z" />
  </svg>
);

const TikTokIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.34 6.34 0 0 1-1.88-1.55c-.05 2.52.01 5.04-.01 7.56 0 1.34-.36 2.68-1.05 3.82-.7 1.17-1.74 2.14-3 2.75-1.25.61-2.67.85-4.05.7-1.39-.16-2.73-.72-3.82-1.59C3.12 19.14 2.21 17.61 2.01 15.9c-.21-1.71.21-3.5 1.19-4.96.98-1.47 2.45-2.54 4.11-3.01 1.66-.48 3.48-.3 5-.48V11.5c-1.62.15-3.23.83-4.32 2.04-1.08 1.21-1.48 2.91-1.11 4.49.37 1.58 1.63 2.87 3.2 3.28 1.58.41 3.32.01 4.54-.99 1.23-.99 1.83-2.58 1.77-4.16-.01-5.38.01-10.76-.01-16.14z" />
  </svg>
);

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useFirebase();
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

  const socialLinks = config.socialLinks || {
    whatsapp: '',
    facebook: '',
    instagram: '',
    x: '',
    tiktok: ''
  };

  const hasAnySocial = Object.values(socialLinks).some(link => !!link);

  return (
    <footer className="relative z-10 pt-8 pb-6 border-t border-white/5 bg-slate-950/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-3 group cursor-pointer w-fit"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500/50 shadow-lg shadow-purple-500/10 group-hover:border-purple-400 transition-colors">
                <img src={config.logo} alt="Spiritux" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-cinzel font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                Spiritux
              </span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed max-w-xs tracking-wide">
              {UI_TEXT.footerTagline}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">{UI_TEXT.navTitle}</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2">
              <li><Link to="/" className="text-[10px] text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] font-medium">{UI_TEXT.navHome}</Link></li>
              <li><Link to="/library" className="text-[10px] text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] font-medium">{UI_TEXT.navLibrary}</Link></li>
              <li><Link to="/contact" className="text-[10px] text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] font-medium">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-pink-500">{UI_TEXT.footerContact}</h4>
            
            <div className="flex flex-col gap-2.5">
              {socialLinks.whatsapp && (
                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 w-fit group">
                  <div className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 group-hover:text-[#25D366] group-hover:border-[#25D366]/30 transition-all group-hover:scale-105">
                    <MessageCircle size={14} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors font-medium tracking-wide">
                    {socialLinks.whatsapp.replace('https://wa.me/', '').replace('?text=', '')}
                  </span>
                </a>
              )}

              <div className="flex items-center gap-2.5 w-fit group">
                <div className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 group-hover:text-purple-400 group-hover:border-purple-400/30 transition-all group-hover:scale-105">
                  <Mail size={14} />
                </div>
                <a href="mailto:spiritux.ebook@mail.com" className="text-[10px] text-slate-400 group-hover:text-white transition-colors font-medium tracking-wide">
                  spiritux.ebook@mail.com
                </a>
              </div>

              {hasAnySocial && (
                <div className="flex items-center gap-2.5 pt-1">
                  {socialLinks.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-all hover:scale-110" title="Facebook">
                      <Facebook size={14} />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-[#E4405F] hover:border-[#E4405F]/30 transition-all hover:scale-110" title="Instagram">
                      <Instagram size={14} />
                    </a>
                  )}
                  {socialLinks.x && (
                    <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-white/30 transition-all hover:scale-110" title="X (Twitter)">
                      <XIcon size={14} />
                    </a>
                  )}
                  {socialLinks.tiktok && (
                    <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-[#00f2ea] hover:border-[#00f2ea]/30 transition-all hover:scale-110" title="TikTok">
                      <TikTokIcon size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-center items-center">
          <span className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-medium text-center">
            {UI_TEXT.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
};
