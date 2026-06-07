'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
} from 'recharts';
import { HabitWithProgress } from '@/types';

interface WeeklyChartProps {
  habits: HabitWithProgress[];
}

const FALLBACK_COLORS = ['#3B82F6', '#F97316', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#EC4899'];

export default function WeeklyChart({ habits }: WeeklyChartProps) {
  if (!habits.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Weekly Progress</h2>
        <p className="text-sm text-gray-400 mb-6">Completion rate by week per habit</p>
        <div className="h-[220px] flex items-center justify-center text-gray-300 text-sm">
          No habit data yet
        </div>
      </div>
    );
  }

  // Build 4-week data: each week has one entry per habit
  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const chartData = weekLabels.map((week, wi) => {
    const entry: Record<string, string | number> = { week };
    habits.forEach((h) => {
      const slice = h.days.slice(wi * 7, wi * 7 + 7);
      const done = slice.filter(Boolean).length;
      entry[h.id] = slice.length > 0 ? Math.round((done / slice.length) * 100) : 0;
    });
    return entry;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[160px]">
        <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
        {payload.map((p: any) => {
          const habit = habits.find((h) => h.id === p.dataKey);
          return (
            <div key={p.dataKey} className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill }} />
                <span className="text-xs text-gray-700 truncate max-w-[100px]">{habit?.title || p.dataKey}</span>
              </div>
              <span className="text-xs font-bold" style={{ color: p.fill }}>{p.value}%</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-0.5">Weekly Progress</h2>
      <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">Completion rate by week per habit</p>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} barCategoryGap="25%" barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          {habits.map((habit, i) => (
            <Bar
              key={habit.id}
              dataKey={habit.id}
              name={habit.title}
              fill={habit.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-gray-100">
        {habits.map((habit, i) => (
          <div key={habit.id} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: habit.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length] }}
            />
            <span className="text-xs text-gray-600 truncate max-w-[120px]">{habit.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
