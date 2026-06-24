/**
 * Icon Utilities for Habit Tracker
 * Centralizes icon mapping and validation for Lucide React icons
 */

// ============================================
// Type Definitions
// ============================================

/**
 * Union type of all supported Lucide icon names
 * Includes 100+ icons organized by domain for comprehensive coverage
 */
export type LucideIconName =
  // Core & UI Icons
  | 'Target' | 'Star' | 'Flame' | 'Heart' | 'BookOpen' | 'Dumbbell' | 'Droplets' | 'Brain' | 'Apple' | 'Zap'
  | 'CheckCircle' | 'Moon' | 'Sun' | 'Coins' | 'Music' | 'Palette' | 'DollarSign' | 'Users' | 'Home' | 'Calendar'
  | 'Clock' | 'Settings' | 'TrendingUp' | 'TrendingDown' | 'Award' | 'Coffee' | 'Smile' | 'Frown' | 'Meh' | 'Activity'
  | 'BarChart' | 'LineChart' | 'PieChart' | 'Lightbulb' | 'Pencil' | 'Trash' | 'Plus' | 'Minus' | 'X' | 'Search'
  | 'Filter' | 'Sort' | 'ChevronDown' | 'ChevronUp' | 'ChevronLeft' | 'ChevronRight'
  | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'RefreshCw' | 'Download' | 'Upload' | 'Share'
  | 'Copy' | 'Clipboard' | 'Eye' | 'EyeOff' | 'Lock' | 'Unlock' | 'Bell' | 'HelpCircle' | 'Info'
  // Sports & Athletics (15 icons)
  | 'Trophy' | 'Medal' | 'Flag' | 'Mountain' | 'Bike' | 'Stretch' | 'Timer' | 'Zap' | 'Target'
  | 'IceSkating' | 'Skiing' | 'Surfing' | 'Swimming' | 'PersonStanding' | 'Running'
  // Work & Productivity (12 icons)
  | 'Briefcase' | 'Laptop' | 'Phone' | 'Calendar' | 'Clock' | 'Timer' | 'CheckCircle' | 'ListChecks'
  | 'FolderOpen' | 'FileText' | 'Archive' | 'Inbox'
  // Finance & Business (10 icons)
  | 'DollarSign' | 'Coins' | 'CreditCard' | 'PiggyBank' | 'Wallet' | 'TrendingUp' | 'TrendingDown'
  | 'BarChart' | 'PieChart' | 'LineChart'
  // Education & Learning (12 icons)
  | 'GraduationCap' | 'Globe' | 'Languages' | 'PenTool' | 'Scroll' | 'Library' | 'Bookmark'
  | 'Highlighter' | 'Calculator' | 'Ruler' | 'Compass' | 'Microscope'
  // Lifestyle & Home (10 icons)
  | 'Home' | 'Building2' | 'Utensils' | 'Coffee' | 'Carrot' | 'Wine' | 'ShoppingBag' | 'Couch' | 'Lamp' | 'TreePine'
  // Travel & Adventure (10 icons)
  | 'Plane' | 'Car' | 'Train' | 'Ship' | 'MapPin' | 'Compass' | 'Mountain' | 'Tent' | 'Camera' | 'Backpack'
  // Technology & Gaming (12 icons)
  | 'Wifi' | 'Bluetooth' | 'Headphones' | 'Keyboard' | 'Mouse' | 'Monitor' | 'Smartphone'
  | 'Gamepad' | 'Code' | 'Terminal' | 'Database' | 'Server'
  // Mindfulness & Wellness (12 icons)
  | 'Smile' | 'Sun' | 'Moon' | 'TreePine' | 'Spa' | 'Wind' | 'Leaf' | 'Flower' | 'Sparkles'
  | 'Infinity' | 'Cloud' | 'Rainbow'
  // Hobbies & Creative (15 icons)
  | 'Palette' | 'Music' | 'Camera' | 'Wand2' | 'Paintbrush' | 'Guitar' | 'Piano' | 'Clapperboard'
  | 'Brush' | 'Scissors' | 'Frame' | 'Image' | 'Video' | 'Mic' | 'Feather'
  // Social & Communication (8 icons)
  | 'Users' | 'MessageCircle' | 'Phone' | 'Mail' | 'Handshake' | 'Heart' | 'Bell' | 'Share2';

