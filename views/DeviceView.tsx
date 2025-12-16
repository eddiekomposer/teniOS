
import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Battery, Wifi, Power, ChevronLeft, Edit2, ShieldCheck, RefreshCw, Smartphone, Bluetooth, ChevronRight } from 'lucide-react';
import { MOCK_DEVICE } from '../constants';
import { Button } from '../components/Button';
import { Language, PairedDevice } from '../types';
import { TRANSLATIONS } from '../translations';

interface DeviceViewProps {
  onBack: () => void;
  isCalibrated: boolean;
  onStartCalibration: () => void;
  onSelectDevice: (device: PairedDevice) => void;
  onSwitchDevice: (device: PairedDevice) => void;
  lang: Language;
}

const DeviceView: React.FC<DeviceViewProps> = ({ 
  onBack, 
  isCalibrated, 
  onStartCalibration, 
  onSelectDevice, 
  onSwitchDevice, 
  lang 
}) => {
  const t = TRANSLATIONS[lang];
  // Local state to simulate switching devices
  const [currentDevice, setCurrentDevice] = useState(MOCK_DEVICE);
  const [name, setName] = useState(currentDevice.name);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (name.trim()) {
      setIsEditing(false);
      // Update current device name in state
      setCurrentDevice(prev => ({ ...prev, name: name }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  // Mock list of other devices
  const otherDevices: any[] = [
    { id: 'd2', name: 'SpinBot Pro', battery: 45, firmware: '1.8.2', serial: 'SB-2022-X', lastConnectedVal: 2, lastConnectedUnit: 'daysAgo' },
    { id: 'd3', name: 'CourtMate Mini', battery: 92, firmware: '3.0.1', serial: 'CM-2024-M', lastConnectedVal: 1, lastConnectedUnit: 'weekAgo' }
  ];

  return (
    <div className="h-screen flex flex-col bg-black pt-16">
      {/* Sticky Header */}
      <div className="shrink-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              aria-label={t.backToHome}
            >
              <ChevronLeft size={32} />
            </button>
            <h1 className="text-3xl font-bold text-white">{t.device}</h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Main Graphic */}
            <div className="bg-surface-800 rounded-3xl p-8 flex flex-col items-center justify-center border border-white/5 min-h-[300px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="w-48 h-48 bg-gradient-to-br from-surface-700 to-surface-900 rounded-2xl shadow-2xl flex items-center justify-center border border-white/10 z-10 transform group-hover:scale-105 transition-transform duration-500">
                <Cpu size={80} className="text-white/20" />
              </div>
              
              <div className="z-10 mt-6 flex flex-col items-center justify-center text-center">
                 {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="text-2xl font-bold text-white bg-transparent border-b-2 border-neon-500 focus:outline-none text-center w-full max-w-[200px] px-2 py-1"
                  />
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center group/edit hover:bg-white/5 px-4 py-1 rounded-lg transition-colors gap-2"
                  >
                    <h2 className="text-2xl font-bold text-white">{name}</h2>
                    <Edit2 size={16} className="text-white/20 group-hover/edit:text-neon-400 transition-colors opacity-0 group-hover:opacity-100 group-hover/edit:opacity-100" />
                  </button>
                )}
                <p className="text-white/40 font-mono text-sm mt-1">{currentDevice.serialNumber}</p>

                <div className="flex items-center space-x-2 text-neon-400 bg-neon-500/10 px-3 py-1 rounded-full border border-neon-500/20 mt-4">
                   <div className="w-1.5 h-1.5 bg-neon-500 rounded-full animate-pulse" />
                   <span className="font-bold text-xs uppercase tracking-wide">READY</span>
                 </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 content-start">
               {/* Warranty Section */}
               <div className="bg-surface-800 rounded-2xl p-6 border border-white/5 flex items-center justify-between relative overflow-hidden">
                 <div className="absolute right-0 top-0 w-32 h-32 bg-neon-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                 <div className="flex items-center relative z-10">
                   <div className="p-3 bg-neon-500/10 rounded-full mr-4 text-neon-400">
                      <ShieldCheck size={24} />
                   </div>
                   <div>
                      <div className="text-white font-bold mb-1">{t.warrantyActive}</div>
                      <div className="text-white/40 text-xs">{t.warrantyExpires} Oct 24, 2025</div>
                   </div>
                 </div>
                 <button className="text-sm font-bold text-neon-400 hover:text-white transition-colors relative z-10">{t.viewDetails}</button>
              </div>

              <div className="bg-surface-800 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/10 rounded-full mr-4 text-green-400">
                    <Battery size={24} />
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">{t.battery}</div>
                    <div className="text-2xl font-bold text-white">{currentDevice.batteryLevel}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-800 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500/10 rounded-full mr-4 text-blue-400">
                    <Wifi size={24} />
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">{t.signal}</div>
                    <div className="text-2xl font-bold text-white">{t.excellent}</div>
                  </div>
                </div>
              </div>

               <div className="bg-surface-800 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/10 rounded-full mr-4 text-purple-400">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">{t.firmware}</div>
                    <div className="text-2xl font-bold text-white">v{currentDevice.firmwareVersion}</div>
                  </div>
                </div>
                <button className="text-sm font-bold text-neon-400 hover:text-neon-300">{t.checkUpdate}</button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mb-12">
            <Button variant="danger" className="w-full" icon={<Power size={18} />}>
              {t.disconnect}
            </Button>
          </div>

          {/* Other Devices List */}
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6">{t.otherDevices}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {otherDevices.map((device) => (
                 <div 
                    key={device.id} 
                    className="bg-surface-800/50 rounded-xl p-4 border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all"
                 >
                    <button 
                      onClick={() => onSelectDevice(device)}
                      className="flex items-center flex-1 text-left"
                    >
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 transition-colors">
                          <Bluetooth size={18} className="text-white/40 group-hover:text-white" />
                       </div>
                       <div>
                          <div className="font-bold text-white group-hover:text-neon-400 transition-colors">{device.name}</div>
                          <div className="text-xs text-white/40">{t.lastConnected}: {device.lastConnectedVal} {t[device.lastConnectedUnit as keyof typeof t]}</div>
                       </div>
                    </button>
                    
                    <div className="ml-4 pl-4 border-l border-white/10">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => onSwitchDevice(device)}
                        className="text-xs px-3 py-1.5 h-auto min-h-0"
                      >
                        {t.switchDevice}
                      </Button>
                    </div>
                 </div>
               ))}
                 
               {/* Add New Device Button Placeholder */}
               <button className="rounded-xl p-4 border border-dashed border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all min-h-[80px]">
                  <span className="text-sm font-bold uppercase tracking-wider">{t.addNewDevice}</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceView;
