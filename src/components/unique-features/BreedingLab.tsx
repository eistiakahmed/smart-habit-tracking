'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, TrendingUp, Zap, Award, Sparkles, GitBranch, RefreshC } from 'lucide-react';
import { api } from '@/lib/api';

interface BreedingLabProps {
  userId: string;
}

export function BreedingLab({ userId }: BreedingLabProps) {
  const [habits, setHabits] = useState<any[]>([]);
  const [selectedParent1, setSelectedParent1] = useState<string | null>(null);
  const [selectedParent2, setSelectedParent2] = useState<string | null>(null);
  const [breeding, setBreeding] = useState(false);
  const [offspring, setOffspring] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadHabits();
  }, [userId]);

  const loadHabits = async () => {
    try {
      const response = await api.getHabits({ isActive: true });
      setHabits(response.habits);
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  };

  const handleBreed = async () => {
    if (!selectedParent1 || !selectedParent2) return;

    setBreeding(true);
    try {
      const result = await api.breedHabits(selectedParent1, selectedParent2);
      setOffspring(result.offspring);
    } catch (error) {
      console.error('Breeding failed:', error);
    } finally {
      setBreeding(false);
    }
  };

  const getSuggestions = async (habitId: string) => {
    try {
      const response = await api.getBreedingSuggestions(habitId);
      setSuggestions(response.suggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  const habit1 = habits.find(h => h.id === selectedParent1);
  const habit2 = habits.find(h => h.id === selectedParent2);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 shadow-sm border border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-900">Habit Breeding Lab</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Parent 1 Selection */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Parent Habit 1</h4>
          <select
            value={selectedParent1 || ''}
            onChange={(e) => {
              setSelectedParent1(e.target.value);
              if (e.target.value) getSuggestions(e.target.value);
              setOffspring(null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">Select first parent...</option>
            {habits.map(habit => (
              <option key={habit.id} value={habit.id}>
                {habit.title} ({habit.category})
              </option>
            ))}
          </select>

          {selectedParent1 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              {habits.find(h => h.id === selectedParent1) && (
                <>
                  <div className="font-medium text-gray-900">{habit1?.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Difficulty: {habit1?.difficulty} | {habit1?.category}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Parent 2 Selection */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Parent Habit 2</h4>
          <select
            value={selectedParent2 || ''}
            onChange={(e) => {
              setSelectedParent2(e.target.value);
              setOffspring(null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">Select second parent...</option>
            {habits.map(habit => (
              <option key={habit.id} value={habit.id}>
                {habit.title} ({habit.category})
              </option>
            ))}
          </select>

          {selectedParent2 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              {habits.find(h => h.id === selectedParent2) && (
                <>
                  <div className="font-medium text-gray-900">{habit2?.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Difficulty: {habit2?.difficulty} | {habit2?.category}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Breeding Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Recommended Breeding Partners</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedParent2(suggestion.habit.id)}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{suggestion.habit.title}</div>
                  <div className="text-sm text-gray-600">
                    Compatibility: {Math.round(suggestion.compatibility)}% |
                    Offspring Quality: {Math.round(suggestion.potentialOffspring.attractiveness)}
                  </div>
                </div>
                <div className="text-green-600 font-semibold">
                  {Math.round(suggestion.compatibility)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breed Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleBreed}
          disabled={!selectedParent1 || !selectedParent2 || breeding}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
        >
          {breeding ? 'Breeding...' : '🧬 Breed Habits'}
        </button>
      </div>

      {/* Offspring Result */}
      {offspring && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-lg border-2 border-purple-400"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h4 className="text-lg font-semibold text-gray-900">New Habit Created!</h4>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <div className="font-medium text-gray-900 text-lg">{offspring.habit.title}</div>
            <div className="text-sm text-gray-600 mt-1">{offspring.habit.description}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Generation</div>
              <div className="text-lg font-semibold text-green-900">{offspring.breedingReport.generation}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Mutations</div>
              <div className="text-lg font-semibold text-blue-900">{offspring.breedingReport.mutations}</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <strong>Inherited Traits:</strong>
              <ul className="mt-2 space-y-1">
                {offspring.breedingReport.inheritedTraits.slice(0, 3).map((trait: string, i: number) => (
                  <li key={i} className="text-xs">{trait}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
