import { embed } from 'ai';
import { getEmbeddingModel } from './get-embedding-model';

export async function embedQuery(text: string): Promise<number[]> {
  const model = await getEmbeddingModel();
  const result = await embed({ model, value: text.trim().toLowerCase() });
  return result.embedding;
}
