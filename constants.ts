
import { TrainingType, DeviceInfo, UserProfile, Drill } from './types';

export const TRAINING_TYPES: { type: TrainingType; description: string; image: string }[] = [
  { 
    type: 'Forehand', 
    description: 'Drills focusing on cross-court and down-the-line power.',
    image: 'https://image.pollinations.ai/prompt/cinematic%20shot%20of%20a%20tennis%20player%20hitting%20a%20forehand%2C%20futuristic%20neon%20lighting%2C%20cyberpunk%20style%2C%20glowing%20green%20ball%2C%20dark%20atmosphere%2C%20highly%20detailed%208k?width=800&height=1050&nologo=true&seed=101'
  },
  { 
    type: 'Backhand', 
    description: 'Improve stability and slice control on your weak side.',
    image: 'https://image.pollinations.ai/prompt/dynamic%20tennis%20player%20hitting%20a%20backhand%2C%20sci-fi%20aesthetic%2C%20neon%20blue%20lights%2C%20motion%20blur%2C%20futuristic%20sportswear%2C%20dark%20background%2C%20hyperrealistic?width=800&height=1050&nologo=true&seed=102'
  },
  { 
    type: 'Serve', 
    description: 'Practice placement, speed, and kick serves.',
    image: 'https://image.pollinations.ai/prompt/low%20angle%20shot%20of%20a%20tennis%20serve%2C%20cyborg%20athlete%2C%20neon%20energy%20particles%2C%20intense%20action%2C%20dark%20stadium%2C%20futuristic%20concept%20art%2C%20volumetric%20lighting?width=800&height=1050&nologo=true&seed=103'
  },
  { 
    type: 'Volley', 
    description: 'Quick reaction net play drills.',
    image: 'https://image.pollinations.ai/prompt/close%20up%20tennis%20volley%20at%20net%2C%20futuristic%20visor%2C%20glowing%20racket%20strings%2C%20cyberpunk%20night%20match%2C%20neon%20yellow%20highlights%2C%20digital%20art%20masterpiece?width=800&height=1050&nologo=true&seed=104'
  },
  { 
    type: 'Smash', 
    description: 'Overhead power and placement.',
    image: 'https://image.pollinations.ai/prompt/tennis%20player%20hitting%20a%20smash%2C%20looking%20up%20at%20ball%2C%20dramatic%20lighting%2C%20neon%20accents?width=800&height=1050&nologo=true&seed=105'
  }
];

