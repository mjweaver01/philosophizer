import { embed } from 'ai';
import { v4 as uuid } from 'uuid';
import { EMBEDDING_MODEL } from './providers';
import { getPool } from '../db/connection';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  parts?: unknown[];
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ConversationMessage[];
}

export interface ConversationSearchResult {
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
  updatedAt: string;
}

/**
 * Generate embedding for text using the configured embedding model
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: EMBEDDING_MODEL,
    value: text,
  });
  return embedding;
}

/**
 * Create a summary of conversation content for embedding
 */
function getConversationContent(messages: ConversationMessage[]): string {
  if (messages.length === 0) return '';

  // Create a summary of the conversation for embedding
  const content = messages
    .map(msg => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      return `${role}: ${msg.content}`;
    })
    .join('\n');

  // Limit to ~2000 chars for embedding (most models have token limits)
  return content.slice(0, 2000);
}

/**
 * Create a new conversation
 */
export async function createConversation(
  userId: string,
  title?: string
): Promise<Conversation> {
  const pool = getPool();

  const id = uuid();
  const now = new Date().toISOString();
  const conversationTitle = title || 'New Conversation';

  // Generate embedding for the title
  const embedding = await generateEmbedding(conversationTitle);

  await pool.query(
    `INSERT INTO conversations (id, user_id, title, embedding, content_preview, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, userId, conversationTitle, JSON.stringify(embedding), '', now, now]
  );

  return {
    id,
    userId,
    title: conversationTitle,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

/**
 * Get a conversation by ID (optionally filtered by userId)
 */
export async function getConversation(
  id: string,
  userId?: string
): Promise<Conversation | null> {
  const pool = getPool();

  const conversationResult = await pool.query(
    `SELECT id, user_id, title, created_at, updated_at
     FROM conversations
     WHERE id = $1`,
    [id]
  );

  if (conversationResult.rows.length === 0) {
    return null;
  }

  const row = conversationResult.rows[0]!;

  // If userId is provided, check ownership
  if (userId && row.user_id !== userId) {
    return null;
  }

  // Get messages for this conversation
  const messagesResult = await pool.query(
    `SELECT id, role, content, parts, created_at
     FROM conversation_messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [id]
  );

  const messages: ConversationMessage[] = messagesResult.rows.map(msgRow => ({
    id: msgRow.id,
    role: msgRow.role,
    content: msgRow.content,
    timestamp: msgRow.created_at,
    parts: msgRow.parts,
  }));

  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages,
  };
}

/**
 * List all conversations for a user (without messages for efficiency)
 */
