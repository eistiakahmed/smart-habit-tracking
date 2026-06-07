'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, Edit, Trash2, ArrowLeft } from 'lucide-react';
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
      case 'ACTIVE': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] mobile-page-padding">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Goals</h1>
            </div>
            <button
              onClick={() => router.push('/goals/new')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Goal</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {stats && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-5 sm:mb-8">
            {[
              { label: 'Total', value: stats.total || 0, color: 'text-gray-900' },
              { label: 'Active', value: stats.active || 0, color: 'text-blue-600' },
              { label: 'Done', value: stats.completed || 0, color: 'text-green-600' },
              { label: 'Failed', value: stats.failed || 0, color: 'text-red-600' },
              { label: 'Paused', value: stats.paused || 0, color: 'text-yellow-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 text-center">
                <div className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs — scrollable on mobile */}
        <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 scrollbar-thin">
          {(['all', 'ACTIVE', 'COMPLETED', 'FAILED', 'PAUSED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap flex-shrink-0 ${
                filter === status ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No goals found</h2>
            <p className="text-gray-500 mb-6">Create your first goal to start tracking your progress!</p>
            <button
              onClick={() => router.push('/goals/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid gap-4 p-6">
              {goals.map((goal) => {
                const progress = goal.progress || 0;
                return (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status.toLowerCase()}
                          </span>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-gray-500">{goal.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{goal.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/goals/${goal.id}/edit`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id, goal.title)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          {goal.currentValue || 0} / {goal.targetValue} {goal.unit || ''}
                        </span>
                        <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getProgressColor(progress)}`}
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    </div>

                    {goal.status === 'ACTIVE' && (
                      <button
                        onClick={() => router.push(`/goals/${goal.id}/progress`)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
