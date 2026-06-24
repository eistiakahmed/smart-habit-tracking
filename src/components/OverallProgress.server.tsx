import { HabitWithProgress } from '@/types';
import { OverallProgressChart } from './charts/OverallProgressChart';

const FALLBACK_COLORS = ['#0ea5e9', '#f97316', '#10b981', '#a855f7', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899'];

interface OverallProgressProps {
  habits: HabitWithProgress[];
}

export default function OverallProgress({ habits }: OverallProgressProps) {
  const totalDays = habits.length * 30;
  const totalCompleted = habits.reduce((sum, h) => sum + h.days.filter(Boolean).length, 0);
  const totalRemaining = totalDays - totalCompleted;
  const completionPct = totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0;

  const pieData = habits.length > 0
    ? habits.map((h, i) => ({
        name: h.title,
        value: h.days.filter(Boolean).length,
        color: h.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      })).filter((d) => d.value > 0)
    : [{ name: 'No data', value: 1, color: 'rgba(255, 255, 255, 0.05)' }];

  const hasData = habits.some((h) => h.days.some(Boolean));
  const displayData = hasData ? pieData : [{ name: 'No completions yet', value: 1, color: 'rgba(255, 255, 255, 0.05)' }];

  const activeStreaks = habits.filter((h) => (h.stats?.currentStreak || 0) >= 3).length;

  const habitColors = habits.map((h, i) => ({
    id: h.id,
    title: h.title,
    color: h.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }));

  return (
    <OverallProgressChart
      completionPct={completionPct}
      displayData={displayData}
      hasData={hasData}
      totalHabits={habits.length}
      totalCompleted={totalCompleted}
      totalRemaining={totalRemaining}
      activeStreaks={activeStreaks}
      habitColors={habitColors}
    />
  );
}
