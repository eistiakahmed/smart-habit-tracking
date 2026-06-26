'use client';

import { useState, useSyncExternalStore } from 'react';
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
import { AddHabitFAB } from '@/components/AddHabitFAB';
import { calculateWeeklyProgress, formatLocalDate } from '@/lib/utils';
import { toggleHabitCompletion } from '@/lib/habit-mutations';

const quickLinks = [
  { label: 'Goals',        href: '/goals',        icon: Calendar,  color: 'text-sky-400',  glow: 'shadow-sky-500/10' },
  { label: 'Achievements', href: '/achievements',  icon: Trophy,    color: 'text-yellow-400', glow: 'shadow-yellow-500/10' },
  { label: 'Challenges',   href: '/challenges',    icon: Zap,       color: 'text-orange-400', glow: 'shadow-orange-500/10' },
  { label: 'Analytics',    href: '/analytics',     icon: BarChart3, color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  { label: 'Social',       href: '/social',        icon: Users,     color: 'text-purple-400',  glow: 'shadow-purple-500/10' },
];

const COPYRIGHT_YEAR = 2026;

function getGreeting(name: string, hour: number) {
  const g =
    hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 17
        ? 'Good afternoon'
        : hour >= 17 && hour < 21
          ? 'Good evening'
          : 'Good night';
  return `${g}, ${name} 👋`;
}

const subscribeToClientSnapshot = () => () => {};

interface HomeDashboardProps {
  user: User;
  initialHabits: HabitWithProgress[];
  serverTodayDate: string;
}

export function HomeDashboard({ user, initialHabits, serverTodayDate }: HomeDashboardProps) {
  const router = useRouter();
  const [habitsWithProgress, setHabitsWithProgress] = useState<HabitWithProgress[]>(initialHabits);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const displayName = user?.firstName || user?.username || 'there';
  const greeting = useSyncExternalStore(
    subscribeToClientSnapshot,
    () => getGreeting(displayName, new Date().getHours()),
    () => `Welcome back, ${displayName} 👋`
  );
  // Use serverTodayDate as the server snapshot so SSR and client initial render agree.
  // useSyncExternalStore will re-render with the client snapshot after hydration.
  const todayDate = useSyncExternalStore(
    subscribeToClientSnapshot,
    () => formatLocalDate(),
    () => serverTodayDate
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDayToggle = async (habitId: string, dayIndex: number) => {
    const habit = habitsWithProgress.find((h) => h.id === habitId);
    if (!habit) return;
    if (habit.days[dayIndex]) return;
    if (todayDate && habit.dayDates?.[dayIndex] !== todayDate) return;

    const idx = habitsWithProgress.findIndex((h) => h.id === habitId);
    if (idx === -1) return;

    const updated = [...habitsWithProgress];
    const h = { ...updated[idx], days: [...updated[idx].days] };
    const prev = h.days[dayIndex];
    h.days[dayIndex] = !prev;
    h.weeklyProgress = calculateWeeklyProgress(h.days);
    updated[idx] = h;
    setHabitsWithProgress(updated);

    try {
      const result = await toggleHabitCompletion(habitId);
      h.todayCompleted = result.todayCompleted;
      h.stats = h.stats
        ? { ...h.stats, currentStreak: result.streak }
        : { currentStreak: result.streak, longestStreak: 0, completionRate: 0, daysCompleted: 0, totalDays: 0 };
      updated[idx] = { ...h };
      setHabitsWithProgress([...updated]);
      router.refresh();
    } catch (err: unknown) {
      h.days[dayIndex] = prev;
      h.weeklyProgress = calculateWeeklyProgress(h.days);
      updated[idx] = { ...h };
      setHabitsWithProgress([...updated]);
      setError(err instanceof Error ? err.message : 'Failed to toggle habit.');
      setTimeout(() => setError(null), 3500);
    }
  };

  const habits = habitsWithProgress;
  const todayDone = habits.filter((h) => {
    const index = todayDate ? h.dayDates?.indexOf(todayDate) ?? -1 : -1;
    return index >= 0 ? h.days[index] : false;
  }).length;
  const todayTotal = habits.length;
  const todayPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;
  const maxStreak = Math.max(0, ...habits.map((h) => (h.stats?.currentStreak || 0)));

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] mobile-page-padding relative overflow-x-hidden font-sans app-screen flex flex-col">
      
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
      <header className="sm:hidden glass-header sticky top-0 z-50 border-b border-slate-900 shadow-md safe-area-top">
        <div className="mobile-container flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-purple-600 rounded-lg flex items-center justify-center border border-sky-400/10">
              <span className="text-white text-lg font-bold select-none">✓</span>
            </div>
            <span className="font-extrabold text-white text-[15px] tracking-tight">Habit Tracker</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              className="touch-target flex items-center justify-center text-slate-400 rounded-xl active:bg-slate-900 transition-colors cursor-pointer"
              type="button"
              aria-label="Refresh habits"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Header />
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8 sm:py-8 relative z-10">

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
            <div className="sm:hidden page-enter pb-safe relative mobile-container">
              {/* Decorative background grid block */}
              <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#0a0f1d] to-[#050a15] border-b border-slate-900/60 overflow-hidden z-0">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="absolute top-8 right-12 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl" />
              </div>

              <div className="relative z-10">
                {/* Header Section */}
                <div className="px-4 pt-5 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{greeting}</p>
                      <h1 className="text-white text-[1.55rem] leading-tight font-black tracking-tight">Daily Habit Tracker</h1>
                    </div>
                  </div>
                </div>

                {/* Today's Progress Card */}
                <div className="mx-4 mb-5">
                  <div className={`glass-panel tap-card rounded-3xl p-5 shadow-2xl border transition-all duration-300 relative overflow-hidden ${
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
                <div className="px-4 mb-6">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none native-scroll-x -mx-4 px-4">
                    {quickLinks.map(({ label, href, icon: Icon, color, glow }) => (
                      <button
                        key={href}
                        onClick={() => router.push(href)}
                        className="group flex flex-col items-center gap-1.5 shrink-0 w-15 cursor-pointer touch-target"
                        type="button"
                      >
                        <div className={`w-11 h-11 rounded-xl bg-slate-950/50 border border-slate-800 transition-all duration-200 flex items-center justify-center shadow-lg ${glow}`}>
                          <Icon className={`w-5.5 h-5.5 ${color}`} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors text-center">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Today's Habits */}
                <div className="px-4 mb-4">
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="font-bold text-white text-base tracking-tight">Today&apos;s Habits</h3>
                    <button
                      onClick={() => router.push('/habits/new')}
                      className="min-h-9 flex items-center gap-1 px-2.5 bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-lg text-[9px] font-bold tracking-wider uppercase active:scale-95 transition-transform shadow-[0_0_12px_rgba(56,189,248,0.15)] cursor-pointer"
                      type="button"
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
                        todayDate={todayDate}
                      />
                    ))}
                  </div>
                </div>

                {/* Mobile Quick Notepad */}
                <div className="px-4 mb-8">
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
                <HabitGrid habits={habitsWithProgress} onDayToggle={handleDayToggle} todayDate={todayDate} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Mobile FAB - with speech bubble */}
      <div className="">
        <AddHabitFAB />
      </div>

      {/* Desktop footer */}
      <footer className="hidden sm:block relative z-10 mt-auto">
        {/* Top shimmer line */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

        <div
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgba(8,13,25,0.98) 0%, rgba(3,7,18,1) 100%)' }}
        >
          <div className="relative max-w-7xl mx-auto px-8 lg:px-12 py-3">
            <div className="flex items-center justify-between gap-6">

              {/* Left — Brand */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                  <span className="text-white text-[10px] font-black leading-none">✓</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[11px] font-bold text-slate-300 tracking-tight">Smart Habit Tracker</span>
                  <span className="text-[9px] text-slate-600 font-medium mt-0.5 tracking-wide">Build better habits, daily</span>
                </div>
              </div>

              {/* Center — Developer credit */}
              <div className="flex flex-col items-center gap-1">
                <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                  Crafted by{' '}
                  <span className="text-slate-300 font-semibold">Eistiak Ahmed</span>
                </p>
                <p className="text-[10px] text-slate-700">© {COPYRIGHT_YEAR} · All rights reserved</p>
              </div>

              {/* Right — Social links */}
              <div className="flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/eistiak-ahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="group w-7 h-7 rounded-lg border border-slate-800/80 bg-slate-900/40 hover:border-sky-500/40 hover:bg-sky-500/10 flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                <a
                  href="https://github.com/eistiakahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="group w-7 h-7 rounded-lg border border-slate-800/80 bg-slate-900/40 hover:border-slate-500/40 hover:bg-slate-500/10 flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-200 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com/eistiakahmedmeraj"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="group w-7 h-7 rounded-lg border border-slate-800/80 bg-slate-900/40 hover:border-blue-500/40 hover:bg-blue-500/10 flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
