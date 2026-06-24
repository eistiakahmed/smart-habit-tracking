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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 glass-panel rounded-2xl border border-slate-800/80">
        <Target className="w-12 h-12 mb-4 opacity-30 text-sky-400" />
        <p className="text-lg font-bold text-slate-300">No habits tracked yet</p>
        <p className="text-sm text-slate-500 mt-1">Start by creating your first daily habit</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      <div className="px-6 py-4.5 border-b border-slate-800/80 bg-slate-900/40">
        <h2 className="text-lg font-bold text-white font-sans">30-Day Habit Grid</h2>
        <p className="text-xs text-slate-400 mt-1">Click on any day index to mark progress</p>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-max">
          <div className="flex items-center gap-4 px-6 py-3.5 bg-slate-950/40 border-b border-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {/* Header Sticky Left Column Background Matching Row */}
            <div className="flex-shrink-0 w-44 sticky left-0 bg-[#080d19] z-10">Habit Name</div>
            <div className="flex gap-2 flex-1 items-center pl-3">
              <span className="text-sky-400 font-bold tracking-wider">Week 1</span>
              <span className="w-px h-4 bg-slate-800 mx-6" />
              <span className="text-orange-400 font-bold tracking-wider">Week 2</span>
              <span className="w-px h-4 bg-slate-800 mx-6" />
              <span className="text-emerald-400 font-bold tracking-wider">Week 3</span>
              <span className="w-px h-4 bg-slate-800 mx-6" />
              <span className="text-purple-400 font-bold tracking-wider">Week 4</span>
            </div>
            <div className="flex-shrink-0 w-20 text-right pr-2">Progress</div>
          </div>

          <div className="bg-[#080d19]/40">
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
