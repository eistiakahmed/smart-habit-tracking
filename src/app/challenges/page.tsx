'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Users, ArrowLeft, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-[#050a15]">
        <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] mobile-page-padding relative overflow-x-hidden font-sans">
      
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      
      <header className="glass-header sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Challenges</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10 page-enter">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
            <Zap className="w-5 h-5 text-orange-400" />
            Active Challenges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {activeChallenges.map((challenge) => {
              const joined = userChallenges.some((uc) => uc.challenge?.id === challenge.id);
              return (
                <div key={challenge.id} className="glass-panel rounded-2xl border border-slate-800/80 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xl mb-3 shadow-[0_0_12px_rgba(249,115,22,0.1)]">
                      🔥
                    </div>
                    <h3 className="font-bold text-sm text-slate-100">{challenge.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">{challenge.description}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-4 border-t border-slate-800/60 pt-3">
                      <span className="text-slate-500 font-semibold">Reward Points:</span>
                      <span className="font-extrabold text-orange-400">{challenge.points || 0} pts</span>
                    </div>
                    {joined ? (
                      <span className="w-full inline-flex justify-center items-center px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-xl">
                        Joined & Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleJoinChallenge(challenge.id)}
                        className="w-full btn-glow px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-[0_4px_12px_rgba(249,115,22,0.15)] active:scale-[0.98] cursor-pointer"
                      >
                        Join Challenge
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {activeChallenges.length === 0 && (
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-12 text-center max-w-md mx-auto shadow-2xl mt-8">
            <Zap className="w-14 h-14 text-slate-500 mx-auto mb-4 opacity-40" />
            <h2 className="text-lg font-bold text-white mb-1.5">No active challenges</h2>
            <p className="text-xs text-slate-400 font-medium">Check back later for new group challenges!</p>
          </div>
        )}
      </main>
    </div>
  );
}
