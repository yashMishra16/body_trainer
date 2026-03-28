import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getLLM } from '../config/llm';
import { getCachedResponse, setCachedResponse } from '../services/cacheService';

export interface NutritionProfile {
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  goals: string[];
  dietType: string;
  allergies?: string[];
}

export interface NutritionPlan {
  tdee: number;
  targetCalories: number;
  macros: MacroTargets;
  mealTiming: MealTiming;
  mealPlan: WeeklyMealPlan;
  supplementStack: Supplement[];
  hydrationPlan: HydrationPlan;
  foodsToEat: FoodCategory[];
  foodsToAvoid: string[];
}

interface MacroTargets {
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

interface MealTiming {
  preWorkout: string;
  postWorkout: string;
  mealFrequency: number;
  intermittentFasting?: string;
}

interface WeeklyMealPlan {
  [day: string]: DayMeals;
}

interface DayMeals {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  totalCalories: number;
}

interface Meal {
  name: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
}

interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  benefit: string;
  priority: 'essential' | 'recommended' | 'optional';
}

interface HydrationPlan {
  dailyTargetLiters: number;
  electrolyteStrategy: string;
  preWorkoutHydration: string;
  postWorkoutHydration: string;
}

interface FoodCategory {
  category: string;
  foods: string[];
  benefit: string;
}

const NUTRITION_SYSTEM_PROMPT = `You are a certified sports nutritionist and dietitian specializing in aesthetic physique development.
You create personalized nutrition plans using evidence-based approaches to body recomposition.

Your nutrition plans:
1. Calculate accurate TDEE using Mifflin-St Jeor or Harris-Benedict formulas
2. Set caloric targets appropriate for goals (deficit for fat loss, surplus for muscle gain, maintenance for recomp)
3. Optimize macros for muscle preservation and fat loss (high protein: 1g-1.2g per pound of bodyweight)
4. Time nutrients strategically around workouts
5. Account for diet preferences (vegan, vegetarian, keto, paleo, standard)
6. Include practical meal plans with easy-to-prepare meals
7. Recommend evidence-based supplements only

Always respond with valid JSON matching the NutritionPlan interface structure.`;

export async function runNutritionAgent(nutritionProfile: NutritionProfile): Promise<NutritionPlan> {
  const cacheKey = `nutrition_${JSON.stringify(nutritionProfile)}`;

  const cached = await getCachedResponse(cacheKey);
  if (cached) return cached as NutritionPlan;

  const llm = getLLM();

  const userMessage = `Create a comprehensive nutrition plan for aesthetic physique development for this user:

Age: ${nutritionProfile.age}
Gender: ${nutritionProfile.gender}
Height: ${nutritionProfile.heightCm}cm
Weight: ${nutritionProfile.weightKg}kg
Activity Level: ${nutritionProfile.activityLevel}
Goals: ${nutritionProfile.goals.join(', ')}
Diet Type: ${nutritionProfile.dietType}
${nutritionProfile.allergies?.length ? `Allergies: ${nutritionProfile.allergies.join(', ')}` : ''}

Calculate and provide:
- Accurate TDEE calculation
- Caloric targets and macro breakdown
- Strategic meal timing around workouts
- 7-day sample meal plan specific to their diet type
- Evidence-based supplement recommendations
- Hydration strategy
- Foods to prioritize and foods to avoid

Return as structured JSON with tdee, targetCalories, macros, mealTiming, mealPlan, supplementStack, hydrationPlan, foodsToEat, and foodsToAvoid fields.`;

  const response = await llm.invoke([
    new SystemMessage(NUTRITION_SYSTEM_PROMPT),
    new HumanMessage(userMessage),
  ]);

  const content = response.content as string;
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/(\{[\s\S]*\})/);
  const plan = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);

  await setCachedResponse(cacheKey, plan, 3600);
  return plan as NutritionPlan;
}
