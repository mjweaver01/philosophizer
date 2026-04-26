/**
 * Philosopher Query Endpoint
 *
 * Simulates what happens when the agent calls a philosopher tool.
 * Returns the same structured data that would be passed to the agent pipeline,
 * allowing direct querying of philosophers without going through the full agent.
 */

import {
  PHILOSOPHERS,
  getPhilosopher,
  type Philosopher,
} from '../constants/philosophers';
import {
  PHILOSOPHER_QUERY_LIMIT,
  CONTEXT_EXPANSION_THRESHOLD,
  ADJACENT_CHUNK_WINDOW,
  CONTEXT_PREVIEW_LENGTH,
} from '../constants/rag';
import {
  getAdjacentChunks,
  isRAGInitialized,
  queryPassages,
} from '../rag/utils/vectorStore';

// ============================================================================
// TYPES
// ============================================================================

interface PhilosopherQueryRequest {
  philosopherId: string | string[]; // Single philosopher or array of philosophers
  topic: string;
  includeExcerpts?: boolean;
  includeSources?: boolean;
}

interface PhilosopherQueryResponse {
  philosophers: Array<{
    id: string;
    name: string;
    era: string;
    tradition: string;
    description: string;
  }>;
  topic: string;
  response: {
    rawOutput: string; // Full markdown output (what the tool returns)
    structured: {
      keyTeachings: string[];
      keyConcepts: Array<{
        name: string;
        explanation: string;
        relatedTerms?: string[];
      }>;
      notableWorks: string[];
      textSources?: Array<{
        title: string;
        url: string;
        description?: string;
      }>;
      ragPassages?: Array<{
        title: string;
        content: string;
        relevanceScore: number;
        hasContext?: boolean;
      }>;
      keyExcerpts?: Array<{
        work: string;
        passage: string;
        context?: string;
      }>;
      famousQuotes: string[];
    };
  };
}

// ============================================================================
// RAG INTEGRATION
// ============================================================================

/**
 * Query the RAG system for relevant passages with expanded context
 */
async function queryRAG(
  philosopherKeys: string | string[],
  topic: string
): Promise<{
  found: boolean;
  passages: string;
  structured: Array<{
    title: string;
    content: string;
    relevanceScore: number;
    hasContext?: boolean;
  }>;
}> {
  try {
    if (!(await isRAGInitialized())) {
      return { found: false, passages: '', structured: [] };
    }

    const results = await queryPassages(topic, {
      philosopher: philosopherKeys,
      limit: PHILOSOPHER_QUERY_LIMIT,
    });

    if (results.length === 0) {
      return { found: false, passages: '', structured: [] };
    }

    const philosopherLabel = Array.isArray(philosopherKeys)
      ? `${philosopherKeys.length} philosophers`
      : philosopherKeys;
    let passages = `\n### 📚 Relevant Passages from Primary Sources\n`;
    passages += `*Query: "${topic}" (${philosopherLabel}) — Found ${results.length} relevant passages*\n`;

    const structured: Array<{
      title: string;
      content: string;
      relevanceScore: number;
      hasContext?: boolean;
    }> = [];

    for (const result of results) {
      const relevancePercent = (result.relevanceScore * 100).toFixed(0);
      passages += `\n**From "${result.title}"** *(${relevancePercent}% match)*\n`;

      let fullContent = result.content;
      let hasContext = false;

      // For high-relevance results, fetch surrounding context
      if (result.relevanceScore > CONTEXT_EXPANSION_THRESHOLD) {
        try {
          const adjacentChunks = await getAdjacentChunks(
            result.sourceId,
            result.chunkIndex,
            ADJACENT_CHUNK_WINDOW
          );

          const preceding = adjacentChunks.find(
            c => c.chunkIndex === result.chunkIndex - 1
          );
          const following = adjacentChunks.find(
            c => c.chunkIndex === result.chunkIndex + 1
          );

          if (preceding) {
            const previewText = preceding.content
              .slice(-CONTEXT_PREVIEW_LENGTH)
              .trim();
            passages += `> [...] ${previewText}\n>\n`;
            fullContent = `[...] ${previewText}\n\n${fullContent}`;
            hasContext = true;
          }

          passages += `> ${result.content}\n`;

          if (following) {
            const previewText = following.content
              .slice(0, CONTEXT_PREVIEW_LENGTH)
              .trim();
            passages += `>\n> ${previewText} [...]\n`;
            fullContent = `${fullContent}\n\n${previewText} [...]`;
            hasContext = true;
          }
        } catch {
          passages += `> ${result.content}\n`;
        }
      } else {
        passages += `> ${result.content}\n`;
      }

      structured.push({
        title: result.title,
        content: fullContent,
        relevanceScore: result.relevanceScore,
        hasContext,
      });
    }

    return { found: true, passages, structured };
  } catch {
    console.log('[Philosopher Query] RAG not available, using static content');
    return { found: false, passages: '', structured: [] };
  }
}

