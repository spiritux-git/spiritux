
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, MessageSquare, MapPin, Phone } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { GradientButton } from '../components/GradientButton';
import { LuminousCard } from '../components/LuminousCard';
import { CelestialParticles } from '../components/CelestialParticles';

export const Contact: React.FC = () => {
  const { config } = useFirebase();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (config.formspreeEndpoint) {
      try {
        const response = await fetch(config.formspreeEndpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          setSubmitted(true);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      }
    } else {
      // Fallback for demo
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      <CelestialParticles />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-cinzel font-black text-white mb-8 uppercase tracking-[0.3em]"
          >
            Nous Contactez
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-8"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <img 
                src={config.logo} 
                alt="Spiritux Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-mystiqua text-base md:text-lg"
          >
            Nos sages vous répondent.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form - Order 1 on mobile, Order 2 on desktop */}
          <div className="md:col-span-2 order-1 md:order-2">
            <LuminousCard className="p-8 md:p-10">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-cinzel font-bold text-white mb-4">Message Envoyé</h2>
                  <p className="text-slate-400 font-mystiqua">Votre demande a été transmise aux gardiens du savoir. Nous vous répondrons sous peu.</p>
                  <GradientButton 
                    variant="secondary" 
                    className="mt-8"
                    onClick={() => setSubmitted(false)}
                  >
                    Envoyer un autre message
                  </GradientButton>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Nom Complet</label>
                      <input 
                        type="text" 
                        name="name" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="jean@exemple.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Sujet</label>
                    <input 
                      type="text" 
                      name="subject" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="Question sur un manuscrit"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Message</label>
                    <textarea 
                      name="message" 
                      required
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                      placeholder="Votre message ici..."
                    />
                  </div>
                  <GradientButton type="submit" variant="prismatic" className="w-full py-4 uppercase tracking-[0.3em] font-black">
                    <Send size={18} /> Transmettre
                  </GradientButton>
                </form>
              )}
            </LuminousCard>
          </div>

          {/* Contact Info - Order 2 on mobile, Order 1 on desktop */}
          <div className="md:col-span-1 order-2 md:order-1 space-y-3">
            <LuminousCard className="bg-transparent">
              <div className="flex items-center gap-3.5 p-2.5">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400/70 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all shrink-0">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] uppercase font-black text-slate-600 tracking-[0.25em] mb-0.5">Email</span>
                  <p className="text-slate-300 text-[13px] font-medium truncate group-hover:text-white transition-colors">spiritux.ebook@mail.com</p>
                </div>
              </div>
            </LuminousCard>

            <LuminousCard className="bg-transparent">
              <div className="flex items-center gap-3.5 p-2.5">
                <div className="w-10 h-10 rounded-lg bg-magenta-500/5 border border-magenta-500/10 flex items-center justify-center text-magenta-400/70 group-hover:text-magenta-400 group-hover:bg-magenta-500/10 transition-all shrink-0">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] uppercase font-black text-slate-600 tracking-[0.25em] mb-0.5">WhatsApp</span>
                  <p className="text-slate-300 text-[13px] font-medium truncate group-hover:text-white transition-colors">
                    {config.socialLinks?.whatsapp || '+33 6 00 00 00 00'}
                  </p>
                </div>
              </div>
            </LuminousCard>

            <LuminousCard className="bg-transparent">
              <div className="flex items-center gap-3.5 p-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400/70 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-all shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] uppercase font-black text-slate-600 tracking-[0.25em] mb-0.5">Adresse</span>
                  <p className="text-slate-300 text-[13px] font-medium truncate group-hover:text-white transition-colors">Sanctuaire Astral, Paris</p>
                </div>
              </div>
            </LuminousCard>
          </div>
        </div>
      </div>
    </div>
  );
};
