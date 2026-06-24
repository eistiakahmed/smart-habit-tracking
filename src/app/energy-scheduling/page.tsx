import React, { useState, useEffect } from 'react';
import { EnergyDashboard } from '@/components/unique-features/EnergyDashboard';
import { OptimalSchedule } from '@/components/unique-features/OptimalSchedule';
import { api } from '@/lib/api';

export default function EnergySchedulingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⚡ Energy-Based Scheduling</h1>
        <p className="text-gray-600">
          Track your energy patterns and discover the optimal times for habit completion
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <EnergyDashboard userId="current" />
        <OptimalSchedule userId="current" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <EnergyCalendar userId="current" />
        <EnergyGoalsTracker userId="current" />
        <EnergyInsights userId="current" />
      </div>
    </div>
  );
}

function EnergyCalendar({ userId }: { userId: string }) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calendarData, setCalendarData] = useState<any[]>([]);

  useEffect(() => {
    loadCalendarData(selectedDate);
  }, [selectedDate]);

  const loadCalendarData = async (date: string) => {
    try {
      // Would call api.getEnergyCalendar(date)
      // For now, mock data
      const mockData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        energy: Math.floor(Math.random() * 100),
        activities: Math.floor(Math.random() * 3),
      }));
      setCalendarData(mockData);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    }
  };

  const getEnergyColor = (level: number) => {
    if (level >= 70) return 'bg-green-200 text-green-800';
    if (level >= 40) return 'bg-yellow-200 text-yellow-800';
    return 'bg-red-200 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">📅 Energy Calendar</h3>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            const prevDate = new Date(selectedDate);
            prevDate.setDate(prevDate.getDate() - 1);
            setSelectedDate(prevDate.toISOString().split('T')[0]);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={() => {
            const nextDate = new Date(selectedDate);
            nextDate.setDate(nextDate.getDate() + 1);
            setSelectedDate(nextDate.toISOString().split('T')[0]);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarData.map((day: any, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getEnergyColor(day.energy)} text-center`}
          >
            <div className="text-xs font-semibold mb-1">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-2xl font-bold">{day.energy}</div>
            <div className="text-xs">{day.activities} activities</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnergyGoalsTracker({ userId }: { userId: string }) {
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    loadGoals();
  }, [userId]);

  const loadGoals = async () => {
    try {
      const response = await api.getEnergyGoals();
      setGoals(response.goals || []);
    } catch (error) {
      console.error('Failed to load energy goals:', error);
    }
  };

  const getGoalProgress = (goal: any) => {
    const percentage = goal.progress.totalDays > 0
      ? Math.round((goal.progress.successfulDays / goal.progress.totalDays) * 100)
      : 0;

    return {
      percentage,
      currentLevel: goal.progress.currentLevel,
      target: goal.target.optimal,
    };
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">🎯 Energy Goals</h3>

      {goals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎯</div>
          <p className="mb-3">No energy goals yet</p>
          <button
            onClick={() => {/* Create goal modal */}}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Set Energy Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal: any) => (
            <div key={goal.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  goal.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  goal.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {goal.status}
                </span>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Target: {goal.target.optimum}</span>
                  <span className="font-medium text-gray-900">
                    Current: {goal.progress.currentLevel}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${getGoalProgress(goal).percentage}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-600">
                {goal.progress.adherenceRate}% adherence • {goal.progress.totalDays} days tracked
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EnergyInsights({ userId }: { userId: string }) {
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    loadInsights();
  }, [userId]);

  const loadInsights = async () => {
    try {
      const response = await api.getEnergyInsights();
      setInsights(response.insights || []);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">💡 Energy Insights</h3>

      {insights.length > 0 ? (
        <div className="space-y-2">
          {insights.map((insight: string, index: number) => (
            <div key={index} className="bg-green-50 p-3 rounded-lg text-sm text-gray-800">
              {insight}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">
          Complete more habits to unlock insights
        </p>
      )}
    </div  );
}