export const DRILLS_DATA: Record<TrainingType, Drill[]> = {
    'Forehand': [
        {
            id: 'fh_flat',
            titleKey: 'drillFlatForehand',
            image: 'https://images.unsplash.com/photo-1599586120429-48285b6a8a81?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5738870/5738870-hd_1920_1080_24fps.mp4',
            lastPlayed: '1 day ago',
            avgAccuracy: 82,
            descriptionKey: 'introHighForehand',
            tutorialStepsKey: 'stepsHighForehand',
            aiGuidanceKey: 'aiHighForehand',
            tutorialImages: ['https://images.unsplash.com/photo-1599586120429-48285b6a8a81?q=80&w=400&auto=format&fit=crop']
        },
        {
            id: 'fh_topspin',
            titleKey: 'drillTopspinForehand',
            image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5739228/5739228-hd_1920_1080_24fps.mp4',
            lastPlayed: 'Never',
            avgAccuracy: 0,
            descriptionKey: 'introLowForehand',
            tutorialStepsKey: 'stepsLowForehand',
            aiGuidanceKey: 'aiLowForehand',
            tutorialImages: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=400&auto=format&fit=crop']
        },
        {
            id: 'fh_slice',
            titleKey: 'drillForehandSlice',
            image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/4753574/4753574-hd_1920_1080_25fps.mp4',
            lastPlayed: 'Never',
            avgAccuracy: 0,
            descriptionKey: 'introCrossCourt',
            tutorialStepsKey: 'stepsCrossCourt',
            aiGuidanceKey: 'aiCrossCourt',
            tutorialImages: ['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop']
        }
    ],
    'Backhand': [
        {
            id: 'bh_one',
            titleKey: 'drillOneHandedBackhand',
            image: 'https://images.unsplash.com/photo-1617058850640-5a71df532f39?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5738870/5738870-hd_1920_1080_24fps.mp4',
            lastPlayed: '2 days ago',
            avgAccuracy: 65,
            descriptionKey: 'introBackhandSlice',
            tutorialStepsKey: 'stepsBackhandSlice',
            aiGuidanceKey: 'aiBackhandSlice',
            tutorialImages: ['https://images.unsplash.com/photo-1617058850640-5a71df532f39?q=80&w=400&auto=format&fit=crop']
        },
        {
            id: 'bh_two',
            titleKey: 'drillTwoHandedBackhand',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5739228/5739228-hd_1920_1080_24fps.mp4',
            lastPlayed: 'Never',
            avgAccuracy: 0,
            descriptionKey: 'introBackhandTopspin',
            tutorialStepsKey: 'stepsBackhandTopspin',
            aiGuidanceKey: 'aiBackhandTopspin',
            tutorialImages: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop']
        },
        {
            id: 'bh_topspin',
            titleKey: 'drillTopspinBackhand',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5739228/5739228-hd_1920_1080_24fps.mp4',
            lastPlayed: 'Never',
            avgAccuracy: 0,
            descriptionKey: 'introBackhandTopspin',
            tutorialStepsKey: 'stepsBackhandTopspin',
            aiGuidanceKey: 'aiBackhandTopspin',
            tutorialImages: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop']
        },
        {
            id: 'bh_slice',
            titleKey: 'drillBackhandSlice',
            image: 'https://images.unsplash.com/photo-1617058850640-5a71df532f39?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5738870/5738870-hd_1920_1080_24fps.mp4',
            lastPlayed: '5 days ago',
            avgAccuracy: 70,
            descriptionKey: 'introBackhandSlice',
            tutorialStepsKey: 'stepsBackhandSlice',
            aiGuidanceKey: 'aiBackhandSlice',
            tutorialImages: ['https://images.unsplash.com/photo-1617058850640-5a71df532f39?q=80&w=400&auto=format&fit=crop']
        }
    ],
    'Serve': [
        {
            id: 'sv_flat',
            titleKey: 'drillFlatServe',
            image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/4753574/4753574-hd_1920_1080_25fps.mp4',
            lastPlayed: '5 days ago',
            avgAccuracy: 88,
            descriptionKey: 'introFlatServe',
            tutorialStepsKey: 'stepsFlatServe',
            aiGuidanceKey: 'aiFlatServe',
            tutorialImages: ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=400&auto=format&fit=crop']
        },
        {
            id: 'sv_kick',
            titleKey: 'drillKickServe',
            image: 'https://images.unsplash.com/photo-1626245279203-90d297924c53?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5738870/5738870-hd_1920_1080_24fps.mp4',
            lastPlayed: 'Never',
            avgAccuracy: 0,
            descriptionKey: 'introKickServe',
            tutorialStepsKey: 'stepsKickServe',
            aiGuidanceKey: 'aiKickServe',
            tutorialImages: ['https://images.unsplash.com/photo-1626245279203-90d297924c53?q=80&w=400&auto=format&fit=crop']
        }
    ],
    'Volley': [
        {
            id: 'vl_forehand',
            titleKey: 'drillForehandVolley',
            image: 'https://images.unsplash.com/photo-1560155016-834c71887e59?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5739228/5739228-hd_1920_1080_24fps.mp4',
            lastPlayed: '1 week ago',
            avgAccuracy: 72,
            descriptionKey: 'introForehandVolley',
            tutorialStepsKey: 'stepsForehandVolley',
            aiGuidanceKey: 'aiForehandVolley',
            tutorialImages: ['https://images.unsplash.com/photo-1560155016-834c71887e59?q=80&w=400&auto=format&fit=crop']
        },
        {
            id: 'vl_backhand',
            titleKey: 'drillBackhandVolley',
            image: 'https://images.unsplash.com/photo-1560155016-834c71887e59?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5739228/5739228-hd_1920_1080_24fps.mp4',
            lastPlayed: 'Never',
            avgAccuracy: 0,
            descriptionKey: 'introForehandVolley',
            tutorialStepsKey: 'stepsForehandVolley',
            aiGuidanceKey: 'aiForehandVolley',
            tutorialImages: ['https://images.unsplash.com/photo-1560155016-834c71887e59?q=80&w=400&auto=format&fit=crop']
        }
    ],
    'Smash': [
         {
            id: 'fh_smash',
            titleKey: 'drillForehandSmash',
            image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=800&auto=format&fit=crop',
            videoUrl: 'https://videos.pexels.com/video-files/5738870/5738870-hd_1920_1080_24fps.mp4',
            lastPlayed: '2 weeks ago',
            avgAccuracy: 90,
            descriptionKey: 'introOverhead',
            tutorialStepsKey: 'stepsOverhead',
            aiGuidanceKey: 'aiOverhead',
            tutorialImages: ['https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=400&auto=format&fit=crop']
        }
    ]
};

// Map levels to specific drills
export const LEVEL_DRILLS: Record<string, Drill[]> = {
    'NTRP 1.0': [
        DRILLS_DATA['Forehand'].find(d => d.id === 'fh_flat')!,
        DRILLS_DATA['Backhand'].find(d => d.id === 'bh_one')!,
        DRILLS_DATA['Backhand'].find(d => d.id === 'bh_two')!,
    ],
    'NTRP 2.0': [
        DRILLS_DATA['Forehand'].find(d => d.id === 'fh_topspin')!,
        DRILLS_DATA['Smash'].find(d => d.id === 'fh_smash')!,
        DRILLS_DATA['Backhand'].find(d => d.id === 'bh_topspin')!,
        DRILLS_DATA['Serve'].find(d => d.id === 'sv_flat')!,
        DRILLS_DATA['Serve'].find(d => d.id === 'sv_kick')!,
    ],
    'NTRP 3.0': [
        DRILLS_DATA['Volley'].find(d => d.id === 'vl_forehand')!,
        DRILLS_DATA['Forehand'].find(d => d.id === 'fh_slice')!,
        DRILLS_DATA['Volley'].find(d => d.id === 'vl_backhand')!,
        DRILLS_DATA['Backhand'].find(d => d.id === 'bh_slice')!,
    ]
};

export const MOCK_DEVICE: DeviceInfo = {
  name: "XTennis",
  batteryLevel: 85,
  firmwareVersion: "2.1.0",
  serialNumber: "SN-9988-ACE"
};

export const MOCK_PROFILE: UserProfile = {
  name: "Alex Court",
  level: "Intermediate",
  numericLevel: 3.5,
  totalSessions: 142,
  totalBalls: 15420,
  joinDate: "Nov 2023",
  totalHours: 48
};
