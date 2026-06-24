'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      <div className="min-h-screen flex items-center justify-center bg-[#050a15]">
        <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
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

  const COLORS = ['#0ea5e9', '#10b981', '#f97316', '#a855f7', '#ec4899', '#f59e0b'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl px-3.5 py-2 font-sans">
        <p className="text-xs font-bold text-slate-100">{d.name || d.payload.day || d.payload.category}</p>
        <p className="text-[11px] text-slate-400 mt-1 font-semibold">
          {d.value} completed
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050a15] text-[#f8fafc] mobile-page-padding relative overflow-x-hidden font-sans">
      
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      
      <header className="glass-header sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14 sm:h-16">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">Analytics Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10 page-enter">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          
          {/* Weekly Report Chart */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-2xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-400" />
              Weekly Completions
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.01)' }} />
                <Bar dataKey="completed" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown Chart */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-2xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Category Share
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
                  strokeWidth={0}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Patterns */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-2xl mb-6">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Productivity Patterns
          </h2>
          {habitPatterns?.bestPerformingTimes ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(habitPatterns.bestPerformingTimes).map(([time, data]: [string, any]) => (
                <div key={time} className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 hover:scale-102 transition-transform duration-200">
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 mb-1">{time}</div>
                  <div className="text-2xl font-black text-slate-100">{data.completionRate || 0}%</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-1">Completion Rate</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 font-semibold text-sm">No pattern data available yet. Keep tracking your habits!</p>
          )}
        </div>

        {/* Weekly Summary */}
        {weeklyReport && (
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-2xl">
            <h3 className="font-bold text-white mb-4">Weekly Summary Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-sky-500/8 border border-sky-500/25 rounded-2xl">
                <div className="text-3xl font-black text-sky-400">{weeklyReport.summary?.totalCompletions || 0}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Total Completions</div>
              </div>
              <div className="text-center p-4 bg-emerald-500/8 border border-emerald-500/25 rounded-2xl">
                <div className="text-3xl font-black text-emerald-400">{weeklyReport.summary?.completionRate || 0}%</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-500/8 border border-purple-500/25 rounded-2xl">
                <div className="text-3xl font-black text-purple-400">{weeklyReport.summary?.perfectDays || 0}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Perfect Days</div>
              </div>
              <div className="text-center p-4 bg-orange-500/8 border border-orange-500/25 rounded-2xl">
                <div className="text-3xl font-black text-orange-400">{weeklyReport.summary?.totalHabits || 0}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Active Habits</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
