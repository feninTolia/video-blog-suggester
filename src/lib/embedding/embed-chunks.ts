import { getEmbeddingModel } from './get-embedding-model';
import { embedMany } from 'ai';

export async function embedChunks(texts: string[]) {
  if (texts.length === 0) return [];

  const model = await getEmbeddingModel();
  const results = await embedMany({
    model,
    values: texts,
    maxParallelCalls: 100,
  });

  return results.embeddings;
}
