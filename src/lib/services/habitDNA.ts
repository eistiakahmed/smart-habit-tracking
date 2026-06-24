import { api } from '@/lib/api';

// Define ApiResponse locally if not exported
interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Types for Habit DNA System
export interface HabitGenetics {
  consistency: {
    level: number;
    volatility: number;
    stability: number;
  };
  difficulty: {
    level: number;
    learningCurve: number;
    adaptability: number;
  };
  energy: {
    morning: number;
    afternoon: number;
    evening: number;
    optimum: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  success: {
    completionRate: number;
    streakAffinity: number;
    recoverySpeed: number;
  };
  social: {
    contagiousness: number;
    collaborationBoost: number;
    accountability: number;
  };
  wellness: {
    moodBoost: number;
    stressReduction: number;
    energyReturn: number;
  };
}

export interface HabitDNAResponse {
  id: string;
  userId: string;
  habitId: string;
  genetics: HabitGenetics;
  parentIds?: string[];
  generation: number;
  lineage?: string[][];
  mutations: Mutation[];
  breedingStats: BreedingStats;
  evolution: Evolution;
  metadata: {
    createdAt: string;
    lastAnalyzed: string;
    analysisConfidence: number;
    dataPoints: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Mutation {
  type: 'beneficial' | 'neutral' | 'detrimental' | 'adaptive';
  gene: string;
  oldValue: number;
  newValue: number;
  timestamp: string;
  reason: string;
}

export interface BreedingStats {
  attractiveness: number;
  fertility: number;
  dominance: {
    consistency: number;
    difficulty: number;
    energy: number;
    success: number;
  };
}

export interface Evolution {
  currentLevel: number;
  potential: number;
  nextMilestone: number;
  unlockedTraits: string[];
}

export interface BreedingSuggestion {
  habit: any;
  compatibility: number;
  potentialOffspring: {
    genetics: HabitGenetics;
    attractiveness: number;
    strengths: string[];
  };
}

// Habit DNA API Service
class HabitDNAService {
  async analyzeHabitGenetics(habitId: string): Promise<ApiResponse<{ dna: HabitDNAResponse; insights: any }>> {
    return (api as any).post(`/habit-dna/analyze/${habitId}`);
  }

  async breedHabits(parentId1: string, parentId2: string): Promise<ApiResponse<any>> {
    return (api as any).post('/habit-dna/breed', {
      parentId1,
      parentId2,
    });
  }

  async getBreedingSuggestions(habitId: string): Promise<ApiResponse<{ suggestions: BreedingSuggestion[] }>> {
    return (api as any).get(`/habit-dna/breeding-suggestions/${habitId}`);
  }

  async mutateHabit(habitId: string, forcedType?: string): Promise<ApiResponse<any>> {
    return (api as any).post(`/habit-dna/mutate/${habitId}`, {
      forcedType,
    });
  }

  async getGeneticInsights(habitId: string): Promise<ApiResponse<any>> {
    return (api as any).get(`/habit-dna/insights/${habitId}`);
  }

  async getHabitFamilyTree(habitId: string): Promise<ApiResponse<any>> {
    return (api as any).get(`/habit-dna/family-tree/${habitId}`);
  }

  async getUserHabitDNA(): Promise<ApiResponse<{ dnas: HabitDNAResponse[] }>> {
    return (api as any).get('/habit-dna/my-dnas');
  }
}

export const habitDNAService = new HabitDNAService();
