'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, X, Clock, Check, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types & Interfaces
// ============================================

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIconSelect: (iconName: string) => void;
  currentIcon?: string;
  recentIcons?: string[];
}

interface IconData {
  name: string;
  category: string;
}

type CategoryName = string;

// ============================================
// Icon Categories (50+ icons per category)
// ============================================

const ICON_CATEGORIES: Record<string, string[]> = {
  'Core Habits': [
    'Target', 'Star', 'Heart', 'BookOpen', 'Dumbbell', 'Droplets', 'Brain', 'Apple', 'Zap',
    'CheckCircle', 'Circle', 'Flag', 'Home', 'Pin', 'Sparkles', 'Sun', 'Moon', 'Cloud',
    'Snowflake', 'Flame', 'Gem', 'Crown', 'Shield', 'Sword', 'Key', 'Lock', 'Unlock',
    'Bell', 'BellRing', 'Camera', 'Image', 'Mic', 'Music', 'Headphones', 'Volume2',
    'Lightbulb', 'Lamp', 'Candle', 'Flashlight', 'Wand2', 'Sparkle', 'ShootingStar',
    'Mountain', 'Globe', 'Compass', 'MapPin', 'Navigation', 'Anchor'
  ],
  'Health & Fitness': [
    'Activity', 'Bike', 'Stretch', 'Trophy', 'Flame', 'Timer', 'Lungs', 'Pill', 'Dumbbell',
    'Heart', 'HeartPulse', 'Bone', 'Armchair', 'Sofa', 'Bed', 'Bath', 'Shower', 'Wind',
    'Feather', 'Egg', 'Pizza', 'Coffee', 'Martini', 'Beer', 'Wine', 'Utensils', 'ChefHat',
    'Apple', 'Carrot', 'Leaf', 'Flower', 'TreePine', 'Trees', 'Sprout', 'Grain', 'Wheat',
    'Cow', 'Fish', 'Bug', 'Beef', 'Chicken', 'Drumstick', 'Egg', 'Milk', 'Cheese',
    'Scale', 'Ruler', 'Footprints', 'Sneeze', 'Thermometer', 'Stethoscope', 'Pill', 'Syringe',
    'Vitamin', 'TestTube', 'Microscope', 'Dna', 'HeartHandshake', 'HandHeart'
  ],
  'Learning & Growth': [
    'GraduationCap', 'Globe', 'Languages', 'PenTool', 'Scroll', 'Library', 'Book', 'BookMark',
    'Notebook', 'FileText', 'Newspaper', 'Article', 'Clipboard', 'Copy', 'Edit', 'Pencil',
    'Highlighter', 'Eraser', 'Ruler', 'Pen', 'Palette', 'Brush', 'Sparkles', 'Lightbulb',
    'Brain', 'CircuitBoard', 'Microscope', 'Telescope', 'Globe', 'Map', 'Compass', 'Navigation',
    'School', 'Chalkboard', 'ChalkboardTeacher', 'Award', 'Medal', 'Trophy', 'Star', 'Badge',
    'Certificate', 'Scroll', 'BookOpen', 'Library', 'Languages', 'Globe', 'Plane', 'Rocket',
    'Ship', 'Train', 'Car', 'Bus', 'Bike', 'Scooter', 'Truck', 'Ambulance', 'PoliceCar'
  ],
  'Wellness': [
    'Smile', 'Sun', 'Moon', 'TreePine', 'Spa', 'Wind', 'Leaf', 'Flower', 'Droplets',
    'Heart', 'HeartPulse', 'Activity', 'Sparkles', 'Sunrise', 'Sunset', 'Cloud', 'CloudRain',
    'CloudSnow', 'CloudLightning', 'Snowflake', 'Thunder', 'Waves', 'Water', 'Flame', 'Fire',
    'Candle', 'Lamp', 'Lightbulb', 'Sun', 'Moon', 'Star', 'Sparkle', 'ShootingStar', 'Comet',
    'Mountain', 'Trees', 'TreePine', 'Leaf', 'Flower', 'Flower2', 'Sprout', 'Mushroom',
    'YinYang', 'Infinity', 'Circle', 'Hexagon', 'Octagon', 'Triangle', 'Square', 'Pentagon',
    'Smile', 'Laugh', 'Meh', 'Frown', 'Angry', 'Sad', 'Confused', 'Surprised', 'Wink'
  ],
  'Finance': [
    'DollarSign', 'Coins', 'CreditCard', 'PiggyBank', 'TrendingUp', 'Wallet', 'Banknote',
    'Currency', 'Receipt', 'CheckCircle', 'XCircle', 'AlertCircle', 'Info', 'AlertTriangle',
    'PieChart', 'BarChart', 'LineChart', 'TrendingUp', 'TrendingDown', 'Calendar', 'CalendarDays',
    'Clock', 'Timer', 'Hourglass', 'Watch', 'AlarmClock', 'Sundial', 'Time', 'Globe', 'Map',
    'Navigation', 'Compass', 'Waypoints', 'Route', 'Signpost', 'Milestone', 'Flag', 'FlagTriangle',
    'Target', 'Crosshair', 'Scan', 'QrCode', 'Barcode', 'Fingerprint', 'Shield', 'Lock', 'Key',
    'Bitcoin', 'Coins', 'DollarSign', 'Euro', 'Pound', 'Yen', 'Rupee', 'Currency', 'Landmark'
  ],
  'Creativity': [
    'Palette', 'Music', 'Camera', 'Wand2', 'Sparkles', 'Paintbrush', 'Pen', 'Pencil', 'Eraser',
    'Highlighter', 'Ruler', 'Scissors', 'Palette', 'Brush', 'Droplet', 'Fill', 'Bucket',
    'Image', 'Film', 'Camera', 'Video', 'Mic', 'Headphones', 'Music', 'Guitar', 'Piano',
    'Trumpet', 'Drum', 'Violin', 'Music2', 'Music3', 'Music4', 'Radio', 'Tv', 'Phone',
    'Laptop', 'Desktop', 'Tablet', 'Smartphone', 'Watch', 'Glasses', 'Sunglasses', 'Eye',
    'EyeOff', 'Binoculars', 'Camera', 'Aperture', 'Lens', 'Filters', 'Adjust', 'Crop',
    'Wand2', 'Sparkles', 'ShootingStar', 'Star', 'Moon', 'Sun', 'Cloud', 'Sunrise', 'Sunset'
  ],
  'Time Management': [
    'Clock', 'Hourglass', 'Calendar', 'CalendarDays', 'Timer', 'AlarmClock', 'Watch', 'Sundial',
    'Time', 'GanttChart', 'Timeline', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
    'CornerUpRight', 'CornerUpLeft', 'CornerDownRight', 'CornerDownLeft', 'Move', 'Minimize',
    'Maximize', 'Expand', 'Shrink', 'Repeat', 'Repeat1', 'RefreshCw', 'RefreshCcw', 'RotateCw',
    'RotateCcw', 'Undo', 'Redo', 'History', 'Clock', 'Hourglass', 'Timer', 'Stopwatch',
    'Calendar', 'CalendarDays', 'CalendarHeart', 'CalendarCheck', 'CalendarX', 'CalendarPlus',
    'CalendarMinus', 'GanttChartSquare', 'Timeline', 'ArrowUpDown', 'ArrowLeftRight', 'ArrowUpLeft'
  ],
  'Social': [
    'Users', 'MessageCircle', 'Phone', 'Mail', 'Handshake', 'Heart', 'User', 'UserCircle',
    'UserPlus', 'UserMinus', 'UserCheck', 'UserX', 'Users', 'Users2', 'Users3', 'Crowd',
    'MessageCircle', 'MessageSquare', 'MessageTriangle', 'Mail', 'MailOpen', 'AtSign',
    'Send', 'Share', 'Share2', 'Forward', 'Reply', 'ReplyAll', 'Phone', 'PhoneCall', 'PhoneIncoming',
    'PhoneOutgoing', 'Video', 'VideoOff', 'Mic', 'MicOff', 'Bell', 'BellRing', 'BellDot',
    'Globe', 'Globe2', 'Earth', 'MapPin', 'Navigation', 'Compass', 'Route', 'Waypoints'
  ],
  'Technology': [
    'Laptop', 'Phone', 'Wifi', 'Headphones', 'Keyboard', 'Bluetooth', 'Desktop', 'Tablet',
    'Smartphone', 'Watch', 'Glasses', 'Mouse', 'MousePointer', 'Monitor', 'Server', 'Database',
    'Cloud', 'CloudDrizzle', 'CloudRain', 'CloudLightning', 'CloudMoon', 'CloudSun', 'Code',
    'Terminal', 'FileCode', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest', 'GitFork',
    'Cpu', 'HardDrive', 'Memory', 'SDCard', 'FloppyDisk', 'Optical', 'Usb', 'Bluetooth',
    'Wifi', 'Signal', 'SignalHigh', 'SignalLow', 'SignalMedium', 'SignalZero', 'Radiation',
    'Scan', 'QrCode', 'Barcode', 'Fingerprint', 'AccessPoint', 'Router', 'Antenna', 'Satellite'
  ],
  'Productivity': [
    'CheckCircle', 'CheckSquare', 'Circle', 'Square', 'XCircle', 'XSquare', 'Target', 'Crosshair',
    'Pin', 'MapPin', 'Navigation', 'Compass', 'Flag', 'FlagTriangle', 'FlagSquare', 'Star',
    'StarHalf', 'StarOff', 'Diamond', 'Hexagon', 'Octagon', 'Triangle', 'Award', 'Medal',
    'Trophy', 'Crown', 'Gem', 'Sparkles', 'Wand2', 'Sparkle', 'ShootingStar', 'Zap',
    'Bolt', 'Flashlight', 'Candle', 'Lamp', 'Lightbulb', 'Sun', 'Moon', 'Cloud', 'Sunrise',
    'Sunset', 'Flame', 'Fire', 'Droplet', 'Drop', 'Droplets', 'Snowflake', 'Snowman',
    'CloudRain', 'CloudDrizzle', 'CloudSnow', 'CloudLightning', 'Wind', 'Hurricane'
  ],
  'Spirituality': [
    'Sparkles', 'Star', 'Moon', 'Sun', 'Cloud', 'Sunrise', 'Sunset', 'Flame', 'Candle',
    'Lotus', 'YinYang', 'Infinity', 'Circle', 'Hexagon', 'Spiral', 'Om', 'Cross', 'StarOfDavid',
    'Crescent', 'MoonStar', 'SunMoon', 'CloudMoon', 'CloudSun', 'Sparkle', 'ShootingStar',
    'Comet', 'Meteor', 'Galaxy', 'MilkyWay', 'Orbit', 'Planet', 'Rocket', 'Alien', 'Ufo',
    'Telescope', 'Binoculars', 'Eye', 'EyeOff', 'Glasses', 'Sunglasses', 'Crystal', 'Gem',
    'Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pendant', 'Ring', 'Crown', 'Tiara', 'Scepter'
  ],
  'Nature': [
    'TreePine', 'Trees', 'TreeDeciduous', 'TreePalm', 'Leaf', 'Leaves', 'Sprout', 'Seedling',
    'Flower', 'Flower2', 'Lotus', 'Rose', 'Tulip', 'Sunflower', 'Mushroom', 'Cactus', 'Vine',
    'Grass', 'Reed', 'Bamboo', 'Palm', 'Branch', 'Log', 'Wood', 'Campfire', 'Fire',
    'Water', 'Droplet', 'Droplets', 'Waves', 'Sea', 'Ocean', 'River', 'Lake', 'Pond',
    'Fish', 'FishSymbol', 'Bug', 'Butterfly', 'Bee', 'Ladybug', 'Caterpillar', 'Spider',
    'Web', 'Snake', 'Lizard', 'Dragon', 'Turtle', 'Snail', 'Shell', 'Crab', 'Shrimp'
  ]
};

