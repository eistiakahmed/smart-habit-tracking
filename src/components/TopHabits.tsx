import { Habit } from '@/types';
import ProgressBar from './ProgressBar';
import { getProgressColor } from '@/lib/utils';
import { Droplets, Dumbbell, BookOpen, Brain, Apple, Zap, Target, Heart, Flame } from 'lucide-react';

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
  Health: '#0ea5e9',
  Fitness: '#f97316',
  Learning: '#10b981',
  'Mental Health': '#a855f7',
  Nutrition: '#ef4444',
  Productivity: '#f59e0b',
  Goals: '#6366f1',
  Wellness: '#ec4899',
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
    <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 shadow-2xl relative overflow-hidden font-sans">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800/40 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Top Habits</h2>
          <p className="text-xs text-slate-400 mt-1">Your most consistent daily routines</p>
        </div>
        <div className="text-right">
          <div 
            className="text-2xl font-black tracking-tight" 
            style={{ 
              color: getProgressColor(overallProgress),
              textShadow: `0 0 10px ${getProgressColor(overallProgress)}30`
            }}
          >
            {overallProgress}%
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Overall Progress</div>
        </div>
      </div>

      <div className="space-y-4.5">
        {topHabits.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30 text-sky-400" />
            <p className="text-sm font-semibold">No active habits yet</p>
          </div>
        ) : (
          topHabits.map((habit) => {
            const progress = habit.stats?.completionRate || 0;
            const streak = habit.stats?.currentStreak || 0;
            const IconComponent = categoryIcons[habit.category] || Target;
            const defaultColor = categoryColors[habit.category] || '#6B7280';
            const habitColor = habit.color || defaultColor;

            return (
              <div
                key={habit.id}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-900/30 border border-transparent hover:border-slate-800/50 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                  style={{ 
                    backgroundColor: `${habitColor}15`,
                    borderColor: `${habitColor}35`
                  }}
                >
                  <IconComponent
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    style={{ color: habitColor }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold text-sm text-slate-200 truncate group-hover:text-white transition-colors">
                      {habit.title}
                    </h3>
                    {streak >= 3 && (
                      <span className="flex items-center gap-0.5 text-orange-500 text-xs font-bold bg-orange-500/10 px-1.5 py-0.5 rounded-md border border-orange-500/20 shadow-[0_0_6px_rgba(249,115,22,0.15)]">
                        <Flame className="w-3.5 h-3.5 fill-orange-500" />
                        {streak}d
                      </span>
                    )}
                  </div>
                  <ProgressBar
                    progress={progress}
                    size="sm"
                    color={habitColor}
                    showPercentage={false}
                  />
                </div>

                <div className="flex-shrink-0 w-12 text-right">
                  <span className="text-sm font-bold" style={{ color: habitColor }}>
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
