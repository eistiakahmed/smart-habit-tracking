export type Frequency = 'DAILY' | 'WEEKLY' | 'CUSTOM';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

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
  icon?: string;
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
  icon?: string;
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
    icon?: string;
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
