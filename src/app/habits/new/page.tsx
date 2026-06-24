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
  { name: 'Blue', value: '#0ea5e9' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
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
  const [color, setColor] = useState('#0ea5e9');
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
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] relative overflow-x-hidden font-sans">
      
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Create New Habit</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10 page-enter">
        <div className="glass-panel rounded-3xl border border-slate-800/80 p-5 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Habit Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 font-medium text-sm"
                placeholder="e.g., Drink 8 glasses of water"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 font-medium text-sm resize-none"
                placeholder="Describe your habit goal..."
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0a0f1d] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 font-medium text-sm"
              >
                <option value="" className="bg-[#0a0f1d]">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0a0f1d]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">Color Accent</label>
                <div className="flex flex-wrap gap-2.5">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`w-9 h-9 rounded-xl border transition-all cursor-pointer ${
                        color === c.value 
                          ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.25)]' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">Emoji Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((i) => (
                    <button
                      key={i.name}
                      type="button"
                      onClick={() => setIcon(i.emoji)}
                      className={`w-9 h-9 rounded-xl border bg-slate-950/40 flex items-center justify-center text-lg transition-all cursor-pointer ${
                        icon === i.emoji 
                          ? 'border-sky-500 scale-110 shadow-[0_0_8px_rgba(14,165,233,0.25)]' 
                          : 'border-slate-850 hover:border-slate-800'
                      }`}
                      title={i.name}
                    >
                      {i.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="frequency" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Frequency</label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 bg-[#0a0f1d] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 font-medium text-sm"
                >
                  <option value="DAILY" className="bg-[#0a0f1d]">Daily</option>
                  <option value="WEEKLY" className="bg-[#0a0f1d]">Weekly</option>
                  <option value="CUSTOM" className="bg-[#0a0f1d]">Custom</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetDays" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Target Days</label>
                <input
                  id="targetDays"
                  type="number"
                  value={targetDays}
                  onChange={(e) => setTargetDays(parseInt(e.target.value))}
                  min={1}
                  max={365}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 font-medium text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="reminderTime" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Reminder Time (optional)
                </label>
                <input
                  id="reminderTime"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 font-medium text-sm"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-4 py-3 bg-[#0a0f1d] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 font-medium text-sm"
                >
                  <option value="EASY" className="bg-[#0a0f1d]">Easy</option>
                  <option value="MEDIUM" className="bg-[#0a0f1d]">Medium</option>
                  <option value="HARD" className="bg-[#0a0f1d]">Hard</option>
                </select>
              </div>
            </div>

            {/* Habit Preview Card */}
            <div className="flex items-center gap-4 p-4.5 bg-slate-950/40 border border-slate-850 rounded-2xl">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                style={{ 
                  backgroundColor: color + '15',
                  borderColor: color + '30'
                }}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-slate-100 truncate">{title || 'Habit Preview'}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">{category || 'No category selected'}</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Difficulty</div>
                <div className="text-xs font-bold text-slate-300 mt-1">{difficulty}</div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3.5 border border-slate-800 hover:bg-slate-800/40 text-slate-300 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-glow bg-gradient-to-r from-sky-500 to-purple-600 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.15)]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Plus className="w-4.5 h-4.5" />
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
