'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const router = useRouter();
  const [weeklyReport, setWeeklyReport] = useState<any>(null);
  const [monthlyInsights, setMonthlyInsights] = useState<any>(null);
  const [habitPatterns, setHabitPatterns] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [weekly, monthly, patterns] = await Promise.all([
        api.getWeeklyReport(),
        api.getMonthlyInsights(),
        api.getHabitPatterns(),
      ]);
      setWeeklyReport(weekly);
      setMonthlyInsights(monthly);
      setHabitPatterns(patterns);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const weeklyData = weeklyReport?.dailyBreakdown?.map((d: any) => ({
    day: d.dayOfWeek?.slice(0, 3),
    completed: d.completed,
    total: d.total,
    rate: d.rate,
  })) || [];

  const categoryData = Object.entries(monthlyInsights?.categoryBreakdown || {}).map(([cat, data]: [string, any]) => ({
    category: cat,
    count: data.count,
    rate: data.completionRate,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F97316', '#8B5CF6', '#EC4899', '#F59E0B'];

  return (
    <div className="min-h-screen bg-[#f8f9fb] mobile-page-padding">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Analytics</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Report
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Category Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.category}: ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Habit Patterns
          </h2>
          {habitPatterns?.bestPerformingTimes ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(habitPatterns.bestPerformingTimes).map(([time, data]: [string, any]) => (
                <div key={time} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">{time}</div>
                  <div className="text-xl font-bold text-gray-900">{data.completionRate || 0}%</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pattern data available yet. Keep tracking your habits!</p>
          )}
        </div>

        {weeklyReport && (
          <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Weekly Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{weeklyReport.summary?.totalCompletions || 0}</div>
                <div className="text-sm text-gray-500">Total Completions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{weeklyReport.summary?.completionRate || 0}%</div>
                <div className="text-sm text-gray-500">Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{weeklyReport.summary?.perfectDays || 0}</div>
                <div className="text-sm text-gray-500">Perfect Days</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{weeklyReport.summary?.totalHabits || 0}</div>
                <div className="text-sm text-gray-500">Active Habits</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
