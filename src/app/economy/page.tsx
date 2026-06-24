import React, { useState, useEffect } from 'react';
import { WalletDashboard } from '@/components/unique-features/WalletDashboard';
import { Marketplace } from '@/components/unique-features/Marketplace';
import { api } from '@/lib/api';

export default function VirtualEconomyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Virtual Economy</h1>
        <p className="text-gray-600">
          Earn currency, trade habits, collect power-ups, and build your habit fortune
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WalletDashboard userId="current" />
          <Marketplace userId="current" />
          <PowerUpsPanel userId="current" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EconomyLeaderboard />
          <RecentActivity userId="current" />
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
}

function PowerUpsPanel({ userId }: { userId: string }) {
  const [powerUps, setPowerUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPowerUps();
  }, [userId]);

  const loadPowerUps = async () => {
    try {
      const response = await api.getUserPowerUps();
      setPowerUps(response.powerUps || []);
    } catch (error) {
      console.error('Failed to load power-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Power-Ups</h2>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      ) : powerUps.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⚡</div>
          <p>No power-ups available yet</p>
          <p className="text-sm">Complete more habits to earn power-ups!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {powerUps.map((powerUp: any) => (
            <PowerUpCard
              key={powerUp.id}
              powerUp={powerUp}
              onUse={async (powerUpId: string) => {
                await api.usePowerUp(powerUpId);
                loadPowerUps();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PowerUpCardProps {
  powerUp: any;
  onUse: (powerUpId: string) => void;
}

function PowerUpCard({ powerUp, onUse }: PowerUpCardProps) {
  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'STREAK_FREEZE': return '🔒';
      case 'DOUBLE_REWARDS': return '✨';
      case 'INSTANT_COMPLETE': return '⚡';
      case 'HABIT_BOOST': return '🚀';
      case 'TIME_WARP': return '⏰';
      default: return '💫';
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{getPowerUpIcon(powerUp.type)}</span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          powerUp.rarity === 'LEGENDARY' ? 'bg-yellow-100 text-yellow-700' :
          powerUp.rarity === 'EPIC' ? 'bg-purple-100 text-purple-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {powerUp.rarity}
        </span>
      </div>

      <div className="font-semibold text-gray-900 mb-1">{powerUp.name}</div>
      <p className="text-sm text-gray-700 mb-3">{powerUp.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
        <span>Uses: {powerUp.uses}/{powerUp.maxUses}</span>
        {powerUp.active && powerUp.expiresAt && (
          <span>Expires: {new Date(powerUp.expiresAt).toLocaleDateString()}</span>
        )}
      </div>

      <button
        onClick={() => onUse(powerUp.id)}
        disabled={powerUp.uses >= powerUp.maxUses}
        className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Use Power-Up
      </button>
    </div>
  );
}

function EconomyLeaderboard() {
  const [topUsers, setTopUsers] = useState<any[]>([]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">🏆 Economy Leaders</h3>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((rank, i) => (
          <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
              rank === 1 ? 'bg-yellow-500' :
              rank === 2 ? 'bg-gray-400' :
              rank === 3 ? 'bg-orange-600' :
              'bg-gray-500'
            }`}>
              {rank}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">User #{rank}</div>
              <div className="text-xs text-gray-600">{(10000 - rank * 100) + Math.floor(Math.random() * 500)} 💰</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<any[]>([]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">📈 Recent Activity</h3>
      <div className="space-y-2">
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No recent activity</p>
        ) : (
          activities.map((activity: any, index: number) => (
            <div key={index} className="text-xs text-gray-700 p-2 bg-gray-50 rounded">
              {activity.description}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CurrencyConverter() {
  const [coins, setCoins] = useState<number>(100);
  const [tokens, setTokens] = useState<number>(5);
  const [gems, setGems] = useState<number>(1);

  const tokenRate = 10; // 1 token = 10 coins
  const gemRate = 50; // 1 gem = 50 coins

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">💱 Currency Converter</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 mb-1">HabitCoins</label>
          <input
            type="number"
            value={coins}
            onChange={(e) => {
              setCoins(parseInt(e.target.value) || 0);
              setTokens(Math.floor(coins / tokenRate));
              setGems(Math.floor(coins / gemRate));
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1">≈ {tokens} Streak Tokens</label>
          <div className="text-xs text-gray-500">1 Token = {tokenRate} Coins</div>
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1">≈ {gems} Achievement Gems</label>
          <div className="text-xs text-gray-500">1 Gem = {gemRate} Coins</div>
        </div>
      </div>
    </div>
  );
}
