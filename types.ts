
export type View = 'home' | 'training-session' | 'report' | 'profile' | 'history' | 'device' | 'device-details' | 'posture-detail' | 'video-player';

export type ConnectionStatus = 'disconnected' | 'searching' | 'connecting' | 'connected';

export type TrainingType = 'Forehand' | 'Backhand' | 'Serve' | 'Volley' | 'Smash';

export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ru';

export type Coach = 'Zhou' | 'Tony' | 'Jesse';

export interface TrainingSessionStats {
  duration: number; // seconds
  ballsFired: number;
  accuracy: number; // percentage
  avgSpeed: number; // km/h
  spinLevel: number; // 1-10
}

export interface DeviceInfo {
  name: string;
  batteryLevel: number;
  firmwareVersion: string;
  serialNumber: string;
}

export interface PairedDevice {
  id: string;
  name: string;
  battery: number;
  firmware: string;
  serial: string;
  lastConnected?: string;
}

export interface UserProfile {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Pro';
  numericLevel: number;
  totalSessions: number;
  totalBalls: number;
  joinDate: string;
  totalHours: number;
}

export interface TrainingHistoryItem {
  id: string;
  date: string;
  type: TrainingType;
  duration: string;
  balls: number;
  bestSpeed: number;
  accuracy: number;
}

export interface Drill {
    id: string;
    titleKey: string;
    image: string;
    videoUrl: string;
    lastPlayed: string; // ISO date or "Never"
    avgAccuracy: number; // 0-100
    descriptionKey: string;
    tutorialStepsKey: string;
    aiGuidanceKey: string;
    tutorialImages: string[];
}
