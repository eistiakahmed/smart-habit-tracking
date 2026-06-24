'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HabitWithProgress } from '@/types';
import { ChevronRight } from 'lucide-react';
import HabitIcon from './shared/HabitIcon';
import { formatLocalDate, parseLocalDate } from '@/lib/utils';

interface MobileHabitCardProps {
  habit: HabitWithProgress;
  onDayToggle?: (habitId: string, dayIndex: number) => void;
  disabled?: boolean;
  todayDate?: string;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MobileHabitCard({ habit, onDayToggle, disabled, todayDate = '' }: MobileHabitCardProps) {
  const router = useRouter();
  const [pressing, setPressing] = useState<number | null>(null);

  const today = todayDate;
  const todayDateIndex = habit.dayDates?.indexOf(today) ?? -1;
  const todayIndex = todayDateIndex >= 0 ? todayDateIndex : habit.days.length - 1;

  const completedCount = habit.days.filter(Boolean).length;
  const progress = Math.round((completedCount / Math.max(habit.days.length, 1)) * 100);

  // Current week: 7 days ending today
  const weekStart = todayIndex - 6 < 0 ? 0 : todayIndex - 6;
  const weekDays = habit.days.slice(weekStart, todayIndex + 1);
  // Pad left if we're in the first week (< 7 days available)
  const padLeft = 7 - weekDays.length;

  // Day-of-week labels aligned to actual dates
  const todayDow = today ? parseLocalDate(today).getDay() : 0; // 0=Sun
  const weekDayLabels: string[] = [];
  for (let i = 0; i < 7; i++) {
    const dow = (todayDow - (6 - i) + 7) % 7;
    weekDayLabels.push(i === 6 ? 'Today' : DAY_LABELS[dow]);
  }

  const handleToggle = (globalIndex: number, done: boolean) => {
    if (disabled || done) return;
    onDayToggle?.(habit.id, globalIndex);
  };

  // Gradient color based on habit color
  const accentColor = habit.color || '#0ea5e9';

  return (
    <div
      className="rounded-2xl border border-slate-800/60 overflow-hidden font-sans"
      style={{ background: 'linear-gradient(145deg, #0d1424, #0a1020)' }}
    >
      {/* ── Header row ── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        {/* Large circular icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${accentColor}40, ${accentColor}15)`,
            borderColor: `${accentColor}30`,
            boxShadow: `0 0 20px ${accentColor}20`,
          }}
        >
          <HabitIcon icon={habit.icon} category={habit.category} color={accentColor} size={26} />
        </div>

        {/* Title + category */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-bold text-white leading-tight truncate">{habit.title}</h3>
          <p className="text-sm text-slate-400 mt-0.5 capitalize">{habit.category}</p>
        </div>

        {/* Chevron */}
        <button
          onClick={() => router.push(`/habits/${habit.id}/edit`)}
          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white transition-colors rounded-lg cursor-pointer flex-shrink-0"
          type="button"
          aria-label={`Open ${habit.title}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── Progress section ── */}
      <div className="px-4 pb-3">
        {/* Label + percentage */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
            30-Day Journey
          </span>
          <span className="text-base font-black" style={{ color: accentColor }}>
            {progress}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2.5 rounded-full overflow-hidden bg-slate-800/80">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}bb)`,
              boxShadow: `0 0 8px ${accentColor}60`,
            }}
          />
        </div>

        {/* Days count */}
        <p className="text-right text-xs text-slate-400 mt-1.5 font-medium">
          {completedCount} Day{completedCount !== 1 ? 's' : ''} Out of {habit.days.length}
        </p>
      </div>

      {/* ── 7-day week row ── */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between gap-1">
          {weekDayLabels.map((label, i) => {
            const dayOffset = i - padLeft;
            const globalIndex = weekStart + dayOffset;
            const done = dayOffset >= 0 ? (weekDays[dayOffset] ?? false) : false;
            const isValid = dayOffset >= 0;
            const dayDate = isValid ? habit.dayDates?.[globalIndex] : undefined;
            const habitStart = habit.startDate ? formatLocalDate(new Date(habit.startDate)) : undefined;
            const isToday = !!today && dayDate === today;
            const isPastIncomplete = !!today && !!dayDate && dayDate < today && (!habitStart || dayDate >= habitStart) && !done;

            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                {/* Day label */}
                <span
                  className={`text-[10px] font-bold leading-none ${
                    isToday ? 'font-black' : 'text-slate-500'
                  }`}
                  style={{ color: isToday ? accentColor : undefined }}
                >
                  {label}
                </span>

                {/* Circle */}
                <button
                  type="button"
                  disabled={!isValid || disabled || done || !isToday}
                  onPointerDown={() => isValid && setPressing(i)}
                  onPointerUp={() => setPressing(null)}
                  onPointerLeave={() => setPressing(null)}
                  onClick={() => isValid && isToday && handleToggle(globalIndex, done)}
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150
                    ${!isValid ? 'opacity-0 pointer-events-none' : ''}
                    ${done ? 'cursor-default' : isValid && isToday ? 'cursor-pointer active:scale-90' : 'cursor-default'}
                    ${pressing === i ? 'scale-90' : ''}
                  `}
                  style={{
                    background: done
                      ? `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`
                      : isPastIncomplete
                      ? 'rgba(239, 68, 68, 0.18)'
                      : isToday
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(255,255,255,0.04)',
                    border: done
                      ? 'none'
                      : isPastIncomplete
                      ? '1.5px solid rgba(239, 68, 68, 0.55)'
                      : isToday
                      ? `2px solid ${accentColor}90`
                      : '1.5px solid rgba(255,255,255,0.10)',
                    boxShadow: done
                      ? `0 0 10px ${accentColor}55`
                      : isPastIncomplete
                      ? '0 0 10px rgba(239, 68, 68, 0.18)'
                      : 'none',
                  }}
                >
                  {done ? (
                    <svg className="w-4 h-4" fill="none" stroke="rgba(0,0,0,0.75)" viewBox="0 0 24 24" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isPastIncomplete ? (
                    <span className="text-[11px] font-black text-red-300 leading-none">
                      {dayDate ? parseLocalDate(dayDate).getDate() : ''}
                    </span>
                  ) : isToday ? (
                    <span className="text-[11px] font-black" style={{ color: accentColor }}>
                      {DAY_LABELS[todayDow][0]}
                    </span>
                  ) : null}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
