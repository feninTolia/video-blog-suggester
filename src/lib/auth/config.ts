import { serverEnv } from '@/data/serverEnv';
import { db } from '@/db/db';
import * as schema from '@/db/schema';
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';
import { betterAuth } from 'better-auth/minimal';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  socialProviders: {
    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
    },
  },
  secret: serverEnv.BETTER_AUTH_SECRET,
  advanced: { database: { generateId: 'uuid' } },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