// ============================================
// Category to Icon Mappings
// ============================================

/**
 * Default Lucide icon for each habit category
 */
export const CATEGORY_DEFAULT_ICONS: Record<string, LucideIconName> = {
  'Health': 'Droplets',
  'Fitness': 'Dumbbell',
  'Learning': 'BookOpen',
  'Mental Health': 'Brain',
  'Nutrition': 'Apple',
  'Productivity': 'Zap',
  'Goals': 'Target',
  'Wellness': 'Heart',
  'Finance': 'DollarSign',
  'Relationships': 'Users',
  'Creativity': 'Palette',
  'Spirituality': 'Sun',
  // Sports & Athletics
  'Sports': 'Trophy',
  'Athletics': 'Medal',
  'Exercise': 'Dumbbell',
  // Work & Productivity
  'Work': 'Briefcase',
  'Business': 'Laptop',
  'Office': 'Building2',
  // Education & Learning
  'Education': 'GraduationCap',
  'Study': 'Library',
  'Research': 'Microscope',
  // Lifestyle & Home
  'Home': 'Home',
  'Cooking': 'Utensils',
  'Gardening': 'TreePine',
  // Travel & Adventure
  'Travel': 'Plane',
  'Adventure': 'Mountain',
  'Exploration': 'Compass',
  // Technology & Gaming
  'Technology': 'Laptop',
  'Gaming': 'Gamepad',
  'Programming': 'Code',
  // Mindfulness & Wellness
  'Mindfulness': 'Spa',
  'Meditation': 'Moon',
  'Relaxation': 'Wind',
  // Hobbies & Creative
  'Hobbies': 'Palette',
  'Arts': 'Paintbrush',
  'Entertainment': 'Clapperboard',
  // Social & Communication
  'Social': 'Users',
  'Communication': 'MessageCircle',
  'Networking': 'Handshake',
};

// ============================================
// Icon Picker Categories
// ============================================

/**
 * Organizes icons by domain for the icon picker UI
 */
export const ICON_PICKER_CATEGORIES: Record<string, LucideIconName[]> = {
  'Sports & Athletics': [
    'Trophy', 'Medal', 'Award', 'Flag', 'Mountain', 'Bike', 'Stretch', 'Timer', 'Flame', 'Zap',
    'Target', 'IceSkating', 'Skiing', 'Surfing', 'Swimming', 'PersonStanding', 'Running'
  ],
  'Work & Productivity': [
    'Briefcase', 'Laptop', 'Phone', 'Calendar', 'Clock', 'Timer', 'CheckCircle', 'ListChecks',
    'FolderOpen', 'FileText', 'Archive', 'Inbox'
  ],
  'Finance & Business': [
    'DollarSign', 'Coins', 'CreditCard', 'PiggyBank', 'Wallet', 'TrendingUp', 'TrendingDown',
    'BarChart', 'PieChart', 'LineChart'
  ],
  'Education & Learning': [
    'GraduationCap', 'Globe', 'Languages', 'PenTool', 'Scroll', 'Library', 'Bookmark',
    'Highlighter', 'Calculator', 'Ruler', 'Compass', 'Microscope', 'BookOpen'
  ],
  'Lifestyle & Home': [
    'Home', 'Building2', 'Utensils', 'Coffee', 'Carrot', 'Wine', 'ShoppingBag', 'Couch',
    'Lamp', 'TreePine', 'Apple'
  ],
  'Travel & Adventure': [
    'Plane', 'Car', 'Train', 'Ship', 'MapPin', 'Compass', 'Mountain', 'Tent', 'Camera', 'Backpack'
  ],
  'Technology & Gaming': [
    'Wifi', 'Bluetooth', 'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Smartphone', 'Gamepad',
    'Code', 'Terminal', 'Database', 'Server'
  ],
  'Mindfulness & Wellness': [
    'Smile', 'Sun', 'Moon', 'TreePine', 'Spa', 'Wind', 'Leaf', 'Flower', 'Sparkles',
    'Infinity', 'Cloud', 'Rainbow', 'Droplets', 'Brain', 'Heart'
  ],
  'Hobbies & Creative': [
    'Palette', 'Music', 'Camera', 'Wand2', 'Paintbrush', 'Guitar', 'Piano', 'Clapperboard',
    'Brush', 'Scissors', 'Frame', 'Image', 'Video', 'Mic', 'Feather'
  ],
  'Social & Communication': [
    'Users', 'MessageCircle', 'Phone', 'Mail', 'Handshake', 'Heart', 'Bell', 'Share2'
  ],
  'Core & UI Icons': [
    'Star', 'Flame', 'Target', 'CheckCircle', 'Award', 'Activity', 'Settings', 'Search',
    'Filter', 'Sort', 'Plus', 'Minus', 'X', 'Trash', 'Pencil', 'Lightbulb', 'HelpCircle', 'Info'
  ],
  'Navigation & Actions': [
    'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'ArrowUp', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'RefreshCw', 'Download', 'Upload', 'Share', 'Copy', 'Clipboard',
    'Eye', 'EyeOff', 'Lock', 'Unlock'
  ],
  'Emotions': [
    'Smile', 'Frown', 'Meh', 'Heart'
  ]
};

