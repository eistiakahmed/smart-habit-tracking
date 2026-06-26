'use client';

import { memo } from 'react';
import { RefreshCw } from 'lucide-react';
import Header from '@/components/Header';

interface DashboardHeaderProps {
  habitCount: number;
  refreshing: boolean;
  onRefresh: () => void;
  isMobile: boolean;
}

const DashboardHeader = memo(({ habitCount, refreshing, onRefresh, isMobile }: DashboardHeaderProps) => {
  if (isMobile) {
    return (
      <header className="sm:hidden glass-header sticky top-0 z-50 border-b border-slate-900 shadow-md safe-area-top">
        <div className="mobile-container flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-purple-600 rounded-lg flex items-center justify-center border border-sky-400/10">
              <span className="text-white text-lg font-bold select-none">✓</span>
            </div>
            <span className="font-extrabold text-white text-[15px] tracking-tight">Habit Tracker</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onRefresh}
              className="touch-target flex items-center justify-center text-slate-400 rounded-xl active:bg-slate-900 transition-colors cursor-pointer"
              type="button"
              aria-label="Refresh habits"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Header />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="glass-header sticky top-0 z-50 shadow-lg shadow-black/10 hidden sm:block">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl flex items-center justify-center border border-sky-400/20 shadow-[0_0_16px_rgba(56,189,248,0.2)]">
              <span className="text-white text-2xl font-bold font-sans select-none">✓</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">Smart Habit Tracker</h1>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Build better habits, daily</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {habitCount > 0 && (
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                {habitCount} Active
              </span>
            )}
            <button
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Header />
          </div>
        </div>
      </div>
    </header>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
