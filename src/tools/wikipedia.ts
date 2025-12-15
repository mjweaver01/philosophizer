import { tool } from 'ai';
import { z } from 'zod';

interface WikiSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

interface WikiPage {
  title: string;
  extract: string;
  pageid: number;
}

export const wikipedia = tool({
  description:
    'Search Wikipedia for factual information on a topic. Returns article summaries and key facts. Great for background research, definitions, and established knowledge.',
  inputSchema: z.object({
    query: z.string().describe('The topic or term to search on Wikipedia'),
    getFullArticle: z
      .boolean()
      .optional()
      .describe(
        'If true, returns more content from the article (default: false, returns intro only)'
      ),
  }),
  execute: async ({ query, getFullArticle = false }) => {
    try {
      // Search for matching articles
      const searchUrl = new URL('https://en.wikipedia.org/w/api.php');
      searchUrl.searchParams.set('action', 'query');
      searchUrl.searchParams.set('list', 'search');
      searchUrl.searchParams.set('srsearch', query);
      searchUrl.searchParams.set('format', 'json');
      searchUrl.searchParams.set('srlimit', '5');
      searchUrl.searchParams.set('origin', '*');

      const searchRes = await fetch(searchUrl.toString());
      if (!searchRes.ok) {
        return `Wikipedia API error: ${searchRes.status}`;
      }

      const searchData = await searchRes.json();
      const results: WikiSearchResult[] = searchData.query?.search || [];

      if (results.length === 0) {
        return `No Wikipedia articles found for "${query}". Try a different search term or check spelling.`;
      }

      // Get the full extract of the top result
      const topResult = results[0];
      const extractUrl = new URL('https://en.wikipedia.org/w/api.php');
      extractUrl.searchParams.set('action', 'query');
      extractUrl.searchParams.set('titles', topResult?.title || '');
      extractUrl.searchParams.set('prop', 'extracts');
      if (!getFullArticle) {
        extractUrl.searchParams.set('exintro', '1');
      }
      extractUrl.searchParams.set('explaintext', '1');
      extractUrl.searchParams.set('exsectionformat', 'plain');
      extractUrl.searchParams.set('format', 'json');
      extractUrl.searchParams.set('origin', '*');

      const extractRes = await fetch(extractUrl.toString());
      if (!extractRes.ok) {
        return `Wikipedia API error: ${extractRes.status}`;
      }

      const extractData = await extractRes.json();
      const pages = extractData.query?.pages || {};
      const page: WikiPage = Object.values(pages)[0] as WikiPage;

      if (!page || !page.extract) {
        return `Found article "${topResult?.title || ''}" but could not retrieve content.`;
      }

      // Format output
      let output = `## ${page.title}\n\n`;

      // Truncate if too long
      const maxLength = getFullArticle ? 8000 : 3000;
      if (page.extract.length > maxLength) {
        output += page.extract.slice(0, maxLength) + '...\n\n';
        output += `*[Content truncated. Full article: https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}]*`;
      } else {
        output += page.extract;
      }

      // Add other search results as "See also"
      if (results.length > 1) {
        output += '\n\n**Related articles:**\n';
        results.slice(1, 4).forEach(r => {
          output += `- ${r.title}\n`;
        });
      }

      return output;
    } catch (error) {
      return `Wikipedia error: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
