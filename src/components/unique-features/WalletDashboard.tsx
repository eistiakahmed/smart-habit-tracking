'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Wallet, ShoppingBag, Zap, Gift, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

interface WalletProps {
  userId: string;
}

export function WalletDashboard({ userId }: WalletProps) {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    loadWallet();
  }, [userId]);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const response = await api.getUserWallet();
      setWallet(response);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-center text-gray-600">Unable to load wallet</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Your Wallet</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-sm opacity-80">HabitCoins</div>
            <div className="text-3xl font-bold">{wallet.balances.habitCoins.toLocaleString()}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-sm opacity-80">Streak Tokens</div>
            <div className="text-3xl font-bold">{wallet.balances.streakTokens.toLocaleString()}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-sm opacity-80">Achievement Gems</div>
            <div className="text-3xl font-bold">{wallet.balances.achievementGems.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earned"
          value={wallet.stats.totalEarned.toLocaleString()}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Total Spent"
          value={wallet.stats.totalSpent.toLocaleString()}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          title="Net Worth"
          value={wallet.stats.netWorth.toLocaleString()}
          icon={<Wallet className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Earning Streak"
          value={`${wallet.stats.earningStreak} days`}
          icon={<Gift className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ActionButton
          icon={<Coins className="w-5 h-5" />}
          label="Marketplace"
          color="yellow"
          onClick={() => {/* Navigate to marketplace */}}
        />
        <ActionButton
          icon={<Zap className="w-5 h-5" />}
          label="Power-Ups"
          color="blue"
          onClick={() => {/* Navigate to power-ups */}}
        />
        <ActionButton
          icon={<TrendingUp className="w-5 h-5" />}
          label="Transactions"
          color="green"
          onClick={() => setShowTransactions(!showTransactions)}
        />
        <ActionButton
          icon={<Gift className="w-5 h-5" />}
          label="Rewards"
          color="purple"
          onClick={() => {/* Navigate to rewards */}}
        />
      </div>

      {/* Recent Transactions */}
      {showTransactions && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <TransactionList userId={userId} limit={5} />
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4 border`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="text-gray-600">{icon}</div>
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

function ActionButton({ icon, label, color, onClick }: ActionButtonProps) {
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
    blue: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
    green: 'bg-green-100 hover:bg-green-200 text-green-700',
    purple: 'bg-purple-100 hover:bg-purple-200 text-purple-700',
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} rounded-lg p-3 flex flex-col items-center gap-2 transition-colors`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

interface TransactionListProps {
  userId: string;
  limit?: number;
}

function TransactionList({ userId, limit = 5 }: TransactionListProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [userId, limit]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.getTransactionHistory(limit);
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded"></div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{tx.description}</div>
            <div className="text-xs text-gray-600">{tx.type}</div>
          </div>
          <div className="text-right">
            <div className={`font-semibold ${tx.type === 'EARN' ? 'text-green-600' : 'text-red-600'}`}>
              {tx.type === 'EARN' ? '+' : '-'}{tx.amount}
            </div>
            <div className="text-xs text-gray-600">{tx.currency}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
