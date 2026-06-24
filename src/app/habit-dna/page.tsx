import React, { useState, useEffect } from 'react';
import { HabitDNADisplay } from '@/components/unique-features/HabitDNADisplay';
import { BreedingLab } from '@/components/unique-features/BreedingLab';
import { api } from '@/lib/api';

export default function HabitDNAPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧬 Habit DNA System</h1>
        <p className="text-gray-600">
          Analyze habit genetics, breed complementary habits, and discover unique genetic traits
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - User's Habit DNAs */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Habit Genetics</h2>
            <HabitDNALoader userId="current" />
          </div>

          <BreedingLab userId="current" />
        </div>

        {/* Right Column - Genetic Insights */}
        <div className="space-y-6">
          <GeneticInsights userId="current" />
          <MutationHistory userId="current" />
        </div>
      </div>
    </div>
  );
}

function HabitDNALoader({ userId }: { userId: string }) {
  const [habits, setHabits] = useState<any[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const response = await api.getHabits({ isActive: true });
      setHabits(response.habits);
      if (response.habits.length > 0) {
        setSelectedHabit(response.habits[0].id);
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Select Habit to Analyze</h3>
      <select
        value={selectedHabit || ''}
        onChange={(e) => setSelectedHabit(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white"
      >
        {habits.map(habit => (
          <option key={habit.id} value={habit.id}>{habit.title}</option>
        ))}
      </select>

      {selectedHabit && <HabitDNADisplay habitId={selectedHabit} habitName={habits.find(h => h.id === selectedHabit)?.title || ''} />}
    </div>
  );
}

function GeneticInsights({ userId }: { userId: string }) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId !== 'current') return; // Only load for real user
    setLoading(false);
  }, [userId]);

  if (loading) {
    return <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">🧬 Genetic Insights</h3>
      <div className="text-center py-8 text-gray-500">
        Select a habit to see its genetic insights
      </div>
    </div>
  );
}

function MutationHistory({ userId }: { userId: string }) {
  const [mutations, setMutations] = useState<any[]>([]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Recent Mutations</h3>
      <div className="space-y-2">
        {mutations.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No recent mutations</p>
        ) : (
          mutations.map((mutation: any, index: number) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{mutation.gene}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  mutation.type === 'beneficial' ? 'bg-green-100 text-green-700' :
                  mutation.type === 'detrimental' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {mutation.type}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {mutation.oldValue} → {mutation.newValue}
              </div>
              <div className="text-xs text-gray-500">{new Date(mutation.timestamp).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
