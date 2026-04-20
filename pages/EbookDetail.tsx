
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Lock, DownloadCloud, Sparkles, ShoppingCart, MessageCircle } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { LuminousCard } from '../components/LuminousCard';
import { GradientButton } from '../components/GradientButton';
import { UI_TEXT } from '../constants';

export const EbookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { config, ebooks } = useFirebase();
  const ebook = useMemo(() => ebooks.find(b => b.id === id) || null, [id, ebooks]);

  if (!ebook) return null;

  return (
    <div className="pt-32 md:pt-48 pb-20 container mx-auto px-4 max-w-6xl">
      <GradientButton variant="primary" onClick={() => navigate('/library')} className="mb-12 w-fit px-6 py-2.5 shadow-xl text-[10px]">
        <ArrowLeft size={14} /> {UI_TEXT.backToLibrary}
      </GradientButton>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
          <LuminousCard className="shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
            <div className="relative overflow-hidden rounded-[15px]">
              <img src={ebook.image} alt={ebook.title} loading="lazy" className="w-full h-auto object-cover" />
              {ebook.isPromo && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-400 to-orange-600 text-white font-black py-3 px-4 rounded-xl shadow-xl z-20 text-[8px] uppercase flex flex-col items-center">
                  <span>OFFRE</span><span className="text-sm mt-0.5">SACRÉE</span>
                </div>
              )}
            </div>
          </LuminousCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4"><span className="h-[1.5px] w-10 bg-amber-500"></span><span className="text-amber-500 font-black tracking-[0.4em] uppercase text-[9px]">{ebook.category}</span></div>
            <h1 className="text-2xl md:text-4xl font-cinzel font-bold text-white leading-tight">{ebook.title}</h1>
            <p className="text-lg md:text-xl text-slate-400 italic border-l-2 border-amber-500/30 pl-6 font-mystiqua leading-relaxed">{ebook.description}</p>
          </div>

          <LuminousCard className="shadow-2xl">
            <div className="p-6 md:p-10 space-y-10">
              <div className="space-y-3">
                <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2"><Sparkles size={12} className="text-amber-500" /> {UI_TEXT.knowledgeWeapon}</h3>
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl md:text-4xl font-cinzel text-price-gradient">{ebook.promoPrice.toFixed(2)}€</span>
                  <span className="text-sm md:text-base text-slate-600 line-through font-cinzel">{ebook.officialPrice.toFixed(2)}€</span>
                </div>
              </div>
              <div className="space-y-4">
                <GradientButton variant="prismatic" onClick={() => window.open(ebook.chariowLink, '_blank')} className="w-full py-4 text-xs md:text-base font-bold uppercase tracking-widest">
                  <ShoppingCart size={20} /> {UI_TEXT.buyNow}
                </GradientButton>
                
                {config.socialLinks?.whatsapp && (
                  <GradientButton 
                    variant="success" 
                    onClick={() => {
                      const message = encodeURIComponent(`Bonjour, je suis intéressé par ${ebook.title} ${window.location.href}`);
                      window.open(`https://wa.me/${config.socialLinks?.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
                    }} 
                    className="w-full py-3.5 text-[10px] md:text-xs font-bold uppercase tracking-widest"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </GradientButton>
                )}

                <div className="flex justify-center gap-6 text-[8px] font-black uppercase text-slate-500">
                  <div className="flex items-center gap-2"><Lock size={10} className="text-amber-500" /> {UI_TEXT.securePayment}</div>
                  <div className="flex items-center gap-2"><DownloadCloud size={10} className="text-blue-500" /> {UI_TEXT.instantAccess}</div>
                </div>
              </div>
            </div>
          </LuminousCard>

          <LuminousCard className="bg-transparent">
            <div className="p-6 md:p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <BookOpen className="text-amber-500" size={16} />
                  </div>
                  <h2 className="text-[10px] md:text-xs font-cinzel font-bold text-slate-400 uppercase tracking-[0.3em]">
                    {UI_TEXT.manuscriptEssence}
                  </h2>
                </div>
              </div>
              <div className="text-base md:text-lg text-slate-300 leading-relaxed font-mystiqua text-justify">
                 <span className="float-left mr-3 mt-1 text-3xl md:text-4xl font-cinzel font-black text-gold-gradient leading-[0.8]">{ebook.summary.charAt(0)}</span>{ebook.summary.slice(1)}
              </div>
            </div>
          </LuminousCard>
        </motion.div>
      </div>
    </div>
  );
};
