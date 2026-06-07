'use client';

import { useState } from 'react';
import { HabitWithProgress } from '@/types';
import { Home, Calendar, Trophy, User, Plus } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        {/* Sidebar */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gray-950/50 backdrop-blur-xl flex flex-col items-center py-6 gap-6 border-r border-gray-800">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-4">
            H
          </div>

          <nav className="flex-1 flex flex-col gap-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'home'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Home className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('trophy')}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'trophy'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Trophy className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <User className="w-5 h-5" />
            </button>
          </nav>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-medium">
            U
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-20 flex-1 p-6">
          {activeTab === 'home' && (
            <>
              {/* Greeting Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">{getGreeting()}</h1>
                <p className="text-gray-400">Let's check your daily progress</p>
              </div>

              {/* Progress Ring */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <svg width="160" height="160" className="transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      stroke="#1f2937"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{todayProgress}%</span>
                    <span className="text-xs text-gray-400 mt-1">completed</span>
                  </div>
                </div>
              </div>

              {/* Habits List */}
              <div className="space-y-3 mb-24">
                {habits.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>No habits yet</p>
                    <p className="text-sm mt-2">Tap + to create your first habit</p>
                  </div>
                ) : (
                  habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-gray-700/50 hover:border-purple-500/30 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl">
                        {getHabitIcon(habit.icon, habit.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{habit.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-orange-500 flex items-center gap-1 text-sm">
                            🔥 {habit.stats?.currentStreak || 0}
                          </span>
                          <span className="text-gray-500 text-sm">day streak</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleHabit(habit.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          habit.todayCompleted
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-transparent'
                            : 'border-gray-600 hover:border-purple-400'
                        }`}
                      >
                        {habit.todayCompleted && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Calendar view coming soon</p>
            </div>
          )}

          {activeTab === 'trophy' && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Achievements coming soon</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Profile coming soon</p>
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={onAddHabit}
          className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
