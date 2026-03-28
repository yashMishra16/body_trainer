import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('name').notNullable();
    table.integer('age');
    table.string('gender');
    table.float('height_cm');
    table.float('weight_kg');
    table.string('fitness_level').defaultTo('beginner'); // beginner, intermediate, advanced
    table.specificType('goals', 'text[]');
    table.string('diet_type').defaultTo('standard'); // standard, vegan, vegetarian, keto, paleo
    table.timestamps(true, true);
  });

  // Blueprints table
  await knex.schema.createTable('blueprints', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.jsonb('training_plan').notNullable().defaultTo('{}');
    table.jsonb('skipping_plan').notNullable().defaultTo('{}');
    table.jsonb('nutrition_plan').notNullable().defaultTo('{}');
    table.jsonb('recovery_plan').notNullable().defaultTo('{}');
    table.jsonb('mindset_plan').notNullable().defaultTo('{}');
    table.jsonb('full_blueprint').notNullable().defaultTo('{}');
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.string('status').defaultTo('active'); // active, completed, paused
    table.timestamps(true, true);
  });

  // Workouts table
  await knex.schema.createTable('workouts', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('blueprint_id').references('id').inTable('blueprints').onDelete('SET NULL').nullable();
    table.string('type').notNullable(); // gym, skipping, rest
    table.date('scheduled_date').notNullable();
    table.boolean('completed').defaultTo(false);
    table.jsonb('exercises').defaultTo('[]');
    table.integer('duration_minutes');
    table.text('notes');
    table.timestamps(true, true);
  });

  // Progress table
  await knex.schema.createTable('progress', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.date('logged_date').notNullable();
    table.float('weight_kg');
    table.float('body_fat_percentage');
    table.jsonb('measurements').defaultTo('{}'); // chest, waist, hips, arms, etc.
    table.text('notes');
    table.integer('energy_level'); // 1-10
    table.integer('sleep_hours');
    table.timestamps(true, true);
  });

  // Agent cache table
  await knex.schema.createTable('agent_cache', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('agent_type').notNullable();
    table.string('cache_key').unique().notNullable();
    table.jsonb('response').notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('agent_cache');
  await knex.schema.dropTableIfExists('progress');
  await knex.schema.dropTableIfExists('workouts');
  await knex.schema.dropTableIfExists('blueprints');
  await knex.schema.dropTableIfExists('users');
}
