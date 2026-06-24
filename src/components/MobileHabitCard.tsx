'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HabitWithProgress } from '@/types';
import { Droplets, Dumbbell, BookOpen, Brain, Apple, Zap, Target, Heart, ChevronRight, Flame } from 'lucide-react';

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

const weekColors = ['#0ea5e9', '#f97316', '#10b981', '#a855f7'];

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

  const all30DaysDone = progress === 100;
  const isRecentComplete = habit.days.slice(-3).every(Boolean);

  return (
    <div className={`glass-panel rounded-2xl border transition-all duration-300 relative overflow-hidden font-sans hover:shadow-2xl hover:bg-slate-900/30 ${
      all30DaysDone ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-emerald-950/5' : 'border-slate-800/80'
    }`}>
      {/* Celebration ribbon for 100% */}
      {all30DaysDone && (
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-slate-950 text-center py-1.5 text-[10px] font-black uppercase tracking-wider">
          🏆 30-Day Master! 🏆
        </div>
      )}

      {/* Top row */}
      <div className={`flex items-center gap-3 px-4 pt-4 pb-3 ${all30DaysDone ? 'pt-3' : ''}`}>
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all"
          style={{
            background: `linear-gradient(135deg, ${habit.color}15, ${habit.color}25)`,
            borderColor: `${habit.color}35`,
          }}
        >
          {isRecentComplete ? (
            <span className="text-xl">✨</span>
          ) : (
            <IconComponent className="w-5 h-5" style={{ color: habit.color }} />
          )}
        </div>

        {/* Name + category */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-[15px] leading-tight truncate">{habit.title}</h3>
            {isRecentComplete && !all30DaysDone && <span className="text-sm">🔥</span>}
          </div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">
            {all30DaysDone ? 'Completed 30 days!' : habit.category}
          </p>
        </div>

        {/* Streak badge */}
        {streak >= 2 && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg flex-shrink-0 border ${
            streak >= 7 
              ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
              : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
          }`}>
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-black">{streak}d</span>
          </div>
        )}

        {/* Navigate to detail */}
        <button
          onClick={() => router.push(`/habits/${habit.id}/edit`)}
          className="p-1.5 text-slate-500 hover:text-slate-300 active:scale-90 transition-all flex-shrink-0 rounded-lg hover:bg-slate-800/40 border border-transparent hover:border-slate-800 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            {all30DaysDone ? '🎉 Complete!' : '30-day journey'}
          </span>
          <span className="text-xs font-bold" style={{ color: all30DaysDone ? '#10b981' : habit.color }}>
            {progress}%
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden p-[1px] ${
          all30DaysDone ? 'bg-emerald-950/60 border border-emerald-500/20' : 'bg-slate-950/60 border border-slate-800/80'
        }`}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: all30DaysDone 
                ? 'linear-gradient(90deg, #10b981, #059669)'
                : habit.color,
              boxShadow: all30DaysDone 
                ? '0 0 8px rgba(16, 185, 129, 0.4)'
                : `0 0 8px ${habit.color}35`,
            }}
          />
        </div>
      </div>

      {/* Bottom row: last 7 days + today button */}
      <div className="flex items-center gap-3 px-4 pb-4 border-t border-slate-900/40 pt-3">
        {/* Mini 7-day grid */}
        <div className="flex gap-1.5 flex-1 min-w-0">
          {last7.map((done, i) => {
            const globalIndex = habit.days.length - 7 + i;
            const isToday = globalIndex === todayIndex;
            const weekIdx = Math.floor(globalIndex / 7);
            const color = weekColors[weekIdx % weekColors.length];
            const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
            const dayOfWeek = (new Date().getDay() - (6 - i) + 7) % 7;

            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-[9px] text-slate-600 font-bold">{dayLabels[dayOfWeek]}</span>
                <div
                  className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                    isToday ? 'ring-2 ring-offset-2 ring-offset-slate-950' : ''
                  }`}
                  style={{
                    backgroundColor: done ? color : 'rgba(15, 23, 42, 0.6)',
                    border: done ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: done ? `0 0 6px ${color}60` : 'none',
                    ...(isToday && { ringColor: color, outline: `1px solid ${color}`, outlineOffset: '1px' }),
                    width: '100%',
                    maxWidth: '28px',
                  }}
                >
                  {done && (
                    <svg className="w-3 h-3 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {!done && isToday && (
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
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
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all duration-150 whitespace-nowrap cursor-pointer ${
            pressing ? 'scale-95' : 'scale-100'
          } ${
            todayDone
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'text-white'
          } ${disabled ? 'opacity-50' : ''}`}
          style={
            !todayDone
              ? { 
                  background: `linear-gradient(135deg, ${habit.color}, ${habit.color}dd)`, 
                  boxShadow: `0 4px 12px ${habit.color}25` 
                }
              : undefined
          }
        >
          {todayDone ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4.5} d="M5 13l4 4L19 7" />
              </svg>
              Done
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full border-2 border-white/90 shrink-0" />
              <span className="truncate">Today</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
