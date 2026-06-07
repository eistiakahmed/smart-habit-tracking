import { HabitWithProgress } from '@/types';
import { WeeklyChartComponent } from './charts/WeeklyChartComponent';

const FALLBACK_COLORS = ['#3B82F6', '#F97316', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#EC4899'];

interface WeeklyChartProps {
  habits: HabitWithProgress[];
}

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

  const habitData = habits.map((h, i) => ({
    id: h.id,
    title: h.title,
    color: h.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }));

  return <WeeklyChartComponent chartData={chartData} habits={habitData} />;
}
