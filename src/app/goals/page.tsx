'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function GoalsListPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'PAUSED'>('all');

  useEffect(() => {
    fetchGoals();
    fetchStats();
  }, [filter]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await api.getGoals({
        status: filter === 'all' ? undefined : filter,
        limit: 50,
      });
      setGoals(response.goals);
    } catch (error: any) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.getGoalStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDelete = async (goalId: string, goalTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${goalTitle}"?`)) {
      return;
    }

    try {
      await api.deleteGoal(goalId);
      setGoals(goals.filter((g) => g.id !== goalId));
      fetchStats();
    } catch (error: any) {
      alert('Failed to delete goal: ' + (error.message || 'Unknown error'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-sky-500/10 border border-sky-500/20 text-sky-400';
      case 'COMPLETED': return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'FAILED': return 'bg-red-500/10 border border-red-500/20 text-red-400';
      case 'PAUSED': return 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10b981'; // Green
    if (percentage >= 75) return '#0ea5e9';  // Sky
    if (percentage >= 50) return '#f59e0b';  // Amber
    if (percentage >= 25) return '#f97316';  // Orange
    return '#ef4444';                       // Red
  };

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] mobile-page-padding relative overflow-x-hidden font-sans">
      
      {/* Ambient glowing effect */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <header className="glass-header sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()} 
                className="p-2 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">My Goals</h1>
            </div>
            <button
              onClick={() => router.push('/goals/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-400 to-purple-600 text-white rounded-xl font-bold transition-all text-xs tracking-wider uppercase shadow-[0_4px_12px_rgba(56,189,248,0.15)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Goal</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10 page-enter">
        {stats && (
          <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
            {[
              { label: 'Total', value: stats.total || 0, color: 'text-slate-200', border: 'border-slate-800/80', bg: 'bg-slate-900/30' },
              { label: 'Active', value: stats.active || 0, color: 'text-sky-400', border: 'border-sky-500/25', bg: 'bg-sky-500/8' },
              { label: 'Done', value: stats.completed || 0, color: 'text-emerald-400', border: 'border-emerald-500/25', bg: 'bg-emerald-500/8' },
              { label: 'Failed', value: stats.failed || 0, color: 'text-red-400', border: 'border-red-500/25', bg: 'bg-red-500/8' },
              { label: 'Paused', value: stats.paused || 0, color: 'text-yellow-400', border: 'border-yellow-500/25', bg: 'bg-yellow-500/8' },
            ].map(({ label, value, color, border, bg }) => (
              <div key={label} className={`glass-panel border ${border} ${bg} rounded-2xl p-3 sm:p-4 text-center hover:scale-102 transition-transform duration-200`}>
                <div className={`text-xl sm:text-2xl font-black ${color}`}>{value}</div>
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2.5 mb-6 overflow-x-auto pb-1.5 scrollbar-none">
          {(['all', 'ACTIVE', 'COMPLETED', 'FAILED', 'PAUSED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-bold transition-all text-xs tracking-wider uppercase whitespace-nowrap flex-shrink-0 cursor-pointer ${
                filter === status 
                  ? 'bg-slate-800 border border-slate-700 text-white shadow-md' 
                  : 'bg-slate-950/40 text-slate-400 border border-slate-900 hover:border-slate-800'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
          </div>
        ) : goals.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-12 text-center max-w-md mx-auto shadow-2xl">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_12px_rgba(255,255,255,0.02)]">
              <TrendingUp className="w-8 h-8 text-slate-500 opacity-40" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">No goals found</h2>
            <p className="text-xs text-slate-400 font-medium mb-6">Track target goals side by side with habits to boost productivity!</p>
            <button
              onClick={() => router.push('/goals/new')}
              className="inline-flex items-center gap-2 px-6 py-3.5 btn-glow bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-2xl">
            <div className="grid gap-5">
              {goals.map((goal) => {
                const progress = goal.progress || 0;
                const barColor = getProgressColor(progress);
                return (
                  <div key={goal.id} className="border border-slate-850 bg-slate-950/20 rounded-2xl p-4.5 hover:bg-slate-900/20 hover:border-slate-800 transition-all group">
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">{goal.title}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${getStatusColor(goal.status)}`}>
                            {goal.status.toLowerCase()}
                          </span>
                        </div>
                        {goal.description && (
                          <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{goal.description}</p>
                        )}
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-2">{goal.category}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => router.push(`/goals/${goal.id}/edit`)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id, goal.title)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3.5">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                        <span className="text-slate-400">
                          {goal.currentValue || 0} / {goal.targetValue} {goal.unit || ''}
                        </span>
                        <span style={{ color: barColor }}>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-950/60 border border-slate-900 rounded-full overflow-hidden p-[1px]">
                        <div
                          className="h-full rounded-full transition-all duration-500 shadow-inner"
                          style={{ 
                            width: `${Math.min(100, progress)}%`,
                            backgroundColor: barColor,
                            boxShadow: `0 0 10px ${barColor}40`
                          }}
                        />
                      </div>
                    </div>

                    {goal.status === 'ACTIVE' && (
                      <button
                        onClick={() => router.push(`/goals/${goal.id}/progress`)}
                        className="text-xs text-sky-400 hover:text-sky-300 font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Update Progress →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
