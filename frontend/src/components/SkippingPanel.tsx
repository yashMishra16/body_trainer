
interface SkippingPlan {
  weeklySchedule?: Record<string, { type: string; duration: number; protocol: string; caloriesBurned: number }>;
  fatBurnProtocols?: Array<{ name: string; description: string; intervals: string; duration: number; targetHeartRate: string }>;
  techniques?: Array<{ name: string; description: string; benefit: string; difficulty: string }>;
  progressionTracking?: Array<{ week: number; focus: string; dailyTarget: number }>;
}

interface SkippingPanelProps {
  plan: SkippingPlan;
}

export default function SkippingPanel({ plan }: SkippingPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">🔥 Fat Burn Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.fatBurnProtocols?.map((protocol, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">{protocol.name}</h4>
              <p className="text-gray-300 text-sm mb-2">{protocol.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="badge bg-cyan-500/20 text-cyan-300">⏱ {protocol.duration} min</span>
                <span className="badge bg-orange-500/20 text-orange-300">💓 {protocol.targetHeartRate}</span>
                <span className="badge bg-purple-500/20 text-purple-300">{protocol.intervals}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-orange-400 mb-4">📅 Weekly Cardio Schedule</h3>
        <div className="space-y-3">
          {plan.weeklySchedule &&
            Object.entries(plan.weeklySchedule).map(([day, session]) => (
              <div key={day} className="flex items-center gap-4 bg-gray-800 rounded-lg p-3">
                <div className="w-24 text-gray-400 font-medium capitalize">{day}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge text-xs ${
                        session.type === 'HIIT'
                          ? 'bg-red-500/20 text-red-300'
                          : session.type === 'Rest'
                            ? 'bg-gray-500/20 text-gray-300'
                            : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {session.type}
                    </span>
                    <span className="text-sm text-gray-300">{session.protocol}</span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-white">{session.duration} min</div>
                  <div className="text-orange-400">~{session.caloriesBurned} cal</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-green-400 mb-4">🪢 Techniques to Master</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.techniques?.map((technique, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{technique.name}</h4>
                <span
                  className={`badge text-xs ${
                    technique.difficulty === 'beginner'
                      ? 'bg-green-500/20 text-green-300'
                      : technique.difficulty === 'intermediate'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {technique.difficulty}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-2">{technique.description}</p>
              <p className="text-cyan-400 text-xs">✓ {technique.benefit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-purple-400 mb-4">📈 12-Week Progression</h3>
        <div className="space-y-2">
          {plan.progressionTracking?.map((phase, i) => (
            <div key={i} className="flex items-center gap-4 bg-gray-800 rounded-lg p-3">
              <div className="w-16 text-center">
                <span className="text-sm font-bold text-purple-400">Wk {phase.week}</span>
              </div>
              <div className="flex-1 text-sm text-gray-300">{phase.focus}</div>
              <div className="text-right">
                <span className="text-white font-semibold">{phase.dailyTarget}</span>
                <span className="text-gray-400 text-xs"> min/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
