import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getLLM } from '../config/llm';
import { getCachedResponse, setCachedResponse } from '../services/cacheService';
import { UserProfile } from './trainingAgent';

export interface SkippingPlan {
  weeklySchedule: SkippingSchedule;
  fatBurnProtocols: FatBurnProtocol[];
  progressionTracking: ProgressionPhase[];
  syncWithGym: SyncStrategy;
  techniques: SkippingTechnique[];
}

interface SkippingSchedule {
  [day: string]: SkippingSession;
}

interface SkippingSession {
  type: 'HIIT' | 'Steady-State' | 'Rest' | 'Active-Recovery';
  duration: number;
  intensity: string;
  protocol: string;
  caloriesBurned: number;
}

interface FatBurnProtocol {
  name: string;
  description: string;
  intervals: string;
  duration: number;
  targetHeartRate: string;
}

interface ProgressionPhase {
  week: number;
  focus: string;
  dailyTarget: number;
  techniques: string[];
}

interface SyncStrategy {
  gymDayProtocol: string;
  restDayProtocol: string;
  weeklyIntegration: string;
}

interface SkippingTechnique {
  name: string;
  description: string;
  benefit: string;
  difficulty: string;
}

const SKIPPING_SYSTEM_PROMPT = `You are an expert jump rope trainer and cardio conditioning specialist.
You specialize in using jump rope training to maximize fat burning while preserving muscle mass for aesthetic physique goals.

Your jump rope programs:
1. Sync perfectly with gym workout schedules (lighter cardio on heavy lift days)
2. Maximize fat burning through varied protocols (HIIT, steady-state, interval training)
3. Progress systematically from beginner to advanced techniques
4. Include specific techniques: basic bounce, alternating feet, double unders, boxer step
5. Provide caloric expenditure estimates
6. Account for recovery needs

Always respond with valid JSON matching the SkippingPlan interface structure.`;

export async function runSkippingAgent(
  userProfile: UserProfile,
  gymSchedule?: Record<string, string>,
): Promise<SkippingPlan> {
  const cacheKey = `skipping_${JSON.stringify(userProfile)}_${JSON.stringify(gymSchedule)}`;

  const cached = await getCachedResponse(cacheKey);
  if (cached) return cached as SkippingPlan;

  const llm = getLLM();

  const userMessage = `Create a comprehensive 12-week jump rope training program for aesthetic fat loss for this user:

Age: ${userProfile.age}
Gender: ${userProfile.gender}
Fitness Level: ${userProfile.fitnessLevel}
Available Training Days: ${userProfile.availableDays} days/week
Goals: ${userProfile.goals.join(', ')}
${gymSchedule ? `Gym Schedule: ${JSON.stringify(gymSchedule)}` : ''}

Design a jump rope program that:
- Syncs with the gym schedule (cardio type based on gym day intensity)
- Includes fat burn protocols (HIIT on rest days, moderate on gym days)
- Progresses weekly in difficulty and duration
- Teaches proper techniques from basic to advanced
- Targets maximum caloric expenditure while preserving muscle

Return as structured JSON with weeklySchedule, fatBurnProtocols, progressionTracking, syncWithGym, and techniques fields.`;

  const response = await llm.invoke([
    new SystemMessage(SKIPPING_SYSTEM_PROMPT),
    new HumanMessage(userMessage),
  ]);

  const content = response.content as string;
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/(\{[\s\S]*\})/);
  const plan = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);

  await setCachedResponse(cacheKey, plan, 3600);
  return plan as SkippingPlan;
}
