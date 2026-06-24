import { api, ApiResponse } from '@/lib/api';

// Types for Time Machine (What-If Scenarios)
export interface Scenario {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'ALTERNATIVE_TIMELINE' | 'STRATEGY_TEST' | 'HABIT_EXPERIMENT' | 'PREDICTION' | 'COMPARISON';
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED';
  timeline: {
    startDate: string;
    endDate: string;
    simulatedPeriod: number;
  };
  originalHabits: Array<{
    habitId: string;
    habitData: any;
    performance: any;
  }>;
  modifiedHabits: Array<{
    habitId: string;
    variables: Array<{
      type: 'FREQUENCY' | 'DIFFICULTY' | 'TIMING' | 'DURATION' | 'CATEGORY' | 'REMINDER' | 'CUSTOM';
      originalValue: any;
      newValue: any;
      reason: string;
    }>;
  }>;
  results: {
    predictedCompletion: number;
    predictedStreaks: number;
    confidence: number;
    impact: {
      completionChange: number;
      streakChange: number;
      energyImpact: number;
      wellbeingImpact: number;
    };
  };
  actualResults?: {
    completion: number;
    streaks: number;
    accuracy: number;
  };
  insights: Array<{
    type: string;
    finding: string;
    confidence: number;
    actionable: boolean;
  }>;
  metadata: {
    createdAt: string;
    completedAt?: string;
    processingTime?: number;
    algorithm: string;
    version: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimeBranch {
  id: string;
  userId: string;
  scenarioId: string;
  branchName: string;
  branchPoint: string;
  divergencePoint: string;
  alternativeHistory: Array<{
    date: string;
    event: string;
    reality: any;
    alternative: any;
    difference: string;
  }>;
  outcomes: {
    completionRate: number;
    totalCompletions: number;
    longestStreak: number;
    currencyEarned: number;
    achievements: string[];
  };
  comparison: {
    completionDifference: number;
    streakDifference: number;
    currencyDifference: number;
    betterIn: string[];
    worseIn: string[];
  };
  createdAt: string;
}

export interface PredictionResult {
  overall: {
    timeframe: number;
    predictedCompletionRate: number;
    predictedStreakGrowth: number;
    confidence: number;
    recommendations: string[];
  };
  habitPredictions: Array<{
    habitId: string;
    habitName: string;
    prediction: {
      completionRate: number;
      streakGrowth: number;
      optimalTimes: string[];
      confidence: number;
      factors: string[];
    };
  }>;
  generatedAt: string;
}

// Time Machine API Service
class TimeMachineService {
  // Scenario Management
  async createScenario(scenarioData: any): Promise<ApiResponse<Scenario>> {
    return api.post<ApiResponse<Scenario>>('/timemachine/scenarios', scenarioData);
  }

  async runScenario(scenarioId: string): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>(`/timemachine/scenarios/${scenarioId}/run`);
  }

  async getScenario(scenarioId: string): Promise<ApiResponse<{ scenario: Scenario }>> {
    return api.get<ApiResponse<{ scenario: Scenario }>>(`/timemachine/scenarios/${scenarioId}`);
  }

  async getUserScenarios(): Promise<ApiResponse<{ scenarios: Scenario[] }>> {
    return api.get<ApiResponse<{ scenarios: Scenario[] }>>('/timemachine/scenarios');
  }

  async deleteScenario(scenarioId: string): Promise<ApiResponse<any>> {
    return api.delete<ApiResponse<any>>(`/timemachine/scenarios/${scenarioId}`);
  }

  async updateScenario(scenarioId: string, data: any): Promise<ApiResponse<Scenario>> {
    return api.put<ApiResponse<Scenario>>(`/timemachine/scenarios/${scenarioId}`, data);
  }

  // Alternative Timelines
  async createAlternativeTimeline(divergenceDate: string, modifications: any[]): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>('/timemachine/alternative-timeline', {
      divergenceDate,
      modifications,
    });
  }

