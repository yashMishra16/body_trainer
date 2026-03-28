import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getLLM } from '../config/llm';
import { getCachedResponse, setCachedResponse } from '../services/cacheService';

export interface UserProfile {
  age: number;
  gender: string;
  fitnessLevel: string;
  goals: string[];
  availableDays: number;
  equipmentAccess: string;
  injuries?: string[];
}

export interface TrainingPlan {
  weeklySchedule: WeeklySchedule;
  exercises: ExerciseGroup[];
  progressionStrategy: string;
  formGuidance: Record<string, string>;
  thingsToAvoid: string[];
  vTaperFocus: string[];
}

interface WeeklySchedule {
  [day: string]: DayWorkout;
}

interface DayWorkout {
  type: string;
  focus: string;
  duration: number;
  exercises: string[];
}

interface ExerciseGroup {
  muscleGroup: string;
  exercises: Exercise[];
  priority: 'high' | 'medium' | 'low';
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

const TRAINING_SYSTEM_PROMPT = `You are an elite aesthetic physique trainer with 15+ years of experience.
Your expertise is in creating gym programs specifically for aesthetic goals: V-taper, muscle definition, symmetry, and proportion.

When creating training plans:
1. Prioritize V-taper development (wide shoulders, lat width, narrow waist)
2. Include specific rep ranges for muscle definition (8-15 reps for hypertrophy, 15-20 for definition)
3. Provide detailed form guidance to maximize muscle engagement
4. Clearly state what NOT to do to avoid common mistakes
5. Structure workouts for progressive overload
6. Account for the user's fitness level and available training days

Always respond with valid JSON matching the TrainingPlan interface structure.`;

export async function runTrainingAgent(userProfile: UserProfile): Promise<TrainingPlan> {
  const cacheKey = `training_${JSON.stringify(userProfile)}`;

  const cached = await getCachedResponse(cacheKey);
  if (cached) return cached as TrainingPlan;

  const llm = getLLM();

  const userMessage = `Create a comprehensive 12-week gym training plan for an aesthetic physique for this user:

Age: ${userProfile.age}
Gender: ${userProfile.gender}
Fitness Level: ${userProfile.fitnessLevel}
Goals: ${userProfile.goals.join(', ')}
Available Training Days: ${userProfile.availableDays} days/week
Equipment Access: ${userProfile.equipmentAccess}
${userProfile.injuries?.length ? `Injuries/Limitations: ${userProfile.injuries.join(', ')}` : ''}

Create a detailed training plan focused on aesthetic development with:
- Weekly schedule breakdown
- V-taper priority exercises (shoulder width, lat development)
- Rep ranges optimized for definition and muscle growth
- Form guidance for key exercises
- Common mistakes to avoid
- Progression strategy

Return as structured JSON with weeklySchedule, exercises, progressionStrategy, formGuidance, thingsToAvoid, and vTaperFocus fields.`;

  const response = await llm.invoke([
    new SystemMessage(TRAINING_SYSTEM_PROMPT),
    new HumanMessage(userMessage),
  ]);

  const content = response.content as string;
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/(\{[\s\S]*\})/);
  const plan = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);

  await setCachedResponse(cacheKey, plan, 3600);
  return plan as TrainingPlan;
}
