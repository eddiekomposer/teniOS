
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Loader2, Wifi } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';

interface Device {
  id: string;
  name: string;
  image?: string;
}

interface PairingViewProps {
  onConnect: () => void;
  lang?: Language;
}

const PairingView: React.FC<PairingViewProps> = ({ onConnect, lang = 'en' }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  useEffect(() => {
    // Simulate finding devices
    const timer1 = setTimeout(() => {
      setDevices(prev => {
        if (prev.find(d => d.id === '1')) return prev;
        return [...prev, { id: '1', name: 'X Tennis', image: 'https://cdn-icons-png.flaticon.com/512/5225/5225392.png' }];
      });
    }, 2000);

    const timer2 = setTimeout(() => {
      setDevices(prev => {
         if (prev.find(d => d.id === '2')) return prev;
         return [...prev, { id: '2', name: 'AcePro X1' }];
      });
      setIsScanning(false);
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-black overflow-y-auto pt-20">
      
      {/* Header / Radar for Scanning */}
      <div className="flex flex-col items-center mb-10 shrink-0">
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {isScanning && (
            <>
              <motion.div 
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-full h-full rounded-full border border-neon-500/30"
              />
              <motion.div 
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className="absolute w-2/3 h-2/3 rounded-full border border-neon-500/40"
              />
            </>
          )}
          
          <div className="relative z-10 bg-surface-900 p-4 rounded-full border border-surface-700 shadow-2xl">
            {isScanning ? (
               <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
            ) : (
               <Radio className="w-8 h-8 text-neon-400" />
            )}
          </div>
        </div>
        
        <h2 className="text-xl font-medium text-white/60 tracking-wide">
          {isScanning ? t.scanning : t.devicesFound}
        </h2>
      </div>

      {/* Device Cards List */}
      <div className="w-full max-w-5xl flex flex-wrap justify-center gap-8 pb-10">
        <AnimatePresence>
          {devices.map((device) => (
            <motion.div 
              key={device.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[320px] aspect-[3/4] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-between shadow-2xl group overflow-hidden hover:border-white/20 transition-all duration-300"
            >
               {/* Ambient Glow */}
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-white/10 transition-colors" />

               {/* Title */}
               <h3 className="text-3xl font-bold text-white tracking-tight relative z-10 text-center mt-2">
                 {device.name}
               </h3>

               {/* Product Image Area */}
               <div className="flex-1 w-full flex items-center justify-center relative z-10 my-4">
                  {/* Placeholder for the machine image */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Abstract representation of the machine if no image */}
                    <div className="w-40 h-40 bg-gradient-to-b from-surface-800 to-surface-900 rounded-2xl border border-white/5 shadow-inner flex items-center justify-center relative overflow-hidden">
                       <div className="absolute top-0 w-full h-1 bg-white/10" />
                       <div className="absolute bottom-0 w-full h-1 bg-black/50" />
                       {/* Basket balls */}
                       <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex space-x-1">
                          <div className="w-6 h-6 rounded-full bg-neon-600/80 shadow-sm" />
                          <div className="w-6 h-6 rounded-full bg-neon-500 shadow-sm -mt-2" />
                          <div className="w-6 h-6 rounded-full bg-neon-600/80 shadow-sm" />
                       </div>
                       
                       {/* Machine Body */}
                       <div className="flex flex-col items-center">
                          <Wifi size={32} className="text-white/20 mb-2" />
                          <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Smart Pro</span>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Connect Button */}
               <button 
                 onClick={onConnect}
                 className="w-full py-4 rounded-full border border-white/20 text-white font-bold text-lg tracking-wide hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all relative z-10"
               >
                 {t.connect}
               </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Empty State / Ghost Card for loading */}
        {isScanning && devices.length === 0 && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }}
             className="w-full max-w-[320px] aspect-[3/4] rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center p-8 animate-pulse"
           >
              <div className="w-32 h-6 bg-white/5 rounded-full mb-12" />
              <div className="w-40 h-40 bg-white/5 rounded-2xl mb-12" />
              <div className="w-full h-14 bg-white/5 rounded-full" />
           </motion.div>
        )}
      </div>
    </div>
  );
};

export default PairingView;
