import type { MessagePart } from '../types';

export interface ProcessedText {
  thinkBlocks: string[];
  cleanText: string;
  hasOpenThink: boolean;
}

/**
 * Extract think blocks and clean text from raw text content
 * Handles both <think> tags (Qwen3) and <reasoning> tags (GPT-OSS via our transform)
 */
export function processTextWithThinkBlocks(text: string): ProcessedText {
  const thinkBlocks: string[] = [];
  let textWithoutThinks = text;
  let hasOpenThink = false;

  // Process both <think> and <reasoning> tags
  const tagNames = ['think', 'reasoning'];

  for (const tagName of tagNames) {
    // Extract completed blocks
    const completedRegex = new RegExp(
      `<${tagName}>([\\s\\S]*?)<\\/${tagName}>`,
      'g'
    );
    let match;

    while ((match = completedRegex.exec(text)) !== null) {
      thinkBlocks.push(match[1]?.trim() || '');
    }

    // Remove completed blocks from text
    textWithoutThinks = textWithoutThinks.replace(completedRegex, '');

    // Check for open/incomplete block (has opening tag but no closing tag)
    const openRegex = new RegExp(`<${tagName}>([\\s\\S]*)$`);
    const openMatch = textWithoutThinks.match(openRegex);

    if (openMatch) {
      thinkBlocks.push(openMatch[1]?.trim() || '');
      hasOpenThink = true;
      // Remove the open block from text
      textWithoutThinks = textWithoutThinks.replace(openRegex, '');
    }
  }

  // Unwrap other XML-like tags (keep content, remove tags)
  const cleanText = textWithoutThinks
    .replace(/<(\w+)>([\s\S]*?)<\/\1>/g, '$2')
    .trim();

  return { thinkBlocks, cleanText, hasOpenThink };
}

/**
 * Check if text looks like a tool call JSON
 */
export function isToolCallJSON(text: string): boolean {
  return /^\s*\{\s*"name"\s*:\s*"[^"]+"\s*,\s*"arguments"\s*:/.test(text);
}

/**
 * Extract tool name from part
 */
export function extractToolName(part: MessagePart): string {
  // DynamicToolUIPart has toolName property
  if ('toolName' in part && typeof part.toolName === 'string') {
    return part.toolName;
  }

  // For other tool parts, extract from type string
  return part.type
    .replace('tool-', '')
    .replace('tool-call', 'call')
    .replace('tool-invocation', 'invocation')
    .replace('tool-execution', 'execution');
}

/**
 * Check if a part type represents a tool call
 */
export function isToolCallPart(partType: string): boolean {
  return (
    partType.startsWith('tool-') ||
    partType === 'tool-call' ||
    partType === 'tool-invocation' ||
    partType === 'tool-execution' ||
    partType === 'dynamic-tool'
  );
}

/**
 * Check if a tool call part has a valid tool name and content to display.
 * Prevents rendering empty/incomplete tool calls during early streaming.
 */
export function hasValidToolCallPart(part: MessagePart): boolean {
  let hasToolName = false;

  // Check for explicit toolName property
  if ('toolName' in part && part.toolName && typeof part.toolName === 'string') {
    hasToolName = true;
  }
  // Check if we can extract a meaningful name from the type
  else if (part.type && typeof part.type === 'string') {
    const typeBasedName = part.type.replace(/^tool-/, '');
    hasToolName =
      typeBasedName.length > 0 &&
      typeBasedName !== 'call' &&
      typeBasedName !== 'invocation' &&
      typeBasedName !== 'execution';
  }

  if (!hasToolName) return false;

  // Require some actual data to prevent flashing empty tool calls
  const hasInput = 'input' in part && part.input !== undefined && part.input !== null;
  const hasState = 'state' in part && Boolean(part.state);
  const hasOutput = 'output' in part && part.output !== undefined && part.output !== null;

  return hasInput || hasState || hasOutput;
}

/**
 * Format tool name for display
 */
export function formatToolName(toolName: string): string {
  if (!toolName) return '';

  const spaced = toolName
    // Handle namespaced tool names like "tools.webSearch" or "tools:webSearch"
    .replace(/[.:/]+/g, ' ')
    // Handle snake_case / kebab-case
    .replace(/[_-]+/g, ' ')
    // Handle camelCase / digitCase
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    // Handle acronym boundaries like "RAGSearch" -> "RAG Search"
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  return spaced
    .split(' ')
    .filter(Boolean)
    .map(word => {
      const isAllCaps = word.length > 1 && word === word.toUpperCase();
      if (isAllCaps) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Check if a string looks like a JSON string
 */
export function isLikelyJSONString(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return false;
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}
