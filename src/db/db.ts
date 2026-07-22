import { serverEnv } from '@/data/serverEnv';
import { relations } from './relations';
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(serverEnv.DATABASE_URL, { relations });
