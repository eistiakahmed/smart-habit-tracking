'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

interface WeeklyChartComponentProps {
  chartData: Array<Record<string, string | number>>;
  habits: Array<{ id: string; title: string; color: string }>;
}

export function WeeklyChartComponent({ chartData, habits }: WeeklyChartComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!habits.length) {
    return (
      <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 shadow-2xl font-sans">
        <h2 className="text-lg font-bold text-white mb-1">Weekly Progress</h2>
        <p className="text-xs text-slate-400 mb-6">Completion rate by week per habit</p>
        <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm font-semibold">
          No habit data tracked yet
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-4.5 min-w-[170px] font-sans">
        <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 mb-3">{label}</p>
        {payload.map((p: any) => {
          const habit = habits.find((h) => h.id === p.dataKey);
          return (
            <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-2 last:mb-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill }} />
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{habit?.title || p.dataKey}</span>
              </div>
              <span className="text-xs font-black" style={{ color: p.fill }}>{p.value}%</span>
            </div>
          );
        })}
      </div>
    );
  };

  const FALLBACK_COLORS = ['#0ea5e9', '#f97316', '#10b981', '#a855f7', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899'];

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-2xl font-sans">
      <h2 className="text-base sm:text-lg font-bold text-white mb-1 tracking-tight">Weekly Progress</h2>
      <p className="text-xs text-slate-400 mb-4 sm:mb-6">Completion rate by week per habit</p>

      {mounted ? (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barCategoryGap="25%" barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.015)' }} />
            {habits.map((habit, i) => (
              <Bar
                key={habit.id}
                dataKey={habit.id}
                name={habit.title}
                fill={habit.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[240px] rounded-xl bg-slate-950/30 border border-slate-900/60" />
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-slate-800/40">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center gap-1.5 bg-slate-950/20 px-2.5 py-1 rounded-lg border border-slate-900/60 hover:border-slate-800 transition-colors">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: habit.color || FALLBACK_COLORS[habits.findIndex(h => h.id === habit.id) % FALLBACK_COLORS.length] }}
            />
            <span className="text-[10px] font-bold text-slate-400 truncate max-w-[125px]">{habit.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
