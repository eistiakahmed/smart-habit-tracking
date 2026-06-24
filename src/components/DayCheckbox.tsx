'use client';

import { useState } from 'react';

interface DayCheckboxProps {
  completed: boolean;
  dayNumber: number;
  date?: string;
  weekColor?: string;
  onToggle?: () => void;
  disabled?: boolean;
  showTooltip?: boolean;
}

export default function DayCheckbox({
  completed,
  dayNumber,
  date,
  weekColor = '#0ea5e9',
  onToggle,
  disabled = false,
  showTooltip = true,
}: DayCheckboxProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!disabled && onToggle) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200);
      onToggle();
    }
  };

  const tooltipText = completed
    ? `Day ${dayNumber} - Completed`
    : `Day ${dayNumber} - Not completed`;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative w-8 h-8 rounded-lg flex items-center justify-center
        transition-all duration-200 ease-out font-sans
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110 active:scale-90'}
        ${isPressed ? 'scale-90' : 'scale-100'}
      `}
      style={{
        border: completed ? 'none' : '2px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: completed ? weekColor : 'rgba(15, 23, 42, 0.6)',
        boxShadow: completed ? `0 0 12px ${weekColor}80` : 'none',
      }}
      title={showTooltip ? tooltipText : undefined}
    >
      {completed ? (
        <svg
          className="w-4 h-4 text-slate-950"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-400 select-none">
          {dayNumber}
        </span>
      )}
    </button>
  );
}
