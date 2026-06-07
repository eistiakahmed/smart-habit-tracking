'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

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

export default function NewHabitPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('🎯');
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'CUSTOM'>('DAILY');
  const [targetDays, setTargetDays] = useState(30);
  const [reminderTime, setReminderTime] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    setLoading(true);

    try {
      await api.createHabit({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        color,
        icon,
        frequency,
        targetDays,
        reminderTime: reminderTime || undefined,
        difficulty,
      });

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] mobile-page-padding">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Create New Habit</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 transition-all ${
                        color === c.value ? 'border-gray-900 scale-110' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((i) => (
                    <button
                      key={i.name}
                      type="button"
                      onClick={() => setIcon(i.emoji)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center text-lg sm:text-xl transition-all ${
                        icon === i.emoji ? 'border-gray-900 scale-110' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={i.name}
                    >
                      {i.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetDays" className="block text-sm font-medium text-gray-700 mb-2">Target Days</label>
                <input
                  id="targetDays"
                  type="number"
                  value={targetDays}
                  onChange={(e) => setTargetDays(parseInt(e.target.value))}
                  min={1}
                  max={365}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
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
                <div className="text-xs text-gray-500">Difficulty</div>
                <div className="text-sm font-medium text-gray-700">{difficulty}</div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Creating...'
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Habit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
