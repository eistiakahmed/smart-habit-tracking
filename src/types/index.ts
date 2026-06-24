export type Frequency = 'DAILY' | 'WEEKLY' | 'CUSTOM';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

// Comprehensive Lucide icon names used throughout the app
export type LucideIconName =
  // Health & Fitness
  | 'heart' | 'heart-pulse' | 'activity' | 'brain' | 'lungs' | 'bone' | 'eye' | 'ear'
  | 'fitness' | 'dumbbell' | 'person-standing' | 'running' | 'bicycle' | 'swimming' | 'yoga'

  // Food & Nutrition
  | 'apple' | 'carrot' | 'coffee' | 'utensils' | 'fork-knife' | 'glass-water' | 'ice-cream'
  | 'pizza' | 'sandwich' | 'soup' | 'salad' | 'egg' | 'fish' | 'drumstick'

  // Mental Health & Wellness
  | 'sparkles' | 'star' | 'moon' | 'sun' | 'sunrise' | 'sunset' | 'cloud' | 'cloud-sun'
  | 'smile' | 'meh' | 'frown' | 'heart-handshake' | 'flower' | 'flower-2' | 'trees'

  // Productivity & Organization
  | 'check-circle' | 'check-circle-2' | 'circle-check' | 'check-square' | 'list-checks'
  | 'target' | 'crosshair' | 'flag' | 'bookmark' | 'bookmark-check' | 'archive'
  | 'calendar' | 'calendar-check' | 'clock' | 'timer' | 'hourglass' | 'alarm-clock'

  // Learning & Growth
  | 'book' | 'book-open' | 'graduation-cap' | 'lightbulb' | 'lightbulb-off' | 'idea'
  | 'pencil' | 'pen' | 'edit' | 'file-text' | 'scroll-text' | 'library' | 'globe'

  // Social & Relationships
  | 'users' | 'user' | 'user-plus' | 'user-check' | 'handshake' | 'message-square'
  | 'message-circle' | 'mail' | 'phone' | 'video' | 'heart-crack'

  // Sleep & Rest
  | 'bed' | 'bed-double' | 'moon-stars' | 'wind' | 'zap' | 'zap-off' | 'coffee-off'

  // Finance & Money
  | 'dollar-sign' | 'piggy-bank' | 'wallet' | 'credit-card' | 'banknote' | 'trending-up'
  | 'trending-down' | 'pie-chart' | 'bar-chart' | 'line-chart'

  // Environment & Nature
  | 'sun-medium' | 'cloud-rain' | 'snowflake' | 'thermometer' | 'thermometer-sun'
  | 'wind-rose' | 'mountain' | 'mountain-snow' | 'waves' | 'droplets'

  // Technology & Digital
  | 'smartphone' | 'laptop' | 'monitor' | 'tv' | 'gamepad' | 'wifi' | 'wifi-off'
  | 'bell' | 'bell-off' | 'volume' | 'volume-off' | 'phone-off'

  // Miscellaneous & Hobbies
  | 'music' | 'music-4' | 'palette' | 'brush' | 'camera' | 'image' | 'film'
  | 'gamepad-2' | 'dice' | 'puzzle' | 'teddy-bear' | 'gift' | 'crown'

  // Common Action Icons
  | 'plus' | 'minus' | 'x' | 'x-circle' | 'trash' | 'trash-2' | 'trash-icon'
  | 'rotate-ccw' | 'refresh-ccw' | 'undo' | 'redo' | 'settings' | 'settings-2'
  | 'more-horizontal' | 'more-vertical' | 'chevron-down' | 'chevron-up'
  | 'chevron-left' | 'chevron-right' | 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right'

  // Additional Common Icons
  | 'alert-circle' | 'alert-triangle' | 'info' | 'help-circle' | 'x-circle'
  | 'home' | 'home-icon' | 'layout-dashboard' | 'chart-line' | 'bar-chart-3'
  | 'trophy' | 'medal' | 'award' | 'flame' | 'zap' | 'wind'
  | 'smile-plus' | 'heart-plus' | 'star-half' | 'star-off';

// Backward compatible - allow both specific icon names and custom strings
export type IconField = LucideIconName | string;

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences?: Record<string, any>;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  userId: string;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  icon: string;
  color: string;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string;
  color?: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  daysCompleted: number;
  totalDays: number;
  averageMood?: number;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  color: string;
  icon?: IconField;
  frequency: Frequency;
  targetDays: number;
  startDate: string;
  endDate?: string;
  reminderTime?: string;
  isActive: boolean;
  difficulty: Difficulty;
  stats?: HabitStats;
  todayCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DayProgress {
  date: string;
  completed: boolean;
  mood?: number;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  completed: number;
  total: number;
  rate: number;
}

export interface HabitProgress {
  habitId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  stats: HabitStats;
  dailyProgress: DayProgress[];
  weeklySummary: WeeklySummary[];
}

export interface CreateHabitData {
  title: string;
  description?: string;
  category: string;
  color?: string;
  icon?: IconField;
  frequency?: Frequency;
  targetDays?: number;
  reminderTime?: string;
  difficulty?: Difficulty;
}

export interface ToggleHabitResponse {
  log: {
    id: string;
    habitId: string;
    userId: string;
    completedAt: string;
    note?: string;
    mood?: number;
  } | null;
  streak: number;
  todayCompleted: boolean;
}

export interface WeeklyData {
  week: string;
  completed: number;
  total: number;
  rate: number;
}

export interface HabitWithProgress extends Habit {
  days: boolean[];
  dayDates?: string[];
  weeklyProgress: number[];
}

export interface DailyProgress {
  date: string;
  summary: {
    totalHabits: number;
    completedHabits: number;
    completionRate: number;
    averageMood: number;
    currentStreak: number;
  };
  habits: Array<{
    habitId: string;
    title: string;
    category: string;
    completed: boolean;
    completedAt?: string;
    mood?: number;
    note?: string;
    streak: number;
    icon?: IconField;
    color: string;
  }>;
  hourlyBreakdown: Array<{
    hour: number;
    completed: number;
  }>;
  comparison: {
    previousDay: {
      date: string;
      completionRate: number;
      completed: number;
    };
    change: {
      rate: number;
      completed: number;
    };
  };
  upcomingReminders: Array<{
    habitId: string;
    title: string;
    reminderTime: string;
  }>;
}

export type ProgressView = 'daily' | 'weekly' | 'monthly';
