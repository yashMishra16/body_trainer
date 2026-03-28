import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getLLM } from '../config/llm';
import { getCachedResponse, setCachedResponse } from '../services/cacheService';
import { UserProfile } from './trainingAgent';

export interface RecoveryPlan {
  sleepOptimization: SleepPlan;
  hormoneManagement: HormoneStrategy;
  postureCorrection: PosturePlan;
  supplementRecommendations: RecoverySupplement[];
  activeRecovery: ActiveRecoveryPlan;
  stressManagement: StressStrategy;
  weeklyRecoverySchedule: RecoverySchedule;
}

interface SleepPlan {
  targetHours: number;
  sleepWindowStart: string;
  sleepWindowEnd: string;
  sleepHygieneProtocol: string[];
  preSleepRoutine: string[];
  supplementsForSleep: string[];
}

interface HormoneStrategy {
  testosteroneOptimization: string[];
  cortisolManagement: string[];
  growthHormoneStrategies: string[];
  insulinSensitivity: string[];
}

interface PosturePlan {
  commonImbalances: string[];
  correctiveExercises: PostureExercise[];
  dailyMobilityRoutine: string[];
  ergonomicTips: string[];
}

interface PostureExercise {
  name: string;
  sets: number;
  reps: string;
  frequency: string;
  targetMuscle: string;
}

interface RecoverySupplement {
  name: string;
  dosage: string;
  timing: string;
  benefit: string;
  evidence: 'high' | 'moderate' | 'low';
}

interface ActiveRecoveryPlan {
  foamRollingRoutine: string[];
  stretchingProtocol: string[];
  lightCardioOptions: string[];
  coldTherapy?: string;
  heatTherapy?: string;
}

interface StressStrategy {
  breathingExercises: string[];
  mindfulnessPractices: string[];
  timeManagementTips: string[];
  recoveryDayActivities: string[];
}

interface RecoverySchedule {
  [day: string]: DayRecovery;
}

interface DayRecovery {
  priority: 'high' | 'medium' | 'low';
  activities: string[];
  duration: number;
  notes: string;
}

const RECOVERY_SYSTEM_PROMPT = `You are an elite sports recovery specialist and physiotherapist.
You optimize recovery for aesthetic physique development, hormone balance, and peak performance.

Your recovery plans focus on:
1. Sleep optimization (quality and quantity for maximum growth hormone release)
2. Natural hormone optimization (testosterone, cortisol, insulin sensitivity)
3. Posture correction (many lifters develop imbalances that hurt aesthetics)
4. Evidence-based supplement recommendations (magnesium, zinc, ashwagandha, etc.)
5. Active recovery strategies (foam rolling, stretching, light movement)
6. Stress management (cortisol spikes destroy muscle and increase fat storage)

Always respond with valid JSON matching the RecoveryPlan interface structure.`;

export async function runRecoveryAgent(userProfile: UserProfile): Promise<RecoveryPlan> {
  const cacheKey = `recovery_${JSON.stringify(userProfile)}`;

  const cached = await getCachedResponse(cacheKey);
  if (cached) return cached as RecoveryPlan;

  const llm = getLLM();

  const userMessage = `Create a comprehensive recovery and lifestyle optimization plan for aesthetic physique development for this user:

Age: ${userProfile.age}
Gender: ${userProfile.gender}
Fitness Level: ${userProfile.fitnessLevel}
Training Days: ${userProfile.availableDays} days/week
Goals: ${userProfile.goals.join(', ')}
${userProfile.injuries?.length ? `Injuries/Limitations: ${userProfile.injuries.join(', ')}` : ''}

Design a recovery plan covering:
- Optimal sleep schedule and sleep hygiene protocol
- Natural hormone optimization strategies
- Posture correction exercises (prioritizing aesthetic improvements)
- Evidence-based recovery supplements with dosing
- Active recovery routines for non-training days
- Stress management techniques
- Weekly recovery schedule

Return as structured JSON with sleepOptimization, hormoneManagement, postureCorrection, supplementRecommendations, activeRecovery, stressManagement, and weeklyRecoverySchedule fields.`;

  const response = await llm.invoke([
    new SystemMessage(RECOVERY_SYSTEM_PROMPT),
    new HumanMessage(userMessage),
  ]);

  const content = response.content as string;
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/(\{[\s\S]*\})/);
  const plan = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);

  await setCachedResponse(cacheKey, plan, 3600);
  return plan as RecoveryPlan;
}
