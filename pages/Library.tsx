
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowLeft, Sparkles, Tag } from 'lucide-react';
import { storage } from '../services/storage';
import { LuminousCard } from '../components/LuminousCard';
import { GradientButton } from '../components/GradientButton';
import { useLanguage } from '../context/LanguageContext';

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const ebooks = storage.getEbooks();

  const filteredEbooks = ebooks.filter(b => {
    const title = 
      b.id === '1' ? t.ebook1Title : 
      b.id === '2' ? t.ebook2Title : 
      b.id === '3' ? t.ebook3Title : 
      b.id === '4' ? t.ebook4Title : 
      b.id === '5' ? t.ebook5Title : 
      b.id === '6' ? t.ebook6Title : 
      b.title;
    return title.toLowerCase().includes(search.toLowerCase()) || 
           b.category.toLowerCase().includes(search.toLowerCase());
  }).map(b => {
    if (b.id === '1') return { ...b, title: t.ebook1Title };
    if (b.id === '2') return { ...b, title: t.ebook2Title };
    if (b.id === '3') return { ...b, title: t.ebook3Title };
    if (b.id === '4') return { ...b, title: t.ebook4Title };
    if (b.id === '5') return { ...b, title: t.ebook5Title };
    if (b.id === '6') return { ...b, title: t.ebook6Title };
    return b;
  });

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 container mx-auto px-4">
      <div className="mb-8 md:mb-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 md:mb-8 transition-colors text-xs md:text-sm font-medium"
        >
          <ArrowLeft size={16} /> {t.backToHome}
        </button>
        <h1 className="text-3xl md:text-5xl font-cinzel font-bold mb-6 md:mb-8">{t.libraryTitle}</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
            <input 
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-full py-3 md:py-4 pl-12 md:pl-14 pr-6 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm md:text-base"
            />
          </div>
          <GradientButton 
            variant="secondary"
            className="w-full md:w-auto px-8 py-4 border-white/5"
          >
            <SlidersHorizontal size={16} /> {t.filters}
          </GradientButton>
        </div>
      </div>

      {filteredEbooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredEbooks.map((ebook, idx) => (
            <motion.div
              key={ebook.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.03, 
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 10 } 
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: idx * 0.05 }}
              className="z-10"
            >
              <LuminousCard onClick={() => navigate(`/ebook/${ebook.id}`)} className="h-full">
                <div className="aspect-[3/4] overflow-hidden relative group/img">
                  <img 
                    src={ebook.image} 
                    alt={ebook.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" 
                  />
                  
                  {/* Promo Badge Overlay */}
                  {ebook.isPromo && (
                    <div className="absolute top-3 left-3 z-20 bg-rose-600/90 backdrop-blur-sm shadow-[0_0_15px_rgba(225,29,72,0.4)] px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                      <Tag size={10} className="text-white fill-current" />
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white">Promo</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                </div>
                <div className="p-4 md:p-6">
                  <div className="text-[9px] md:text-xs text-purple-400 font-bold mb-1 md:mb-2 uppercase tracking-widest">{ebook.category}</div>
                  <h3 className="text-base md:text-lg font-cinzel font-bold mb-3 md:mb-4 line-clamp-1 group-hover:text-purple-300 transition-colors">{ebook.title}</h3>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <span className="block text-xl md:text-2xl font-bold">{ebook.promoPrice}€</span>
                      <span className="text-[9px] md:text-xs text-slate-500 line-through tracking-wider">{ebook.officialPrice}€</span>
                    </div>
                    <GradientButton className="px-4 py-2 md:px-5 md:py-2.5 text-[9px] md:text-xs uppercase tracking-widest shadow-lg group-hover:shadow-purple-500/20 flex items-center gap-1.5 md:gap-2">
                      <Sparkles size={10} /> {t.getNow}
                    </GradientButton>
                  </div>
                </div>
              </LuminousCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 md:py-24">
          <p className="text-slate-500 text-lg font-medium">{t.noResults}</p>
        </div>
      )}
    </div>
  );
};