export async function listConversations(
  userId: string
): Promise<Omit<Conversation, 'messages'>[]> {
  const pool = getPool();

  const result = await pool.query(
    `SELECT id, user_id, title, created_at, updated_at
     FROM conversations
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId]
  );

  return result.rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Search conversations by semantic similarity (filtered by userId)
 */
export async function searchConversations(
  userId: string,
  query: string,
  limit: number = 5,
  excludeConversationId?: string
): Promise<ConversationSearchResult[]> {
  const pool = getPool();

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Build WHERE clause
  const conditions = ['user_id = $2'];
  const params: unknown[] = [JSON.stringify(queryEmbedding), userId];
  let paramIndex = 3;

  if (excludeConversationId) {
    conditions.push(`id != $${paramIndex}`);
    params.push(excludeConversationId);
    paramIndex++;
  }

  const whereClause = conditions.join(' AND ');

  // Search for similar conversations using cosine distance
  const result = await pool.query(
    `SELECT 
       id,
       title,
       content_preview,
       updated_at,
       1 - (embedding <=> $1::vector) AS relevance_score
     FROM conversations
     WHERE ${whereClause}
       AND embedding IS NOT NULL
     ORDER BY embedding <=> $1::vector
     LIMIT $${paramIndex}`,
    [...params, limit]
  );

  // Filter by minimum relevance score (30%)
  return result.rows
    .filter(row => row.relevance_score >= 0.3)
    .map(row => ({
      id: row.id,
      title: row.title,
      content: row.content_preview || '',
      relevanceScore: row.relevance_score,
      updatedAt: row.updated_at,
    }));
}

/**
 * Update a conversation's title
 */
export async function updateConversation(
  id: string,
  userId: string,
  updates: { title?: string }
): Promise<Conversation | null> {
  const pool = getPool();

  const existing = await getConversation(id, userId);
  if (!existing) return null;

  const now = new Date().toISOString();
  const newTitle = updates.title || existing.title;

  // Re-generate embedding with new title + content
  const content = getConversationContent(existing.messages);
  const textForEmbedding = `${newTitle}\n\n${content}`;
  const embedding = await generateEmbedding(textForEmbedding);

  await pool.query(
    `UPDATE conversations
     SET title = $1, embedding = $2, content_preview = $3, updated_at = $4
     WHERE id = $5 AND user_id = $6`,
    [
      newTitle,
      JSON.stringify(embedding),
      content.slice(0, 500),
      now,
      id,
      userId,
    ]
  );

  return getConversation(id, userId);
}

/**
 * Add a message to a conversation
 */
export async function addMessage(
  conversationId: string,
  userId: string,
  message: Omit<ConversationMessage, 'id' | 'timestamp'>
): Promise<ConversationMessage | null> {
  const conversation = await getConversation(conversationId, userId);
  if (!conversation) return null;

  const pool = getPool();
  const messageId = uuid();
  const timestamp = new Date().toISOString();

  // Insert the message
  await pool.query(
    `INSERT INTO conversation_messages (id, conversation_id, role, content, parts, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      messageId,
      conversationId,
      message.role,
      message.content,
      message.parts ? JSON.stringify(message.parts) : null,
      timestamp,
    ]
  );

  // Update conversation embedding and timestamp
  conversation.messages.push({
    id: messageId,
    role: message.role,
    content: message.content,
    timestamp,
    parts: message.parts,
  });

  const content = getConversationContent(conversation.messages);
  const textForEmbedding = `${conversation.title}\n\n${content}`;
  const embedding = await generateEmbedding(textForEmbedding);

  await pool.query(
    `UPDATE conversations
     SET embedding = $1, content_preview = $2, updated_at = $3
     WHERE id = $4`,
    [
      JSON.stringify(embedding),
      content.slice(0, 500),
      timestamp,
      conversationId,
    ]
  );

  return {
    id: messageId,
    role: message.role,
    content: message.content,
    timestamp,
    parts: message.parts,
  };
}

/**
 * Save multiple messages to a conversation (replaces existing messages)
 */
export async function saveMessages(
  conversationId: string,
  userId: string,
  messages: ConversationMessage[]
): Promise<boolean> {
  const existing = await getConversation(conversationId, userId);
  if (!existing) return false;

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete existing messages
    await client.query(
      'DELETE FROM conversation_messages WHERE conversation_id = $1',
      [conversationId]
    );

    // Insert new messages
    for (const message of messages) {
      await client.query(
        `INSERT INTO conversation_messages (id, conversation_id, role, content, parts, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          message.id,
          conversationId,
          message.role,
          message.content,
          message.parts ? JSON.stringify(message.parts) : null,
          message.timestamp,
        ]
      );
    }

    // Update conversation embedding
    const content = getConversationContent(messages);
    const textForEmbedding = `${existing.title}\n\n${content}`;
    const embedding = await generateEmbedding(textForEmbedding);
    const now = new Date().toISOString();

    await client.query(
      `UPDATE conversations
       SET embedding = $1, content_preview = $2, updated_at = $3
       WHERE id = $4`,
      [JSON.stringify(embedding), content.slice(0, 500), now, conversationId]
    );

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversation(
  id: string,
  userId: string
): Promise<boolean> {
  const existing = await getConversation(id, userId);
  if (!existing) return false;

  const pool = getPool();

  // Messages will be cascade deleted due to foreign key constraint
  await pool.query('DELETE FROM conversations WHERE id = $1 AND user_id = $2', [
    id,
    userId,
  ]);

  return true;
}
