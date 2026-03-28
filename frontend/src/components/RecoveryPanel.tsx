
interface RecoveryPlan {
  sleepOptimization?: {
    targetHours: number;
    sleepWindowStart: string;
    sleepWindowEnd: string;
    sleepHygieneProtocol: string[];
    supplementsForSleep: string[];
  };
  hormoneManagement?: {
    testosteroneOptimization: string[];
    cortisolManagement: string[];
    growthHormoneStrategies: string[];
  };
  postureCorrection?: {
    commonImbalances: string[];
    correctiveExercises: Array<{ name: string; sets: number; reps: string; frequency: string; targetMuscle: string }>;
  };
  supplementRecommendations?: Array<{
    name: string;
    dosage: string;
    timing: string;
    benefit: string;
    evidence: string;
  }>;
  activeRecovery?: {
    foamRollingRoutine: string[];
    stretchingProtocol: string[];
    lightCardioOptions: string[];
  };
}

interface RecoveryPanelProps {
  plan: RecoveryPlan;
}

export default function RecoveryPanel({ plan }: RecoveryPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {plan.sleepOptimization && (
        <div className="card">
          <h3 className="text-xl font-bold text-indigo-400 mb-4">😴 Sleep Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-400">{plan.sleepOptimization.targetHours}h</div>
              <div className="text-gray-400 text-sm">Target Sleep</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{plan.sleepOptimization.sleepWindowStart}</div>
              <div className="text-gray-400 text-sm">Bedtime</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{plan.sleepOptimization.sleepWindowEnd}</div>
              <div className="text-gray-400 text-sm">Wake Time</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Sleep Hygiene Protocol</h4>
              <ul className="space-y-1">
                {plan.sleepOptimization.sleepHygieneProtocol.map((item, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-indigo-400 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {plan.sleepOptimization.supplementsForSleep.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Sleep Supplements</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.sleepOptimization.supplementsForSleep.map((supp, i) => (
                    <span key={i} className="badge bg-indigo-500/20 text-indigo-300">
                      {supp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {plan.hormoneManagement && (
        <div className="card">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">⚡ Hormone Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Testosterone</h4>
              <ul className="space-y-1">
                {plan.hormoneManagement.testosteroneOptimization.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-green-400">↑</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">Cortisol Management</h4>
              <ul className="space-y-1">
                {plan.hormoneManagement.cortisolManagement.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-red-400">↓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Growth Hormone</h4>
              <ul className="space-y-1">
                {plan.hormoneManagement.growthHormoneStrategies.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-blue-400">↑</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {plan.postureCorrection && (
        <div className="card">
          <h3 className="text-xl font-bold text-orange-400 mb-4">🧍 Posture Correction</h3>
          <div className="mb-4">
            <h4 className="font-semibold text-gray-300 mb-2">Common Imbalances to Fix</h4>
            <div className="flex flex-wrap gap-2">
              {plan.postureCorrection.commonImbalances.map((issue, i) => (
                <span key={i} className="badge bg-orange-500/20 text-orange-300">
                  {issue}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2">Exercise</th>
                  <th className="text-center py-2">Sets</th>
                  <th className="text-center py-2">Reps</th>
                  <th className="text-left py-2">Frequency</th>
                  <th className="text-left py-2">Target</th>
                </tr>
              </thead>
              <tbody>
                {plan.postureCorrection.correctiveExercises.map((ex, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 text-white">{ex.name}</td>
                    <td className="py-2 text-center text-gray-300">{ex.sets}</td>
                    <td className="py-2 text-center text-gray-300">{ex.reps}</td>
                    <td className="py-2 text-gray-300">{ex.frequency}</td>
                    <td className="py-2 text-gray-300">{ex.targetMuscle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {plan.supplementRecommendations && (
        <div className="card">
          <h3 className="text-xl font-bold text-green-400 mb-4">🧪 Recovery Supplements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.supplementRecommendations.map((supp, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">{supp.name}</span>
                  <span
                    className={`badge text-xs ${
                      supp.evidence === 'high'
                        ? 'bg-green-500/20 text-green-300'
                        : supp.evidence === 'moderate'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {supp.evidence} evidence
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{supp.benefit}</p>
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-400">{supp.dosage}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{supp.timing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
