
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { View, ConnectionStatus, TrainingType, Language, PairedDevice, Coach, TrainingHistoryItem, Drill } from './types';
import { MOCK_DEVICE, DRILLS_DATA } from './constants';
import TopBar from './components/TopBar';
import PairingView from './views/PairingView';
import DashboardView from './views/DashboardView';
import TrainingSessionView from './views/TrainingSessionView';
import ReportView from './views/ReportView';
import ProfileView from './views/ProfileView';
import DeviceView from './views/DeviceView';
import DeviceDetailsView from './views/DeviceDetailsView';
import PostureDetailView from './views/PostureDetailView';
import HistoryView from './views/HistoryView';
import { CalibrationOverlay } from './components/CalibrationOverlay';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  // State to track where to return after viewing a report
  const [returnView, setReturnView] = useState<View>('home');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [activeTraining, setActiveTraining] = useState<TrainingType | null>(null);
  const [lang, setLang] = useState<Language>('zh-CN');
  const [coach, setCoach] = useState<Coach>('Zhou');
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<PairedDevice | null>(null);
  
  // New State for Drill Detail
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);

  // History State - Mock some initial data
  const [history, setHistory] = useState<TrainingHistoryItem[]>([
    { id: '1', date: 'Oct 20', type: 'Forehand', duration: '15m', balls: 120, bestSpeed: 110, accuracy: 78 },
    { id: '2', date: 'Oct 22', type: 'Backhand', duration: '20m', balls: 150, bestSpeed: 95, accuracy: 65 },
    { id: '3', date: 'Oct 24', type: 'Forehand', duration: '25m', balls: 200, bestSpeed: 124, accuracy: 88 }
  ]);
  const [currentReport, setCurrentReport] = useState<TrainingHistoryItem | null>(null);

  // Connection Handler
  const handleConnect = () => {
    setConnectionStatus('connecting');
    // Simulate connection delay
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 1500);
  };

  // Calibration Logic
  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationStep(1);
    setIsCalibrated(false);
  };

  useEffect(() => {
    if (isCalibrating && calibrationStep > 0 && calibrationStep < 4) {
      const timer = setTimeout(() => {
        setCalibrationStep(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    }
    if (calibrationStep === 4) {
      setTimeout(() => {
        setIsCalibrated(true);
        setIsCalibrating(false);
        setCalibrationStep(0);
      }, 2000);
    }
  }, [calibrationStep, isCalibrating]);

  // Navigation Handlers
  const navigateTo = (view: View) => {
    setCurrentView(view);
  };

  // Called when user selects a drill card from Dashboard
  const handleSelectDrill = (drill: Drill) => {
    setSelectedDrill(drill);
    navigateTo('posture-detail');
  };

  const startTrainingFromDetail = () => {
    if (!selectedDrill) return;
    
    // Find the category of this drill
    let trainingType: TrainingType = 'Forehand';
    for (const [key, drills] of Object.entries(DRILLS_DATA)) {
        if (drills.find(d => d.id === selectedDrill.id)) {
            trainingType = key as TrainingType;
            break;
        }
    }
    startTraining(trainingType);
  };

  // New handler to start training directly from Dashboard card button
  const handleStartDrillDirectly = (drill: Drill) => {
    // Check if it's the first time (lastPlayed is 'Never')
    if (drill.lastPlayed === 'Never') {
        setSelectedDrill(drill);
        navigateTo('posture-detail');
        return;
    }

    // Find the category of this drill
    let trainingType: TrainingType = 'Forehand';
    for (const [key, drills] of Object.entries(DRILLS_DATA)) {
        if (drills.find(d => d.id === drill.id)) {
            trainingType = key as TrainingType;
            break;
        }
    }
    startTraining(trainingType);
  };

  const startTraining = (type: TrainingType) => {
    setActiveTraining(type);
    setCurrentView('training-session');

    // Check calibration status when training is started
    if (!isCalibrated) {
        startCalibration();
    }
  };

  const stopTraining = (stats: { duration: string; balls: number; bestSpeed: number; accuracy: number }) => {
    if (activeTraining) {
        const newReport: TrainingHistoryItem = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            type: activeTraining,
            ...stats
        };
        setHistory(prev => [newReport, ...prev]);
        setCurrentReport(newReport);
    }
    setReturnView('home');
    setCurrentView('report');
  };

  const closeReport = () => {
    setActiveTraining(null);
    setCurrentReport(null);
    setCurrentView(returnView);
  };

  const viewHistoryReport = (item: TrainingHistoryItem) => {
      setCurrentReport(item);
      setReturnView('history'); // Return to history list after viewing specific report
      setCurrentView('report');
  };

  const retryTraining = () => {
    if (activeTraining) {
      setCurrentView('training-session');
    } else if (currentReport) {
       // If retrying from a history report, restart that type
       setActiveTraining(currentReport.type);
       setCurrentView('training-session');
    }
  };

  const handleSelectDevice = (device: PairedDevice) => {
    setSelectedDevice(device);
    setCurrentView('device-details');
  };

  const handleDeviceAction = (action: 'connect' | 'remove' | 'rename', payload?: any) => {
    console.log(`Device Action: ${action}`, payload);
    // Mock action, in a real app this would update state/DB
    if (action === 'connect') {
      navigateTo('home');
      setConnectionStatus('connected');
    } else if (action === 'remove') {
      navigateTo('device');
    }
  };

  // View Renderer
  const renderView = () => {
    if (currentView === 'profile') {
      return (
        <ProfileView 
          onBack={() => navigateTo('home')} 
          onViewReport={viewHistoryReport}
          lang={lang} 
          setLang={setLang}
          coach={coach}
          setCoach={setCoach}
          history={history}
        />
      );
    }

    if (currentView === 'history') {
        return (
            <HistoryView
                onBack={() => navigateTo('home')}
                onViewReport={viewHistoryReport}
                lang={lang}
                history={history}
            />
        )
    }
    
    if (currentView === 'report') {
      return (
         <ReportView 
            onClose={closeReport} 
            onRetry={retryTraining} 
            lang={lang}
            fromHistory={returnView !== 'home' || currentReport != null} // If currentReport is active from dashboard click, treat as history? Actually fromHistory prop controls back button.
            // Simplified logic: If we are viewing a past report (currentReport set, activeTraining null), it's history.
            // If activeTraining is set, it's a post-session report.
            // But wait, when stopping training, activeTraining is still set until closeReport? 
            // Better logic: if returnView is 'profile' or we came from dashboard history click.
            coach={coach}
            reportData={currentReport || undefined}
          />
      );
    }

    if (currentView === 'posture-detail' && selectedDrill) {
        // Derive training type for the drill
        let drillType: TrainingType = 'Forehand';
        for (const [key, drills] of Object.entries(DRILLS_DATA)) {
            if (drills.find(d => d.id === selectedDrill.id)) {
                drillType = key as TrainingType;
                break;
            }
        }

        return (
            <PostureDetailView 
                drill={selectedDrill}
                drillType={drillType}
                history={history}
                onBack={() => navigateTo('home')}
                onStart={startTrainingFromDetail}
                onViewReport={viewHistoryReport}
                lang={lang}
                coach={coach} // Passed coach to the detailed view
            />
        )
    }

    // Connected Logic - Default to Home/Dashboard even if disconnected
    switch (currentView) {
      case 'home':
        return (
          <DashboardView 
            onSelectDrill={handleSelectDrill} 
            onStartDrill={handleStartDrillDirectly}
            lang={lang}
            history={history}
            onViewHistory={viewHistoryReport}
            connectionStatus={connectionStatus}
            onConnectPress={handleConnect}
            onShowFullHistory={() => navigateTo('history')}
          />
        );
      case 'training-session':
        return activeTraining ? (
          <TrainingSessionView 
            trainingType={activeTraining} 
            onStop={stopTraining} 
            lang={lang}
            isCalibrating={isCalibrating}
          />
        ) : null;
      case 'device':
        return (
          <DeviceView 
            onBack={() => navigateTo('home')} 
            isCalibrated={isCalibrated}
            onStartCalibration={startCalibration}
            onSelectDevice={handleSelectDevice}
            onSwitchDevice={(device) => handleDeviceAction('connect', device)}
            lang={lang}
          />
        );
      case 'device-details':
        return selectedDevice ? (
          <DeviceDetailsView 
            device={selectedDevice}
            onBack={() => navigateTo('device')}
            onConnect={() => handleDeviceAction('connect', selectedDevice)}
            onRemove={() => handleDeviceAction('remove', selectedDevice.id)}
            onRename={(id, newName) => handleDeviceAction('rename', { id, newName })}
            lang={lang}
          />
        ) : null;
      default:
        return (
          <DashboardView 
            onSelectDrill={handleSelectDrill}
            onStartDrill={handleStartDrillDirectly}
            lang={lang}
            history={history}
            onViewHistory={viewHistoryReport}
            connectionStatus={connectionStatus}
            onConnectPress={handleConnect}
            onShowFullHistory={() => navigateTo('history')}
          />
        );
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-neon-500 selection:text-black">
      {/* Persistent Status Bar - Hide on detail views for immersion */}
      {currentView !== 'posture-detail' && currentView !== 'video-player' && (
        <TopBar 
            connectionStatus={connectionStatus}
            deviceInfo={MOCK_DEVICE}
            onProfileClick={() => navigateTo('profile')}
            onDeviceClick={() => navigateTo('device')}
            currentView={currentView}
            lang={lang}
        />
      )}

      {/* Main Content Area with Transitions */}
      <main className="relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + connectionStatus}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="w-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Calibration Overlay - Hide if in training session as it handles it internally */}
      {currentView !== 'training-session' && (
        <CalibrationOverlay isVisible={isCalibrating} step={calibrationStep} lang={lang} />
      )}
      
      {/* Global Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-neon-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
};

export default App;
