
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Image as ImageIcon, Sparkles, 
  Lock, X, 
  Pencil,
  LayoutGrid, CheckCircle, Cpu, RefreshCw, 
  Check, Star, Link as LinkIcon, FileText, Library, Tag, Github, Copy, ExternalLink,
  User, Hash, Box, Layers, Globe, BookOpen, ToggleLeft, ToggleRight,
  Settings, Monitor, ShieldCheck
} from 'lucide-react';
import { storage } from '../services/storage';
import { updateSEOVisibility } from '../services/geminiService';
import { Ebook, SiteConfig } from '../types';
import { GradientButton } from '../components/GradientButton';
import { useLanguage } from '../context/LanguageContext';
import { getLocaleInfo, formatPrice } from '../lib/utils';
// Fix: Import TRANSLATIONS to allow complete generation of constants.ts
import { TRANSLATIONS } from '../constants';

export const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [config, setConfig] = useState<SiteConfig>(storage.getConfig());
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'catalogue' | 'mediatheque'>('catalogue');
  const [showExportModal, setShowExportModal] = useState(false);
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);

  const localeInfo = useMemo(() => getLocaleInfo(), []);

  useEffect(() => {
    setEbooks(storage.getEbooks());
  }, []);

  const saveAll = () => {
    storage.saveEbooks(ebooks);
    storage.saveConfig(config);
    setStatus('Sauvegarde réussie');
    setTimeout(() => setStatus(null), 3000);
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    const updated = ebooks.filter(b => b.id !== deleteConfirmId);
    setEbooks(updated);
    storage.saveEbooks(updated);
    setDeleteConfirmId(null);
  };

  const addEbook = () => {
    const newBook: Ebook = {
      id: Date.now().toString(),
      title: 'Nouveau Manuscrit',
      description: 'Accroche captivante...',
      summary: 'Résumé profond...',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=450&h=600&auto=format&fit=crop',
      officialPrice: 49.99,
      promoPrice: 29.99,
      chariowLink: '#',
      isFeatured: false,
      isPromo: false,
      category: 'Sagesse',
      customFields: [
        { label: 'Auteur', value: '' },
        { label: 'Pages', value: '' },
        { label: 'Format', value: '' },
        { label: 'Niveau', value: '' },
        { label: 'Tradition', value: '' },
        { label: 'Type', value: '' }
      ]
    };
    setEbooks([newBook, ...ebooks]);
    setEditingEbook(newBook);
  };

  const updateEbookState = (id: string, updates: Partial<Ebook>) => {
    const updated = ebooks.map(b => b.id === id ? { ...b, ...updates } : b);
    setEbooks(updated);
  };

  const getCustomFieldValue = (label: string) => {
    return editingEbook?.customFields?.find(f => f.label === label)?.value || '';
  };

  const setCustomFieldValue = (label: string, value: string) => {
    if (!editingEbook) return;
    const fields = [...(editingEbook.customFields || [])];
    const idx = fields.findIndex(f => f.label === label);
    if (idx > -1) fields[idx].value = value;
    else fields.push({ label, value });
    setEditingEbook({ ...editingEbook, customFields: fields });
  };

  // Fix: Added generateConstantsCode function to handle synchronization with constants.ts
  const generateConstantsCode = () => {
    return `import { Ebook, SiteConfig, LocaleInfo, Translations, Language } from './types';

export const INITIAL_EBOOKS: Ebook[] = ${JSON.stringify(ebooks, null, 2)};

export const DEFAULT_CONFIG: SiteConfig = ${JSON.stringify(config, null, 2)};

export const MOCK_LOCALES: Record<string, LocaleInfo> = {
  'fr-FR': { currency: 'EUR', rate: 1, symbol: '€' },
  'en-US': { currency: 'USD', rate: 1.08, symbol: '$' },
  'en-GB': { currency: 'GBP', rate: 0.85, symbol: '£' },
};

export const TRANSLATIONS: Record<Language, Translations> = ${JSON.stringify(TRANSLATIONS, null, 2)};
`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02040a] p-4">
        <div className="p-10 w-full max-w-md bg-slate-900/50 border border-white/5 rounded-3xl text-center shadow-2xl">
           <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="text-purple-400" size={32} />
            </div>
            <h2 className="text-2xl font-cinzel font-bold text-white uppercase tracking-widest mb-10">Portail Admin</h2>
          <form onSubmit={(e) => { e.preventDefault(); if(password === 'spiritux2025') setIsAuthenticated(true); }} className="space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 text-center tracking-[1em] text-white"
              placeholder="••••"
            />
            <GradientButton type="submit" className="w-full py-4 rounded-2xl">Déverrouiller</GradientButton>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020308] text-slate-300 pt-32 pb-20 selection:bg-cyan-500/30">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <LayoutGrid className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-cinzel font-bold text-white tracking-tight uppercase">Panneau de Contrôle</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Gestion locale du catalogue Spiritux.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Switcher */}
            <div className="bg-[#0a0c14] border border-white/5 p-1 rounded-full flex items-center">
              <button 
                onClick={() => setViewMode('catalogue')}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'catalogue' ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-slate-600 hover:text-slate-400'}`}
              >
                Catalogue
              </button>
              <button 
                onClick={() => setViewMode('mediatheque')}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'mediatheque' ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-slate-600 hover:text-slate-400'}`}
              >
                Médiathèque
              </button>
            </div>

            <button 
              onClick={saveAll}
              className="flex items-center gap-3 px-6 py-3 bg-[#0a0c14] border border-orange-500/30 rounded-full hover:bg-orange-500/5 transition-all group"
            >
              <div className="p-1.5 rounded-full border border-orange-500 text-orange-500 group-hover:scale-110 transition-transform">
                <Check size={14} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-white">Sauvegarder</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main List Section */}
          <div className="lg:col-span-8">
            <div className="bg-[#0a0c14] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                    <ImageIcon size={20} />
                  </div>
                  <h2 className="text-xl font-cinzel font-bold text-white uppercase tracking-widest">Livres Actifs</h2>
                </div>
                <button 
                  onClick={addEbook}
                  className="px-5 py-2.5 bg-cyan-950/30 border border-cyan-500/20 rounded-lg text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/10 transition-all"
                >
                  Nouveau Livre
                </button>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 px-6 mb-6">
                <div className="col-span-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Manuscrit</div>
                <div className="col-span-2 text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Prix</div>
                <div className="col-span-1 text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Vedettes</div>
                <div className="col-span-1 text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Promo</div>
                <div className="col-span-2 text-right text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Actions</div>
              </div>

              {/* Table Body */}
              <div className="space-y-3">
                {ebooks.map((ebook) => (
                  <div key={ebook.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group">
                    <div className="col-span-6 flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 shadow-lg">
                        <img src={ebook.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <h3 className="font-cinzel font-bold text-sm text-white truncate leading-tight">{ebook.title}</h3>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{ebook.category}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-bold text-white">{ebook.promoPrice.toFixed(2)} €</span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => updateEbookState(ebook.id, { isFeatured: !ebook.isFeatured })}
                        className={`p-2.5 rounded-xl border transition-all ${ebook.isFeatured ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-transparent text-slate-700'}`}
                      >
                        <Star size={16} fill={ebook.isFeatured ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => updateEbookState(ebook.id, { isPromo: !ebook.isPromo })}
                        className={`p-2.5 rounded-xl border transition-all ${ebook.isPromo ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.2)]' : 'bg-white/5 border-transparent text-slate-700'}`}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingEbook(ebook)} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Pencil size={18} /></button>
                      <button onClick={() => setDeleteConfirmId(ebook.id)} className="p-2.5 text-slate-700 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Visual Identity Section */}
            <div className="bg-[#0a0c14] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-sm font-cinzel font-bold text-white uppercase tracking-widest mb-10">Identité Visuelle</h2>
              
              <div className="space-y-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-6 group cursor-pointer">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-full h-full rounded-full border-2 border-white/5 overflow-hidden shadow-2xl">
                      <img src={config.logo} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full text-white shadow-lg">
                        <ImageIcon size={12} />
                      </div>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={10} /> Url Image Logo</label>
                    <input 
                      type="text" 
                      value={config.logo} 
                      onChange={(e) => setConfig({...config, logo: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-cyan-400 font-mono text-[9px] outline-none focus:border-cyan-500/30" 
                    />
                    <p className="text-[7px] text-center text-slate-600 uppercase tracking-widest font-bold">Logo Portail</p>
                  </div>
                </div>

                <div className="h-px bg-white/5 w-1/2 mx-auto" />

                {/* Favicon Section */}
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 mb-6 group cursor-pointer">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-full h-full rounded-full border-2 border-white/5 overflow-hidden shadow-lg">
                      <img src={config.favicon} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 right-0 bg-purple-600 p-1 rounded-full text-white">
                        <ImageIcon size={10} />
                      </div>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={10} /> Url Image Favicon</label>
                    <input 
                      type="text" 
                      value={config.favicon} 
                      onChange={(e) => setConfig({...config, favicon: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-cyan-400 font-mono text-[9px] outline-none focus:border-cyan-500/30" 
                    />
                    <p className="text-[7px] text-center text-slate-600 uppercase tracking-widest font-bold">Favicon (Onglet)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Services Section */}
            <div className="bg-[#0a0c14] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-sm font-cinzel font-bold text-white uppercase tracking-widest mb-8">Services IA</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <ShieldCheck size={16} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Google AI Connecté</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <button 
                  onClick={async () => { setStatus('Sync SEO...'); await updateSEOVisibility(); setStatus('SEO Optimisé !'); setTimeout(()=>setStatus(null),3000); }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group"
                >
                  <RefreshCw size={14} className={`text-slate-400 group-hover:text-white transition-colors ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white">Sync SEO Trends</span>
                </button>
                {status && <p className="text-center text-[9px] font-bold text-cyan-400 uppercase tracking-widest animate-pulse">{status}</p>}
              </div>
            </div>
            
            {/* GitHub Update Tool */}
            <button 
              onClick={() => setShowExportModal(true)}
              className="w-full flex items-center justify-center gap-3 py-4 bg-purple-600/10 border border-purple-500/30 rounded-2xl hover:bg-purple-600/20 transition-all group shadow-lg"
            >
              <Github size={16} className="text-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Sync GitHub Depôt</span>
            </button>
          </div>
        </div>
      </div>

      {/* GITHUB EXPORT MODAL */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExportModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-3xl bg-[#0a0a10] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl">
              <h3 className="text-2xl font-cinzel font-bold text-white mb-6 uppercase tracking-widest">Code de Synchronisation</h3>
              <p className="text-xs text-slate-400 mb-8 italic">Copiez ce code et remplacez le contenu de <code className="text-cyan-400">constants.ts</code> sur GitHub.</p>
              <pre className="bg-black/60 border border-white/10 rounded-2xl p-6 text-[10px] font-mono text-cyan-400 overflow-y-auto max-h-[400px] mb-8 custom-scrollbar">
                {generateConstantsCode()}
              </pre>
              <div className="flex gap-4">
                <GradientButton onClick={() => { navigator.clipboard.writeText(generateConstantsCode()); setStatus('Code Copié !'); setTimeout(()=>setStatus(null),2000); }} className="flex-1 py-4">Copier le Code</GradientButton>
                <GradientButton onClick={() => setShowExportModal(false)} variant="secondary" className="flex-1 py-4">Fermer</GradientButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL (Matching previous requirement) */}
      <AnimatePresence>
        {editingEbook && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingEbook(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="relative w-full max-w-4xl bg-[#07090f] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-y-auto max-h-[90vh] shadow-2xl custom-scrollbar"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-cinzel-dec font-black text-white uppercase tracking-wider">Édition du Manuscrit</h3>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">ID UNIQUE: {editingEbook.id}</p>
                </div>
                <button onClick={() => setEditingEbook(null)} className="text-slate-500 hover:text-white p-2"><X size={24} /></button>
              </div>

              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black border border-white/5 shadow-2xl mb-4">
                      <img src={editingEbook.image} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Couverture (450x600px)</span>
                  </div>

                  <div className="lg:col-span-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Titre de l'ouvrage</label>
                      <input type="text" value={editingEbook.title} onChange={e => setEditingEbook({...editingEbook, title: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white font-cinzel font-bold focus:border-purple-500/50 outline-none" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={10} /> Url de l'image (Source Externe)</label>
                      <input type="text" value={editingEbook.image} onChange={e => setEditingEbook({...editingEbook, image: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-cyan-400 font-mono text-[10px] focus:border-cyan-500/50 outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Catégorie</label>
                        <input type="text" value={editingEbook.category} onChange={e => setEditingEbook({...editingEbook, category: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-purple-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lien de Vente Chariow</label>
                        <input type="text" value={editingEbook.chariowLink} onChange={e => setEditingEbook({...editingEbook, chariowLink: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-blue-400 font-mono text-[10px] outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <BookOpen size={14} className="text-purple-400" />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Spécifications Techniques</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><User size={10} /> Auteur</label>
                      <input type="text" value={getCustomFieldValue('Auteur')} onChange={e => setCustomFieldValue('Auteur', e.target.value)} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Hash size={10} /> Pages</label>
                      <input type="text" value={getCustomFieldValue('Pages')} onChange={e => setCustomFieldValue('Pages', e.target.value)} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Box size={10} /> Format</label>
                      <input type="text" value={getCustomFieldValue('Format')} onChange={e => setCustomFieldValue('Format', e.target.value)} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white text-sm" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Prix Officiel (€)</label>
                    <input type="number" value={editingEbook.officialPrice} onChange={e => setEditingEbook({...editingEbook, officialPrice: Number(e.target.value)})} className="w-full bg-[#0a0c14] border border-white/5 rounded-xl px-4 py-3 text-white font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Prix Promo (€)</label>
                    <input type="number" value={editingEbook.promoPrice} onChange={e => setEditingEbook({...editingEbook, promoPrice: Number(e.target.value)})} className="w-full bg-[#0a0c14] border border-rose-500/20 rounded-xl px-4 py-3 text-rose-400 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Statut Vedettes</label>
                    <button 
                      onClick={() => setEditingEbook({...editingEbook, isFeatured: !editingEbook.isFeatured})}
                      className={`w-full h-[46px] rounded-xl flex items-center justify-center gap-3 border transition-all ${editingEbook.isFeatured ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' : 'bg-[#0a0c14] border-white/5 text-slate-600'}`}
                    >
                      {editingEbook.isFeatured ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      <span className="text-[9px] font-black uppercase">{editingEbook.isFeatured ? 'ACCUEIL' : 'DÉSACTIVÉ'}</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Badge Promo</label>
                    <button 
                      onClick={() => setEditingEbook({...editingEbook, isPromo: !editingEbook.isPromo})}
                      className={`w-full h-[46px] rounded-xl flex items-center justify-center gap-3 border transition-all ${editingEbook.isPromo ? 'bg-rose-500/5 border-rose-500/20 text-rose-500' : 'bg-[#0a0c14] border-white/5 text-slate-600'}`}
                    >
                      {editingEbook.isPromo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      <span className="text-[9px] font-black uppercase">{editingEbook.isPromo ? 'ACTIF' : 'INACTIF'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-8 pt-6 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Tag size={10} /> Accroche</label>
                    <textarea value={editingEbook.description} onChange={e => setEditingEbook({...editingEbook, description: e.target.value})} className="w-full h-24 bg-[#0a0c14] border border-white/5 rounded-xl px-6 py-4 text-slate-300 font-mystiqua italic text-base outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText size={10} /> Résumé Complet</label>
                    <textarea value={editingEbook.summary} onChange={e => setEditingEbook({...editingEbook, summary: e.target.value})} className="w-full h-48 bg-[#0a0c14] border border-white/5 rounded-xl px-6 py-4 text-slate-300 leading-relaxed text-sm outline-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-white/5">
                  <button onClick={() => setEditingEbook(null)} className="flex-1 py-5 rounded-full border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all">Annuler</button>
                  <button onClick={() => { updateEbookState(editingEbook.id, editingEbook); setEditingEbook(null); }} className="flex-[2] py-5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-black uppercase tracking-widest text-[11px] shadow-lg">Enregistrer</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(147, 51, 234, 0.2); }
      `}</style>
    </div>
  );
};
