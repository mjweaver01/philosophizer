/**
 * Philosopher Tools
 *
 * AI tools for consulting the wisdom of history's greatest philosophers and theologians.
 * Uses the unified philosopher constants and RAG system for semantic search.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { PHILOSOPHERS, type Philosopher } from '../constants/philosophers';

// ============================================================================
// RAG INTEGRATION
// ============================================================================

/**
 * Query the RAG system for relevant passages (dynamic import to avoid circular deps)
 */
async function queryRAG(
  philosopherKey: string,
  topic: string
): Promise<{ found: boolean; passages: string }> {
  try {
    const { queryPhilosopher, isRAGInitialized } = await import('../rag');

    // Check if RAG is initialized
    if (!(await isRAGInitialized())) {
      return { found: false, passages: '' };
    }

    // Query for relevant passages
    const results = await queryPhilosopher(philosopherKey, topic, 5);

    if (results.length === 0) {
      return { found: false, passages: '' };
    }

    // Format the results
    let passages = `\n### 📚 Relevant Passages from Primary Sources (on "${topic}")\n`;
    passages += `*Found ${results.length} relevant passages via semantic search*\n`;

    for (const result of results) {
      passages += `\n**From "${result.title}"** *(relevance: ${(result.relevanceScore * 100).toFixed(0)}%)*\n`;
      passages += `> ${result.content}\n`;
    }

    return { found: true, passages };
  } catch (error) {
    // RAG not available - fall back to static content
    console.log('[Philosopher Tool] RAG not available, using static content');
    return { found: false, passages: '' };
  }
}

// ============================================================================
// TOOL FACTORY
// ============================================================================

/**
 * Create a philosopher tool from the unified constants
 */
function createPhilosopherTool(key: string, philosopher: Philosopher) {
  return tool({
    description: `Consult the wisdom of ${philosopher.name} (${philosopher.era}). ${philosopher.description} Expert in: ${philosopher.areasOfExpertise.join(', ')}.`,
    inputSchema: z.object({
      topic: z
        .string()
        .describe(
          `The philosophical, ethical, or spiritual topic to explore through the lens of ${philosopher.name}'s teachings`
        ),
      includeExcerpts: z
        .boolean()
        .optional()
        .describe('Include key excerpts from primary sources (default: true)'),
      includeSources: z
        .boolean()
        .optional()
        .describe('Include links to primary source texts (default: true)'),
    }),
    execute: async ({
      topic,
      includeExcerpts = true,
      includeSources = true,
    }) => {
      let output = `## ${philosopher.name} (${philosopher.era})\n`;
      output += `*${philosopher.tradition}*\n\n`;
      output += `### About\n${philosopher.description}\n\n`;

      output += `### Key Teachings\n`;
      philosopher.keyTeachings.forEach(teaching => {
        output += `- ${teaching}\n`;
      });

      // Key Concepts with detailed explanations
      output += `\n### Key Concepts\n`;
      philosopher.keyConcepts.forEach(concept => {
        output += `\n**${concept.name}**\n`;
        output += `${concept.explanation}\n`;
        if (concept.relatedTerms && concept.relatedTerms.length > 0) {
          output += `*Related: ${concept.relatedTerms.join(', ')}*\n`;
        }
      });

      output += `\n### Notable Works\n`;
      philosopher.notableWorks.forEach(work => {
        output += `- ${work}\n`;
      });

      // Primary Sources with URLs
      if (includeSources && philosopher.textSources.length > 0) {
        output += `\n### Primary Source Texts\n`;
        philosopher.textSources.forEach(source => {
          output += `- **[${source.title}](${source.url})**`;
          if (source.description) {
            output += ` — ${source.description}`;
          }
          output += `\n`;
        });
      }

      // RAG-powered relevant passages (semantic search through primary sources)
      const ragResult = await queryRAG(key, topic);
      if (ragResult.found) {
        output += ragResult.passages;
      }

      // Key Excerpts from works (static, curated excerpts)
      if (includeExcerpts && philosopher.keyExcerpts.length > 0) {
        output += `\n### Curated Key Excerpts\n`;
        philosopher.keyExcerpts.forEach(excerpt => {
          output += `\n**${excerpt.work}**\n`;
          output += `> "${excerpt.passage}"\n`;
          if (excerpt.context) {
            output += `*Context: ${excerpt.context}*\n`;
          }
        });
      }

      output += `\n### Famous Quotes\n`;
      philosopher.famousQuotes.forEach(quote => {
        output += `> "${quote}"\n\n`;
      });

      output += `\n---\n`;
      output += `**Topic requested:** "${topic}"\n\n`;
      output += `*Use this comprehensive context—including ${philosopher.name}'s key concepts, semantically-searched passages from their works, and philosophical tradition—to formulate a thoughtful response that authentically reflects their perspective.*`;

      return output;
    },
  });
}

// ============================================================================
// EXPORTED TOOLS
// ============================================================================

// Ancient Greek Philosophy
export const aristotle = createPhilosopherTool(
  'aristotle',
  PHILOSOPHERS.aristotle!
);
export const plato = createPhilosopherTool('plato', PHILOSOPHERS.plato!);
export const socrates = createPhilosopherTool(
  'socrates',
  PHILOSOPHERS.socrates!
);

// Stoicism
export const marcusAurelius = createPhilosopherTool(
  'marcusAurelius',
  PHILOSOPHERS.marcusAurelius!
);
export const epictetus = createPhilosopherTool(
  'epictetus',
  PHILOSOPHERS.epictetus!
);
export const seneca = createPhilosopherTool('seneca', PHILOSOPHERS.seneca!);

// Christian Theology
export const paulTheApostle = createPhilosopherTool(
  'paulTheApostle',
  PHILOSOPHERS.paulTheApostle!
);
export const augustine = createPhilosopherTool(
  'augustine',
  PHILOSOPHERS.augustine!
);
export const thomasAquinas = createPhilosopherTool(
  'thomasAquinas',
  PHILOSOPHERS.thomasAquinas!
);
export const martinLuther = createPhilosopherTool(
  'martinLuther',
  PHILOSOPHERS.martinLuther!
);
export const csLewis = createPhilosopherTool('csLewis', PHILOSOPHERS.csLewis!);

// Eastern Philosophy
export const confucius = createPhilosopherTool(
  'confucius',
  PHILOSOPHERS.confucius!
);
export const buddha = createPhilosopherTool('buddha', PHILOSOPHERS.buddha!);

// Modern Philosophy
export const kant = createPhilosopherTool('kant', PHILOSOPHERS.kant!);
export const nietzsche = createPhilosopherTool(
  'nietzsche',
  PHILOSOPHERS.nietzsche!
);
export const kierkegaard = createPhilosopherTool(
  'kierkegaard',
  PHILOSOPHERS.kierkegaard!
);

// ============================================================================
// TOOL COLLECTION
// ============================================================================

/**
 * All philosopher tools as a collection for easy spreading into tools object
 */
export const philosopherTools = {
  // Ancient Greek
  aristotle,
  plato,
  socrates,

  // Stoicism
  marcusAurelius,
  epictetus,
  seneca,

  // Christian Theology
  paulTheApostle,
  augustine,
  thomasAquinas,
  martinLuther,
  csLewis,

  // Eastern Philosophy
  confucius,
  buddha,

  // Modern Philosophy
  kant,
  nietzsche,
  kierkegaard,
};

/**
 * Get the list of all available philosopher tool names
 */
export function getAvailablePhilosophers(): string[] {
  return Object.keys(philosopherTools);
}
