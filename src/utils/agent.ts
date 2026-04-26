import { ToolLoopAgent, stepCountIs, isTextUIPart, type UIMessage } from 'ai';
import { LLM_MODEL } from '../constants/providers';
import { getSystemPrompt } from '../constants/prompts';
import { createTools } from '../tools';
import { getModelProviderById } from './providers';
import { searchConversations } from './conversations';

function extractTextContent(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) {
    return '';
  }

  return message.parts
    .filter(isTextUIPart)
    .map(part => part.text)
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
  conversationId?: string,
  philosopherIds?: string | string[],
  modelId?: string
) {
  // Determine which model to use
  const targetModelId = modelId || LLM_MODEL;
  const modelProvider = await getModelProviderById(targetModelId);

  if (!modelProvider) {
    throw new Error(`Model provider '${targetModelId}' not found`);
  }
  if (!modelProvider.available) {
    throw new Error(
      `Model provider '${targetModelId}' is not available. API key might be missing.`
    );
  }

  // Build agent configuration
  const memoryContext = await getRelevantMemoryContext(
    userId,
    messages,
    conversationId
  );

  const systemPrompt = getSystemPrompt(philosopherIds) + memoryContext;
  const tools = createTools(userId, conversationId);

  return new ToolLoopAgent({
    model: modelProvider.model,
    instructions: systemPrompt,
    tools,
    stopWhen: stepCountIs(15),
  });
}

export async function initializeAgent(): Promise<void> {
  console.log('🕵️  AI Agent configuration ready with LLM model:', LLM_MODEL);
}
