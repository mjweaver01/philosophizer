/**
 * Philosopher Tools
 *
 * AI tools for consulting the wisdom of history's greatest philosophers and theologians.
 * Uses the unified philosopher constants and RAG system for semantic search.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { PHILOSOPHERS, type Philosopher } from '../constants/philosophers';
import {
  PHILOSOPHER_QUERY_LIMIT,
  CONTEXT_EXPANSION_THRESHOLD,
  ADJACENT_CHUNK_WINDOW,
  CONTEXT_PREVIEW_LENGTH,
} from '../constants/rag';
import { queryPhilosopher, isRAGInitialized, getAdjacentChunks } from '../rag';

// ============================================================================
// RAG INTEGRATION
// ============================================================================

/**
 * Query the RAG system for relevant passages with expanded context
 * Uses query augmentation and adjacent chunk retrieval for better results
 */
async function queryRAG(
  philosopherKey: string,
  topic: string
): Promise<{ found: boolean; passages: string }> {
  try {
    // Check if RAG is initialized
    if (!(await isRAGInitialized())) {
      return { found: false, passages: '' };
    }

    // Query for relevant passages
    const results = await queryPhilosopher(
      philosopherKey,
      topic,
      PHILOSOPHER_QUERY_LIMIT
    );

    if (results.length === 0) {
      return { found: false, passages: '' };
    }

    // Format the results with expanded context for high-relevance matches
    let passages = `\n### 📚 Relevant Passages from Primary Sources\n`;
    passages += `*Query: "${topic}" — Found ${results.length} relevant passages*\n`;

    for (const result of results) {
      const relevancePercent = (result.relevanceScore * 100).toFixed(0);
      passages += `\n**From "${result.title}"** *(${relevancePercent}% match)*\n`;

      // For high-relevance results, fetch surrounding context
      if (result.relevanceScore > CONTEXT_EXPANSION_THRESHOLD) {
        try {
          const adjacentChunks = await getAdjacentChunks(
            result.sourceId,
            result.chunkIndex,
            ADJACENT_CHUNK_WINDOW
          );

          // Find preceding and following context
          const preceding = adjacentChunks.find(
            c => c.chunkIndex === result.chunkIndex - 1
          );
          const following = adjacentChunks.find(
            c => c.chunkIndex === result.chunkIndex + 1
          );

          if (preceding) {
            // Show last N chars of preceding context
            const previewText = preceding.content
              .slice(-CONTEXT_PREVIEW_LENGTH)
              .trim();
            passages += `> [...] ${previewText}\n>\n`;
          }

          passages += `> ${result.content}\n`;

          if (following) {
            // Show first N chars of following context
            const previewText = following.content
              .slice(0, CONTEXT_PREVIEW_LENGTH)
              .trim();
            passages += `>\n> ${previewText} [...]\n`;
          }
        } catch {
          // Fall back to just the main passage
          passages += `> ${result.content}\n`;
        }
      } else {
        passages += `> ${result.content}\n`;
      }
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
// PHILOSOPHER TOOL GENERATION
// ============================================================================

/**
 * Programmatically create all philosopher tools from the PHILOSOPHERS object.
 * This eliminates the need to manually export each philosopher tool.
 * Simply add a philosopher to the PHILOSOPHERS constant and it will automatically
 * be available as a tool.
 */
export const philosopherTools = Object.entries(PHILOSOPHERS).reduce(
  (tools, [key, philosopher]) => {
    tools[key] = createPhilosopherTool(key, philosopher);
    return tools;
  },
  {} as Record<string, ReturnType<typeof createPhilosopherTool>>
);

/**
 * Get the list of all available philosopher tool names
 */
export function getAvailablePhilosophers(): string[] {
  return Object.keys(philosopherTools);
}
