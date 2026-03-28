import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'body_trainer',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },
  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export const db = knex(config);
export default config;
