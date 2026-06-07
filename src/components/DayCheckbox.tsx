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
  weekColor = '#3B82F6',
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
        transition-all duration-200 ease-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
        ${isPressed ? 'scale-95' : 'scale-100'}
      `}
      style={{
        border: completed ? 'none' : '2px solid #e5e7eb',
        backgroundColor: completed ? weekColor : '#ffffff',
        transform: isPressed ? 'scale(0.9)' : 'scale(1)',
      }}
      title={showTooltip ? tooltipText : undefined}
    >
      {completed && (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}
