import { ToolLoopAgent, stepCountIs } from 'ai';
import { LLM_MODEL } from '../constants/providers';
import { SYSTEM_PROMPT } from '../constants/prompts';
import { tools } from '../tools';
import { createProvider } from './providers';

let agentInstance: ReturnType<typeof createAgent> | null = null;

function createAgent(provider: ReturnType<typeof createProvider>) {
  return new ToolLoopAgent({
    model: provider.chat(LLM_MODEL),
    instructions: SYSTEM_PROMPT,
    tools,
    toolChoice: 'auto',
    // Safety limit to prevent runaway loops
    // Most queries need 1-3 tool calls, but complex multi-domain questions may need more
    stopWhen: stepCountIs(10),
  });
}

export async function initializeAgent(): Promise<void> {
  if (agentInstance) {
    return;
  }

  const provider = createProvider();
  console.log('🕵️  Initializing AI Agent with LLM model:', LLM_MODEL);
  agentInstance = createAgent(provider);
}

export function getAgent() {
  if (!agentInstance) {
    throw new Error('Agent not initialized. Call initializeAgent() first.');
  }
  return agentInstance;
}
