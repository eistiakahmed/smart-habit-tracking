'use client';

import { useState, useTransition } from 'react';
import { habitActions } from '@/lib/server-actions';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface DeleteHabitButtonProps {
  habitId: string;
  habitTitle: string;
  onDelete?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export function DeleteHabitButton({
  habitId,
  habitTitle,
  onDelete,
  onError,
  disabled = false,
  className = '',
}: DeleteHabitButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    startTransition(async () => {
      try {
        await habitActions.deleteHabit(habitId);
        onDelete?.();
        router.refresh();
      } catch (error: any) {
        console.error('Failed to delete habit:', error);
        onError?.(error.message || 'Failed to delete habit');
        setShowConfirm(false);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={disabled || isPending}
      className={`
        p-2 rounded-lg transition-colors
        ${showConfirm
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
        }
        ${disabled || isPending ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      title={showConfirm ? 'Click to confirm' : 'Delete habit'}
    >
      {isPending ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : showConfirm ? (
        <span className="text-xs font-bold">CONFIRM</span>
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
