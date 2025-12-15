export interface AskRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
}

export interface AskResponse {
  answer: string;
  took_ms: number;
  messages?: Message[];
}

export interface AgentRequest {
  messages: Message[];
}

export interface ToolCall {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: string;
  state?: 'call' | 'result' | 'partial-call';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}
