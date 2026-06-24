'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';

const CATEGORIES = [
  'Health',
  'Fitness',
  'Learning',
  'Career',
  'Finance',
  'Relationships',
  'Personal Growth',
  'Creative',
  'Spiritual',
  'Other',
];

export default function NewGoalPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState(1);
  const [unit, setUnit] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('');
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

    if (!targetDate) {
      setError('Target date is required');
      return;
    }

    setLoading(true);

    try {
      await api.createGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        targetValue,
        unit: unit || undefined,
        targetDate: new Date(targetDate).toISOString(),
        category,
      });

      router.push('/goals');
    } catch (err: any) {
      setError(err.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] relative overflow-x-hidden font-sans">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Create New Goal</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10 page-enter">
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <label htmlFor="title" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Goal Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 font-medium text-sm"
              placeholder="e.g., Read 12 books this year"
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
              placeholder="Describe your goal..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetValue" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Target Value *
              </label>
              <input
                id="targetValue"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                min={1}
                required
                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 font-medium text-sm"
                placeholder="12"
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Unit (optional)
              </label>
              <input
                id="unit"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 font-medium text-sm"
                placeholder="books, kg, hours..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetDate" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Target Date *
              </label>
              <input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 font-medium text-sm"
                style={{ colorScheme: 'dark' }}
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
          </div>

          {/* Goal Preview card */}
          <div className="flex items-center gap-4 p-4.5 bg-slate-950/40 border border-slate-850 rounded-2xl">
            <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-sky-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-slate-100 truncate">{title || 'Goal Preview'}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {targetValue} {unit || ''} by {targetDate ? new Date(targetDate).toLocaleDateString() : 'Not set'}
              </p>
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
              className="flex-1 btn-glow bg-gradient-to-r from-sky-500 to-purple-600 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(56,189,248,0.15)] cursor-pointer"
            >
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
