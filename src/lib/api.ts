import { Habit, HabitProgress, ToggleHabitResponse, CreateHabitData, DailyProgress } from '@/types';
import { authService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = authService.getToken();

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        const newToken = await authService.refreshAccessToken();
        if (newToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          } as HeadersInit;
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error?.message || 'API request failed');
          }
          const data = await retryResponse.json();
          return data.data || data;
        }
        authService.clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `API error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // Habit endpoints
  async getHabits(params?: { category?: string; isActive?: boolean; page?: number; limit?: number }): Promise<{
    habits: Habit[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryString = new URLSearchParams();
    if (params?.category) queryString.append('category', params.category);
    if (params?.isActive !== undefined) queryString.append('isActive', String(params.isActive));
    if (params?.page) queryString.append('page', String(params.page));
    if (params?.limit) queryString.append('limit', String(params.limit));

    const query = queryString.toString();
    return this.request(`/habits${query ? `?${query}` : ''}`);
  }

  async getHabit(id: string): Promise<Habit & { recentLogs: any[] }> {
    return this.request(`/habits/${id}`);
  }

  async createHabit(data: CreateHabitData): Promise<Habit> {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHabit(id: string, data: Partial<CreateHabitData & { isActive?: boolean }>): Promise<Habit> {
    return this.request(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHabit(id: string): Promise<void> {
    return this.request(`/habits/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleHabit(id: string, data?: { note?: string; mood?: number }): Promise<ToggleHabitResponse> {
    return this.request(`/habits/${id}/toggle`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async getHabitProgress(id: string, startDate?: string, endDate?: string): Promise<HabitProgress> {
    const queryString = new URLSearchParams();
    if (startDate) queryString.append('startDate', startDate);
    if (endDate) queryString.append('endDate', endDate);

    const query = queryString.toString();
    return this.request(`/habits/${id}/progress${query ? `?${query}` : ''}`);
  }

  async getHabitStreak(id: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    streakHistory: Array<{
      startDate: string;
      endDate: string;
      days: number;
    }>;
    milestones: Array<{
      days: number;
      achieved: boolean;
      date?: string;
    }>;
  }> {
    return this.request(`/habits/${id}/streak`);
  }

  // Goal endpoints
  async getGoals(params?: { status?: string; category?: string; page?: number; limit?: number }): Promise<{
    goals: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryString = new URLSearchParams();
    if (params?.status) queryString.append('status', params.status);
    if (params?.category) queryString.append('category', params.category);
    if (params?.page) queryString.append('page', String(params.page));
    if (params?.limit) queryString.append('limit', String(params.limit));

    const query = queryString.toString();
    return this.request(`/goals${query ? `?${query}` : ''}`);
  }

  async createGoal(data: {
    title: string;
    description?: string;
    targetValue: number;
    unit?: string;
    targetDate: string;
    category: string;
  }): Promise<any> {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGoal(id: string): Promise<any> {
    return this.request(`/goals/${id}`);
  }

  async updateGoal(id: string, data: {
    title?: string;
    description?: string;
    currentValue?: number;
    targetValue?: number;
    targetDate?: string;
    status?: string;
  }): Promise<any> {
    return this.request(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGoal(id: string): Promise<void> {
    return this.request(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  async getGoalProgress(id: string): Promise<any> {
    return this.request(`/goals/${id}/progress`);
  }

  async updateGoalProgress(id: string, value: number): Promise<any> {
    return this.request(`/goals/${id}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async getGoalStats(): Promise<any> {
    return this.request('/goals/stats');
  }

  // Gamification endpoints
  async getGamificationStats(): Promise<any> {
    return this.request('/gamification/stats');
  }

  async getUserRank(): Promise<any> {
    return this.request('/gamification/rank');
  }

  async getLeaderboard(params?: { limit?: number; period?: string }): Promise<any> {
    const queryString = new URLSearchParams();
    if (params?.limit) queryString.append('limit', String(params.limit));
    if (params?.period) queryString.append('period', params.period);

    const query = queryString.toString();
    return this.request(`/gamification/leaderboard${query ? `?${query}` : ''}`);
  }

  async getAchievements(): Promise<any> {
    return this.request('/gamification/achievements');
  }

  async getUserAchievements(): Promise<any> {
    return this.request('/gamification/achievements/my');
  }

  async getActiveChallenges(): Promise<any> {
    return this.request('/gamification/challenges');
  }

  async getUserChallenges(): Promise<any> {
    return this.request('/gamification/challenges/my');
  }

  async joinChallenge(challengeId: string): Promise<any> {
    return this.request(`/gamification/challenges/${challengeId}/join`, {
      method: 'POST',
    });
  }

  // Analytics endpoints
  async getWeeklyReport(startDate?: string, endDate?: string): Promise<any> {
    const queryString = new URLSearchParams();
    if (startDate) queryString.append('startDate', startDate);
    if (endDate) queryString.append('endDate', endDate);

    const query = queryString.toString();
    return this.request(`/analytics/weekly-report${query ? `?${query}` : ''}`);
  }

  async getMonthlyInsights(): Promise<any> {
    return this.request('/analytics/monthly-insights');
  }

  async getHabitPatterns(): Promise<any> {
    return this.request('/analytics/habit-patterns');
  }

  async getProductivityInsights(): Promise<any> {
    return this.request('/analytics/productivity-insights');
  }

  async getDailyProgress(date?: string): Promise<DailyProgress> {
    const queryString = new URLSearchParams();
    if (date) queryString.append('date', date);

    const query = queryString.toString();
    return this.request(`/analytics/daily-progress${query ? `?${query}` : ''}`);
  }

  // Social endpoints
  async getFriends(): Promise<any> {
    return this.request('/social/friends');
  }

  async getPendingRequests(): Promise<any> {
    return this.request('/social/friends/requests');
  }

  async sendFriendRequest(receiverId: string, message?: string): Promise<any> {
    return this.request('/social/friends/request', {
      method: 'POST',
      body: JSON.stringify({ receiverId, message }),
    });
  }

  async respondToFriendRequest(requestId: string, accept: boolean): Promise<any> {
    return this.request(`/social/friends/request/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ accept }),
    });
  }

  async getFriendActivity(limit?: number): Promise<any> {
    const queryString = new URLSearchParams();
    if (limit) queryString.append('limit', String(limit));

    const query = queryString.toString();
    return this.request(`/social/activity${query ? `?${query}` : ''}`);
  }

  async shareHabitProgress(habitId: string, message?: string): Promise<any> {
    return this.request('/social/share', {
      method: 'POST',
      body: JSON.stringify({ habitId, message }),
    });
  }

  async getSocialLeaderboard(): Promise<any> {
    return this.request('/social/leaderboard');
  }

  // Auth endpoints (helper methods)
  async logout(refreshToken: string): Promise<void> {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    timezone?: string;
    preferences?: Record<string, any>;
  }): Promise<any> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // UNIQUE FEATURES: HABIT DNA SYSTEM
  // ========================================
  async analyzeHabitGenetics(habitId: string): Promise<any> {
    return this.request(`/habit-dna/analyze/${habitId}`);
  }

  async breedHabits(parentId1: string, parentId2: string): Promise<any> {
    return this.request('/habit-dna/breed', {
      method: 'POST',
      body: JSON.stringify({ parentId1, parentId2 }),
    });
  }

  async getBreedingSuggestions(habitId: string): Promise<any> {
    return this.request(`/habit-dna/breeding-suggestions/${habitId}`);
  }

  async mutateHabit(habitId: string, forcedType?: string): Promise<any> {
    return this.request(`/habit-dna/mutate/${habitId}`, {
      method: 'POST',
      body: JSON.stringify({ forcedType }),
    });
  }

  async getGeneticInsights(habitId: string): Promise<any> {
    return this.request(`/habit-dna/insights/${habitId}`);
  }

  async getUserHabitDNA(): Promise<any> {
    return this.request('/habit-dna/my-dnas');
  }

  // ========================================
  // UNIQUE FEATURES: VIRTUAL ECONOMY
  // ========================================
  async getUserWallet(): Promise<any> {
    return this.request('/economy/wallet');
  }

  async getWalletBalance(): Promise<any> {
    return this.request('/economy/balance');
  }

  async earnCurrency(amount: number, currency: string = 'HABIT_COINS', details: any = {}): Promise<any> {
    return this.request('/economy/earn', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, ...details }),
    });
  }

  async spendCurrency(amount: number, currency: string = 'HABIT_COINS', details: any = {}): Promise<any> {
    return this.request('/economy/spend', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, ...details }),
    });
  }

  async transferCurrency(toUserId: string, amount: number, currency: string = 'HABIT_COINS', description: string = 'Transfer'): Promise<any> {
    return this.request('/economy/transfer', {
      method: 'POST',
      body: JSON.stringify({ toUserId, amount, currency, description }),
    });
  }

  async processHabitCompletion(habitId: string): Promise<any> {
    return this.request('/economy/habit-complete', {
      method: 'POST',
      body: JSON.stringify({ habitId }),
    });
  }

  async searchMarketplace(filters: any = {}): Promise<any> {
    const queryString = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value));
      }
    });

    const query = queryString.toString();
    return this.request(`/economy/marketplace/search${query ? `?${query}` : ''}`);
  }

  async purchaseListing(listingId: string): Promise<any> {
    return this.request(`/economy/marketplace/purchase/${listingId}`, {
      method: 'POST',
    });
  }

  async createListing(listingData: any): Promise<any> {
    return this.request('/economy/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  async getUserPowerUps(): Promise<any> {
    return this.request('/economy/power-ups');
  }

  async usePowerUp(powerUpId: string): Promise<any> {
    return this.request(`/economy/power-ups/use/${powerUpId}`, {
      method: 'POST',
    });
  }

  async getEconomyStats(): Promise<any> {
    return this.request('/economy/stats');
  }

  async getTransactionHistory(limit: number = 20): Promise<any> {
    return this.request(`/economy/transactions?limit=${limit}`);
  }

  // ========================================
  // UNIQUE FEATURES: ENERGY SCHEDULING
  // ========================================
  async logEnergy(energyData: any): Promise<any> {
    return this.request('/energy/log', {
      method: 'POST',
      body: JSON.stringify(energyData),
    });
  }

  async logEnergyFromHabit(habitId: string, completionData: any = {}): Promise<any> {
    return this.request(`/energy/log-from-habit/${habitId}`, {
      method: 'POST',
      body: JSON.stringify(completionData),
    });
  }

  async getTodayEnergyLogs(): Promise<any> {
    return this.request('/energy/logs/today');
  }

  async getEnergyPatterns(): Promise<any> {
    return this.request('/energy/patterns');
  }

  async analyzeEnergyPatterns(): Promise<any> {
    return this.request('/energy/analyze', {
      method: 'POST',
    });
  }

  async getCurrentEnergyLevel(): Promise<any> {
    return this.request('/energy/current');
  }

  async generateScheduleRecommendations(habitId: string): Promise<any> {
    return this.request(`/energy/schedule-recommendations/${habitId}`);
  }

  async getOptimalSchedule(): Promise<any> {
    return this.request('/energy/optimal-schedule');
  }

  async createEnergyGoal(goalData: any): Promise<any> {
    return this.request('/energy/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async getEnergyGoals(): Promise<any> {
    return this.request('/energy/goals');
  }

  async getEnergyInsights(): Promise<any> {
    return this.request('/energy/insights');
  }

  // ========================================
  // UNIQUE FEATURES: TIME MACHINE
  // ========================================
  async createScenario(scenarioData: any): Promise<any> {
    return this.request('/timemachine/scenarios', {
      method: 'POST',
      body: JSON.stringify(scenarioData),
    });
  }

  async runScenario(scenarioId: string): Promise<any> {
    return this.request(`/timemachine/scenarios/${scenarioId}/run`, {
      method: 'POST',
    });
  }

  async getUserScenarios(): Promise<any> {
    return this.request('/timemachine/scenarios');
  }

  async getScenario(scenarioId: string): Promise<any> {
    return this.request(`/timemachine/scenarios/${scenarioId}`);
  }

  async predictFuturePerformance(timeframe: number = 30): Promise<any> {
    return this.request(`/timemachine/predict?timeframe=${timeframe}`);
  }

  async createAlternativeTimeline(divergenceDate: string, modifications: any[]): Promise<any> {
    return this.request('/timemachine/alternative-timeline', {
      method: 'POST',
      body: JSON.stringify({ divergenceDate, modifications }),
    });
  }

  async compareStrategies(strategies: any[]): Promise<any> {
    return this.request('/timemachine/compare-strategies', {
      method: 'POST',
      body: JSON.stringify({ strategies }),
    });
  }

  async designExperiment(experimentData: any): Promise<any> {
    return this.request('/timemachine/experiments', {
      method: 'POST',
      body: JSON.stringify(experimentData),
    });
  }

  async getUserExperiments(): Promise<any> {
    return this.request('/timemachine/experiments');
  }

  async getTimeMachineInsights(): Promise<any> {
    return this.request('/timemachine/insights');
  }

  async whatIfAnalysis(question: string, timeframe: number = 30): Promise<any> {
    return this.request('/timemachine/what-if', {
      method: 'POST',
      body: JSON.stringify({ question, timeframe }),
    });
  }

  // ========================================
  // UNIQUE FEATURES: QUICK NOTES (ENHANCED)
  // ========================================
  async getQuickNotes(filters: any = {}): Promise<any> {
    const queryString = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value));
      }
    });

    const query = queryString.toString();
    return this.request(`/quick-notes${query ? `?${query}` : ''}`);
  }

  async createQuickNote(noteData: any): Promise<any> {
    return this.request('/quick-notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateQuickNote(noteId: string, noteData: any): Promise<any> {
    return this.request(`/quick-notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }

  async deleteQuickNote(noteId: string): Promise<any> {
    return this.request(`/quick-notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  async archiveQuickNote(noteId: string): Promise<any> {
    return this.request(`/quick-notes/${noteId}/archive`, {
      method: 'PATCH',
    });
  }

  async toggleQuickNotePin(noteId: string): Promise<any> {
    return this.request(`/quick-notes/${noteId}/pin`, {
      method: 'PATCH',
    });
  }

  async getQuickNoteCategories(): Promise<any> {
    return this.request('/quick-notes/categories');
  }

  async getAllQuickNoteTags(): Promise<any> {
    return this.request('/quick-notes/tags');
  }

  async getQuickNoteFolders(): Promise<any> {
    return this.request('/quick-notes/folders');
  }

  async getQuickNotesSmartSuggestions(content: string, title?: string): Promise<any> {
    return this.request('/quick-notes/suggestions', {
      method: 'POST',
      body: JSON.stringify({ content, title }),
    });
  }

  async quickNoteBulkAction(action: string, noteIds: string[]): Promise<any> {
    return this.request('/quick-notes/bulk', {
      method: 'POST',
      body: JSON.stringify({ action, noteIds }),
    });
  }

  // ========================================
  // CATEGORY MANAGEMENT
  // ========================================
  async getCategories(includeDefault: boolean = true): Promise<{ categories: any[] }> {
    return this.request(`/categories?includeDefault=${includeDefault}`);
  }

  async createCategory(data: {
    name: string;
    icon: string;
    color: string;
  }): Promise<{ category: any }> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: {
    name?: string;
    icon?: string;
    color?: string;
  }): Promise<{ category: any }> {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string, reassignToCategoryId?: string): Promise<{ reassignedHabits: number }> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reassignToCategoryId }),
    });
  }

  async getDefaultCategories(): Promise<{ categories: any[] }> {
    return this.request('/categories/default');
  }
}

export const api = new ApiClient();
