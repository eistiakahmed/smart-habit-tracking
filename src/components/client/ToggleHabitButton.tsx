'use client';

import { useTransition } from 'react';
import { habitActions } from '@/lib/server-actions';
import { useRouter } from 'next/navigation';

interface ToggleHabitButtonProps {
  habitId: string;
  dayIndex: number;
  isCompleted: boolean;
  onToggleStart?: () => void;
  onToggleError?: () => void;
  disabled?: boolean;
}

export function ToggleHabitButton({
  habitId,
  dayIndex,
  isCompleted,
  onToggleStart,
  onToggleError,
  disabled = false,
}: ToggleHabitButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    if (disabled || isPending) return;

    onToggleStart?.();

    startTransition(async () => {
      try {
        await habitActions.toggleHabit(habitId);
        router.refresh();
      } catch (error) {
        console.error('Failed to toggle habit:', error);
        onToggleError?.();
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || isPending}
      className={`
        w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all
        ${isCompleted
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
        }
        ${disabled || isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
      aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {isPending ? (
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isCompleted ? (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      ) : null}
    </button>
  );
}
