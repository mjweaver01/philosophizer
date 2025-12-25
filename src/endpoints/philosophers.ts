import {
  PHILOSOPHERS,
  getAllPhilosopherIds,
  getPhilosopher,
  type Philosopher,
  type TextSource,
} from '../constants/philosophers';
import { getCollectionStats } from '../rag/utils/vectorStore';

interface TextSourceWithStatus extends TextSource {
  indexedChunks: number;
  isIndexed: boolean;
}

interface PhilosopherSummary {
  id: string;
  name: string;
  era: string;
  tradition: string;
  description: string;
  notableWorks: string[];
  textSourceCount: number;
  indexedChunks: number;
}

interface PhilosopherDetail extends PhilosopherSummary {
  keyTeachings: string[];
  famousQuotes: string[];
  areasOfExpertise: string[];
  textSources: TextSourceWithStatus[];
}

/**
 * Philosophers endpoint - returns philosopher data with indexing status
 */
export const philosophersEndpoint = {
  GET: async (_req: Request) => {
    try {
      const philosopherIds = getAllPhilosopherIds();

      // Get indexing stats
      let stats: {
        byPhilosopher: Record<string, number>;
        bySource: Record<string, number>;
      } | null = null;
      try {
        stats = await getCollectionStats();
      } catch {
        // Vector store might not be available
      }

      const philosophers: PhilosopherSummary[] = philosopherIds.map(id => {
        const p = PHILOSOPHERS[id] as Philosopher;
        return {
          id: p.id,
          name: p.name,
          era: p.era,
          tradition: p.tradition,
          description: p.description,
          notableWorks: p.notableWorks,
          textSourceCount: p.textSources.length,
          indexedChunks: stats?.byPhilosopher[p.id] || 0,
        };
      });

      // Group by tradition
      const byTradition: Record<string, PhilosopherSummary[]> = {};
      for (const p of philosophers) {
        if (!byTradition[p.tradition]) {
          byTradition[p.tradition] = [];
        }
        byTradition[p.tradition]!.push(p);
      }

      // Calculate total indexed texts
      const totalIndexedTexts = stats ? Object.keys(stats.bySource).length : 0;

      return new Response(
        JSON.stringify({
          totalPhilosophers: philosophers.length,
          totalIndexedChunks: stats
            ? Object.values(stats.byPhilosopher).reduce((a, b) => a + b, 0)
            : 0,
          totalIndexedTexts,
          byTradition,
          philosophers,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Philosophers endpoint error:', error);
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

/**
 * Single philosopher endpoint - returns detailed info including text sources
 */
export const philosopherDetailEndpoint = {
  GET: async (req: Request) => {
    try {
      const url = new URL(req.url);
      const id = url.pathname.split('/').pop();

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing philosopher ID' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const philosopher = getPhilosopher(id);

      if (!philosopher) {
        return new Response(
          JSON.stringify({ error: 'Philosopher not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Get indexing stats
      let stats: {
        byPhilosopher: Record<string, number>;
        bySource: Record<string, number>;
      } | null = null;
      try {
        stats = await getCollectionStats();
      } catch {
        // Vector store might not be available
      }

      // Add indexing status to text sources
      const textSources: TextSourceWithStatus[] = philosopher.textSources.map(
        source => ({
          ...source,
          indexedChunks: stats?.bySource[source.id] || 0,
          isIndexed: (stats?.bySource[source.id] || 0) > 0,
        })
      );

      const detail: PhilosopherDetail = {
        id: philosopher.id,
        name: philosopher.name,
        era: philosopher.era,
        tradition: philosopher.tradition,
        description: philosopher.description,
        notableWorks: philosopher.notableWorks,
        textSourceCount: philosopher.textSources.length,
        indexedChunks: stats?.byPhilosopher[philosopher.id] || 0,
        keyTeachings: philosopher.keyTeachings,
        famousQuotes: philosopher.famousQuotes,
        areasOfExpertise: philosopher.areasOfExpertise,
        textSources,
      };

      return new Response(JSON.stringify(detail), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Philosopher detail error:', error);
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
