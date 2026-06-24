'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import CategorySelector from '@/components/shared/CategorySelector';
import IconPickerModal from '@/components/shared/IconPickerModal';
import CustomCategoryModal from '@/components/shared/CustomCategoryModal';
import HabitIcon from '@/components/shared/HabitIcon';
import { addRecentIcon, getRecentIcons } from '@/lib/utils/recentIcons';
import { Category, CreateCategoryData } from '@/types';

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

export default function NewHabitPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [color, setColor] = useState('#0ea5e9');
  const [icon, setIcon] = useState('Target');
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'CUSTOM'>('DAILY');
  const [targetDays, setTargetDays] = useState(30);
  const [reminderTime, setReminderTime] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');

  // UI States
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [recentIcons, setRecentIcons] = useState<string[]>([]);

  // Load categories and recent icons on mount
  useEffect(() => {
    loadCategories();
    setRecentIcons(getRecentIcons(8));
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await api.getCategories(true);
      setCategories(response.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setIcon(iconName);
    addRecentIcon(iconName);
    setRecentIcons(getRecentIcons(8));
  };

  const handleCreateCategory = async (data: CreateCategoryData) => {
    try {
      const response = await api.createCategory(data);
      // Add new category to the list
      setCategories([...categories, response.category]);
      // Select the newly created category
      setSelectedCategory(response.category);
      // Update color and icon to match the new category
      setColor(response.category.color);
      setIcon(response.category.icon);
    } catch (err: any) {
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!selectedCategory) {
      setError('Category is required');
      return;
    }

    setLoading(true);

    try {
      await api.createHabit({
        title: title.trim(),
        description: description.trim() || undefined,
        category: selectedCategory._id,
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
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] relative overflow-x-hidden font-sans mobile-page-padding sm:pb-0">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <header className="glass-header sticky top-0 z-50 safe-area-top">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button
              onClick={() => router.back()}
              className="touch-target flex items-center justify-center hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white shrink-0"
              type="button"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Create New Habit</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8 relative z-10 page-enter">
        <div className="glass-panel rounded-2xl sm:rounded-3xl border border-slate-800/80 p-3.5 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                Habit Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., Drink 8 glasses of water"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={2}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Describe your habit goal..."
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                Category *
              </label>
              {categoriesLoading ? (
                <div className="flex items-center justify-center p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                </div>
              ) : (
                <CategorySelector
                  selectedCategory={selectedCategory}
                  onCategorySelect={(category) => setSelectedCategory(category)}
                  onCreateCategory={() => setShowCategoryModal(true)}
                  categories={categories}
                  disabled={loading}
                  placeholder="Select a category"
                />
              )}
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                Icon
              </label>
              <button
                type="button"
                onClick={() => setShowIconPicker(true)}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-950/40 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border flex-shrink-0"
                  style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
                >
                  <HabitIcon icon={icon} color={color} size={17} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs sm:text-sm font-medium text-slate-200">{icon}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500">Tap to change icon</div>
                </div>
              </button>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2.5">
                Color Accent
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    disabled={loading}
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                      color === c.value
                        ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.25)]'
                        : 'border-slate-800 hover:border-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Frequency and Target Days */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label htmlFor="frequency" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Frequency
                </label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0f1d] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="DAILY" className="bg-[#0a0f1d]">Daily</option>
                  <option value="WEEKLY" className="bg-[#0a0f1d]">Weekly</option>
                  <option value="CUSTOM" className="bg-[#0a0f1d]">Custom</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetDays" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Target Days
                </label>
                <input
                  id="targetDays"
                  type="number"
                  value={targetDays}
                  onChange={(e) => setTargetDays(parseInt(e.target.value))}
                  min={1}
                  max={365}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Reminder and Difficulty */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label htmlFor="reminderTime" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Reminder <span className="normal-case font-medium text-slate-500">(optional)</span>
                </label>
                <input
                  id="reminderTime"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0a0f1d] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="EASY" className="bg-[#0a0f1d]">Easy</option>
                  <option value="MEDIUM" className="bg-[#0a0f1d]">Medium</option>
                  <option value="HARD" className="bg-[#0a0f1d]">Hard</option>
                </select>
              </div>
            </div>

            {/* Habit Preview Card */}
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-950/40 border border-slate-800 rounded-xl sm:rounded-2xl">
              <div
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
                style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
              >
                <HabitIcon icon={icon} color={color} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-slate-100 truncate">{title || 'Habit Preview'}</h3>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">
                  {selectedCategory?.name || 'No category selected'}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Difficulty</div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-300 mt-0.5">{difficulty}</div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 sm:p-3 text-red-400 text-xs sm:text-sm font-medium">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="sticky bottom-0 -mx-3.5 sm:mx-0 -mb-3.5 sm:mb-0 px-3.5 sm:px-0 py-2.5 sm:py-0 bg-[#050a15]/95 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none border-t border-slate-900/80 sm:border-t-0 flex gap-2.5 sm:gap-4 safe-area-bottom">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 py-2.5 sm:py-3 px-4 border border-slate-800 hover:bg-slate-800/40 text-slate-300 hover:text-white rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedCategory}
                className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.15)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Create Habit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onIconSelect={handleIconSelect}
        currentIcon={icon}
        recentIcons={recentIcons}
      />

      {/* Custom Category Modal */}
      <CustomCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
}