// ============================================================================
// PHILOSOPHER TOOL EXECUTION
// ============================================================================

/**
 * Execute philosopher tool logic - mirrors what happens in the agent pipeline
 * Supports both single and multiple philosophers
 */
async function executePhilosopherQuery(
  keys: string | string[],
  philosophers: Philosopher | Philosopher[],
  topic: string,
  includeExcerpts: boolean = true,
  includeSources: boolean = true
): Promise<PhilosopherQueryResponse> {
  // Normalize to arrays for consistent processing
  const philosopherArray = Array.isArray(philosophers)
    ? philosophers
    : [philosophers];
  const keyArray = Array.isArray(keys) ? keys : [keys];

  // Build raw markdown output (what the tool returns to the agent)
  let output = '';

  // Aggregated data structures
  const allKeyTeachings: string[] = [];
  const allKeyConcepts: Array<{
    name: string;
    explanation: string;
    relatedTerms?: string[];
  }> = [];
  const allNotableWorks: string[] = [];
  const allTextSources: Array<{
    title: string;
    url: string;
    description?: string;
  }> = [];
  const allKeyExcerpts: Array<{
    work: string;
    passage: string;
    context?: string;
  }> = [];
  const allFamousQuotes: string[] = [];

  // Process each philosopher
  if (philosopherArray.length === 1) {
    // Single philosopher - use original format
    const philosopher = philosopherArray[0]!;
    output = `## ${philosopher.name} (${philosopher.era})\n`;
    output += `*${philosopher.tradition}*\n\n`;
    output += `### About\n${philosopher.description}\n\n`;

    output += `### Key Teachings\n`;
    philosopher.keyTeachings.forEach(teaching => {
      output += `- ${teaching}\n`;
      allKeyTeachings.push(teaching);
    });

    output += `\n### Key Concepts\n`;
    philosopher.keyConcepts.forEach(concept => {
      output += `\n**${concept.name}**\n`;
      output += `${concept.explanation}\n`;
      if (concept.relatedTerms && concept.relatedTerms.length > 0) {
        output += `*Related: ${concept.relatedTerms.join(', ')}*\n`;
      }
      allKeyConcepts.push(concept);
    });

    output += `\n### Notable Works\n`;
    philosopher.notableWorks.forEach(work => {
      output += `- ${work}\n`;
      allNotableWorks.push(work);
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
        allTextSources.push({
          title: source.title,
          url: source.url,
          description: source.description,
        });
      });
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
        allKeyExcerpts.push(excerpt);
      });
    }

    output += `\n### Famous Quotes\n`;
    philosopher.famousQuotes.forEach(quote => {
      output += `> "${quote}"\n\n`;
      allFamousQuotes.push(quote);
    });
  } else {
    // Multiple philosophers - comparative format
    output = `## Multiple Philosophers on: ${topic}\n\n`;

    philosopherArray.forEach((philosopher, index) => {
      output += `### ${index + 1}. ${philosopher.name} (${philosopher.era})\n`;
      output += `*${philosopher.tradition}*\n\n`;
      output += `${philosopher.description}\n\n`;

      output += `**Key Teachings:**\n`;
      philosopher.keyTeachings.forEach(teaching => {
        output += `- ${teaching}\n`;
        allKeyTeachings.push(`[${philosopher.name}] ${teaching}`);
      });

      output += `\n**Key Concepts:**\n`;
      philosopher.keyConcepts.forEach(concept => {
        output += `- **${concept.name}**: ${concept.explanation}\n`;
        allKeyConcepts.push(concept);
      });

      output += `\n**Notable Works:** ${philosopher.notableWorks.join(', ')}\n\n`;
      allNotableWorks.push(...philosopher.notableWorks);

      if (includeSources && philosopher.textSources.length > 0) {
        philosopher.textSources.forEach(source => {
          allTextSources.push({
            title: source.title,
            url: source.url,
            description: source.description,
          });
        });
      }

      if (includeExcerpts && philosopher.keyExcerpts.length > 0) {
        allKeyExcerpts.push(...philosopher.keyExcerpts);
      }

      allFamousQuotes.push(
        ...philosopher.famousQuotes.map(q => `[${philosopher.name}] ${q}`)
      );

      output += `---\n\n`;
    });
  }

  // RAG-powered relevant passages (queries all specified philosophers)
  const ragResult = await queryRAG(keyArray, topic);
  if (ragResult.found) {
    output += ragResult.passages;
  }

  output += `\n---\n`;
  output += `**Topic requested:** "${topic}"\n\n`;
  const philosopherNames = philosopherArray.map(p => p.name).join(', ');
  output += `*Use this comprehensive context—including ${philosopherNames}'s key concepts, semantically-searched passages from their works, and philosophical traditions—to formulate a thoughtful response that authentically reflects their perspectives.*`;

  // Build structured response
  return {
    philosophers: philosopherArray.map(p => ({
      id: p.id,
      name: p.name,
      era: p.era,
      tradition: p.tradition,
      description: p.description,
    })),
    topic,
    response: {
      rawOutput: output,
      structured: {
        keyTeachings: allKeyTeachings,
        keyConcepts: allKeyConcepts,
        notableWorks: allNotableWorks,
        textSources: includeSources ? allTextSources : undefined,
        ragPassages: ragResult.found ? ragResult.structured : undefined,
        keyExcerpts: includeExcerpts ? allKeyExcerpts : undefined,
        famousQuotes: allFamousQuotes,
      },
    },
  };
}

