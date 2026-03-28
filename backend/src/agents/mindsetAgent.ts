import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getLLM } from '../config/llm';
import { getCachedResponse, setCachedResponse } from '../services/cacheService';
import { UserProfile } from './trainingAgent';

export interface MindsetPlan {
  ninetyDayTimeline: MilestoneTimeline;
  progressTracking: ProgressSystem;
  plateauBusters: PlateauStrategy[];
  mindsetStrategies: MindsetTool[];
  weeklyCheckIns: CheckInProtocol;
  honestAssessment: HonestMilestones;
  motivationSystem: MotivationFramework;
}

interface MilestoneTimeline {
  month1: Milestone;
  month2: Milestone;
  month3: Milestone;
  weeklyExpectations: Record<string, string>;
}

interface Milestone {
  weekRange: string;
  physicalChanges: string[];
  fitnessImprovements: string[];
  nutritionHabits: string[];
  mindsetGoals: string[];
  realisticExpectations: string;
}

interface ProgressSystem {
  metrics: ProgressMetric[];
  trackingFrequency: string;
  photoProtocol: string;
  measurementGuide: string[];
  progressIndicators: string[];
}

interface ProgressMetric {
  name: string;
  howToMeasure: string;
  frequency: string;
  targetTrend: string;
}

interface PlateauStrategy {
  type: string;
  signs: string[];
  solutions: string[];
  timeToImplement: string;
  priority: 'high' | 'medium' | 'low';
}

interface MindsetTool {
  name: string;
  description: string;
  howToUse: string;
  frequency: string;
  benefit: string;
}

interface CheckInProtocol {
  questions: string[];
  adjustmentTriggers: string[];
  celebrationMilestones: string[];
  warningSignals: string[];
}

interface HonestMilestones {
  week4Realistic: string;
  week8Realistic: string;
  week12Realistic: string;
  commonMistakes: string[];
  successFactors: string[];
}

interface MotivationFramework {
  identityBasedHabits: string[];
  rewardSystem: string[];
  communityStrategies: string[];
  setbackRecovery: string[];
}

const MINDSET_SYSTEM_PROMPT = `You are an elite sports psychologist and physique transformation coach.
You specialize in the psychological and timeline aspects of aesthetic physique development.

Your mindset plans focus on:
1. Realistic, honest milestone assessment (no false promises - real results take time)
2. Evidence-based progress tracking systems
3. Plateau identification and busting strategies
4. Mindset tools from sports psychology (visualization, identity-based habits, etc.)
5. Weekly check-in protocols to stay on track
6. Motivation systems that survive the inevitable tough periods

Be HONEST about timelines. Do NOT promise unrealistic results. Most aesthetic improvements take 3-6 months to be noticeable to others.

Always respond with valid JSON matching the MindsetPlan interface structure.`;

export async function runMindsetAgent(userProfile: UserProfile): Promise<MindsetPlan> {
  const cacheKey = `mindset_${JSON.stringify(userProfile)}`;

  const cached = await getCachedResponse(cacheKey);
  if (cached) return cached as MindsetPlan;

  const llm = getLLM();

  const userMessage = `Create a comprehensive mindset and progress tracking plan for a 90-day aesthetic physique transformation for this user:

Age: ${userProfile.age}
Gender: ${userProfile.gender}
Fitness Level: ${userProfile.fitnessLevel}
Goals: ${userProfile.goals.join(', ')}

Design a mindset and timeline plan that includes:
- HONEST 90-day milestone timeline (realistic expectations by week 4, 8, 12)
- Progress tracking system (what to measure, how often, photo protocol)
- Plateau-busting strategies (training, nutrition, and mental plateaus)
- Mindset tools and psychological strategies for consistency
- Weekly check-in protocol with adjustment triggers
- Motivation framework that works long-term

Be brutally honest about realistic timelines - users need to know it takes time.

Return as structured JSON with ninetyDayTimeline, progressTracking, plateauBusters, mindsetStrategies, weeklyCheckIns, honestAssessment, and motivationSystem fields.`;

  const response = await llm.invoke([
    new SystemMessage(MINDSET_SYSTEM_PROMPT),
    new HumanMessage(userMessage),
  ]);

  const content = response.content as string;
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/(\{[\s\S]*\})/);
  const plan = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(content);

  await setCachedResponse(cacheKey, plan, 3600);
  return plan as MindsetPlan;
}
