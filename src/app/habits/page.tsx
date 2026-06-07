'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Habit } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function HabitsListPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchHabits();
  }, [isAuthenticated, filter]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const isActive = filter === 'all' ? undefined : filter === 'active';
      const response = await api.getHabits({ isActive, limit: 50 });
      setHabits(response.habits);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-[#f8f9fb] mobile-page-padding">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Habits</h1>
            </div>
            <button
              onClick={() => router.push('/habits/new')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Habit</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 sm:mb-6">
          {(['active', 'inactive', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm capitalize ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : habits.length === 0 ? (
          <div className="app-card p-8 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-base font-semibold text-gray-800 mb-2">No habits found</h2>
            <p className="text-gray-500 mb-5 text-sm">
              {filter === 'active' ? "No active habits yet."
                : filter === 'inactive' ? "No inactive habits."
                : "No habits created yet."}
            </p>
            <button
              onClick={() => router.push('/habits/new')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm active:scale-95 shadow-sm shadow-blue-200"
            >
              <Plus className="w-4 h-4" />
              Create Your First Habit
            </button>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="sm:hidden space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="app-card p-4 press-feedback"
                  onClick={() => router.push(`/habits/${habit.id}/edit`)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: habit.color + '20' }}
                    >
                      {habit.icon || '🎯'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{habit.title}</p>
                          <p className="text-xs text-gray-500">{habit.category}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => router.push(`/habits/${habit.id}/edit`)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(habit.id, habit.title)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        {/* Progress */}
                        <div className="flex items-center gap-1.5 flex-1">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${habit.stats?.completionRate || 0}%`, backgroundColor: habit.color }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 w-8 text-right">
                            {Math.round(habit.stats?.completionRate || 0)}%
                          </span>
                        </div>
                        {/* Streak */}
                        <span className="text-xs text-orange-500 flex-shrink-0">
                          🔥 {habit.stats?.currentStreak || 0}
                        </span>
                        {/* Status toggle */}
                        <button
                          onClick={() => handleToggleActive(habit.id, habit.isActive)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                            habit.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {habit.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {habit.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Habit', 'Category', 'Progress', 'Streak', 'Status', 'Actions'].map((h) => (
                        <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {habits.map((habit) => (
                      <tr key={habit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: habit.color + '20' }}>
                              {habit.icon || '🎯'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{habit.title}</div>
                              {habit.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">{habit.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{habit.category}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                              <div className="h-full rounded-full" style={{ width: `${habit.stats?.completionRate || 0}%`, backgroundColor: habit.color }} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{Math.round(habit.stats?.completionRate || 0)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-orange-500">🔥 {habit.stats?.currentStreak || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActive(habit.id, habit.isActive)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${habit.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                          >
                            {habit.isActive ? <><CheckCircle className="w-3 h-3" />Active</> : <><XCircle className="w-3 h-3" />Inactive</>}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => router.push(`/habits/${habit.id}/edit`)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(habit.id, habit.title)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => router.push('/habits/new')}
        className="sm:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px) + 1rem)' }}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
