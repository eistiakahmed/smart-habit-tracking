'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

/**
 * AddHabitFAB - A sophisticated floating action button component with speech bubble
 *
 * Features:
 * - Speech bubble with gradient border (blue to purple)
 * - Floating action button with gradient and glow effects
 * - Dark theme with modern, minimalist design
 * - Smooth animations and transitions
 * - Responsive positioning (mobile-optimized)
 */
export function AddHabitFAB() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/habits/new');
  };

  return (
    <div
      className="fixed right-4 z-40 flex flex-col items-end gap-2 animate-fade-in sm:hidden"
      style={{ bottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
    >
      {/* Speech Bubble */}
      <div className="hidden min-[390px]:block relative bg-slate-900/90 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-xl border border-slate-800/80">
        {/* Gradient Border Effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-30"
          style={{
            background: 'linear-gradient(to right, #0ea5e9, #a855f7)',
            padding: '1px'
          }}
        />

        {/* Speech Bubble Triangle */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/90 backdrop-blur-md transform rotate-45" />

        {/* Content */}
        <div className="relative flex items-center gap-2">
          {/* Gradient Icon */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Plus className="w-3 h-3 text-white" />
          </div>

          {/* Text */}
          <span className="text-xs font-bold text-white">Add habit</span>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleClick}
        className="group relative touch-target w-12 h-12 bg-gradient-to-r from-sky-500 to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all duration-200 cursor-pointer border border-white/10"
        aria-label="Add new habit"
        type="button"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 to-purple-400 blur-lg opacity-45 transition-opacity" />

        {/* Plus Icon with rotation on hover */}
        <Plus className="w-5 h-5 text-white relative z-10 transition-transform duration-200" />

        {/* Ripple effect ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/15" />
      </button>
    </div>
  );
}
