import { serverEnv } from '@/data/serverEnv';
import { createOpenAI } from '@ai-sdk/openai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const QWEN_MODEL = 'text-embedding-qwen3-0.6b-text-embedding';
const OPEN_ROUTER_MODEL = 'nvidia/nemotron-3-embed-1b:free';

export async function getEmbeddingModel() {
  if (serverEnv.EMBEDDING_PROVIDER === 'qwen') {
    if (!serverEnv.LOCAL_EMBEDDING_BASE_URL) {
      throw new Error('LOCAL_EMBEDDING_BASE_URL is not defined');
    }

    const provider = createOpenAI({
      apiKey: 'not-needed',
      baseURL: serverEnv.LOCAL_EMBEDDING_BASE_URL,
    });

    return provider.embedding(QWEN_MODEL);
  } else {
    const openrouter = createOpenRouter({
      apiKey: serverEnv.OPEN_ROUTER_API_KEY,
    });
    return openrouter.textEmbeddingModel(OPEN_ROUTER_MODEL);
  }
}
