import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { runCoordinatorAgent, BlueprintInput } from '../agents/coordinatorAgent';
import { runTrainingAgent } from '../agents/trainingAgent';
import { runSkippingAgent } from '../agents/skippingAgent';
import { runNutritionAgent } from '../agents/nutritionAgent';
import { runRecoveryAgent } from '../agents/recoveryAgent';
import { runMindsetAgent } from '../agents/mindsetAgent';
import { saveBlueprint } from '../services/blueprintService';

const router = Router();

const UserProfileSchema = z.object({
  age: z.number().min(16).max(80),
  gender: z.string(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  goals: z.array(z.string()),
  availableDays: z.number().min(2).max(7),
  equipmentAccess: z.string(),
  injuries: z.array(z.string()).optional(),
});

const NutritionProfileSchema = z.object({
  age: z.number(),
  gender: z.string(),
  heightCm: z.number(),
  weightKg: z.number(),
  activityLevel: z.string(),
  goals: z.array(z.string()),
  dietType: z.string(),
  allergies: z.array(z.string()).optional(),
});

// Generate full 90-day blueprint
router.post('/blueprint', async (req: Request, res: Response) => {
  try {
    const { userProfile, nutritionProfile, userId } = req.body;

    const validatedUserProfile = UserProfileSchema.parse(userProfile);
    const validatedNutritionProfile = NutritionProfileSchema.parse(nutritionProfile);

    const input: BlueprintInput = {
      userProfile: validatedUserProfile,
      nutritionProfile: validatedNutritionProfile,
    };

    const blueprint = await runCoordinatorAgent(input);

    if (userId) {
      const saved = await saveBlueprint(userId, blueprint);
      return res.json({ blueprint, savedId: saved.id });
    }

    return res.json({ blueprint });
  } catch (error) {
    console.error('Blueprint generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate blueprint',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Run individual agents
router.post('/training', async (req: Request, res: Response) => {
  try {
    const userProfile = UserProfileSchema.parse(req.body);
    const plan = await runTrainingAgent(userProfile);
    res.json({ plan });
  } catch (error) {
    res.status(500).json({ error: 'Training agent failed', message: String(error) });
  }
});

router.post('/skipping', async (req: Request, res: Response) => {
  try {
    const { userProfile, gymSchedule } = req.body;
    const validatedProfile = UserProfileSchema.parse(userProfile);
    const plan = await runSkippingAgent(validatedProfile, gymSchedule);
    res.json({ plan });
  } catch (error) {
    res.status(500).json({ error: 'Skipping agent failed', message: String(error) });
  }
});

router.post('/nutrition', async (req: Request, res: Response) => {
  try {
    const nutritionProfile = NutritionProfileSchema.parse(req.body);
    const plan = await runNutritionAgent(nutritionProfile);
    res.json({ plan });
  } catch (error) {
    res.status(500).json({ error: 'Nutrition agent failed', message: String(error) });
  }
});

router.post('/recovery', async (req: Request, res: Response) => {
  try {
    const userProfile = UserProfileSchema.parse(req.body);
    const plan = await runRecoveryAgent(userProfile);
    res.json({ plan });
  } catch (error) {
    res.status(500).json({ error: 'Recovery agent failed', message: String(error) });
  }
});

router.post('/mindset', async (req: Request, res: Response) => {
  try {
    const userProfile = UserProfileSchema.parse(req.body);
    const plan = await runMindsetAgent(userProfile);
    res.json({ plan });
  } catch (error) {
    res.status(500).json({ error: 'Mindset agent failed', message: String(error) });
  }
});

export default router;
