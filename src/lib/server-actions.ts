import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { makeAuthenticatedRequest, refreshServerAccessToken } from './server-auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get('access_token')?.value;

  if (!token) {
    const newToken = await refreshServerAccessToken();
    if (!newToken) {
      redirect('/login');
    }
    token = newToken;
  }

  return token;
}

async function serverFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (response.status === 401) {
    const newToken = await refreshServerAccessToken();
    if (newToken) {
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
          ...options.headers,
        },
        cache: 'no-store',
      });

      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error?.message || 'API request failed');
      }

      const data = await retryResponse.json();
      return data.data || data;
    }

    redirect('/login');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || `API error: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.data || data;
}

export async function login(credentials: { email: string; password: string }) {
  'use server';


  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  const authResponse = data.data;

  const cookieStore = await cookies();
  cookieStore.set('access_token', authResponse.tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });
  cookieStore.set('refresh_token', authResponse.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  cookieStore.set('user', JSON.stringify(authResponse.user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return authResponse;
}

export async function register(userData: {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  'use server';

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const data = await response.json();
  const authResponse = data.data;

  const cookieStore = await cookies();
  cookieStore.set('access_token', authResponse.tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });
  cookieStore.set('refresh_token', authResponse.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  cookieStore.set('user', JSON.stringify(authResponse.user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return authResponse;
}

export const authActions = {
  login,
  register,

  logout: async () => {
  

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('user');

    redirect('/login');
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    timezone?: string;
    preferences?: Record<string, any>;
  }) => {
  

    return serverFetch(`/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

