import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Workout {
  id: string;
  user_id: string;
  blueprint_id?: string;
  type: string;
  scheduled_date: Date;
  completed: boolean;
  exercises: Record<string, unknown>[];
  duration_minutes?: number;
  notes?: string;
}

export interface CreateWorkoutInput {
  userId: string;
  blueprintId?: string;
  type: string;
  scheduledDate: string;
  exercises?: Record<string, unknown>[];
  durationMinutes?: number;
  notes?: string;
}

export async function createWorkout(input: CreateWorkoutInput): Promise<Workout> {
  const [workout] = await db('workouts')
    .insert({
      id: uuidv4(),
      user_id: input.userId,
      blueprint_id: input.blueprintId,
      type: input.type,
      scheduled_date: input.scheduledDate,
      completed: false,
      exercises: JSON.stringify(input.exercises || []),
      duration_minutes: input.durationMinutes,
      notes: input.notes,
    })
    .returning('*');

  return workout;
}

export async function getUserWorkouts(userId: string, limit = 30): Promise<Workout[]> {
  return db('workouts')
    .where({ user_id: userId })
    .orderBy('scheduled_date', 'desc')
    .limit(limit);
}

export async function completeWorkout(id: string, userId: string): Promise<Workout> {
  const [workout] = await db('workouts')
    .where({ id, user_id: userId })
    .update({ completed: true })
    .returning('*');

  return workout;
}

export async function getWorkoutsByDateRange(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<Workout[]> {
  return db('workouts')
    .where({ user_id: userId })
    .whereBetween('scheduled_date', [startDate, endDate])
    .orderBy('scheduled_date', 'asc');
}
