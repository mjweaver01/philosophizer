/**
 * Vector store utility for embedding and querying philosopher texts
 * Uses ChromaDB for vector storage and AI SDK for embeddings
 *
 * Requires ChromaDB server running:
 *   bun run chroma
 */

import { ChromaClient, type Collection } from 'chromadb';
import { embed, embedMany } from 'ai';
import type { TextChunk } from './chunker';
import {
  CHROMA_URL,
  COLLECTION_NAME,
  DEFAULT_QUERY_LIMIT,
  MIN_RELEVANCE_SCORE,
  ADJACENT_CHUNK_WINDOW,
  EMBEDDING_BATCH_SIZE,
} from '../../constants/rag';
import { EMBEDDING_MODEL_NAME } from '../../constants/providers';
import { EMBEDDING_MODEL } from '../../utils/providers';

// Singleton instances
let chromaClient: ChromaClient | null = null;
let collection: Collection | null = null;

/**
 * Generate embeddings for texts using AI SDK
 */
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  if (texts.length === 1) {
    const { embedding } = await embed({
      model: EMBEDDING_MODEL,
      value: texts[0]!,
    });
    return [embedding];
  }

  const { embeddings } = await embedMany({
    model: EMBEDDING_MODEL,
    values: texts,
  });
  return embeddings;
}

/**
 * Generate a single embedding
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: EMBEDDING_MODEL,
    value: text,
  });
  return embedding;
}

/**
 * Initialize the ChromaDB client
 */
export async function initVectorStore(): Promise<{
  client: ChromaClient;
  collection: Collection;
}> {
  if (chromaClient && collection) {
    return { client: chromaClient, collection };
  }

  // Initialize ChromaDB client with configurable URL
  chromaClient = new ChromaClient({ path: CHROMA_URL });

  // Get or create the collection with cosine similarity (better for text)
  collection = await chromaClient.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: {
      description: 'Philosopher and theologian primary source texts',
      embeddingModel: EMBEDDING_MODEL_NAME,
      'hnsw:space': 'cosine', // Use cosine similarity instead of L2 distance
    },
  });

  return { client: chromaClient, collection };
}

/**
 * Add chunks to the vector store
 */
export async function addChunks(chunks: TextChunk[]): Promise<number> {
  if (chunks.length === 0) return 0;

  const { collection } = await initVectorStore();

  let added = 0;

  for (let i = 0; i < chunks.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = chunks.slice(i, i + EMBEDDING_BATCH_SIZE);

    const batchIds = batch.map(c => c.id);
    const batchDocs = batch.map(c => c.content);
    const batchMeta = batch.map(c => ({
      philosopher: c.metadata.philosopher,
      sourceId: c.metadata.sourceId,
      title: c.metadata.title,
      chunkIndex: c.metadata.chunkIndex,
      startChar: c.metadata.startChar ?? 0,
      endChar: c.metadata.endChar ?? 0,
    }));

    // Generate embeddings using AI SDK
    const batchEmbeddings = await generateEmbeddings(batchDocs);

    await collection.add({
      ids: batchIds,
      documents: batchDocs,
      metadatas: batchMeta,
      embeddings: batchEmbeddings,
    });

    added += batch.length;

    if (chunks.length > EMBEDDING_BATCH_SIZE) {
      console.log(
        `  Embedded ${Math.min(i + EMBEDDING_BATCH_SIZE, chunks.length)}/${chunks.length} chunks`
      );
    }
  }

  return added;
}

export interface QueryResult {
  id: string;
  content: string;
  philosopher: string;
  sourceId: string;
  title: string;
  chunkIndex: number;
  relevanceScore: number;
}

export interface QueryOptions {
  philosopher?: string;
  sourceId?: string;
  limit?: number;
  minScore?: number;
}

/**
 * Query for relevant passages
 */
export async function queryPassages(
  query: string,
  options: QueryOptions = {}
): Promise<QueryResult[]> {
  const {
    philosopher,
    sourceId,
    limit = DEFAULT_QUERY_LIMIT,
    minScore = MIN_RELEVANCE_SCORE,
  } = options;

  const { collection } = await initVectorStore();

  // Build where clause
  const whereClause: Record<string, string> = {};
  if (philosopher) whereClause.philosopher = philosopher;
  if (sourceId) whereClause.sourceId = sourceId;

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Query the collection
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: limit,
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
  });

  // Format results
  const queryResults: QueryResult[] = [];

  if (results.ids[0]) {
    for (let i = 0; i < results.ids[0].length; i++) {
      const distance = results.distances?.[0]?.[i] ?? 1;
      // For cosine similarity: distance is 1 - similarity, so similarity = 1 - distance
      // Score ranges from 0 (completely different) to 1 (identical)
      const score = Math.max(0, 1 - distance);

      if (score >= minScore) {
        const metadata = results.metadatas?.[0]?.[i] as Record<string, unknown>;
        queryResults.push({
          id: results.ids[0][i]!,
          content: results.documents?.[0]?.[i] ?? '',
          philosopher: (metadata?.philosopher as string) ?? '',
          sourceId: (metadata?.sourceId as string) ?? '',
          title: (metadata?.title as string) ?? '',
          chunkIndex: (metadata?.chunkIndex as number) ?? 0,
          relevanceScore: score,
        });
      }
    }
  }

  return queryResults;
}

/**
 * Query multiple philosophers at once
 */
export async function queryMultiplePhilosophers(
  query: string,
  philosophers: string[],
  options: Omit<QueryOptions, 'philosopher'> = {}
): Promise<QueryResult[]> {
  const allResults: QueryResult[] = [];

  for (const philosopher of philosophers) {
    const results = await queryPassages(query, { ...options, philosopher });
    allResults.push(...results);
  }

  allResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return allResults.slice(0, options.limit || DEFAULT_QUERY_LIMIT);
}

