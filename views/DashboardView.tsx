
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { LEVEL_DRILLS, DRILLS_DATA } from '../constants';
import { Language, TrainingHistoryItem, Drill, ConnectionStatus } from '../types';
import { Play, Compass, Lock, Wifi, BarChart2, Camera, Edit2, Check, ChevronRight } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface DashboardViewProps {
  onSelectDrill: (drill: Drill) => void;
  onStartDrill: (drill: Drill) => void;
  lang: Language;
  history: TrainingHistoryItem[];
  onViewHistory: (item: TrainingHistoryItem) => void;
  connectionStatus: ConnectionStatus;
  onConnectPress: () => void;
  onShowFullHistory: () => void;
}

const TennisRacketIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 22l5.5-5.5" />
    <circle cx="15" cy="9" r="6" />
    <path d="M10.75 13.25l2.5-2.5" />
    <path d="M15 5v8" opacity="0.5" />
    <path d="M11 9h8" opacity="0.5" />
  </svg>
);

const DashboardView: React.FC<DashboardViewProps> = ({ 
  onSelectDrill, 
  onStartDrill, 
  lang,
  history,
  connectionStatus,
  onConnectPress,
  onShowFullHistory
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const [mainTab, setMainTab] = useState<'start' | 'explore'>('explore');
  const [activeLevelTab, setActiveLevelTab] = useState<string>('NTRP 1.0');
  
  // Profile State - Defaults per request
  const [profile, setProfile] = useState({
    name: 'Guest',
    level: 'NTRP 1.0',
    numericLevel: 1.0,
    image: 'https://images.unsplash.com/photo-1617083934555-563d6412e9a4?q=80&w=200&auto=format&fit=crop'
  });
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [showLevelSheet, setShowLevelSheet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Quick Start Specific Logic
  const quickStartDrills = [
      DRILLS_DATA['Forehand'].find(d => d.id === 'fh_flat'),
      DRILLS_DATA['Backhand'].find(d => d.id === 'bh_one'),
      DRILLS_DATA['Backhand'].find(d => d.id === 'bh_two'),
  ].filter(Boolean) as Drill[];

  const [activeQuickStartIndex, setActiveQuickStartIndex] = useState(0);

  const [direction, setDirection] = useState(0);

  const levels = ['NTRP 1.0', 'NTRP 2.0', 'NTRP 3.0'];
  const levelOptions = ['1.0', '2.0', '2.5', '3.0', '3.5', '4.0', '5.0'];

  // Map user level to tab logic
  // < 3.0 = Beginner (Index 0), 3.0-4.0 = Intermediate (Index 1), > 4.0 = Pro (Index 2)
  const userLevelIndex = profile.numericLevel >= 4.0 ? 2 : profile.numericLevel >= 3.0 ? 1 : 0;

  // Profile Interaction Handlers
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
            setProfile(prev => ({ ...prev, image: e.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameClick = () => {
      setEditName(profile.name === 'Guest' ? t.guest : profile.name);
      setIsEditingName(true);
  };

  const handleNameSave = () => {
      if (editName.trim()) {
          setProfile(prev => ({ ...prev, name: editName }));
      }
      setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleNameSave();
      }
  };

  const handleLevelClick = () => {
    setShowLevelSheet(true);
  };

  const handleSelectLevel = (levelVal: string) => {
      const fullLabel = `NTRP ${levelVal}`;
      const numeric = parseFloat(levelVal);
      setProfile(prev => ({
          ...prev,
          level: fullLabel,
          numericLevel: numeric
      }));
      setShowLevelSheet(false);
  };

  // Logic for Explore Tab Level switching
  const changeLevelTab = (newLevel: string) => {
      const newIndex = levels.indexOf(newLevel);
      const oldIndex = levels.indexOf(activeLevelTab);
      setDirection(newIndex > oldIndex ? 1 : -1);
      setActiveLevelTab(newLevel);
  };

  const handleLevelDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const currentIndex = levels.indexOf(activeLevelTab);
    
    if (info.offset.x < -threshold) {
      if (currentIndex < levels.length - 1) {
        changeLevelTab(levels[currentIndex + 1]);
      }
    } else if (info.offset.x > threshold) {
      if (currentIndex > 0) {
        changeLevelTab(levels[currentIndex - 1]);
      }
    }
  };

  // Logic for Quick Start Swipe
  const changeQuickStartDrill = (newIndex: number) => {
      setDirection(newIndex > activeQuickStartIndex ? 1 : -1);
      setActiveQuickStartIndex(newIndex);
  };

  const handleQuickStartDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x < -threshold) {
      if (activeQuickStartIndex < quickStartDrills.length - 1) {
        changeQuickStartDrill(activeQuickStartIndex + 1);
      }
    } else if (info.offset.x > threshold) {
      if (activeQuickStartIndex > 0) {
        changeQuickStartDrill(activeQuickStartIndex - 1);
      }
    }
  };

  const handleQuickStart = () => {
      const drill = quickStartDrills[activeQuickStartIndex];
      if (drill) {
          onStartDrill(drill);
      }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const activeDrills: Drill[] = LEVEL_DRILLS[activeLevelTab] || [];
  
  // For Quick Start Background
  const currentQuickStartDrill = quickStartDrills[activeQuickStartIndex];
  const currentTrainingImage = mainTab === 'start' 
      ? (currentQuickStartDrill?.image || "https://images.unsplash.com/photo-1599586120429-48285b6a8a81?q=80&w=800")
      : (activeDrills[0]?.image || "https://images.unsplash.com/photo-1599586120429-48285b6a8a81?q=80&w=800");

  const isConnected = connectionStatus === 'connected';
  const isLocked = levels.indexOf(activeLevelTab) > userLevelIndex;

  return (
    <div className="flex flex-col h-screen bg-black pt-20">
      
      {/* Top Main Tab Switcher */}
      <div className="flex justify-center px-4 mb-6 z-30">
        <div className="bg-surface-800 p-1 rounded-full flex space-x-1 border border-white/10 shadow-lg">
             <button 
                onClick={() => setMainTab('explore')}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                    mainTab === 'explore' 
                    ? 'bg-neon-500 text-black shadow-[0_0_15px_rgba(136,214,0,0.3)]' 
                    : 'text-white/40 hover:text-white'
                }`}
            >
                <Compass size={16} />
                <span>{t.tabExplore}</span>
            </button>
            <button 
                onClick={() => setMainTab('start')}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                    mainTab === 'start' 
                    ? 'bg-neon-500 text-black shadow-[0_0_15px_rgba(136,214,0,0.3)]' 
                    : 'text-white/40 hover:text-white'
                }`}
            >
                <TennisRacketIcon size={16} />
                <span>{t.tabStart}</span>
            </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
            {mainTab === 'start' ? (
                <motion.div
                    key="start-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex flex-col"
                >
                    {/* Disconnected State */}
                    {!isConnected && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-8">
                            <div className="w-24 h-24 bg-surface-800 rounded-full flex items-center justify-center border-2 border-dashed border-white/20 mb-8 relative">
                                <Wifi size={40} className="text-white/40" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-black" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 text-center">{t.connectToTrain}</h2>
                            <p className="text-white/60 text-center mb-8 max-w-xs">{t.connectToStart}</p>
                            <button 
                                onClick={onConnectPress}
                                className="px-8 py-3 bg-neon-500 text-black font-bold uppercase tracking-widest rounded-full hover:bg-neon-400 transition-colors shadow-lg shadow-neon-500/20"
                            >
                                {t.connect}
                            </button>
                        </div>
                    )}

                    {/* Background Image with Overlay - Only visible if connected (or ghosted behind blur) */}
                    <div className="absolute inset-0 z-0 bg-surface-900">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.img 
                                key={currentQuickStartDrill?.id || 'bg'}
                                src={currentTrainingImage}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className="w-full h-full object-cover absolute inset-0 opacity-30 grayscale"
                            />
                        </AnimatePresence>
                        {/* Darker Overlay for subtle effect */}
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/40" />
                    </div>

                    {/* Swipe Area for Start Tab - Swipes Specific Drills */}
                     <motion.div 
                        className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 pb-32 text-center w-full h-full"
                        drag={isConnected ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleQuickStartDragEnd}
                    >
                         {/* Training Title */}
                         <div className="mb-12 pointer-events-none select-none">
                            <motion.h1 
                                key={currentQuickStartDrill?.id || 'title'}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter shadow-black drop-shadow-2xl max-w-lg mx-auto leading-none"
                            >
                                {t[currentQuickStartDrill?.titleKey as keyof typeof t] || currentQuickStartDrill?.titleKey}
                            </motion.h1>
                            <motion.p 
                                key={currentQuickStartDrill?.id + "-desc"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-white/70 mt-4 max-w-md mx-auto text-sm md:text-base font-medium drop-shadow-md"
                            >
                                {t[currentQuickStartDrill?.descriptionKey as keyof typeof t] || t.quickStart}
                            </motion.p>
                        </div>

                        {/* Big Play Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={isConnected ? handleQuickStart : undefined}
                            className={`group relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center ${!isConnected ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            {/* Pulsing Rings */}
                            <div className="absolute inset-0 bg-neon-500/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                            <div className="absolute inset-4 bg-neon-500/40 rounded-full blur-xl group-hover:bg-neon-500/60 transition-colors" />
                            
                            {/* Main Button */}
                            <div className="relative w-full h-full bg-neon-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(136,214,0,0.6)] border-4 border-black/20">
                                <Play size={64} className="ml-2 text-black fill-black" />
                            </div>
                        </motion.button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-20 flex space-x-3 pointer-events-none">
                            {quickStartDrills.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeQuickStartIndex === idx ? 'w-8 bg-neon-500' : 'bg-white/30'}`} 
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div
                    key="explore-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar"
                >
                     <div className="pb-32">
                        {/* Profile & Level Card */}
                        <div className="px-6 md:px-8 pt-4 pb-2">
                            <div className="bg-surface-800 p-4 rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                
                                <div className="flex items-center justify-between relative z-10">
                                  <div className="flex items-center gap-4">
                                    {/* Hidden File Input */}
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                        accept="image/*"
                                    />

                                    {/* Interactive Profile Image */}
                                    <div 
                                      className="relative shrink-0 cursor-pointer group"
                                      onClick={handleImageClick}
                                    >
                                       <img 
                                         src={profile.image} 
                                         alt="Profile" 
                                         className="w-12 h-12 rounded-full border-2 border-white/10 object-cover shadow-lg group-hover:border-neon-500 transition-colors"
                                       />
                                       <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={16} className="text-white" />
                                       </div>
                                    </div>

                                    {/* Interactive Name */}
                                    <div>
                                      {isEditingName ? (
                                          <input 
                                            autoFocus
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onBlur={handleNameSave}
                                            onKeyDown={handleNameKeyDown}
                                            className="text-lg font-black text-white leading-tight tracking-tight bg-transparent border-b border-neon-500 outline-none w-32 px-1"
                                          />
                                      ) : (
                                          <h2 
                                            className="text-lg font-black text-white leading-tight tracking-tight hover:text-neon-400 cursor-pointer flex items-center gap-2 group"
                                            onClick={handleNameClick}
                                          >
                                            {profile.name === 'Guest' ? t.guest : profile.name}
                                            <Edit2 size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                                          </h2>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <div 
                                            className="text-neon-400 font-bold text-xs cursor-pointer hover:text-neon-300 transition-colors select-none flex items-center gap-1 group"
                                            onClick={handleLevelClick}
                                        >
                                            {profile.level}
                                            <ChevronRight size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <button 
                                    onClick={onShowFullHistory}
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/5 group shadow-lg"
                                  >
                                    <BarChart2 size={20} className="group-hover:scale-110 transition-transform" />
                                  </button>
                                </div>
                            </div>
                        </div>

                        {/* Level Tabs */}
                        <div className="px-6 md:px-8 mt-4 mb-4 z-20 flex justify-center">
                            <div className="flex space-x-1 bg-surface-800 p-1 rounded-xl border border-white/5 w-auto overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {levels.map((level, idx) => {
                                const isLocked = idx > userLevelIndex;
                                return (
                                    <button
                                        key={level}
                                        onClick={() => changeLevelTab(level)}
                                        className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                            activeLevelTab === level 
                                            ? 'bg-neon-500 text-black shadow-lg' 
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {isLocked && <Lock size={12} />}
                                        {level}
                                    </button>
                                );
                            })}
                            </div>
                        </div>

                        {/* Drill List Area */}
                        {isLocked ? (
                            <div className="flex flex-col items-center justify-center text-center p-8 opacity-60 mt-12">
                                <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center mb-6">
                                    <Lock size={32} className="text-white/40" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{t.locked}</h3>
                                <p className="text-white/40 max-w-xs">{t.completePrevious}</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeLevelTab}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleLevelDragEnd}
                                className="px-4 md:px-8 grid grid-cols-2 gap-4 pb-8"
                            >
                                {/* Drills List */}
                                {activeDrills.map((drill) => (
                                    <div 
                                    key={drill.id}
                                    onClick={() => onSelectDrill(drill)}
                                    className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden group shadow-lg border border-white/5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                                    >
                                    <img 
                                        src={drill.image} 
                                        alt={t[drill.titleKey as keyof typeof t] || drill.titleKey} 
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                                    
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end z-10">
                                        <div className="space-y-1">
                                            <h3 className="text-lg md:text-2xl font-bold text-white leading-tight">
                                            {t[drill.titleKey as keyof typeof t] || drill.titleKey}
                                            </h3>
                                            <p className="text-white/60 text-[10px] md:text-xs font-medium tracking-wide">
                                            {drill.lastPlayed === 'Never' ? (
                                                <span>{t.neverTrained}</span>
                                            ) : (
                                                <span>{t.lastTrained}{drill.lastPlayed} • {drill.avgAccuracy}%</span>
                                            )}
                                            </p>
                                        </div>
                                    </div>
                                    </div>
                                ))}
                            </motion.div>
                            </AnimatePresence>
                        )}
                     </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Level Selector Action Sheet */}
      <AnimatePresence>
        {showLevelSheet && (
             <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" 
                    onClick={() => setShowLevelSheet(false)} 
                />
                <motion.div 
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] bg-surface-800 rounded-t-[2.5rem] border-t border-white/10 overflow-hidden max-w-md mx-auto"
                >
                    <div className="p-6 pb-10">
                        <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />
                        <h3 className="text-white font-bold text-center mb-6 text-xl">{t.myLevel || 'My Level'}</h3>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {levelOptions.map(lvl => {
                                const fullLabel = `NTRP ${lvl}`;
                                const isSelected = profile.level === fullLabel;
                                return (
                                    <button
                                        key={lvl}
                                        onClick={() => handleSelectLevel(lvl)}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-between px-6 border ${
                                            isSelected
                                            ? 'bg-neon-500 text-black border-neon-500' 
                                            : 'bg-white/5 text-white hover:bg-white/10 border-transparent'
                                        }`}
                                    >
                                        <span>{fullLabel}</span>
                                        {isSelected && <Check size={20} />}
                                    </button>
                                );
                            })}
                        </div>
                        <button 
                            onClick={() => setShowLevelSheet(false)}
                            className="w-full py-4 mt-4 text-white/40 font-bold hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardView;
