'use client';

import { useState } from 'react';
import DayCheckbox from './DayCheckbox';
import { getWeekColors, groupIntoWeeks } from '@/lib/utils';
import { Droplets, Dumbbell, BookOpen, Brain, Apple, Zap, Target, Heart } from 'lucide-react';

interface HabitRowProps {
  habitName: string;
  days: boolean[];
  color?: string;
  category?: string;
  icon?: string;
  onDayToggle?: (dayIndex: number) => void;
  disabled?: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  Health: Droplets,
  Fitness: Dumbbell,
  Learning: BookOpen,
  'Mental Health': Brain,
  Nutrition: Apple,
  Productivity: Zap,
  Goals: Target,
  Wellness: Heart,
};

export default function HabitRow({
  habitName,
  days,
  color = '#0ea5e9',
  category,
  icon,
  onDayToggle,
  disabled = false,
}: HabitRowProps) {
  const weekColors = getWeekColors();
  const weeks = groupIntoWeeks(days);
  const IconComponent = category ? categoryIcons[category] || Target : Target;

  const completedCount = days.filter(d => d).length;
  const progress = Math.round((completedCount / days.length) * 100);

  return (
    <div className="flex items-center gap-4 py-3.5 px-6 border-b border-slate-800/40 hover:bg-slate-900/30 transition-all group font-sans">
      {/* Sticky Left Column with Solid Glass Background */}
      <div className="flex-shrink-0 w-44 text-sm font-semibold text-slate-200 sticky left-0 z-10 bg-[#080d19] pr-3 flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors"
          style={{ 
            backgroundColor: `${color}15`,
            borderColor: `${color}30`
          }}
        >
          <IconComponent className="w-4 h-4" style={{ color }} />
        </div>
        <span className="truncate group-hover:text-white transition-colors">{habitName}</span>
      </div>

      <div className="flex gap-4 flex-1 overflow-x-auto scrollbar-none py-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1.5 bg-slate-950/20 p-1.5 rounded-xl border border-slate-900">
            {week.map((day, dayIndex) => {
              const globalDayIndex = weekIndex * 7 + dayIndex;
              const weekColorValues = Object.values(weekColors);
              const weekColor = weekColorValues[weekIndex % weekColorValues.length];

              return (
                <DayCheckbox
                  key={globalDayIndex}
                  completed={day}
                  dayNumber={globalDayIndex + 1}
                  weekColor={weekColor}
                  onToggle={() => !disabled && onDayToggle?.(globalDayIndex)}
                  disabled={disabled}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 w-20 text-right">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full border"
          style={{
            backgroundColor: `${color}12`,
            borderColor: `${color}30`,
            color,
            boxShadow: `0 0 8px ${color}10`
          }}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
}
