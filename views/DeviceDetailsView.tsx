import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Battery, ChevronLeft, Edit2, Trash2, Power, Bluetooth } from 'lucide-react';
import { Button } from '../components/Button';
import { Language, PairedDevice } from '../types';
import { TRANSLATIONS } from '../translations';

interface DeviceDetailsViewProps {
  device: PairedDevice;
  onBack: () => void;
  onConnect: (device: PairedDevice) => void;
  onRemove: (deviceId: string) => void;
  onRename: (deviceId: string, newName: string) => void;
  lang: Language;
}

const DeviceDetailsView: React.FC<DeviceDetailsViewProps> = ({ 
  device, 
  onBack, 
  onConnect, 
  onRemove, 
  onRename, 
  lang 
}) => {
  const t = TRANSLATIONS[lang];
  const [name, setName] = useState(device.name);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (name.trim() && name !== device.name) {
      onRename(device.id, name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black pt-16">
      {/* Sticky Header */}
      <div className="shrink-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            aria-label={t.back}
          >
            <ChevronLeft size={32} />
          </button>
          <h1 className="text-3xl font-bold text-white">{t.deviceDetails}</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="flex flex-col items-center mb-12">
            {/* Device Icon */}
            <div className="w-40 h-40 bg-gradient-to-br from-surface-700 to-surface-900 rounded-3xl shadow-2xl flex items-center justify-center border border-white/10 mb-6 relative group overflow-hidden">
               <div className="absolute inset-0 bg-neon-500/5 group-hover:bg-neon-500/10 transition-colors" />
               <Bluetooth size={64} className="text-white/20 group-hover:text-neon-400 transition-colors" />
            </div>

            {/* Editable Name */}
            <div className="flex items-center justify-center relative">
               {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="text-3xl font-bold text-white bg-transparent border-b-2 border-neon-500 focus:outline-none text-center min-w-[200px] px-2 py-1"
                  />
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center group/edit hover:bg-white/5 px-4 py-1 rounded-lg transition-colors gap-3"
                  >
                    <h2 className="text-3xl font-bold text-white">{name}</h2>
                    <Edit2 size={20} className="text-white/20 group-hover/edit:text-neon-400 transition-colors opacity-0 group-hover:opacity-100 group-hover/edit:opacity-100" />
                  </button>
                )}
            </div>
            <p className="text-white/40 font-mono mt-2">{device.serial}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
             <div className="bg-surface-800 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div>
                   <div className="text-white/40 text-xs font-bold uppercase mb-1">{t.lastConnected}</div>
                   <div className="text-white font-bold">{device.lastConnected || 'Unknown'}</div>
                </div>
             </div>
             
             <div className="bg-surface-800 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div>
                   <div className="text-white/40 text-xs font-bold uppercase mb-1">{t.battery}</div>
                   <div className="text-white font-bold flex items-center">
                      <Battery size={16} className="mr-2 text-neon-400" />
                      {device.battery}%
                   </div>
                </div>
             </div>

             <div className="bg-surface-800 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div>
                   <div className="text-white/40 text-xs font-bold uppercase mb-1">{t.firmware}</div>
                   <div className="text-white font-bold flex items-center">
                      <Cpu size={16} className="mr-2 text-white/40" />
                      v{device.firmware}
                   </div>
                </div>
             </div>
          </div>

          <div className="flex flex-col space-y-4">
             <Button 
               variant="primary" 
               size="lg" 
               className="w-full" 
               icon={<Power size={20} />}
               onClick={() => onConnect(device)}
             >
               {t.connect}
             </Button>

             <Button 
               variant="danger" 
               size="lg" 
               className="w-full bg-transparent hover:bg-red-500/10 border-red-500/20" 
               icon={<Trash2 size={20} />}
               onClick={() => onRemove(device.id)}
             >
               {t.forgetDevice}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsView;