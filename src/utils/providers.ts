import type { LanguageModel } from 'ai';
import { openai, createOpenAI } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import {
  EMBEDDING_BASE_URL,
  EMBEDDING_API_KEY,
  EMBEDDING_MODEL_NAME,
} from '../constants/providers';
import { getSystemPrompt } from '../constants/prompts';

// LMStudio/Ollama provider - configurable via environment variable
// Defaults to localhost:1234 for LMStudio, but can be set to http://ollama:11434/v1 for containerized Ollama
const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1',
});

export interface ModelProvider {
  id: string;
  name: string;
  available: boolean;
  model: LanguageModel;
  defaultSystemPrompt: string;
  costPerToken?: {
    prompt: number; // Cost per 1M tokens
    completion: number; // Cost per 1M tokens
  };
}

const checkApiKey = (key: string | undefined, provider: string): boolean => {
  const exists = !!key;
  if (!exists) {
    console.warn(
      `[API] ${provider}_API_KEY is not set in environment variables`
    );
  }
  return exists;
};

// Lazy initialization to avoid module load time evaluation
let _modelProviders: ModelProvider[] | null = null;
let _initPromise: Promise<void> | null = null;

async function initializeModelProviders() {
  if (_modelProviders) return;

  const defaultSystemPrompt = getSystemPrompt();

  _modelProviders = [
    {
      id: 'gpt-4.1-mini',
      name: 'GPT-4.1 Mini (OpenAI)',
      available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
      model: openai('gpt-4.1-mini'),
      defaultSystemPrompt,
      // per 1M tokens
      costPerToken: { prompt: 0.15, completion: 0.6 },
    },
    {
      id: 'gpt-4.1',
      name: 'GPT-4.1 (OpenAI)',
      available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
      model: openai('gpt-4.1'),
      defaultSystemPrompt,
      costPerToken: { prompt: 2.5, completion: 10 },
    },
    {
      id: 'gpt-5-mini',
      name: 'GPT-5 Mini (OpenAI)',
      available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
      model: openai('gpt-5-mini'),
      defaultSystemPrompt,
      costPerToken: { prompt: 0.3, completion: 1.2 },
    },
    {
      id: 'gpt-5',
      name: 'GPT-5 (OpenAI)',
      available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
      model: openai('gpt-5'),
      defaultSystemPrompt,
      costPerToken: { prompt: 5, completion: 15 },
    },
    {
      id: 'gpt-5.2',
      name: 'GPT-5.2 (OpenAI)',
      available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
      model: openai('gpt-5.2'),
      defaultSystemPrompt,
      costPerToken: { prompt: 10, completion: 30 },
    },
    // {
    //   id: "claude-4.5-sonnet",
    //   name: "Claude 4.5 Sonnet (Anthropic)",
    //   available: checkApiKey(process.env.ANTHROPIC_API_KEY, "ANTHROPIC"),
    //   model: anthropic("claude-sonnet-4-5-20250929"),
    //   defaultSystemPrompt,
    // },
    {
      id: 'qwen/qwen3-1.7b',
      name: 'Qwen3 1.7B (LMStudio)',
      available: true,
      model: lmstudio('qwen/qwen3-1.7b'),
      defaultSystemPrompt,
      costPerToken: { prompt: 0, completion: 0 },
    },
    {
      id: 'qwen/qwen3.5-9b',
      name: 'Qwen3.5 9B (LMStudio)',
      available: true,
      model: lmstudio('qwen/qwen3.5-9b'),
      defaultSystemPrompt,
      costPerToken: { prompt: 0, completion: 0 },
    },
  ];
}

export const modelProviders = async (): Promise<ModelProvider[]> => {
  if (!_initPromise) {
    _initPromise = initializeModelProviders();
  }
  await _initPromise;
  return _modelProviders!;
};

export async function getModelProviderById(
  id: string
): Promise<ModelProvider | undefined> {
  const providers = await modelProviders();
  return providers.find(provider => provider.id === id);
}

export async function getAvailableModelProviders(): Promise<ModelProvider[]> {
  const providers = await modelProviders();
  return providers.filter(provider => provider.available);
}

// Embedding provider (for RAG/vector store)
const embeddingProvider = createOpenAI({
  baseURL: EMBEDDING_BASE_URL,
  apiKey: EMBEDDING_API_KEY,
});

export const EMBEDDING_MODEL =
  embeddingProvider.embedding(EMBEDDING_MODEL_NAME);