// ============================================
// Emoji to Lucide Migration Map
// ============================================

/**
 * Maps legacy emoji icons to Lucide icon names
 * Used for backward compatibility and data migration
 */
export const EMOJI_TO_LUCIDE_MAP: Record<string, LucideIconName> = {
  '🎯': 'Target',
  '⭐': 'Star',
  '🔥': 'Flame',
  '❤️': 'Heart',
  '📚': 'BookOpen',
  '💪': 'Dumbbell',
  '💧': 'Droplets',
  '🧠': 'Brain',
  '🍎': 'Apple',
  '⚡': 'Zap',
  '✅': 'CheckCircle',
  '🌙': 'Moon',
  '☀️': 'Sun',
  '💰': 'Coins',
  '🎵': 'Music',
  '🎨': 'Palette',
};

// ============================================
// Helper Functions
// ============================================

/**
 * Validates if a string is a valid Lucide icon name
 * @param iconName - The icon name to validate
 * @returns true if the icon name is valid
 */
export function isValidIconName(iconName: string): iconName is LucideIconName {
  const validIcons: Set<string> = new Set([
    // Core & UI Icons
    'Target', 'Star', 'Flame', 'Heart', 'BookOpen', 'Dumbbell', 'Droplets', 'Brain', 'Apple', 'Zap',
    'CheckCircle', 'Moon', 'Sun', 'Coins', 'Music', 'Palette', 'DollarSign', 'Users', 'Home', 'Calendar',
    'Clock', 'Settings', 'TrendingUp', 'TrendingDown', 'Award', 'Coffee', 'Smile', 'Frown', 'Meh', 'Activity',
    'BarChart', 'LineChart', 'PieChart', 'Lightbulb', 'Pencil', 'Trash', 'Plus', 'Minus', 'X', 'Search',
    'Filter', 'Sort', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'RefreshCw', 'Download', 'Upload', 'Share',
    'Copy', 'Clipboard', 'Eye', 'EyeOff', 'Lock', 'Unlock', 'Bell', 'HelpCircle', 'Info',
    // Sports & Athletics
    'Trophy', 'Medal', 'Flag', 'Mountain', 'Bike', 'Stretch', 'Timer', 'IceSkating', 'Skiing',
    'Surfing', 'Swimming', 'PersonStanding', 'Running',
    // Work & Productivity
    'Briefcase', 'Laptop', 'Phone', 'ListChecks', 'FolderOpen', 'FileText', 'Archive', 'Inbox',
    // Finance & Business
    'CreditCard', 'PiggyBank', 'Wallet',
    // Education & Learning
    'GraduationCap', 'Globe', 'Languages', 'PenTool', 'Scroll', 'Library', 'Bookmark', 'Highlighter',
    'Calculator', 'Ruler', 'Compass', 'Microscope',
    // Lifestyle & Home
    'Building2', 'Utensils', 'Carrot', 'Wine', 'ShoppingBag', 'Couch', 'Lamp', 'TreePine',
    // Travel & Adventure
    'Plane', 'Car', 'Train', 'Ship', 'MapPin', 'Tent', 'Camera', 'Backpack',
    // Technology & Gaming
    'Wifi', 'Bluetooth', 'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Smartphone', 'Gamepad',
    'Code', 'Terminal', 'Database', 'Server',
    // Mindfulness & Wellness
    'TreePine', 'Spa', 'Wind', 'Leaf', 'Flower', 'Sparkles', 'Infinity', 'Cloud', 'Rainbow',
    // Hobbies & Creative
    'Wand2', 'Paintbrush', 'Guitar', 'Piano', 'Clapperboard', 'Brush', 'Scissors', 'Frame', 'Image', 'Video', 'Mic', 'Feather',
    // Social & Communication
    'MessageCircle', 'Mail', 'Handshake', 'Share2',
  ]);

  return validIcons.has(iconName);
}

