'use client';

import { useTransition } from 'react';
import { habitActions } from '@/lib/server-actions';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToggleStatusButtonProps {
  habitId: string;
  isActive: boolean;
  onToggleStart?: () => void;
  onToggleError?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleStatusButton({
  habitId,
  isActive,
  onToggleStart,
  onToggleError,
  disabled = false,
  className = '',
}: ToggleStatusButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    if (disabled || isPending) return;

    onToggleStart?.();

    startTransition(async () => {
      try {
        await habitActions.updateHabit(habitId, { isActive: !isActive });
        router.refresh();
      } catch (error) {
        console.error('Failed to toggle status:', error);
        onToggleError?.();
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || isPending}
      className={`
        inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium
        ${isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        ${disabled || isPending ? 'opacity-50 cursor-not-allowed' : 'transition-colors'}
        ${className}
      `}
    >
      {isPending ? (
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isActive ? (
        <>
          <CheckCircle className="w-3 h-3" />
          Active
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3" />
          Inactive
        </>
      )}
    </button>
  );
}
