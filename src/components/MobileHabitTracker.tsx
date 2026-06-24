'use client';

import { useState } from 'react';
import { HabitWithProgress } from '@/types';
import { Home, Calendar, Trophy, User, Plus, Flame } from 'lucide-react';

interface MobileHabitTrackerProps {
  habits: HabitWithProgress[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

export default function MobileHabitTracker({ habits, onToggleHabit, onAddHabit }: MobileHabitTrackerProps) {
  const [activeTab, setActiveTab] = useState('home');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayProgress = habits.length > 0
    ? Math.round((habits.filter(h => h.todayCompleted).length / habits.length) * 100)
    : 0;

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (todayProgress / 100) * circumference;

  const habitIcons: { [key: string]: string } = {
    meditation: '🧘',
    reading: '📚',
    water: '💧',
    'no-junk-food': '🥗',
    exercise: '💪',
    'default': '✓'
  };

  const getHabitIcon = (icon?: string, category?: string) => {
    if (icon && habitIcons[icon]) return habitIcons[icon];
    return habitIcons[category?.toLowerCase() || ''] || habitIcons['default'];
  };

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] font-sans overflow-hidden relative">
      {/* Glow decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-purple-600/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[250px] h-[250px] rounded-full bg-sky-600/5 blur-[80px] pointer-events-none" />

      <div className="max-w-md mx-auto min-h-screen flex flex-col relative z-10">
        
        {/* Sidebar Nav */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center py-6 gap-6 border-r border-slate-900/60 z-20">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-purple-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-4 border border-sky-400/20 shadow-[0_0_12px_rgba(56,189,248,0.15)] select-none">
            ✓
          </div>

          <nav className="flex-1 flex flex-col gap-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]'
                  : 'text-slate-500 hover:text-white hover:bg-slate-900/40 border border-transparent'
              }`}
            >
              <Home className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]'
                  : 'text-slate-500 hover:text-white hover:bg-slate-900/40 border border-transparent'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('trophy')}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === 'trophy'
                  ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]'
                  : 'text-slate-500 hover:text-white hover:bg-slate-900/40 border border-transparent'
              }`}
            >
              <Trophy className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]'
                  : 'text-slate-500 hover:text-white hover:bg-slate-900/40 border border-transparent'
              }`}
            >
              <User className="w-5 h-5" />
            </button>
          </nav>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center text-white font-bold text-xs border border-slate-700 shadow-sm font-sans select-none">
            U
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-20 flex-1 p-6 page-enter">
          {activeTab === 'home' && (
            <>
              {/* Greeting Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white tracking-tight">{getGreeting()}</h1>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Let&apos;s check your daily progress</p>
              </div>

              {/* Progress Ring */}
              <div className="flex justify-center mb-8 bg-slate-950/20 border border-slate-900 rounded-3xl p-5 shadow-inner">
                <div className="relative">
                  <svg width="160" height="160" className="transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      stroke="url(#gradient)"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-white">{todayProgress}%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">completed</span>
                  </div>
                </div>
              </div>

              {/* Habits List */}
              <div className="space-y-3.5 mb-24">
                {habits.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 glass-panel rounded-2xl border border-slate-800">
                    <p className="font-semibold text-sm">No habits today</p>
                    <p className="text-xs text-slate-600 mt-1">Tap + to create your first habit</p>
                  </div>
                ) : (
                  habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="glass-panel rounded-2xl p-4 flex items-center gap-4 border border-slate-800/80 hover:border-slate-700 transition-all hover:bg-slate-900/30 group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-950/50 flex items-center justify-center text-2xl flex-shrink-0 border border-slate-900">
                        {getHabitIcon(habit.icon, habit.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-200 text-[14px] truncate group-hover:text-white transition-colors">{habit.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1 font-semibold">
                          <span className="text-orange-400 flex items-center gap-0.5 text-xs bg-orange-500/10 px-1.5 py-0.5 rounded-md border border-orange-500/20">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            {habit.stats?.currentStreak || 0}d
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleHabit(habit.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                          habit.todayCompleted
                            ? 'bg-gradient-to-r from-sky-400 to-purple-600 border-transparent shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {habit.todayCompleted && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'calendar' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 glass-panel border border-slate-800 rounded-2xl p-6">
              <Calendar className="w-12 h-12 mb-3 text-sky-400/50" />
              <p className="text-sm font-semibold text-slate-400">Calendar Overview</p>
              <p className="text-xs text-slate-600 mt-1">Syncing with dashboard data</p>
            </div>
          )}

          {activeTab === 'trophy' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 glass-panel border border-slate-800 rounded-2xl p-6">
              <Trophy className="w-12 h-12 mb-3 text-yellow-400/50" />
              <p className="text-sm font-semibold text-slate-400">Achievements Vault</p>
              <p className="text-xs text-slate-600 mt-1">Navigate to Achievements page to view</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 glass-panel border border-slate-800 rounded-2xl p-6">
              <User className="w-12 h-12 mb-3 text-purple-400/50" />
              <p className="text-sm font-semibold text-slate-400">User Profile Panel</p>
              <p className="text-xs text-slate-600 mt-1">Access settings in header dropdown</p>
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={onAddHabit}
          className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border border-sky-400/20 shadow-sky-500/10 z-30"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
