'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Flame, CheckCircle2, Circle, TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { addDaysToDateString, formatLocalDate, parseLocalDate } from '@/lib/utils';
import { DailyProgress, ProgressView } from '@/types';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const COLORS = ['#10b981', 'rgba(255, 255, 255, 0.05)'];

export default function ProgressPage() {
  const router = useRouter();
  const [view, setView] = useState<ProgressView>('daily');
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);

  const views: { value: ProgressView; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  useEffect(() => {
    setSelectedDate(formatLocalDate());
  }, []);

  useEffect(() => {
    if (selectedDate || view !== 'daily') {
      fetchData();
    }
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
        const data = await api.getWeeklyReport(formatLocalDate(startDate), formatLocalDate());
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
    setSelectedDate(addDaysToDateString(selectedDate || formatLocalDate(), days));
  };

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl px-3.5 py-2.5 font-sans">
        <p className="text-xs font-bold text-slate-100 mb-1">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.fill }} />
            <span className="text-[11px] text-slate-400">{p.name}: <span className="font-bold text-slate-200">{p.value}%</span></span>
          </div>
        ))}
      </div>
    );
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
        <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-2xl border border-slate-900 max-w-md mx-auto shadow-inner">
          <button
            onClick={() => handleDateChange(-1)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/60 hover:bg-slate-800/40 hover:text-white border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <div className="text-center">
            <div className="text-xs font-bold text-slate-100">
              {parseLocalDate(selectedDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </div>
            {selectedDate === formatLocalDate() && (
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block mt-0.5">
                Today
              </span>
            )}
          </div>
          <button
            onClick={() => handleDateChange(1)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/60 hover:bg-slate-800/40 hover:text-white border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={68}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-black text-white">
                  {percentage}%
                </span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 mt-0.5">
                  done
                </span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-base font-bold text-slate-100">
                {completedCount} of {dailyProgress.habits.length} habits
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                completed on this day
              </p>
            </div>
          </div>

          <div className="glass-panel border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl" />
            <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/25 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(249,115,22,0.1)]">
              <Flame className="w-8 h-8 text-orange-400 fill-current" />
            </div>
            <p className="text-4xl font-black text-white tracking-tight">
              {dailyProgress.summary.currentStreak}
            </p>
            <p className="text-xs uppercase tracking-wider font-extrabold text-slate-500 mt-2">
              Day Streak
            </p>
            <p className="text-[10px] text-orange-400/80 font-bold mt-1">
              Consistency is key!
            </p>
          </div>

          <div className="glass-panel border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 tracking-tight uppercase">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              vs Yesterday
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/60">
                <span className="text-xs font-semibold text-slate-400">
                  Completion
                </span>
                <span
                  className={`text-xs font-bold ${dailyProgress.comparison.change.rate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {dailyProgress.comparison.change.rate >= 0 ? '+' : ''}
                  {dailyProgress.comparison.change.rate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/60">
                <span className="text-xs font-semibold text-slate-400">
                  Habits Done
                </span>
                <span
                  className={`text-xs font-bold ${dailyProgress.comparison.change.completed >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {dailyProgress.comparison.change.completed >= 0 ? '+' : ''}
                  {dailyProgress.comparison.change.completed}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-800/50">
                <p className="text-[11px] text-slate-500 font-semibold">
                  Yesterday: {dailyProgress.comparison.previousDay.completed}{' '}
                  habits (
                  {dailyProgress.comparison.previousDay.completionRate.toFixed(
                    0
                  )}
                  %)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel border-slate-800/80 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">
            Today&apos;s Habits Detail
          </h3>
          <div className="space-y-3">
            {dailyProgress.habits.map((habit) => (
              <div
                key={habit.habitId}
                className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900/60 rounded-2xl hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{
                      backgroundColor: habit.color + '15',
                      borderColor: habit.color + '30',
                    }}
                  >
                    {habit.icon ? (
                      <span className="text-xl select-none">{habit.icon}</span>
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-200">
                      {habit.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-1">
                      <span className="capitalize">{habit.category}</span>
                      {habit.completed && habit.completedAt && (
                        <span>
                          •{' '}
                          {new Date(habit.completedAt).toLocaleTimeString(
                            'en-US',
                            { hour: 'numeric', minute: '2-digit' }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {habit.streak > 0 && (
                    <div className="flex items-center gap-0.5 text-orange-400 text-xs font-bold bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{habit.streak}d</span>
                    </div>
                  )}
                  {habit.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-800" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {dailyProgress.upcomingReminders.length > 0 && (
          <div className="glass-panel border-slate-800/80 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">
              Upcoming Reminders
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dailyProgress.upcomingReminders.map((reminder) => (
                <div
                  key={reminder.habitId}
                  className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl"
                >
                  <span className="text-xs font-bold text-slate-300">
                    {reminder.title}
                  </span>
                  <span className="text-xs text-sky-400 font-bold bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                    {reminder.reminderTime}
                  </span>
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

    const chartData = weeklyData.dailyBreakdown?.map((d: any) => {
      const date = parseLocalDate(d.date);
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
        <div className="glass-panel border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl">
          <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            Last 7 Days Progress Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3.5 min-w-[150px] font-sans">
                        <p className="text-xs font-bold text-slate-100 mb-2">{payload[0].payload.day}</p>
                        <p className="text-[11px] text-slate-400 font-semibold">Completed: {payload[0].payload.completed} / {payload[0].payload.total}</p>
                        <p className="text-[11px] text-emerald-400 font-bold mt-1">Rate: {payload[0].payload.rate.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
                name="Completion Rate (%)"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', r: 4 }}
                name="Habits Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-sky-500/8 border border-sky-500/25 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-sky-400">{weeklyData.summary?.totalCompletions || 0}</p>
            <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mt-1">Total Completions</p>
          </div>
          <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-emerald-400">{weeklyData.summary?.completionRate?.toFixed(0) || 0}%</p>
            <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mt-1">Avg Completion</p>
          </div>
          <div className="bg-purple-500/8 border border-purple-500/25 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-purple-400">{weeklyData.summary?.perfectDays || 0}</p>
            <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mt-1">Perfect Days</p>
          </div>
          <div className="bg-orange-500/8 border border-orange-500/25 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-orange-400">{weeklyData.summary?.totalHabits || 0}</p>
            <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mt-1">Active Habits</p>
          </div>
        </div>

        <div className="glass-panel border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">Daily Breakdown Rates</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.01)' }} />
              <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {weeklyData.habitsPerformance && weeklyData.habitsPerformance.length > 0 && (
          <div className="glass-panel border-slate-800/80 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">Individual Habit Performance</h3>
            <div className="space-y-3">
              {weeklyData.habitsPerformance.map((habit: any) => (
                <div key={habit.habitId} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-2xl hover:bg-slate-900/40 transition-colors">
                  <div>
                    <p className="font-bold text-sm text-slate-200">{habit.title}</p>
                    <p className="text-xs text-slate-500 capitalize mt-1 font-semibold">{habit.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-100 text-sm">{habit.completed}/{habit.total} days</p>
                    <p className="text-xs text-emerald-400 font-extrabold mt-1">{habit.rate.toFixed(0)}% Completion</p>
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
          <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl p-4 text-center shadow-lg shadow-sky-500/10 border border-sky-400/20">
            <p className="text-3xl font-black text-white">{monthlyData.overview?.totalCompletions || 0}</p>
            <p className="text-[9px] uppercase tracking-wider font-bold text-sky-100 mt-1">Total Completions</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-center shadow-lg shadow-emerald-500/10 border border-emerald-400/20">
            <p className="text-3xl font-black text-white">{monthlyData.overview?.completionRate?.toFixed(0) || 0}%</p>
            <p className="text-[9px] uppercase tracking-wider font-bold text-emerald-100 mt-1">Avg Completion Rate</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 text-center shadow-lg shadow-orange-500/10 border border-orange-400/20">
            <p className="text-3xl font-black text-white">{monthlyData.overview?.currentStreak || 0}</p>
            <p className="text-[9px] uppercase tracking-wider font-bold text-orange-100 mt-1">Current Streak</p>
          </div>
        </div>

        <div className="glass-panel border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl">
          <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Monthly Trend Chart
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => parseLocalDate(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3.5 min-w-[150px] font-sans">
                        <p className="text-xs font-bold text-slate-100 mb-2">{parseLocalDate(payload[0].payload.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className="text-[11px] text-slate-400 font-semibold">Completed: {payload[0].payload.completed}</p>
                        <p className="text-[11px] text-emerald-400 font-bold mt-1">Rate: {payload[0].payload.rate.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                name="Completion Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monthlyData.topPerformingHabits && monthlyData.topPerformingHabits.length > 0 && (
            <div className="glass-panel border-slate-800/80 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
                <span className="text-yellow-400">★</span>
                Top Performing Habits
              </h3>
              <div className="space-y-3">
                {monthlyData.topPerformingHabits.map((habit: any) => (
                  <div key={habit.habitId} className="flex items-center justify-between p-3.5 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl">
                    <span className="font-bold text-sm text-slate-200">{habit.title}</span>
                    <div className="text-right">
                      <p className="font-black text-emerald-400 text-sm">{habit.completionRate.toFixed(0)}%</p>
                      <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">{habit.currentStreak} day streak</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {monthlyData.habitsNeedingAttention && monthlyData.habitsNeedingAttention.length > 0 && (
            <div className="glass-panel border-slate-800/80 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
                <span className="text-orange-400">⚠️</span>
                Needs Attention
              </h3>
              <div className="space-y-3">
                {monthlyData.habitsNeedingAttention.map((habit: any) => (
                  <div key={habit.habitId} className="flex items-center justify-between p-3.5 bg-orange-500/8 border border-orange-500/20 rounded-2xl">
                    <span className="font-bold text-sm text-slate-200">{habit.title}</span>
                    <div className="text-right">
                      <p className="font-black text-orange-400 text-sm">{habit.completionRate.toFixed(0)}%</p>
                      <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">{habit.daysSinceLastCompletion} days missed</p>
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
      <div className="min-h-screen flex items-center justify-center bg-[#050a15]">
        <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] mobile-page-padding relative overflow-x-hidden font-sans">
      
      {/* Ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <header className="glass-header sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => router.back()} 
                className="flex-shrink-0 p-2 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-xl font-bold text-white tracking-tight whitespace-nowrap">Progress Logs</h1>
            </div>

            {/* Segmented control tabs */}
            <div className="flex bg-slate-950 border border-slate-900 rounded-lg p-0.5 gap-0.5 shadow-inner flex-shrink-0">
              {views.map((v) => (
                <button
                  key={v.value}
                  onClick={() => { setView(v.value); setShowDropdown(false); }}
                  className={`px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                    view === v.value
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10 page-enter">
        {view === 'daily' && renderDailyView()}
        {view === 'weekly' && renderWeeklyView()}
        {view === 'monthly' && renderMonthlyView()}
      </main>
    </div>
  );
}
