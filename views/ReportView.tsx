
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, RotateCcw, Video, FileBarChart, Play, ArrowLeft, MoreVertical, Sparkles, Home, Clock, Target, Trophy, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, Coach, TrainingHistoryItem } from '../types';
import { TRANSLATIONS } from '../translations';

// Sub-component for the Swing Card to manage Carousel state independently
const SwingCard: React.FC<{ 
    swing: any; 
    isBest: boolean; 
    isWorst: boolean; 
    t: any; 
    getRank: (s: number) => string; 
}> = ({ swing, isBest, isWorst, t, getRank }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const rank = getRank(swing.score);
    
    // Mock Media Slides
    const slides = [
        { type: 'video', label: t.videoClip },
        { type: 'image', label: t.keyframeContact, src: 'https://images.unsplash.com/photo-1599586120429-48285b6a8a81?q=80&w=400' },
        { type: 'image', label: t.keyframeFollow, src: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=400' }
    ];

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveSlide(prev => (prev + 1) % slides.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
    };

    const getSpeedLabel = (speed: number) => {
        if (speed >= 120) return t.speedThunder;
        if (speed >= 110) return t.speedLightning;
        if (speed >= 100) return t.speedFast;
        if (speed >= 90) return t.speedSolid;
        return t.speedSlow;
    };

    return (
        <div id={`swing-${swing.id}`} className="bg-surface-800 rounded-3xl overflow-hidden border border-white/5 group hover:border-neon-500/50 transition-all flex flex-col relative">
            {/* Header Badge */}
            {(isBest || isWorst) && (
                <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 ${isBest ? 'bg-neon-500 text-black' : 'bg-red-500 text-white'}`}>
                    {isBest ? <ThumbsUp size={10} /> : <ThumbsDown size={10} />}
                    {isBest ? t.bestSwing : t.needsWork}
                </div>
            )}

            {/* Media Carousel */}
            <div className="relative aspect-video bg-black group/media">
                 <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {slides[activeSlide].type === 'video' ? (
                            <div className="flex flex-col items-center text-white/40">
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-2 group-hover/media:scale-110 transition-transform cursor-pointer">
                                    <Play size={32} fill="currentColor" className="text-white ml-1" />
                                </div>
                                <span className="text-xs font-bold tracking-widest uppercase">{slides[activeSlide].label}</span>
                            </div>
                        ) : (
                            <>
                                <img src={slides[activeSlide].src} alt="Keyframe" className="w-full h-full object-cover opacity-60" />
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <span className="bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                        {slides[activeSlide].label}
                                    </span>
                                </div>
                            </>
                        )}
                    </motion.div>
                 </AnimatePresence>

                 {/* Navigation */}
                 <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover/media:opacity-100 transition-opacity pointer-events-none">
                     <button onClick={prevSlide} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-neon-500 hover:text-black transition-colors pointer-events-auto">
                        <ChevronLeft size={16} />
                     </button>
                     <button onClick={nextSlide} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-neon-500 hover:text-black transition-colors pointer-events-auto">
                        <ChevronRight size={16} />
                     </button>
                 </div>
                 
                 {/* Dots */}
                 <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                     {slides.map((_, idx) => (
                         <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === activeSlide ? 'bg-neon-500' : 'bg-white/20'}`} />
                     ))}
                 </div>
                 
                 {/* Timestamp */}
                 <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-white/80 border border-white/10">
                    {swing.time}
                 </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col gap-6">
                
                {/* Title & Rank Row */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter">{t.swing} #{swing.id}</h3>
                        <div className="text-xs text-white/40 uppercase font-bold tracking-wider mt-1">{t[swing.type as keyof typeof t] || swing.type}</div>
                    </div>
                    
                    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border-2 ${
                        rank === 'S' || rank === 'A' ? 'border-neon-500 bg-neon-500/10 text-neon-400' : 
                        rank === 'F' || rank === 'D' ? 'border-red-500 bg-red-500/10 text-red-500' : 
                        'border-white/20 bg-white/5 text-white'
                    }`}>
                        <span className="text-xl font-black leading-none">{rank}</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                     <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                         <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-1">{t.ballSpeed}</div>
                         <div className="flex items-baseline gap-1">
                             <span className="text-xl font-bold text-white">{swing.speed}</span>
                             <span className="text-xs text-white/40">km/h</span>
                         </div>
                         <div className="text-[10px] text-neon-400 mt-1 font-medium truncate">{getSpeedLabel(swing.speed)}</div>
                     </div>
                     <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                         <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-1">{t.swingSpeed}</div>
                         <div className="flex items-baseline gap-1">
                             <span className="text-xl font-bold text-white">{swing.swingSpeed}</span>
                             <span className="text-xs text-white/40">km/h</span>
                         </div>
                         <div className="text-[10px] text-blue-400 mt-1 font-medium truncate">{getSpeedLabel(swing.swingSpeed)}</div>
                     </div>
                </div>

                {/* Coach Comment */}
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 relative">
                     <div className="flex items-start gap-3">
                         <div className="mt-1 min-w-[16px]">
                             <Sparkles size={16} className="text-neon-500" />
                         </div>
                         <div>
                             <div className="text-[10px] text-neon-500 font-bold uppercase mb-1 tracking-widest">{t.coachSays}</div>
                             <p className="text-sm text-white/80 leading-relaxed font-medium">"{swing.aiSuggestion}"</p>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

interface ReportViewProps {
  onClose: () => void;
  onRetry: () => void;
  lang: Language;
  fromHistory?: boolean;
  coach?: Coach;
  reportData?: TrainingHistoryItem;
}

const ReportView: React.FC<ReportViewProps> = ({ onClose, onRetry, lang, fromHistory = false, coach = 'Zhou', reportData }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'overview' | 'swings'>('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 20);
  };

  const swings = [
      { id: 1, type: 'Forehand', speed: 124, swingSpeed: 108, score: 96, time: '04:12', aiSuggestion: t.sugg1 },
      { id: 2, type: 'Forehand', speed: 118, swingSpeed: 102, score: 88, time: '04:15', aiSuggestion: t.sugg2 },
      { id: 3, type: 'Backhand', speed: 105, swingSpeed: 95, score: 65, time: '04:22', aiSuggestion: t.sugg3 },
      { id: 4, type: 'Smash', speed: 140, swingSpeed: 125, score: 95, time: '04:45', aiSuggestion: t.sugg4 },
      { id: 5, type: 'Forehand', speed: 122, swingSpeed: 105, score: 90, time: '05:01', aiSuggestion: t.sugg5 },
      { id: 6, type: 'Forehand', speed: 126, swingSpeed: 110, score: 91, time: '05:15', aiSuggestion: t.sugg6 },
  ];

  // Logic to find Best and Worst Swings
  const sortedSwings = [...swings].sort((a, b) => b.score - a.score);
  const bestSwing = sortedSwings[0];
  const worstSwing = sortedSwings[sortedSwings.length - 1];

  // Calculate Average Score and Rank
  const averageScore = Math.round(swings.reduce((acc, s) => acc + s.score, 0) / swings.length);
  const getRank = (score: number) => {
    if (score >= 95) return 'S';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };
  const rank = getRank(averageScore);

  // Distribution Logic
  const dist = {
      excellent: swings.filter(s => s.score >= 90).length,
      good: swings.filter(s => s.score >= 80 && s.score < 90).length,
      fair: swings.filter(s => s.score >= 70 && s.score < 80).length,
      average: swings.filter(s => s.score >= 60 && s.score < 70).length,
      poor: swings.filter(s => s.score < 60).length
  };
  const totalSwings = swings.length;

  const scrollToSwing = (id: number) => {
    const element = document.getElementById(`swing-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const trainingType = reportData?.type || 'Forehand';
  const displayTitle = (t[trainingType as keyof typeof t] || trainingType) + ' Mastery';
  const displayDate = reportData?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const finishTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Key Takeaway Logic
  const getTakeaway = () => {
      if (rank === 'S' || rank === 'A') return t.takeawayS;
      if (rank === 'B') return t.takeawayB;
      return t.takeawayC;
  };

  return (
    <div className="h-screen flex flex-col bg-black pt-16">
      {/* Sticky Header - Simplified for Navigation */}
      <div 
        className={`relative z-40 border-b transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-xl border-white/10 py-2 shadow-xl' 
            : 'bg-black border-transparent py-4'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button 
              onClick={onClose}
              className={`rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white shrink-0 ${isScrolled ? 'p-2' : 'p-3'}`}
              aria-label={fromHistory ? t.back : t.backToHome}
            >
              {fromHistory ? <ArrowLeft size={isScrolled ? 20 : 24} /> : <Home size={isScrolled ? 20 : 24} />}
            </button>
            
            {/* Show Title in Navbar only when scrolled */}
            <div className={`flex flex-col min-w-0 flex-1 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="font-bold text-white text-lg leading-none truncate">
                {displayTitle}
              </h1>
              <div className="text-white/40 text-xs block truncate">{displayDate}</div>
            </div>
          </div>

          <div className="relative ml-2 flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 w-10 h-10 flex items-center justify-center text-white transition-all"
                >
                  <MoreVertical size={20} />
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowMenu(false)} />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-surface-800 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1"
                      >
                        <button 
                          className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center transition-colors"
                          onClick={() => setShowMenu(false)}
                        >
                          <Share2 size={16} className="mr-3 text-white/60" />
                          {t.share}
                        </button>
                        {!fromHistory && (
                          <button 
                            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center transition-colors border-t border-white/5"
                            onClick={() => {
                              setShowMenu(false);
                              onRetry();
                            }}
                          >
                            <RotateCcw size={16} className="mr-3 text-white/60" />
                            {t.repeat}
                          </button>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 pb-8"
        onScroll={handleScroll}
      >
        <div className="max-w-5xl mx-auto pb-12">
          
          {/* Header & Subtitle - Moved above tabs */}
          <header className="mb-6 pt-2">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">{displayTitle}</h1>
            <div className="flex items-center gap-4">
                <span className="text-white/60 font-medium">{displayDate}</span>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-white/60 font-medium">Finished at {finishTime}</span>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                    rank === 'S' ? 'bg-neon-500 text-black' : 
                    rank === 'A' ? 'bg-neon-500/20 text-neon-400' : 
                    'bg-white/10 text-white'
                }`}>Rank {rank}</span>
            </div>
          </header>

          {/* Tab Bar */}
          <div className="flex space-x-6 border-b border-white/10 mb-6">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'overview' ? 'text-neon-400' : 'text-white/40 hover:text-white'}`}
            >
              <span className="flex items-center"><FileBarChart size={18} className="mr-2" /> {t.overview}</span>
              {activeTab === 'overview' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-400" />}
            </button>
            <button 
              onClick={() => setActiveTab('swings')}
              className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'swings' ? 'text-neon-400' : 'text-white/40 hover:text-white'}`}
            >
              <span className="flex items-center"><Video size={18} className="mr-2" /> {t.swingDetails}</span>
              {activeTab === 'swings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-400" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                 {/* 2. Metrics Row */}
                 <div className="grid grid-cols-3 gap-4">
                    <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                         <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1"><Clock size={12}/> {t.duration}</div>
                         <div className="text-2xl md:text-3xl font-bold text-white">{reportData?.duration || '0m'}</div>
                    </div>
                    <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                         <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1"><Target size={12}/> {t.accuracy}</div>
                         <div className="text-2xl md:text-3xl font-bold text-neon-400">{reportData?.accuracy || 0}%</div>
                    </div>
                    <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 flex flex-col justify-between relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-neon-500/10 rounded-full blur-2xl" />
                         <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1"><Trophy size={12}/> Rank</div>
                         <div className="text-2xl md:text-3xl font-black text-white">{rank}</div>
                    </div>
                 </div>

                 {/* 3. Rank Distribution */}
                 <div className="bg-surface-800 rounded-2xl p-6 border border-white/5">
                     <div className="flex justify-between items-end mb-3">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.rankDistribution}</h3>
                        <span className="text-xs text-white/40">{totalSwings} {t.swingsCount}</span>
                     </div>
                     
                     {/* Segmented Bar */}
                     <div className="h-4 w-full flex rounded-full overflow-hidden bg-white/5">
                        <div style={{ width: `${(dist.excellent / totalSwings) * 100}%` }} className="bg-neon-500" />
                        <div style={{ width: `${(dist.good / totalSwings) * 100}%` }} className="bg-neon-600" />
                        <div style={{ width: `${(dist.fair / totalSwings) * 100}%` }} className="bg-yellow-500" />
                        <div style={{ width: `${(dist.average / totalSwings) * 100}%` }} className="bg-orange-500" />
                        <div style={{ width: `${(dist.poor / totalSwings) * 100}%` }} className="bg-red-500" />
                     </div>

                     {/* Legend */}
                     <div className="grid grid-cols-5 gap-2 mt-4">
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">{dist.excellent}</div>
                            <div className="text-[10px] text-neon-400 font-bold uppercase">S-Tier</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">{dist.good}</div>
                            <div className="text-[10px] text-neon-600 font-bold uppercase">A-Tier</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">{dist.fair}</div>
                            <div className="text-[10px] text-yellow-500 font-bold uppercase">B-Tier</div>
                        </div>
                         <div className="text-center">
                            <div className="text-lg font-bold text-white">{dist.average}</div>
                            <div className="text-[10px] text-orange-500 font-bold uppercase">C-Tier</div>
                        </div>
                         <div className="text-center">
                            <div className="text-lg font-bold text-white">{dist.poor}</div>
                            <div className="text-[10px] text-red-500 font-bold uppercase">F-Tier</div>
                        </div>
                     </div>
                 </div>

                 {/* 4. Key Takeaway */}
                 <div className="bg-gradient-to-br from-surface-800 to-surface-900 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                     <div className="absolute -left-4 top-0 w-24 h-full bg-neon-500/5 skew-x-12" />
                     <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-3">
                             <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center border border-white/10">
                                 <Sparkles size={14} className="text-neon-400" />
                             </div>
                             <span className="text-xs font-bold text-neon-400 uppercase tracking-widest">{t.coach} {coach} {t.says}</span>
                         </div>
                         <p className="text-lg md:text-xl text-white font-medium leading-relaxed italic">
                             "{getTakeaway()}"
                         </p>
                     </div>
                 </div>

                 {/* 5. Best & Worst Swing */}
                 <div>
                     <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t.sessionHighlights}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         
                         {/* Best Swing Card */}
                         <div className="group bg-surface-800 rounded-2xl border border-neon-500/30 overflow-hidden relative">
                             <div className="absolute top-3 left-3 z-20 bg-neon-500 text-black text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                 <ThumbsUp size={10} /> {t.bestSwing}
                             </div>
                             
                             <div className="aspect-video bg-black relative">
                                 {/* Mock Video Overlay */}
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                         <Play size={20} fill="currentColor" />
                                     </div>
                                 </div>
                                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                     <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-white font-bold">{t.swing} #{bestSwing.id}</div>
                                            <div className="text-neon-400 text-xs font-mono">{bestSwing.time}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-neon-400">{getRank(bestSwing.score)}</div>
                                            <div className="text-xs text-white/60">{bestSwing.speed} km/h</div>
                                        </div>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         {/* Worst Swing Card */}
                         <div className="group bg-surface-800 rounded-2xl border border-red-500/20 overflow-hidden relative">
                             <div className="absolute top-3 left-3 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                 <ThumbsDown size={10} /> {t.needsWork}
                             </div>
                             
                             <div className="aspect-video bg-black relative">
                                  {/* Mock Video Overlay */}
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                         <Play size={20} fill="currentColor" />
                                     </div>
                                 </div>
                                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                     <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-white font-bold">{t.swing} #{worstSwing.id}</div>
                                            <div className="text-red-400 text-xs font-mono">{worstSwing.time}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-red-500">{getRank(worstSwing.score)}</div>
                                            <div className="text-xs text-white/60">{worstSwing.speed} km/h</div>
                                        </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

              </motion.div>
            ) : (
              <motion.div 
                key="swings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Quick Scroll Bar - Updated: Moved higher, hidden scrollbar, full width styling */}
                <div className="flex items-center space-x-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sticky top-0 bg-black/95 backdrop-blur-md z-30 py-2 -mx-6 px-6 md:-mx-8 md:px-8 border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase text-white/40 mr-1 shrink-0 tracking-widest">{t.quickJump}</span>
                    {swings.map(s => (
                        <button
                            key={s.id}
                            onClick={() => scrollToSwing(s.id)}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold transition-all shrink-0 active:scale-95 ${
                                s.id === bestSwing.id ? 'bg-neon-500 text-black border-neon-500' :
                                s.id === worstSwing.id ? 'bg-red-500/20 text-red-500 border-red-500/50' :
                                'bg-surface-800 text-white border-white/10 hover:bg-white/10'
                            }`}
                        >
                            {s.id}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {swings.map((swing) => (
                    <SwingCard 
                        key={swing.id} 
                        swing={swing} 
                        isBest={swing.id === bestSwing.id} 
                        isWorst={swing.id === worstSwing.id} 
                        t={t} 
                        getRank={getRank} 
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
