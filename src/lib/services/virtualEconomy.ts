import { api, ApiResponse } from '@/lib/api';

// Types for Virtual Economy System
export interface Wallet {
  id: string;
  userId: string;
  balances: {
    habitCoins: number;
    streakTokens: number;
    achievementGems: number;
  };
  stats: {
    totalEarned: number;
    totalSpent: number;
    netWorth: number;
    transactionCount: number;
    averageDailyEarnings: number;
    highestBalance: number;
    earningStreak: number;
  };
  investments: any[];
  passiveIncome: {
    streakBonus: number;
    referralBonus: number;
    achievementDividend: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: 'EARN' | 'SPEND' | 'TRANSFER' | 'INVEST' | 'REWARD' | 'PENALTY';
  currency: 'HABIT_COINS' | 'STREAK_TOKENS' | 'ACHIEVEMENT_GEMS';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
  description: string;
  relatedHabitId?: string;
  relatedAchievementId?: string;
  relatedUserId?: string;
  metadata: {
    source?: string;
    category?: string;
    notes?: string;
  };
  completedAt?: string;
  createdAt: string;
}

export interface MarketplaceListing {
  id: string;
  userId: string;
  habitId?: string;
  itemId: string;
  listingType: 'HABIT' | 'TEMPLATE' | 'POWERUP' | 'CUSTOM';
  title: string;
  description: string;
  price: number;
  currency: 'HABIT_COINS' | 'STREAK_TOKENS' | 'ACHIEVEMENT_GEMS';
  category: string;
  tags: string[];
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  stats: {
    views: number;
    likes: number;
    sales: number;
    revenue: number;
    rating: number;
    reviewCount: number;
  };
  status: 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'WITHDRAWN';
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PowerUp {
  id: string;
  userId: string;
  type: 'STREAK_FREEZE' | 'DOUBLE_REWARDS' | 'INSTANT_COMPLETE' | 'HABIT_BOOST' | 'TIME_WARP';
  name: string;
  description: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  effects: {
    duration?: number;
    multiplier?: number;
    protection?: number;
    boost?: number;
  };
  uses: number;
  maxUses: number;
  active: boolean;
  activatedAt?: string;
  expiresAt?: string;
  targetHabitId?: string;
  createdAt: string;
}

export interface EconomyStats {
  wallet: Wallet;
  recentTransactions: Transaction[];
  analytics: {
    spendingByCategory: any[];
    earningByCategory: any[];
    netFlow: number;
    efficiency: number;
  };
}

// Virtual Economy API Service
class VirtualEconomyService {
  // Wallet Operations
  async getUserWallet(): Promise<ApiResponse<Wallet>> {
    return api.get<ApiResponse<Wallet>>('/economy/wallet');
  }

  async getWalletBalance(): Promise<ApiResponse<{ balances: Wallet['balances'] }>> {
    return api.get<ApiResponse<{ balances: Wallet['balances'] }>>('/economy/balance');
  }

  // Currency Operations
  async earnCurrency(amount: number, currency: string = 'HABIT_COINS', details: any = {}): Promise<ApiResponse<Wallet>> {
    return api.post<ApiResponse<Wallet>>('/economy/earn', {
      amount,
      currency,
      ...details,
    });
  }

  async spendCurrency(amount: number, currency: string = 'HABIT_COINS', details: any = {}): Promise<ApiResponse<Wallet>> {
    return api.post<ApiResponse<Wallet>>('/economy/spend', {
      amount,
      currency,
      ...details,
    });
  }

  async transferCurrency(toUserId: string, amount: number, currency: string = 'HABIT_COINS', description: string = 'Transfer'): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>('/economy/transfer', {
      toUserId,
      amount,
      currency,
      description,
    });
  }

  // Habit Completion Rewards
  async processHabitCompletion(habitId: string): Promise<ApiResponse<{ reward: number; breakdown: any }>> {
    return api.post<ApiResponse<{ reward: number; breakdown: any }>>('/economy/habit-complete', {
      habitId,
    });
  }

  async calculateHabitReward(habitId: string): Promise<ApiResponse<{ reward: number }>> {
    return api.post<ApiResponse<{ reward: number }>>('/economy/calculate-reward', {
      habitId,
    });
  }

  // Marketplace Operations
  async createListing(listingData: any): Promise<ApiResponse<MarketplaceListing>> {
    return api.post<ApiResponse<MarketplaceListing>>('/economy/marketplace/listings', listingData);
  }

  async purchaseListing(listingId: string): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>(`/economy/marketplace/purchase/${listingId}`);
  }

  async searchListings(filters: any = {}): Promise<ApiResponse<{ listings: MarketplaceListing[] }>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return api.get<ApiResponse<{ listings: MarketplaceListing[] }>>(`/economy/marketplace/search?${params.toString()}`);
  }

  async getListingDetails(listingId: string): Promise<ApiResponse<{ listing: MarketplaceListing }>> {
    return api.get<ApiResponse<{ listing: MarketplaceListing }>>(`/economy/marketplace/listing/${listingId}`);
  }

  // Power-Up Operations
  async grantPowerUp(powerUpData: any): Promise<ApiResponse<PowerUp>> {
    return api.post<ApiResponse<PowerUp>>('/economy/power-ups', powerUpData);
  }

  async usePowerUp(powerUpId: string): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>(`/economy/power-ups/use/${powerUpId}`);
  }

  async getUserPowerUps(): Promise<ApiResponse<{ powerUps: PowerUp[] }>> {
    return api.get<ApiResponse<{ powerUps: PowerUp[] }>>('/economy/power-ups');
  }

  // Analytics
  async getEconomyStats(): Promise<ApiResponse<EconomyStats>> {
    return api.get<ApiResponse<EconomyStats>>('/economy/stats');
  }

  async getTransactionHistory(limit: number = 20): Promise<ApiResponse<{ transactions: Transaction[] }>> {
    return api.get<ApiResponse<{ transactions: Transaction[] }>>(`/economy/transactions?limit=${limit}`);
  }

  // Marketplace Categories
  async getMarketplaceCategories(): Promise<ApiResponse<{ categories: string[] }>> {
    return api.get<ApiResponse<{ categories: string[] }>>('/economy/marketplace/categories');
  }

  async getTrendingListings(): Promise<ApiResponse<{ listings: MarketplaceListing[] }>> {
    return api.get<ApiResponse<{ listings: MarketplaceListing[] }>>('/economy/marketplace/trending');
  }
}

export const virtualEconomyService = new VirtualEconomyService();
