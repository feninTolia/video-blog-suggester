'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth/config';
import { embedQuery } from '@/lib/embedding/embed-query';
import { searchContent } from '@/lib/search/search-content';
import { enforceRateLimit } from '@/lib/search/rate-limit';
import { db } from '@/db/db';
import { searchQueries } from '@/db/schema';

const querySchema = z.string().trim().min(1).max(500);

// export type SearchResultDTO = Omit<SearchResult, 'publishDate'> & {
//   publishDate: string;
// };

export async function searchContentAction(query: string) {
  const parsed = querySchema.safeParse(query);
  if (!parsed.success) {
    throw new Error('Please enter a search query.');
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('You must be signed in to search.');
  }

  await enforceRateLimit(session.user.id);

  const embedding = await embedQuery(parsed.data);
  const results = await searchContent(embedding);

  await db.insert(searchQueries).values({
    queryText: parsed.data,
    userId: session.user.id,
    resultContentIds: results.map((result) => result.id),
  });

  return results.map((result) => ({
    ...result,
    // publishDate: result.publishDate.toISOString(),
  }));
}
