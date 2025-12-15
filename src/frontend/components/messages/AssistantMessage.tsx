import { MarkdownRenderer } from './MarkdownRenderer';
import { ThinkBlock } from './ThinkBlock';
import { ToolCallDisplay } from './ToolCallDisplay';
import {
  processTextWithThinkBlocks,
  isToolCallJSON,
  extractToolName,
  isToolCallPart,
} from '../../../utils/textProcessing';

interface AssistantMessageProps {
  message: any;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  // Handle parts-based messages
  if ('parts' in message && Array.isArray(message.parts)) {
    return (
      <>
        {message.parts.map((part: any, index: number) => (
          <MessagePart key={`part-${index}`} part={part} index={index} />
        ))}
      </>
    );
  }

  // Handle simple content-based messages
  if (message.content) {
    return <MarkdownRenderer content={message.content} />;
  }

  return null;
}

interface MessagePartProps {
  part: any;
  index: number;
}

function MessagePart({ part, index }: MessagePartProps) {
  // Skip step-start parts
  if (part.type === 'step-start') {
    return null;
  }

  // Handle text parts
  if (part.type === 'text' && part.text) {
    return <TextPart text={part.text} index={index} />;
  }

  // Handle tool call parts
  if (part.type && typeof part.type === 'string' && isToolCallPart(part.type)) {
    return <ToolPart part={part} index={index} />;
  }

  // Unknown part type - render as debug info
  return <UnknownPart part={part} index={index} />;
}

interface TextPartProps {
  text: string;
  index: number;
}

function TextPart({ text, index }: TextPartProps) {
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

        return (
          <ThinkBlock
            key={`think-${thinkIndex}`}
            content={thinkContent}
            isStreaming={isStreaming}
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
