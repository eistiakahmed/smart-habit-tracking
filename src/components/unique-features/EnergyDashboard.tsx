'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Clock, Calendar, Target, Flame, Battery, Sun, Moon, CloudSun } from 'lucide-react';
import { api } from '@/lib/api';

interface EnergyDashboardProps {
  userId: string;
}

export function EnergyDashboard({ userId }: EnergyDashboardProps) {
  const [currentEnergy, setCurrentEnergy] = useState<number>(50);
  const [todayLogs, setTodayLogs] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnergyData();
  }, [userId]);

  const loadEnergyData = async () => {
    try {
      setLoading(true);
      const [current, logs, patternsData] = await Promise.all([
        api.getCurrentEnergyLevel(),
        api.getTodayEnergyLogs(),
        api.getEnergyPatterns(),
      ]);

      setCurrentEnergy(current.energy);
      setTodayLogs(logs.logs || []);
      setPatterns(patternsData.patterns?.[0]);
    } catch (error) {
      console.error('Failed to load energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEnergyColor = (level: number) => {
    if (level >= 80) return 'bg-green-100 text-green-700 border-green-300';
    if (level >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (level >= 40) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const getEnergyIcon = (level: number) => {
    if (level >= 80) return Flame;
    if (level >= 40) return Battery;
    return Zap;
  };

  const getEnergyLabel = (level: number) => {
    if (level >= 80) return 'High Energy';
    if (level >= 60) return 'Good Energy';
    if (level >= 40) return 'Moderate Energy';
    return 'Low Energy';
  };

  return (
    <div className="space-y-6">
      {/* Current Energy Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Current Energy</h3>
          </div>
          <span className="text-sm text-gray-500">Real-time</span>
        </div>

        <div className={`flex items-center gap-4 p-4 rounded-lg border-2 ${getEnergyColor(currentEnergy)}`}>
          <div className="flex-shrink-0">
            {React.createElement(getEnergyIcon(currentEnergy), { className: "w-12 h-12" })}
          </div>
          <div className="flex-1">
            <div className="text-4xl font-bold text-gray-900">{currentEnergy}</div>
            <div className="text-sm text-gray-700">{getEnergyLabel(currentEnergy)}</div>
          </div>
          <div className="flex-shrink-0">
            <input
              type="range"
              min="0"
              max="100"
              value={currentEnergy}
              onChange={(e) => setCurrentEnergy(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </div>
      </motion.div>

      {/* Today's Energy Timeline */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Today's Energy Timeline</h3>
          </div>
        </div>

        <div className="space-y-2">
          {todayLogs.length > 0 ? (
            todayLogs.map((log: any, index: number) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {log.context?.activity || 'Activity'}
                  </div>
                  {log.context?.habitId && (
                    <div className="text-xs text-gray-600">Habit Log</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-purple-900">{log.energyScore}</div>
                  <div className="text-xs text-gray-600">Energy</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No energy logs today yet. Complete some habits to track your energy!
            </div>
          )}
        </div>
      </div>

      {/* Energy Patterns */}
      {patterns && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Your Energy Patterns</h3>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { time: 'Morning', ...patterns.timePatterns.morning, icon: Sun },
              { time: 'Afternoon', ...patterns.timePatterns.afternoon, icon: CloudSun },
              { time: 'Evening', ...patterns.timePatterns.evening, icon: Moon },
              { time: 'Night', ...patterns.timePatterns.night, icon: Moon },
            ].map((pattern) => (
              <TimePatternCard key={pattern.time} pattern={pattern} />
            ))}
          </div>

          {/* Insights */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Pattern Insights</h4>
            <div className="text-sm text-gray-700">
              <p>🔥 Your peak energy time is <strong>{patterns.timePatterns.optimum}</strong></p>
              <p className="mt-2">📊 Pattern confidence: <strong>{Math.round(patterns.reliability)}%</strong></p>
              <p className="mt-2">💡 Based on {patterns.dataPoints} data points</p>
            </div>
          </div>
        </div>
      )}

      {/* Log Energy Button */}
      <button
        onClick={() => {/* Open energy log modal */}}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2"
      >
        <Zap className="w-5 h-5" />
        Log Current Energy Level
      </button>
    </div>
  );
}

interface TimePatternCardProps {
  pattern: {
    time: string;
    average: number;
    peak: number;
    consistency: number;
    icon: any;
  };
}

function TimePatternCard({ pattern }: TimePatternCardProps) {
  const getIcon = () => {
    switch (pattern.time.toLowerCase()) {
      case 'morning': return Sun;
      case 'afternoon': return CloudSun;
      case 'evening':
      case 'night':
      default:
        return Moon;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        {React.createElement(getIcon(), { className: "w-4 h-4 text-gray-600" })}
        <span className="font-medium text-gray-900">{pattern.time}</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Average</span>
          <span className="font-medium text-gray-900">{Math.round(pattern.average)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Peak</span>
          <span className="font-medium text-green-700">{Math.round(pattern.peak)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Consistency</span>
          <span className="font-medium text-blue-700">{Math.round(pattern.consistency)}%</span>
        </div>
      </div>
    </div>
  );
}