// ============================================
// Utility Functions
// ============================================

const RECENT_ICONS_STORAGE_KEY = 'smart-habit-tracker-recent-icons';

const getRecentIconsFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_ICONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRecentIconsToStorage = (icons: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RECENT_ICONS_STORAGE_KEY, JSON.stringify(icons.slice(0, 12)));
  } catch {
    // Ignore storage errors
  }
};

const addToRecentIcons = (iconName: string, currentRecent: string[]): string[] => {
  const filtered = currentRecent.filter(name => name !== iconName);
  const updated = [iconName, ...filtered];
  return updated.slice(0, 12); // Keep only 12 most recent
};

// ============================================
// Icon Picker Modal Component
// ============================================

export function IconPickerModal({
  isOpen,
  onClose,
  onIconSelect,
  currentIcon,
  recentIcons: propRecentIcons
}: IconPickerModalProps) {
  // State
  const [activeCategory, setActiveCategory] = useState<string>('Core Habits');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(currentIcon || '');
  const [recentIcons, setRecentIcons] = useState<string[]>(propRecentIcons || getRecentIconsFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveCategory('Core Habits');
      setSearchQuery('');
      setSelectedIcon(currentIcon || '');
      setRecentIcons(propRecentIcons || getRecentIconsFromStorage());
      // Focus search input after animation
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, currentIcon, propRecentIcons]);

  // Get all icons from all categories for search
  const allIcons = useMemo(() => {
    const icons: IconData[] = [];
    Object.entries(ICON_CATEGORIES).forEach(([category, iconNames]) => {
      iconNames.forEach(iconName => {
        icons.push({ name: iconName, category });
      });
    });
    return icons;
  }, []);

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    let result: IconData[];

    if (!searchQuery.trim()) {
      result = ICON_CATEGORIES[activeCategory]?.map(name => ({
        name,
        category: activeCategory
      })) || [];
    } else {
      result = allIcons.filter(icon =>
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [searchQuery, activeCategory, allIcons]);

  // Get icon component from lucide-react
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> =
      LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return iconMap[iconName] || null;
  };

  // Handle icon selection
  const handleIconSelect = useCallback((iconName: string) => {
    setSelectedIcon(iconName);
    const updatedRecent = addToRecentIcons(iconName, recentIcons);
    setRecentIcons(updatedRecent);
    saveRecentIconsToStorage(updatedRecent);
  }, [recentIcons]);

  // Handle apply button
  const handleApply = useCallback(() => {
    if (selectedIcon) {
      onIconSelect(selectedIcon);
      onClose();
    }
  }, [selectedIcon, onIconSelect, onClose]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && selectedIcon) {
      handleApply();
    }
  }, [onClose, selectedIcon, handleApply]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-[#0a0f1d] border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl h-[88dvh] sm:max-h-[90vh] sm:h-auto overflow-hidden flex flex-col safe-area-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/50 p-4 sm:p-6">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Choose an Icon</h2>
            <p className="text-sm text-slate-400 mt-1">
              {selectedIcon ? (
                <>Selected: <span className="text-sky-400 font-semibold">{selectedIcon}</span></>
              ) : (
                'Select an icon for your habit'
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="touch-target flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all shrink-0"
            aria-label="Close"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[48px] pl-10 pr-10 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
              aria-label="Search icons"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 touch-target flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Clear search"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Recently Used Icons */}
          {!searchQuery && recentIcons.length > 0 && (
            <div className="border-b border-slate-800/50">
              <div className="flex items-center gap-2 px-6 py-3 bg-slate-800/30">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-400">Recently Used</span>
              </div>
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {recentIcons.map((iconName) => {
                    const IconComponent = getIconComponent(iconName);
                    const isSelected = selectedIcon === iconName;

                    if (!IconComponent) return null;

                    return (
                      <button
                        key={iconName}
                        onClick={() => handleIconSelect(iconName)}
                        className={`
                          min-h-[48px] aspect-square rounded-xl flex items-center justify-center transition-all duration-200 press-feedback
                          ${isSelected
                            ? 'bg-gradient-to-br from-sky-500/30 to-purple-600/30 border-2 border-sky-500/60 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                            : 'bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600/60'
                          }
                        `}
                        aria-label={`Select ${iconName} icon`}
                        aria-selected={isSelected}
                        title={iconName}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          {!searchQuery && (
            <div className="border-b border-slate-800/50">
              <div className="overflow-x-auto scrollbar-none native-scroll-x">
                <div className="flex gap-2 px-4 sm:px-6 py-3 sm:py-4 min-w-max">
                  {Object.keys(ICON_CATEGORIES).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`
                        touch-target px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                        ${activeCategory === category
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-slate-700/40 hover:text-slate-300'
                        }
                      `}
                      aria-label={`Show ${category} icons`}
                      aria-pressed={activeCategory === category}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Icons Grid */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 scroll-momentum">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={searchQuery ? 'search' : activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2"
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
                        onClick={() => handleIconSelect(name)}
                        className={`
                          min-h-[48px] aspect-square rounded-xl flex items-center justify-center transition-all duration-200 press-feedback
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
                    <div className="col-span-full py-12 text-center text-slate-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No icons found matching "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Result Count */}
          <div className="px-4 sm:px-6 py-3 border-t border-slate-800/50 bg-slate-800/30">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {searchQuery ? (
                  <>{filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} found</>
                ) : (
                  <>{filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} in {activeCategory}</>
                )}
              </span>
              <span className="hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 bg-slate-700/50 rounded text-slate-400">Esc</kbd> to close,
                <kbd className="px-1.5 py-0.5 bg-slate-700/50 rounded text-slate-400 ml-1">Enter</kbd> to apply
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-800/50">
          <button
            onClick={onClose}
            className="touch-target px-5 rounded-xl text-sm font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-all"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedIcon}
            className="touch-target px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500 to-purple-600 text-white hover:from-sky-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-glow"
            type="button"
          >
            Apply Icon
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Display Name
// ============================================

IconPickerModal.displayName = 'IconPickerModal';

// ============================================
// Default Export
// ============================================

export default IconPickerModal;
