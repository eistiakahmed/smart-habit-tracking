/**
 * HabitIcon Component
 * Centralized icon renderer for habits with fallback logic
 *
 * Priority: user icon > category default > fallback icon
 * Handles both legacy emoji strings and new Lucide icon names
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CATEGORY_DEFAULT_ICONS, normalizeIcon, type LucideIconName } from '@/lib/utils/iconUtils';

// ============================================
// Props Interface
// ============================================

interface HabitIconProps {
  /** User-selected icon name or legacy emoji string */
  icon?: string;
  /** Habit category for fallback to category default */
  category?: string;
  /** Icon color (defaults to #0ea5e9) */
  color?: string;
  /** Icon dimensions in pixels (defaults to 20) */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Ultimate fallback icon (defaults to 'Target') */
  fallbackIcon?: string;
}

// ============================================
// Component
// ============================================

/**
 * Renders a habit icon with fallback logic
 *
 * @param icon - User-selected icon (emoji or Lucide name)
 * @param category - Category for default icon fallback
 * @param color - Icon color
 * @param size - Icon size in pixels
 * @param className - Additional CSS classes
 * @param fallbackIcon - Ultimate fallback icon name
 */
export const HabitIcon: React.FC<HabitIconProps> = ({
  icon,
  category,
  color = '#0ea5e9',
  size = 20,
  className = '',
  fallbackIcon = 'Target'
}) => {
  // ============================================
  // Icon Resolution Logic
  // ============================================

  /**
   * Determines which icon to render based on priority:
   * 1. User-provided icon (emoji or Lucide name)
   * 2. Category default icon
   * 3. Ultimate fallback icon
   */
  const getIconName = (): LucideIconName => {
    // Try user-provided icon first
    if (icon) {
      const normalized = normalizeIcon(icon);
      if (normalized) {
        return normalized;
      }
    }

    // Fall back to category default
    if (category && CATEGORY_DEFAULT_ICONS[category]) {
      return CATEGORY_DEFAULT_ICONS[category];
    }

    // Ultimate fallback
    return normalizeIcon(fallbackIcon) || 'Target';
  };

  const iconName = getIconName();

  // ============================================
  // Lucide Icon Component Lookup
  // ============================================

  /**
   * Dynamically retrieves the Lucide icon component by name
   * This is safe because iconName is guaranteed to be a valid LucideIconName
   */
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{
    size?: number;
    color?: string;
    className?: string;
  }>;

  // If icon component doesn't exist (shouldn't happen with validation), render Target
  if (!IconComponent) {
    const TargetIcon = LucideIcons.Target;
    return (
      <TargetIcon
        size={size}
        color={color}
        className={className}
        aria-label="Habit icon"
      />
    );
  }

  // ============================================
  // Render
  // ============================================

  return (
    <IconComponent
      size={size}
      color={color}
      className={className}
      aria-label={`Habit icon: ${iconName}`}
    />
  );
};

// ============================================
// Display Name
// ============================================

HabitIcon.displayName = 'HabitIcon';

// ============================================
// Default Export
// ============================================

export default HabitIcon;
