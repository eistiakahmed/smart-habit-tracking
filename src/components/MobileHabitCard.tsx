'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HabitWithProgress } from '@/types';
import { Droplets, Dumbbell, BookOpen, Brain, Apple, Zap, Target, Heart, ChevronRight } from 'lucide-react';

interface MobileHabitCardProps {
  habit: HabitWithProgress;
  onDayToggle?: (habitId: string, dayIndex: number) => void;
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

const weekColors = ['#3B82F6', '#F97316', '#10B981', '#8B5CF6'];

export default function MobileHabitCard({ habit, onDayToggle, disabled }: MobileHabitCardProps) {
  const router = useRouter();
  const [pressing, setPressing] = useState(false);
  const IconComponent = categoryIcons[habit.category] || Target;

  const completedCount = habit.days.filter(Boolean).length;
  const progress = Math.round((completedCount / habit.days.length) * 100);
  const todayIndex = habit.days.length - 1;
  const todayDone = habit.days[todayIndex];
  const streak = habit.stats?.currentStreak || 0;

  // Last 7 days for the mini grid
  const last7 = habit.days.slice(-7);

  const handleTodayToggle = () => {
    if (!disabled) onDayToggle?.(habit.id, todayIndex);
  };

  return (
    <div className="app-card overflow-hidden press-feedback">
      {/* Top row */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: habit.color + '18' }}
        >
          <IconComponent className="w-5 h-5" style={{ color: habit.color }} />
        </div>

        {/* Name + category */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-[15px] leading-tight truncate">{habit.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{habit.category}</p>
        </div>

        {/* Streak badge */}
        {streak >= 2 && (
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg flex-shrink-0">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-bold text-orange-600">{streak}</span>
          </div>
        )}

        {/* Navigate to detail */}
        <button
          onClick={() => router.push(`/habits/${habit.id}/edit`)}
          className="p-1 text-gray-300 flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">30-day progress</span>
          <span className="text-xs font-bold" style={{ color: habit.color }}>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: habit.color }}
          />
        </div>
      </div>

      {/* Bottom row: last 7 days + today button */}
      <div className="flex items-center gap-2 px-4 pb-4">
        {/* Mini 7-day grid */}
        <div className="flex gap-1 flex-1">
          {last7.map((done, i) => {
            const globalIndex = habit.days.length - 7 + i;
            const isToday = globalIndex === todayIndex;
            const weekIdx = Math.floor(globalIndex / 7);
            const color = weekColors[weekIdx % weekColors.length];
            const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
            const dayOfWeek = (new Date().getDay() - (6 - i) + 7) % 7;

            return (
              <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                <span className="text-[9px] text-gray-300 font-medium">{dayLabels[dayOfWeek]}</span>
                <div
                  className={`w-full aspect-square rounded-md flex items-center justify-center ${
                    isToday ? 'ring-2 ring-offset-1' : ''
                  }`}
                  style={{
                    backgroundColor: done ? color : '#F3F4F6',
                    ...(isToday && { outline: `2px solid ${color}`, outlineOffset: '1px' }),
                    maxWidth: '28px',
                  }}
                >
                  {done && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {!done && isToday && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's completion button */}
        <button
          onPointerDown={() => setPressing(true)}
          onPointerUp={() => setPressing(false)}
          onPointerLeave={() => setPressing(false)}
          onClick={handleTodayToggle}
          disabled={disabled}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-150 ${
            pressing ? 'scale-95' : 'scale-100'
          } ${
            todayDone
              ? 'bg-green-500 text-white shadow-sm shadow-green-200'
              : 'text-white shadow-sm'
          } ${disabled ? 'opacity-50' : ''}`}
          style={
            !todayDone
              ? { background: `linear-gradient(135deg, ${habit.color}, ${habit.color}cc)` }
              : undefined
          }
        >
          {todayDone ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Done
            </>
          ) : (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/80 flex-shrink-0" />
              Today
            </>
          )}
        </button>
      </div>
    </div>
  );
}
