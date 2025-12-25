import { ToolLoopAgent, stepCountIs, type UIMessage } from 'ai';
import { LLM_MODEL } from '../constants/providers';
import { getSystemPrompt } from '../constants/prompts';
import { createTools } from '../tools';
import { createProvider } from './providers';
import { searchConversations, type ConversationMessage } from './conversations';

function extractTextContent(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) {
    return '';
  }

  return message.parts
    .filter((part: any) => part.type === 'text')
    .map((part: any) => part.text || '')
    .join(' ');
}

async function getRelevantMemoryContext(
  userId: string,
  messages: UIMessage[],
  conversationId?: string
): Promise<string> {
  if (messages.length === 0) return '';

  const lastUserMessage = [...messages]
    .reverse()
    .find(msg => msg.role === 'user');

  if (!lastUserMessage) return '';

  const query = extractTextContent(lastUserMessage);
  if (!query.trim()) return '';

  try {
    const results = await searchConversations(userId, query, 3, conversationId);

    if (results.length === 0) return '';

    let context = '\n\n# RELEVANT PAST CONVERSATIONS\n\n';
    context +=
      'You may reference these past discussions if relevant to the current query:\n\n';

    for (const result of results) {
      const date = new Date(result.updatedAt).toLocaleDateString();
      context += `**Past conversation** (${date}, ${(result.relevanceScore * 100).toFixed(0)}% relevant):\n`;
      context += `"${result.title}"\n`;
      context += `${result.content.slice(0, 400)}...\n\n`;
    }

    return context;
  } catch (error) {
    console.error('[Agent] Failed to retrieve memory context:', error);
    return '';
  }
}

export async function createAgent(
  messages: UIMessage[],
  userId: string,
  conversationId?: string
) {
  const provider = createProvider();

  const memoryContext = await getRelevantMemoryContext(
    userId,
    messages,
    conversationId
  );

  const systemPrompt = getSystemPrompt() + memoryContext;
  const tools = createTools(userId);

  return new ToolLoopAgent({
    model: provider.chat(LLM_MODEL),
    instructions: systemPrompt,
    tools,
    stopWhen: stepCountIs(15),
  });
}

export async function initializeAgent(): Promise<void> {
  console.log('🕵️  AI Agent configuration ready with LLM model:', LLM_MODEL);
}
