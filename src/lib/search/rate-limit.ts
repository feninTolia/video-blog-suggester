import { and, count, eq, gte } from 'drizzle-orm';
import { db } from '@/db/db';
import { searchQueries } from '@/db/schema';
import { serverEnv } from '@/data/serverEnv';
import { RateLimitError } from './rate-limit-errors';

export async function enforceRateLimit(userId: string) {
  const windowStart = new Date(
    Date.now() - serverEnv.RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000,
  );

  const [{ count: queryCount }] = await db
    .select({ count: count() })
    .from(searchQueries)
    .where(
      and(
        eq(searchQueries.userId, userId),
        gte(searchQueries.createdAt, windowStart),
      ),
    );

  if (queryCount >= serverEnv.RATE_LIMIT_MAX_REQUESTS) {
    throw new RateLimitError();
  }
}
