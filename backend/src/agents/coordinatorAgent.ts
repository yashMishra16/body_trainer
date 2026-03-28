import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getLLM } from '../config/llm';
import { getCachedResponse, setCachedResponse } from '../services/cacheService';
import { runTrainingAgent, UserProfile, TrainingPlan } from './trainingAgent';
import { runSkippingAgent, SkippingPlan } from './skippingAgent';
import { runNutritionAgent, NutritionProfile, NutritionPlan } from './nutritionAgent';
import { runRecoveryAgent, RecoveryPlan } from './recoveryAgent';
import { runMindsetAgent, MindsetPlan } from './mindsetAgent';

export interface BlueprintInput {
  userProfile: UserProfile;
  nutritionProfile: NutritionProfile;
}

export interface Blueprint90Day {
  userId?: string;
  generatedAt: string;
  userSummary: string;
  trainingPlan: TrainingPlan;
  skippingPlan: SkippingPlan;
  nutritionPlan: NutritionPlan;
  recoveryPlan: RecoveryPlan;
  mindsetPlan: MindsetPlan;
  synthesis: BlueprintSynthesis;
  weeklyIntegration: WeeklyIntegration[];
  successProbability: SuccessAssessment;
}

interface BlueprintSynthesis {
  overview: string;
  keyPriorities: string[];
  dailyRoutine: DailyRoutine;
  weeklyStructure: string;
  criticalSuccessFactors: string[];
  potentialChallenges: PotentialChallenge[];
}

interface DailyRoutine {
  morning: string[];
  preWorkout: string[];
  workout: string[];
  postWorkout: string[];
  evening: string[];
  bedtime: string[];
}

interface PotentialChallenge {
  challenge: string;
  likelihood: 'high' | 'medium' | 'low';
  mitigation: string;
}

interface WeeklyIntegration {
  week: number;
  trainingFocus: string;
  nutritionPhase: string;
  cardioProtocol: string;
  recoveryPriority: string;
  mindsetFocus: string;
  keyActions: string[];
}

interface SuccessAssessment {
  score: number;
  factors: string[];
  risks: string[];
  recommendation: string;
}

const COORDINATOR_SYSTEM_PROMPT = `You are the Master Aesthetic Physique Coach and Blueprint Synthesizer.
You receive detailed plans from 5 specialized agents (Training, Skipping/Cardio, Nutrition, Recovery, Mindset)
and synthesize them into a cohesive, conflict-free 90-Day Blueprint.

Your synthesis role:
1. Identify and resolve conflicts between agent recommendations
2. Create a unified daily routine that integrates all components
3. Build a progressive 12-week integration strategy
4. Provide an honest success probability assessment
5. Highlight the critical few actions that will make or break the transformation
6. Make the complex simple - the user needs clarity, not overwhelm

The best physique transformation plans are:
- Simple enough to follow consistently
- Progressive enough to drive continuous adaptation
- Balanced enough to support recovery and sustainability
- Specific enough to produce aesthetic results

Always respond with valid JSON for the synthesis and weeklyIntegration fields.`;

export async function runCoordinatorAgent(input: BlueprintInput): Promise<Blueprint90Day> {
  const cacheKey = `coordinator_${JSON.stringify(input)}`;

  const cached = await getCachedResponse(cacheKey);
  if (cached) return cached as Blueprint90Day;

  console.log('🏋️ Running Training Agent...');
  const trainingPlan = await runTrainingAgent(input.userProfile);

  console.log('🪢 Running Skipping Agent...');
  const skippingPlan = await runSkippingAgent(
    input.userProfile,
    trainingPlan.weeklySchedule as unknown as Record<string, string>,
  );

  console.log('🥗 Running Nutrition Agent...');
  const nutritionPlan = await runNutritionAgent(input.nutritionProfile);

  console.log('😴 Running Recovery Agent...');
  const recoveryPlan = await runRecoveryAgent(input.userProfile);

  console.log('🧠 Running Mindset Agent...');
  const mindsetPlan = await runMindsetAgent(input.userProfile);

  console.log('🎯 Synthesizing Blueprint...');
  const llm = getLLM();

  const synthesisMessage = `You have received plans from 5 specialized agents. Synthesize them into a cohesive 90-Day Blueprint.

USER PROFILE:
- Age: ${input.userProfile.age}, Gender: ${input.userProfile.gender}
- Fitness Level: ${input.userProfile.fitnessLevel}
- Goals: ${input.userProfile.goals.join(', ')}
- Training Days: ${input.userProfile.availableDays}/week

TRAINING PLAN SUMMARY:
${JSON.stringify(trainingPlan.vTaperFocus)}

SKIPPING PLAN SUMMARY:
${JSON.stringify(skippingPlan.syncWithGym)}

NUTRITION PLAN SUMMARY:
- Daily Calories: ${nutritionPlan.targetCalories}
- Protein: ${nutritionPlan.macros?.proteinG}g

RECOVERY PLAN SUMMARY:
${JSON.stringify(recoveryPlan.sleepOptimization?.targetHours)} hours sleep target

MINDSET PLAN SUMMARY:
${JSON.stringify(mindsetPlan.honestAssessment?.week4Realistic)}

Create a synthesis with:
1. Overview paragraph tying everything together
2. Key priorities (top 5 actions for success)
3. Integrated daily routine
4. Weekly structure description
5. Critical success factors
6. Potential challenges with mitigations
7. 12-week integration timeline (weekly focus areas)
8. Success probability score (0-100) with factors

Return JSON with synthesis and weeklyIntegration (array of 12 objects) fields.`;

  const response = await llm.invoke([
    new SystemMessage(COORDINATOR_SYSTEM_PROMPT),
    new HumanMessage(synthesisMessage),
  ]);

  const content = response.content as string;
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/(\{[\s\S]*\})/);
  const synthesisResult = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);

  const blueprint: Blueprint90Day = {
    generatedAt: new Date().toISOString(),
    userSummary: `${input.userProfile.fitnessLevel} ${input.userProfile.gender}, age ${input.userProfile.age}, targeting: ${input.userProfile.goals.join(', ')}`,
    trainingPlan,
    skippingPlan,
    nutritionPlan,
    recoveryPlan,
    mindsetPlan,
    synthesis: synthesisResult.synthesis,
    weeklyIntegration: synthesisResult.weeklyIntegration,
    successProbability: synthesisResult.successProbability || {
      score: 75,
      factors: ['Consistent training', 'Proper nutrition'],
      risks: ['Inconsistency', 'Poor recovery'],
      recommendation: 'Focus on building habits in the first 4 weeks',
    },
  };

  await setCachedResponse(cacheKey, blueprint, 7200);
  return blueprint;
}
