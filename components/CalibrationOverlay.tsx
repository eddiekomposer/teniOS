import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, ArrowUp, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';

interface CalibrationOverlayProps {
  isVisible: boolean;
  step: number;
  lang: Language;
}

export const CalibrationOverlay: React.FC<CalibrationOverlayProps> = ({ isVisible, step, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8"
        >
          <div className="max-w-md w-full text-center">
            <div className="relative w-64 h-64 mx-auto mb-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-neon-500"
              />
              <div className="absolute inset-4 rounded-full border border-white/10" />
              
              <div className="absolute inset-0 flex items-center justify-center text-white">
                {step === 1 && <RotateCw size={64} className="text-neon-400 -scale-x-100 animate-pulse" />}
                {step === 2 && <RotateCw size={64} className="text-neon-400 animate-pulse" />}
                {step === 3 && <ArrowUp size={64} className="text-neon-400 animate-bounce" />}
                {step === 4 && <CheckCircle2 size={80} className="text-neon-400" />}
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              {step === 1 && t.moveLeft}
              {step === 2 && t.moveRight}
              {step === 3 && t.leveling}
              {step === 4 && t.success}
            </h2>
            <p className="text-white/50 text-lg">{t.calibrating}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
