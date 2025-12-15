import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Messages } from '../components/messages/Messages';
import { STARTER_QUESTIONS } from '../../constants/questions';
import { ThemeToggle } from '../components/ThemeToggle';
import { ChatInput } from '../components/ChatInput';
import { ConversationSidebar } from '../components/ConversationSidebar';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useConversations } from '../hooks/useConversations';

// URL utilities
function getConversationIdFromUrl(): string | null {
  const path = window.location.pathname;
  const match = path.match(/^\/c\/([a-f0-9-]+)$/i);
  return match?.[1] ?? null;
}

function setConversationIdInUrl(id: string | null) {
  const newPath = id ? `/c/${id}` : '/';
  if (window.location.pathname !== newPath) {
    window.history.pushState({}, '', newPath);
  }
}

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Conversation management
  const {
    conversations,
    currentConversation,
    createConversation,
    loadConversation,
    saveMessages,
    updateTitle,
    deleteConversation,
    clearCurrentConversation,
  } = useConversations();

  // Use the AI SDK's useChat hook
  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/agent',
    }),
  });

  const { scrollEndRef, scrollContainerRef, handleScroll, enableAutoScroll } =
    useAutoScroll(messages);

  const isProcessing = status !== 'ready';

  // Load conversation from URL on mount
  useEffect(() => {
    const loadFromUrl = async () => {
      const urlConversationId = getConversationIdFromUrl();
      if (urlConversationId) {
        const conversation = await loadConversation(urlConversationId);
        if (conversation?.messages) {
          const chatMessages = conversation.messages.map(msg => ({
            id: msg.id,
            role: msg.role,
            parts: msg.parts || [{ type: 'text', text: msg.content }],
          }));
          setMessages(chatMessages as any);
        }
      }
      setInitialLoadDone(true);
    };
    loadFromUrl();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = async () => {
      const urlConversationId = getConversationIdFromUrl();
      if (urlConversationId) {
        const conversation = await loadConversation(urlConversationId);
        if (conversation?.messages) {
          const chatMessages = conversation.messages.map(msg => ({
            id: msg.id,
            role: msg.role,
            parts: msg.parts || [{ type: 'text', text: msg.content }],
          }));
          setMessages(chatMessages as any);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
        clearCurrentConversation();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [loadConversation, setMessages, clearCurrentConversation]);

  // Sync URL when conversation changes
  useEffect(() => {
    if (!initialLoadDone) return;
    setConversationIdInUrl(currentConversation?.id || null);
  }, [currentConversation?.id, initialLoadDone]);

  // Convert useChat messages to conversation format for saving
  const convertMessagesForSaving = useCallback(() => {
    return messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content:
        msg.parts
          ?.filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('') || '',
      timestamp: new Date().toISOString(),
      parts: msg.parts,
    }));
  }, [messages]);

  // Auto-save messages when they change (debounced)
  useEffect(() => {
    if (!currentConversation || messages.length === 0 || isProcessing) return;

    const timeout = setTimeout(() => {
      const formattedMessages = convertMessagesForSaving();
      saveMessages(formattedMessages);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [
    messages,
    currentConversation,
    isProcessing,
    saveMessages,
    convertMessagesForSaving,
  ]);

  // Auto-generate title from first user message
  useEffect(() => {
    if (
      currentConversation &&
      currentConversation.title === 'New Conversation' &&
      messages.length > 0
    ) {
      const firstUserMessage = messages.find(m => m.role === 'user');
      if (firstUserMessage) {
        const content =
          firstUserMessage.parts
            ?.filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join('') || '';
        if (content) {
          const title =
            content.length > 50 ? content.slice(0, 50) + '...' : content;
          updateTitle(currentConversation.id, title);
        }
      }
    }
  }, [messages, currentConversation, updateTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    // Create a new conversation if none exists
    if (!currentConversation) {
      await createConversation();
    }

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

    // Create a new conversation if none exists
    if (!currentConversation) {
      await createConversation();
    }

    enableAutoScroll();

    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: question }],
    } as any);
  };

  const handleNewConversation = async () => {
    setMessages([]);
    await createConversation();
  };

  const handleSelectConversation = async (id: string) => {
    const conversation = await loadConversation(id);
    if (conversation?.messages) {
      // Convert saved messages back to useChat format
      const chatMessages = conversation.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        parts: msg.parts || [{ type: 'text', text: msg.content }],
      }));
      setMessages(chatMessages as any);
    } else {
      setMessages([]);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id);
    if (currentConversation?.id === id) {
      setMessages([]);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    clearCurrentConversation();
  };

  const MenuButton = () => (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="flex items-center justify-center p-2 bg-surface border border-border hover:bg-surface-secondary text-text-muted hover:text-text rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary"
      title="Conversations"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );

  const Clear = ({ small = false }: { small?: boolean }) => {
    return (
      <button
        onClick={handleClearConversation}
        disabled={isProcessing}
        className={`${small ? 'text-[14px]' : 'text-sm'} text-text-muted hover:opacity-50 cursor-pointer rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        New Chat
      </button>
    );
  };

  const AboutButton = () => (
    <a
      href="/about"
      className="flex items-center justify-center p-2 bg-surface border border-border hover:bg-surface-secondary text-text-muted hover:text-text rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary"
      title="About - View indexed philosophers"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </a>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={updateTitle}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="border-b border-border bg-surface">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MenuButton />
            </div>
            <div className="flex items-center gap-3">
              {messages.length > 0 && <Clear />}
              <AboutButton />
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
    </div>
  );
}
