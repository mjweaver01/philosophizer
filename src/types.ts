import type { UIMessage, UIMessagePart, UIDataTypes, UITools } from 'ai';

export interface AgentRequest {
  messages: UIMessage[];
  philosopherId?: string;
}

export type MessagePart = UIMessagePart<UIDataTypes, UITools>;

export interface DBConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  parts?: MessagePart[];
}

export interface ConversationSearchResult {
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelName?: string | null;
  isFavorite?: boolean;
  messages?: DBConversationMessage[];
}
