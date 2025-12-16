import React, { useState } from 'react';
import { Battery, Wifi, WifiOff, Volume2, ChevronRight, Settings } from 'lucide-react';
import { ConnectionStatus, DeviceInfo, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { AnimatePresence, motion } from 'framer-motion';

interface TopBarProps {
  connectionStatus: ConnectionStatus;
  deviceInfo: DeviceInfo;
  onProfileClick: () => void;
  onDeviceClick: () => void;
  currentView: string;
  lang: Language;
}

const TopBar: React.FC<TopBarProps> = ({ 
  connectionStatus, 
  deviceInfo, 
  onProfileClick, 
  onDeviceClick,
  lang
}) => {
  const [volume, setVolume] = useState(75);
  const [showVolumeTooltip, setShowVolumeTooltip] = useState<string | null>(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    let tooltip = null;

    if (val >= 45 && val <= 55) {
      val = 50;
      tooltip = t.indoorCourt;
    } else if (val >= 70 && val <= 80) {
      val = 75;
      tooltip = t.outdoorCourt;
    }

    setVolume(val);
    setShowVolumeTooltip(tooltip);
  };

  const handleVolumeRelease = () => {
    setTimeout(() => setShowVolumeTooltip(null), 1000);
  };

  const isConnected = connectionStatus === 'connected';

  // Estimate battery time (assuming 4 hours full charge)
  const getBatteryTime = (level: number) => {
    const totalHours = (level / 100) * 4;
    return `${totalHours.toFixed(1)}h`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm z-50 px-4 md:px-6 flex items-center justify-between text-white/80 select-none pointer-events-none">
      
      {/* Left: Device Status & Battery Group */}
      <div className="flex items-center pointer-events-auto z-10">
        <button 
          onClick={onDeviceClick}
          className={`flex items-center gap-2 md:gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group ${isConnected ? 'text-neon-400' : 'text-red-500'}`}
        >
          {isConnected ? (
            <>
              <Wifi size={16} className="group-hover:scale-110 transition-transform shrink-0" />
              <div className="w-px h-3 bg-white/10 shrink-0" />
              <div className="flex items-center gap-1.5 text-white/90">
                <Battery size={16} className={deviceInfo.batteryLevel < 20 ? "text-red-500 animate-pulse shrink-0" : "text-neon-400 shrink-0"} fill={deviceInfo.batteryLevel > 20 ? "currentColor" : "none"} />
                <span className="text-xs font-mono font-bold pt-0.5 whitespace-nowrap">{getBatteryTime(deviceInfo.batteryLevel)}</span>
              </div>
            </>
          ) : (
             <>
               <WifiOff size={16} className="shrink-0" />
               <span className="text-xs font-bold uppercase whitespace-nowrap hidden sm:inline">{t.noDevice}</span>
             </>
          )}
          <ChevronRight size={14} className="text-white/40 ml-1 group-hover:text-white transition-colors shrink-0" />
        </button>
      </div>

      {/* Right: Volume & Profile/Settings */}
      <div className="flex items-center justify-end gap-3 md:gap-4 pointer-events-auto">
         {/* Volume Slider (Only when connected) */}
        {isConnected && (
            <div className="flex items-center w-28 md:w-36 space-x-3 transition-all">
               <Volume2 size={16} className="text-white/60 shrink-0" />
               <div className="relative flex-1 h-8 flex items-center group">
                  {/* Track Background */}
                  <div className="absolute w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-500" style={{ width: `${volume}%` }} />
                  </div>
                  
                  {/* Snap Point Markers */}
                  <div className="absolute left-[50%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/40 rounded-full z-0 pointer-events-none" />
                  <div className="absolute left-[75%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/40 rounded-full z-0 pointer-events-none" />

                  {/* Input */}
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={handleVolumeChange}
                    onMouseUp={handleVolumeRelease}
                    onTouchEnd={handleVolumeRelease}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  
                  {/* Custom Thumb */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none transition-all duration-75 z-10 scale-100 group-active:scale-125"
                    style={{ left: `calc(${volume}% - 6px)` }}
                  />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {showVolumeTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-8 -translate-x-1/2 bg-surface-800 border border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-neon-400 whitespace-nowrap shadow-xl z-30 pointer-events-none"
                        style={{ left: `${volume}%` }}
                      >
                        {showVolumeTooltip}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-surface-800 border-l border-t border-white/20 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
        )}

        <button 
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-800 border border-white/20 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;