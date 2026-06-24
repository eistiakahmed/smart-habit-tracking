'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, Clock, Flame, Target } from 'lucide-react';

interface OverallProgressChartProps {
  completionPct: number;
  displayData: Array<{ name: string; value: number; color: string }>;
  hasData: boolean;
  totalHabits: number;
  totalCompleted: number;
  totalRemaining: number;
  activeStreaks: number;
  habitColors: Array<{ id: string; title: string; color: string }>;
}

export function OverallProgressChart({
  completionPct,
  displayData,
  hasData,
  totalHabits,
  totalCompleted,
  totalRemaining,
  activeStreaks,
  habitColors,
}: OverallProgressChartProps) {
  const stats = [
    { label: 'Total Habits', value: totalHabits, icon: Target, color: 'text-sky-400', border: 'border-sky-500/25', bg: 'bg-sky-500/8' },
    { label: 'Days Completed', value: totalCompleted, icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/25', bg: 'bg-emerald-500/8' },
    { label: 'Days Remaining', value: totalRemaining, icon: Clock, color: 'text-orange-400', border: 'border-orange-500/25', bg: 'bg-orange-500/8' },
    {
      label: 'Active Streaks',
      value: activeStreaks,
      icon: Flame,
      color: 'text-purple-400',
      border: 'border-purple-500/25',
      bg: 'bg-purple-500/8',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl px-3.5 py-2.5 font-sans">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.2)]" style={{ backgroundColor: d.payload.color }} />
          <span className="text-xs font-bold text-slate-100">{d.name}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 font-semibold">{d.value} days completed</p>
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-2xl font-sans">
      <h2 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 tracking-tight">Overall Progress</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie chart */}
        <div className="flex flex-col justify-center">
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={80}
                  paddingAngle={hasData ? 3 : 0}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {displayData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white tracking-tight">{completionPct}%</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">complete</span>
            </div>
          </div>

          {/* Per-habit legend */}
          {hasData && (
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-4 justify-center">
              {habitColors.map((h) => (
                <div key={h.id} className="flex items-center gap-1.5 bg-slate-950/20 px-2 py-1 rounded-lg border border-slate-900/60">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
                  <span className="text-[10px] font-bold text-slate-400 truncate max-w-[85px]">{h.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, icon: Icon, color, border, bg }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-3 sm:p-4 text-center hover:scale-102 transition-transform duration-200`}>
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <div className="text-xl sm:text-2xl font-black text-slate-100">{value}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-1 leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total progress bar */}
      <div className="mt-5 pt-5 border-t border-slate-800/40">
        <div className="flex items-center justify-between text-sm mb-2 font-semibold text-slate-400">
          <span className="text-xs tracking-wide">Total Journey Progress</span>
          <span className="text-xs text-slate-300 font-bold">{totalCompleted} / {totalHabits * 30} days</span>
        </div>
        
        {/* Segmented progress bar — each habit its own color */}
        <div className="h-2 bg-slate-950/60 border border-slate-800/80 rounded-full overflow-hidden flex p-[1px]">
          {habitColors.map((h) => {
            const habitCompletions = displayData.find(d => d.name === h.title)?.value || 0;
            const habitPct = totalHabits * 30 > 0 ? (habitCompletions / (totalHabits * 30)) * 100 : 0;
            return habitPct > 0 ? (
              <div
                key={h.id}
                className="h-full transition-all duration-500 rounded-full"
                style={{ 
                  width: `${habitPct}%`, 
                  backgroundColor: h.color,
                  boxShadow: `0 0 6px ${h.color}35`
                }}
                title={`${h.title}: ${habitCompletions} completions`}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
