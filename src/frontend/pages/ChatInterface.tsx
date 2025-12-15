import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Messages } from '../components/messages/Messages';
import { STARTER_QUESTIONS } from '../../constants/questions';
import { ThemeToggle } from '../components/ThemeToggle';
import { ChatInput } from '../components/ChatInput';
import { useAutoScroll } from '../hooks/useAutoScroll';

export function ChatInterface() {
  const [input, setInput] = useState('');

  // Use the AI SDK's useChat hook
  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/agent',
    }),
  });

  const { scrollEndRef, scrollContainerRef, handleScroll, enableAutoScroll } =
    useAutoScroll(messages);

  const isProcessing = status !== 'ready';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const messageContent = input;
    setInput('');
    enableAutoScroll();

    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: messageContent }],
    } as any);
  };

  const handleStarterQuestion = async (question: string) => {
    if (isProcessing) return;

    enableAutoScroll();

    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: question }],
    } as any);
  };

  const handleClearConversation = () => {
    setMessages([]);
  };

  const Clear = ({ small = false }: { small?: boolean }) => {
    return (
      <button
        onClick={handleClearConversation}
        disabled={isProcessing}
        className={`${small ? 'text-[14px]' : 'text-sm'} text-text-muted hover:opacity-50 cursor-pointer rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Clear
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-text">Philosophizer</h1>
          <div className="flex items-center gap-3">
            {messages.length > 0 && <Clear />}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="flex flex-col max-w-3xl mx-auto px-4">
          <Messages
            messages={messages}
            status={status}
            starterQuestions={STARTER_QUESTIONS}
            onStarterQuestion={handleStarterQuestion}
          />
          <div ref={scrollEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-surface">
        <div className="relative max-w-3xl mx-auto px-4 py-4">
          {messages.length > 0 && (
            <div className="absolute -top-10 left-2 p-2 pb-[7px] bg-background">
              <Clear small />
            </div>
          )}
          <ChatInput
            input={input}
            isProcessing={isProcessing}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
