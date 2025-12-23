import { createAgentUIStreamResponse } from 'ai';
import type { AgentRequest } from '../types';
import { createAgent } from '../utils/agent';

interface AgentRequestWithConversation extends AgentRequest {
  conversationId?: string;
}

export const agent = {
  POST: async (req: Request) => {
    try {
      const body = (await req.json()) as AgentRequestWithConversation;

      if (!body.messages || !Array.isArray(body.messages)) {
        return new Response(
          JSON.stringify({
            error: "Missing or invalid 'messages' parameter",
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (body.messages.length === 0) {
        return new Response(
          JSON.stringify({
            error: 'Messages array cannot be empty',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const formattedMessages = body.messages.map((msg: any) => {
        if (msg.parts) {
          return {
            id: msg.id || crypto.randomUUID(),
            role: msg.role,
            parts: msg.parts,
          };
        }

        return {
          id: msg.id || crypto.randomUUID(),
          role: msg.role,
          parts: [{ type: 'text' as const, text: msg.content }],
        };
      });

      console.log(
        `[Agent] Creating agent with ${formattedMessages.length} messages${body.conversationId ? ` (conversation: ${body.conversationId})` : ''}`
      );

      const agent = await createAgent(formattedMessages, body.conversationId);

      return createAgentUIStreamResponse({
        agent: agent as any,
        uiMessages: formattedMessages,
      });
    } catch (error) {
      console.error('[Agent] Stream error:', error);
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
