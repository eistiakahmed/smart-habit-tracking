import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/server-auth';
import { habitActions } from '@/lib/server-actions';
import { HomeDashboard } from '@/components/client/HomeDashboard';
import { calculateWeeklyProgress } from '@/lib/utils';

function generateDaysFromProgress(
  dailyProgress: Array<{ date: string; completed: boolean }> | undefined,
  habitStartDate?: string
): boolean[] {
  const days = new Array(30).fill(false);
  const today = new Date();
  const startDate = habitStartDate
    ? new Date(habitStartDate)
    : new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    const ds = date.toISOString().split('T')[0];

    if (dailyProgress) {
      const found = dailyProgress.find((dp) => {
        const d = new Date(dp.date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0] === ds;
      });
      days[i] = found?.completed || false;
    }
  }

  return days;
}

export default async function Home() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  const response = await habitActions.getHabits({ isActive: true, limit: 20 }) as { habits: any[] };

  const habitsWithProgress = await Promise.all(
    response.habits.map(async (habit: any) => {
      try {
        const progressData = await habitActions.getHabitProgress(habit.id) as { dailyProgress: Array<{ date: string; completed: boolean }> };
        const days = generateDaysFromProgress(progressData.dailyProgress, habit.startDate);
        return {
          ...habit,
          days,
          weeklyProgress: calculateWeeklyProgress(days),
        };
      } catch {
        return {
          ...habit,
          days: Array(30).fill(false),
          weeklyProgress: [0, 0, 0, 0],
        };
      }
    })
  );

  return <HomeDashboard user={user} initialHabits={habitsWithProgress} />;
}
