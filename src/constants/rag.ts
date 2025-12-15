/**
 * RAG (Retrieval Augmented Generation) Configuration Constants
 *
 * Centralized configuration for the vector store and semantic search.
 */

// ============================================================================
// CHROMADB CONNECTION
// ============================================================================

/** ChromaDB server URL */
export const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';

/** Name of the ChromaDB collection for philosopher texts */
export const COLLECTION_NAME = 'philosopher_texts';

// ============================================================================
// QUERY SETTINGS
// ============================================================================

/** Default number of results to return from a query */
export const DEFAULT_QUERY_LIMIT = 10;

/** Minimum relevance score (0-1) for a result to be included */
export const MIN_RELEVANCE_SCORE = 0.3;

/** Number of results to fetch for philosopher tool queries */
export const PHILOSOPHER_QUERY_LIMIT = 5;

// ============================================================================
// CONTEXT EXPANSION
// ============================================================================

/** Minimum relevance score to fetch adjacent chunks for expanded context */
export const CONTEXT_EXPANSION_THRESHOLD = 0.6;

/** Number of chunks before/after to fetch for context (1 = 1 before + 1 after) */
export const ADJACENT_CHUNK_WINDOW = 1;

/** Number of characters to show from adjacent chunks as preview */
export const CONTEXT_PREVIEW_LENGTH = 200;

// ============================================================================
// INDEXING SETTINGS
// ============================================================================

/** Batch size for embedding chunks during indexing */
export const EMBEDDING_BATCH_SIZE = 50;
