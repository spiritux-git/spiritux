
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

export const WhatsAppFloating: React.FC = memo(() => {
  const { config } = useFirebase();
  const whatsappNumber = config.socialLinks?.whatsapp;

  if (!whatsappNumber) return null;

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 text-white hover:bg-green-400 transition-colors"
    >
      <MessageCircle size={32} fill="currentColor" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
      </span>
    </motion.a>
  );
});
