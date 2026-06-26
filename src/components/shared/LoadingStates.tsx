'use client';

import React, { memo } from 'react';

/**
 * Shared loading state components to reduce code duplication
 */

interface LoadingCardProps {
  title?: string;
  lines?: number;
  height?: string;
}

export function LoadingCard({ title = '', lines = 3, height = 'h-4' }: LoadingCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {title && <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>}
      <div className="animate-pulse space-y-3">
        <div className={`h-4 bg-gray-200 rounded ${lines >= 1 ? '' : 'hidden'}`}></div>
        <div className={`h-4 bg-gray-200 rounded w-2/3 ${lines >= 2 ? '' : 'hidden'}`}></div>
        <div className={`h-4 bg-gray-200 rounded w-1/2 ${lines >= 3 ? '' : 'hidden'}`}></div>
        {lines > 3 && [...Array(lines - 3)].map((_, i) => (
          <div key={i} className={`h-4 bg-gray-200 rounded ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`}></div>
        ))}
      </div>
    </div>
  );
}

interface LoadingGridProps {
  count?: number;
  height?: string;
}

export function LoadingGrid({ count = 6, height = 'h-64' }: LoadingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`animate-pulse bg-gray-200 rounded-lg ${height}`}></div>
      ))}
    </div>
  );
}

interface InlineLoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export function InlineLoader({ size = 'medium', text = 'Loading...' }: InlineLoaderProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin`}></div>
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Dark-themed skeleton components for the app
interface HabitSkeletonProps {
  count?: number;
}

export const HabitSkeleton = memo(({ count = 5 }: HabitSkeletonProps) => (
  <div className="space-y-4 px-4 sm:px-0">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-[#0f172a] rounded-xl p-4 border border-slate-800 animate-pulse"
        style={{ animationDelay: `${i * 100}ms` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-slate-700 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-slate-700 rounded w-32 mb-2" />
            <div className="h-3 bg-slate-700 rounded w-24" />
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, j) => (
            <div key={j} className="w-8 h-8 bg-slate-700 rounded" />
          ))}
        </div>
      </div>
    ))}
  </div>
));

HabitSkeleton.displayName = 'HabitSkeleton';

interface DashboardSkeletonProps {
  showHeader?: boolean;
}

export const DashboardSkeleton = memo(({ showHeader = true }: DashboardSkeletonProps) => (
  <div className="min-h-screen bg-[#050a15] text-[#f8fafc] relative overflow-x-hidden font-sans">
    {showHeader && (
      <div className="h-16 bg-[#0f172a] border-b border-slate-800 animate-pulse" />
    )}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 bg-slate-700 rounded w-64 mb-6 animate-pulse" />
      <HabitSkeleton count={5} />
    </div>
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';

interface ButtonSkeletonProps {
  width?: string;
  height?: string;
}

export const ButtonSkeleton = memo(({ width = '120px', height = '40px' }: ButtonSkeletonProps) => (
  <div
    className="bg-slate-700 rounded-lg animate-pulse"
    style={{ width, height }}
  />
));

ButtonSkeleton.displayName = 'ButtonSkeleton';

interface CardSkeletonProps {
  count?: number;
}

export const CardSkeleton = memo(({ count = 3 }: CardSkeletonProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-0">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-[#0f172a] rounded-xl p-6 border border-slate-800 animate-pulse"
        style={{ animationDelay: `${i * 100}ms` }}
      >
        <div className="w-12 h-12 bg-slate-700 rounded-lg mb-4" />
        <div className="h-4 bg-slate-700 rounded w-full mb-2" />
        <div className="h-3 bg-slate-700 rounded w-3/4 mb-4" />
        <div className="h-2 bg-slate-700 rounded w-1/2" />
      </div>
    ))}
  </div>
));

CardSkeleton.displayName = 'CardSkeleton';

export const LoadingSpinner = memo(({ size = 24 }: { size?: number }) => (
  <div className="flex items-center justify-center">
    <div
      className="border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

