'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Award, Target, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] mobile-page-padding">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Achievements</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl shadow-sm border p-6 ${
                  unlocked ? 'border-yellow-300' : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                      unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}
                  >
                    {unlocked ? '🏆' : '🔒'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                    {unlocked && (
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Unlocked!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No achievements yet</h2>
            <p className="text-gray-500">Complete habits and challenges to unlock achievements!</p>
          </div>
        )}
      </main>
    </div>
  );
}
