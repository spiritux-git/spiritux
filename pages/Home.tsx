
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Quote, Star, Tag } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { LuminousCard } from '../components/LuminousCard';
import { GradientButton } from '../components/GradientButton';
import { UI_TEXT } from '../constants';
import EnergyBeam from '../components/EnergyBeam';
import { CelestialParticles } from '../components/CelestialParticles';

const TestimonialCard = ({ text, book }: any) => (
  <LuminousCard className="h-full">
    <div className="p-10 flex flex-col h-full relative group">
      <Quote className="absolute top-8 right-8 text-cyan-500/5 w-20 h-20 transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-12" />
      <div className="flex-1">
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (<Star key={i} size={10} className="text-cyan-400 fill-cyan-400/30" />))}
        </div>
        <p className="text-lg md:text-2xl text-slate-100 italic mb-10 leading-relaxed font-mystiqua tracking-wide relative z-10">"{text}"</p>
      </div>
      <div className="pt-8 border-t border-white/10 flex items-center gap-5">
        <div className="w-1.5 h-10 bg-gradient-to-b from-cyan-400 via-magenta-500 to-amber-500 rounded-full" />
        <div className="flex flex-col">
          <span className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-[0.5em]">{book}</span>
          <span className="text-[8px] text-cyan-500/80 uppercase tracking-[0.3em] font-bold mt-1.5">Sagesse Éternelle</span>
        </div>
      </div>
    </div>
  </LuminousCard>
);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { config, ebooks } = useFirebase();
  const featuredEbooks = ebooks.filter(e => e.isFeatured);

  const testimonials = [
    { text: "Le royaume des cieux est semblable à un marchand qui cherche de belles perles. Lorsqu'il en a trouvé une de grand prix, il l'achète.", book: "TRÉSOR CACHÉ" },
    { text: "Celui qui bâtit sa maison sur le roc restera inébranlable face à la tempête. Vos fondations sont votre force.", book: "LE ROC" },
    { text: "Rien ne vous sera impossible si vous croyez en la puissance infinie qui réside en votre âme.", book: "FORCE DE LA FOI" }
  ];

  return (
    <div className="bg-transparent min-h-screen text-slate-100 relative">
      <CelestialParticles />
      <section className="relative pt-24 md:pt-36 pb-12 md:pb-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-8 md:mb-12 backdrop-blur-md">
            <Sparkles size={16} className="animate-pulse" /> {UI_TEXT.heroSparkle}
          </motion.div>
          <div className="relative mb-6 md:mb-10 py-2 md:py-4">
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none flex items-center justify-center">
              <div className="w-full h-full max-w-6xl mx-auto overflow-hidden rounded-[1.5rem] md:rounded-[3rem] border border-white/10 relative">
                 {config.homeVideoUrl ? (
                   <video 
                     src={config.homeVideoUrl} 
                     autoPlay 
                     muted 
                     loop 
                     playsInline 
                     className="w-full h-full object-cover opacity-40 scale-110"
                   />
                 ) : (
                   <EnergyBeam className="w-full h-full scale-110" projectId="hRFfUymDGOHwtFe7evR2" />
                 )}
              </div>
            </div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} className="relative z-20 text-[13px] sm:text-xl md:text-2xl lg:text-3xl font-cinzel font-black tracking-[0.05em] leading-snug max-w-2xl mx-auto uppercase px-4">
              <span className="text-aura-gradient block">{UI_TEXT.heroTitle}</span>
            </motion.h1>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-[15px] md:text-2xl text-slate-300 italic max-w-2xl mx-auto mb-10 font-mystiqua px-6">{UI_TEXT.heroSubtitle}</motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 md:gap-5">
            <GradientButton variant="prismatic" onClick={() => navigate('/library')} className="px-6 py-2.5 w-full sm:w-auto text-[11px] md:text-xs">
              <BookOpen size={14} /> {UI_TEXT.exploreLibrary}
            </GradientButton>
          </div>
        </div>
      </section>

      <section id="featured" className="pt-20 md:pt-32 pb-20 md:pb-28 container mx-auto px-4 relative">
        <div className="mb-8 md:mb-16 text-center">
          <h2 className="text-lg md:text-3xl font-cinzel font-bold text-white mb-4 tracking-wider uppercase">{UI_TEXT.featuredTitle}</h2>
          <p className="text-magenta-400 text-[8px] md:text-xs tracking-[0.4em] uppercase font-black">{UI_TEXT.featuredSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
          {featuredEbooks.map((ebook, i) => (
            <motion.div key={ebook.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <LuminousCard onClick={() => navigate(`/ebook/${ebook.id}`)} className="h-full">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img src={ebook.image} alt={ebook.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                  {ebook.isPromo && (
                    <div className="absolute top-4 left-4 z-20 bg-rose-600/90 backdrop-blur-sm px-4 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
                      <Tag size={10} className="text-white fill-current" />
                      <span className="text-[8px] font-black uppercase text-white">Promo</span>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="text-[8px] text-cyan-400 font-black mb-3 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-6 h-px bg-cyan-500/50"></span>{ebook.category}
                  </div>
                  <h3 className="text-lg font-cinzel font-bold mb-6 line-clamp-1 text-white">{ebook.title}</h3>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-xl text-price-gradient">{ebook.promoPrice.toFixed(2)}€</span>
                      <span className="text-[10px] text-slate-500 line-through">{ebook.officialPrice.toFixed(2)}€</span>
                    </div>
                    <GradientButton variant="prismatic" className="px-6 py-3 text-[11px] md:text-xs uppercase flex items-center gap-2">
                      <Sparkles size={14} />{UI_TEXT.discover}
                    </GradientButton>
                  </div>
                </div>
              </LuminousCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-2xl md:text-4xl font-cinzel font-black mb-6 text-white uppercase">{UI_TEXT.testimonialsTitle}</h2>
          <p className="text-cyan-500 uppercase tracking-[0.4em] text-[10px] font-black mb-16">{UI_TEXT.testimonialsSubtitle}</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
            {testimonials.map((testi, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}>
                <TestimonialCard {...testi} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
