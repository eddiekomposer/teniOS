import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronLeft, Calendar, Clock, BarChart3, Filter, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Language, TrainingHistoryItem, TrainingType } from '../types';
import { TRANSLATIONS } from '../translations';
import { MOCK_PROFILE } from '../constants';

interface HistoryViewProps {
  onBack: () => void;
  onViewReport: (item: TrainingHistoryItem) => void;
  lang: Language;
  history: TrainingHistoryItem[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack, onViewReport, lang, history }) => {
  const [activeFilter, setActiveFilter] = useState<TrainingType | 'All'>('All');
  const t = TRANSLATIONS[lang];

  const filteredHistory = history.filter(item => activeFilter === 'All' || item.type === activeFilter);
  const hasHistory = filteredHistory.length > 0;

  // Prepare chart data (reverse to show chronological order left to right)
  const chartData = [...filteredHistory].reverse().map(item => ({
    name: item.date,
    speed: item.bestSpeed
  }));

  return (
    <div className="h-screen flex flex-col pt-16 bg-black">
      {/* Sticky Header */}
      <div className="shrink-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            aria-label={t.backToHome}
          >
            <ChevronLeft size={28} className="md:w-8 md:h-8" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{t.history}</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pb-32">
        <div className="max-w-4xl mx-auto pt-6 space-y-6">
          
          {/* Stats Grid moved from Dashboard */}
          <div className="grid grid-cols-3 gap-3 mb-2">
            <div className="bg-surface-800 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
                <Clock size={20} className="text-neon-400 mb-2" />
                <div className="text-white font-bold text-lg leading-none mb-1">{MOCK_PROFILE.totalHours}h</div>
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{t.trainingTime}</div>
            </div>
            <div className="bg-surface-800 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
                <Calendar size={20} className="text-neon-400 mb-2" />
                <div className="text-white font-bold text-lg leading-none mb-1">{MOCK_PROFILE.joinDate}</div>
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{t.since}</div>
            </div>
            <div className="bg-surface-800 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
                <CheckCircle size={20} className="text-neon-400 mb-2" />
                <div className="text-white font-bold text-lg leading-none mb-1">{(MOCK_PROFILE.totalBalls / 1000).toFixed(1)}k</div>
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{t.totalBalls}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
             <div className="flex items-center text-white/40 mr-2 shrink-0">
                 <Filter size={16} className="mr-2" />
                 <span className="text-xs font-bold uppercase tracking-wider">Filter</span>
             </div>
             {['All', 'Forehand', 'Backhand', 'Serve', 'Volley', 'Smash'].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type as TrainingType | 'All')}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                    activeFilter === type 
                      ? 'bg-neon-500 text-black border-neon-500' 
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {type === 'All' ? t.all : (t[type as keyof typeof t] || type)}
                </button>
              ))}
          </div>

          <AnimatePresence mode="wait">
             <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {hasHistory ? (
                  <>
                    {/* Performance Trend Graph */}
                    <section className="bg-surface-800 rounded-2xl p-4 md:p-6 border border-white/5 h-80 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                      <h3 className="text-white font-bold mb-6 flex items-center relative z-10">
                        <Activity className="mr-3 text-neon-400" size={20} /> {t.performanceTrend}
                      </h3>
                        <div className="w-full h-[calc(100%-2rem)] relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="speed" stroke="#88d600" strokeWidth={3} dot={{ fill: '#88d600', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* History List */}
                    <section className="space-y-4">
                      <h3 className="text-white/40 font-bold uppercase tracking-widest text-xs px-2 flex items-center">
                         <Calendar className="mr-2" size={14} /> Sessions
                      </h3>

                      <div className="space-y-3">
                        {filteredHistory.map((item) => (
                          <div 
                            key={item.id} 
                            onClick={() => onViewReport(item)}
                            className="bg-surface-800 p-4 md:p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group hover:bg-white/5 active:scale-[0.99] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-neon-400 group-hover:text-black group-hover:bg-neon-500 transition-colors">
                                    <BarChart3 size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-white font-bold text-lg">{t[item.type as keyof typeof t] || item.type}</h4>
                                        <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{item.type}</span>
                                    </div>
                                    <div className="text-xs text-white/40 font-medium">{item.date}</div>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <div className="text-neon-400 font-mono font-bold text-xl">{item.accuracy}%</div>
                                <div className="flex items-center justify-end text-white/40 text-xs gap-1">
                                    <Clock size={10} /> {item.duration}
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                ) : (
                  // Unified Empty State
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Activity size={40} className="text-white/20" />
                    </div>
                    <p className="text-white/60 font-bold uppercase tracking-widest text-lg">{t.noData}</p>
                    <p className="text-white/30 text-sm mt-2">{t.startSessionTip}</p>
                  </div>
                )}
             </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;