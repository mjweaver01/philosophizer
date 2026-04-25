import type { LanguageModel } from 'ai';
import { openai, createOpenAI } from '@ai-sdk/openai';
import { anthropic, type AnthropicProviderOptions } from '@ai-sdk/anthropic';
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

export interface ModelsResponse {
  defaultModel: string;
  models: ModelProvider[];
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

/**
 * Helper to create Anthropic models with extended thinking enabled.
 *
 * Extended thinking allows Claude to perform deeper reasoning by allocating
 * additional computational effort. The reasoning process is exposed as thinking
 * blocks in the response, which the frontend can display separately.
 *
 * @param modelId - The Anthropic model ID (e.g., 'claude-sonnet-4-5-20250929')
 * @param budgetTokens - Maximum tokens allocated for thinking (default: 10000)
 * @returns A language model configured with extended thinking enabled
 */
function createAnthropicModelWithThinking(
  modelId: string,
  budgetTokens: number = 10000
): LanguageModel {
  const baseModel = anthropic(modelId);

  // Wrap the model to inject thinking configuration into every call
  // Note: Use Object.create to preserve prototype getters like supportedUrls,
  // which are lost when using object spread on class instances.
  return Object.assign(
    Object.create(Object.getPrototypeOf(baseModel)),
    baseModel,
    {
      doGenerate: async (options: any) => {
        return baseModel.doGenerate({
          ...options,
          providerOptions: {
            ...options.providerOptions,
            anthropic: {
              thinking: { type: 'enabled' as const, budgetTokens },
              ...options.providerOptions?.anthropic,
            } satisfies AnthropicProviderOptions,
          },
        });
      },
      doStream: async (options: any) => {
        return baseModel.doStream({
          ...options,
          providerOptions: {
            ...options.providerOptions,
            anthropic: {
              thinking: { type: 'enabled' as const, budgetTokens },
              ...options.providerOptions?.anthropic,
            } satisfies AnthropicProviderOptions,
          },
        });
      },
    }
  ) as LanguageModel;
}

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
      // per 1M tokens - verified Apr 2026
      costPerToken: { prompt: 0.4, completion: 1.6 },
    },
    {
      id: 'gpt-4.1',
      name: 'GPT-4.1 (OpenAI)',
      available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
      model: openai('gpt-4.1'),
      defaultSystemPrompt,
      // per 1M tokens - verified Apr 2026
      costPerToken: { prompt: 2, completion: 8 },
    },
    // {
    //   id: 'gpt-5-nano',
    //   name: 'GPT-5 Nano - ChatGPT (OpenAI)',
    //   available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
    //   model: openai('gpt-5-nano'),
    //   defaultSystemPrompt,
    //   costPerToken: { prompt: 0.05, completion: 0.4 },
    // },
    {
      id: 'gpt-5-mini',
      name: 'GPT-5 Mini - ChatGPT (OpenAI)',
      available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
      model: openai('gpt-5-mini'),
      defaultSystemPrompt,
      // per 1M tokens - verified Apr 2026
      costPerToken: { prompt: 0.25, completion: 2 },
    },
    {
      id: 'gpt-5-chat',
      name: 'GPT-5 Chat - ChatGPT (OpenAI)',
      available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
      model: openai('gpt-5-chat-latest'),
      defaultSystemPrompt,
      // per 1M tokens - verified Apr 2026
      costPerToken: { prompt: 1.25, completion: 10 },
    },
    {
      id: 'gpt-5.5',
      name: 'GPT-5.5 (OpenAI)',
      available: checkApiKey(process.env.OPENAI_API_KEY, 'OPENAI'),
      model: openai('gpt-5.5'),
      defaultSystemPrompt,
      // per 1M tokens - verified Apr 2026
      costPerToken: { prompt: 5, completion: 30 },
    },
    {
      id: 'claude-4.6-sonnet',
      name: 'Claude 4.6 Sonnet (Anthropic)',
      available: checkApiKey(process.env.ANTHROPIC_API_KEY, 'ANTHROPIC'),
      model: createAnthropicModelWithThinking('claude-sonnet-4-6', 10000),
      // per 1M tokens - verified Apr 2026
      costPerToken: { prompt: 3, completion: 15 },
      defaultSystemPrompt,
    },
    {
      id: 'claude-4.7-opus',
      name: 'Claude 4.7 Opus (Anthropic)',
      available: checkApiKey(process.env.ANTHROPIC_API_KEY, 'ANTHROPIC'),
      model: createAnthropicModelWithThinking('claude-opus-4-7', 10000),
      // per 1M tokens - verified Apr 2026
      costPerToken: { prompt: 5, completion: 25 },
      defaultSystemPrompt,
    },
    // {
    //   id: 'gpt-oss-120b',
    //   name: 'GPT-OSS 120B (Cerebras)',
    //   available: checkApiKey(process.env.CEREBRAS_API_KEY, 'CEREBRAS'),
    //   model: cerebras('gpt-oss-120b'),
    //   defaultSystemPrompt,
    // },
    ...(process.env.NODE_ENV === 'development'
      ? [
          {
            id: 'qwen/qwen3-1.7b',
            name: 'Qwen3 1.7B (LMStudio)',
            available: true,
            model: lmstudio('qwen/qwen3-1.7b'),
            defaultSystemPrompt,
            costPerToken: { prompt: 0, completion: 0 },
          },
          {
            id: 'qwen/qwen3.6-35b-a3b',
            name: 'Qwen3.6 35B A3B (LMStudio)',
            available: true,
            model: lmstudio('qwen/qwen3.6-35b-a3b'),
            defaultSystemPrompt,
            costPerToken: { prompt: 0, completion: 0 },
          },
          {
            id: 'qwen3.6-35b-a3b-uncensored-hauhaucs-aggressive',
            name: 'Qwen3.6 35B A3B Uncensored Hauhaucs Aggressive (LMStudio)',
            available: true,
            model: lmstudio('qwen3.6-35b-a3b-uncensored-hauhaucs-aggressive'),
            defaultSystemPrompt,
            costPerToken: { prompt: 0, completion: 0 },
          },
          {
            id: 'nvidia/nemotron-3-nano-4b',
            name: 'Nemotron 3 Nano 4B (LMStudio)',
            available: true,
            model: lmstudio('nvidia/nemotron-3-nano-4b'),
            defaultSystemPrompt,
            costPerToken: { prompt: 0, completion: 0 },
          },
          {
            id: 'huihui-gpt-oss-20b-abliterated',
            name: 'Huihui GPT OSS 20B Abliterated (LMStudio)',
            available: true,
            model: lmstudio('huihui-gpt-oss-20b-abliterated'),
            defaultSystemPrompt,
            costPerToken: { prompt: 0, completion: 0 },
          },
        ]
      : []),
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
