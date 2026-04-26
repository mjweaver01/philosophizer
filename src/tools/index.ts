import { webSearch } from './webSearch';
import { readUrl } from './readUrl';
import { wikipedia } from './wikipedia';
import { newsSearch } from './newsSearch';
import { createNotesTools } from './notes';
import { createMemoryTools } from './memories';
import { philosopherTools } from './philosophers';

/**
 * Create tools with user context (and optional conversation for scoped notes).
 */
export function createTools(userId: string, conversationId?: string) {
  const memoryTools = createMemoryTools(userId);
  const notesTools = createNotesTools(userId, conversationId);

  return {
    webSearch,
    readUrl,
    wikipedia,
    newsSearch,
    ...notesTools,
    ...memoryTools,
    ...philosopherTools,
  };
}
