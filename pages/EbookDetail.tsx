
import React, { useMemo, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Layers, 
  Clock, 
  Star,
  Quote,
  Lock,
  DownloadCloud,
  Sparkles,
  Volume2,
  VolumeX,
  Loader2,
  Facebook,
  Share2,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { storage } from '../services/storage';
import { MOCK_LOCALES } from '../constants';
import { GradientButton } from '../components/GradientButton';
import { useLanguage } from '../context/LanguageContext';
import { GoogleGenAI, Modality } from "@google/genai";

// Audio utility functions for Gemini TTS
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// X (Twitter) Icon Component
const XIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.486 3.24H4.298l13.31 17.41z" />
  </svg>
);

export const EbookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const rawEbook = storage.getEbooks().find(b => b.id === id);
  
  // Apply translation to static initial ebooks
  const ebook = useMemo(() => {
    if (!rawEbook) return null;
    if (rawEbook.id === '1') return { ...rawEbook, title: t.ebook1Title, description: t.ebook1Desc, summary: t.ebook1Summary };
    if (rawEbook.id === '2') return { ...rawEbook, title: t.ebook2Title, description: t.ebook2Desc, summary: t.ebook2Summary };
    if (rawEbook.id === '3') return { ...rawEbook, title: t.ebook3Title, description: t.ebook3Desc, summary: t.ebook3Summary };
    if (rawEbook.id === '4') return { ...rawEbook, title: t.ebook4Title, description: t.ebook4Desc, summary: t.ebook4Summary };
    if (rawEbook.id === '5') return { ...rawEbook, title: t.ebook5Title, description: t.ebook5Desc, summary: t.ebook5Summary };
    if (rawEbook.id === '6') return { ...rawEbook, title: t.ebook6Title, description: t.ebook6Desc, summary: t.ebook6Summary };
    return rawEbook;
  }, [rawEbook, t]);
  
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const localeInfo = useMemo(() => {
    const lang = navigator.language || 'fr-FR';
    return MOCK_LOCALES[lang] || MOCK_LOCALES['fr-FR'];
  }, []);

  const stopAudio = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {}
      currentSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleReadSummary = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    if (!ebook) return;

    try {
      setIsAudioLoading(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Lit ce résumé de livre de manière calme, mystique et inspirante en langue ${language}: ${ebook.summary}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (!base64Audio) throw new Error("No audio data received");

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const audioData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        currentSourceRef.current = null;
      };

      stopAudio();
      currentSourceRef.current = source;
      source.start();
      setIsPlaying(true);

    } catch (error) {
      console.error("TTS Error:", error);
      alert(t.audioError);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = `${ebook?.title} - ${t.heroSparkle}`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 3000);
    });
  };

  if (!ebook) {
    return (
      <div className="pt-24 md:pt-32 text-center h-screen flex flex-col items-center justify-center bg-[#020617]">
        <h2 className="text-xl md:text-2xl font-bold mb-4 font-cinzel">Ebook 404</h2>
        <GradientButton onClick={() => navigate('/library')}>{t.backToLibrary}</GradientButton>
      </div>
    );
  }

  const convertedPrice = (ebook.promoPrice * localeInfo.rate).toFixed(2);
  const convertedOriginal = (ebook.officialPrice * localeInfo.rate).toFixed(2);
  const discountAmount = (ebook.officialPrice - ebook.promoPrice).toFixed(2);

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 container mx-auto px-4 max-w-5xl">
      <button 
        onClick={() => navigate('/library')}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-400 mb-6 md:mb-10 transition-all text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] group"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
        {t.backToLibrary}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 lg:sticky lg:top-32"
        >
          <div className="relative group max-w-[280px] md:max-w-sm mx-auto lg:mx-0">
            <div className="absolute -inset-10 bg-purple-600/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />
            
            <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] transform transition-all duration-1000 group-hover:shadow-purple-500/15">
              <img src={ebook.image} alt={ebook.title} className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-40" />
            </div>

            {ebook.isPromo && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 text-white font-black py-2 px-3 md:py-3 md:px-4 rounded-xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] text-[8px] md:text-[9px] uppercase tracking-[0.2em] flex flex-col items-center justify-center leading-none z-20"
              >
                <span>{t.offer}</span>
                <span className="text-sm md:text-base mt-0.5 md:mt-1">{t.sacred}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-8 md:space-y-10"
        >
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-6 md:w-8 bg-gradient-to-r from-purple-500 to-transparent"></span>
              <span className="text-purple-400 font-bold tracking-[0.4em] uppercase text-[8px] md:text-[9px]">{ebook.category}</span>
            </div>
            <h1 className="text-2xl md:text-5xl font-cinzel font-bold text-white leading-tight tracking-tight max-w-xl">
              {ebook.title}
            </h1>
            <div className="relative py-1 md:py-2">
              <Quote className="absolute -top-1 -left-4 md:-left-5 text-purple-500/10 w-8 h-8 md:w-12 md:h-12" />
              <p className="text-lg md:text-2xl text-slate-400 leading-relaxed font-mystiqua italic pl-4 border-l border-white/5">
                {ebook.description}
              </p>
            </div>
          </div>

          {ebook.customFields && ebook.customFields.length > 0 && (
            <div className="flex flex-wrap gap-2 md:gap-2.5">
              {ebook.customFields.map((field, idx) => (
                <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-full px-3 py-1 md:px-4 md:py-1.5 flex items-center gap-2 hover:bg-white/5 transition-colors group">
                  <div className="text-purple-500 group-hover:scale-110 transition-transform">
                    {field.label.toLowerCase().includes('page') ? <Layers size={10} /> : 
                     field.label.toLowerCase().includes('auteur') ? <Star size={10} /> : 
                     <Clock size={10} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[6px] md:text-[7px] uppercase text-slate-500 font-black tracking-widest leading-none mb-0.5">{field.label}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-200 uppercase tracking-tighter leading-none">{field.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 via-purple-500/10 to-transparent rounded-2xl" />
            <div className="relative bg-slate-950/80 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/5 shadow-lg">
              <div className="p-5 md:p-10 space-y-6 md:space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                      <Sparkles size={10} className="text-amber-500" /> {t.knowledgeWeapon}
                    </h3>
                    <div className="flex items-baseline gap-3 md:gap-4">
                      <span className="text-4xl md:text-5xl font-cinzel font-bold text-white tracking-tighter">
                        {convertedPrice}<span className="text-xl md:text-2xl ml-1 font-sans font-light opacity-60">{localeInfo.symbol}</span>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm md:text-base text-slate-600 line-through decoration-pink-500/30 font-cinzel">{convertedOriginal}{localeInfo.symbol}</span>
                        {ebook.isPromo && (
                          <span className="text-[8px] md:text-[9px] font-bold text-green-500/80 uppercase tracking-widest">{t.saving} {discountAmount}{localeInfo.symbol}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {ebook.isPromo && (
                    <div className="bg-amber-500/5 border border-amber-500/10 text-amber-500/80 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 h-fit mb-0.5">
                      <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                      {t.temporalOpportunity}
                    </div>
                  )}
                </div>

                <div className="space-y-4 md:space-y-5">
                  <GradientButton 
                    onClick={() => window.open(ebook.chariowLink, '_blank')}
                    className="w-full py-4 md:py-4.5"
                  >
                    <ExternalLink size={14} /> {t.buyNow}
                  </GradientButton>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-5 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-500 group">
                      <Lock size={10} className="group-hover:text-amber-500 transition-colors" />
                      <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em]">{t.securePayment}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
                    <div className="flex items-center gap-1.5 text-slate-500 group">
                      <DownloadCloud size={10} className="group-hover:text-blue-500 transition-colors" />
                      <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em]">{t.instantAccess}</span>
                    </div>
                  </div>
                </div>

                {/* Social Sharing Section */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Share2 size={12} className="text-purple-400" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t.shareTitle}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={shareOnFacebook}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all flex items-center gap-2"
                      title={t.shareFacebook}
                    >
                      <Facebook size={18} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={shareOnTwitter}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                      title={t.shareTwitter}
                    >
                      <XIcon size={18} />
                    </motion.button>
                    <div className="relative">
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className={`p-3 border rounded-xl transition-all flex items-center gap-2 ${
                          showCopyFeedback 
                            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/20'
                        }`}
                        title={t.shareCopy}
                      >
                        {showCopyFeedback ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      </motion.button>
                      <AnimatePresence>
                        {showCopyFeedback && (
                          <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-full left-0 mt-2 whitespace-nowrap text-[9px] font-bold text-green-400 uppercase tracking-widest bg-slate-900/90 px-2 py-1 rounded border border-green-500/20"
                          >
                            {t.linkCopied}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2.5 md:p-3 bg-gradient-to-br from-purple-500/15 to-blue-500/15 rounded-xl border border-white/5 shadow-inner">
                  <BookOpen className="text-purple-400" size={18} />
                </div>
                <h2 className="text-xl md:text-2xl font-cinzel font-bold text-white tracking-tight">{t.manuscriptEssence}</h2>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReadSummary}
                disabled={isAudioLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  isPlaying 
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAudioLoading ? (
                    <motion.div key="loader" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Loader2 size={16} />
                    </motion.div>
                  ) : isPlaying ? (
                    <motion.div key="stop"><VolumeX size={16} /></motion.div>
                  ) : (
                    <motion.div key="play"><Volume2 size={16} /></motion.div>
                  )}
                </AnimatePresence>
                <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
                  {isAudioLoading ? t.loading : isPlaying ? t.stop : t.listen}
                </span>
              </motion.button>
            </div>
            
            <div className="relative">
              <div className="absolute -left-5 md:-left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-purple-500 via-transparent to-blue-500 opacity-20 hidden md:block" />
              <div className="relative bg-slate-900/5 p-0.5 md:p-1 rounded-2xl">
                <div className="text-base md:text-xl text-slate-300 leading-[1.7] md:leading-[1.85] whitespace-pre-line font-mystiqua tracking-wide text-justify px-1 md:px-0">
                  <span className="float-left mr-2 md:mr-3 mt-1 text-5xl md:text-7xl font-cinzel font-black bg-gradient-to-br from-amber-300 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)] leading-[0.8]">
                    {ebook.summary.charAt(0)}
                  </span>
                  {ebook.summary.slice(1)}
                </div>
                <div className="mt-8 md:mt-10 flex justify-center opacity-20">
                  <div className="flex items-center gap-2.5 md:gap-3">
                    <div className="h-[1px] w-12 md:w-16 bg-gradient-to-r from-transparent to-white/20" />
                    <Star size={8} md:size={10} className="text-white" />
                    <div className="h-[1px] w-12 md:w-16 bg-gradient-to-l from-transparent to-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-8 md:pt-10 border-t border-white/5">
            <div className="group p-4 md:p-6 rounded-2xl border border-white/5 bg-slate-900/20 hover:bg-slate-900/30 hover:border-purple-500/20 transition-all duration-500">
              <div className="p-2 md:p-2.5 bg-purple-500/10 rounded-lg w-fit mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-purple-400" size={16} />
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <span className="block text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em]">{t.authenticity}</span>
                <p className="text-[8px] md:text-[10px] text-slate-500 leading-relaxed font-medium">{t.authenticityDesc}</p>
              </div>
            </div>
            <div className="group p-4 md:p-6 rounded-2xl border border-white/5 bg-slate-900/20 hover:bg-slate-900/30 hover:border-blue-500/20 transition-all duration-500">
              <div className="p-2 md:p-2.5 bg-blue-500/10 rounded-lg w-fit mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Zap className="text-blue-400" size={16} />
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <span className="block text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em]">{t.illumination}</span>
                <p className="text-[8px] md:text-[10px] text-slate-500 leading-relaxed font-medium">{t.illuminationDesc}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
