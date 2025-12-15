import { ChromaClient, type Collection } from 'chromadb';
import { embed } from 'ai';
import { v4 as uuid } from 'uuid';
import { CHROMA_URL } from '../constants/rag';
import { EMBEDDING_MODEL } from './providers';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  parts?: unknown[];
}

export interface Conversation {
  id: string;
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

const CONVERSATIONS_COLLECTION = 'conversations';

// Singleton instances
let chromaClient: ChromaClient | null = null;
let conversationsCollection: Collection | null = null;

/**
 * Parse a URL into host, port, and ssl components for ChromaDB client
 */
function parseChromaUrl(url: string): {
  host: string;
  port: number;
  ssl: boolean;
} {
  const parsed = new URL(url);
  const ssl = parsed.protocol === 'https:';
  const defaultPort = ssl ? 443 : 8000;
  const port = parsed.port ? parseInt(parsed.port, 10) : defaultPort;
  const host = parsed.hostname;
  return { host, port, ssl };
}

/**
 * Initialize the ChromaDB client and conversations collection
 */
async function initConversationsStore(): Promise<Collection> {
  if (conversationsCollection) {
    return conversationsCollection;
  }

  if (!chromaClient) {
    const { host, port, ssl } = parseChromaUrl(CHROMA_URL);
    chromaClient = new ChromaClient({ host, port, ssl });
  }

  // Get or create the conversations collection with cosine similarity
  conversationsCollection = await chromaClient.getOrCreateCollection({
    name: CONVERSATIONS_COLLECTION,
    metadata: {
      description: 'Chat conversation history with semantic search',
      'hnsw:space': 'cosine',
    },
  });

  return conversationsCollection;
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
  title?: string
): Promise<Conversation> {
  const collection = await initConversationsStore();

  const id = uuid();
  const now = new Date().toISOString();
  const conversationTitle = title || 'New Conversation';

  const conversation: Conversation = {
    id,
    title: conversationTitle,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };

  // Generate embedding for empty conversation (will be updated when messages are added)
  const embedding = await generateEmbedding(conversationTitle);

  await collection.add({
    ids: [id],
    documents: [JSON.stringify(conversation.messages)],
    embeddings: [embedding],
    metadatas: [
      {
        title: conversationTitle,
        createdAt: now,
        updatedAt: now,
        contentPreview: '',
      },
    ],
  });

  return conversation;
}

/**
 * Get a conversation by ID
 */
export async function getConversation(
  id: string
): Promise<Conversation | null> {
  const collection = await initConversationsStore();

  const result = await collection.get({
    ids: [id],
  });

  if (!result.ids.length || !result.metadatas?.[0]) {
    return null;
  }

  const metadata = result.metadatas[0] as Record<string, unknown>;
  const messagesJson = result.documents?.[0] || '[]';

  return {
    id,
    title: (metadata.title as string) || 'Untitled',
    createdAt: (metadata.createdAt as string) || new Date().toISOString(),
    updatedAt: (metadata.updatedAt as string) || new Date().toISOString(),
    messages: JSON.parse(messagesJson),
  };
}

/**
 * List all conversations (without messages for efficiency)
 */
export async function listConversations(): Promise<
  Omit<Conversation, 'messages'>[]
> {
  const collection = await initConversationsStore();

  const result = await collection.get();

  const conversations: Omit<Conversation, 'messages'>[] = [];

  for (let i = 0; i < result.ids.length; i++) {
    const id = result.ids[i];
    const metadata = result.metadatas?.[i] as Record<string, unknown>;

    if (id && metadata) {
      conversations.push({
        id,
        title: (metadata.title as string) || 'Untitled',
        createdAt: (metadata.createdAt as string) || new Date().toISOString(),
        updatedAt: (metadata.updatedAt as string) || new Date().toISOString(),
      });
    }
  }

  // Sort by updatedAt descending
  conversations.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return conversations;
}

/**
 * Search conversations by semantic similarity
 */
export async function searchConversations(
  query: string,
  limit: number = 5,
  excludeConversationId?: string
): Promise<ConversationSearchResult[]> {
  const collection = await initConversationsStore();

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Search for similar conversations
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: limit + (excludeConversationId ? 1 : 0), // Get extra if we need to exclude one
  });

  const searchResults: ConversationSearchResult[] = [];

  if (results.ids[0]) {
    for (let i = 0; i < results.ids[0].length; i++) {
      const id = results.ids[0][i];

      // Skip the current conversation if specified
      if (id === excludeConversationId) continue;

      const metadata = results.metadatas?.[0]?.[i] as Record<string, unknown>;
      const distance = results.distances?.[0]?.[i] ?? 1;
      // Cosine similarity: score = 1 - distance
      const score = Math.max(0, 1 - distance);

      if (id && metadata && score > 0.3) {
        // Only include if relevance > 30%
        searchResults.push({
          id,
          title: (metadata.title as string) || 'Untitled',
          content: (metadata.contentPreview as string) || '',
          relevanceScore: score,
          updatedAt: (metadata.updatedAt as string) || new Date().toISOString(),
        });
      }
    }
  }

  return searchResults.slice(0, limit);
}

/**
 * Update a conversation's title
 */
export async function updateConversation(
  id: string,
  updates: { title?: string }
): Promise<Conversation | null> {
  const collection = await initConversationsStore();

  const existing = await getConversation(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const newTitle = updates.title || existing.title;

  // Re-generate embedding with new title + content
  const content = getConversationContent(existing.messages);
  const textForEmbedding = `${newTitle}\n\n${content}`;
  const embedding = await generateEmbedding(textForEmbedding);

  await collection.update({
    ids: [id],
    embeddings: [embedding],
    metadatas: [
      {
        title: newTitle,
        createdAt: existing.createdAt,
        updatedAt: now,
        contentPreview: content.slice(0, 500),
      },
    ],
  });

  return getConversation(id);
}

/**
 * Add a message to a conversation
 */
export async function addMessage(
  conversationId: string,
  message: Omit<ConversationMessage, 'id' | 'timestamp'>
): Promise<ConversationMessage | null> {
  const conversation = await getConversation(conversationId);
  if (!conversation) return null;

  const id = uuid();
  const timestamp = new Date().toISOString();

  const newMessage: ConversationMessage = {
    id,
    role: message.role,
    content: message.content,
    timestamp,
    parts: message.parts,
  };

  conversation.messages.push(newMessage);

  await saveMessages(conversationId, conversation.messages);

  return newMessage;
}

/**
 * Save multiple messages to a conversation (replaces existing messages)
 */
export async function saveMessages(
  conversationId: string,
  messages: ConversationMessage[]
): Promise<boolean> {
  const collection = await initConversationsStore();

  const existing = await getConversation(conversationId);
  if (!existing) return false;

  const now = new Date().toISOString();

  // Generate embedding from conversation content
  const content = getConversationContent(messages);
  const textForEmbedding = `${existing.title}\n\n${content}`;
  const embedding = await generateEmbedding(textForEmbedding);

  await collection.update({
    ids: [conversationId],
    documents: [JSON.stringify(messages)],
    embeddings: [embedding],
    metadatas: [
      {
        title: existing.title,
        createdAt: existing.createdAt,
        updatedAt: now,
        contentPreview: content.slice(0, 500),
      },
    ],
  });

  return true;
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversation(id: string): Promise<boolean> {
  const collection = await initConversationsStore();

  const existing = await getConversation(id);
  if (!existing) return false;

  await collection.delete({
    ids: [id],
  });

  return true;
}
