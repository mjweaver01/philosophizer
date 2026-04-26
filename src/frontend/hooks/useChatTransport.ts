import { useMemo, useRef } from 'react';
import { DefaultChatTransport } from 'ai';

interface UseChatTransportOptions {
  selectedModel: string | null;
  selectedPhilosophers: string[];
  /** Scopes agent tools (e.g. research notes) to this conversation */
  conversationId: string | null;
}

/**
 * Creates a chat transport that dynamically uses the latest model and philosopher selections.
 * Uses refs internally to ensure the transport body always reads current values.
 */
export function useChatTransport({
  selectedModel,
  selectedPhilosophers,
  conversationId,
}: UseChatTransportOptions) {
  // Use refs to capture latest values
  const selectedModelRef = useRef(selectedModel);
  const selectedPhilosophersRef = useRef(selectedPhilosophers);
  const conversationIdRef = useRef(conversationId);

  // Keep refs in sync with props
  selectedModelRef.current = selectedModel;
  selectedPhilosophersRef.current = selectedPhilosophers;
  conversationIdRef.current = conversationId;

  // Create transport once - body function reads from refs
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/agent',
        headers: (): Record<string, string> => {
          const token = localStorage.getItem('auth_token');
          const headers: Record<string, string> = {};
          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }
          return headers;
        },
        body: () => {
          const philosophers = selectedPhilosophersRef.current;
          return {
            // Send array if multiple, single string if one, null if none
            philosopherIds:
              philosophers.length === 0
                ? null
                : philosophers.length === 1
                  ? philosophers[0]
                  : philosophers,
            modelId: selectedModelRef.current,
            conversationId: conversationIdRef.current ?? undefined,
          };
        },
      }),
    []
  );

  return transport;
}
