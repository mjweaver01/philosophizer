/**
 * Philosopher RAG (Retrieval Augmented Generation) System
 *
 * This module provides semantic search over philosopher and theologian primary texts.
 *
 * Setup:
 *   1. Run `bun run rag:index` to download and index all texts
 *   2. Or index specific philosophers: `bun run rag:index -- --philosopher plato`
 *
 * Usage:
 *   import { queryPhilosopher, queryAllPhilosophers } from './rag';
 *
 *   // Query a specific philosopher
 *   const results = await queryPhilosopher('aristotle', 'What is virtue?');
 *
 *   // Query all philosophers
 *   const allResults = await queryAllPhilosophers('What is the meaning of life?');
 */

import {
  queryPassages,
  getCollectionStats,
  type QueryResult,
} from './utils/vectorStore';

// ============================================================================
// RE-EXPORTS
// ============================================================================

export {
  TEXT_SOURCES,
  getSourcesByPhilosopher,
  getAllPhilosophers,
} from './sources';
export type { TextSource } from './sources';

export {
  queryPassages,
  queryMultiplePhilosophers,
  formatResults,
  getCollectionStats,
  isSourceIndexed,
  getAdjacentChunks,
  getPassageWithContext,
} from './utils/vectorStore';
export type { QueryResult } from './utils/vectorStore';

export {
  createChunksWithMetadata,
  chunkText,
  getChunkStats,
} from './utils/chunker';
export type { TextChunk, ChunkOptions } from './utils/chunker';

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Query a specific philosopher's texts for relevant passages
 */
export async function queryPhilosopher(
  philosopher: string,
  topic: string,
  limit: number = 5
): Promise<QueryResult[]> {
  return queryPassages(topic, { philosopher, limit });
}

/**
 * Query all philosophers for relevant passages
 */
export async function queryAllPhilosophers(
  topic: string,
  limit: number = 5
): Promise<QueryResult[]> {
  return queryPassages(topic, { limit });
}

/**
 * Check if the RAG system has been initialized (texts indexed)
 */
export async function isRAGInitialized(): Promise<boolean> {
  try {
    const stats = await getCollectionStats();
    return stats.totalChunks > 0;
  } catch {
    return false;
  }
}
