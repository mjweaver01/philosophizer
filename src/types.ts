import type { UIMessage, UIMessagePart, UIDataTypes, UITools } from 'ai';

export interface AgentRequest {
  messages: ConversationMessage[];
  philosopherId?: string;
}

/**
 * Conversation message type with database fields
 * Extends AI SDK's UIMessage with timestamp and content fields for DB support
 */
export interface ConversationMessage extends UIMessage {
  timestamp: string;
  content: string;
}

/**
 * Message part type with database fields
 */
export type MessagePart = UIMessagePart<UIDataTypes, UITools>;

/**
 * Conversation type with database fields
 */
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelName?: string | null;
  isFavorite?: boolean;
  messages?: ConversationMessage[];
}
