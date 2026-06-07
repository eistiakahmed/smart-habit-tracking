'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Habit } from '@/types';

const CATEGORIES = [
  'Health',
  'Fitness',
  'Learning',
  'Mental Health',
  'Nutrition',
  'Productivity',
  'Goals',
  'Wellness',
  'Finance',
  'Relationships',
  'Creativity',
  'Spirituality',
];

const COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Cyan', value: '#06B6D4' },
];

const ICONS = [
  { name: 'Target', emoji: '🎯' },
  { name: 'Star', emoji: '⭐' },
  { name: 'Fire', emoji: '🔥' },
  { name: 'Heart', emoji: '❤️' },
  { name: 'Book', emoji: '📚' },
  { name: 'Dumbbell', emoji: '💪' },
  { name: 'Water', emoji: '💧' },
  { name: 'Brain', emoji: '🧠' },
  { name: 'Apple', emoji: '🍎' },
  { name: 'Zap', emoji: '⚡' },
  { name: 'Check', emoji: '✅' },
  { name: 'Moon', emoji: '🌙' },
  { name: 'Sun', emoji: '☀️' },
  { name: 'Money', emoji: '💰' },
  { name: 'Music', emoji: '🎵' },
  { name: 'Art', emoji: '🎨' },
];

export default function EditHabitPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('🎯');
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'CUSTOM'>('DAILY');
  const [targetDays, setTargetDays] = useState(30);
  const [reminderTime, setReminderTime] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchHabit();
  }, []);

  const fetchHabit = async () => {
    try {
      setLoading(true);
      const data = await api.getHabit(params.id);
      setHabit(data);

      setTitle(data.title);
      setDescription(data.description || '');
      setCategory(data.category);
      setColor(data.color);
      setIcon(data.icon || '🎯');
      setFrequency(data.frequency);
      setTargetDays(data.targetDays);
      setReminderTime(data.reminderTime || '');
      setDifficulty(data.difficulty);
      setIsActive(data.isActive);
    } catch (error: any) {
      setError('Failed to load habit');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!category) {
      setError('Category is required');
      return;
    }

    setSaving(true);

    try {
      await api.updateHabit(params.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        color,
        icon,
        frequency,
        targetDays,
        reminderTime: reminderTime || undefined,
        difficulty,
        isActive,
      });

      router.push('/habits');
    } catch (err: any) {
      setError(err.message || 'Failed to update habit');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.deleteHabit(params.id);
      router.push('/habits');
    } catch (err: any) {
      setError(err.message || 'Failed to delete habit');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="text-center">
          <p className="text-gray-600">Habit not found</p>
          <button onClick={() => router.back()} className="text-blue-500 hover:underline mt-2">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] mobile-page-padding">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Edit Habit</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Habit Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Drink 8 glasses of water"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe your habit goal..."
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button key={c.value} type="button" onClick={() => setColor(c.value)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 transition-all ${color === c.value ? 'border-gray-900 scale-110' : 'border-gray-200 hover:border-gray-300'}`}
                    style={{ backgroundColor: c.value }} title={c.name} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((i) => (
                  <button key={i.name} type="button" onClick={() => setIcon(i.emoji)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center text-lg sm:text-xl transition-all ${icon === i.emoji ? 'border-gray-900 scale-110' : 'border-gray-200 hover:border-gray-300'}`}
                    title={i.name}>
                    {i.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
            <div>
              <label htmlFor="targetDays" className="block text-sm font-medium text-gray-700 mb-2">Target Days</label>
              <input id="targetDays" type="number" value={targetDays} onChange={(e) => setTargetDays(parseInt(e.target.value))}
                min={1} max={365}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Time (optional)
              </label>
              <input
                id="reminderTime"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active habit
            </label>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: color + '20' }}
            >
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{title || 'Habit Title'}</h3>
              <p className="text-sm text-gray-500">{category || 'No category'}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Status</div>
              <div className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-200">
            <button type="button" onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm">
              <Trash2 className="w-4 h-4" />
              Delete Habit
            </button>
            <div className="flex gap-3 w-full sm:w-auto">
              <button type="button" onClick={() => router.back()}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
