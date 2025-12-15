/**
 * RAG Text Sources
 *
 * This file re-exports text sources from the unified philosopher constants.
 * The actual data is maintained in src/constants/philosophers.ts
 */

import {
  getAllTextSources,
  getTextSourcesForPhilosopher,
  getAllPhilosopherIds,
  type TextSource as PhilosopherTextSource,
} from '../constants/philosophers';

export interface TextSource {
  id: string;
  title: string;
  author: string;
  philosopher: string;
  url: string;
  format: 'txt' | 'html';
  description?: string;
}

/**
 * Get all text sources formatted for RAG indexing
 */
export const TEXT_SOURCES: TextSource[] = getAllTextSources().map(source => ({
  id: source.id,
  title: source.title,
  author: source.title, // Will be overwritten with philosopher name
  philosopher: source.philosopher,
  url: source.url,
  format: source.format,
  description: source.description,
}));

/**
 * Group sources by philosopher
 */
export function getSourcesByPhilosopher(philosopher: string): TextSource[] {
  return TEXT_SOURCES.filter(s => s.philosopher === philosopher);
}

/**
 * Get all unique philosophers that have text sources
 */
export function getAllPhilosophers(): string[] {
  return [...new Set(TEXT_SOURCES.map(s => s.philosopher))];
}

// Re-export types and functions for convenience
export type { PhilosopherTextSource };
export {
  getAllTextSources,
  getTextSourcesForPhilosopher,
  getAllPhilosopherIds,
};
