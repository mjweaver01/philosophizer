import { useState, useEffect, useCallback } from 'react';
import type { DBConversationMessage, Conversation } from '../../types';

export type { DBConversationMessage as ConversationMessage, Conversation };

// Helper to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
      const response = await fetch('/api/conversations', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      // Sort: favorites first, then by updatedAt descending
      data.sort((a: Conversation, b: Conversation) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
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
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: getAuthHeaders(),
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
        const response = await fetch(`/api/conversations/${id}`, {
          headers: getAuthHeaders(),
        });
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
    async (messages: DBConversationMessage[]): Promise<boolean> => {
      if (!currentConversation) return false;

      try {
        const response = await fetch(
          `/api/conversations/${currentConversation.id}`,
          {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ messages }),
          }
        );
        if (!response.ok) throw new Error('Failed to save messages');

        // Update local state
        setCurrentConversation(prev => (prev ? { ...prev, messages } : null));

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
        const response = await fetch(`/api/conversations/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
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
        const response = await fetch(`/api/conversations/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
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

  // Toggle favorite status
  const toggleFavorite = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/conversations/${id}/favorite`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to toggle favorite');
        const { isFavorite } = await response.json();

        // Update local state and re-sort
        setConversations(prev => {
          const updated = prev.map(c =>
            c.id === id ? { ...c, isFavorite } : c
          );
          updated.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });
          return updated;
        });

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      }
    },
    []
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
    toggleFavorite,
    clearCurrentConversation,
  };
}
