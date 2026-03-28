import { db } from '../config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  fitnessLevel?: string;
  goals?: string[];
  dietType?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  fitness_level: string;
  goals?: string[];
  diet_type: string;
  created_at: Date;
  updated_at: Date;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const passwordHash = await bcrypt.hash(input.password, 12);

  const [user] = await db('users')
    .insert({
      id: uuidv4(),
      email: input.email,
      password_hash: passwordHash,
      name: input.name,
      age: input.age,
      gender: input.gender,
      height_cm: input.heightCm,
      weight_kg: input.weightKg,
      fitness_level: input.fitnessLevel || 'beginner',
      goals: input.goals ? JSON.stringify(input.goals) : null,
      diet_type: input.dietType || 'standard',
    })
    .returning('*');

  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await db('users').where({ id }).first();
  return user || null;
}

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const user = await db('users').where({ email }).first();
  return user || null;
}

export async function updateUser(id: string, updates: Partial<CreateUserInput>): Promise<User> {
  const updateData: Record<string, unknown> = {};

  if (updates.name) updateData.name = updates.name;
  if (updates.age) updateData.age = updates.age;
  if (updates.gender) updateData.gender = updates.gender;
  if (updates.heightCm) updateData.height_cm = updates.heightCm;
  if (updates.weightKg) updateData.weight_kg = updates.weightKg;
  if (updates.fitnessLevel) updateData.fitness_level = updates.fitnessLevel;
  if (updates.goals) updateData.goals = JSON.stringify(updates.goals);
  if (updates.dietType) updateData.diet_type = updates.dietType;

  const [user] = await db('users').where({ id }).update(updateData).returning('*');
  return user;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
