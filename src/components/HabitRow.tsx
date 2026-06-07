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
  color = '#3B82F6',
  category,
  icon,
  onDayToggle,
  disabled = false,
}: HabitRowProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const weekColors = getWeekColors();
  const weeks = groupIntoWeeks(days);
  const IconComponent = category ? categoryIcons[category] || Target : Target;

  const completedCount = days.filter(d => d).length;
  const progress = Math.round((completedCount / days.length) * 100);

  return (
    <div className="flex items-center gap-4 py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 w-40 text-sm font-medium text-gray-700 sticky left-0 bg-inherit flex items-center gap-2">
        <div
          className="w-6 h-6 rounded flex items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
          <IconComponent className="w-4 h-4" style={{ color }} />
        </div>
        <span className="truncate">{habitName}</span>
      </div>

      <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-thin">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
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
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{
            backgroundColor: color + '20',
            color,
          }}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
}
