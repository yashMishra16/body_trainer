
interface MacroTargets {
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

interface NutritionPlan {
  tdee?: number;
  targetCalories?: number;
  macros?: MacroTargets;
  mealTiming?: { preWorkout: string; postWorkout: string; mealFrequency: number };
  supplementStack?: Array<{ name: string; dosage: string; timing: string; benefit: string; priority: string }>;
  foodsToEat?: Array<{ category: string; foods: string[]; benefit: string }>;
  foodsToAvoid?: string[];
}

interface NutritionPanelProps {
  plan: NutritionPlan;
}

function MacroBar({ label, grams, percent, color }: { label: string; grams: number; percent: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-medium">{grams}g ({percent}%)</span>
      </div>
      <div className="bg-gray-700 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function NutritionPanel({ plan }: NutritionPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">🔥 Calorie Targets</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Maintenance (TDEE)</span>
              <span className="text-white font-bold text-xl">{plan.tdee?.toLocaleString()} cal</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-700 pt-3">
              <span className="text-gray-400">Your Daily Target</span>
              <span className="text-green-400 font-bold text-2xl">{plan.targetCalories?.toLocaleString()} cal</span>
            </div>
            <div className="text-sm text-gray-500">
              {plan.tdee && plan.targetCalories && plan.targetCalories < plan.tdee
                ? `${plan.tdee - plan.targetCalories} calorie deficit for fat loss`
                : plan.tdee && plan.targetCalories && plan.targetCalories > plan.tdee
                  ? `${plan.targetCalories - plan.tdee} calorie surplus for muscle gain`
                  : 'Maintenance calories for recomposition'}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-blue-400 mb-4">⚖️ Macronutrients</h3>
          {plan.macros && (
            <div className="space-y-4">
              <MacroBar label="Protein" grams={plan.macros.proteinG} percent={plan.macros.proteinPercent} color="bg-red-500" />
              <MacroBar label="Carbohydrates" grams={plan.macros.carbsG} percent={plan.macros.carbsPercent} color="bg-blue-500" />
              <MacroBar label="Fats" grams={plan.macros.fatG} percent={plan.macros.fatPercent} color="bg-yellow-500" />
            </div>
          )}
        </div>
      </div>

      {plan.mealTiming && (
        <div className="card">
          <h3 className="text-xl font-bold text-green-400 mb-4">⏰ Meal Timing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-1">Meals Per Day</h4>
              <p className="text-2xl font-bold text-white">{plan.mealTiming.mealFrequency}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-1">Pre-Workout</h4>
              <p className="text-white text-sm">{plan.mealTiming.preWorkout}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-1">Post-Workout</h4>
              <p className="text-white text-sm">{plan.mealTiming.postWorkout}</p>
            </div>
          </div>
        </div>
      )}

      {plan.supplementStack && plan.supplementStack.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-purple-400 mb-4">💊 Supplement Stack</h3>
          <div className="space-y-3">
            {plan.supplementStack.map((supp, i) => (
              <div key={i} className="flex items-start gap-4 bg-gray-800 rounded-lg p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{supp.name}</span>
                    <span
                      className={`badge text-xs ${
                        supp.priority === 'essential'
                          ? 'bg-red-500/20 text-red-300'
                          : supp.priority === 'recommended'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {supp.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{supp.benefit}</p>
                </div>
                <div className="text-right text-sm">
                  <div className="text-white">{supp.dosage}</div>
                  <div className="text-gray-400">{supp.timing}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plan.foodsToEat && (
          <div className="card">
            <h3 className="text-xl font-bold text-green-400 mb-4">✅ Foods to Prioritize</h3>
            <div className="space-y-3">
              {plan.foodsToEat.map((cat, i) => (
                <div key={i}>
                  <h4 className="font-semibold text-white mb-1">{cat.category}</h4>
                  <p className="text-xs text-green-400 mb-2">{cat.benefit}</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.foods.map((food, j) => (
                      <span key={j} className="badge bg-gray-700 text-gray-300 text-xs">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {plan.foodsToAvoid && (
          <div className="card border-red-500/20">
            <h3 className="text-xl font-bold text-red-400 mb-4">❌ Foods to Avoid</h3>
            <ul className="space-y-2">
              {plan.foodsToAvoid.map((food, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-red-400">✗</span>
                  {food}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
