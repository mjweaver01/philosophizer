import {
  queryPassages,
  getCollectionStats,
  type QueryResult,
} from '../rag/utils/vectorStore';

interface RagQueryRequest {
  query: string;
  philosopher?: string;
  sourceId?: string;
  limit?: number;
  minScore?: number;
}

interface RagQueryResponse {
  results: QueryResult[];
  query: string;
  elapsed: number;
}

interface RagStatsResponse {
  totalChunks: number;
  byPhilosopher: Record<string, number>;
  bySource: Record<string, number>;
}

export const rag = {
  /**
   * POST /rag - Query the vector store for relevant passages
   */
  POST: async (req: Request) => {
    try {
      const body = (await req.json()) as RagQueryRequest;

      if (!body.query || typeof body.query !== 'string') {
        return new Response(
          JSON.stringify({
            error: "Missing or invalid 'query' parameter",
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const startTime = Date.now();
      const results = await queryPassages(body.query, {
        philosopher: body.philosopher,
        sourceId: body.sourceId,
        limit: body.limit,
        minScore: body.minScore,
      });
      const elapsed = Date.now() - startTime;

      const response: RagQueryResponse = {
        results,
        query: body.query,
        elapsed,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('RAG query error:', error);
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
   * GET /rag - Get collection statistics
   */
  GET: async (_req: Request) => {
    try {
      const stats = await getCollectionStats();

      const response: RagStatsResponse = {
        totalChunks: stats.totalChunks,
        byPhilosopher: stats.byPhilosopher,
        bySource: stats.bySource,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('RAG stats error:', error);
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

