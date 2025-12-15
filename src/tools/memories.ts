import { tool } from 'ai';
import { z } from 'zod';
import { searchConversations, getConversation } from '../utils/conversations';

/**
 * Tool to recall memories from previous conversations
 * Uses semantic search to find relevant past discussions
 */
export const recallMemories = tool({
  description: `Search through previous conversations to recall relevant context, discussions, or information. 
Use this when:
- The user refers to something discussed before ("remember when we talked about...")
- You need context from past conversations
- The user asks about their preferences or previous questions
- You want to provide continuity across conversations

Returns summaries of relevant past conversations.`,
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        'What to search for in past conversations. Be specific about the topic or context.'
      ),
    limit: z
      .number()
      .optional()
      .default(3)
      .describe('Maximum number of past conversations to return (default: 3)'),
  }),
  execute: async ({ query, limit }) => {
    try {
      const searchLimit = limit ?? 3;
      const results = await searchConversations(query, searchLimit);

      if (results.length === 0) {
        return {
          found: false,
          message: 'No relevant past conversations found.',
          memories: [],
        };
      }

      // Format the results with more context
      const memories = await Promise.all(
        results.map(async result => {
          // Get full conversation for richer context
          const fullConversation = await getConversation(result.id);

          // Get a meaningful preview of the conversation
          let preview = result.content;
          if (
            fullConversation?.messages &&
            fullConversation.messages.length > 0
          ) {
            // Get the first few exchanges
            const previewMessages = fullConversation.messages.slice(0, 4);
            preview = previewMessages
              .map(
                m =>
                  `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.slice(0, 200)}${m.content.length > 200 ? '...' : ''}`
              )
              .join('\n');
          }

          return {
            title: result.title,
            relevance: `${(result.relevanceScore * 100).toFixed(0)}%`,
            date: new Date(result.updatedAt).toLocaleDateString(),
            preview,
            messageCount: fullConversation?.messages.length || 0,
          };
        })
      );

      return {
        found: true,
        message: `Found ${results.length} relevant past conversation(s).`,
        memories,
      };
    } catch (error) {
      console.error('Memory recall error:', error);
      return {
        found: false,
        message: 'Error searching past conversations.',
        memories: [],
      };
    }
  },
});

/**
 * Tool to get details of a specific past conversation
 */
export const getMemoryDetails = tool({
  description: `Get the full details of a specific past conversation by its title.
Use this when you need more context from a conversation that was found with recallMemories.`,
  inputSchema: z.object({
    title: z.string().describe('The title of the conversation to retrieve'),
  }),
  execute: async ({ title }) => {
    try {
      // Search for the conversation by title
      const results = await searchConversations(title, 1);

      if (results.length === 0) {
        return {
          found: false,
          message: `Could not find a conversation with title "${title}".`,
        };
      }

      const result = results[0];
      if (!result) {
        return {
          found: false,
          message: 'Conversation not found.',
        };
      }

      const fullConversation = await getConversation(result.id);

      if (!fullConversation) {
        return {
          found: false,
          message: 'Conversation not found.',
        };
      }

      // Format the full conversation
      const formattedMessages = fullConversation.messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      return {
        found: true,
        title: fullConversation.title,
        date: new Date(fullConversation.updatedAt).toLocaleDateString(),
        messageCount: fullConversation.messages.length,
        messages: formattedMessages,
      };
    } catch (error) {
      console.error('Get memory details error:', error);
      return {
        found: false,
        message: 'Error retrieving conversation details.',
      };
    }
  },
});
