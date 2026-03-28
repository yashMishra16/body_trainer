import { db } from '../config/database';

export async function connectDatabase(): Promise<void> {
  try {
    await db.raw('SELECT 1');
    console.log('✅ PostgreSQL connection established');
    await runMigrations();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function runMigrations(): Promise<void> {
  try {
    await db.migrate.latest();
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

export { db };
