/**
 * Unified Philosopher Constants
 *
 * This file contains all philosopher/theologian data including:
 * - Biographical information
 * - Key teachings and concepts
 * - Primary source texts with Gutenberg URLs
 * - Key excerpts and quotes
 *
 * Used by both the philosopher tools and the RAG indexing system.
 */

import { greekPhilosophers } from './greek';
import { stoicPhilosophers } from './stoic';
import { christianPhilosophers } from './christian';
import { easternPhilosophers } from './eastern';
import { hermeticPhilosophers } from './hermetic';
import { modernPhilosophers } from './modern';
import { jewishPhilosophers } from './jewish';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TextSource {
  id: string;
  title: string;
  url: string;
  format: 'txt' | 'html';
  description?: string;
}

export interface KeyConcept {
  name: string;
  explanation: string;
  relatedTerms?: string[];
}

export interface KeyExcerpt {
  work: string;
  passage: string;
  context?: string;
}

export interface Philosopher {
  id: string;
  name: string;
  era: string;
  tradition: string;
  description: string;
  keyTeachings: string[];
  keyConcepts: KeyConcept[];
  notableWorks: string[];
  textSources: TextSource[];
  keyExcerpts: KeyExcerpt[];
  famousQuotes: string[];
  areasOfExpertise: string[];
}

// ============================================================================
// PHILOSOPHER DATA
// ============================================================================

export const PHILOSOPHERS = {
  ...greekPhilosophers,
  ...stoicPhilosophers,
  ...christianPhilosophers,
  ...easternPhilosophers,
  ...hermeticPhilosophers,
  ...modernPhilosophers,
  ...jewishPhilosophers,
} as Record<string, Philosopher>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a philosopher by ID
 */
export function getPhilosopher(id: string): Philosopher | undefined {
  return PHILOSOPHERS[id];
}

/**
 * Get all philosopher IDs
 */
export function getAllPhilosopherIds(): string[] {
  return Object.keys(PHILOSOPHERS);
}

/**
 * Get all text sources across all philosophers
 */
export function getAllTextSources(): Array<
  TextSource & { philosopher: string }
> {
  const sources: Array<TextSource & { philosopher: string }> = [];

  for (const [philosopherId, philosopher] of Object.entries(PHILOSOPHERS)) {
    for (const source of philosopher.textSources) {
      sources.push({ ...source, philosopher: philosopherId });
    }
  }

  return sources;
}

/**
 * Get text sources for a specific philosopher
 */
export function getTextSourcesForPhilosopher(
  philosopherId: string
): TextSource[] {
  return PHILOSOPHERS[philosopherId]?.textSources || [];
}

/**
 * Get philosophers by tradition
 */
export function getPhilosophersByTradition(tradition: string): Philosopher[] {
  return Object.values(PHILOSOPHERS).filter(p =>
    p.tradition.toLowerCase().includes(tradition.toLowerCase())
  );
}

/**
 * Get philosophers by area of expertise
 */
export function getPhilosophersByExpertise(expertise: string): Philosopher[] {
  return Object.values(PHILOSOPHERS).filter(p =>
    p.areasOfExpertise.some(e =>
      e.toLowerCase().includes(expertise.toLowerCase())
    )
  );
}
