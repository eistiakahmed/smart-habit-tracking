/**
 * Recent Icons Tracking Utility
 * Manages recently used icons for quick access in the icon picker
 */

const RECENT_ICONS_STORAGE_KEY = 'habit_tracker_recent_icons';
const MAX_RECENT_ICONS = 20;

/**
 * Get recent icons from localStorage
 * @param maxCount - Maximum number of icons to return (default: 10)
 * @returns Array of recent icon names, most recent first
 */
export function getRecentIcons(maxCount: number = 10): string[] {
  try {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(RECENT_ICONS_STORAGE_KEY);
    if (!stored) return [];

    const icons = JSON.parse(stored) as string[];

    // Validate and filter out any invalid icon names
    const validIcons = icons.filter(icon => typeof icon === 'string' && icon.length > 0);

    // Return most recent first, limited to maxCount
    return validIcons.slice(0, maxCount);
  } catch (error) {
    console.error('Error reading recent icons from localStorage:', error);
    return [];
  }
}

/**
 * Add an icon to the recent icons list
 * Moves the icon to the front if it already exists
 * Keeps only the top MAX_RECENT_ICONS most recent
 * @param iconName - The icon name to add
 */
export function addRecentIcon(iconName: string): void {
  try {
    if (typeof window === 'undefined') return;

    if (!iconName || typeof iconName !== 'string') {
      console.warn('Invalid icon name provided to addRecentIcon');
      return;
    }

    // Get current recent icons
    const currentIcons = getRecentIcons(MAX_RECENT_ICONS);

    // Remove the icon if it already exists (to move it to front)
    const filteredIcons = currentIcons.filter(icon => icon !== iconName);

    // Add the icon to the front
    const updatedIcons = [iconName, ...filteredIcons];

    // Keep only the top MAX_RECENT_ICONS
    const trimmedIcons = updatedIcons.slice(0, MAX_RECENT_ICONS);

    // Save to localStorage
    localStorage.setItem(RECENT_ICONS_STORAGE_KEY, JSON.stringify(trimmedIcons));
  } catch (error) {
    console.error('Error saving recent icons to localStorage:', error);
  }
}

/**
 * Clear all recent icons from localStorage
 */
export function clearRecentIcons(): void {
  try {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(RECENT_ICONS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recent icons from localStorage:', error);
  }
}

/**
 * Get the total count of recent icons stored
 * @returns Number of recent icons stored
 */
export function getRecentIconsCount(): number {
  return getRecentIcons(MAX_RECENT_ICONS).length;
}

/**
 * Check if an icon is in the recent icons list
 * @param iconName - The icon name to check
 * @returns true if the icon is in recent icons
 */
export function isRecentIcon(iconName: string): boolean {
  const recentIcons = getRecentIcons(MAX_RECENT_ICONS);
  return recentIcons.includes(iconName);
}

/**
 * Migrate legacy emoji data to new icon format (optional utility)
 * This can be used during data migration to convert old emoji favorites
 * @param emojiIcons - Array of emoji icons to migrate
 */
export function migrateLegacyEmojiIcons(emojiIcons: string[]): void {
  const { EMOJI_TO_LUCIDE_MAP } = require('./iconUtils');

  try {
    const currentIcons = getRecentIcons(MAX_RECENT_ICONS);

    emojiIcons.forEach(emoji => {
      const lucideIcon = EMOJI_TO_LUCIDE_MAP[emoji];
      if (lucideIcon && !currentIcons.includes(lucideIcon)) {
        addRecentIcon(lucideIcon);
      }
    });
  } catch (error) {
    console.error('Error migrating legacy emoji icons:', error);
  }
}