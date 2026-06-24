'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Award, Target, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { api } from '@/lib/api';

export default function AchievementsPage() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const [allAch, userAch] = await Promise.all([
        api.getAchievements(),
        api.getUserAchievements(),
      ]);
      setAchievements(allAch.achievements || []);
      setUserAchievements(userAch.achievements || []);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some((ua) => ua.achievement?.id === achievementId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a15]">
        <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] mobile-page-padding relative overflow-x-hidden font-sans">
      
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none" />
      
      <header className="glass-header sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Achievements</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10 page-enter">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`glass-panel rounded-2xl border p-6 transition-all duration-300 ${
                  unlocked 
                    ? 'border-yellow-500/40 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:border-yellow-400' 
                    : 'border-slate-800/60 opacity-50 hover:opacity-75'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border transition-all ${
                      unlocked 
                        ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.2)]' 
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {unlocked ? '🏆' : <Lock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-100 truncate">{achievement.title}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">{achievement.description}</p>
                    {unlocked && (
                      <span className="inline-flex mt-2.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider rounded-md">
                        Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-12 text-center max-w-md mx-auto shadow-2xl mt-8">
            <Trophy className="w-14 h-14 text-slate-500 mx-auto mb-4 opacity-40" />
            <h2 className="text-lg font-bold text-white mb-1.5">No achievements yet</h2>
            <p className="text-xs text-slate-400 font-medium">Complete daily habits and join active challenges to unlock trophies!</p>
          </div>
        )}
      </main>
    </div>
  );
}