/**
 * Normalizes icon input to a valid Lucide icon name
 * Handles emoji strings and validates icon names
 * @param iconInput - Emoji string or Lucide icon name
 * @returns Normalized Lucide icon name, or null if invalid
 */
export function normalizeIcon(iconInput: string): LucideIconName | null {
  // If it's an emoji, migrate to Lucide icon
  if (EMOJI_TO_LUCIDE_MAP[iconInput]) {
    return EMOJI_TO_LUCIDE_MAP[iconInput];
  }

  // If it's already a Lucide icon name, validate it
  if (isValidIconName(iconInput)) {
    return iconInput;
  }

  // Invalid icon
  return null;
}

/**
 * Gets the default icon for a category
 * @param category - The habit category
 * @returns Default Lucide icon name for the category, or Target as fallback
 */
export function getDefaultIconForCategory(category: string): LucideIconName {
  return CATEGORY_DEFAULT_ICONS[category] || 'Target';
}

/**
 * Converts any icon representation to a Lucide icon name
 * Handles emojis, category names, and direct icon names
 * @param icon - The icon to convert (emoji, category name, or icon name)
 * @returns Lucide icon name, or Target as fallback
 */
export function toLucideIcon(icon: string | undefined): LucideIconName {
  if (!icon) {
    return 'Target';
  }

  const normalized = normalizeIcon(icon);
  if (normalized) {
    return normalized;
  }

  // Check if it's a category name
  if (CATEGORY_DEFAULT_ICONS[icon]) {
    return CATEGORY_DEFAULT_ICONS[icon];
  }

  return 'Target';
}

/**
 * Gets all icons available in a specific picker category
 * @param category - The icon picker category name
 * @returns Array of icon names in the category, or empty array if category not found
 */
export function getIconsByCategory(category: string): LucideIconName[] {
  return ICON_PICKER_CATEGORIES[category] || [];
}

/**
 * Gets all available icon picker category names
 * @returns Array of category names
 */
export function getIconCategories(): string[] {
  return Object.keys(ICON_PICKER_CATEGORIES);
}

/**
 * Gets the total count of all available icons
 * @returns Total number of unique icons across all categories
 */
export function getTotalIconCount(): number {
  const allIcons = new Set<LucideIconName>();
  Object.values(ICON_PICKER_CATEGORIES).forEach(categoryIcons => {
    categoryIcons.forEach(icon => allIcons.add(icon as LucideIconName));
  });
  return allIcons.size;
}
