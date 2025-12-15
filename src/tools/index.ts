import { webSearch } from './webSearch';
import { readUrl } from './readUrl';
import { wikipedia } from './wikipedia';
import { newsSearch } from './newsSearch';
import { saveNote, recallNotes, clearNotes } from './notes';
import { philosopherTools } from './philosophers';

export const tools = {
  webSearch,
  readUrl,
  wikipedia,
  newsSearch,
  saveNote,
  recallNotes,
  clearNotes,
  ...philosopherTools,
};
