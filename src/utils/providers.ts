import { AI_BASE_URL, AI_API_KEY } from '../constants/providers';
import { createOpenAI } from '@ai-sdk/openai';

export function createProvider() {
  return createOpenAI({
    baseURL: AI_BASE_URL,
    apiKey: AI_API_KEY,
  });
}
