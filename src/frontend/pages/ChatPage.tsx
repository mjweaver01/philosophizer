import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useChat } from '@ai-sdk/react';
import { isTextUIPart, type UIMessage } from 'ai';
import type { DBConversationMessage, MessagePart } from '../../types';
import { Messages } from '../components/messages/Messages';
import { useChatTransport } from '../hooks/useChatTransport';
import {
  STARTER_QUESTIONS,
  QUESTIONS_BY_TRADITION,
} from '../../constants/questions';
import { TRADITION_GROUP_MAP } from '../../constants/traditions';
import { ChatInput } from '../components/ChatInput';
import { ConversationSidebar } from '../components/ConversationSidebar';
import { ChatSettingsModal } from '../components/ChatSettingsModal';
import { useConversations } from '../hooks/useConversations';
import { Conversation, ConversationContent } from '../components/Conversation';
import { PHILOSOPHERS } from '../../constants/philosophers';
import { NavigationButtons } from '../components/NavigationButtons';

// Utility to shuffle and limit questions
function getRandomQuestions(questions: string[], limit: number): string[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

// URL utilities
function getConversationIdFromUrl(id?: string): string | null {
  return id ?? null;
}

function dbMessageToUIMessage(msg: DBConversationMessage): UIMessage {
  return {
    id: msg.id,
    role: msg.role,
    parts: msg.parts ?? [{ type: 'text' as const, text: msg.content }],
  };
}

export function ChatPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<string[]>(
    () => {
      try {
        const raw = localStorage.getItem('selected_philosophers');
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === 'string')
          : [];
      } catch {
        return [];
      }
    }
  );
  const [selectedModel, setSelectedModel] = useState<string | null>(() => {
    // Load saved model preference from localStorage
    const saved = localStorage.getItem('selected_model');
    return saved || null;
  });
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const isLoadingMessagesRef = useRef(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Save model selection to localStorage when it changes
  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('selected_model', selectedModel);
    } else {
      localStorage.removeItem('selected_model');
    }
  }, [selectedModel]);

  useEffect(() => {
    try {
      if (selectedPhilosophers.length === 0) {
        localStorage.removeItem('selected_philosophers');
      } else {
        localStorage.setItem(
          'selected_philosophers',
          JSON.stringify(selectedPhilosophers)
        );
      }
    } catch {
      /* ignore quota / private mode */
    }
  }, [selectedPhilosophers]);

  // Get random starter questions based on selected philosophers
  const randomQuestions = useMemo(() => {
    let questionsPool: string[] = [];

    if (selectedPhilosophers.length > 0) {
      // If philosophers are selected, combine questions from all their traditions
      const traditions = new Set<string>();

      for (const philId of selectedPhilosophers) {
        const philosopher = PHILOSOPHERS[philId];
        if (philosopher) {
          const displayGroup = TRADITION_GROUP_MAP[philosopher.tradition];
          if (displayGroup) {
            traditions.add(displayGroup);
          }
        }
      }

      // Combine questions from all selected traditions
      for (const tradition of traditions) {
        if (QUESTIONS_BY_TRADITION[tradition]) {
          questionsPool.push(...QUESTIONS_BY_TRADITION[tradition]);
        }
      }

      // If no tradition-specific questions found, use general questions
      if (questionsPool.length === 0) {
        questionsPool = STARTER_QUESTIONS;
      }
    } else {
      // If no philosopher selected, combine all questions from all traditions
      questionsPool = [
        ...STARTER_QUESTIONS,
        ...Object.values(QUESTIONS_BY_TRADITION).flat(),
      ];
    }

    return getRandomQuestions(questionsPool, 15);
  }, [selectedPhilosophers]);

  // Conversation management
  const {
    conversations,
    currentConversation,
    createConversation,
    loadConversation,
    saveMessages,
    updateTitle,
    deleteConversation,
    toggleFavorite,
    clearCurrentConversation,
  } = useConversations();

  // Create transport that dynamically uses current model/philosopher selections
  const transport = useChatTransport({
    selectedModel,
    selectedPhilosophers,
    conversationId: currentConversation?.id ?? null,
  });

  // Use the AI SDK's useChat hook
  const { messages, sendMessage, setMessages, status, stop } = useChat({
    transport,
    onError: err => {
      const errorText =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant' as const,
          parts: [
            {
              type: 'text' as const,
              text: `Sorry, something went wrong: ${errorText}`,
            },
          ],
        },
      ]);
    },
  });

  const isProcessing = status === 'submitted' || status === 'streaming';

  // Load conversation from URL on mount or when URL changes
  useEffect(() => {
    const loadFromUrl = async () => {
      const urlConversationId = getConversationIdFromUrl(id);

      // If there's a conversation ID in the URL
      if (urlConversationId) {
        // Only load if we don't already have this conversation
        // This prevents reloading when we just created it and navigated to its URL
        if (currentConversation?.id !== urlConversationId) {
          isLoadingMessagesRef.current = true;
          const conversation = await loadConversation(urlConversationId);
          if (conversation?.messages) {
            setMessages(conversation.messages.map(dbMessageToUIMessage));
          }
          // Reset the flag after a short delay to allow the effect to run
          setTimeout(() => {
            isLoadingMessagesRef.current = false;
          }, 100);
        }
      }
      setInitialLoadDone(true);
    };
    loadFromUrl();
  }, [id]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = async () => {
      const urlConversationId = getConversationIdFromUrl(id);
      if (urlConversationId) {
        isLoadingMessagesRef.current = true;
        const conversation = await loadConversation(urlConversationId);
        if (conversation?.messages) {
          setMessages(conversation.messages.map(dbMessageToUIMessage));
        } else {
          setMessages([]);
        }
        setTimeout(() => {
          isLoadingMessagesRef.current = false;
        }, 100);
      } else {
        setMessages([]);
        clearCurrentConversation();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [id, loadConversation, setMessages, clearCurrentConversation]);

  // Sync URL when conversation changes
  useEffect(() => {
    if (!initialLoadDone) return;

    const newPath = currentConversation?.id
      ? `/c/${currentConversation.id}`
      : '/';

    // Only navigate if the URL actually needs to change
    // This prevents unnecessary navigation that would reload the conversation
    const currentPath = window.location.pathname;
    const currentId = id; // from useParams

    // If we're creating a new conversation and not on that URL yet, navigate
    if (currentConversation?.id && currentId !== currentConversation.id) {
      navigate(newPath, { replace: true });
    }
    // If we're clearing and not on root, navigate to root
    else if (!currentConversation && currentPath !== '/') {
      navigate('/', { replace: true });
    }
  }, [currentConversation?.id, initialLoadDone, navigate, id]);

  // Convert useChat messages to conversation format for saving
  const convertMessagesForSaving = useCallback((): DBConversationMessage[] => {
    return messages.map(msg => ({
      id: crypto.randomUUID(), // AI SDK uses non-UUID IDs, generate UUID for database
      role: msg.role as 'user' | 'assistant',
      content:
        msg.parts
          ?.filter(isTextUIPart)
          .map(p => p.text)
          .join('') ?? '',
      timestamp: new Date().toISOString(),
      parts: msg.parts as MessagePart[],
    }));
  }, [messages]);

  // Auto-save messages when they change (debounced)
  const messageIds = messages.map(m => m.id).join(',');
  useEffect(() => {
    // Skip auto-save if we're loading messages from the database
    if (
      !currentConversation ||
      messages.length === 0 ||
      isProcessing ||
      isLoadingMessagesRef.current
    )
      return;

    const timeout = setTimeout(() => {
      saveMessages(convertMessagesForSaving());
    }, 1000);

    return () => clearTimeout(timeout);
  }, [messageIds, currentConversation?.id, isProcessing]);

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
            ?.filter(isTextUIPart)
            .map(p => p.text)
            .join('') ?? '';
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

    sendMessage({
      role: 'user',
      parts: [{ type: 'text' as const, text: messageContent }],
    });
    setSubmitCount(c => c + 1);
  };

  const handleStarterQuestion = async (question: string) => {
    if (isProcessing) return;

    // Create a new conversation if none exists
    if (!currentConversation) {
      await createConversation();
    }

    sendMessage({
      role: 'user',
      parts: [{ type: 'text' as const, text: question }],
    });
    setSubmitCount(c => c + 1);
  };

  const handleSelectConversation = async (id: string) => {
    isLoadingMessagesRef.current = true;
    const conversation = await loadConversation(id);
    if (conversation?.messages) {
      setMessages(conversation.messages.map(dbMessageToUIMessage));
    } else {
      setMessages([]);
    }
    setTimeout(() => {
      isLoadingMessagesRef.current = false;
    }, 100);
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id);
    if (currentConversation?.id === id) {
      setMessages([]);
    }
  };

  const handleStartNewChat = () => {
    setMessages([]);
    clearCurrentConversation();
  };

  const handleRegenerateLastMessage = useCallback(() => {
    if (messages.length < 1 || isProcessing) return;

    // Find the last user message
    let lastUserMessage = null;

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg && msg.role === 'user') {
        lastUserMessage = msg;
        break;
      }
    }

    if (!lastUserMessage) {
      console.warn('No user message found to regenerate');
      return;
    }

    // Extract message content
    const messageContent =
      lastUserMessage.parts
        ?.filter(isTextUIPart)
        .map(p => p.text)
        .join('') ?? '';

    if (!messageContent) {
      console.warn('No message content found');
      return;
    }

    // Resend the last user message (keeping all previous messages)
    sendMessage({
      role: 'user',
      parts: [{ type: 'text' as const, text: messageContent }],
    });
  }, [messages, isProcessing, sendMessage]);

  const MenuButton = () => (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="flex items-center justify-center w-9 h-9 bg-surface border border-border hover:bg-surface-secondary text-text-muted hover:text-text rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
        onClick={handleStartNewChat}
        disabled={isProcessing}
        className={`flex items-center justify-center ${small ? 'w-7 h-7' : 'w-9 h-9'} bg-surface border border-border hover:bg-surface-secondary text-text-muted hover:text-text rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        title="New Chat"
      >
        <svg
          width={small ? '16' : '18'}
          height={small ? '16' : '18'}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>
    );
  };

  const SettingsButton = () => (
    <button
      ref={settingsButtonRef}
      onClick={() => setSettingsOpen(true)}
      disabled={isProcessing}
      className="flex items-center justify-center p-2 bg-surface border border-border hover:bg-surface-secondary text-text-muted hover:text-text rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      title="Focus philosopher"
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
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onStartNewChat={handleStartNewChat}
        isProcessing={isProcessing}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={updateTitle}
        onToggleFavorite={toggleFavorite}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header */}
        <div className="border-b border-border bg-surface">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MenuButton />
            </div>
            <NavigationButtons hideChatButton={messages.length > 0}>
              <SettingsButton />
              {messages.length > 0 && <Clear />}
            </NavigationButtons>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden relative">
          <Conversation
            className="h-full"
            showScrollButton={messages.length > 0}
            scrollToBottomTrigger={submitCount}
          >
            <ConversationContent>
              <div className="flex flex-col max-w-3xl mx-auto px-4">
                <Messages
                  messages={messages}
                  status={status}
                  starterQuestions={randomQuestions}
                  onStarterQuestion={handleStarterQuestion}
                  onRegenerateLastMessage={handleRegenerateLastMessage}
                  philosopherNames={selectedPhilosophers
                    .map(id => PHILOSOPHERS[id]?.name)
                    .filter((name): name is string => !!name)}
                />
              </div>
            </ConversationContent>
          </Conversation>
        </div>

        {/* Input */}
        <div className="border-t border-border bg-surface">
          <div className="relative max-w-3xl mx-auto px-4 py-4">
            {messages.length > 0 && (
              <div className="absolute -top-10 left-4 pb-[7px]">
                <Clear small />
              </div>
            )}
            <ChatInput
              input={input}
              isProcessing={isProcessing}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              onStop={stop}
              philosopherNames={selectedPhilosophers
                .map(id => PHILOSOPHERS[id]?.name)
                .filter((name): name is string => !!name)}
            />
          </div>
        </div>

        {/* Settings Modal */}
        <ChatSettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          selectedPhilosophers={selectedPhilosophers}
          onSelectPhilosophers={setSelectedPhilosophers}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          anchorRef={settingsButtonRef}
        />
      </div>
    </div>
  );
}
