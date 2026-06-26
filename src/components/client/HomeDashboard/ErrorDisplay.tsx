'use client';

import { memo } from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay = memo(({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="mx-4 sm:mx-0 mt-3 sm:mt-0 sm:mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
      <span className="text-red-400 flex-shrink-0 text-lg">⚠️</span>
      <p className="text-red-300 text-sm font-medium">{error}</p>
    </div>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';

export default ErrorDisplay;
