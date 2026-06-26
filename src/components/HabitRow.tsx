'use client';

import DayCheckbox from './DayCheckbox';
import { formatCalendarDate, getWeekColors, groupIntoWeeks, parseLocalDate } from '@/lib/utils';
import HabitIcon from './shared/HabitIcon';
import { Flame } from 'lucide-react';

interface HabitRowProps {
  habitName: string;
  days: boolean[];
  dayDates?: string[];
  habitStartDate?: string;
  color?: string;
  category?: string;
  icon?: string;
  onDayToggle?: (dayIndex: number) => void;
  disabled?: boolean;
  todayDate?: string;
}

const WEEK_LABELS = ['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4', 'WEEK 5'];
const WEEK_COLORS = [...Object.values(getWeekColors()), '#ec4899']; // pink for week 5

export default function HabitRow({
  habitName,
  days,
  dayDates,
  habitStartDate,
  color = '#0ea5e9',
  category,
  icon,
  onDayToggle,
  disabled = false,
  todayDate = '',
}: HabitRowProps) {
  const trimmedDays = days.slice(0, 30);
  const weeks = groupIntoWeeks(trimmedDays); // up to 5 weeks (last may be partial)
  const completedCount = trimmedDays.filter(Boolean).length;
  const today = todayDate;
  const habitStart = habitStartDate ? formatCalendarDate(habitStartDate) : undefined;

  // Current streak (consecutive from most recent of trimmed days)
  let streak = 0;
  for (let i = trimmedDays.length - 1; i >= 0; i--) {
    if (trimmedDays[i]) streak++;
    else break;
  }

  return (
    <div className="flex items-center border-b border-slate-800/40 last:border-0 hover:bg-slate-900/20 transition-colors group">

      {/* Sticky habit name column */}
      <div
        className="flex-shrink-0 w-36 sm:w-48 sticky left-0 z-10 flex flex-col gap-1 px-4 sm:px-6 py-4"
        style={{ background: 'var(--habit-row-bg, #080d19)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center border flex-shrink-0"
            style={{ backgroundColor: `${color}18`, borderColor: `${color}30` }}
          >
            <HabitIcon icon={icon} category={category} color={color} size={15} />
          </div>
          <span className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors leading-tight">
            {habitName}
          </span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 ml-9">
            <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
            <span className="text-[10px] font-bold text-orange-400">{streak} Day Streak!</span>
          </div>
        )}
      </div>

      {/* Weekly groups */}
      <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto scrollbar-none px-3 sm:px-4 py-3 flex-1 native-scroll-x">
        {weeks.map((week, weekIndex) => {
          const weekColor = WEEK_COLORS[weekIndex % WEEK_COLORS.length];
          return (
            <div
              key={weekIndex}
              className="flex-shrink-0 rounded-xl p-1.5"
              style={{
                width: '120px',
                border: `1px solid ${weekColor}30`,
                background: `${weekColor}06`,
              }}
            >
              {/* 4-col grid — circles fill the box width */}
              <div className="grid grid-cols-4 gap-1 w-full">
                {week.map((day, dayIndex) => {
                  const globalDayIndex = weekIndex * 7 + dayIndex;
                  const dayDate = dayDates?.[globalDayIndex];
                  const isToday = !!today && dayDate === today;
                  const isPastIncomplete = !!today && !!dayDate && dayDate < today && (!habitStart || dayDate >= habitStart) && !day;
                  const displayDay = dayDate ? parseLocalDate(dayDate).getDate() : globalDayIndex + 1;
                  return (
                    <DayCheckbox
                      key={globalDayIndex}
                      completed={day}
                      dayNumber={displayDay}
                      weekColor={weekColor}
                      onToggle={isToday ? () => !disabled && !day && onDayToggle?.(globalDayIndex) : undefined}
                      disabled={disabled}
                      isToday={isToday}
                      isPastIncomplete={isPastIncomplete}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion count badge */}
      <div className="flex-shrink-0 pr-4 sm:pr-6 hidden sm:block">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap"
          style={{
            color,
            backgroundColor: `${color}12`,
            borderColor: `${color}28`,
          }}
        >
          {completedCount}/30
        </span>
      </div>
    </div>
  );
}
