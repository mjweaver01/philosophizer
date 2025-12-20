import {
  AI_BASE_URL,
  AI_API_KEY,
  EMBEDDING_BASE_URL,
  EMBEDDING_API_KEY,
  EMBEDDING_MODEL_NAME,
} from '../constants/providers';
import { createOpenAI } from '@ai-sdk/openai';
import type { FetchFunction } from '@ai-sdk/provider-utils';

export function createProvider(
  baseURL: string = AI_BASE_URL,
  apiKey: string = AI_API_KEY
) {
  const isLocalProvider =
    baseURL.includes('localhost') || baseURL.includes('127.0.0.1');

  // if we are using a local provider, we need to transform the messages to the correct format
  // LM Studio does not support LanguageModelV3
  // specifically "developer" role is not supported, so we must transform it to "system"
  const customFetch: FetchFunction = (async (url, options) => {
    if (isLocalProvider && options?.body) {
      try {
        const body = JSON.parse(options.body as string);
        if (body.messages && Array.isArray(body.messages)) {
          body.messages = body.messages.map((message: any) => {
            if (message.role === 'developer') {
              return {
                ...message,
                role: 'system',
              };
            }
            return message;
          });
          options.body = JSON.stringify(body);
        }
      } catch (e) {}
    }
    return fetch(url, options);
  }) as FetchFunction;

  return createOpenAI({
    baseURL,
    apiKey,
    fetch: customFetch,
  });
}

// Embedding provider (for RAG/vector store)
const embeddingProvider = createOpenAI({
  baseURL: EMBEDDING_BASE_URL,
  apiKey: EMBEDDING_API_KEY,
});

export const EMBEDDING_MODEL =
  embeddingProvider.embedding(EMBEDDING_MODEL_NAME);
