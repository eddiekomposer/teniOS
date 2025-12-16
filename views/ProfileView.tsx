
import React, { useState } from 'react';
import { ChevronRight, LogOut, ChevronLeft, LifeBuoy, MessageCircle, FileQuestion, HelpCircle, Check, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, Coach, TrainingHistoryItem } from '../types';
import { TRANSLATIONS } from '../translations';

interface ProfileViewProps {
  onBack: () => void;
  // onViewReport no longer needed for profile since history is gone, but keeping interface clean if needed later
  onViewReport: (item: TrainingHistoryItem) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  coach: Coach;
  setCoach: (coach: Coach) => void;
  history: TrainingHistoryItem[];
}

const ProfileView: React.FC<ProfileViewProps> = ({ onBack, lang, setLang, coach, setCoach }) => {
  const [showCoachMenu, setShowCoachMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = TRANSLATIONS[lang];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English (US)' },
    { code: 'zh-CN', label: '简体中文' },
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ru', label: 'Русский' }
  ];

  const coaches: Coach[] = ['Zhou', 'Tony', 'Jesse'];

  const getLanguageLabel = (l: Language) => {
    return languages.find(item => item.code === l)?.label || 'English';
  };

  return (
    <div className="h-screen flex flex-col pt-16 bg-black">
      {/* Sticky Header */}
      <div className="shrink-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            aria-label={t.backToHome}
          >
            <ChevronLeft size={28} className="md:w-8 md:h-8" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{t.settings}</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pb-32">
        <div className="max-w-4xl mx-auto pt-6">
          
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {/* General Settings */}
            <section className="bg-surface-800 rounded-2xl p-6 border border-white/5 relative z-20">
              <h3 className="text-white font-bold mb-4 flex items-center">
                <Sliders className="mr-3 text-neon-400" size={20} /> {t.trainingSettings}
              </h3>
              
              <div className="divide-y divide-white/5">
                {/* Coach Selection */}
                <div className="relative">
                  <div 
                    className="flex items-center justify-between py-4 cursor-pointer hover:bg-white/5 -mx-4 px-4 transition-colors rounded-lg" 
                    onClick={() => { setShowCoachMenu(!showCoachMenu); setShowLangMenu(false); }}
                  >
                    <span className="text-white/80">{t.coach}</span>
                    <div className="flex items-center text-white/50 hover:text-white">
                      {coach} <ChevronRight size={16} className={`ml-2 transition-transform duration-300 ${showCoachMenu ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {showCoachMenu && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/50 overflow-hidden rounded-lg border border-white/5"
                      >
                        {coaches.map((c) => (
                          <div 
                            key={c}
                            onClick={() => { setCoach(c); setShowCoachMenu(false); }}
                            className="flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-colors border-b border-white/5 last:border-0"
                          >
                            <span className={coach === c ? 'text-neon-400 font-bold' : 'text-white/70'}>{c}</span>
                            {coach === c && <Check size={14} className="text-neon-400" />}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Language Selection */}
                <div className="relative">
                  <div 
                    className="flex items-center justify-between py-4 cursor-pointer hover:bg-white/5 -mx-4 px-4 transition-colors rounded-lg" 
                    onClick={() => { setShowLangMenu(!showLangMenu); setShowCoachMenu(false); }}
                  >
                    <div className="flex items-center text-white/80">
                      {/* Icon removed per instructions */}
                      {t.language}
                    </div>
                    <div className="flex items-center text-white/50 hover:text-white">
                      {getLanguageLabel(lang)} <ChevronRight size={16} className={`ml-2 transition-transform duration-300 ${showLangMenu ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {showLangMenu && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/50 overflow-hidden rounded-lg border border-white/5"
                      >
                        {languages.map((l) => (
                          <div 
                            key={l.code}
                            onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                            className="flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-colors border-b border-white/5 last:border-0"
                          >
                            <span className={lang === l.code ? 'text-neon-400 font-bold' : 'text-white/70'}>{l.label}</span>
                            {lang === l.code && <Check size={14} className="text-neon-400" />}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

             {/* Support Module */}
            <section className="bg-surface-800 rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center">
                <LifeBuoy className="mr-3 text-neon-400" size={20} /> {t.support}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                 <button className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
                    <HelpCircle size={24} className="text-white/60 mb-2" />
                    <span className="text-xs font-medium text-white text-center break-words">{t.helpCenter}</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
                    <FileQuestion size={24} className="text-white/60 mb-2" />
                    <span className="text-xs font-medium text-white text-center break-words">{t.reportBug}</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
                    <MessageCircle size={24} className="text-white/60 mb-2" />
                    <span className="text-xs font-medium text-white text-center break-words">{t.contactSupport}</span>
                 </button>
              </div>
            </section>

             <button className="w-full py-4 text-red-500 font-bold uppercase tracking-wider hover:bg-red-500/10 rounded-xl transition-colors flex items-center justify-center border border-red-500/20">
              <LogOut size={18} className="mr-2" /> {t.signOut}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileView;
