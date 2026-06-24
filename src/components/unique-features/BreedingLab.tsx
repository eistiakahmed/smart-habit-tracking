'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Sparkles, Lock, Plus,
  Crown, Star, Zap, Award
} from 'lucide-react';
import { api } from '@/lib/api';

interface BreedingLabProps {
  userId: string;
}

interface Creature {
  id: string;
  name: string;
  element: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level: number;
  gender: 'male' | 'female';
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  image: string;
  breedCount: number;
  maxBreeds: number;
}

export function BreedingLab({ userId }: BreedingLabProps) {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [selectedParent1, setSelectedParent1] = useState<string | null>(null);
  const [selectedParent2, setSelectedParent2] = useState<string | null>(null);
  const [breeding, setBreeding] = useState(false);
  const [offspring, setOffspring] = useState<any>(null);

  const loadCreatures = async () => {
    try {
      const response = await api.getHabits({ isActive: true });
      const creatures: Creature[] = response.habits.map((habit: unknown) => {
        const h = habit as { id: string; title: string; category: string; icon?: string };
        return {
          id: h.id,
          name: h.title,
          element: h.category,
          rarity: ['common', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 4)] as Creature['rarity'],
          level: Math.floor(Math.random() * 50) + 1,
          gender: Math.random() > 0.5 ? 'male' : 'female',
          stats: {
            hp: Math.floor(Math.random() * 100) + 50,
            attack: Math.floor(Math.random() * 100) + 20,
            defense: Math.floor(Math.random() * 80) + 20,
            speed: Math.floor(Math.random() * 100) + 30,
          },
          image: h.icon || '',
          breedCount: Math.floor(Math.random() * 5),
          maxBreeds: 5,
        };
      });
      setCreatures(creatures);
    } catch (error) {
      console.error('Failed to load creatures:', error);
    }
  };

  useEffect(() => {
    loadCreatures();
  }, [userId]);

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

  const creature1 = creatures.find(c => c.id === selectedParent1);
  const creature2 = creatures.find(c => c.id === selectedParent2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-purple-500/30">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Breeding Lab</h1>
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        {/* Main Breeding Interface */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Parent 1 Section */}
            <div className="flex-1">
              <div className="text-center mb-3">
                <h3 className="text-white font-semibold text-sm">PARENT 1</h3>
              </div>
              {creature1 ? (
                <div className="bg-slate-800 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                      <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
                        <CreatureIcon creature={creature1} size="sm" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold">{creature1.name}</h4>
                        <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          creature1.rarity === 'legendary' ? 'bg-yellow-500 text-yellow-900' :
                          creature1.rarity === 'epic' ? 'bg-purple-500 text-purple-900' :
                          creature1.rarity === 'rare' ? 'bg-blue-500 text-blue-900' :
                          'bg-gray-500 text-gray-900'
                        }`}>
                          {creature1.rarity}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>Lv.{creature1.level}</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${creature1.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
                          <span className="capitalize">{creature1.gender}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">HP</span>
                        <span className="text-green-400 font-bold">{creature1.stats.hp}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${creature1.stats.hp}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">ATK</span>
                        <span className="text-red-400 font-bold">{creature1.stats.attack}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${creature1.stats.attack}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">DEF</span>
                        <span className="text-blue-400 font-bold">{creature1.stats.defense}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${creature1.stats.defense}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">SPD</span>
                        <span className="text-yellow-400 font-bold">{creature1.stats.speed}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: `${creature1.stats.speed}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedParent1(null)}
                    className="w-full mt-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {creatures.map(creature => (
                    <button
                      key={creature.id}
                      onClick={() => setSelectedParent1(creature.id)}
                      disabled={!!selectedParent2}
                      className="relative group"
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                        creature.rarity === 'legendary' ? 'from-yellow-500 to-orange-500' :
                        creature.rarity === 'epic' ? 'from-purple-500 to-pink-500' :
                        creature.rarity === 'rare' ? 'from-blue-500 to-cyan-500' :
                        'from-gray-500 to-gray-600'
                      } rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                      <div className="relative bg-slate-800 rounded-lg p-2 border border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <CreatureIcon creature={creature} size="sm" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{creature.name}</p>
                            <p className="text-gray-500 text-xs">Lv.{creature.level}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${creature.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
                            <span className="text-gray-600 capitalize">{creature.gender}</span>
                          </div>
                          <div className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${
                            creature.rarity === 'legendary' ? 'bg-yellow-500/30 text-yellow-400' :
                            creature.rarity === 'epic' ? 'bg-purple-500/30 text-purple-400' :
                            creature.rarity === 'rare' ? 'bg-blue-500/30 text-blue-400' :
                            'bg-gray-500/30 text-gray-400'
                          }`}>
                            {creature.rarity.slice(0, 4)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Breeding Center */}
            <div className="flex flex-col items-center justify-center px-4">
              {creature1 && creature2 ? (
                <button
                  onClick={handleBreed}
                  disabled={breeding}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                    {breeding ? (
                      <Sparkles className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Plus className="w-8 h-8 text-white" />
                    )}
                  </div>
                </button>
              ) : (
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-700">
                  <Lock className="w-6 h-6 text-gray-600" />
                </div>
              )}

              {creature1 && creature2 && (
                <div className="mt-3 text-center space-y-1">
                  <p className="text-gray-500 text-xs">100 💎</p>
                  <p className="text-green-400 text-xs font-medium">95% Success</p>
                </div>
              )}
            </div>

            {/* Parent 2 Section */}
            <div className="flex-1">
              <div className="text-center mb-3">
                <h3 className="text-white font-semibold text-sm">PARENT 2</h3>
              </div>
              {creature2 ? (
                <div className="bg-slate-800 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5">
                      <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
                        <CreatureIcon creature={creature2} size="sm" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold">{creature2.name}</h4>
                        <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          creature2.rarity === 'legendary' ? 'bg-yellow-500 text-yellow-900' :
                          creature2.rarity === 'epic' ? 'bg-purple-500 text-purple-900' :
                          creature2.rarity === 'rare' ? 'bg-blue-500 text-blue-900' :
                          'bg-gray-500 text-gray-900'
                        }`}>
                          {creature2.rarity}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>Lv.{creature2.level}</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${creature2.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
                          <span className="capitalize">{creature2.gender}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">HP</span>
                        <span className="text-green-400 font-bold">{creature2.stats.hp}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${creature2.stats.hp}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">ATK</span>
                        <span className="text-red-400 font-bold">{creature2.stats.attack}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${creature2.stats.attack}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">DEF</span>
                        <span className="text-blue-400 font-bold">{creature2.stats.defense}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${creature2.stats.defense}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">SPD</span>
                        <span className="text-yellow-400 font-bold">{creature2.stats.speed}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: `${creature2.stats.speed}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedParent2(null)}
                    className="w-full mt-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : creature1 ? (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {creatures.filter(c => c.id !== selectedParent1).map(creature => (
                    <button
                      key={creature.id}
                      onClick={() => setSelectedParent2(creature.id)}
                      className="relative group"
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                        creature.rarity === 'legendary' ? 'from-yellow-500 to-orange-500' :
                        creature.rarity === 'epic' ? 'from-purple-500 to-pink-500' :
                        creature.rarity === 'rare' ? 'from-blue-500 to-cyan-500' :
                        'from-gray-500 to-gray-600'
                      } rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                      <div className="relative bg-slate-800 rounded-lg p-2 border border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                            <CreatureIcon creature={creature} size="sm" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{creature.name}</p>
                            <p className="text-gray-500 text-xs">Lv.{creature.level}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${creature.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
                            <span className="text-gray-600 capitalize">{creature.gender}</span>
                          </div>
                          <div className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${
                            creature.rarity === 'legendary' ? 'bg-yellow-500/30 text-yellow-400' :
                            creature.rarity === 'epic' ? 'bg-purple-500/30 text-purple-400' :
                            creature.rarity === 'rare' ? 'bg-blue-500/30 text-blue-400' :
                            'bg-gray-500/30 text-gray-400'
                          }`}>
                            {creature.rarity.slice(0, 4)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-800 rounded-xl">
                  <Lock className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Locked</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Offspring Result */}
        <AnimatePresence>
          {offspring && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-3xl border border-green-500/30 p-8">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mt-2">New Creature Created!</h3>
                </div>

                <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 p-1">
                      <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                        <Crown className="w-12 h-12 text-yellow-400" />
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-white text-center mb-2">{offspring.habit.title}</h4>
                  <p className="text-purple-300 text-center text-sm mb-6">{offspring.habit.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">{offspring.breedingReport.generation}</div>
                      <div className="text-xs text-gray-500">Generation</div>
                    </div>
                    <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-400">{offspring.breedingReport.mutations}</div>
                      <div className="text-xs text-gray-500">Mutations</div>
                    </div>
                    <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-400">
                        {Math.round(offspring.attractiveness)}
                      </div>
                      <div className="text-xs text-gray-500">Quality</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setOffspring(null);
                      setSelectedParent1(null);
                      setSelectedParent2(null);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creature Collection */}
        <div className="space-y-4">
          {/* Collection Header */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-t-2xl border border-purple-500/30 border-b-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">YOUR COLLECTION</h3>
                  <p className="text-gray-400 text-xs">Select creatures for breeding</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-white font-bold text-lg">{creatures.length}</div>
                  <div className="text-gray-500 text-xs">Total</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-lg">{creatures.filter(c => !(selectedParent1 === c.id || selectedParent2 === c.id) || (!selectedParent1 && !selectedParent2)).length}</div>
                  <div className="text-gray-500 text-xs">Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Collection Body */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-b-2xl border border-purple-500/30 border-t-0 p-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {['All', 'Common', 'Rare', 'Epic', 'Legendary'].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === 'All'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Creatures Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {creatures.map(creature => {
                const isSelected = selectedParent1 === creature.id || selectedParent2 === creature.id;
                const isDisabled = Boolean(selectedParent1 && selectedParent2 && !isSelected);

                return (
                  <button
                    key={creature.id}
                    onClick={() => {
                      if (isDisabled) return;
                      if (!selectedParent1) {
                        setSelectedParent1(creature.id);
                      } else if (!selectedParent2 && creature.id !== selectedParent1) {
                        setSelectedParent2(creature.id);
                      }
                    }}
                    disabled={isDisabled}
                    className={`relative group text-left ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {/* Selection Badge */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Card Background Glow */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                      creature.rarity === 'legendary' ? 'from-yellow-500 to-orange-500' :
                      creature.rarity === 'epic' ? 'from-purple-500 to-pink-500' :
                      creature.rarity === 'rare' ? 'from-blue-500 to-cyan-500' :
                      'from-gray-500 to-gray-600'
                    } rounded-xl blur opacity-40 ${!isDisabled ? 'group-hover:opacity-80' : ''} transition-opacity`}></div>

                    {/* Card */}
                    <div className={`relative bg-slate-800 rounded-xl p-3 border-2 transition-all ${
                      isSelected ? 'border-green-500' : 'border-slate-700 group-hover:border-slate-600'
                    }`}>
                      {/* Creature Image Area */}
                      <div className={`w-full aspect-square mb-2 rounded-lg bg-gradient-to-br ${
                        creature.rarity === 'legendary' ? 'from-yellow-500/20 to-orange-500/20' :
                        creature.rarity === 'epic' ? 'from-purple-500/20 to-pink-500/20' :
                        creature.rarity === 'rare' ? 'from-blue-500/20 to-cyan-500/20' :
                        'from-gray-500/20 to-gray-600/20'
                      } flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                        <CreatureIcon creature={creature} size="sm" />

                        {/* Level Badge */}
                        <div className="absolute top-1 left-1 px-2 py-0.5 bg-slate-900/80 rounded-full">
                          <span className="text-yellow-400 text-xs font-bold">Lv.{creature.level}</span>
                        </div>

                        {/* Gender Badge */}
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 flex items-center justify-center">
                          <div className={`w-2 h-2 rounded-full ${creature.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
                        </div>
                      </div>

                      {/* Creature Info */}
                      <div className="text-center space-y-1">
                        <h4 className="text-white text-sm font-bold truncate">{creature.name}</h4>
                        <p className="text-gray-500 text-xs truncate">{creature.element}</p>

                        {/* Rarity Badge */}
                        <div className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          creature.rarity === 'legendary' ? 'bg-yellow-500/30 text-yellow-400' :
                          creature.rarity === 'epic' ? 'bg-purple-500/30 text-purple-400' :
                          creature.rarity === 'rare' ? 'bg-blue-500/30 text-blue-400' :
                          'bg-gray-500/30 text-gray-400'
                        }`}>
                          {creature.rarity.slice(0, 3)}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="mt-2 grid grid-cols-3 gap-1">
                        <div className="bg-slate-900/50 rounded p-1.5 text-center">
                          <div className="text-red-400 text-xs font-bold">{creature.stats.attack}</div>
                          <div className="text-gray-600 text-xs">ATK</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-1.5 text-center">
                          <div className="text-blue-400 text-xs font-bold">{creature.stats.defense}</div>
                          <div className="text-gray-600 text-xs">DEF</div>
                        </div>
                        <div className="bg-slate-900/50 rounded p-1.5 text-center">
                          <div className="text-yellow-400 text-xs font-bold">{creature.stats.speed}</div>
                          <div className="text-gray-600 text-xs">SPD</div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Empty State */}
            {creatures.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                  <Crown className="w-10 h-10 text-gray-700" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">No Creatures Yet</h4>
                <p className="text-gray-500 text-sm">Start breeding to build your collection!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Breeding Card Component
function BreedingCard({ creature }: {
  creature: Creature;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${
        creature.rarity === 'legendary' ? 'from-yellow-500 to-orange-500' :
        creature.rarity === 'epic' ? 'from-purple-500 to-pink-500' :
        creature.rarity === 'rare' ? 'from-blue-500 to-cyan-500' :
        'from-gray-500 to-gray-600'
      } rounded-xl blur opacity-40`}></div>

      <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
        {/* Header with icon */}
        <div className={`bg-gradient-to-r ${
          creature.rarity === 'legendary' ? 'from-yellow-500/20 to-orange-500/20' :
          creature.rarity === 'epic' ? 'from-purple-500/20 to-pink-500/20' :
          creature.rarity === 'rare' ? 'from-blue-500/20 to-cyan-500/20' :
          'from-gray-500/20 to-gray-600/20'
        } p-4`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreatureIcon creature={creature} size="md" />
              <div>
                <h4 className="text-white font-bold text-sm">{creature.name}</h4>
                <p className="text-gray-400 text-xs">{creature.element}</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
              creature.rarity === 'legendary' ? 'bg-yellow-500 text-yellow-900' :
              creature.rarity === 'epic' ? 'bg-purple-500 text-purple-900' :
              creature.rarity === 'rare' ? 'bg-blue-500 text-blue-900' :
              'bg-gray-500 text-gray-900'
            }`}>
              {creature.rarity}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${creature.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
              <span className="text-gray-400 text-xs capitalize">{creature.gender}</span>
            </div>
            <div className="text-yellow-400 text-xs font-bold">Lv.{creature.level}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">HP</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${creature.stats.hp}%` }}></div>
              </div>
              <span className="text-white font-bold text-xs">{creature.stats.hp}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">ATK</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${creature.stats.attack}%` }}></div>
              </div>
              <span className="text-white font-bold text-xs">{creature.stats.attack}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">DEF</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${creature.stats.defense}%` }}></div>
              </div>
              <span className="text-white font-bold text-xs">{creature.stats.defense}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">SPD</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${creature.stats.speed}%` }}></div>
              </div>
              <span className="text-white font-bold text-xs">{creature.stats.speed}</span>
            </div>
          </div>
        </div>

        {/* Breed Count */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Breeds</span>
            <span className="text-gray-400">{creature.breedCount}/{creature.maxBreeds}</span>
          </div>
          <div className="mt-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
              style={{ width: `${(creature.breedCount / creature.maxBreeds) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Creature Icon Component
function CreatureIcon({ creature, size }: { creature: Creature; size: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSize = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const elementIcons: Record<string, any> = {
    'Health': Heart,
    'Fitness': Zap,
    'Productivity': Award,
    'Learning': Star,
    'Meditation': Sparkles,
    'Social': Crown,
  };

  const Icon = elementIcons[creature.element] || Sparkles;

  const gradientColors: Record<string, string> = {
    'Health': 'from-rose-500 to-pink-600',
    'Fitness': 'from-amber-500 to-orange-600',
    'Productivity': 'from-blue-500 to-cyan-600',
    'Learning': 'from-purple-500 to-violet-600',
    'Meditation': 'from-teal-500 to-emerald-600',
    'Social': 'from-green-500 to-lime-600',
  };

  const gradient = gradientColors[creature.element] || 'from-gray-500 to-gray-600';

  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${gradient} p-0.5`}>
      <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
        <Icon className={`${iconSize[size]} text-white`} />
      </div>
    </div>
  );
}
