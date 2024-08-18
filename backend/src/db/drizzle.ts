import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('No database connection string provided. Please set DATABASE_URL in your environment variables.');
}

const sql = neon(connectionString);

export const db = drizzle(sql);
