import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    OPEN_ROUTER_API_KEY: z.string(),
    EMBEDDING_PROVIDER: z.enum(['qwen', 'openrouter']),
    LOCAL_EMBEDDING_BASE_URL: z.url().optional(),
  },

  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
