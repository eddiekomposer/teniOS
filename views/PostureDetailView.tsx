
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drill, Language, Coach, TrainingHistoryItem, TrainingType } from '../types';
import { TRANSLATIONS } from '../translations';
import { ArrowLeft, Play, Sparkles, BookOpen, BrainCircuit, Calendar, Activity, ChevronRight } from 'lucide-react';

interface PostureDetailViewProps {
  drill: Drill;
  drillType?: TrainingType;
  history: TrainingHistoryItem[];
  onBack: () => void;
  onStart: () => void;
  onViewReport: (item: TrainingHistoryItem) => void;
  onJumpToHistory: () => void;
  lang: Language;
  coach: Coach;
}

const PostureDetailView: React.FC<PostureDetailViewProps> = ({ 
    drill, 
    drillType,
    history,
    onBack, 
    onStart, 
    onViewReport,
    onJumpToHistory,
    lang, 
    coach 
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse pipe-separated tutorial steps
  const stepsString = t[drill.tutorialStepsKey as keyof typeof t] || drill.tutorialStepsKey || "";
  const steps = stepsString.split('|');

  // Find relevant history for this drill type
  const relevantReports = drillType 
    ? history.filter(h => h.type === drillType)
    : [];
  
  const sessionCount = relevantReports.length;
  const avgAccuracy = sessionCount > 0 
    ? Math.round(relevantReports.reduce((acc, curr) => acc + curr.accuracy, 0) / sessionCount) 
    : 0;

  // Mastery Level Logic as requested
  const getMasteryLabel = (accuracy: number) => {
    if (accuracy > 95) return t.masteryExpert;
    if (accuracy >= 70) return t.masteryProficient;
    if (accuracy >= 50) return t.masteryBeginner;
    if (accuracy >= 20) return t.masteryImproving;
    return t.masteryNone;
  };

  const masteryStatus = getMasteryLabel(avgAccuracy);

  return (
    <div className="h-screen bg-black relative z-50 overflow-y-auto overflow-x-hidden custom-scrollbar">
      
      {/* 1. Top Section: Video & Hero (Sticky Header) */}
      <div className={`w-full shrink-0 transition-all duration-500 ease-in-out ${isExpanded ? 'fixed inset-0 z-50 h-full' : 'sticky top-0 h-[60vh] z-0'}`}>
          
          <motion.div 
            layout 
            className="w-full h-full relative bg-surface-900"
            onClick={() => !isExpanded && setIsExpanded(true)}
          >
             {/* Back Button */}
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if (isExpanded) setIsExpanded(false);
                    else onBack();
                }}
                className="absolute top-6 left-6 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors"
             >
                <ArrowLeft size={20} />
             </button>

             {/* Video */}
             <motion.video
                layout
                src={drill.videoUrl}
                autoPlay
                muted={!isExpanded}
                loop
                playsInline
                controls={isExpanded}
                className="w-full h-full object-cover"
             />

             {/* Gradient Overlay */}
             {!isExpanded && (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
             )}

             {/* Hero Title & Start Action - Positioned INSIDE video container to ensure it stays 'on' video */}
             {!isExpanded && (
                <div className="absolute bottom-12 left-0 right-0 p-6 md:p-8 flex items-end justify-between pointer-events-auto z-20">
                    <div className="flex-1 mr-4">
                        <motion.h1 
                            layoutId="title"
                            className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-lg mb-2"
                        >
                            {t[drill.titleKey as keyof typeof t] || drill.titleKey}
                        </motion.h1>
                        <div className="flex items-center text-white/60 text-xs font-bold uppercase tracking-widest">
                           {drillType && <span className="bg-white/10 px-2 py-1 rounded mr-2">{t[drillType as keyof typeof t] || drillType}</span>}
                        </div>
                    </div>

                    {/* Circular Start Button Grouped with Title */}
                    <motion.button
                        layoutId="playButton"
                        onClick={(e) => { e.stopPropagation(); onStart(); }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-neon-500 hover:bg-neon-400 text-black flex items-center justify-center shadow-[0_0_30px_rgba(136,214,0,0.4)] transition-transform active:scale-95 shrink-0"
                    >
                        <Play size={32} fill="currentColor" className="ml-1" />
                    </motion.button>
                </div>
             )}
          </motion.div>
      </div>

      {/* 2. Bottom Section: Scrollable Content - Negative margin to create Overlap/Overflow effect */}
      {!isExpanded && (
        <div className="relative z-10 -mt-10 bg-black rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] border-t border-white/5 pb-20 min-h-[50vh]">
           
           {/* Decorative Pull Indicator */}
           <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
               <div className="w-12 h-1 bg-white/20 rounded-full" />
           </div>

           <div className="px-6 md:px-8 pt-4 space-y-10 max-w-3xl mx-auto">
                  
                  {/* Stats Bar (Requested Update) */}
                  <section className="flex items-center justify-between py-6 border-y border-white/10">
                    <div className="flex-1 border-r border-white/5 pr-4">
                      <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{t.trainingCount}</div>
                      <div className="text-xl font-black text-white">{sessionCount} <span className="text-xs text-white/40 font-normal">{lang.startsWith('zh') ? '次' : ''}</span></div>
                    </div>
                    <div className="flex-1 border-r border-white/5 px-4">
                      <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{t.masteryLevel}</div>
                      <div className="flex flex-col">
                        <div className="text-xl font-black text-neon-400 leading-tight">{masteryStatus}</div>
                        {sessionCount > 0 && <div className="text-[10px] text-white/20 font-bold">{avgAccuracy}% Accuracy</div>}
                      </div>
                    </div>
                    <div className="flex-1 pl-4 flex items-center justify-end">
                      <button 
                        onClick={onJumpToHistory}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-white/60 hover:text-white transition-colors uppercase tracking-wider"
                      >
                        {t.historyRecord}
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </section>

                  {/* Introduction */}
                  <section>
                      <p className="text-white/80 leading-relaxed text-base md:text-lg">
                          {t[drill.descriptionKey as keyof typeof t] || drill.descriptionKey}
                      </p>
                  </section>

                  {/* Tutorial Steps */}
                  <section className="space-y-8">
                      <div className="flex items-center space-x-2 text-neon-400 border-b border-white/10 pb-4">
                          <BookOpen size={18} />
                          <h2 className="text-sm font-bold uppercase tracking-widest">{t.tutorial || 'Tutorial'}</h2>
                      </div>
                      
                      <div className="space-y-12">
                          {steps.map((step, idx) => {
                              const [stepTitle, stepDesc] = step.includes(':') ? step.split(':') : [step, ''];

                              return (
                                  <div key={idx} className="relative pl-8 border-l border-white/10 group">
                                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-surface-800 border border-neon-500/50 text-neon-400 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(136,214,0,0.2)] group-hover:bg-neon-500 group-hover:text-black transition-colors">
                                          {idx + 1}
                                      </div>
                                      <h3 className="text-white font-bold text-lg mb-2">{stepTitle}</h3>
                                      {stepDesc && <p className="text-white/60 text-sm leading-relaxed mb-3">{stepDesc}</p>}
                                      
                                      {drill.tutorialImages && drill.tutorialImages[idx % drill.tutorialImages.length] && (
                                          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg mt-4 aspect-video relative group-hover:border-neon-500/30 transition-colors">
                                              <img 
                                                  src={drill.tutorialImages[idx % drill.tutorialImages.length]} 
                                                  alt={`Step ${idx + 1}`} 
                                                  className="w-full h-full object-cover"
                                              />
                                          </div>
                                      )}
                                  </div>
                              );
                          })}
                      </div>
                  </section>
                  
                  {/* Bottom spacer */}
                  <div className="h-12" />
           </div>
        </div>
      )}
    </div>
  );
};

export default PostureDetailView;
