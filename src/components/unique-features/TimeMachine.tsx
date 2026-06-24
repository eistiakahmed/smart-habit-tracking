'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshC, Play, Eye, TrendingUp, Lightbulb, GitBranch, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface TimeMachineProps {
  userId: string;
}

export function TimeMachine({ userId }: TimeMachineProps) {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'predictions' | 'experiments'>('scenarios');

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scenariosData, predictionsData] = await Promise.all([
        api.getUserScenarios(),
        api.predictFuturePerformance(30),
      ]);

      setScenarios(scenariosData.scenarios || []);
      setPredictions(predictionsData);
    } catch (error) {
      console.error('Failed to load time machine data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Time Machine</h1>
        </div>
        <p className="text-indigo-100">
          Explore alternative timelines and predict your future habit performance
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg p-2 border border-gray-200 flex gap-2">
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'scenarios' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          📱 Scenarios
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'predictions' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          🔮 Predictions
        </button>
        <button
          onClick={() => setActiveTab('experiments')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'experiments' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          🧪 Experiments
        </button>
      </div>

      {/* Content */}
      {activeTab === 'scenarios' && (
        <ScenariosList scenarios={scenarios} userId={userId} />
      )}
      {activeTab === 'predictions' && <PredictionsDisplay predictions={predictions} />}
      {activeTab === 'experiments' && <ExperimentsList userId={userId} />}
    </div>
  );
}

function ScenariosList({ scenarios, userId }: { scenarios: any[]; userId: string }) {
  const [creating, setCreating] = useState(false);

  if (scenarios.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-4">No scenarios created yet.</p>
        <button
          onClick={() => {/* Create scenario modal */}}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Create Your First Scenario
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Your Scenarios</h3>
        <button
          onClick={() => {/* Create scenario modal */}}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          + New Scenario
        </button>
      </div>

      {scenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          userId={userId}
        />
      ))}
    </div>
  );
}

interface ScenarioCardProps {
  scenario: any;
  userId: string;
}

function ScenarioCard({ scenario, userId }: ScenarioCardProps) {
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    if (scenario.status !== 'DRAFT' && scenario.status !== 'FAILED') return;

    setRunning(true);
    try {
      await api.runScenario(scenario.id);
      // Refresh scenarios
      window.location.reload();
    } catch (error) {
      console.error('Failed to run scenario:', error);
      setRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'RUNNING': return 'bg-blue-100 text-blue-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{scenario.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(scenario.status)}`}>
          {scenario.status}
        </span>
      </div>

      {/* Timeline Info */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="w-4 h-4" />
          <span>Period: {scenario.timeline.simulatedPeriod} days</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {new Date(scenario.timeline.startDate).toLocaleDateString()} - {new Date(scenario.timeline.endDate).toLocaleDateString()}
        </div>
      </div>

      {/* Results */}
      {scenario.status === 'COMPLETED' && (
        <div className="bg-purple-50 p-4 rounded-lg mb-4">
          <h5 className="font-semibold text-gray-900 mb-3">Results</h5>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-600">Predicted Completion</div>
              <div className="text-xl font-bold text-purple-900">{Math.round(scenario.results.predictedCompletion)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Predicted Streaks</div>
              <div className="text-xl font-bold text-purple-900">{scenario.results.predictedStreaks}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Confidence</div>
              <div className="text-xl font-bold text-blue-900">{Math.round(scenario.results.confidence)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Processing Time</div>
              <div className="text-xl font-bold text-gray-900">{scenario.metadata.processingTime}ms</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleRun}
          disabled={running || scenario.status !== 'DRAFT' && scenario.status !== 'FAILED'}
          className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          {running ? 'Running...' : 'Run Scenario'}
        </button>
        <button
          onClick={() => {/* View details */}}
          className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </motion.div>
  );
}

function PredictionsDisplay({ predictions }: { predictions: any }) {
  if (!predictions) {
    return (
      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-4">No predictions generated yet.</p>
        <button
          onClick={() => {/* Generate predictions */}}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Predictions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Prediction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance Prediction</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Completion Rate</div>
            <div className="text-2xl font-bold text-blue-900">
              {Math.round(predictions.overall.predictedCompletionRate)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Streak Growth</div>
            <div className="text-2xl font-bold text-green-900">
              {Math.round(predictions.overall.predictedStreakGrowth)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Confidence</div>
            <div className="text-2xl font-bold text-purple-900">
              {Math.round(predictions.overall.confidence)}%
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-600">Timeframe</div>
            <div className="text-xl font-bold text-gray-900">{predictions.overall.timeframe} days</div>
          </div>
        </div>
      </div>

      {/* Habit Predictions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Habit-Specific Predictions</h3>
        <div className="space-y-3">
          {predictions.habitPredictions.map((pred: any) => (
            <HabitPrediction key={pred.habitId} prediction={pred} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-gray-900">AI Recommendations</h4>
        </div>
        <ul className="space-y-1">
          {predictions.overall.recommendations.map((rec: string, i: number) => (
            <li key={i} className="text-sm text-gray-700">• {rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HabitPrediction({ prediction }: { prediction: any }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="font-medium text-gray-900 mb-2">{prediction.habitName}</div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Completion Rate:</span>
          <span className={`ml-1 font-semibold ${getScoreColor(prediction.prediction.completionRate)}`}>
            {Math.round(prediction.prediction.completionRate)}%
          </span>
        </div>
        <div>
          <span className="text-gray-600">Confidence:</span>
          <span className={`ml-1 font-semibold ${getScoreColor(prediction.prediction.confidence)}`}>
            {Math.round(prediction.prediction.confidence)}%
          </span>
        </div>
        <div>
          <span className="text-gray-600">Optimal Time:</span>
          <span className="ml-1 font-semibold text-blue-600">
            {prediction.prediction.optimalTimes[0] || 'Flexible'}
          </span>
        </div>
      </div>
    </div>
  );
}

function ExperimentsList({ userId }: { userId: string }) {
  const [experiments, setExperiments] = useState<any[]>([]);

  useEffect(() => {
    loadExperiments();
  }, [userId]);

  const loadExperiments = async () => {
    try {
      const response = await api.getUserExperiments();
      setExperiments(response.experiments || []);
    } catch (error) {
      console.error('Failed to load experiments:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Your Experiments</h3>
        <button
          onClick={() => {/* Design experiment modal */}}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + Design Experiment
        </button>
      </div>

      {experiments.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">No experiments yet.</p>
          <p className="text-sm text-gray-500">Experiments help you scientifically test different habit strategies.</p>
        </div>
      ) : (
        experiments.map((experiment) => (
          <div
            key={experiment.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{experiment.experimentName}</h4>
                <p className="text-sm text-gray-600">{experiment.hypothesis}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                experiment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                experiment.status === 'RUNNING' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {experiment.status}
              </span>
            </div>

            {experiment.status === 'COMPLETED' && experiment.results && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-gray-700">
                  <strong>Result:</strong> {experiment.results.hypothesisSupported ? 'Hypothesis Supported' : 'Hypothesis Not Supported'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Confidence: {Math.round(experiment.results.confidence)}% |
                  Effect Size: {experiment.results.effectSize.toFixed(2)} |
                  Statistical Significance: {Math.round(experiment.results.statisticalSignificance)}%
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
