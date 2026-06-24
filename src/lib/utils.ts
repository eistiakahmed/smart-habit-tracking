export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function getWeekColors() {
  return {
    week1: '#3B82F6',
    week2: '#F97316',
    week3: '#10B981',
    week4: '#8B5CF6',
  };
}

export function getWeekLabel(weekIndex: number): string {
  return `Week ${weekIndex + 1}`;
}

export function getDayLabel(dayIndex: number): string {
  return `Day ${dayIndex + 1}`;
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return '#10B981';
  if (percentage >= 50) return '#F59E0B';
  if (percentage >= 25) return '#F97316';
  return '#EF4444';
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDaysToDateString(dateString: string, days: number): string {
  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function generate30DayDates(startDate: Date = new Date()): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - (29 - i));
    dates.push(formatLocalDate(date));
  }
  return dates;
}

export function groupIntoWeeks(days: any[], daysPerWeek: number = 7): any[][] {
  const weeks: any[][] = [];
  for (let i = 0; i < days.length; i += daysPerWeek) {
    weeks.push(days.slice(i, i + daysPerWeek));
  }
  return weeks;
}

export function calculateWeeklyProgress(days: boolean[]): number[] {
  const weeks = groupIntoWeeks(days);
  return weeks.map(week => {
    const completed = week.filter(day => day).length;
    return Math.round((completed / week.length) * 100);
  });
}