  async getTimeBranches(scenarioId: string): Promise<ApiResponse<{ branches: TimeBranch[] }>> {
    return api.get<ApiResponse<{ branches: TimeBranch[] }>>(`/timemachine/scenarios/${scenarioId}/branches`);
  }

  async compareWithReality(scenarioId: string): Promise<ApiResponse<{ comparison: any }>> {
    return api.post<ApiResponse<{ comparison: any }>>(`/timemachine/scenarios/${scenarioId}/compare-reality`);
  }

  // Predictions
  async predictFuturePerformance(timeframe: number = 30): Promise<ApiResponse<PredictionResult>> {
    return api.get<ApiResponse<PredictionResult>>(`/timemachine/predict?timeframe=${timeframe}`);
  }

  async predictHabitPerformance(habitId: string, days: number = 30): Promise<ApiResponse<any>> {
    return api.get<ApiResponse<any>>(`/timemachine/predict-habit/${habitId}?days=${days}`);
  }

  async getPredictionAccuracy(modelId: string): Promise<ApiResponse<{ accuracy: number; predictions: any[] }>> {
    return api.get<ApiResponse<{ accuracy: number; predictions: any[] }>>(`/timemachine/prediction-accuracy/${modelId}`);
  }

  // Strategy Comparisons
  async compareStrategies(strategies: any[]): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>('/timemachine/compare-strategies', {
      strategies,
    });
  }

  async getBestStrategy(scenarioId: string): Promise<ApiResponse<{ strategy: string; reasoning: string[] }>> {
    return api.get<ApiResponse<{ strategy: string; reasoning: string[] }>>(`/timemachine/best-strategy/${scenarioId}`);
  }

  // Habit Experiments
  async designExperiment(experimentData: any): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>('/timemachine/experiments', experimentData);
  }

  async runExperiment(experimentId: string): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>(`/timemachine/experiments/${experimentId}/run`);
  }

  async getExperimentResults(experimentId: string): Promise<ApiResponse<{ results: any }>> {
    return api.get<ApiResponse<{ results: any }>>(`/timemachine/experiments/${experimentId}/results`);
  }

  async getUserExperiments(): Promise<ApiResponse<{ experiments: any[] }>> {
    return api.get<ApiResponse<{ experiments: any[] }>>('/timemachine/experiments');
  }

  // What-If Analysis
  async whatIfAnalysis(question: string, timeframe: number = 30): Promise<ApiResponse<{ answer: string; confidence: number; scenarios: string[] }>> {
    return api.post<ApiResponse<{ answer: string; confidence: number; scenarios: string[] }>>('/timemachine/what-if', {
      question,
      timeframe,
    });
  }

  async getAlternativeOutcomes(habitId: string, modifications: any[]): Promise<ApiResponse<{ outcomes: any[] }>> {
    return api.post<ApiResponse<{ outcomes: any[] }>>(`/timemachine/alternative-outcomes/${habitId}`, {
      modifications,
    });
  }

  // Learning & Insights
  async getTimeMachineInsights(): Promise<ApiResponse<{ insights: string[]; learnings: any[]; recommendations: string[] }>> {
    return api.get<ApiResponse<{ insights: string[]; learnings: any[]; recommendations: string[] }>>('/timemachine/insights');
  }

  async getScenarioComparison(scenarioId: string): Promise<ApiResponse<{ comparison: any; insights: string[] }>> {
    return api.get<ApiResponse<{ comparison: any; insights: string[] }>>(`/timemachine/scenarios/${scenarioId}/comparison`);
  }

  // Templates
  async getScenarioTemplates(): Promise<ApiResponse<{ templates: any[] }>> {
    return api.get<ApiResponse<{ templates: any[] }>>('/timemachine/templates');
  }

  async createScenarioFromTemplate(templateId: string, customizations: any): Promise<ApiResponse<{ scenario: Scenario }>> {
    return api.post<ApiResponse<{ scenario: Scenario }>>(`/timemachine/templates/${templateId}/create`, customizations);
  }
}

export const timeMachineService = new TimeMachineService();
