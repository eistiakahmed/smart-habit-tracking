'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function SocialPage() {
  const router = useRouter();
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialData();
  }, []);

  const fetchSocialData = async () => {
    try {
      const [friendsData, requestsData, activityData, leaderboardData] = await Promise.all([
        api.getFriends(),
        api.getPendingRequests(),
        api.getFriendActivity(20),
        api.getSocialLeaderboard(),
      ]);
      setFriends(friendsData.friends || []);
      setPendingRequests(requestsData.requests || []);
      setActivity(activityData.activities || []);
      setLeaderboard(leaderboardData.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondRequest = async (requestId: string, accept: boolean) => {
    try {
      await api.respondToFriendRequest(requestId, accept);
      setPendingRequests(pendingRequests.filter((r) => r.id !== requestId));
      if (accept) {
        fetchSocialData();
      }
    } catch (error: any) {
      alert('Failed to respond: ' + (error.message || 'Unknown error'));
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
      
      {/* Decorative background mesh */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <header className="glass-header sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Social Connection</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10 page-enter">
        {pendingRequests.length > 0 && (
          <div className="mb-8 glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-2xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
              <Users className="w-5 h-5 text-sky-400" />
              Pending Friend Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-3.5">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    {request.sender?.avatar ? (
                      <img src={request.sender.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm border border-slate-700">
                        {request.sender?.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-200 text-sm">{request.sender?.username}</div>
                      {request.message && <div className="text-xs text-slate-400 mt-1">{request.message}</div>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRespondRequest(request.id, true)}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespondRequest(request.id, false)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Friends list */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-2xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
              <Users className="w-5 h-5 text-sky-400" />
              Friends ({friends.length})
            </h2>
            {friends.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm font-semibold">No friends added yet</p>
                <p className="text-xs text-slate-600 mt-1">Send requests to colleagues to compete!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3.5 p-3 bg-slate-950/40 border border-slate-900/60 rounded-xl hover:bg-slate-900/40 transition-colors">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm border border-slate-700">
                        {friend.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-200 text-sm truncate">{friend.username}</div>
                      <div className="text-xs text-slate-400 font-semibold mt-1">{friend.totalPoints || 0} activity pts</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard list */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-2xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
              <Share2 className="w-5 h-5 text-purple-400" />
              Leaderboard Standings
            </h2>
            <div className="space-y-2.5">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <div key={entry.id} className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-900/60 rounded-xl hover:bg-slate-900/30 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs border ${
                    index === 0 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                    index === 1 ? 'bg-slate-300/10 border-slate-300/30 text-slate-300' :
                    index === 2 ? 'bg-amber-700/10 border-amber-700/30 text-amber-500' :
                    'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  {entry.avatar ? (
                    <img src={entry.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-850 flex items-center justify-center text-slate-300 text-xs font-bold">
                      {entry.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-200 text-xs truncate">{entry.username}</div>
                  </div>
                  <div className="text-xs font-black text-sky-400">{entry.totalPoints || 0} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        {activity.length > 0 && (
          <div className="mt-6 glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-2xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">Friend Activity Feed</h2>
            <div className="space-y-3.5">
              {activity.map((act, index) => (
                <div key={index} className="flex items-center gap-3.5 p-3 border-b border-slate-800/40 last:border-0">
                  {act.user?.avatar ? (
                    <img src={act.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 text-xs font-semibold">
                      {act.user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 text-xs leading-relaxed">
                    <span className="font-bold text-slate-200">{act.user?.username}</span>
                    <span className="text-slate-400 font-medium"> {act.activity}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{act.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