export const habitActions = {
  getHabits: async (params?: {
    category?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => {
  

    const queryString = new URLSearchParams();
    if (params?.category) queryString.append('category', params.category);
    if (params?.isActive !== undefined) queryString.append('isActive', String(params.isActive));
    if (params?.page) queryString.append('page', String(params.page));
    if (params?.limit) queryString.append('limit', String(params.limit));

    const query = queryString.toString();
    return serverFetch(`/habits${query ? `?${query}` : ''}`);
  },

  getHabit: async (id: string) => {
  

    return serverFetch(`/habits/${id}`);
  },

  createHabit: async (data: {
    title: string;
    description?: string;
    category: string;
    frequency: string;
    icon?: string;
    color?: string;
    targetDays?: number;
    reminderTime?: string;
  }) => {
  

    return serverFetch('/habits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateHabit: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      frequency?: string;
      icon?: string;
      color?: string;
      targetDays?: number;
      reminderTime?: string;
      isActive?: boolean;
    }
  ) => {
  

    return serverFetch(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteHabit: async (id: string) => {
  

    return serverFetch(`/habits/${id}`, {
      method: 'DELETE',
    });
  },

  toggleHabit: async (id: string, data?: { note?: string; mood?: number }) => {
  

    return serverFetch(`/habits/${id}/toggle`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  },

  getHabitProgress: async (id: string, startDate?: string, endDate?: string) => {
  

    const queryString = new URLSearchParams();
    if (startDate) queryString.append('startDate', startDate);
    if (endDate) queryString.append('endDate', endDate);

    const query = queryString.toString();
    return serverFetch(`/habits/${id}/progress${query ? `?${query}` : ''}`);
  },

  getHabitStreak: async (id: string) => {
  

    return serverFetch(`/habits/${id}/streak`);
  },
};

export const goalActions = {
  getGoals: async (params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) => {
  

    const queryString = new URLSearchParams();
    if (params?.status) queryString.append('status', params.status);
    if (params?.category) queryString.append('category', params.category);
    if (params?.page) queryString.append('page', String(params.page));
    if (params?.limit) queryString.append('limit', String(params.limit));

    const query = queryString.toString();
    return serverFetch(`/goals${query ? `?${query}` : ''}`);
  },

  getGoal: async (id: string) => {
  

    return serverFetch(`/goals/${id}`);
  },

  createGoal: async (data: {
    title: string;
    description?: string;
    targetValue: number;
    unit?: string;
    targetDate: string;
    category: string;
  }) => {
  

    return serverFetch('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateGoal: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      currentValue?: number;
      targetValue?: number;
      targetDate?: string;
      status?: string;
    }
  ) => {
  

    return serverFetch(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteGoal: async (id: string) => {
  

    return serverFetch(`/goals/${id}`, {
      method: 'DELETE',
    });
  },

  getGoalProgress: async (id: string) => {
  

    return serverFetch(`/goals/${id}/progress`);
  },

  updateGoalProgress: async (id: string, value: number) => {
  

    return serverFetch(`/goals/${id}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  },

  getGoalStats: async () => {
  

    return serverFetch('/goals/stats');
  },
};

export const analyticsActions = {
  getWeeklyReport: async (startDate?: string, endDate?: string) => {
  

    const queryString = new URLSearchParams();
    if (startDate) queryString.append('startDate', startDate);
    if (endDate) queryString.append('endDate', endDate);

    const query = queryString.toString();
    return serverFetch(`/analytics/weekly-report${query ? `?${query}` : ''}`);
  },

  getMonthlyInsights: async () => {
  

    return serverFetch('/analytics/monthly-insights');
  },

  getHabitPatterns: async () => {
  

    return serverFetch('/analytics/habit-patterns');
  },

  getProductivityInsights: async () => {
  

    return serverFetch('/analytics/productivity-insights');
  },

  getDailyProgress: async (date?: string) => {
  

    const queryString = new URLSearchParams();
    if (date) queryString.append('date', date);

    const query = queryString.toString();
    return serverFetch(`/analytics/daily-progress${query ? `?${query}` : ''}`);
  },
};

export const gamificationActions = {
  getStats: async () => {
  

    return serverFetch('/gamification/stats');
  },

  getRank: async () => {
  

    return serverFetch('/gamification/rank');
  },

  getLeaderboard: async (params?: { limit?: number; period?: string }) => {
  

    const queryString = new URLSearchParams();
    if (params?.limit) queryString.append('limit', String(params.limit));
    if (params?.period) queryString.append('period', params.period);

    const query = queryString.toString();
    return serverFetch(`/gamification/leaderboard${query ? `?${query}` : ''}`);
  },

  getAchievements: async () => {
  

    return serverFetch('/gamification/achievements');
  },

  getUserAchievements: async () => {
  

    return serverFetch('/gamification/achievements/my');
  },

  getActiveChallenges: async () => {
  

    return serverFetch('/gamification/challenges');
  },

  getUserChallenges: async () => {
  

    return serverFetch('/gamification/challenges/my');
  },

  joinChallenge: async (challengeId: string) => {
  

    return serverFetch(`/gamification/challenges/${challengeId}/join`, {
      method: 'POST',
    });
  },
};

export const socialActions = {
  getFriends: async () => {
  

    return serverFetch('/social/friends');
  },

  getPendingRequests: async () => {
  

    return serverFetch('/social/friends/requests');
  },

  sendFriendRequest: async (receiverId: string, message?: string) => {
  

    return serverFetch('/social/friends/request', {
      method: 'POST',
      body: JSON.stringify({ receiverId, message }),
    });
  },

  respondToFriendRequest: async (requestId: string, accept: boolean) => {
  

    return serverFetch(`/social/friends/request/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ accept }),
    });
  },

  getFriendActivity: async (limit?: number) => {
  

    const queryString = new URLSearchParams();
    if (limit) queryString.append('limit', String(limit));

    const query = queryString.toString();
    return serverFetch(`/social/activity${query ? `?${query}` : ''}`);
  },

  shareHabitProgress: async (habitId: string, message?: string) => {
  

    return serverFetch('/social/share', {
      method: 'POST',
      body: JSON.stringify({ habitId, message }),
    });
  },

  getSocialLeaderboard: async () => {
    

    return serverFetch('/social/leaderboard');
  },
};
