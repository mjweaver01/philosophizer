import {
  AI_BASE_URL,
  AI_API_KEY,
  EMBEDDING_BASE_URL,
  EMBEDDING_API_KEY,
  EMBEDDING_MODEL_NAME,
} from '../constants/providers';
import { createOpenAI } from '@ai-sdk/openai';

export function createProvider(
  baseURL: string = AI_BASE_URL,
  apiKey: string = AI_API_KEY
) {
  return createOpenAI({ baseURL, apiKey });
}

// Embedding provider (for RAG/vector store)
const embeddingProvider = createProvider(EMBEDDING_BASE_URL, EMBEDDING_API_KEY);

export const EMBEDDING_MODEL =
  embeddingProvider.embedding(EMBEDDING_MODEL_NAME);
