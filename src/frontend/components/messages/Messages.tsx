import { useLocation } from 'react-router';
import { LoadingLogo } from '../Logo';
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
  isLoadingConversation?: boolean;
  starterQuestions: string[];
  onStarterQuestion: (question: string) => void;
  onRegenerateLastMessage?: () => void;
  selectedPhilosophers?: string[];
  philosopherNames?: string[];
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

      // Check for reasoning/thinking content (OpenAI o1/o3, Anthropic Claude)
      if (
        (part.type === 'reasoning' || part.type === 'thinking') &&
        part.text &&
        part.text.trim().length > 0
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
  isLoadingConversation = false,
  starterQuestions,
  onStarterQuestion,
  onRegenerateLastMessage,
  philosopherNames = [],
}: MessagesProps) {
  const location = useLocation();
  const isInConversation = location.pathname.startsWith('/c/');
  const isStreaming = status === 'submitted' || status === 'streaming';
  // Check if there's a user message to regenerate
  const hasUserMessage = messages.some(m => m.role === 'user');

  // While a saved conversation is being fetched there are no messages yet;
  // show a loading indicator rather than the bare empty-state logo, which is
  // indistinguishable from a stuck/never-resolving screen.
  if (messages.length === 0 && isLoadingConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingLogo />
      </div>
    );
  }

  return (
    <>
      {messages.length === 0 && (
        <EmptyState
          isInConversation={isInConversation}
          starterQuestions={starterQuestions}
          onStarterQuestion={onStarterQuestion}
          philosopherNames={philosopherNames}
        />
      )}

      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const isLastAssistantMessage =
          isLastMessage && message.role === 'assistant';

        // Only show actions on last assistant message when not streaming AND there's a user message
        const shouldShowActions =
          isLastAssistantMessage && !isStreaming && hasUserMessage;

        return (
          <div
            key={message.id}
            className={`
              py-8 
              ${index === messages.length - 1 ? 'pb-12' : ''}
              ${index === 0 ? 'pt-12' : ''}
            `}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-4">
                <MessageAvatar role={message.role} />
                <div className="flex-1 min-w-0">
                  {message.role === 'user' ? (
                    <UserMessage message={message} />
                  ) : (
                    <AssistantMessage
                      message={message}
                      showActions={shouldShowActions}
                      onRegenerateLastMessage={onRegenerateLastMessage}
                      isLastMessage={isLastMessage}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {shouldShowThinkingIndicator(status, messages) && <ThinkingIndicator />}
    </>
  );
}
