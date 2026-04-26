import { tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { WEB_SEARCH_MODEL } from '../constants/providers';

export const webSearch = tool({
  description: 'Search the web for information',
  inputSchema: z.object({
    prompt: z.string().describe('The prompt to search the web for'),
  }),
  execute: async ({ prompt }) => {
    try {
      const { text } = await generateText({
        model: openai.responses(WEB_SEARCH_MODEL),
        prompt: prompt,
        tools: {
          // @ts-ignore - OpenAI web search preview types
          web_search_preview: openai.tools.webSearchPreview({
            searchContextSize: 'medium',
          }),
        },
      });

      return text;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return `Web search failed: ${msg}`;
    }
  },
  toModelOutput: ({ output }) => {
    const s = typeof output === 'string' ? output : JSON.stringify(output);
    const max = 8000;
    const value =
      s.length > max
        ? `${s.slice(0, max)}\n\n...[truncated for model context]`
        : s;
    return { type: 'text' as const, value };
  },
});
