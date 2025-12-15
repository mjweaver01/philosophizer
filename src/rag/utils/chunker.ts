/**
 * Utility for chunking texts into meaningful passages for embedding
 */

export interface ChunkMetadata {
  philosopher: string;
  sourceId: string;
  title: string;
  author: string;
  chunkIndex: number;
  totalChunks: number;
  startChar: number;
  endChar: number;
}

export interface TextChunk {
  id: string;
  content: string;
  metadata: ChunkMetadata;
}

export interface ChunkOptions {
  /** Target chunk size in characters (default: 1500) */
  chunkSize?: number;
  /** Overlap between chunks in characters (default: 200) */
  overlap?: number;
  /** Minimum chunk size - smaller chunks are merged (default: 200) */
  minChunkSize?: number;
}

const DEFAULT_OPTIONS: Required<ChunkOptions> = {
  chunkSize: 1500,
  overlap: 200,
  minChunkSize: 200,
};

/**
 * Split text by paragraphs, preserving natural boundaries
 */
function splitByParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Merge small paragraphs together until they reach minimum size
 */
function mergeParagraphs(paragraphs: string[], minSize: number): string[] {
  const merged: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if (current.length === 0) {
      current = paragraph;
    } else if (current.length + paragraph.length + 2 < minSize) {
      current += '\n\n' + paragraph;
    } else {
      if (current.length >= minSize) {
        merged.push(current);
        current = paragraph;
      } else {
        current += '\n\n' + paragraph;
      }
    }
  }

  if (current.length > 0) {
    merged.push(current);
  }

  return merged;
}

/**
 * Create overlapping chunks from paragraphs
 */
function createOverlappingChunks(
  paragraphs: string[],
  chunkSize: number,
  overlap: number
): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  let paragraphBuffer: string[] = [];

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 <= chunkSize) {
      // Add to current chunk
      currentChunk =
        currentChunk.length === 0
          ? paragraph
          : currentChunk + '\n\n' + paragraph;
      paragraphBuffer.push(paragraph);
    } else {
      // Save current chunk and start new one
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }

      // Calculate overlap - take paragraphs from the end that fit within overlap size
      let overlapContent = '';
      const overlapParagraphs: string[] = [];

      for (let i = paragraphBuffer.length - 1; i >= 0; i--) {
        const p = paragraphBuffer[i]!;
        if (overlapContent.length + p.length + 2 <= overlap) {
          overlapParagraphs.unshift(p);
          overlapContent =
            overlapContent.length === 0 ? p : p + '\n\n' + overlapContent;
        } else {
          break;
        }
      }

      // Start new chunk with overlap + new paragraph
      currentChunk =
        overlapContent.length > 0
          ? overlapContent + '\n\n' + paragraph
          : paragraph;
      paragraphBuffer = [...overlapParagraphs, paragraph];
    }
  }

  // Don't forget the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Chunk a text into meaningful passages for embedding
 */
export function chunkText(text: string, options: ChunkOptions = {}): string[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Split into paragraphs
  let paragraphs = splitByParagraphs(text);

  // Merge very small paragraphs
  paragraphs = mergeParagraphs(paragraphs, opts.minChunkSize);

  // Create overlapping chunks
  const chunks = createOverlappingChunks(
    paragraphs,
    opts.chunkSize,
    opts.overlap
  );

  return chunks;
}

/**
 * Create full TextChunk objects with metadata
 */
export function createChunksWithMetadata(
  text: string,
  sourceId: string,
  philosopher: string,
  title: string,
  author: string,
  options: ChunkOptions = {}
): TextChunk[] {
  const chunkTexts = chunkText(text, options);

  let charOffset = 0;
  const chunks: TextChunk[] = [];

  for (let i = 0; i < chunkTexts.length; i++) {
    const content = chunkTexts[i]!;

    // Find actual position in original text (approximate due to chunking)
    const charStart = text.indexOf(content.slice(0, 100), charOffset);
    const actualStart = charStart !== -1 ? charStart : charOffset;

    chunks.push({
      id: `${sourceId}-chunk-${i}`,
      content,
      metadata: {
        philosopher,
        sourceId,
        title,
        author,
        chunkIndex: i,
        totalChunks: chunkTexts.length,
        startChar: actualStart,
        endChar: actualStart + content.length,
      },
    });

    charOffset = actualStart + Math.floor(content.length / 2); // Move forward for next search
  }

  return chunks;
}

/**
 * Estimate the number of tokens in a text (rough approximation)
 * OpenAI uses ~4 chars per token on average for English
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Get chunk statistics
 */
export function getChunkStats(chunks: TextChunk[]): {
  count: number;
  avgLength: number;
  minLength: number;
  maxLength: number;
  totalChars: number;
  estimatedTokens: number;
} {
  if (chunks.length === 0) {
    return {
      count: 0,
      avgLength: 0,
      minLength: 0,
      maxLength: 0,
      totalChars: 0,
      estimatedTokens: 0,
    };
  }

  const lengths = chunks.map(c => c.content.length);
  const totalChars = lengths.reduce((a, b) => a + b, 0);

  return {
    count: chunks.length,
    avgLength: Math.round(totalChars / chunks.length),
    minLength: Math.min(...lengths),
    maxLength: Math.max(...lengths),
    totalChars,
    estimatedTokens: estimateTokens(totalChars.toString()) * chunks.length,
  };
}
