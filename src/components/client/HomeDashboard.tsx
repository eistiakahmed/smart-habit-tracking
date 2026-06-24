'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HabitGrid from '@/components/HabitGrid';
import MobileHabitCard from '@/components/MobileHabitCard';
import OverallProgress from '@/components/OverallProgress.server';
import WeeklyChart from '@/components/WeeklyChart.server';
import TopHabits from '@/components/TopHabits';
import Header from '@/components/Header';
import QuickNotepad from '@/components/QuickNotepad';
import { HabitWithProgress, User } from '@/types';
import { Plus, RefreshCw, Target, BarChart3, Calendar, Trophy, Zap, Users, Flame } from 'lucide-react';

const quickLinks = [
  { label: 'Goals',        href: '/goals',        icon: Calendar,  color: 'text-sky-400',  glow: 'shadow-sky-500/10' },
  { label: 'Achievements', href: '/achievements',  icon: Trophy,    color: 'text-yellow-400', glow: 'shadow-yellow-500/10' },
  { label: 'Challenges',   href: '/challenges',    icon: Zap,       color: 'text-orange-400', glow: 'shadow-orange-500/10' },
  { label: 'Analytics',    href: '/analytics',     icon: BarChart3, color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  { label: 'Social',       href: '/social',        icon: Users,     color: 'text-purple-400',  glow: 'shadow-purple-500/10' },
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
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] mobile-page-padding relative overflow-x-hidden font-sans">
      
      {/* Decorative meshes */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-10%] w-[35%] h-[35%] rounded-full bg-purple-600/5 blur-[100px] pointer-events-none z-0" />

      {/* ── Desktop header ── */}
      <header className="glass-header sticky top-0 z-50 shadow-lg shadow-black/10 hidden sm:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl flex items-center justify-center border border-sky-400/20 shadow-[0_0_16px_rgba(56,189,248,0.2)]">
                <span className="text-white text-2xl font-bold font-sans select-none">✓</span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white">Smart Habit Tracker</h1>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Build better habits, daily</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {habits.length > 0 && (
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                  {habits.length} Active
                </span>
              )}
              <button 
                onClick={handleRefresh} 
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Header />
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile header ── */}
      <header className="sm:hidden glass-header sticky top-0 z-50 border-b border-slate-900 shadow-md">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-purple-600 rounded-lg flex items-center justify-center border border-sky-400/10">
              <span className="text-white text-lg font-bold select-none">✓</span>
            </div>
            <span className="font-extrabold text-white text-[15px] tracking-tight">Habit Tracker</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              className="p-2 text-slate-400 rounded-xl active:bg-slate-900 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Header />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 sm:py-8 relative z-10">

        {/* Error toast */}
        {error && (
          <div className="mx-4 sm:mx-0 mt-3 sm:mt-0 sm:mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <span className="text-red-400 flex-shrink-0 text-lg">⚠️</span>
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {habits.length === 0 && !error ? (
          /* ── Empty state ── */
          <div className="px-4 sm:px-0 pt-8">
            <div className="glass-panel p-10 text-center rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden max-w-xl mx-auto">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl" />
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500/10 to-purple-500/10 border border-sky-500/15 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-4xl select-none">📋</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">No habits tracked yet</h2>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed max-w-sm mx-auto font-medium">
                Start building better routines today. Set your custom habit goals and track them over a 30-day journey.
              </p>
              <button
                onClick={() => router.push('/habits/new')}
                className="inline-flex items-center gap-2 px-7 py-3.5 btn-glow bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-sky-500/10 active:scale-95 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Create Your First Habit
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Mobile dashboard ── */}
            <div className="sm:hidden page-enter pb-safe relative">
              {/* Decorative background grid block */}
              <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#0a0f1d] to-[#050a15] border-b border-slate-900/60 overflow-hidden z-0">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="absolute top-8 right-12 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl" />
              </div>

              <div className="relative z-10">
                {/* Header Section */}
                <div className="px-5 pt-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{getGreeting(displayName)}</p>
                      <h1 className="text-white text-2xl font-black tracking-tight">Daily Habit Tracker</h1>
                    </div>
                  </div>
                </div>

                {/* Today's Progress Card */}
                <div className="mx-5 mb-5">
                  <div className={`glass-panel rounded-3xl p-5 shadow-2xl border transition-all duration-300 relative overflow-hidden ${
                    todayPct === 100 
                      ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/20 to-slate-950/90 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                      : 'border-slate-800/80 bg-slate-950/30'
                  }`}>
                    {todayPct === 100 && (
                      <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
                        <div className="absolute top-2 right-4 text-5xl">🎉</div>
                        <div className="absolute bottom-2 left-4 text-4xl">⭐</div>
                        <div className="absolute top-1/2 right-12 text-3xl">✨</div>
                      </div>
                    )}
                    
                    <div>
                      {todayPct === 100 ? (
                        <div className="text-center py-3">
                          <div className="text-5xl mb-2.5 animate-bounce">🏆</div>
                          <h3 className="text-white text-2xl font-black tracking-tight mb-1">Perfect Day!</h3>
                          <p className="text-slate-300 text-xs font-medium">You crushed all your habits today!</p>
                          <div className="mt-5 flex justify-center gap-6">
                            <div className="text-center">
                              <p className="text-emerald-400 text-3xl font-black">{todayDone}</p>
                              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">Completed</p>
                            </div>
                            <div className="text-center">
                              <p className="text-orange-400 text-3xl font-black flex items-center justify-center gap-1">
                                <Flame className="w-5 h-5 fill-current" />
                                {maxStreak}
                              </p>
                              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">Day Streak</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          {/* Circular Progress */}
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 relative">
                              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                <defs>
                                  <linearGradient id="progGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#0ea5e9" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                  </linearGradient>
                                </defs>
                                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6.5" />
                                <circle
                                  cx="40" cy="40" r="32"
                                  fill="none"
                                  stroke="url(#progGlow)"
                                  strokeWidth="6.5"
                                  strokeLinecap="round"
                                  strokeDasharray={`${2 * Math.PI * 32}`}
                                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - todayPct / 100)}`}
                                  className="transition-all duration-700"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-black text-white">{todayPct}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex-1 ml-5">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center bg-slate-950/40 p-2 rounded-xl border border-slate-900">
                                <p className="text-base font-black text-white">{todayDone}</p>
                                <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Done</p>
                              </div>
                              <div className="text-center bg-slate-950/40 p-2 rounded-xl border border-slate-900">
                                <p className="text-base font-black text-white">{todayTotal}</p>
                                <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Total</p>
                              </div>
                              <div className="text-center bg-slate-950/40 p-2 rounded-xl border border-slate-900">
                                <p className="text-base font-black text-orange-400 flex items-center justify-center gap-0.5">
                                  <Flame className="w-3.5 h-3.5 fill-current" />
                                  {maxStreak}
                                </p>
                                <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Streak</p>
                              </div>
                              <div className="text-center bg-slate-950/40 p-2 rounded-xl border border-slate-900">
                                <p className="text-base font-black text-sky-400">{habits.length}</p>
                                <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Active</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="px-5 mb-6">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-5 px-5">
                    {quickLinks.map(({ label, href, icon: Icon, color, glow }) => (
                      <button
                        key={href}
                        onClick={() => router.push(href)}
                        className="group flex flex-col items-center gap-2 shrink-0 w-16 cursor-pointer"
                      >
                        <div className={`w-13 h-13 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center justify-center shadow-lg ${glow}`}>
                          <Icon className={`w-5.5 h-5.5 ${color}`} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors text-center">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Today's Habits */}
                <div className="px-5 mb-4">
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="font-bold text-white text-base tracking-tight">Today&apos;s Habits</h3>
                    <button
                      onClick={() => router.push('/habits/new')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase active:scale-95 transition-transform shadow-[0_0_12px_rgba(56,189,248,0.15)] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Habit
                    </button>
                  </div>
                  <div className="space-y-3">
                    {habitsWithProgress.map((habit) => (
                      <MobileHabitCard
                        key={habit.id}
                        habit={habit}
                        onDayToggle={handleDayToggle}
                        disabled={refreshing}
                      />
                    ))}
                  </div>
                </div>

                {/* Mobile Quick Notepad */}
                <div className="px-5 mb-8">
                  <QuickNotepad />
                </div>
              </div>
            </div>

            {/* ── Desktop dashboard ── */}
            <div className="hidden sm:block page-enter">
              {/* Quick links banner */}
              <div className="flex gap-2.5 mb-8 overflow-x-auto pb-1.5 scrollbar-thin">
                <button
                  onClick={() => router.push('/habits')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-xl font-bold hover:opacity-95 transition-opacity whitespace-nowrap shadow-md text-xs tracking-wide uppercase flex-shrink-0 cursor-pointer shadow-sky-500/10"
                >
                  <Target className="w-3.5 h-3.5" />
                  Habit Manager
                </button>
                {quickLinks.map(({ label, href, icon: Icon, color }) => (
                  <button
                    key={href}
                    onClick={() => router.push(href)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/60 hover:bg-slate-800/40 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition-all whitespace-nowrap text-xs tracking-wide uppercase flex-shrink-0 cursor-pointer"
                  >
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <TopHabits habits={habitsWithProgress} />
                  <QuickNotepad />
                </div>
                <div className="lg:col-span-2">
                  <OverallProgress habits={habitsWithProgress} />
                </div>
              </div>

              <div className="mb-8"><WeeklyChart habits={habitsWithProgress} /></div>

              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white tracking-tight">Your Habits</h2>
                  <button
                    onClick={() => router.push('/habits/new')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-xl font-bold hover:opacity-95 transition-all text-xs tracking-wider uppercase shadow-[0_4px_12px_rgba(56,189,248,0.15)] cursor-pointer"
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
          className="hidden sm:flex fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all items-center justify-center hover:scale-110 border border-sky-400/20 active:scale-95 cursor-pointer shadow-sky-500/10 z-50"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Desktop footer */}
      <footer className="hidden sm:block bg-slate-950 border-t border-slate-900 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-slate-500 uppercase tracking-widest font-bold">
            © 2026 Smart Habit Tracker. Redesigned with premium Glassmorphic UI.
          </p>
        </div>
      </footer>
    </div>
  );
}
