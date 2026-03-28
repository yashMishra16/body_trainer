import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { Blueprint90Day } from '../agents/coordinatorAgent';

export interface Blueprint {
  id: string;
  user_id: string;
  training_plan: Record<string, unknown>;
  skipping_plan: Record<string, unknown>;
  nutrition_plan: Record<string, unknown>;
  recovery_plan: Record<string, unknown>;
  mindset_plan: Record<string, unknown>;
  full_blueprint: Record<string, unknown>;
  start_date: Date;
  end_date: Date;
  status: string;
}

export async function saveBlueprint(
  userId: string,
  blueprint: Blueprint90Day,
): Promise<Blueprint> {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 90);

  const [saved] = await db('blueprints')
    .insert({
      id: uuidv4(),
      user_id: userId,
      training_plan: JSON.stringify(blueprint.trainingPlan),
      skipping_plan: JSON.stringify(blueprint.skippingPlan),
      nutrition_plan: JSON.stringify(blueprint.nutritionPlan),
      recovery_plan: JSON.stringify(blueprint.recoveryPlan),
      mindset_plan: JSON.stringify(blueprint.mindsetPlan),
      full_blueprint: JSON.stringify(blueprint),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: 'active',
    })
    .returning('*');

  return saved;
}

export async function getUserBlueprints(userId: string): Promise<Blueprint[]> {
  return db('blueprints')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc');
}

export async function getActiveBlueprint(userId: string): Promise<Blueprint | null> {
  const blueprint = await db('blueprints')
    .where({ user_id: userId, status: 'active' })
    .orderBy('created_at', 'desc')
    .first();

  return blueprint || null;
}

export async function updateBlueprintStatus(
  id: string,
  userId: string,
  status: string,
): Promise<Blueprint> {
  const [updated] = await db('blueprints')
    .where({ id, user_id: userId })
    .update({ status })
    .returning('*');

  return updated;
}
