import {
  createConversation,
  getConversation,
  listConversations,
  updateConversation,
  deleteConversation,
  saveMessages,
  type ConversationMessage,
} from '../utils/conversations';

/**
 * Conversations endpoint
 *
 * GET  /conversations         - List all conversations
 * POST /conversations         - Create a new conversation
 */
export const conversations = {
  GET: async (_req: Request) => {
    try {
      const convos = await listConversations();
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
      const body = (await req.json()) as { title?: string };
      const conversation = await createConversation(body.title);

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
 * GET    /conversations/:id - Get a conversation with messages
 * PUT    /conversations/:id - Update conversation (title or messages)
 * DELETE /conversations/:id - Delete a conversation
 */
export const conversation = {
  GET: async (req: Request) => {
    try {
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

      const conv = await getConversation(id);

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
        messages?: ConversationMessage[];
      };

      // If messages are provided, save them
      if (body.messages) {
        const success = await saveMessages(id, body.messages);
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
        const updated = await updateConversation(id, { title: body.title });
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

      const conv = await getConversation(id);
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

      const deleted = await deleteConversation(id);

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
