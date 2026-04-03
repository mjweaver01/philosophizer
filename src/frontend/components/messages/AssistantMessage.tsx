import { MarkdownRenderer } from './MarkdownRenderer';
import { ThinkBlock } from './ThinkBlock';
import { ToolCallDisplay } from './ToolCallDisplay';
import {
  processTextWithThinkBlocks,
  isToolCallJSON,
  extractToolName,
  isToolCallPart,
  hasValidToolCallPart,
} from '../../../utils/textProcessing';
import { MessageActions } from './MessageActions';

interface AssistantMessageProps {
  message: any;
  showActions?: boolean;
  onRegenerateLastMessage?: () => void;
  isLastMessage?: boolean;
}

export function AssistantMessage({
  message,
  showActions = false,
  onRegenerateLastMessage,
  isLastMessage = false,
}: AssistantMessageProps) {
  // Helper to extract text content from message
  const getTextContent = (): string => {
    if ('parts' in message && Array.isArray(message.parts)) {
      return message.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join('\n');
    }
    if (message.content) {
      return message.content;
    }
    return '';
  };

  // Handle parts-based messages
  if ('parts' in message && Array.isArray(message.parts)) {
    // Find the last visible part index (skip step-start)
    let lastVisiblePartIndex = -1;
    for (let i = message.parts.length - 1; i >= 0; i--) {
      const part = message.parts[i];
      if (part && part.type !== 'step-start') {
        lastVisiblePartIndex = i;
        break;
      }
    }

    return (
      <>
        {message.parts.map((part: any, index: number) => (
          <MessagePart
            key={`part-${index}`}
            part={part}
            index={index}
            isLastMessage={isLastMessage}
            isLastPart={index === lastVisiblePartIndex}
          />
        ))}
        {showActions && (
          <MessageActions
            onRegenerate={onRegenerateLastMessage}
            textContent={getTextContent()}
          />
        )}
      </>
    );
  }

  // Handle simple content-based messages
  if (message.content) {
    return (
      <>
        <MarkdownRenderer content={message.content} />
        {showActions && (
          <MessageActions
            onRegenerate={onRegenerateLastMessage}
            textContent={getTextContent()}
          />
        )}
      </>
    );
  }

  return null;
}

interface MessagePartProps {
  part: any;
  index: number;
  isLastMessage?: boolean;
  isLastPart?: boolean;
}

function MessagePart({ part, index, isLastMessage = false, isLastPart = false }: MessagePartProps) {
  // Skip step-start parts and dynamic-tool parts
  if (part.type === 'step-start' || part.type === 'dynamic-tool') {
    return null;
  }

  // Handle reasoning/thinking parts (OpenAI o1/o3, Anthropic Claude)
  if ((part.type === 'reasoning' || part.type === 'thinking') && part.text) {
    return <ReasoningPart text={part.text} index={index} isLastMessage={isLastMessage} isLastPart={isLastPart} />;
  }

  // Handle text parts
  if (part.type === 'text' && part.text) {
    return <TextPart text={part.text} index={index} isLastMessage={isLastMessage} isLastPart={isLastPart} />;
  }

  // Handle tool call parts
  if (part.type && typeof part.type === 'string' && isToolCallPart(part.type)) {
    if (!hasValidToolCallPart(part)) return null;
    return <ToolPart part={part} index={index} />;
  }

  // Unknown part type - render as debug info
  return <UnknownPart part={part} index={index} />;
}

interface ReasoningPartProps {
  text: string;
  index: number;
  isLastMessage?: boolean;
  isLastPart?: boolean;
}

function ReasoningPart({ text, isLastMessage = false, isLastPart = false }: ReasoningPartProps) {
  return (
    <ThinkBlock
      content={text}
      isStreaming={isLastMessage && isLastPart}
      showOpenByDefault={isLastMessage && isLastPart}
    />
  );
}

interface TextPartProps {
  text: string;
  index: number;
  isLastMessage?: boolean;
  isLastPart?: boolean;
}

function TextPart({ text, isLastMessage = false, isLastPart = false }: TextPartProps) {
  const { thinkBlocks, cleanText, hasOpenThink } =
    processTextWithThinkBlocks(text);

  // Skip if it looks like a tool call JSON
  if (isToolCallJSON(cleanText)) {
    return null;
  }

  // Skip if no content
  if (!cleanText && thinkBlocks.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Think blocks */}
      {thinkBlocks.map((thinkContent, thinkIndex) => {
        const isLastBlock = thinkIndex === thinkBlocks.length - 1;
        const isStreaming = isLastBlock && hasOpenThink;
        const showOpenByDefault = isLastMessage && isLastPart && isLastBlock && !cleanText;

        return (
          <ThinkBlock
            key={`think-${thinkIndex}`}
            content={thinkContent}
            isStreaming={isStreaming}
            showOpenByDefault={showOpenByDefault}
          />
        );
      })}

      {/* Main content */}
      {cleanText && <MarkdownRenderer content={cleanText} />}
    </div>
  );
}

interface ToolPartProps {
  part: any;
  index: number;
}

function ToolPart({ part, index }: ToolPartProps) {
  const toolName = extractToolName(part);
  const isCompleted = part.state === 'output-available';
  const hasError =
    part.output && typeof part.output === 'object' && 'error' in part.output;

  return (
    <ToolCallDisplay
      toolName={toolName}
      isCompleted={isCompleted}
      hasError={hasError}
      input={part.input || part.arguments}
      output={part.output}
    />
  );
}

interface UnknownPartProps {
  part: any;
  index: number;
}

function UnknownPart({ part, index }: UnknownPartProps) {
  return (
    <div className="my-2 p-2 bg-warning-bg border border-warning-border rounded text-xs">
      <div className="font-mono text-text">Unknown type: {part.type}</div>
      <pre className="mt-1 overflow-x-auto text-text-secondary">
        {JSON.stringify(part, null, 2)}
      </pre>
    </div>
  );
}
