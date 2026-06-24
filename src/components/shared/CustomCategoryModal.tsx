'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, ChevronRight } from 'lucide-react';
import { HabitIcon } from './HabitIcon';

interface Category {
  _id?: string;
  name: string;
  icon: string;
  color: string;
  isDefault?: boolean;
}

interface CustomCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryData) => Promise<void>;
  editingCategory?: Category;
}

export type CreateCategoryData = {
  name: string;
  icon: string;
  color: string;
};

const PRESET_COLORS = [
  { name: 'Blue', value: '#0ea5e9' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
];

export default function CustomCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory
}: CustomCategoryModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Target');
  const [color, setColor] = useState('#0ea5e9');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form when editing
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setIcon(editingCategory.icon);
      setColor(editingCategory.color);
    } else {
      // Reset form for new category
      setName('');
      setIcon('Target');
      setColor('#0ea5e9');
    }
    setError('');
  }, [editingCategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    if (name.length > 50) {
      setError('Category name cannot exceed 50 characters');
      return;
    }

    if (name.trim().length < 1) {
      setError('Category name must be at least 1 character');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        name: name.trim(),
        icon,
        color
      });

      // Reset form after successful submission
      if (!editingCategory) {
        setName('');
        setIcon('Target');
        setColor('#0ea5e9');
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setShowIconPicker(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEdit = !!editingCategory;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#0a0f1d] border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col safe-area-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
              {isEdit ? 'Edit Category' : 'Create Custom Category'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {isEdit ? 'Update your custom category' : 'Add a new category for your habits'}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="touch-target flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            aria-label="Close modal"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto scroll-momentum">
          {/* Category Name */}
          <div>
            <label htmlFor="categoryName" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Category Name *
            </label>
            <input
              id="categoryName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Routine, Work Projects, Fitness Goals"
              maxLength={50}
              disabled={loading}
              className="w-full min-h-[48px] px-4 py-3 bg-slate-950/40 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl outline-none transition-all text-slate-100 placeholder-slate-600 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-slate-500">1-50 characters</span>
              <span className="text-[10px] text-slate-400">{name.length}/50</span>
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Icon *
            </label>
            <button
              type="button"
              onClick={() => setShowIconPicker(true)}
              disabled={loading}
              className="w-full min-h-[64px] px-4 py-3 bg-slate-950/40 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{
                  backgroundColor: `${color}15`,
                  borderColor: `${color}30`
                }}
              >
                <HabitIcon icon={icon} color={color} size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-slate-200">{icon}</div>
                <div className="text-xs text-slate-500">Click to change icon</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Color *
            </label>
            <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor.value}
                  type="button"
                  onClick={() => setColor(presetColor.value)}
                  disabled={loading}
                  className={`min-h-[44px] aspect-square rounded-xl border transition-all ${
                    color === presetColor.value
                      ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                      : 'border-slate-800 hover:border-slate-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ backgroundColor: presetColor.value }}
                  title={presetColor.name}
                />
              ))}
            </div>
          </div>

          {/* Category Preview */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Preview
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: `${color}15`,
                  borderColor: `${color}30`
                }}
              >
                <HabitIcon icon={icon} color={color} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-100 truncate">
                  {name || 'Category Name'}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {isEdit ? 'Custom Category' : 'New Custom Category'}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 px-4 sm:px-6 py-3 bg-[#0a0f1d]/94 backdrop-blur-xl border-t border-slate-800 flex gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 touch-target px-4 border border-slate-800 hover:bg-slate-800/40 text-slate-300 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 touch-target bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEdit ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Icon Picker Modal (nested) */}
      {showIconPicker && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowIconPicker(false)}
          />
          <div className="relative w-full max-w-2xl bg-[#0a0f1d] border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 h-[70dvh] sm:max-h-[80vh] overflow-hidden flex flex-col safe-area-bottom">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Select Icon</h3>
              <button
                onClick={() => setShowIconPicker(false)}
                className="touch-target flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                type="button"
                aria-label="Close icon picker"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Core Icons</h4>
                <div className="grid grid-cols-4 min-[380px]:grid-cols-5 sm:grid-cols-8 gap-2">
                  {['Target', 'Star', 'Flame', 'Heart', 'BookOpen', 'Dumbbell', 'Droplets', 'Brain', 'Apple', 'Zap', 'CheckCircle', 'Moon', 'Sun', 'Coins', 'Music', 'Palette'].map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        setIcon(iconName);
                        setShowIconPicker(false);
                      }}
                      className={`min-h-[48px] aspect-square rounded-xl flex items-center justify-center transition-all ${
                        icon === iconName
                          ? 'bg-sky-500/20 border-2 border-sky-500'
                          : 'bg-slate-950/40 border border-slate-800 hover:border-slate-700'
                      }`}
                      title={iconName}
                    >
                      <HabitIcon icon={iconName} color={icon === iconName ? '#0ea5e9' : color} size={16} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Popular Icons</h4>
                <div className="grid grid-cols-4 min-[380px]:grid-cols-5 sm:grid-cols-8 gap-2">
                  {['Trophy', 'Coffee', 'Home', 'Car', 'Plane', 'TreePine', 'Utensils', 'ShoppingBag'].map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        setIcon(iconName);
                        setShowIconPicker(false);
                      }}
                      className={`min-h-[48px] aspect-square rounded-xl flex items-center justify-center transition-all ${
                        icon === iconName
                          ? 'bg-sky-500/20 border-2 border-sky-500'
                          : 'bg-slate-950/40 border border-slate-800 hover:border-slate-700'
                      }`}
                      title={iconName}
                    >
                      <HabitIcon icon={iconName} color={icon === iconName ? '#0ea5e9' : color} size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
