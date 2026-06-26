'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { formatLocalDate } from '@/lib/utils';

interface OptimalScheduleProps {
  userId: string;
}

export function OptimalSchedule({ userId }: OptimalScheduleProps) {
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    setSelectedDate(formatLocalDate());
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [userId]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const response = await api.getOptimalSchedule();
      setSchedule(response);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowRecommendation = async (recommendationId: string, habitId: string) => {
    try {
      // Mark recommendation as followed
      await (api as any).updateScheduleRecommendation(recommendationId, { followed: true });
      // Refresh schedule
      loadSchedule();
    } catch (error) {
      console.error('Failed to follow recommendation:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Optimal Schedule</h2>
        </div>
        <div className="text-sm text-gray-500">
          Based on your energy patterns
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Schedule Display */}
      {schedule && (
        <div className="space-y-4">
          {/* Morning Block */}
          {schedule.schedule.morning.length > 0 && (
            <ScheduleBlock
              title="Morning"
              icon="☀️"
              color="yellow"
              habits={schedule.schedule.morning}
              onFollow={(habitId: string) => handleFollowRecommendation(habitId, habitId)}
            />
          )}

          {/* Afternoon Block */}
          {schedule.schedule.afternoon.length > 0 && (
            <ScheduleBlock
              title="Afternoon"
              icon="🌤"
              color="blue"
              habits={schedule.schedule.afternoon}
              onFollow={(habitId: string) => handleFollowRecommendation(habitId, habitId)}
            />
          )}

          {/* Evening Block */}
          {schedule.schedule.evening.length > 0 && (
            <ScheduleBlock
              title="Evening"
              icon="🌙"
              color="purple"
              habits={schedule.schedule.evening}
              onFollow={(habitId: string) => handleFollowRecommendation(habitId, habitId)}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface ScheduleBlockProps {
  title: string;
  icon: string;
  color: string;
  habits: any[];
  onFollow: (habitId: string) => void;
}

function ScheduleBlock({ title, icon, color, habits, onFollow }: ScheduleBlockProps) {
  const colorClasses: Record<string, string> = {
    yellow: 'from-yellow-50 to-orange-50 border-yellow-200',
    blue: 'from-blue-50 to-indigo-50 border-blue-200',
    purple: 'from-purple-50 to-pink-50 border-purple-200',
    green: 'from-green-50 to-emerald-50 border-green-200',
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-lg p-4 border`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-600 ml-auto">
          {habits.length} habit{habits.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {habits.map((habit: any, index: number) => (
          <div
            key={habit.habitId}
            className="flex items-center justify-between p-3 bg-white/80 rounded-lg backdrop-blur-sm"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900">{habit.habitName}</div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{habit.difficulty}</span>
                <span>•</span>
                <span>Confidence: {Math.round(habit.confidence)}%</span>
              </div>
            </div>
            <button
              onClick={() => onFollow(habit.habitId)}
              className="ml-2 p-2 hover:bg-white rounded-lg transition-colors"
              title="Follow this recommendation"
            >
              <Target className="w-4 h-4 text-gray-600 hover:text-green-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
