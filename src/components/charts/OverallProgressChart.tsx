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
    { label: 'Total Habits', value: totalHabits, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Days Completed', value: totalCompleted, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Days Remaining', value: totalRemaining, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    {
      label: 'Active Streaks',
      value: activeStreaks,
      icon: Flame,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.payload.color }} />
          <span className="text-xs font-semibold text-gray-700">{d.name}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{d.value} days completed</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Overall Progress</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie chart */}
        <div>
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
              <span className="text-2xl font-bold text-gray-800">{completionPct}%</span>
              <span className="text-xs text-gray-400">complete</span>
            </div>
          </div>

          {/* Per-habit legend */}
          {hasData && (
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 justify-center">
              {habitColors.map((h) => (
                <div key={h.id} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
                  <span className="text-[11px] text-gray-500 truncate max-w-[90px]">{h.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 sm:p-4 text-center`}>
              <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color}`} />
              <div className="text-lg sm:text-xl font-bold text-gray-800">{value}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total progress bar */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500 text-xs sm:text-sm">Total Progress</span>
          <span className="font-semibold text-gray-800 text-xs sm:text-sm">{totalCompleted} / {totalHabits * 30} days</span>
        </div>
        {/* Segmented progress bar — each habit its own color */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
          {habitColors.map((h, i) => {
            const habitPct = totalHabits * 30 > 0 ? (totalCompleted / (totalHabits * 30)) * 100 : 0;
            const pct = habitColors.length > 0 ? habitPct / habitColors.length : 0;
            return pct > 0 ? (
              <div
                key={h.id}
                className="h-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: h.color }}
                title={`${h.title}: ${Math.round(pct)}%`}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
