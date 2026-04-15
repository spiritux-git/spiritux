
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowLeft, Sparkles, Tag } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { LuminousCard } from '../components/LuminousCard';
import { GradientButton } from '../components/GradientButton';
import { UI_TEXT } from '../constants';

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { ebooks } = useFirebase();

  const filteredEbooks = ebooks.filter(b => {
    const searchTerm = search.toLowerCase();
    return b.title.toLowerCase().includes(searchTerm) || 
           b.category.toLowerCase().includes(searchTerm) ||
           b.description.toLowerCase().includes(searchTerm);
  });

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 container mx-auto px-4">
      <div className="mb-8 md:mb-12">
        <GradientButton variant="primary" onClick={() => navigate('/')} className="mb-8 w-fit px-6 py-3 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
          <ArrowLeft size={16} /> {UI_TEXT.backToHome}
        </GradientButton>
        <h1 className="text-3xl md:text-5xl font-cinzel font-bold mb-6 md:mb-8 text-center">{UI_TEXT.libraryTitle}</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <LuminousCard className="flex-1 w-full bg-transparent rounded-full">
            <div className="relative group w-full">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder={UI_TEXT.searchPlaceholder} 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full bg-transparent border-none rounded-full py-3 pl-12 pr-6 outline-none transition-all" 
              />
            </div>
          </LuminousCard>
          <LuminousCard className="w-full md:w-auto bg-transparent rounded-full">
            <button className="w-full md:w-auto px-8 py-4 flex items-center gap-2 text-slate-300 font-bold uppercase tracking-widest text-xs">
              <SlidersHorizontal size={16} /> {UI_TEXT.filters}
            </button>
          </LuminousCard>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredEbooks.length > 0 ? filteredEbooks.map((ebook, idx) => (
          <motion.div key={ebook.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }} className="z-10">
            <LuminousCard onClick={() => navigate(`/ebook/${ebook.id}`)} className="h-full">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img src={ebook.image} alt={ebook.title} loading="lazy" className="w-full h-full object-cover" />
                {ebook.isPromo && (
                  <div className="absolute top-3 left-3 z-20 bg-rose-600/90 px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                    <Tag size={10} className="text-white fill-current" />
                    <span className="text-[8px] font-black uppercase text-white">Promo</span>
                  </div>
                )}
              </div>
              <div className="p-4 md:p-6">
                <div className="text-[9px] md:text-xs text-purple-400 font-bold mb-1 uppercase">{ebook.category}</div>
                <h3 className="text-base md:text-lg font-cinzel font-bold mb-3 line-clamp-1">{ebook.title}</h3>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <span className="block text-xl md:text-2xl font-bold text-price-gradient">{ebook.promoPrice.toFixed(2)}€</span>
                    <span className="text-[10px] text-slate-500 line-through">{ebook.officialPrice.toFixed(2)}€</span>
                  </div>
                  <GradientButton className="px-5 py-2.5 text-[11px] md:text-xs flex items-center gap-2">
                    <Sparkles size={14} /> {UI_TEXT.getNow}
                  </GradientButton>
                </div>
              </div>
            </LuminousCard>
          </motion.div>
        )) : <p className="col-span-full text-center py-24 text-slate-500">{UI_TEXT.noResults}</p>}
      </div>
    </div>
  );
};
