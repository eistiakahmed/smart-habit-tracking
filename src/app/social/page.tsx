'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Share2, ArrowLeft } from 'lucide-react';
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
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Social</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {pendingRequests.length > 0 && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Pending Friend Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {request.sender?.avatar ? (
                      <img src={request.sender.avatar} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {request.sender?.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{request.sender?.username}</div>
                      {request.message && <div className="text-sm text-gray-500">{request.message}</div>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRespondRequest(request.id, true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespondRequest(request.id, false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Friends ({friends.length})
            </h2>
            {friends.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No friends yet. Send friend requests to connect!</p>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {friend.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{friend.username}</div>
                      <div className="text-sm text-gray-500">{friend.totalPoints || 0} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Leaderboard
            </h2>
            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <div key={entry.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-400 text-orange-900' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {entry.avatar ? (
                    <img src={entry.avatar} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                      {entry.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{entry.username}</div>
                  </div>
                  <div className="text-sm font-semibold text-blue-600">{entry.totalPoints || 0} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {activity.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Friend Activity</h2>
            <div className="space-y-3">
              {activity.map((act, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-0">
                  {act.user?.avatar ? (
                    <img src={act.user.avatar} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      {act.user?.username?.[0]}
                    </div>
                  )}
                  <div className="flex-1 text-sm">
                    <span className="font-medium text-gray-900">{act.user?.username}</span>
                    <span className="text-gray-500"> {act.activity}</span>
                  </div>
                  <span className="text-xs text-gray-400">{act.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
