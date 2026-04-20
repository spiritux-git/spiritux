
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Image as ImageIcon, Lock, X, Pencil, LayoutGrid, Check, Star, Info, ScrollText, Settings, Video, MessageCircle, Mail, LogOut, Database } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { firebaseService } from '../services/firebaseService';
import { loginWithGoogle, logout } from '../firebase';
import { Ebook, SiteConfig } from '../types';
import { GradientButton } from '../components/GradientButton';
import { LuminousCard } from '../components/LuminousCard';
import { UI_TEXT } from '../constants';

export const Admin: React.FC = () => {
  const { ebooks: fbEbooks, config: fbConfig, user, isAuthReady } = useFirebase();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [config, setConfig] = useState<SiteConfig>(fbConfig);
  const [status, setStatus] = useState<string | null>(null);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [activeTab, setActiveTab] = useState<'catalogue' | 'settings'>('catalogue');

  useEffect(() => {
    setEbooks(fbEbooks);
  }, [fbEbooks]);

  useEffect(() => {
    setConfig(fbConfig);
  }, [fbConfig]);

  const isAdmin = user?.email === 'spirituxebook@gmail.com';

  const saveAll = async () => {
    try {
      await firebaseService.saveConfig(config);
      // Ebooks are saved individually or via a batch, but here we'll just save the config
      setStatus('Configuration sauvegardée');
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus('Erreur de sauvegarde');
    }
  };

  const seedData = async () => {
    if (!window.confirm('Voulez-vous migrer les données initiales vers Firebase ?')) return;
    try {
      setStatus('Migration en cours...');
      for (const ebook of ebooks) {
        await firebaseService.saveEbook(ebook);
      }
      await firebaseService.saveConfig(config);
      setStatus('Migration terminée');
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus('Erreur migration');
    }
  };

  const toggleFeatured = async (id: string) => {
    const ebook = ebooks.find(b => b.id === id);
    if (!ebook) return;
    const updatedEbook = { ...ebook, isFeatured: !ebook.isFeatured };
    try {
      await firebaseService.saveEbook(updatedEbook);
      setStatus('Statut mis à jour');
      setTimeout(() => setStatus(null), 2000);
    } catch (error) {
      setStatus('Erreur mise à jour');
    }
  };

  const addEbook = () => {
    const newBook: Ebook = {
      id: Date.now().toString(),
      title: 'Nouveau Manuscrit',
      description: 'Accroche...',
      summary: 'Résumé...',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=450&h=600&auto=format&fit=crop',
      officialPrice: 49.99,
      promoPrice: 29.99,
      chariowLink: '#',
      isFeatured: false,
      isPromo: false,
      category: 'Sagesse'
    };
    setEditingEbook(newBook);
  };

  if (!isAuthReady) return null;

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02040a] p-4">
        <LuminousCard className="w-full max-w-md bg-transparent">
          <div className="p-10 text-center">
              <Lock className="text-purple-400 mx-auto mb-6" size={32} />
              <h2 className="text-2xl font-cinzel font-bold text-white uppercase tracking-widest mb-6">Portail Admin</h2>
              <p className="text-slate-400 mb-10 font-mystiqua">Veuillez vous connecter avec votre compte administrateur.</p>
              <GradientButton onClick={loginWithGoogle} className="w-full py-4">
                Se connecter avec Google
              </GradientButton>
              {user && !isAdmin && (
                <p className="text-red-500 mt-6 text-xs font-bold uppercase tracking-widest">Accès refusé : {user.email}</p>
              )}
          </div>
        </LuminousCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020308] text-slate-300 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center"><LayoutGrid className="text-white" size={32} /></div>
            <div>
              <h1 className="text-3xl font-cinzel font-bold text-white uppercase tracking-tight">Panneau Admin</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Firebase Cloud</p>
                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {status && <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[9px] font-black uppercase">{status}</div>}
            <GradientButton variant="secondary" onClick={seedData} className="px-4 py-3"><Database size={14} /> Initialiser</GradientButton>
            <GradientButton variant="warning" onClick={saveAll} className="px-6 py-3"><Check size={14} /> Sauvegarder</GradientButton>
            <button onClick={logout} className="p-3 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl transition-all"><LogOut size={20} /></button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('catalogue')}
            className={`px-8 py-3 rounded-2xl font-cinzel font-bold uppercase tracking-widest transition-all ${activeTab === 'catalogue' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
          >
            Catalogue
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-8 py-3 rounded-2xl font-cinzel font-bold uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
          >
            Configuration
          </button>
        </div>

        {activeTab === 'catalogue' ? (
          <LuminousCard className="bg-transparent rounded-[2.5rem]">
            <div className="p-8 md:p-10">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-4"><ImageIcon size={20} className="text-blue-400" /><h2 className="text-xl font-cinzel font-bold text-white uppercase">Catalogue</h2></div>
                  <GradientButton onClick={addEbook} variant="secondary" className="px-5 py-2.5">Nouveau Livre</GradientButton>
                </div>
                <div className="space-y-3">
                  {ebooks.map((ebook) => (
                    <div key={ebook.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-transparent hover:border-white/5 group">
                      <img src={ebook.image} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 truncate">
                        <h3 className="font-cinzel font-bold text-sm text-white">{ebook.title}</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{ebook.category}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase font-black text-slate-600">Vedette</span>
                          <button 
                            onClick={() => toggleFeatured(ebook.id)}
                            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${ebook.isFeatured ? 'bg-emerald-500' : 'bg-slate-800'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${ebook.isFeatured ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingEbook(ebook)} className="p-2.5 text-slate-400 hover:text-white bg-white/5 rounded-lg"><Pencil size={18} /></button>
                          <button onClick={() => {
                            if (window.confirm('Supprimer ce manuscrit ?')) {
                              firebaseService.deleteEbook(ebook.id);
                              setStatus('Supprimé');
                              setTimeout(() => setStatus(null), 2000);
                            }
                          }} className="p-2.5 text-slate-700 hover:text-red-500 bg-red-500/5 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </LuminousCard>
        ) : (
          <LuminousCard className="bg-transparent rounded-[2.5rem]">
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-12">
                <Settings size={20} className="text-purple-400" />
                <h2 className="text-xl font-cinzel font-bold text-white uppercase">Configuration Générale</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                      <ImageIcon size={14} /> URL du Logo
                    </label>
                    <input 
                      type="text" 
                      value={config.logo} 
                      onChange={e => setConfig({...config, logo: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                      <Star size={14} /> URL du Favicon
                    </label>
                    <input 
                      type="text" 
                      value={config.favicon} 
                      onChange={e => setConfig({...config, favicon: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                      <Video size={14} /> URL Vidéo Accueil
                    </label>
                    <input 
                      type="text" 
                      value={config.homeVideoUrl} 
                      onChange={e => setConfig({...config, homeVideoUrl: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                      <MessageCircle size={14} /> Numéro WhatsApp
                    </label>
                    <input 
                      type="text" 
                      value={config.socialLinks?.whatsapp} 
                      onChange={e => setConfig({
                        ...config, 
                        socialLinks: { ...config.socialLinks!, whatsapp: e.target.value }
                      })}
                      placeholder="+33612345678"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                      <Mail size={14} /> Endpoint Formspree
                    </label>
                    <input 
                      type="text" 
                      value={config.formspreeEndpoint} 
                      onChange={e => setConfig({...config, formspreeEndpoint: e.target.value})}
                      placeholder="https://formspree.io/f/your-id"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                      <LayoutGrid size={14} /> ID Pixel Facebook
                    </label>
                    <input 
                      type="text" 
                      value={config.fbPixelId} 
                      onChange={e => setConfig({...config, fbPixelId: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </LuminousCard>
        )}
      </div>

      <AnimatePresence>
        {editingEbook && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingEbook(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-4xl bg-[#07080e] border border-white/10 rounded-[2.5rem] p-10 overflow-y-auto max-h-[92vh]">
              <div className="flex justify-between items-start mb-12">
                <h3 className="text-2xl font-cinzel font-black text-white uppercase">Édition Directe</h3>
                <button onClick={() => setEditingEbook(null)} className="text-slate-600 hover:text-white transition-all"><X size={32} /></button>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-500">Titre</label><input type="text" value={editingEbook.title} onChange={e => setEditingEbook({...editingEbook, title: e.target.value})} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white outline-none" /></div>
                  <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-500">Catégorie</label><input type="text" value={editingEbook.category} onChange={e => setEditingEbook({...editingEbook, category: e.target.value})} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white outline-none" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-500">URL Image</label><input type="text" value={editingEbook.image} onChange={e => setEditingEbook({...editingEbook, image: e.target.value})} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white outline-none" /></div>
                  <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-500">Lien Chariow</label><input type="text" value={editingEbook.chariowLink} onChange={e => setEditingEbook({...editingEbook, chariowLink: e.target.value})} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-blue-400 outline-none" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-500">Prix Officiel (€)</label><input type="number" value={editingEbook.officialPrice} onChange={e => setEditingEbook({...editingEbook, officialPrice: Number(e.target.value)})} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white outline-none" /></div>
                  <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-500">Prix Promo (€)</label><input type="number" value={editingEbook.promoPrice} onChange={e => setEditingEbook({...editingEbook, promoPrice: Number(e.target.value)})} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white outline-none" /></div>
                </div>
                <div className="space-y-3"><label className="text-[10px] font-black uppercase text-purple-500 flex items-center gap-2"><Info size={14} /> Accroche</label><textarea value={editingEbook.description} onChange={e => setEditingEbook({...editingEbook, description: e.target.value})} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white outline-none min-h-[100px]" /></div>
                <div className="space-y-3"><label className="text-[10px] font-black uppercase text-purple-500 flex items-center gap-2"><ScrollText size={14} /> Résumé</label><textarea value={editingEbook.summary} onChange={e => setEditingEbook({...editingEbook, summary: e.target.value})} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white outline-none min-h-[200px]" /></div>
                <div className="flex gap-4 pt-8">
                  <button onClick={() => setEditingEbook(null)} className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold uppercase text-[10px]">Annuler</button>
                  <GradientButton variant="prismatic" onClick={async () => { 
                    try {
                      await firebaseService.saveEbook(editingEbook);
                      setEditingEbook(null); 
                      setStatus('Enregistré'); 
                      setTimeout(() => setStatus(null), 2000); 
                    } catch (error) {
                      setStatus('Erreur');
                    }
                  }} className="flex-1 py-4">Confirmer</GradientButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
