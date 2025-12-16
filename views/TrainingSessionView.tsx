
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Timer, Target } from 'lucide-react';
import { TrainingType, Language } from '../types';
import { Button } from '../components/Button';
import { TRANSLATIONS } from '../translations';

interface TrainingSessionViewProps {
  trainingType: TrainingType;
  onStop: (stats: { duration: string; balls: number; bestSpeed: number; accuracy: number }) => void;
  lang: Language;
  isCalibrating: boolean;
}

const TrainingSessionView: React.FC<TrainingSessionViewProps> = ({ trainingType, onStop, lang, isCalibrating }) => {
  const [isPlaying, setIsPlaying] = useState(!isCalibrating);
  const [duration, setDuration] = useState(0);
  const [balls, setBalls] = useState(0);
  const t = TRANSLATIONS[lang];

  // Pause play state if calibration starts
  useEffect(() => {
    if (isCalibrating) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [isCalibrating]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isPlaying && !isCalibrating) {
      interval = setInterval(() => {
        setDuration(d => d + 1);
        if (Math.random() > 0.7) setBalls(b => b + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCalibrating]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeForReport = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      return `${mins}m`;
  };

  const handleStop = () => {
      onStop({
          duration: formatTimeForReport(duration),
          balls: balls,
          bestSpeed: 124, // Mock value for demo
          accuracy: 88,   // Mock value for demo
      });
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col pt-16">
      
      {/* Background Pulse Effect when active */}
      {isPlaying && !isCalibrating && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-500/5 rounded-full blur-[100px] animate-pulse-slow" />
        </div>
      )}

      {/* Main Stats Display */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 z-10 relative pb-32">
        <motion.div 
          animate={{ scale: isPlaying ? 1 : 0.95, opacity: isPlaying ? 1 : 0.6 }}
          className="text-center space-y-2"
        >
          <h3 className="text-neon-400 font-bold uppercase tracking-widest mb-4">
            {isCalibrating ? t.calibrating : (t[trainingType as keyof typeof t] || trainingType)}
          </h3>
          
          {/* Main Display: Ball Count (Swapped) */}
          <div className="text-9xl font-bold text-white tabular-nums tracking-tighter">
            {balls.toString().padStart(2, '0')}
          </div>
          
          <div className="flex items-center justify-center space-x-8 mt-4 text-white/50">
            {/* Secondary Display: Duration (Swapped) */}
            <div className="flex items-center space-x-2">
              <Timer size={20} />
              <span className="text-xl font-mono">{formatTime(duration)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={20} />
              <span className="text-xl font-mono">120 km/h</span>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center space-x-8">
          <Button 
            disabled={isCalibrating}
            variant={isPlaying ? "secondary" : "primary"}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-24 h-24 !rounded-full flex items-center justify-center !p-0 border-2 ${isCalibrating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             {isPlaying && !isCalibrating ? <Pause size={48} className="fill-current" /> : <Play size={48} className="fill-current ml-1.5" />}
          </Button>

          <Button 
            disabled={isCalibrating}
            variant="danger"
            onClick={handleStop}
            className={`w-24 h-24 !rounded-full flex items-center justify-center !p-0 border-2 ${isCalibrating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             <Square size={36} className="fill-current" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainingSessionView;
