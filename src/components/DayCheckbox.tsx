'use client';

import { useState } from 'react';

interface DayCheckboxProps {
  completed: boolean;
  dayNumber: number;
  weekColor?: string;
  onToggle?: () => void;
  disabled?: boolean;
  isToday?: boolean;
  isPastIncomplete?: boolean;
}

export default function DayCheckbox({
  completed,
  dayNumber,
  weekColor = '#3B82F6',
  onToggle,
  disabled = false,
  isToday = false,
  isPastIncomplete = false,
}: DayCheckboxProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled || completed || !onToggle) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onToggle?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title={`Day ${dayNumber}${completed ? ' - Completed' : isPastIncomplete ? ' - Incomplete' : ''}`}
      className={`
        relative w-full aspect-square ${isPastIncomplete ? 'rounded-lg' : 'rounded-full'} flex items-center justify-center
        transition-all duration-150 ease-out select-none min-w-0
        ${disabled ? 'opacity-40 cursor-not-allowed' : completed || !onToggle ? 'cursor-default' : 'cursor-pointer hover:scale-105 active:scale-95'}
        ${isPressed ? 'scale-90' : ''}
        ${isToday && !completed ? 'ring-1 ring-offset-1 ring-offset-slate-950' : ''}
      `}
      style={{
        backgroundColor: completed
          ? weekColor
          : isPastIncomplete
          ? 'rgba(239, 68, 68, 0.18)'
          : 'rgba(255,255,255,0.05)',
        border: completed
          ? 'none'
          : isPastIncomplete
          ? '1.5px solid rgba(239, 68, 68, 0.55)'
          : isToday
          ? `1.5px solid ${weekColor}80`
          : '1.5px solid rgba(255,255,255,0.08)',
        boxShadow: completed
          ? `0 0 10px ${weekColor}70, inset 0 1px 0 rgba(255,255,255,0.25)`
          : isPastIncomplete
          ? '0 0 10px rgba(239, 68, 68, 0.18)'
          : 'none',
      }}
    >
      {completed ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="rgba(0,0,0,0.75)" viewBox="0 0 24 24" strokeWidth={3.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span className={`text-[10px] font-black leading-none ${isPastIncomplete ? 'text-red-300' : isToday ? 'text-sky-300' : 'text-slate-500'}`}>
          {dayNumber}
        </span>
      )}
    </button>
  );
}
