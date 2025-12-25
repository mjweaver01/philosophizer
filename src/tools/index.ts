import { webSearch } from './webSearch';
import { readUrl } from './readUrl';
import { wikipedia } from './wikipedia';
import { newsSearch } from './newsSearch';
import { saveNote, recallNotes, clearNotes } from './notes';
import { createMemoryTools } from './memories';
import { philosopherTools } from './philosophers';

/**
 * Create tools with user context
 */
export function createTools(userId: string) {
  const memoryTools = createMemoryTools(userId);

  return {
    webSearch,
    readUrl,
    wikipedia,
    newsSearch,
    saveNote,
    recallNotes,
    clearNotes,
    ...memoryTools,
    ...philosopherTools,
  };
}
