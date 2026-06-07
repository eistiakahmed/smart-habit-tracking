'use client';

import { useState } from 'react';
import HabitRow from './HabitRow';
import { HabitWithProgress } from '@/types';
import { Target } from 'lucide-react';

interface HabitGridProps {
  habits: HabitWithProgress[];
  onDayToggle?: (habitId: string, dayIndex: number) => void;
  loading?: boolean;
}

export default function HabitGrid({ habits, onDayToggle, loading = false }: HabitGridProps) {
  const [toggling, setToggling] = useState<{ habitId: string; dayIndex: number } | null>(null);

  const handleDayToggle = async (habitId: string, dayIndex: number) => {
    if (toggling) return;

    setToggling({ habitId, dayIndex });
    try {
      await onDayToggle?.(habitId, dayIndex);
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Target className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No habits yet</p>
        <p className="text-sm">Start by creating your first habit</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">30-Day Habit Tracker</h2>
        <p className="text-sm text-gray-500 mt-1">Click on any day to mark as completed</p>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-max">
          <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex-shrink-0 w-40">Habit</div>
            <div className="flex gap-2 flex-1 items-center">
              <span className="text-blue-500 font-semibold">Week 1</span>
              <span className="w-px h-4 bg-gray-300 mx-4" />
              <span className="text-orange-500 font-semibold">Week 2</span>
              <span className="w-px h-4 bg-gray-300 mx-4" />
              <span className="text-green-500 font-semibold">Week 3</span>
              <span className="w-px h-4 bg-gray-300 mx-4" />
              <span className="text-purple-500 font-semibold">Week 4</span>
            </div>
            <div className="flex-shrink-0 w-20 text-right">Progress</div>
          </div>

          <div>
            {habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habitName={habit.title}
                days={habit.days}
                color={habit.color}
                category={habit.category}
                icon={habit.icon}
                onDayToggle={(dayIndex) => handleDayToggle(habit.id, dayIndex)}
                disabled={toggling?.habitId === habit.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
