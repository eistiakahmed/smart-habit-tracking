import { Habit } from '@/types';
import ProgressBar from './ProgressBar';
import { getProgressColor } from '@/lib/utils';
import { Droplets, Dumbbell, BookOpen, Brain, Apple, Zap, Target, Heart } from 'lucide-react';

interface TopHabitsProps {
  habits: Habit[];
  maxHabits?: number;
}

const categoryIcons: Record<string, React.ElementType> = {
  Health: Droplets,
  Fitness: Dumbbell,
  Learning: BookOpen,
  'Mental Health': Brain,
  Nutrition: Apple,
  Productivity: Zap,
  Goals: Target,
  Wellness: Heart,
};

const categoryColors: Record<string, string> = {
  Health: '#3B82F6',
  Fitness: '#F97316',
  Learning: '#10B981',
  'Mental Health': '#8B5CF6',
  Nutrition: '#EF4444',
  Productivity: '#F59E0B',
  Goals: '#6366F1',
  Wellness: '#EC4899',
};

export default function TopHabits({ habits, maxHabits = 10 }: TopHabitsProps) {
  const topHabits = habits
    .filter(h => h.isActive)
    .sort((a, b) => (b.stats?.completionRate || 0) - (a.stats?.completionRate || 0))
    .slice(0, maxHabits);

  const totalCompleted = habits.reduce((sum, h) => sum + (h.stats?.daysCompleted || 0), 0);
  const totalDays = habits.reduce((sum, h) => sum + (h.stats?.totalDays || 0), 0);
  const overallProgress = totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Top Habits</h2>
          <p className="text-sm text-gray-500 mt-1">Your most consistent habits</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: getProgressColor(overallProgress) }}>
            {overallProgress}%
          </div>
          <div className="text-xs text-gray-500">Overall Progress</div>
        </div>
      </div>

      <div className="space-y-4">
        {topHabits.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active habits yet. Create one to get started!</p>
          </div>
        ) : (
          topHabits.map((habit) => {
            const progress = habit.stats?.completionRate || 0;
            const streak = habit.stats?.currentStreak || 0;
            const IconComponent = categoryIcons[habit.category] || Target;
            const defaultColor = categoryColors[habit.category] || '#6B7280';

            return (
              <div
                key={habit.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: habit.color + '20' }}
                >
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: habit.color || defaultColor }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800 truncate">{habit.title}</h3>
                    {streak >= 7 && (
                      <span className="flex items-center gap-1 text-orange-500 text-xs font-medium">
                        <Zap className="w-3 h-3 fill-orange-500" />
                        {streak}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <IconComponent className="w-3 h-3" />
                    {habit.category}
                  </p>
                  <ProgressBar
                    progress={progress}
                    size="sm"
                    color={habit.color}
                    showPercentage={false}
                  />
                </div>

                <div className="flex-shrink-0 w-12 text-right">
                  <span className="text-sm font-semibold" style={{ color: habit.color }}>
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
