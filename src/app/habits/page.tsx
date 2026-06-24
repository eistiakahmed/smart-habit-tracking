'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ArrowLeft, CheckCircle, XCircle, Loader2, Target, Flame, TrendingUp, Calendar, Award, Zap } from 'lucide-react';
import { Habit } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function HabitsListPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchHabits();
  }, [authLoading, isAuthenticated, filter]);

  const fetchHabits = async () => {
    try {
      setDataLoading(true);
      const isActive = filter === 'all' ? undefined : filter === 'active';
      const response = await api.getHabits({ isActive, limit: 50 });
      setHabits(response.habits);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (habitId: string, habitTitle: string) => {
    if (!confirm(`Delete "${habitTitle}"?`)) return;
    try {
      await api.deleteHabit(habitId);
      setHabits(habits.filter((h) => h.id !== habitId));
    } catch (error: any) {
      alert('Failed to delete: ' + (error.message || 'Unknown error'));
    }
  };

  const handleToggleActive = async (habitId: string, currentState: boolean) => {
    try {
      await api.updateHabit(habitId, { isActive: !currentState });
      setHabits(habits.map((h) => h.id === habitId ? { ...h, isActive: !currentState } : h));
    } catch (error: any) {
      alert('Failed to update: ' + (error.message || 'Unknown error'));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'from-emerald-400 to-green-500';
      case 'MEDIUM': return 'from-amber-400 to-orange-500';
      case 'HARD': return 'from-rose-400 to-red-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'MEDIUM': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'HARD': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white mobile-page-padding relative overflow-hidden">

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-sky-500/5 blur-[80px]" />
      </div>

      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="group p-2.5 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Your Habits
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage your daily routine</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/habits/new')}
              className="group relative px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Habit</span>
                <span className="sm:hidden">New</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label="Total Habits"
            value={habits.length}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<CheckCircle className="w-4 h-4" />}
            label="Active"
            value={habits.filter(h => h.isActive).length}
            color="from-emerald-500 to-green-500"
          />
          <StatCard
            icon={<Flame className="w-4 h-4" />}
            label="Avg Streak"
            value={Math.round(habits.reduce((acc, h) => acc + (h.stats?.currentStreak || 0), 0) / Math.max(habits.length, 1))}
            color="from-orange-500 to-amber-500"
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Completion"
            value={`${Math.round(habits.reduce((acc, h) => acc + (h.stats?.completionRate || 0), 0) / Math.max(habits.length, 1))}%`}
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Premium Filter Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
          {(['active', 'inactive', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative px-5 py-2.5 rounded-xl font-semibold transition-all text-sm capitalize cursor-pointer ${
                filter === f
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {f === 'all' ? 'All Habits' : `${f} Habits`}
              {filter === f && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f === 'all' ? 'All Habits' : `${f} Habits`}</span>
            </button>
          ))}
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <Loader2 className="animate-spin h-10 w-10 text-sky-500" />
              <div className="absolute inset-0 animate-ping bg-sky-500/20 rounded-full" />
            </div>
          </div>
        ) : habits.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-slate-800/50 backdrop-blur-xl p-12 text-center max-w-lg mx-auto shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-sky-500/10 to-blue-600/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Target className="w-10 h-10 text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">No habits found</h2>
              <p className="text-sm text-slate-400 mb-8 max-w-sm mx-auto">
                {filter === 'active' ? "You don't have any active habits at the moment."
                  : filter === 'inactive' ? "You don't have any paused/inactive habits."
                  : "Start building your daily routine by creating your first habit."}
              </p>
              <button
                onClick={() => router.push('/habits/new')}
                className="group relative px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>Create First Habit</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />

                <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 rounded-3xl p-5 sm:p-6 hover:border-slate-700/50 transition-all shadow-xl hover:shadow-2xl backdrop-blur-xl">
                  {/* Mobile View */}
                  <div className="sm:hidden">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border shadow-lg relative overflow-hidden"
                        style={{
                          backgroundColor: habit.color + '20',
                          borderColor: habit.color + '30'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        {habit.icon || '🎯'}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-base mb-1 truncate group-hover:text-sky-400 transition-colors">{habit.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {habit.category}
                              </span>
                              <span className={`px-2 py-0.5 rounded-lg border ${getDifficultyBadge(habit.difficulty)} text-[10px] font-bold uppercase tracking-wider`}>
                                {habit.difficulty}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => router.push(`/habits/${habit.id}/edit`)}
                              className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 rounded-xl transition-all cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(habit.id, habit.title)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                              <Calendar className="w-3 h-3" />
                              <span>Progress</span>
                            </div>
                            <div className="flex items-end gap-1">
                              <span className="text-2xl font-bold text-white">{Math.round(habit.stats?.completionRate || 0)}%</span>
                            </div>
                            <div className="mt-2 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                                style={{ width: `${habit.stats?.completionRate || 0}%` }}
                              />
                            </div>
                          </div>
                          <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                              <Flame className="w-3 h-3" />
                              <span>Streak</span>
                            </div>
                            <div className="flex items-end gap-1">
                              <span className="text-2xl font-bold text-orange-400">{habit.stats?.currentStreak || 0}</span>
                              <span className="text-xs text-slate-500 mb-1">days</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(habit.id, habit.isActive)}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider border cursor-pointer transition-all flex items-center justify-center gap-2 ${
                              habit.isActive
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            {habit.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {habit.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-6">
                      {/* Icon */}
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border shadow-xl flex-shrink-0 relative overflow-hidden"
                        style={{
                          backgroundColor: habit.color + '20',
                          borderColor: habit.color + '30'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        {habit.icon || '🎯'}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-sky-400 transition-colors">{habit.title}</h3>
                            {habit.description && (
                              <p className="text-sm text-slate-400 line-clamp-1 mb-2">{habit.description}</p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                                {habit.category}
                              </span>
                              <span className={`px-3 py-1 rounded-lg border ${getDifficultyBadge(habit.difficulty)} text-xs font-bold uppercase tracking-wider`}>
                                {habit.difficulty}
                              </span>
                              <span className="px-3 py-1 rounded-lg bg-slate-800/30 border border-slate-700/30 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                {habit.frequency}
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex gap-6">
                            <div className="text-center">
                              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 justify-center">
                                <Calendar className="w-3 h-3" />
                                <span>Progress</span>
                              </div>
                              <div className="text-2xl font-bold text-white">{Math.round(habit.stats?.completionRate || 0)}%</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 justify-center">
                                <Flame className="w-3 h-3" />
                                <span>Streak</span>
                              </div>
                              <div className="text-2xl font-bold text-orange-400">{habit.stats?.currentStreak || 0}</div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
                            style={{ width: `${habit.stats?.completionRate || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(habit.id, habit.isActive)}
                          className={`px-4 py-2 rounded-xl font-semibold text-xs uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-2 ${
                            habit.isActive
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                            }`}
                        >
                          {habit.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {habit.isActive ? 'Active' : 'Paused'}
                        </button>
                        <button
                          onClick={() => router.push(`/habits/${habit.id}/edit`)}
                          className="p-2.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 rounded-xl transition-all cursor-pointer"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(habit.id, habit.title)}
                          className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => router.push('/habits/new')}
        className="sm:hidden fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full shadow-2xl shadow-sky-500/50 flex items-center justify-center active:scale-95 transition-all cursor-pointer z-50 border border-sky-400/30"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 blur-xl opacity-60" />
        <Plus className="w-6 h-6 relative" />
      </button>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 rounded-2xl p-4 overflow-hidden backdrop-blur-xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
      <div className="relative">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
      </div>
    </div>
  );
}