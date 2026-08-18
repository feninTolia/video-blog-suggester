import { db } from '@/db/db';
import { chunks, content } from '@/db/schema';
import { cosineDistance, desc, eq, gt, sql } from 'drizzle-orm';

export const MIN_SIMILARITY = 0.3;

export async function searchContent(queryEmbedding: number[]) {
  const dbSimilarity = sql<number>`1-(${cosineDistance(chunks.embedding, queryEmbedding)})`;

  const matchingChunks = await db
    .selectDistinctOn([content.id], {
      id: content.id,
      title: content.title,
      description: content.description,
      thumbnailUrl: content.thumbnailUrl,
      url: content.url,
      type: content.type,
      similarity: dbSimilarity,
      startPosition: chunks.startPosition,
      rawText: chunks.text,
    })
    .from(chunks)
    .where(gt(dbSimilarity, MIN_SIMILARITY))
    .innerJoin(content, eq(content.id, chunks.contentId))
    .orderBy(content.id, desc(dbSimilarity));

  const sortedResults = matchingChunks.sort(
    (a, b) => b.similarity - a.similarity,
  );

  return sortedResults.slice(0, 20);
}
