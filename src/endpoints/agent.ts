import { createAgentUIStreamResponse } from 'ai';
import type { AgentRequest } from '../types';
import { getAgent } from '../utils/agent';

export const agent = {
  POST: async (req: Request) => {
    try {
      const body = (await req.json()) as AgentRequest;

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

      const agent = getAgent();

      // Handle messages in both formats (parts or content)
      const formattedMessages = body.messages.map((msg: any) => {
        // If message already has parts, use it directly
        if (msg.parts) {
          return {
            id: msg.id || crypto.randomUUID(),
            role: msg.role,
            parts: msg.parts,
          };
        }

        // Convert content field to parts format
        return {
          id: msg.id || crypto.randomUUID(),
          role: msg.role,
          parts: [{ type: 'text' as const, text: msg.content }],
        };
      });

      return createAgentUIStreamResponse({
        agent,
        messages: formattedMessages,
      });
    } catch (error) {
      console.error('Agent stream error:', error);
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
