import { tool, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { WEB_SEARCH_MODEL } from '../constants/providers';

export const newsSearch = tool({
  description:
    'Search for recent news articles on a topic. Best for current events, breaking news, recent developments, and time-sensitive information.',
  inputSchema: z.object({
    query: z.string().describe('The news topic to search for'),
    timeframe: z
      .enum(['day', 'week', 'month'])
      .optional()
      .describe('How recent the news should be (default: week)'),
  }),
  execute: async ({ query, timeframe = 'week' }) => {
    const timeframeText = {
      day: 'past 24 hours',
      week: 'past week',
      month: 'past month',
    }[timeframe];

    try {
      const { text } = await generateText({
        model: openai.responses(WEB_SEARCH_MODEL),
        prompt: `Find the latest news and developments from the ${timeframeText} about: ${query}
        
        Focus on:
        - Credible news sources (major publications, news agencies)
        - Most recent and relevant stories
        - Key facts, dates, and developments
        - Multiple perspectives if the topic is controversial

        Summarize the key news stories with their sources.`,
        tools: {
          // @ts-ignore - OpenAI web search preview types
          web_search_preview: openai.tools.webSearchPreview({
            searchContextSize: 'high',
          }),
        },
      });

      if (!text || text.trim().length === 0) {
        return `No recent news found for "${query}" in the ${timeframeText}. Try broadening your search or a different timeframe.`;
      }

      return `**News (${timeframeText}):** ${query}\n\n${text}`;
    } catch (error) {
      return `News search error: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
