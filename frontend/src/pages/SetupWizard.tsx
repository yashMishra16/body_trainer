import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlueprint } from '../hooks/useAgent';
import Blueprint90Day from '../components/Blueprint90Day';

const fitnessLevels = ['beginner', 'intermediate', 'advanced'];
const goalOptions = ['muscle gain', 'fat loss', 'body recomposition', 'strength', 'aesthetics', 'V-taper'];
const dietTypes = ['standard', 'vegan', 'vegetarian', 'keto', 'paleo'];
const activityLevels = ['sedentary', 'lightly active', 'moderately active', 'very active', 'extremely active'];
const equipmentOptions = ['full gym', 'home gym', 'minimal equipment', 'bodyweight only'];

export default function SetupWizard() {
  const navigate = useNavigate();
  const { generateBlueprint, blueprint, isLoading, isError, error, agentStatus } = useBlueprint();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    gender: 'male',
    fitnessLevel: 'beginner',
    goals: ['aesthetics'],
    availableDays: 4,
    equipmentAccess: 'full gym',
    injuries: [] as string[],
    heightCm: 175,
    weightKg: 75,
    activityLevel: 'moderately active',
    dietType: 'standard',
    allergies: [] as string[],
  });

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleSubmit = () => {
    const userProfile = {
      age: formData.age,
      gender: formData.gender,
      fitnessLevel: formData.fitnessLevel,
      goals: formData.goals,
      availableDays: formData.availableDays,
      equipmentAccess: formData.equipmentAccess,
      injuries: formData.injuries,
    };

    const nutritionProfile = {
      age: formData.age,
      gender: formData.gender,
      heightCm: formData.heightCm,
      weightKg: formData.weightKg,
      activityLevel: formData.activityLevel,
      goals: formData.goals,
      dietType: formData.dietType,
      allergies: formData.allergies,
    };

    generateBlueprint({ userProfile, nutritionProfile });
  };

  if (blueprint) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              🏆 Your Personalized Blueprint
            </h1>
            <button onClick={() => navigate('/progress')} className="btn-secondary">
              Track Progress
            </button>
          </div>
          <Blueprint90Day blueprint={blueprint} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Body Trainer</h1>
          <p className="text-gray-400">5-Agent Aesthetic Physique System</p>
        </div>

        {isLoading ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-6 animate-pulse">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-4">Generating Your Blueprint</h2>
            <p className="text-gray-400 mb-8">Our 5 AI agents are analyzing your profile...</p>
            <div className="space-y-3 max-w-sm mx-auto">
              {[
                { id: 'training', label: '💪 Training Agent', status: agentStatus.training },
                { id: 'skipping', label: '🪢 Skipping Agent', status: agentStatus.skipping },
                { id: 'nutrition', label: '🥗 Nutrition Agent', status: agentStatus.nutrition },
                { id: 'recovery', label: '😴 Recovery Agent', status: agentStatus.recovery },
                { id: 'mindset', label: '🧠 Mindset Agent', status: agentStatus.mindset },
                { id: 'coordinator', label: '🎯 Coordinator Agent', status: agentStatus.coordinator },
              ].map(agent => (
                <div key={agent.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                  <span className="text-gray-300">{agent.label}</span>
                  <span
                    className={
                      agent.status === 'success'
                        ? 'text-green-400'
                        : agent.status === 'loading'
                          ? 'text-yellow-400 animate-pulse'
                          : agent.status === 'error'
                            ? 'text-red-400'
                            : 'text-gray-600'
                    }
                  >
                    {agent.status === 'success' ? '✓' : agent.status === 'loading' ? '◌' : agent.status === 'error' ? '✗' : '○'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map(s => (
                <Fragment key={s}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      s === step ? 'bg-green-500 text-white' : s < step ? 'bg-green-500/30 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 ${s < step ? 'bg-green-500' : 'bg-gray-700'}`} />}
                </Fragment>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Personal Profile</h2>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                  <input
                    className="input-field"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Age</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.age}
                      onChange={e => setFormData(p => ({ ...p, age: parseInt(e.target.value) }))}
                      min={16}
                      max={80}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Gender</label>
                    <select
                      className="input-field"
                      value={formData.gender}
                      onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.heightCm}
                      onChange={e => setFormData(p => ({ ...p, heightCm: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.weightKg}
                      onChange={e => setFormData(p => ({ ...p, weightKg: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Fitness Level</label>
                  <div className="flex gap-2">
                    {fitnessLevels.map(level => (
                      <button
                        key={level}
                        onClick={() => setFormData(p => ({ ...p, fitnessLevel: level }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          formData.fitnessLevel === level
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Training Setup</h2>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Goals (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {goalOptions.map(goal => (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`badge py-1.5 px-3 rounded-lg text-sm font-medium capitalize transition-colors cursor-pointer ${
                          formData.goals.includes(goal)
                            ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                            : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Training Days per Week: <span className="text-green-400">{formData.availableDays}</span>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={7}
                    value={formData.availableDays}
                    onChange={e => setFormData(p => ({ ...p, availableDays: parseInt(e.target.value) }))}
                    className="w-full accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>2 days</span>
                    <span>7 days</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Equipment Access</label>
                  <div className="grid grid-cols-2 gap-2">
                    {equipmentOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => setFormData(p => ({ ...p, equipmentAccess: option }))}
                        className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.equipmentAccess === option
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Nutrition & Lifestyle</h2>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Diet Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dietTypes.map(diet => (
                      <button
                        key={diet}
                        onClick={() => setFormData(p => ({ ...p, dietType: diet }))}
                        className={`py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          formData.dietType === diet
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Activity Level (outside gym)</label>
                  <select
                    className="input-field"
                    value={formData.activityLevel}
                    onChange={e => setFormData(p => ({ ...p, activityLevel: e.target.value }))}
                  >
                    {activityLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">📋 Ready to Generate!</h3>
                  <p className="text-sm text-gray-300">
                    Our 5 AI agents will create your personalized 90-day blueprint covering:
                    training, jump rope cardio, nutrition, recovery, and mindset.
                  </p>
                  <ul className="mt-2 text-sm text-gray-400 space-y-1">
                    <li>• This typically takes 60-90 seconds</li>
                    <li>• All plans are synced and optimized together</li>
                    <li>• Results are cached for quick future access</li>
                  </ul>
                </div>
                {isError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm">
                      {error instanceof Error ? error.message : 'Failed to generate blueprint. Please check your API keys.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              {step < 3 ? (
                <button onClick={() => setStep(s => s + 1)} className="btn-primary">
                  Next →
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn-primary" disabled={isLoading}>
                  🚀 Generate Blueprint
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
