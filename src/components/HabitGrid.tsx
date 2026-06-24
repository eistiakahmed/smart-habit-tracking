'use client';

import { useState } from 'react';
import HabitRow from './HabitRow';
import { HabitWithProgress } from '@/types';
import { Target } from 'lucide-react';
import { getWeekColors } from '@/lib/utils';

interface HabitGridProps {
  habits: HabitWithProgress[];
  onDayToggle?: (habitId: string, dayIndex: number) => void;
  loading?: boolean;
  todayDate?: string;
}

const WEEK_LABELS = ['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4', 'WEEK 5'];
const WEEK_COLORS = [...Object.values(getWeekColors()), '#ec4899']; // pink for week 5

export default function HabitGrid({ habits, onDayToggle, loading = false, todayDate = '' }: HabitGridProps) {
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
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 glass-panel rounded-2xl border border-slate-800/80">
        <Target className="w-10 h-10 mb-3 opacity-30 text-sky-400" />
        <p className="text-base font-bold text-slate-300">No habits tracked yet</p>
        <p className="text-xs text-slate-500 mt-1">Start by creating your first daily habit</p>
      </div>
    );
  }

  return (
    <div
      className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl"
      style={{ '--habit-row-bg': '#080d19' } as React.CSSProperties}
    >
      {/* Panel header */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/40">
        <h2 className="text-base sm:text-lg font-bold text-white">30-Day Habit Grid</h2>
        <p className="text-[10px] text-slate-400 mt-0.5">Click an incomplete day to mark progress</p>
      </div>

      {/* Column header row — must mirror HabitRow layout exactly */}
      <div className="flex items-center border-b border-slate-800/60 bg-[#080d19]/60 overflow-x-auto scrollbar-none">
        {/* Habit name column — matches sticky left column */}
        <div className="flex-shrink-0 w-36 sm:w-48 px-4 sm:px-6 py-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Habit Name</span>
        </div>

        {/* Week label columns — width = p-1.5 (6px×2) + 4×w-6 (96px) + 3×gap-1 (12px) = 120px */}
        {(() => {
          const maxDays = Math.max(...habits.map(h => h.days?.length ?? 0), 0);
          const weekCount = Math.min(Math.ceil(maxDays / 7), 5);
          return (
            <div className="flex items-center gap-3 sm:gap-5 px-3 sm:px-4 py-2 flex-1">
              {WEEK_LABELS.slice(0, weekCount).map((label, i) => (
                <div
                  key={label}
                  className="flex-shrink-0 text-center"
                  style={{ width: '120px' }}
                >
                  <span
                    className="text-[9px] font-black uppercase tracking-widest"
                    style={{ color: WEEK_COLORS[i] }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          );
        })()}

        <div className="flex-shrink-0 pr-4 sm:pr-6 hidden sm:block">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Done</span>
        </div>
      </div>

      {/* Habit rows */}
      <div style={{ background: '#080d19' }}>
        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
                habitName={habit.title}
                days={habit.days}
                dayDates={habit.dayDates}
                habitStartDate={habit.startDate}
                color={habit.color}
            category={habit.category}
            icon={habit.icon}
            onDayToggle={(dayIndex) => handleDayToggle(habit.id, dayIndex)}
            disabled={toggling?.habitId === habit.id}
            todayDate={todayDate}
          />
        ))}
      </div>
    </div>
  );
}
