
interface MindsetPlan {
  honestAssessment?: {
    week4Realistic: string;
    week8Realistic: string;
    week12Realistic: string;
    commonMistakes: string[];
    successFactors: string[];
  };
  ninetyDayTimeline?: {
    month1: { weekRange: string; physicalChanges: string[]; fitnessImprovements: string[] };
    month2: { weekRange: string; physicalChanges: string[]; fitnessImprovements: string[] };
    month3: { weekRange: string; physicalChanges: string[]; fitnessImprovements: string[] };
  };
  plateauBusters?: Array<{ type: string; signs: string[]; solutions: string[]; priority: string }>;
  mindsetStrategies?: Array<{ name: string; description: string; howToUse: string; frequency: string }>;
  weeklyCheckIns?: { questions: string[]; celebrationMilestones: string[] };
}

interface MindsetPanelProps {
  plan: MindsetPlan;
}

export default function MindsetPanel({ plan }: MindsetPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {plan.honestAssessment && (
        <div className="card border-yellow-500/30">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">🎯 Honest Timeline Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Week 4', text: plan.honestAssessment.week4Realistic, color: 'text-blue-400' },
              { label: 'Week 8', text: plan.honestAssessment.week8Realistic, color: 'text-purple-400' },
              { label: 'Week 12', text: plan.honestAssessment.week12Realistic, color: 'text-green-400' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <h4 className={`font-bold ${item.color} mb-2`}>{item.label}</h4>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-400 mb-2">✅ Success Factors</h4>
              <ul className="space-y-1">
                {plan.honestAssessment.successFactors.map((factor, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">⚠️ Common Mistakes</h4>
              <ul className="space-y-1">
                {plan.honestAssessment.commonMistakes.map((mistake, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {plan.ninetyDayTimeline && (
        <div className="card">
          <h3 className="text-xl font-bold text-blue-400 mb-4">📅 90-Day Timeline</h3>
          <div className="space-y-4">
            {[
              { label: 'Month 1', data: plan.ninetyDayTimeline.month1, color: 'border-blue-500/50' },
              { label: 'Month 2', data: plan.ninetyDayTimeline.month2, color: 'border-purple-500/50' },
              { label: 'Month 3', data: plan.ninetyDayTimeline.month3, color: 'border-green-500/50' },
            ].map((month, i) => (
              <div key={i} className={`border-l-4 ${month.color} pl-4`}>
                <h4 className="font-bold text-white mb-1">{month.label} ({month.data.weekRange})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Physical Changes</p>
                    <ul className="space-y-1">
                      {month.data.physicalChanges.map((change, j) => (
                        <li key={j} className="text-sm text-gray-300">• {change}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Fitness Improvements</p>
                    <ul className="space-y-1">
                      {month.data.fitnessImprovements.map((imp, j) => (
                        <li key={j} className="text-sm text-gray-300">• {imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.plateauBusters && plan.plateauBusters.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-orange-400 mb-4">🔓 Plateau-Busting Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.plateauBusters.map((strategy, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{strategy.type}</h4>
                  <span
                    className={`badge text-xs ${
                      strategy.priority === 'high'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {strategy.priority} priority
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-gray-400 mb-1">Signs:</p>
                  <div className="flex flex-wrap gap-1">
                    {strategy.signs.map((sign, j) => (
                      <span key={j} className="badge bg-gray-700 text-gray-300 text-xs">{sign}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Solutions:</p>
                  <ul className="space-y-1">
                    {strategy.solutions.map((sol, j) => (
                      <li key={j} className="text-sm text-orange-300">→ {sol}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.mindsetStrategies && (
        <div className="card">
          <h3 className="text-xl font-bold text-purple-400 mb-4">🧠 Mindset Toolkit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.mindsetStrategies.map((tool, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{tool.name}</h4>
                  <span className="badge bg-purple-500/20 text-purple-300 text-xs">{tool.frequency}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{tool.description}</p>
                <p className="text-sm text-purple-300 italic">{tool.howToUse}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.weeklyCheckIns && (
        <div className="card">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">📋 Weekly Check-In Protocol</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Weekly Review Questions</h4>
              <ol className="space-y-2">
                {plan.weeklyCheckIns.questions.map((q, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    <span className="text-cyan-400 font-bold">{i + 1}.</span> {q}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">🎉 Celebration Milestones</h4>
              <ul className="space-y-2">
                {plan.weeklyCheckIns.celebrationMilestones.map((milestone, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-400">★</span>
                    {milestone}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
