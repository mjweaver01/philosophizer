import {
  createConversation,
  getConversation,
  listConversations,
  updateConversation,
  deleteConversation,
  saveMessages,
  toggleFavorite,
} from '../utils/conversations';
import type { DBConversationMessage } from '../types';
import { requireAuth } from '../middleware/auth';

/**
 * Conversations endpoint
 *
 * GET  /api/conversations         - List all conversations
 * POST /api/conversations         - Create a new conversation
 */
export const conversations = {
  GET: async (req: Request) => {
    try {
      const authResult = await requireAuth(req);
      if (authResult instanceof Response) return authResult;
      const { user } = authResult;

      const convos = await listConversations(user.id);
      return new Response(JSON.stringify(convos), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('List conversations error:', error);
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

  POST: async (req: Request) => {
    try {
      const authResult = await requireAuth(req);
      if (authResult instanceof Response) return authResult;
      const { user } = authResult;

      const body = (await req.json()) as { title?: string };
      const conversation = await createConversation(user.id, body.title);

      return new Response(JSON.stringify(conversation), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Create conversation error:', error);
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
 * Single conversation endpoint
 *
 * GET    /api/conversations/:id - Get a conversation with messages
 * PUT    /api/conversations/:id - Update conversation (title or messages)
 * DELETE /api/conversations/:id - Delete a conversation
 */
export const conversation = {
  GET: async (req: Request) => {
    try {
      const authResult = await requireAuth(req);
      if (authResult instanceof Response) return authResult;
      const { user } = authResult;

      const url = new URL(req.url);
      const id = url.pathname.split('/').pop();

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing conversation ID' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const conv = await getConversation(id, user.id);

      if (!conv) {
        return new Response(
          JSON.stringify({ error: 'Conversation not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify(conv), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Get conversation error:', error);
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

  PUT: async (req: Request) => {
    try {
      const authResult = await requireAuth(req);
      if (authResult instanceof Response) return authResult;
      const { user } = authResult;

      const url = new URL(req.url);
      const id = url.pathname.split('/').pop();

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing conversation ID' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const body = (await req.json()) as {
        title?: string;
        messages?: DBConversationMessage[];
      };

      // If messages are provided, save them
      if (body.messages) {
        const success = await saveMessages(id, user.id, body.messages);
        if (!success) {
          return new Response(
            JSON.stringify({ error: 'Conversation not found' }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }

      // If title is provided, update it
      if (body.title) {
        const updated = await updateConversation(id, user.id, {
          title: body.title,
        });
        if (!updated) {
          return new Response(
            JSON.stringify({ error: 'Conversation not found' }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }

      const conv = await getConversation(id, user.id);
      return new Response(JSON.stringify(conv), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Update conversation error:', error);
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

  DELETE: async (req: Request) => {
    try {
      const authResult = await requireAuth(req);
      if (authResult instanceof Response) return authResult;
      const { user } = authResult;

      const url = new URL(req.url);
      const id = url.pathname.split('/').pop();

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing conversation ID' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const deleted = await deleteConversation(id, user.id);

      if (!deleted) {
        return new Response(
          JSON.stringify({ error: 'Conversation not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Delete conversation error:', error);
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
 * Conversation favorite endpoint
 *
 * POST /api/conversations/:id/favorite - Toggle favorite status
 */
export const conversationFavorite = {
  POST: async (req: Request) => {
    try {
      const authResult = await requireAuth(req);
      if (authResult instanceof Response) return authResult;
      const { user } = authResult;

      const url = new URL(req.url);
      const parts = url.pathname.split('/');
      const id = parts[parts.length - 2];

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing conversation ID' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const isFavorite = await toggleFavorite(id, user.id);

      if (isFavorite === null) {
        return new Response(
          JSON.stringify({ error: 'Conversation not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ isFavorite }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Toggle favorite error:', error);
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
