import { useState, useEffect, useCallback } from 'react';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  parts?: unknown[];
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: ConversationMessage[];
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/conversations');
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Create a new conversation
  const createConversation = useCallback(
    async (title?: string): Promise<Conversation | null> => {
      try {
        setIsLoading(true);
        const response = await fetch('/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title || 'New Conversation' }),
        });
        if (!response.ok) throw new Error('Failed to create conversation');
        const conversation = await response.json();
        setConversations(prev => [conversation, ...prev]);
        setCurrentConversation(conversation);
        setError(null);
        return conversation;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Load a specific conversation
  const loadConversation = useCallback(
    async (id: string): Promise<Conversation | null> => {
      try {
        setIsLoading(true);
        const response = await fetch(`/conversations/${id}`);
        if (!response.ok) throw new Error('Failed to load conversation');
        const conversation = await response.json();
        setCurrentConversation(conversation);
        setError(null);
        return conversation;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Save messages to current conversation
  const saveMessages = useCallback(
    async (messages: ConversationMessage[]): Promise<boolean> => {
      if (!currentConversation) return false;

      try {
        const response = await fetch(
          `/conversations/${currentConversation.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
          }
        );
        if (!response.ok) throw new Error('Failed to save messages');

        // Update local state
        setCurrentConversation(prev =>
          prev ? { ...prev, messages } : null
        );

        // Refresh conversations list to update timestamps
        fetchConversations();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      }
    },
    [currentConversation, fetchConversations]
  );

  // Update conversation title
  const updateTitle = useCallback(
    async (id: string, title: string): Promise<boolean> => {
      try {
        const response = await fetch(`/conversations/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        });
        if (!response.ok) throw new Error('Failed to update title');

        // Update local state
        setConversations(prev =>
          prev.map(c => (c.id === id ? { ...c, title } : c))
        );
        if (currentConversation?.id === id) {
          setCurrentConversation(prev => (prev ? { ...prev, title } : null));
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      }
    },
    [currentConversation]
  );

  // Delete a conversation
  const deleteConversation = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetch(`/conversations/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete conversation');

        setConversations(prev => prev.filter(c => c.id !== id));
        if (currentConversation?.id === id) {
          setCurrentConversation(null);
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      }
    },
    [currentConversation]
  );

  // Clear current conversation (start fresh without saving)
  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
  }, []);

  return {
    conversations,
    currentConversation,
    isLoading,
    error,
    fetchConversations,
    createConversation,
    loadConversation,
    saveMessages,
    updateTitle,
    deleteConversation,
    clearCurrentConversation,
  };
}

