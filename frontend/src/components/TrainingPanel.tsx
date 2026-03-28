
interface TrainingPlan {
  weeklySchedule?: Record<string, { type: string; focus: string; duration: number }>;
  exercises?: Array<{
    muscleGroup: string;
    exercises: Array<{ name: string; sets: number; reps: string; rest: string; notes: string }>;
    priority: string;
  }>;
  vTaperFocus?: string[];
  thingsToAvoid?: string[];
  progressionStrategy?: string;
  formGuidance?: Record<string, string>;
}

interface TrainingPanelProps {
  plan: TrainingPlan;
}

export default function TrainingPanel({ plan }: TrainingPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <h3 className="text-xl font-bold text-green-400 mb-4">🎯 V-Taper Priority Exercises</h3>
        <div className="flex flex-wrap gap-2">
          {plan.vTaperFocus?.map((exercise, i) => (
            <span key={i} className="badge bg-green-500/20 text-green-300 border border-green-500/30">
              {exercise}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-blue-400 mb-4">📅 Weekly Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.weeklySchedule &&
            Object.entries(plan.weeklySchedule).map(([day, workout]) => (
              <div key={day} className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-white capitalize">{day}</h4>
                <p className="text-green-400 text-sm">{workout.type}</p>
                <p className="text-gray-300 text-sm">{workout.focus}</p>
                <p className="text-gray-500 text-xs">{workout.duration} min</p>
              </div>
            ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-purple-400 mb-4">💪 Exercise Library</h3>
        <div className="space-y-4">
          {plan.exercises?.map((group, i) => (
            <div key={i}>
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                {group.muscleGroup}
                <span
                  className={`badge text-xs ${
                    group.priority === 'high'
                      ? 'bg-red-500/20 text-red-300'
                      : group.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-gray-500/20 text-gray-300'
                  }`}
                >
                  {group.priority}
                </span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="text-left py-2">Exercise</th>
                      <th className="text-center py-2">Sets</th>
                      <th className="text-center py-2">Reps</th>
                      <th className="text-center py-2">Rest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.exercises.map((ex, j) => (
                      <tr key={j} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-2 text-white">{ex.name}</td>
                        <td className="py-2 text-center text-gray-300">{ex.sets}</td>
                        <td className="py-2 text-center text-gray-300">{ex.reps}</td>
                        <td className="py-2 text-center text-gray-300">{ex.rest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {plan.thingsToAvoid && plan.thingsToAvoid.length > 0 && (
        <div className="card border-red-500/30">
          <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Common Mistakes to Avoid</h3>
          <ul className="space-y-2">
            {plan.thingsToAvoid.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-red-400 mt-1">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.progressionStrategy && (
        <div className="card">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">📈 Progression Strategy</h3>
          <p className="text-gray-300">{plan.progressionStrategy}</p>
        </div>
      )}
    </div>
  );
}