// ============================================================================
// ENDPOINT
// ============================================================================

/**
 * POST /ask
 *
 * Ask one or more philosophers a question and get the tool response
 * that would be returned to the agent pipeline.
 *
 * Request body:
 * {
 *   "philosopherId": "plato",  // or ["plato", "aristotle"] for multiple
 *   "topic": "What is justice?",
 *   "includeExcerpts": true,  // optional, default true
 *   "includeSources": true    // optional, default true
 * }
 */
export const philosopherQueryEndpoint = {
  POST: async (req: Request) => {
    try {
      const body = (await req.json()) as PhilosopherQueryRequest;

      // Validate request
      if (!body.philosopherId) {
        return new Response(
          JSON.stringify({ error: 'Missing required field: philosopherId' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (!body.topic) {
        return new Response(
          JSON.stringify({ error: 'Missing required field: topic' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Normalize to array for processing
      const philosopherIds = Array.isArray(body.philosopherId)
        ? body.philosopherId
        : [body.philosopherId];

      // Get philosophers
      const philosophers: Philosopher[] = [];
      const notFound: string[] = [];

      for (const id of philosopherIds) {
        const philosopher = getPhilosopher(id);
        if (philosopher) {
          philosophers.push(philosopher);
        } else {
          notFound.push(id);
        }
      }

      if (notFound.length > 0) {
        return new Response(
          JSON.stringify({
            error: 'Philosopher(s) not found',
            notFound,
            availablePhilosophers: Object.keys(PHILOSOPHERS),
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Execute philosopher tool logic
      const result = await executePhilosopherQuery(
        philosopherIds,
        philosophers,
        body.topic,
        body.includeExcerpts ?? true,
        body.includeSources ?? true
      );

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('[Philosopher Query] Error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },

  /**
   * GET /ask?philosopherId=plato&topic=What+is+justice?
   * GET /ask?philosopherId=plato,aristotle&topic=What+is+justice?
   *
   * Alternative GET endpoint for simple queries
   * Supports comma-separated philosopher IDs for multiple philosophers
   */
  GET: async (req: Request) => {
    try {
      const url = new URL(req.url);
      const philosopherIdParam = url.searchParams.get('philosopherId');
      const topic = url.searchParams.get('topic');
      const includeExcerpts =
        url.searchParams.get('includeExcerpts') !== 'false';
      const includeSources = url.searchParams.get('includeSources') !== 'false';

      if (!philosopherIdParam) {
        return new Response(
          JSON.stringify({
            error: 'Missing required parameter: philosopherId',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (!topic) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameter: topic' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Parse comma-separated philosopher IDs
      const philosopherIds = philosopherIdParam.split(',').map(id => id.trim());

      // Get philosophers
      const philosophers: Philosopher[] = [];
      const notFound: string[] = [];

      for (const id of philosopherIds) {
        const philosopher = getPhilosopher(id);
        if (philosopher) {
          philosophers.push(philosopher);
        } else {
          notFound.push(id);
        }
      }

      if (notFound.length > 0) {
        return new Response(
          JSON.stringify({
            error: 'Philosopher(s) not found',
            notFound,
            availablePhilosophers: Object.keys(PHILOSOPHERS),
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const result = await executePhilosopherQuery(
        philosopherIds,
        philosophers,
        topic,
        includeExcerpts,
        includeSources
      );

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('[Philosopher Query] Error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
