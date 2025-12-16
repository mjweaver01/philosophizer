// AI SDK Models
// export const LLM_MODEL = process.env.LLM_MODEL || 'qwen3-1.7b';
export const LLM_MODEL =
  process.env.LLM_MODEL || 'huihui-gpt-oss-20b-abliterated';
export const WEB_SEARCH_MODEL = process.env.SEARCH_MODEL || 'gpt-4.1-mini';

// AI SDK Configuration (LMStudio/OpenAI/etc)
export const AI_BASE_URL =
  process.env.AI_BASE_URL || 'http://localhost:1234/v1';
export const AI_API_KEY =
  process.env.AI_API_KEY || process.env.OPENAI_API_KEY || 'lm-studio';

// Embedding Configuration
export const EMBEDDING_BASE_URL =
  process.env.EMBEDDING_BASE_URL || 'http://localhost:1234/v1';
export const EMBEDDING_API_KEY =
  process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY || 'lm-studio';
export const EMBEDDING_MODEL_NAME =
  process.env.EMBEDDING_MODEL ||
  'text-embedding-nomic-embed-text-v1.5-embedding';
