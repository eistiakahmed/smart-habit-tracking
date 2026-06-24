'use client';

import React, { useState, useMemo } from 'react';
import { Search, LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
  className?: string;
}

// Icon categories with their respective icons
const ICON_CATEGORIES = {
  'Core Habits': [
    'Target', 'Star', 'Heart', 'BookOpen', 'Dumbbell',
    'Droplets', 'Brain', 'Apple', 'Zap'
  ],
  'Health & Fitness': [
    'Activity', 'Bike', 'Stretch', 'Trophy', 'Flame',
    'Timer', 'Lungs', 'Pill'
  ],
  'Learning & Growth': [
    'GraduationCap', 'Globe', 'Languages', 'PenTool',
    'Scroll', 'Library'
  ],
  'Wellness': [
    'Smile', 'Sun', 'Moon', 'TreePine', 'Spa',
    'Wind', 'Leaf', 'Flower'
  ],
  'Finance': [
    'DollarSign', 'Coins', 'CreditCard', 'PiggyBank',
    'TrendingUp', 'Wallet'
  ],
  'Creativity': [
    'Palette', 'Music', 'Camera', 'Wand2',
    'Sparkles', 'Paintbrush'
  ],
  'Time Management': [
    'Clock', 'Hourglass', 'Calendar', 'CalendarDays', 'Timer'
  ],
  'Social': [
    'Users', 'MessageCircle', 'Phone', 'Mail',
    'Handshake', 'Heart'
  ],
  'Technology': [
    'Laptop', 'Phone', 'Wifi', 'Headphones',
    'Keyboard', 'Bluetooth'
  ]
} as const;

type CategoryName = keyof typeof ICON_CATEGORIES;
type IconName = typeof ICON_CATEGORIES[CategoryName][number];

export function IconPicker({ selectedIcon, onIconSelect, className = '' }: IconPickerProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryName>('Core Habits');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all icons from all categories for search
  const allIcons = useMemo(() => {
    const icons: { name: string; category: string }[] = [];
    Object.entries(ICON_CATEGORIES).forEach(([category, iconNames]) => {
      iconNames.forEach(iconName => {
        icons.push({ name: iconName, category });
      });
    });
    return icons;
  }, []);

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return ICON_CATEGORIES[activeCategory].map(name => ({
        name,
        category: activeCategory
      }));
    }
    return allIcons.filter(icon =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeCategory, allIcons]);

  // Get icon component from lucide-react
  const getIconComponent = (iconName: string): LucideIcon | null => {
    const iconMap: Record<string, LucideIcon> = LucideIcons as unknown as Record<string, LucideIcon>;
    return iconMap[iconName] || null;
  };

  // Get currently selected icon component
  const SelectedIconComponent = getIconComponent(selectedIcon);

  return (
    <div className={`w-full ${className}`}>
      {/* Selected Icon Preview */}
      {SelectedIconComponent && selectedIcon && (
        <div className="mb-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500/20 to-purple-600/20 flex items-center justify-center border border-slate-600/30">
            <SelectedIconComponent className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">Selected Icon</div>
            <div className="text-xs text-slate-500 font-mono">{selectedIcon}</div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
          aria-label="Search icons"
        />
      </div>

      {/* Category Tabs */}
      {!searchQuery && (
        <div className="mb-4 overflow-x-auto scrollbar-thin pb-2">
          <div className="flex gap-2 min-w-max">
            {Object.keys(ICON_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as CategoryName)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-slate-700/40 hover:text-slate-300'
                }`}
                aria-label={`Show ${category} icons`}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Icons Grid */}
      <div
        className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto scrollbar-thin p-1"
        role="listbox"
        aria-label="Available icons"
      >
        {filteredIcons.map(({ name }) => {
          const IconComponent = getIconComponent(name);
          const isSelected = selectedIcon === name;

          if (!IconComponent) return null;

          return (
            <button
              key={name}
              onClick={() => onIconSelect(name)}
              className={`
                aspect-square rounded-lg flex items-center justify-center transition-all duration-200
                ${isSelected
                  ? 'bg-gradient-to-br from-sky-500/30 to-purple-600/30 border-2 border-sky-500/60 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                  : 'bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600/60'
                }
              `}
              aria-label={`Select ${name} icon`}
              aria-selected={isSelected}
              role="option"
              title={name}
            >
              <IconComponent
                className={`w-5 h-5 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`}
              />
            </button>
          );
        })}

        {filteredIcons.length === 0 && (
          <div className="col-span-6 py-8 text-center text-slate-500 text-sm">
            No icons found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Result count */}
      <div className="mt-3 text-xs text-slate-500 text-right">
        {searchQuery ? (
          <span>{filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} found</span>
        ) : (
          <span>{filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} in {activeCategory}</span>
        )}
      </div>
    </div>
  );
}
