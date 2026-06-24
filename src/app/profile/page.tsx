'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Flame,
  Trophy,
  TrendingUp,
  Target,
  Calendar,
  Zap,
  Award,
  Activity,
  Coins,
  Crown,
  Star,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<any>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);

        // Fetch gamification stats
        const [statsData, achievementsData, progressData] = await Promise.all([
          api.getGamificationStats().catch(() => null),
          api.getUserAchievements().catch(() => null),
          api.getDailyProgress().catch(() => null),
        ]);

        setStats(statsData);
        setAchievements(achievementsData);
        setWeeklyProgress(progressData);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [authLoading, isAuthenticated, router]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#050a15] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userStats = stats || user;
  const completionRate = userStats?.totalHabits
    ? Math.round((userStats.completedHabits || 0) / userStats.totalHabits * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] mobile-page-padding relative overflow-x-hidden font-sans">
      {/* Background mesh glows */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full bg-sky-600/5 blur-[120px] pointer-events-none" />

      <header className="glass-header sticky top-0 z-50 safe-area-top">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="touch-target flex items-center justify-center hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white shrink-0"
                type="button"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">My Profile</h1>
            </div>
            <button
              onClick={() => router.push('/settings')}
              className="touch-target px-3 rounded-xl text-xs font-bold text-sky-400 hover:text-sky-300 uppercase tracking-wider"
              type="button"
            >
              Settings
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10 space-y-6">
        {/* Profile Header Card */}
        <div className="glass-panel rounded-3xl border border-slate-800/80 p-5 sm:p-8 shadow-2xl page-enter">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-700 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-slate-700 shadow-lg">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              {userStats.level && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">{user.username}</h2>
                {userStats.level && (
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-400/30">
                    Level {userStats.level}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mb-3 truncate">{user.email}</p>

              {userStats.xp && userStats.level && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">XP Progress</span>
                    <span className="text-sky-400 font-bold">{userStats.xp} XP</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-sky-400 to-purple-600 rounded-full transition-all"
                      style={{ width: `${Math.min((userStats.xp % 100) || 0, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 page-enter" style={{ animationDelay: '0.1s' }}>

          {/* Points */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-white leading-none">{userStats.points || 0}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 whitespace-nowrap">Points</p>
              </div>
            </div>
            <p className="text-xs text-transparent select-none mt-2">–</p>
          </div>

          {/* Day Streak */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-white leading-none">{userStats.currentStreak || 0}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 whitespace-nowrap">Day Streak</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Best: {userStats.longestStreak || 0} days</p>
          </div>

          {/* Success Rate */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-white leading-none">{completionRate}%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 whitespace-nowrap">Success Rate</p>
              </div>
            </div>
            <p className="text-xs text-transparent select-none mt-2">–</p>
          </div>

          {/* Achievements */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-white leading-none">
                  {achievements?.unlocked?.length || userStats.badges?.length || 0}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 whitespace-nowrap">Achievements</p>
              </div>
            </div>
            <p className="text-xs text-transparent select-none mt-2">–</p>
          </div>

          {/* Active Habits */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-white leading-none">{userStats.totalHabits || 0}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 whitespace-nowrap">Active Habits</p>
              </div>
            </div>
            <p className="text-xs text-transparent select-none mt-2">–</p>
          </div>

          {/* Streak Freezes */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-white leading-none">{userStats.streakFreezes || 0}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 whitespace-nowrap">Streak Freezes</p>
              </div>
            </div>
            <p className="text-xs text-transparent select-none mt-2">–</p>
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements?.unlocked && achievements.unlocked.length > 0 && (
          <div className="glass-panel rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl page-enter" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Recent Achievements
              </h3>
              <button
                onClick={() => router.push('/achievements')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {achievements.unlocked.slice(0, 4).map((achievement: any) => (
                <div
                  key={achievement.id}
                  className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-2xl p-4 text-center hover:from-yellow-400/15 hover:to-orange-500/15 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{achievement.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Progress Summary */}
        {weeklyProgress && (
          <div className="glass-panel rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl page-enter" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-400" />
                This Week's Progress
              </h3>
              <button
                onClick={() => router.push('/progress')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const dayProgress = weeklyProgress?.dailyBreakdown?.[index];
                const completionPercent = dayProgress ? Math.round((dayProgress.completed || 0) / (dayProgress.total || 1) * 100) : 0;
                const isToday = index === (new Date().getDay() + 6) % 7;

                return (
                  <div key={day} className="text-center">
                    <p className="text-xs text-slate-500 font-bold mb-2">{day}</p>
                    <div
                      className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isToday
                          ? 'bg-linear-to-br from-sky-400 to-purple-600 text-white shadow-lg scale-110'
                          : completionPercent > 0
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800/40 text-slate-600'
                      }`}
                    >
                      {completionPercent > 0 ? `${completionPercent}%` : '-'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Weekly Total</p>
                <p className="text-white font-black">{weeklyProgress.totalCompleted || 0}/{weeklyProgress.totalHabits || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Completion</p>
                <p className="text-sky-400 font-black">
                  {weeklyProgress.totalHabits
                    ? Math.round((weeklyProgress.totalCompleted || 0) / weeklyProgress.totalHabits * 100)
                    : 0}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Best Day</p>
                <p className="text-emerald-400 font-black">
                  {weeklyProgress.bestDay || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4 page-enter" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => router.push('/achievements')}
            className="glass-panel tap-card rounded-2xl border border-slate-800/80 p-4 sm:p-6 text-left hover:border-sky-500/30 transition-all group cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Achievements</h4>
                <p className="text-xs text-slate-400">View your badges</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/progress')}
            className="glass-panel tap-card rounded-2xl border border-slate-800/80 p-4 sm:p-6 text-left hover:border-sky-500/30 transition-all group cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Analytics</h4>
                <p className="text-xs text-slate-400">Track progress</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/goals')}
            className="glass-panel tap-card rounded-2xl border border-slate-800/80 p-4 sm:p-6 text-left hover:border-sky-500/30 transition-all group cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Goals</h4>
                <p className="text-xs text-slate-400">Set new targets</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="glass-panel tap-card rounded-2xl border border-slate-800/80 p-4 sm:p-6 text-left hover:border-sky-500/30 transition-all group cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Settings</h4>
                <p className="text-xs text-slate-400">Customize app</p>
              </div>
            </div>
          </button>
        </div>

        {/* Member Since Info */}
        <div className="text-center py-6 page-enter" style={{ animationDelay: '0.5s' }}>
          <p className="text-xs text-slate-500 font-medium">
            Member since{' '}
            <span className="text-slate-400 font-bold">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
