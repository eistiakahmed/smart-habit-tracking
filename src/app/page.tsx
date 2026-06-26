import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/server-auth';
import { habitActions } from '@/lib/server-actions';
import { HomeDashboard } from '@/components/client/HomeDashboard';
import { calculateWeeklyProgress, formatLocalDate, getDaysInMonth } from '@/lib/utils';

function generateDaysFromProgress(
  dailyProgress: Array<{ date: string; completed: boolean }> | undefined
): { days: boolean[]; dayDates: string[] } {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const days = new Array(daysInMonth).fill(false);
  const dayDates: string[] = [];

  for (let i = 0; i < daysInMonth; i++) {
    const date = new Date(year, month, i + 1);
    date.setHours(0, 0, 0, 0);
    const ds = formatLocalDate(date);
    dayDates.push(ds);

    if (dailyProgress) {
      const found = dailyProgress.find((dp) => dp.date === ds);
      days[i] = found?.completed || false;
    }
  }

  return { days, dayDates };
}

function generateCurrentMonthDates(): string[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  return Array.from({ length: daysInMonth }, (_, index) => formatLocalDate(new Date(year, month, index + 1)));
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
        const { days, dayDates } = generateDaysFromProgress(progressData.dailyProgress);
        return {
          ...habit,
          days,
          dayDates,
          weeklyProgress: calculateWeeklyProgress(days),
        };
      } catch {
        const dayDates = generateCurrentMonthDates();
        return {
          ...habit,
          days: Array(dayDates.length).fill(false),
          dayDates,
          weeklyProgress: [0, 0, 0, 0],
        };
      }
    })
  );

  // Compute today's date string on the server so the client doesn't need to
  // recompute it — prevents hydration mismatch when server/client clocks differ
  // in timezone or when the date changes near midnight.
  const serverTodayDate = formatLocalDate();

  return <HomeDashboard user={user} initialHabits={habitsWithProgress} serverTodayDate={serverTodayDate} />;
}
