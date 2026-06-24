'use client';

import { useState, useSyncExternalStore } from 'react';
import { HabitWithProgress } from '@/types';
import { Calendar, Trophy, User, Plus, Flame } from 'lucide-react';

interface MobileHabitTrackerProps {
  habits: HabitWithProgress[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

const subscribeToClientSnapshot = () => () => {};

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

export default function MobileHabitTracker({ habits, onToggleHabit, onAddHabit }: MobileHabitTrackerProps) {
  const [activeTab] = useState('home');
  const greeting = useSyncExternalStore(
    subscribeToClientSnapshot,
    () => getGreeting(new Date().getHours()),
    () => 'Welcome back'
  );

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
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] font-sans overflow-x-hidden relative">
      {/* Glow decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-purple-600/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[250px] h-[250px] rounded-full bg-sky-600/5 blur-[80px] pointer-events-none" />

      <div className="max-w-lg mx-auto min-h-screen flex flex-col relative z-10">

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 page-enter">
          {activeTab === 'home' && (
            <>
              {/* Greeting Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white tracking-tight">{greeting}</h1>
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
                      className="glass-panel rounded-2xl p-3.5 flex items-center gap-3 border border-slate-800/80 hover:border-slate-700 transition-all hover:bg-slate-900/30 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-950/50 flex items-center justify-center text-xl flex-shrink-0 border border-slate-900">
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
                        onClick={() => {
                          if (!habit.todayCompleted) onToggleHabit(habit.id);
                        }}
                        disabled={habit.todayCompleted}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                          habit.todayCompleted
                            ? 'bg-linear-to-r from-sky-400 to-purple-600 border-transparent shadow-[0_0_8px_rgba(56,189,248,0.3)] cursor-default'
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                        style={{ touchAction: 'manipulation', minWidth: '36px', minHeight: '36px' }}
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
          className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border border-sky-400/20 shadow-sky-500/10 z-30"
          style={{ touchAction: 'manipulation' }}
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
