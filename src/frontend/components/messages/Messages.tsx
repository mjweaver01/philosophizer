import { EmptyState } from './EmptyState';
import { MessageAvatar } from './MessageAvatar';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import { ThinkingIndicator } from './ThinkingIndicator';
import {
  processTextWithThinkBlocks,
  isToolCallPart,
} from '../../../utils/textProcessing';

interface MessagesProps {
  messages: any[];
  status: string;
  starterQuestions: string[];
  onStarterQuestion: (question: string) => void;
}

// Helper function to check if we should show the thinking indicator
function shouldShowThinkingIndicator(status: string, messages: any[]): boolean {
  if (status === 'ready' || messages.length === 0) {
    return false;
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) return false;

  // Show if last message is from user (AI hasn't responded yet)
  if (lastMessage.role === 'user') {
    return true;
  }

  // Show if last message is from assistant but has no content yet
  if (lastMessage.role === 'assistant') {
    return !hasMessageContent(lastMessage);
  }

  return false;
}

// Helper function to check if a message has any content
function hasMessageContent(message: any): boolean {
  // Check parts-based messages (multi-part format)
  if ('parts' in message && Array.isArray(message.parts)) {
    return message.parts.some((part: any) => {
      // Check for tool calls
      if (
        part.type &&
        typeof part.type === 'string' &&
        isToolCallPart(part.type)
      ) {
        return true;
      }

      // Check for text content
      if (part.type === 'text' && part.text && part.text.trim().length > 0) {
        // Check if text has thinking blocks
        const { thinkBlocks } = processTextWithThinkBlocks(part.text);
        if (thinkBlocks.length > 0) {
          return true;
        }

        return true;
      }

      return false;
    });
  }

  // Check content-based messages (simple format)
  if (message.content && typeof message.content === 'string') {
    // Check if content has thinking blocks
    const { thinkBlocks, cleanText } = processTextWithThinkBlocks(
      message.content
    );
    if (thinkBlocks.length > 0) {
      return true;
    }

    return cleanText.trim().length > 0;
  }

  // No content found
  return false;
}

export function Messages({
  messages,
  status,
  starterQuestions,
  onStarterQuestion,
}: MessagesProps) {
  return (
    <>
      {messages.length === 0 && (
        <EmptyState
          starterQuestions={starterQuestions}
          onStarterQuestion={onStarterQuestion}
        />
      )}

      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`py-8 ${index === messages.length - 1 ? 'pb-12' : ''}`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4">
              <MessageAvatar role={message.role} />
              <div className="flex-1 min-w-0">
                {message.role === 'user' ? (
                  <UserMessage message={message} />
                ) : (
                  <AssistantMessage message={message} />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {shouldShowThinkingIndicator(status, messages) && <ThinkingIndicator />}
    </>
  );
}
