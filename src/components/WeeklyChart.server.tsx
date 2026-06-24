import { HabitWithProgress } from '@/types';
import { WeeklyChartComponent } from './charts/WeeklyChartComponent';

const FALLBACK_COLORS = ['#0ea5e9', '#f97316', '#10b981', '#a855f7', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899'];

interface WeeklyChartProps {
  habits: HabitWithProgress[];
}

export default function WeeklyChart({ habits }: WeeklyChartProps) {
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

  const weekCount = Math.max(...habits.map((h) => Math.ceil((h.days?.length || 0) / 7)), 0);
  const weekLabels = Array.from({ length: weekCount }, (_, index) => `Week ${index + 1}`);
  const chartData = weekLabels.map((week, wi) => {
    const entry: Record<string, string | number> = { week };
    habits.forEach((h) => {
      const slice = h.days.slice(wi * 7, wi * 7 + 7);
      const done = slice.filter(Boolean).length;
      entry[h.id] = slice.length > 0 ? Math.round((done / slice.length) * 100) : 0;
    });
    return entry;
  });

  const habitData = habits.map((h, i) => ({
    id: h.id,
    title: h.title,
    color: h.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }));

  return <WeeklyChartComponent chartData={chartData} habits={habitData} />;
}
