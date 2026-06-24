'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MobileHabitTracker from '@/components/MobileHabitTracker';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { formatLocalDate, getDaysInMonth } from '@/lib/utils';
import { Habit, HabitWithProgress } from '@/types';

export default function MobilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsWithProgress, setHabitsWithProgress] = useState<HabitWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHabits();
    }
  }, [isAuthenticated]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getHabits({ isActive: true, limit: 20 });

      const habitsWithDays: HabitWithProgress[] = await Promise.all(
        response.habits.map(async (habit) => {
          let days: boolean[] = [];
          let dayDates: string[] = [];

          try {
            const progressData = await api.getHabitProgress(habit.id);
            const generated = generateDaysFromProgress(progressData.dailyProgress);
            days = generated.days;
            dayDates = generated.dayDates;
          } catch (progressErr) {
            console.warn(`Failed to fetch progress for habit ${habit.id}, using empty data:`, progressErr);
            dayDates = generateCurrentMonthDates();
            days = Array(dayDates.length).fill(false);
          }

          return {
            ...habit,
            days,
            dayDates,
            weeklyProgress: calculateWeeklyProgress(days),
          };
        })
      );

      setHabits(response.habits);
      setHabitsWithProgress(habitsWithDays);
    } catch (err: any) {
      console.error('Failed to fetch habits:', err);

      if (err.message?.includes('Unauthorized') || err.message?.includes('401') || err.message?.includes('Session expired')) {
        router.push('/login');
        return;
      }

      setError(err.message || 'Failed to load habits. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const generateDaysFromProgress = (
    dailyProgress: Array<{ date: string; completed: boolean }> | undefined
  ): { days: boolean[]; dayDates: string[] } => {
    const dayDates = generateCurrentMonthDates();
    const days = new Array(dayDates.length).fill(false);

    for (let i = 0; i < dayDates.length; i++) {
      const dateString = dayDates[i];

      if (dailyProgress) {
        const found = dailyProgress.find((dp) => dp.date === dateString);

        days[i] = found?.completed || false;
      }
    }

    return { days, dayDates };
  };

  const generateCurrentMonthDates = (): string[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    return Array.from({ length: daysInMonth }, (_, index) => (
      formatLocalDate(new Date(year, month, index + 1))
    ));
  };

  const calculateWeeklyProgress = (days: boolean[]): number[] => {
    const weeks: number[] = [];
    for (let i = 0; i < days.length; i += 7) {
      const weekDays = days.slice(i, i + 7);
      const completed = weekDays.filter(d => d).length;
      const percentage = (completed / weekDays.length) * 100;
      weeks.push(Math.round(percentage));
    }
    return weeks;
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      const result = await api.toggleHabit(habitId);

      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId
            ? {
                ...habit,
                todayCompleted: result.todayCompleted,
                stats: habit.stats
                  ? { ...habit.stats, currentStreak: result.streak }
                  : { currentStreak: result.streak, longestStreak: 0, completionRate: 0, daysCompleted: 0, totalDays: 0 }
              }
            : habit
        )
      );

      setHabitsWithProgress(prevHabits =>
        prevHabits.map(habit => {
          if (habit.id !== habitId) return habit;

          const today = formatLocalDate();
          const todayIndex = habit.dayDates?.indexOf(today) ?? -1;
          const days = [...habit.days];

          if (todayIndex >= 0) {
            days[todayIndex] = true;
          }

          return {
            ...habit,
            days,
            todayCompleted: result.todayCompleted,
            weeklyProgress: calculateWeeklyProgress(days),
          };
        })
      );

      setError(null);
    } catch (err: any) {
      console.error('Failed to toggle habit:', err);
      setError(err.message || 'Failed to toggle habit. Please try again.');
      setTimeout(() => setError(null), 4000);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your habits...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-900/90 backdrop-blur-sm border border-red-700 rounded-lg p-4 flex items-center gap-3">
          <span className="text-red-400 text-xl">⚠️</span>
          <div>
            <p className="text-red-200 font-medium">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}
      <MobileHabitTracker
        habits={habitsWithProgress}
        onToggleHabit={handleToggleHabit}
        onAddHabit={() => router.push('/habits/new')}
      />
    </>
  );
}
