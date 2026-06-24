'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DNA, TrendingUp, Zap, Heart, Users, Award, RefreshC, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface HabitGeneticsDisplay {
  consistency: { level: number; volatility: number; stability: number };
  difficulty: { level: number; learningCurve: number; adaptability: number };
  energy: { morning: number; afternoon: number; evening: number; optimum: string };
  success: { completionRate: number; streakAffinity: number; recoverySpeed: number };
  social: { contagiousness: number; collaborationBoost: number; accountability: number };
  wellness: { moodBoost: number; stressReduction: number; energyReturn: number };
}

interface HabitDNADisplayProps {
  habitId: string;
  habitName: string;
}

export function HabitDNADisplay({ habitId, habitName }: HabitDNADisplayProps) {
  const [genetics, setGenetics] = useState<HabitGeneticsDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadGenetics();
  }, [habitId]);

  const loadGenetics = async () => {
    try {
      setLoading(true);
      const response = await api.analyzeHabitGenetics(habitId);
      setGenetics(response.dna.genetics);
    } catch (error) {
      console.error('Failed to load genetics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await api.analyzeHabitGenetics(habitId);
      setGenetics(response.dna.genetics);
    } catch (error) {
      console.error('Failed to analyze genetics:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!genetics) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-center">
          <DNA className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-3">No genetic data available for this habit yet.</p>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Genetics'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DNA className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Genetic Profile: {habitName}</h3>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshC className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Consistency Gene */}
        <GeneCard
          title="Consistency"
          value={genetics.consistency.level}
          icon={<TrendingUp className="w-4 h-4" />}
          color="blue"
          details={{
            'Level': genetics.consistency.level,
            'Volatility': genetics.consistency.volatility,
            'Stability': genetics.consistency.stability,
          }}
        />

        {/* Difficulty Gene */}
        <GeneCard
          title="Difficulty"
          value={genetics.difficulty.level}
          icon={<Zap className="w-4 h-4" />}
          color="orange"
          details={{
            'Level': genetics.difficulty.level,
            'Learning Curve': genetics.difficulty.learningCurve,
            'Adaptability': genetics.difficulty.adaptability,
          }}
        />

        {/* Energy Gene */}
        <GeneCard
          title="Energy"
          value={Math.round(
            (genetics.energy.morning + genetics.energy.afternoon + genetics.energy.evening) / 3
          )}
          icon={<Zap className="w-4 h-4" />}
          color="yellow"
          details={{
            'Morning': genetics.energy.morning,
            'Afternoon': genetics.energy.afternoon,
            'Evening': genetics.energy.evening,
            'Optimal': genetics.energy.optimum,
          }}
        />

        {/* Success Gene */}
        <GeneCard
          title="Success"
          value={genetics.success.completionRate}
          icon={<Award className="w-4 h-4" />}
          color="green"
          details={{
            'Completion Rate': genetics.success.completionRate,
            'Streak Affinity': genetics.success.streakAffinity,
            'Recovery': genetics.success.recoverySpeed,
          }}
        />

        {/* Social Gene */}
        <GeneCard
          title="Social"
          value={Math.round(
            (genetics.social.contagiousness + genetics.social.collaborationBoost + genetics.social.accountability) / 3
          )}
          icon={<Users className="w-4 h-4" />}
          color="purple"
          details={{
            'Contagiousness': genetics.social.contagiousness,
            'Collaboration': genetics.social.collaborationBoost,
            'Accountability': genetics.social.accountability,
          }}
        />

        {/* Wellness Gene */}
        <GeneCard
          title="Wellness"
          value={Math.round(
            (genetics.wellness.moodBoost + genetics.wellness.stressReduction + genetics.wellness.energyReturn) / 3
          )}
          icon={<Heart className="w-4 h-4" />}
          color="pink"
          details={{
            'Mood Boost': genetics.wellness.moodBoost,
            'Stress Reduction': genetics.wellness.stressReduction,
            'Energy Return': genetics.wellness.energyReturn,
          }}
        />
      </div>
    </div>
  );
}

interface GeneCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  details: Record<string, number>;
}

function GeneCard({ title, value, icon, color, details }: GeneCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };

  const bgColorClasses: Record<string, string> = {
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
    yellow: 'bg-yellow-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    pink: 'bg-pink-50',
  };

  const getLevelLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Average';
    return 'Needs Work';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColorClasses[color]} rounded-lg p-4 border border-${color}-200`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`${colorClasses[color]} p-1.5 rounded-lg`}>
            {icon}
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-600">{getLevelLabel(value)}</div>
        </div>
      </div>

      <div className="space-y-1">
        {Object.entries(details).map(([key, val]) => (
          <div key={key} className="flex justify-between text-xs">
            <span className="text-gray-600">{key}:</span>
            <span className="font-medium text-gray-900">{Math.round(val)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
