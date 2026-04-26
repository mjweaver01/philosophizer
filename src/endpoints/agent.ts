import { createAgentUIStreamResponse } from 'ai';
import type { AgentRequest } from '../types';
import { createAgent } from '../utils/agent';
import { requireAuth } from '../middleware/auth';
import { getPhilosopher } from '../constants/philosophers';

interface AgentRequestWithConversation extends AgentRequest {
  conversationId?: string;
  philosopherIds?: string | string[];
  modelId?: string;
}

export const agent = {
  POST: async (req: Request) => {
    try {
      // Require authentication for agent endpoint
      const authResult = await requireAuth(req);
      if (authResult instanceof Response) return authResult;
      const { user } = authResult;

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

      let validatedPhilosopherIds: string | string[] | undefined =
        body.philosopherIds;
      if (body.philosopherIds !== undefined && body.philosopherIds !== null) {
        const raw = Array.isArray(body.philosopherIds)
          ? body.philosopherIds
          : [body.philosopherIds];
        const ids = raw.map(id => String(id).trim()).filter(Boolean);
        if (ids.length === 0) {
          validatedPhilosopherIds = undefined;
        } else {
          const unknown = ids.filter(id => !getPhilosopher(id));
          if (unknown.length > 0) {
            return new Response(
              JSON.stringify({
                error: 'Unknown philosopher id(s)',
                unknown,
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          }
          validatedPhilosopherIds = Array.isArray(body.philosopherIds)
            ? ids
            : ids[0]!;
        }
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

      const philosopherInfo = validatedPhilosopherIds
        ? Array.isArray(validatedPhilosopherIds)
          ? `focused: ${validatedPhilosopherIds.join(', ')}`
          : `focused: ${validatedPhilosopherIds}`
        : '';

      console.log(
        `[Agent] Creating agent with ${formattedMessages.length} messages${body.conversationId ? ` (conversation: ${body.conversationId})` : ''}${philosopherInfo ? ` (${philosopherInfo})` : ''}${body.modelId ? ` (model: ${body.modelId})` : ''}`
      );

      const agent = await createAgent(
        formattedMessages,
        user.id,
        body.conversationId,
        validatedPhilosopherIds,
        body.modelId
      );

      return createAgentUIStreamResponse({
        agent,
        uiMessages: formattedMessages,
        abortSignal: req.signal,
        onStepFinish: step => {
          if (process.env.AGENT_DEBUG_STEPS === '1') {
            console.log('[Agent] step', step.finishReason, step.usage);
          }
        },
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
