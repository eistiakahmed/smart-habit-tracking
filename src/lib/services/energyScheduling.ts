import { api } from '@/lib/api';

// Define ApiResponse locally if not exported
interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Types for Energy-Based Scheduling
export interface EnergyLog {
  id: string;
  userId: string;
  energyLevel: 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  energyScore: number;
  timestamp: string;
  source: 'HABIT_COMPLETION' | 'USER_REPORTED' | 'DETECTED' | 'PREDICTED';
  confidence: number;
  context: {
    activity?: 'EXERCISE' | 'WORK' | 'SOCIAL' | 'REST' | 'HOBBY' | 'CHORES' | 'LEARNING';
    habitId?: string;
    mood?: number;
    stress?: number;
    sleep?: number;
    location?: string;
    withOthers?: boolean;
  };
  factors: {
    caffeine?: number;
    exercise?: boolean;
    meal?: boolean;
    weather?: string;
    season?: string;
  };
  createdAt: string;
}

export interface EnergyPattern {
  id: string;
  userId: string;
  patternName: string;
  patternType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEASONAL';
  timePatterns: {
    morning: { average: number; peak: number; consistency: number };
    afternoon: { average: number; peak: number; consistency: number };
    evening: { average: number; peak: number; consistency: number };
    night: { average: number; peak: number; consistency: number };
  };
  dayPatterns: Array<{
    dayOfWeek: number;
    average: number;
    peak: number;
  }>;
  reliability: number;
  dataPoints: number;
  lastUpdated: string;
  predictions: {
    nextPeak: string;
    nextLow: string;
    confidence: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleRecommendation {
  id: string;
  userId: string;
  habitId: string;
  recommendedTime: string;
  confidence: number;
  priority: number;
  factors: {
    energyMatch: number;
    historical: number;
    preference: number;
    constraints: string[];
  };
  tracking: {
    followed: boolean;
    actualTime?: string;
    outcome?: 'SUCCESS' | 'PARTIAL' | 'FAILED';
    energyAtTime?: number;
  };
  validUntil: string;
  createdAt: string;
}

export interface EnergyGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  target: {
    minimum: number;
    optimal: number;
    maximum: number;
  };
  schedule: {
    morning: { min: number; max: number };
    afternoon: { min: number; max: number };
    evening: { min: number; max: number };
    night: { min: number; max: number };
  };
  progress: {
    currentLevel: number;
    adherenceRate: number;
    totalDays: number;
    successfulDays: number;
  };
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED';
  startDate: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OptimalSchedule {
  schedule: {
    morning: any[];
    afternoon: any[];
    evening: any[];
    night: any[];
  };
  energyPattern: EnergyPattern;
  timezone: string;
  generatedAt: string;
}

// Energy-Based Scheduling API Service
class EnergySchedulingService {
  // Energy Logging
  async logEnergy(energyData: any): Promise<ApiResponse<EnergyLog>> {
    return (api as any).post('/energy/log', energyData);
  }

  async logEnergyFromHabit(habitId: string, completionData: any = {}): Promise<ApiResponse<EnergyLog>> {
    return (api as any).post(`/energy/log-from-habit/${habitId}`, completionData);
  }

  async getRecentEnergyLogs(days: number = 7): Promise<ApiResponse<{ logs: EnergyLog[] }>> {
    return (api as any).get(`/energy/logs?days=${days}`);
  }

  async getTodayEnergyLogs(): Promise<ApiResponse<{ logs: EnergyLog[] }>> {
    return (api as any).get('/energy/logs/today');
  }

  // Energy Analysis
  async getEnergyPatterns(): Promise<ApiResponse<{ patterns: EnergyPattern[] }>> {
    return (api as any).get('/energy/patterns');
  }

  async analyzeEnergyPatterns(): Promise<ApiResponse<{ pattern: EnergyPattern; insights: string[] }>> {
    return (api as any).post('/energy/analyze');
  }

  async getCurrentEnergyLevel(): Promise<ApiResponse<{ energy: number; level: string; source: string }>> {
    return (api as any).get('/energy/current');
  }

  // Smart Scheduling
  async generateScheduleRecommendations(habitId: string): Promise<ApiResponse<any>> {
    return (api as any).post(`/energy/schedule-recommendations/${habitId}`);
  }

  async getOptimalSchedule(): Promise<ApiResponse<OptimalSchedule>> {
    return (api as any).get('/energy/optimal-schedule');
  }

  async getScheduleForDate(date: string): Promise<ApiResponse<{ schedule: any[] }>> {
    return (api as any).get(`/energy/schedule/${date}`);
  }

  async updateScheduleRecommendation(recommendationId: string, data: any): Promise<ApiResponse<any>> {
    return (api as any).put(`/energy/schedule-recommendations/${recommendationId}`, data);
  }

  // Energy Goals
  async createEnergyGoal(goalData: any): Promise<ApiResponse<EnergyGoal>> {
    return (api as any).post('/energy/goals', goalData);
  }

  async getEnergyGoals(): Promise<ApiResponse<{ goals: EnergyGoal[] }>> {
    return (api as any).get('/energy/goals');
  }

  async updateEnergyGoal(goalId: string, data: any): Promise<ApiResponse<EnergyGoal>> {
    return (api as any).put(`/energy/goals/${goalId}`, data);
  }

  async trackEnergyGoalProgress(goalId: string): Promise<ApiResponse<{ goal: EnergyGoal; progress: any }>> {
    return (api as any).post(`/energy/goals/${goalId}/track`);
  }

  async getEnergyInsights(): Promise<ApiResponse<{ insights: string[]; patterns: any; recommendations: string[] }>> {
    return (api as any).get('/energy/insights');
  }

  // Energy Calendar
  async getEnergyCalendar(startDate: string, endDate: string): Promise<ApiResponse<{ calendar: any[] }>> {
    return (api as any).get(`/energy/calendar?start=${startDate}&end=${endDate}`);
  }

  async getWeeklyEnergySummary(): Promise<ApiResponse<{ summary: any }>> {
    return (api as any).get('/energy/weekly-summary');
  }
}

export const energySchedulingService = new EnergySchedulingService();
