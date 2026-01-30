
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Save, Trash2, Image as ImageIcon, Sparkles, 
  Settings, Facebook, LayoutDashboard, Star, CheckCircle2,
  Lock, AlertTriangle, X, Tag
} from 'lucide-react';
import { storage } from '../services/storage';
import { updateSEOVisibility } from '../services/geminiService';
import { Ebook, SiteConfig, CustomField } from '../types';
import { GradientButton } from '../components/GradientButton';
import { LuminousCard } from '../components/LuminousCard';
import { useLanguage } from '../context/LanguageContext';

export const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [ebooks, setEbooks] = useState<Ebook[]>(storage.getEbooks());
  const [config, setConfig] = useState<SiteConfig>(storage.getConfig());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const resizeImage = (file: File, width: number, height: number, mimeType: string = 'image/jpeg'): Promise<string> => {
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
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL(mimeType, 0.92));
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'ebook' | 'logo' | 'favicon', id?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let base64 = '';
    setIsLoading(true);

    try {
      if (type === 'logo') {
        base64 = await resizeImage(file, 200, 200, 'image/png');
        const newConfig = { ...config, logo: base64 };
        setConfig(newConfig);
        storage.saveConfig(newConfig);
        setStatus('Logo ok !');
      } else if (type === 'favicon') {
        base64 = await resizeImage(file, 32, 32, 'image/png');
        const newConfig = { ...config, favicon: base64 };
        setConfig(newConfig);
        storage.saveConfig(newConfig);
        setStatus('Favicon ok !');
      } else if (type === 'ebook' && id) {
        base64 = await resizeImage(file, 600, 800, 'image/jpeg');
        const newEbooks = ebooks.map(b => b.id === id ? { ...b, image: base64 } : b);
        setEbooks(newEbooks);
        storage.saveEbooks(newEbooks);
        setStatus('Image ok !');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const saveAll = () => {
    setIsLoading(true);
    storage.saveEbooks(ebooks);
    storage.saveConfig(config);
    setStatus(t.adminSaveSuccess);
    setIsLoading(false);
    setTimeout(() => setStatus(null), 3000);
  };

  const addEbook = () => {
    const newBook: Ebook = {
      id: Date.now().toString(),
      title: 'New Sacred Book',
      description: 'Brief description...',
      summary: 'Detailed content...',
      image: 'https://picsum.photos/600/800',
      officialPrice: 49.99,
      promoPrice: 29.99,
      chariowLink: '#',
      isFeatured: false,
      isPromo: false,
      category: 'Wisdom',
      customFields: []
    };
    const newEbooks = [newBook, ...ebooks];
    setEbooks(newEbooks);
    storage.saveEbooks(newEbooks);
    setEditingId(newBook.id);
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    const newEbooks = ebooks.filter(b => b.id !== deleteConfirmId);
    setEbooks(newEbooks);
    storage.saveEbooks(newEbooks);
    setDeleteConfirmId(null);
    setStatus('Ok');
    setTimeout(() => setStatus(null), 3000);
  };

  const updateEbook = (id: string, updates: Partial<Ebook>) => {
    const newEbooks = ebooks.map(b => b.id === id ? { ...b, ...updates } : b);
    setEbooks(newEbooks);
    storage.saveEbooks(newEbooks);
  };

  const addCustomField = (ebookId: string) => {
    const ebook = ebooks.find(b => b.id === ebookId);
    if (!ebook) return;
    const newFields = [...(ebook.customFields || []), { label: 'Field', value: 'Value' }];
    updateEbook(ebookId, { customFields: newFields });
  };

  const updateCustomField = (ebookId: string, index: number, updates: Partial<CustomField>) => {
    const ebook = ebooks.find(b => b.id === ebookId);
    if (!ebook || !ebook.customFields) return;
    const newFields = ebook.customFields.map((f, i) => i === index ? { ...f, ...updates } : f);
    updateEbook(ebookId, { customFields: newFields });
  };

  const removeCustomField = (ebookId: string, index: number) => {
    const ebook = ebooks.find(b => b.id === ebookId);
    if (!ebook || !ebook.customFields) return;
    const newFields = ebook.customFields.filter((_, i) => i !== index);
    updateEbook(ebookId, { customFields: newFields });
  };

  const handleGeminiUpdate = async () => {
    setIsLoading(true);
    setStatus('AI is thinking...');
    const keywords = await updateSEOVisibility();
    const newConfig = { ...config, seoKeywords: keywords };
    setConfig(newConfig);
    storage.saveConfig(newConfig);
    setIsLoading(false);
    setStatus('SEO ok !');
    setTimeout(() => setStatus(null), 5000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'spiritux2025') setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
          <LuminousCard className="p-8">
            <div className="text-center mb-8">
              <Lock className="mx-auto text-purple-400 mb-4" size={56} />
              <h2 className="text-3xl font-cinzel font-bold">{t.adminPortalTitle}</h2>
              <p className="text-slate-500 mt-3 text-base">{t.adminPortalSubtitle}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">{t.adminAccessKey}</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-purple-500 text-base"
                  placeholder="••••••••"
                />
              </div>
              <GradientButton type="submit" className="w-full py-4 text-base font-bold uppercase tracking-widest">{t.adminUnlock}</GradientButton>
            </form>
          </LuminousCard>
        </motion.div>
      </div>
    );
  }

  const ebookToDelete = ebooks.find(b => b.id === deleteConfirmId);

  return (
    <div className="pt-32 pb-24 container mx-auto px-4">
      <AnimatePresence>
        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-purple-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3 border border-white/20"
          >
            <CheckCircle2 size={20} />
            {status}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-10 shadow-2xl"
            >
              <div className="flex items-center gap-5 mb-8 text-red-400">
                <div className="p-4 bg-red-500/10 rounded-full">
                  <AlertTriangle size={36} />
                </div>
                <h3 className="text-2xl font-cinzel font-bold">{t.adminDeleteConfirmTitle}</h3>
              </div>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                {t.adminDeleteConfirmText}
                <span className="block mt-4 font-bold text-white text-xl italic">"{ebookToDelete?.title}"</span>
              </p>
              <div className="flex gap-6">
                <GradientButton 
                  variant="secondary"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-4 text-sm"
                >
                  {t.adminCancel}
                </GradientButton>
                <GradientButton 
                  variant="danger"
                  onClick={confirmDelete}
                  className="flex-1 py-4 text-sm"
                >
                  {t.adminDelete}
                </GradientButton>
              </div>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-cinzel font-bold mb-2">{t.adminDashboardTitle}</h1>
          <p className="text-slate-500 text-base">{t.adminDashboardSubtitle}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <GradientButton onClick={handleGeminiUpdate} variant="secondary" className="flex items-center gap-3 px-6 py-3.5 text-sm">
            {isLoading ? <span className="animate-spin">🌀</span> : <Sparkles size={20} />} SEO IA
          </GradientButton>
          <GradientButton variant="success" onClick={saveAll} className="flex items-center gap-3 px-6 py-3.5 text-sm">
            <Save size={20} /> Save
          </GradientButton>
          <GradientButton onClick={addEbook} className="flex items-center gap-3 px-6 py-3.5 text-sm">
            <Plus size={20} /> Add
          </GradientButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-10">
          <LuminousCard className="p-8">
            <h3 className="text-2xl font-cinzel font-bold mb-8 flex items-center gap-3">
              <Settings className="text-purple-400" size={24} /> Config
            </h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-[0.2em]">Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden bg-slate-900">
                    <img src={config.logo} className="w-full h-full object-cover" />
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} className="text-xs text-slate-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-[0.2em]">Favicon</label>
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded border border-white/10 bg-slate-900">
                    <img src={config.favicon} className="w-full h-full object-contain" />
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'favicon')} className="text-xs text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Facebook size={16} className="text-blue-500" /> Pixel ID
                </label>
                <input 
                  type="text" 
                  value={config.fbPixelId}
                  onChange={(e) => setConfig({ ...config, fbPixelId: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-4 uppercase tracking-[0.2em]">Keywords SEO</label>
                <div className="flex flex-wrap gap-2.5">
                  {config.seoKeywords.map((k, i) => (
                    <span key={i} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-md text-xs text-purple-400">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </LuminousCard>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-2xl font-cinzel font-bold flex items-center gap-3">
            <LayoutDashboard className="text-purple-400" size={24} /> Ebooks ({ebooks.length})
          </h3>
          
          <div className="grid grid-cols-1 gap-8">
            {ebooks.map((ebook) => (
              <LuminousCard key={ebook.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="relative w-full md:w-40 aspect-[3/4] rounded-xl overflow-hidden group">
                    <img src={ebook.image} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <ImageIcon className="text-white" size={32} />
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'ebook', ebook.id)} 
                      />
                    </label>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-6">
                        <input 
                          type="text" 
                          value={ebook.title}
                          onChange={(e) => updateEbook(ebook.id, { title: e.target.value })}
                          className="w-full bg-transparent text-2xl font-bold font-cinzel outline-none border-b border-white/5 focus:border-purple-500/50 py-1"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => updateEbook(ebook.id, { isFeatured: !ebook.isFeatured })}
                          className={`p-3 rounded-full border transition-all ${ebook.isFeatured ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' : 'bg-slate-800 border-white/10 text-slate-500'}`}
                        >
                          <Star size={20} fill={ebook.isFeatured ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={() => updateEbook(ebook.id, { isPromo: !ebook.isPromo })}
                          className={`p-3 rounded-full border transition-all ${ebook.isPromo ? 'bg-pink-500/20 border-pink-500/50 text-pink-500' : 'bg-slate-800 border-white/10 text-slate-500'}`}
                        >
                          <Tag size={20} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(ebook.id)}
                          className="p-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs uppercase text-slate-500 font-bold block mb-2">Category</label>
                        <input 
                          type="text" 
                          value={ebook.category}
                          onChange={(e) => updateEbook(ebook.id, { category: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase text-slate-500 font-bold block mb-2">Price €</label>
                        <input 
                          type="number" 
                          value={ebook.officialPrice}
                          onChange={(e) => updateEbook(ebook.id, { officialPrice: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase text-slate-500 font-bold block mb-2">Promo €</label>
                        <input 
                          type="number" 
                          value={ebook.promoPrice}
                          onChange={(e) => updateEbook(ebook.id, { promoPrice: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs uppercase text-slate-500 font-bold block mb-2">Chariow Link</label>
                        <input 
                          type="text" 
                          value={ebook.chariowLink}
                          onChange={(e) => updateEbook(ebook.id, { chariowLink: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs uppercase text-slate-500 font-bold block tracking-widest">Description</label>
                      <textarea 
                        value={ebook.description}
                        onChange={(e) => updateEbook(ebook.id, { description: e.target.value })}
                        rows={2}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-slate-200 resize-none"
                      />
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-xs uppercase text-purple-400 font-bold block">Fields</label>
                        <button onClick={() => addCustomField(ebook.id)} className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
                          <Plus size={14} /> Add
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(ebook.customFields || []).map((field, fIdx) => (
                          <div key={fIdx} className="flex gap-3 items-center">
                            <input 
                              type="text" 
                              value={field.label}
                              onChange={(e) => updateCustomField(ebook.id, fIdx, { label: e.target.value })}
                              className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                            />
                            <input 
                              type="text" 
                              value={field.value}
                              onChange={(e) => updateCustomField(ebook.id, fIdx, { value: e.target.value })}
                              className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                            />
                            <button onClick={() => removeCustomField(ebook.id, fIdx)} className="text-red-500/50 p-2"><X size={18} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </LuminousCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
