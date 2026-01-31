
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Save, Trash2, Image as ImageIcon, Sparkles, 
  Settings, Lock, AlertTriangle, X, 
  Megaphone, FileText, Pencil,
  LayoutGrid, CheckCircle, Cpu, RefreshCw, 
  Check, Star, User, Hash, ToggleLeft, ToggleRight,
  Library, Wand2, Scroll, BookType, Link as LinkIcon
} from 'lucide-react';
import { storage } from '../services/storage';
import { updateSEOVisibility } from '../services/geminiService';
import { Ebook, SiteConfig, CustomField } from '../types';
import { GradientButton } from '../components/GradientButton';
import { useLanguage } from '../context/LanguageContext';

export const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [config, setConfig] = useState<SiteConfig>(storage.getConfig());
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'catalogue' | 'mediatheque'>('catalogue');
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);

  useEffect(() => {
    setEbooks(storage.getEbooks());
  }, []);

  const handleResizeImage = (file: File, width: number, height: number): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/png', 0.8));
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'ebook', id?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const sizes = { logo: [200, 200], favicon: [64, 64], ebook: [450, 600] };
      const currentSize = sizes[type];
      const base64 = await handleResizeImage(file, currentSize[0], currentSize[1]);
      
      if (type === 'logo' || type === 'favicon') {
        const newConfig = { ...config, [type]: base64 };
        setConfig(newConfig);
        storage.saveConfig(newConfig);
      } else if (type === 'ebook' && id) {
        const updated = ebooks.map(b => b.id === id ? { ...b, image: base64 } : b);
        setEbooks(updated);
        storage.saveEbooks(updated);
        if (editingEbook?.id === id) setEditingEbook({ ...editingEbook, image: base64 });
      }
      setStatus('Média mis à jour !');
    } catch (err) {
      setStatus('Erreur média');
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleSyncSEO = async () => {
    setIsLoading(true);
    const keywords = await updateSEOVisibility();
    const newConfig = { ...config, seoKeywords: keywords };
    setConfig(newConfig);
    storage.saveConfig(newConfig);
    setIsLoading(false);
    setStatus('SEO synchronisé !');
    setTimeout(() => setStatus(null), 3000);
  };

  const saveAll = () => {
    storage.saveEbooks(ebooks);
    storage.saveConfig(config);
    setStatus('Sauvegarde locale effectuée');
    setTimeout(() => setStatus(null), 3000);
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    const updated = ebooks.filter(b => b.id !== deleteConfirmId);
    setEbooks(updated);
    storage.saveEbooks(updated);
    setDeleteConfirmId(null);
    setStatus('Ouvrage supprimé');
    setTimeout(() => setStatus(null), 3000);
  };

  const addEbook = () => {
    const newBook: Ebook = {
      id: Date.now().toString(),
      title: 'Nouveau Manuscrit',
      description: 'Accroche captivante...',
      summary: 'Résumé profond du savoir spirituel...',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=450&h=600&auto=format&fit=crop',
      officialPrice: 49.99,
      promoPrice: 29.99,
      chariowLink: '#',
      isFeatured: false,
      isPromo: false,
      category: 'Sagesse',
      customFields: [
        { label: 'Auteur', value: 'Gardien Spiritux' },
        { label: 'Pages', value: '150' },
        { label: 'Format', value: 'PDF' },
        { label: 'Niveau', value: 'Tous niveaux' },
        { label: 'Tradition', value: 'Ancestrale' },
        { label: 'Type', value: 'Guide' }
      ]
    };
    const newEbooks = [newBook, ...ebooks];
    setEbooks(newEbooks);
    storage.saveEbooks(newEbooks);
    setEditingEbook(newBook);
  };

  const updateEbookState = (id: string, updates: Partial<Ebook>) => {
    const updated = ebooks.map(b => b.id === id ? { ...b, ...updates } : b);
    setEbooks(updated);
    storage.saveEbooks(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const getCustomFieldValue = (label: string) => {
    return editingEbook?.customFields?.find(f => f.label === label)?.value || '';
  };

  const setCustomFieldValue = (label: string, value: string) => {
    if (!editingEbook) return;
    const fields = [...(editingEbook.customFields || [])];
    const idx = fields.findIndex(f => f.label === label);
    if (idx > -1) {
      fields[idx].value = value;
    } else {
      fields.push({ label, value });
    }
    setEditingEbook({ ...editingEbook, customFields: fields });
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
    <div className="min-h-screen bg-[#050509] text-slate-300 pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(79,70,229,0.3)]">
              <LayoutGrid className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-cinzel font-bold text-white tracking-tight">Panneau de Contrôle</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Gestion locale du catalogue Spiritux.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-slate-950/80 border border-white/10 p-1 rounded-full flex items-center">
              <button 
                onClick={() => setViewMode('catalogue')}
                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'catalogue' ? 'bg-[#00bcd4] text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
              >
                Catalogue
              </button>
              <button 
                onClick={() => setViewMode('mediatheque')}
                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'mediatheque' ? 'bg-[#00bcd4] text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
              >
                Médiathèque
              </button>
            </div>
            <button 
              onClick={saveAll}
              className="group flex items-center gap-3 px-8 py-3 rounded-full border border-orange-500/50 hover:bg-orange-500/10 transition-all shadow-[0_0_20px_rgba(249,115,22,0.1)]"
            >
              <CheckCircle size={18} className="text-orange-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.1em] text-white">Sauvegarder</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-[#0a0a0f] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <ImageIcon size={18} />
                  </div>
                  <h2 className="text-xl font-cinzel font-bold text-white">Livres Actifs</h2>
                </div>
                <button 
                  onClick={addEbook}
                  className="px-5 py-2 bg-[#002f35] border border-cyan-500/30 text-cyan-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
                >
                  Nouveau Livre
                </button>
              </div>

              <div className="grid grid-cols-12 gap-4 px-4 pb-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 border-b border-white/5">
                <div className="col-span-5">Manuscrit</div>
                <div className="col-span-2 text-center">Prix</div>
                <div className="col-span-2 text-center">Vedettes</div>
                <div className="col-span-1 text-center">Promo</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="space-y-1 mt-4">
                {ebooks.map((ebook) => (
                  <div key={ebook.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl hover:bg-white/[0.02] transition-colors group">
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xl bg-black shrink-0">
                        <img src={ebook.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <h3 className="font-cinzel font-bold text-base text-white truncate">{ebook.title}</h3>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{ebook.category}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-center font-bold text-white text-lg">
                      {ebook.promoPrice} €
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <button 
                        onClick={() => updateEbookState(ebook.id, { isFeatured: !ebook.isFeatured })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          ebook.isFeatured 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                            : 'bg-slate-900 border-white/5 text-slate-700 hover:text-slate-400'
                        }`}
                      >
                        <Star size={20} fill={ebook.isFeatured ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => updateEbookState(ebook.id, { isPromo: !ebook.isPromo })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          ebook.isPromo 
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]' 
                            : 'bg-slate-900 border-white/5 text-slate-700 hover:text-slate-400'
                        }`}
                      >
                        {ebook.isPromo ? <Check size={20} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-slate-800" />}
                      </button>
                    </div>
                    <div className="col-span-2 flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingEbook(ebook)} className="text-slate-400 hover:text-white"><Pencil size={20} /></button>
                      <button onClick={() => setDeleteConfirmId(ebook.id)} className="text-slate-700 hover:text-red-500"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0a0a0f] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-lg font-cinzel font-bold text-white mb-8">Identité Visuelle</h2>
              <div className="space-y-12">
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-white/5 p-1 bg-black">
                      <img src={config.logo} className="w-full h-full rounded-full object-cover shadow-2xl" />
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-500 transition-colors">
                      <ImageIcon size={14} className="text-white" />
                      <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'logo')} />
                    </label>
                  </div>
                  <div className="w-full space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <LinkIcon size={10} /> Url image logo
                    </label>
                    <input 
                      type="text" 
                      value={config.logo} 
                      onChange={(e) => setConfig({...config, logo: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-cyan-400 outline-none focus:border-cyan-500 font-mono text-[10px]"
                      placeholder="https://..."
                    />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Logo Portail</span>
                </div>

                <div className="h-px bg-white/5 w-full" />

                {/* Favicon Section */}
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-full border-2 border-white/5 p-1 bg-black">
                      <img src={config.favicon} className="w-full h-full rounded-full object-cover shadow-2xl" />
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full cursor-pointer shadow-lg hover:bg-blue-500 transition-colors">
                      <ImageIcon size={12} className="text-white" />
                      <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'favicon')} />
                    </label>
                  </div>
                  <div className="w-full space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <LinkIcon size={10} /> Url image favicon
                    </label>
                    <input 
                      type="text" 
                      value={config.favicon} 
                      onChange={(e) => setConfig({...config, favicon: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-cyan-400 outline-none focus:border-cyan-500 font-mono text-[10px]"
                      placeholder="https://..."
                    />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Favicon (Onglet)</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0f] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-lg font-cinzel font-bold text-white mb-8">Services IA</h2>
              <div className="space-y-4">
                <div className="bg-[#061511] border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Cpu size={16} /></div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Google AI Connecté</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <button onClick={handleSyncSEO} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-[#111116] border border-white/5 py-4 rounded-2xl hover:bg-white/5 transition-all group">
                  <RefreshCw size={16} className={`text-slate-500 group-hover:text-white ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Sync SEO Trends</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal Complet avec URL Image Directe */}
      <AnimatePresence>
        {editingEbook && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingEbook(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-4xl bg-[#0a0a10] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-y-auto max-h-[90vh] shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-cinzel font-bold text-white tracking-tight uppercase">Édition du Manuscrit</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">ID unique: {editingEbook.id}</p>
                </div>
                <button onClick={() => setEditingEbook(null)} className="text-slate-500 hover:text-white transition-colors"><X size={28} /></button>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-4">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black relative group border border-white/5 shadow-2xl">
                      <img src={editingEbook.image} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <ImageIcon size={24} className="text-white" />
                        <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'ebook', editingEbook.id)} />
                      </label>
                    </div>
                    <span className="block text-[9px] font-black text-slate-600 uppercase text-center tracking-widest">Couverture (450x600px)</span>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Titre de l'ouvrage</label>
                      <input type="text" value={editingEbook.title} onChange={e => setEditingEbook({...editingEbook, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-purple-500 transition-colors font-cinzel font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={10} /> URL de l'image (Source externe)</label>
                      <input 
                        type="text" 
                        value={editingEbook.image} 
                        onChange={e => setEditingEbook({...editingEbook, image: e.target.value})} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-cyan-400 outline-none focus:border-cyan-500 font-mono text-xs" 
                        placeholder="Ex: https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Catégorie</label>
                        <input type="text" value={editingEbook.category} onChange={e => setEditingEbook({...editingEbook, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-purple-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lien de Vente Chariow</label>
                        <input type="text" value={editingEbook.chariowLink} onChange={e => setEditingEbook({...editingEbook, chariowLink: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-blue-400 outline-none focus:border-blue-500 font-mono text-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                    <Library size={12} className="text-purple-500" /> Spécifications Techniques
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><User size={10} /> Auteur</label>
                      <input 
                        type="text" 
                        value={getCustomFieldValue('Auteur')} 
                        onChange={e => setCustomFieldValue('Auteur', e.target.value)} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-slate-200 outline-none focus:border-purple-500" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Hash size={10} /> Pages</label>
                      <input 
                        type="text" 
                        value={getCustomFieldValue('Pages')} 
                        onChange={e => setCustomFieldValue('Pages', e.target.value)} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-slate-200 outline-none focus:border-purple-500" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><BookType size={10} /> Format</label>
                      <input 
                        type="text" 
                        value={getCustomFieldValue('Format')} 
                        onChange={e => setCustomFieldValue('Format', e.target.value)} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-slate-200 outline-none focus:border-purple-500" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Wand2 size={10} /> Niveau</label>
                      <input 
                        type="text" 
                        value={getCustomFieldValue('Niveau')} 
                        onChange={e => setCustomFieldValue('Niveau', e.target.value)} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-slate-200 outline-none focus:border-purple-500" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Scroll size={10} /> Tradition</label>
                      <input 
                        type="text" 
                        value={getCustomFieldValue('Tradition')} 
                        onChange={e => setCustomFieldValue('Tradition', e.target.value)} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-slate-200 outline-none focus:border-purple-500" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText size={10} /> Type</label>
                      <input 
                        type="text" 
                        value={getCustomFieldValue('Type')} 
                        onChange={e => setCustomFieldValue('Type', e.target.value)} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-slate-200 outline-none focus:border-purple-500" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-white/5 pt-8">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Prix Officiel (€)</label>
                    <input type="number" value={editingEbook.officialPrice} onChange={e => setEditingEbook({...editingEbook, officialPrice: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-purple-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Prix Promo (€)</label>
                    <input type="number" value={editingEbook.promoPrice} onChange={e => setEditingEbook({...editingEbook, promoPrice: Number(e.target.value)})} className="w-full bg-black/40 border border-rose-500/20 rounded-xl px-5 py-3 text-rose-400 outline-none focus:border-rose-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Statut Vedettes</label>
                    <button 
                      onClick={() => setEditingEbook({...editingEbook, isFeatured: !editingEbook.isFeatured})}
                      className={`w-full py-3 rounded-xl border flex items-center justify-center gap-3 transition-all ${editingEbook.isFeatured ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-slate-900 border-white/5 text-slate-700'}`}
                    >
                      {editingEbook.isFeatured ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      <span className="text-[9px] font-black uppercase">Accueil</span>
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Badge Promo</label>
                    <button 
                      onClick={() => setEditingEbook({...editingEbook, isPromo: !editingEbook.isPromo})}
                      className={`w-full py-3 rounded-xl border flex items-center justify-center gap-3 transition-all ${editingEbook.isPromo ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-slate-900 border-white/5 text-slate-700'}`}
                    >
                      {editingEbook.isPromo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      <span className="text-[9px] font-black uppercase">Actif</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-8 border-t border-white/5 pt-8">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Megaphone size={10} /> Accroche</label>
                    <textarea rows={2} value={editingEbook.description} onChange={e => setEditingEbook({...editingEbook, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-slate-300 text-sm outline-none focus:border-purple-500 resize-none font-mystiqua italic" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText size={10} /> Résumé complet</label>
                    <textarea rows={6} value={editingEbook.summary} onChange={e => setEditingEbook({...editingEbook, summary: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-slate-400 text-sm outline-none focus:border-purple-500 resize-none font-mystiqua leading-relaxed" />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <GradientButton onClick={() => setEditingEbook(null)} variant="secondary" className="flex-1 py-5 rounded-2xl">Annuler</GradientButton>
                  <GradientButton onClick={() => { updateEbookState(editingEbook.id, editingEbook); saveAll(); setEditingEbook(null); }} className="flex-[2] py-5 rounded-2xl">Enregistrer</GradientButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0a0a10] border border-white/10 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
              <AlertTriangle className="mx-auto text-red-500 mb-6" size={48} />
              <h3 className="text-2xl font-cinzel font-bold mb-4 text-white uppercase tracking-tight">Effacer l'ouvrage ?</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Cette action est définitive et retirera ce savoir du sanctuaire Spiritux.</p>
              <div className="flex gap-4">
                <GradientButton variant="danger" onClick={confirmDelete} className="flex-1 py-3">Supprimer</GradientButton>
                <GradientButton variant="secondary" onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 border-white/10">Annuler</GradientButton>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
