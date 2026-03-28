import { useState } from 'react';
import TrainingPanel from './TrainingPanel';
import SkippingPanel from './SkippingPanel';
import NutritionPanel from './NutritionPanel';
import RecoveryPanel from './RecoveryPanel';
import MindsetPanel from './MindsetPanel';

interface Blueprint90DayProps {
  blueprint: {
    userSummary: string;
    generatedAt: string;
    trainingPlan: Record<string, unknown>;
    skippingPlan: Record<string, unknown>;
    nutritionPlan: Record<string, unknown>;
    recoveryPlan: Record<string, unknown>;
    mindsetPlan: Record<string, unknown>;
    synthesis?: {
      overview: string;
      keyPriorities: string[];
      criticalSuccessFactors: string[];
    };
    successProbability?: {
      score: number;
      factors: string[];
      recommendation: string;
    };
    weeklyIntegration?: Array<{
      week: number;
      trainingFocus: string;
      nutritionPhase: string;
      keyActions: string[];
    }>;
  };
}

type TabId = 'overview' | 'training' | 'skipping' | 'nutrition' | 'recovery' | 'mindset' | 'timeline';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '🎯' },
  { id: 'training', label: 'Training', icon: '💪' },
  { id: 'skipping', label: 'Cardio', icon: '🪢' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { id: 'recovery', label: 'Recovery', icon: '😴' },
  { id: 'mindset', label: 'Mindset', icon: '🧠' },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
];

export default function Blueprint90Day({ blueprint }: Blueprint90DayProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Your 90-Day Blueprint</h2>
            <p className="text-gray-400 mt-1">{blueprint.userSummary}</p>
          </div>
          {blueprint.successProbability && (
            <div className="text-center">
              <div
                className={`text-5xl font-bold ${
                  blueprint.successProbability.score >= 80
                    ? 'text-green-400'
                    : blueprint.successProbability.score >= 60
                      ? 'text-yellow-400'
                      : 'text-red-400'
                }`}
              >
                {blueprint.successProbability.score}%
              </div>
              <div className="text-gray-400 text-sm">Success Score</div>
            </div>
          )}
        </div>

        {blueprint.synthesis?.overview && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-300">{blueprint.synthesis.overview}</p>
          </div>
        )}

        {blueprint.synthesis?.keyPriorities && (
          <div className="mt-4">
            <h4 className="font-semibold text-white mb-2">🔑 Top Priorities</h4>
            <div className="flex flex-wrap gap-2">
              {blueprint.synthesis.keyPriorities.map((priority, i) => (
                <span key={i} className="badge bg-green-500/20 text-green-300 border border-green-500/30">
                  {i + 1}. {priority}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 mb-6 bg-gray-900 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-green-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {blueprint.successProbability && (
              <div className="card">
                <h3 className="text-xl font-bold text-green-400 mb-4">📊 Success Assessment</h3>
                <div className="mb-4">
                  <p className="text-gray-300">{blueprint.successProbability.recommendation}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Key Success Factors:</h4>
                  <ul className="space-y-1">
                    {blueprint.successProbability.factors.map((factor, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {blueprint.synthesis?.criticalSuccessFactors && (
              <div className="card">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">⭐ Critical Success Factors</h3>
                <ul className="space-y-2">
                  {blueprint.synthesis.criticalSuccessFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="bg-yellow-500/20 text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {activeTab === 'training' && (
          <TrainingPanel plan={blueprint.trainingPlan as Parameters<typeof TrainingPanel>[0]['plan']} />
        )}
        {activeTab === 'skipping' && (
          <SkippingPanel plan={blueprint.skippingPlan as Parameters<typeof SkippingPanel>[0]['plan']} />
        )}
        {activeTab === 'nutrition' && (
          <NutritionPanel plan={blueprint.nutritionPlan as Parameters<typeof NutritionPanel>[0]['plan']} />
        )}
        {activeTab === 'recovery' && (
          <RecoveryPanel plan={blueprint.recoveryPlan as Parameters<typeof RecoveryPanel>[0]['plan']} />
        )}
        {activeTab === 'mindset' && (
          <MindsetPanel plan={blueprint.mindsetPlan as Parameters<typeof MindsetPanel>[0]['plan']} />
        )}
        {activeTab === 'timeline' && blueprint.weeklyIntegration && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">📅 12-Week Integration Plan</h3>
            {blueprint.weeklyIntegration.map((week, i) => (
              <div key={i} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-green-500/20 text-green-400 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {week.week}
                  </span>
                  <div>
                    <div className="text-white font-semibold">Week {week.week}</div>
                    <div className="text-gray-400 text-sm">{week.trainingFocus}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Nutrition Phase</p>
                    <p className="text-sm text-gray-300">{week.nutritionPhase}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Key Actions</p>
                    <ul className="space-y-1">
                      {week.keyActions?.slice(0, 3).map((action, j) => (
                        <li key={j} className="text-sm text-gray-300">• {action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
