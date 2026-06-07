'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HabitGrid from '@/components/HabitGrid';
import OverallProgress from '@/components/OverallProgress.server';
import  WeeklyChart  from '@/components/WeeklyChart.server';
import TopHabits from '@/components/TopHabits';
import Header from '@/components/Header';
import { HabitWithProgress, User } from '@/types';
import { Plus, RefreshCw, Target, BarChart3, Calendar, Trophy, Zap, Users, Flame } from 'lucide-react';

const quickLinks = [
  { label: 'Goals',        href: '/goals',        icon: Calendar },
  { label: 'Achievements', href: '/achievements',  icon: Trophy },
  { label: 'Challenges',   href: '/challenges',    icon: Zap },
  { label: 'Analytics',    href: '/analytics',     icon: BarChart3 },
  { label: 'Social',       href: '/social',        icon: Users },
];

function getGreeting(name: string) {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return `${g}, ${name} 👋`;
}

interface HomeDashboardProps {
  user: User;
  initialHabits: HabitWithProgress[];
}

export function HomeDashboard({ user, initialHabits }: HomeDashboardProps) {
  const router = useRouter();
  const [habitsWithProgress, setHabitsWithProgress] = useState<HabitWithProgress[]>(initialHabits);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDayToggle = async (habitId: string, dayIndex: number) => {
    const habit = habitsWithProgress.find((h) => h.id === habitId);
    if (!habit) return;

    const idx = habitsWithProgress.findIndex((h) => h.id === habitId);
    if (idx === -1) return;

    const updated = [...habitsWithProgress];
    const h = { ...updated[idx], days: [...updated[idx].days] };
    const prev = h.days[dayIndex];
    h.days[dayIndex] = !prev;
    updated[idx] = h;
    setHabitsWithProgress(updated);

    try {
      await fetch('/api/habits/' + habitId + '/toggle', { method: 'POST' });
      router.refresh();
    } catch (err: any) {
      h.days[dayIndex] = prev;
      updated[idx] = { ...h };
      setHabitsWithProgress([...updated]);
      setError(err.message || 'Failed to toggle habit.');
      setTimeout(() => setError(null), 3500);
    }
  };

  const displayName = user?.firstName || user?.username || 'there';
  const habits = habitsWithProgress;
  const todayDone = habits.filter((h) => h.days[h.days.length - 1]).length;
  const todayTotal = habits.length;
  const todayPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;
  const maxStreak = Math.max(0, ...habits.map((h) => (h.stats?.currentStreak || 0)));

  return (
    <div className="min-h-screen bg-[#f8f9fb] mobile-page-padding">

      {/* ── Desktop header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm hidden sm:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Habit Tracker</h1>
                <p className="text-xs text-gray-500">Build better habits, one day at a time</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {habits.length > 0 && (
                <span className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-medium">
                  {habits.length} Active
                </span>
              )}
              <button onClick={handleRefresh} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Header />
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile header ── */}
      <header className="sm:hidden bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <span className="font-bold text-gray-900 text-[15px]">Habit Tracker</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-400 rounded-xl active:bg-gray-100 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Header />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 sm:py-8">

        {/* Error toast */}
        {error && (
          <div className="mx-4 sm:mx-0 mt-3 sm:mt-0 sm:mb-4 bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-3 animate-fade-in">
            <span className="text-red-500 flex-shrink-0">⚠️</span>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {habits.length === 0 && !error ? (
          /* ── Empty state ── */
          <div className="px-4 sm:px-0 pt-8">
            <div className="app-card p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <span className="text-4xl">📋</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No habits yet</h2>
              <p className="text-gray-500 mb-7 text-sm leading-relaxed max-w-xs mx-auto">
                Start building better habits today. Track your progress over 30 days.
              </p>
              <button
                onClick={() => router.push('/habits/new')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-200 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Create Your First Habit
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Mobile dashboard ── */}
            <div className="sm:hidden page-enter">

              {/* Greeting + today summary */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-[13px] text-gray-400 font-medium">{getGreeting(displayName)}</p>
                <h2 className="text-xl font-bold text-gray-900 mt-0.5">Today&apos;s Overview</h2>
              </div>

              {/* Today&apos;s summary card */}
              <div className="mx-4 mb-4">
                <div className="app-card p-4 bg-gradient-to-br from-blue-500 to-purple-600 border-0">
                  <div className="flex items-center justify-between">
                    {/* Ring progress */}
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                        <circle
                          cx="40" cy="40" r="32"
                          fill="none"
                          stroke="white"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 32}`}
                          strokeDashoffset={`${2 * Math.PI * 32 * (1 - todayPct / 100)}`}
                          className="transition-all duration-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-white font-bold text-lg leading-none">{todayPct}%</span>
                        <span className="text-white/70 text-[9px] font-medium">done</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 ml-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-xs">Completed</span>
                        <span className="text-white font-bold text-sm">{todayDone}/{todayTotal}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-xs">Best streak</span>
                        <span className="text-white font-bold text-sm flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-orange-300" />
                          {maxStreak} days
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-xs">Active habits</span>
                        <span className="text-white font-bold text-sm">{habits.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-700"
                        style={{ width: `${todayPct}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-[10px] mt-1.5">
                      {todayTotal - todayDone > 0
                        ? `${todayTotal - todayDone} habit${todayTotal - todayDone > 1 ? 's' : ''} remaining today`
                        : '🎉 All habits done for today!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="px-4 mb-4">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-4 px-4">
                  {quickLinks.map(({ label, href, icon: Icon }) => (
                    <button
                      key={href}
                      onClick={() => router.push(href)}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Today&apos;s habits */}
              <div className="px-4 mb-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-[15px]">Your Habits</h3>
                  <button
                    onClick={() => router.push('/habits/new')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-semibold active:scale-95 transition-transform shadow-sm shadow-blue-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
                <HabitGrid habits={habitsWithProgress} onDayToggle={handleDayToggle} />
              </div>
            </div>

            {/* ── Desktop dashboard ── */}
            <div className="hidden sm:block">
              {/* Quick links */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => router.push('/habits')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm text-sm flex-shrink-0"
                >
                  <Target className="w-3.5 h-3.5" />
                  Habits
                </button>
                {quickLinks.map(({ label, href, icon: Icon }) => (
                  <button
                    key={href}
                    onClick={() => router.push(href)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap text-sm flex-shrink-0"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1"><TopHabits habits={habitsWithProgress} /></div>
                <div className="lg:col-span-2"><OverallProgress habits={habitsWithProgress} /></div>
              </div>

              <div className="mb-8"><WeeklyChart habits={habitsWithProgress} /></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Your Habits</h2>
                  <button
                    onClick={() => router.push('/habits/new')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Habit
                  </button>
                </div>
                <HabitGrid habits={habitsWithProgress} onDayToggle={handleDayToggle} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Desktop FAB */}
      {habits.length > 0 && (
        <button
          onClick={() => router.push('/habits/new')}
          className="hidden sm:flex fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all items-center justify-center hover:scale-110"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Desktop footer */}
      <footer className="hidden sm:block bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 Smart Habit Tracker. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
