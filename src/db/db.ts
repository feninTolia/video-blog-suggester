import { serverEnv } from '@/data/serverEnv';
import { relations } from './relations';
import { drizzle } from 'drizzle-orm/neon-http';
import { authRelations } from './schema';

export const db = drizzle(serverEnv.DATABASE_URL, {
  relations: { ...relations, ...authRelations },
});
