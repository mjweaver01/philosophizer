export interface ProcessedText {
  thinkBlocks: string[];
  cleanText: string;
  hasOpenThink: boolean;
}

/**
 * Extract think blocks and clean text from raw text content
 */
export function processTextWithThinkBlocks(text: string): ProcessedText {
  const thinkBlocks: string[] = [];

  // First, extract completed think blocks
  const completedThinkRegex = /<think>([\s\S]*?)<\/think>/g;
  let match;
  let textWithoutCompletedThinks = text;

  while ((match = completedThinkRegex.exec(text)) !== null) {
    thinkBlocks.push(match[1]?.trim() || '');
  }

  // Remove completed think blocks from text
  textWithoutCompletedThinks = textWithoutCompletedThinks.replace(
    /<think>[\s\S]*?<\/think>/g,
    ''
  );

  // Check for open/incomplete think block (has opening tag but no closing tag)
  const openThinkMatch = textWithoutCompletedThinks.match(/<think>([\s\S]*)$/);
  const hasOpenThink = !!openThinkMatch;

  if (openThinkMatch) {
    thinkBlocks.push(openThinkMatch[1]?.trim() || '');
    // Remove the open think block from text
    textWithoutCompletedThinks = textWithoutCompletedThinks.replace(
      /<think>[\s\S]*$/,
      ''
    );
  }

  // Unwrap other XML-like tags (keep content, remove tags)
  const cleanText = textWithoutCompletedThinks
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
 * Extract tool name from part type
 */
export function extractToolName(part: any): string {
  return (
    part.name ||
    part.type
      .replace('tool-', '')
      .replace('tool-call', 'call')
      .replace('tool-invocation', 'invocation')
      .replace('tool-execution', 'execution')
  );
}

/**
 * Check if a part type represents a tool call
 */
export function isToolCallPart(partType: string): boolean {
  return (
    partType.startsWith('tool-') ||
    partType === 'tool-call' ||
    partType === 'tool-invocation' ||
    partType === 'tool-execution'
  );
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
