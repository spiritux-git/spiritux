
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Quote, Tag } from 'lucide-react';
import { storage } from '../services/storage';
import { LuminousCard } from '../components/LuminousCard';
import { GradientButton } from '../components/GradientButton';
import { useLanguage } from '../context/LanguageContext';

const TestimonialCard = ({ text, book }: any) => (
  <LuminousCard className="h-full">
    <div className="p-8 flex flex-col h-full relative group">
      {/* Subtle Quote Icon Background */}
      <Quote className="absolute top-6 right-6 text-purple-500/10 w-16 h-16 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
      
      <div className="flex-1">
        <p className="text-base md:text-xl text-slate-300 italic mb-8 leading-relaxed font-mystiqua tracking-wide relative z-10">
          "{text}"
        </p>
      </div>

      <div className="pt-6 border-t border-white/5 flex items-center gap-4">
        <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
        <div className="flex flex-col">
          <span className="text-[10px] md:text-[11px] font-black text-blue-400 uppercase tracking-[0.4em]">
            {book}
          </span>
          <span className="text-[7px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Sagesse Céleste</span>
        </div>
      </div>
    </div>
  </LuminousCard>
);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const ebooks = storage.getEbooks();
  
  // Get featured ebooks and apply local translation if it's one of the initial books
  const featuredEbooks = ebooks.filter(e => e.isFeatured).map(e => {
    if (e.id === '1') return { ...e, title: t.ebook1Title };
    if (e.id === '2') return { ...e, title: t.ebook2Title };
    if (e.id === '3') return { ...e, title: t.ebook3Title };
    if (e.id === '4') return { ...e, title: t.ebook4Title };
    if (e.id === '5') return { ...e, title: t.ebook5Title };
    if (e.id === '6') return { ...e, title: t.ebook6Title };
    return e;
  });

  const testimonials = [
    {
      text: t.testi1Text,
      book: t.testi1Book
    },
    {
      text: t.testi2Text,
      book: t.testi2Book
    },
    {
      text: t.testi3Text,
      book: t.testi3Book
    }
  ];

  return (
    <div className="bg-transparent min-h-screen text-slate-200">
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-40 pb-16 md:pb-20 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-6 md:mb-8"
          >
            <Sparkles size={12} /> {t.heroSparkle}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl lg:text-7xl font-cinzel font-bold text-white mb-6 md:mb-10 flex flex-wrap items-center justify-center gap-x-3 md:gap-x-6"
          >
            <span className="bg-gradient-to-r from-purple-500 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              {t.heroTitle}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-xl text-slate-400 italic max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-mystiqua px-4"
          >
            {t.heroSubtitle}
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <GradientButton 
              onClick={() => navigate('/library')}
              className="px-6 py-3 w-full sm:w-auto"
            >
              <ArrowRight size={16} /> {t.exploreLibrary}
            </GradientButton>
            <GradientButton 
              variant="secondary"
              onClick={() => {
                const el = document.getElementById('featured');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 w-full sm:w-auto border-white/5"
            >
              <BookOpen size={14} /> {t.viewSelection}
            </GradientButton>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="py-12 md:py-20 container mx-auto px-4">
        <div className="mb-10 md:mb-16 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-white mb-2 md:mb-4">
                {t.featuredTitle}
              </h2>
              <p className="text-slate-400 text-[10px] md:text-sm tracking-[0.3em] uppercase">
                {t.featuredSubtitle}
              </p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent hidden lg:block mx-10 mb-5"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEbooks.map((ebook) => (
            <motion.div
              key={ebook.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <LuminousCard onClick={() => navigate(`/ebook/${ebook.id}`)}>
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img src={ebook.image} alt={ebook.title} className="w-full h-full object-cover" />
                  
                  {/* Promo Badge */}
                  {ebook.isPromo && (
                    <div className="absolute top-4 left-4 z-20 bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.5)] px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5">
                      <Tag size={10} className="text-white fill-current" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Promo</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-[10px] text-purple-400 font-bold mb-2 uppercase tracking-widest">{ebook.category}</div>
                  <h3 className="text-xl font-cinzel font-bold mb-4 line-clamp-1">{ebook.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{ebook.promoPrice}€</span>
                    <GradientButton className="px-4 py-2 text-[10px]">{t.discover}</GradientButton>
                  </div>
                </div>
              </LuminousCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials (Parables) */}
      <section className="py-20 bg-slate-950/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-cinzel font-bold mb-4 text-white tracking-wide">{t.testimonialsTitle}</h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6 rounded-full" />
            <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] md:text-xs">{t.testimonialsSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {testimonials.map((testi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TestimonialCard {...testi} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