/**
 * Get adjacent chunks for expanded context around a matched passage
 * Returns chunks before and after the given chunk index
 */
export async function getAdjacentChunks(
  sourceId: string,
  chunkIndex: number,
  window: number = ADJACENT_CHUNK_WINDOW
): Promise<QueryResult[]> {
  const { collection } = await initVectorStore();

  // Calculate which chunk indices to fetch
  const targetIndices: number[] = [];
  for (let i = chunkIndex - window; i <= chunkIndex + window; i++) {
    if (i >= 0 && i !== chunkIndex) {
      targetIndices.push(i);
    }
  }

  if (targetIndices.length === 0) {
    return [];
  }

  const results: QueryResult[] = [];

  // Fetch each adjacent chunk
  for (const idx of targetIndices) {
    const chunkResults = await collection.get({
      where: {
        $and: [{ sourceId: { $eq: sourceId } }, { chunkIndex: { $eq: idx } }],
      },
      limit: 1,
    });

    if (chunkResults.ids.length > 0) {
      const metadata = chunkResults.metadatas?.[0] as Record<string, unknown>;
      results.push({
        id: chunkResults.ids[0]!,
        content: chunkResults.documents?.[0] ?? '',
        philosopher: (metadata?.philosopher as string) ?? '',
        sourceId: (metadata?.sourceId as string) ?? '',
        title: (metadata?.title as string) ?? '',
        chunkIndex: (metadata?.chunkIndex as number) ?? 0,
        relevanceScore: 1, // Adjacent chunks have full relevance to context
      });
    }
  }

  // Sort by chunk index for proper reading order
  results.sort((a, b) => a.chunkIndex - b.chunkIndex);

  return results;
}

/**
 * Get a passage with surrounding context (the matched chunk plus adjacent chunks)
 */
export async function getPassageWithContext(
  sourceId: string,
  chunkIndex: number,
  contextWindow: number = ADJACENT_CHUNK_WINDOW
): Promise<{ main: QueryResult | null; context: QueryResult[] }> {
  const { collection } = await initVectorStore();

  // Get the main chunk
  const mainResult = await collection.get({
    where: {
      $and: [
        { sourceId: { $eq: sourceId } },
        { chunkIndex: { $eq: chunkIndex } },
      ],
    },
    limit: 1,
  });

  let main: QueryResult | null = null;
  if (mainResult.ids.length > 0) {
    const metadata = mainResult.metadatas?.[0] as Record<string, unknown>;
    main = {
      id: mainResult.ids[0]!,
      content: mainResult.documents?.[0] ?? '',
      philosopher: (metadata?.philosopher as string) ?? '',
      sourceId: (metadata?.sourceId as string) ?? '',
      title: (metadata?.title as string) ?? '',
      chunkIndex: (metadata?.chunkIndex as number) ?? 0,
      relevanceScore: 1,
    };
  }

  // Get adjacent chunks for context
  const context = await getAdjacentChunks(sourceId, chunkIndex, contextWindow);

  return { main, context };
}

/**
 * Get collection statistics
 */
export async function getCollectionStats(): Promise<{
  totalChunks: number;
  byPhilosopher: Record<string, number>;
  bySource: Record<string, number>;
}> {
  const { collection } = await initVectorStore();

  const allData = await collection.get();
  const totalChunks = allData.ids.length;

  const byPhilosopher: Record<string, number> = {};
  const bySource: Record<string, number> = {};

  for (const meta of allData.metadatas ?? []) {
    const philosopher = (meta as Record<string, unknown>)
      ?.philosopher as string;
    const sourceId = (meta as Record<string, unknown>)?.sourceId as string;

    if (philosopher) {
      byPhilosopher[philosopher] = (byPhilosopher[philosopher] ?? 0) + 1;
    }
    if (sourceId) {
      bySource[sourceId] = (bySource[sourceId] ?? 0) + 1;
    }
  }

  return { totalChunks, byPhilosopher, bySource };
}

/**
 * Check if a source is already indexed
 */
export async function isSourceIndexed(sourceId: string): Promise<boolean> {
  const { collection } = await initVectorStore();

  const results = await collection.get({
    where: { sourceId },
    limit: 1,
  });

  return results.ids.length > 0;
}

/**
 * Delete chunks for a source
 */
export async function deleteSource(sourceId: string): Promise<number> {
  const { collection } = await initVectorStore();

  const existing = await collection.get({ where: { sourceId } });
  const count = existing.ids.length;

  if (count > 0) {
    await collection.delete({ where: { sourceId } });
  }

  return count;
}

/**
 * Clear all chunks
 */
export async function clearCollection(): Promise<void> {
  const { client } = await initVectorStore();

  try {
    await client.deleteCollection({ name: COLLECTION_NAME });
    collection = null;
    console.log('✓ Collection cleared');
  } catch {
    console.log('Collection does not exist or already cleared');
  }
}

/**
 * Format results for display
 */
export function formatResults(results: QueryResult[]): string {
  if (results.length === 0) {
    return 'No relevant passages found.';
  }

  let output = `Found ${results.length} relevant passage(s):\n\n`;

  for (const result of results) {
    const score = (result.relevanceScore * 100).toFixed(1);
    output += `---\n`;
    output += `📚 ${result.title} (${result.philosopher})\n`;
    output += `📊 Relevance: ${score}%\n\n`;
    output += `${result.content}\n\n`;
  }

  return output;
}
