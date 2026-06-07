'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Users, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

export default function ChallengesPage() {
  const router = useRouter();
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);
  const [userChallenges, setUserChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const [active, userCh] = await Promise.all([
        api.getActiveChallenges(),
        api.getUserChallenges(),
      ]);
      setActiveChallenges(active.challenges || []);
      setUserChallenges(userCh.challenges || []);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await api.joinChallenge(challengeId);
      fetchChallenges();
    } catch (error: any) {
      alert('Failed to join challenge: ' + (error.message || 'Unknown error'));
    }
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
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Challenges</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Active Challenges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {activeChallenges.map((challenge) => {
              const joined = userChallenges.some((uc) => uc.challenge?.id === challenge.id);
              return (
                <div key={challenge.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl mb-3">
                      🔥
                    </div>
                    <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500">Reward:</span>
                    <span className="font-medium text-orange-600">{challenge.points || 0} pts</span>
                  </div>
                  {joined ? (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      Joined
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {activeChallenges.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No active challenges</h2>
            <p className="text-gray-500">Check back later for new challenges!</p>
          </div>
        )}
      </main>
    </div>
  );
}
