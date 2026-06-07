'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, Flame, CheckCircle2, Circle, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { api } from '@/lib/api';
import { DailyProgress, ProgressView } from '@/types';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const COLORS = ['#10B981', '#E5E7EB'];

export default function ProgressPage() {
  const router = useRouter();
  const [view, setView] = useState<ProgressView>('daily');
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const views: { value: ProgressView; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  useEffect(() => {
    fetchData();
  }, [view, selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (view === 'daily') {
        const data = await api.getDailyProgress(selectedDate);
        setDailyProgress(data);
      } else if (view === 'weekly') {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        const data = await api.getWeeklyReport(startDate.toISOString(), new Date().toISOString());
        setWeeklyData(data);
      } else {
        const data = await api.getMonthlyInsights();
        setMonthlyData(data);
      }
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const renderDailyView = () => {
    if (!dailyProgress) return null;

    const completedCount = dailyProgress.habits.filter(h => h.completed).length;
    const percentage = Math.round((completedCount / dailyProgress.habits.length) * 100);
    const pieData = [
      { name: 'Completed', value: completedCount },
      { name: 'Remaining', value: dailyProgress.habits.length - completedCount },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleDateChange(-1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            ← Previous
          </button>
          <div className="text-center">
            <div className="text-sm text-gray-500">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {selectedDate === new Date().toISOString().split('T')[0] && (
              <span className="text-xs text-green-600 font-medium">Today</span>
            )}
          </div>
          <button
            onClick={() => handleDateChange(1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Next →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-gray-800">{completedCount} of {dailyProgress.habits.length} habits</p>
              <p className="text-sm text-gray-500">completed today</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Flame className="w-10 h-10 text-orange-500" />
            </div>
            <p className="text-4xl font-bold text-gray-800">{dailyProgress.summary.currentStreak}</p>
            <p className="text-lg text-gray-600">Day Streak</p>
            <p className="text-sm text-gray-500 mt-2">Keep it going!</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              vs Yesterday
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion</span>
                <span className={`font-semibold ${dailyProgress.comparison.change.rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dailyProgress.comparison.change.rate >= 0 ? '+' : ''}{dailyProgress.comparison.change.rate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Habits Done</span>
                <span className={`font-semibold ${dailyProgress.comparison.change.completed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dailyProgress.comparison.change.completed >= 0 ? '+' : ''}{dailyProgress.comparison.change.completed}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">Yesterday: {dailyProgress.comparison.previousDay.completed} habits ({dailyProgress.comparison.previousDay.completionRate.toFixed(0)}%)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Habits</h3>
          <div className="space-y-3">
            {dailyProgress.habits.map((habit) => (
              <div
                key={habit.habitId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: habit.color + '20' }}>
                    {habit.icon ? (
                      <span className="text-2xl">{habit.icon}</span>
                    ) : (
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: habit.color }} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{habit.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="capitalize">{habit.category}</span>
                      {habit.completed && habit.completedAt && (
                        <span>• {new Date(habit.completedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {habit.streak > 0 && (
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="w-4 h-4" />
                      <span className="font-medium">{habit.streak}</span>
                    </div>
                  )}
                  {habit.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {dailyProgress.upcomingReminders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Reminders</h3>
            <div className="space-y-2">
              {dailyProgress.upcomingReminders.map((reminder) => (
                <div key={reminder.habitId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">{reminder.title}</span>
                  <span className="text-sm text-blue-600 font-medium">{reminder.reminderTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWeeklyView = () => {
    if (!weeklyData) return null;

    const chartData = weeklyData.dailyBreakdown?.map((d: any, index: number) => {
      const date = new Date(d.date);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.date,
        completed: d.completed,
        total: d.total,
        rate: d.rate,
      };
    }) || [];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Last 7 Days Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border">
                        <p className="font-medium">{payload[0].payload.day}</p>
                        <p className="text-sm text-gray-600">Completed: {payload[0].payload.completed} / {payload[0].payload.total}</p>
                        <p className="text-sm text-green-600">Rate: {payload[0].payload.rate.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 6 }}
                activeDot={{ r: 8 }}
                name="Completion Rate (%)"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Habits Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{weeklyData.summary?.totalCompletions || 0}</p>
            <p className="text-sm text-gray-600">Total Completions</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{weeklyData.summary?.completionRate?.toFixed(0) || 0}%</p>
            <p className="text-sm text-gray-600">Avg Completion</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{weeklyData.summary?.perfectDays || 0}</p>
            <p className="text-sm text-gray-600">Perfect Days</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{weeklyData.summary?.totalHabits || 0}</p>
            <p className="text-sm text-gray-600">Active Habits</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {weeklyData.habitsPerformance && weeklyData.habitsPerformance.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Habit Performance</h3>
            <div className="space-y-3">
              {weeklyData.habitsPerformance.map((habit: any) => (
                <div key={habit.habitId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{habit.title}</p>
                    <p className="text-sm text-gray-500 capitalize">{habit.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{habit.completed}/{habit.total}</p>
                    <p className="text-sm text-green-600">{habit.rate.toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMonthlyView = () => {
    if (!monthlyData) return null;

    const chartData = monthlyData.trends?.daily?.map((d: any) => ({
      date: d.date,
      completed: d.completed,
      rate: d.rate,
    })) || [];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-center text-white">
            <p className="text-3xl font-bold">{monthlyData.overview?.totalCompletions || 0}</p>
            <p className="text-sm opacity-90">Total Completions</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-center text-white">
            <p className="text-3xl font-bold">{monthlyData.overview?.completionRate?.toFixed(0) || 0}%</p>
            <p className="text-sm opacity-90">Completion Rate</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-center text-white">
            <p className="text-3xl font-bold">{monthlyData.overview?.currentStreak || 0}</p>
            <p className="text-sm opacity-90">Current Streak</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border">
                        <p className="font-medium">{new Date(payload[0].payload.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Completed: {payload[0].payload.completed}</p>
                        <p className="text-sm text-green-600">Rate: {payload[0].payload.rate.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
                name="Completion Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monthlyData.topPerformingHabits && monthlyData.topPerformingHabits.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-green-500">★</span>
                Top Performing
              </h3>
              <div className="space-y-3">
                {monthlyData.topPerformingHabits.map((habit: any) => (
                  <div key={habit.habitId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-800">{habit.title}</span>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{habit.completionRate.toFixed(0)}%</p>
                      <p className="text-xs text-gray-500">{habit.currentStreak} day streak</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {monthlyData.habitsNeedingAttention && monthlyData.habitsNeedingAttention.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-orange-500">⚠</span>
                Needs Attention
              </h3>
              <div className="space-y-3">
                {monthlyData.habitsNeedingAttention.map((habit: any) => (
                  <div key={habit.habitId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium text-gray-800">{habit.title}</span>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">{habit.completionRate.toFixed(0)}%</p>
                      <p className="text-xs text-gray-500">{habit.daysSinceLastCompletion} days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] mobile-page-padding">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Progress</h1>
            </div>

            {/* Segmented control — mobile friendly */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
              {views.map((v) => (
                <button
                  key={v.value}
                  onClick={() => { setView(v.value); setShowDropdown(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    view === v.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {view === 'daily' && renderDailyView()}
        {view === 'weekly' && renderWeeklyView()}
        {view === 'monthly' && renderMonthlyView()}
      </main>
    </div>
  );
}
